export interface MetaInfo {
  label: string;
  value: string;
  type: string;
}

export const MetadataCleaner = {
  async clean(dataUrl: string, originalFile: File): Promise<string> {
    try {
      const mimeType = originalFile ? originalFile.type : 'image/png';
      if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
        return await this.cleanJpeg(dataUrl);
      } else {
        return await this.cleanPng(dataUrl);
      }
    } catch (e) {
      console.warn('Metadata clean failed (returning as-is):', e);
      return dataUrl;
    }
  },

  async cleanJpeg(dataUrl: string): Promise<string> {
    const binary = atob(dataUrl.split(',')[1]);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const cleaned = this._stripJpegMetadata(bytes);
    return this._uint8ToDataUrl(cleaned, 'image/jpeg');
  },

  _stripJpegMetadata(bytes: Uint8Array): Uint8Array {
    if (bytes[0] !== 0xFF || bytes[1] !== 0xD8) return bytes;
    const result: number[] = [0xFF, 0xD8];
    let i = 2;
    while (i < bytes.length) {
      if (bytes[i] !== 0xFF) { i++; continue; }
      const marker = bytes[i + 1];
      if (marker === 0xDA) {
        for (let j = i; j < bytes.length; j++) result.push(bytes[j]);
        break;
      }
      const len = (bytes[i + 2] << 8) | bytes[i + 3];
      const isApp0Jfif = marker === 0xE0 && bytes[i + 4] === 0x4A && bytes[i + 5] === 0x46;
      const isMetadata = (marker >= 0xE1 && marker <= 0xEF) || marker === 0xFE;
      if (isMetadata && !isApp0Jfif) {
        i += 2 + len;
      } else {
        for (let j = i; j < i + 2 + len; j++) result.push(bytes[j]);
        i += 2 + len;
      }
    }
    return new Uint8Array(result);
  },

  async cleanPng(dataUrl: string): Promise<string> {
    const binary = atob(dataUrl.split(',')[1]);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const cleaned = this._stripPngMetadata(bytes);
    return this._uint8ToDataUrl(cleaned, 'image/png');
  },

  _stripPngMetadata(bytes: Uint8Array): Uint8Array {
    const sig = [137, 80, 78, 71, 13, 10, 26, 10];
    const result: number[] = [...sig];
    const stripTypes = new Set([
      'tEXt', 'iTXt', 'zTXt', 'eXIf', 'iCCP',
      'sRGB', 'gAMA', 'bKGD', 'hIST', 'sBIT',
      'tIME', 'pHYs', 'sPLT',
    ]);
    let i = 8;
    while (i < bytes.length) {
      const len = (bytes[i] << 24) | (bytes[i + 1] << 16) | (bytes[i + 2] << 8) | bytes[i + 3];
      const type = String.fromCharCode(bytes[i + 4], bytes[i + 5], bytes[i + 6], bytes[i + 7]);
      const chunkTotal = 4 + 4 + len + 4;
      if (type === 'IEND') {
        for (let j = i; j < i + chunkTotal; j++) result.push(bytes[j]);
        break;
      }
      if (stripTypes.has(type)) { i += chunkTotal; continue; }
      for (let j = i; j < i + chunkTotal; j++) result.push(bytes[j]);
      i += chunkTotal;
    }
    return new Uint8Array(result);
  },

  _uint8ToDataUrl(bytes: Uint8Array, mime: string): string {
    let binary = '';
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return `data:${mime};base64,` + btoa(binary);
  },

  async extractInfo(file: File): Promise<MetaInfo[]> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const bytes = new Uint8Array(e.target!.result as ArrayBuffer);
        const info: MetaInfo[] = [];

        // JPEG
        if (bytes[0] === 0xFF && bytes[1] === 0xD8) {
          let i = 2;
          while (i < bytes.length - 4) {
            if (bytes[i] !== 0xFF) { i++; continue; }
            const marker = bytes[i + 1];
            if (marker === 0xDA) break;
            const len = (bytes[i + 2] << 8) | bytes[i + 3];
            if (marker === 0xE1) {
              const seg = String.fromCharCode(...Array.from(bytes.slice(i + 4, i + 10)));
              if (seg.startsWith('Exif')) info.push({ label: 'EXIF', value: `${len} байт данных`, type: 'exif' });
              else if (seg.startsWith('http:')) info.push({ label: 'XMP', value: `${len} байт данных`, type: 'xmp' });
              else info.push({ label: 'APP1', value: `${len} байт`, type: 'app' });
            }
            if (marker === 0xE2) info.push({ label: 'ICC Profile', value: `${len} байт`, type: 'icc' });
            if (marker === 0xED) info.push({ label: 'Photoshop/IPTC', value: `${len} байт данных`, type: 'iptc' });
            if (marker === 0xFE) info.push({ label: 'Комментарий', value: `${len} байт`, type: 'comment' });
            i += 2 + len;
          }
        }

        // PNG
        if (bytes[0] === 137 && bytes[1] === 80) {
          let i = 8;
          while (i < bytes.length - 12) {
            const len = (bytes[i] << 24) | (bytes[i + 1] << 16) | (bytes[i + 2] << 8) | bytes[i + 3];
            const type = String.fromCharCode(bytes[i + 4], bytes[i + 5], bytes[i + 6], bytes[i + 7]);
            if (type === 'IEND') break;
            if (['tEXt', 'iTXt', 'zTXt'].includes(type)) {
              let keyEnd = i + 8;
              while (keyEnd < bytes.length && bytes[keyEnd] !== 0) keyEnd++;
              const key = String.fromCharCode(...Array.from(bytes.slice(i + 8, keyEnd)));
              info.push({ label: type + ': ' + key, value: `${len} байт`, type: 'text' });
            }
            if (type === 'eXIf') info.push({ label: 'PNG EXIF', value: `${len} байт`, type: 'exif' });
            if (type === 'iCCP') info.push({ label: 'ICC Profile', value: `${len} байт`, type: 'icc' });
            if (type === 'tIME') info.push({ label: 'Время создания', value: 'метаданные', type: 'time' });
            i += 4 + 4 + len + 4;
          }
        }

        info.push({ label: 'SynthID', value: 'Цифровой водяной знак Google', type: 'synthid' });
        info.push({ label: 'Генеративные метаданные', value: 'AI-сигнатуры ИИ', type: 'ai' });
        resolve(info);
      };
      reader.readAsArrayBuffer(file);
    });
  },
};
