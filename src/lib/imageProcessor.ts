declare const ort: any;

const MODEL_INPUT_SIZE = 512;
const OUTPUT_FORMAT = 'image/png';
const OUTPUT_QUALITY = 1.0;

export function preprocessImageWithMask(imageData: ImageData, maskImageData: ImageData) {
  const { width, height, data } = imageData;
  const float32Data = new Float32Array(3 * width * height);
  for (let i = 0; i < width * height; i++) {
    float32Data[i] = data[i * 4] / 255.0;
    float32Data[width * height + i] = data[i * 4 + 1] / 255.0;
    float32Data[2 * width * height + i] = data[i * 4 + 2] / 255.0;
  }
  const imageTensor = new ort.Tensor('float32', float32Data, [1, 3, height, width]);
  const maskData = new Float32Array(width * height);
  for (let i = 0; i < width * height; i++) {
    maskData[i] = maskImageData.data[i * 4] > 128 ? 1.0 : 0.0;
  }
  const maskTensor = new ort.Tensor('float32', maskData, [1, 1, height, width]);
  return { imageTensor, maskTensor };
}

export function postprocessImage(outputTensor: any, width: number, height: number): ImageData {
  const data = outputTensor.data;
  const rgbaData = new Uint8ClampedArray(width * height * 4);
  let maxVal = 0;
  const sampleSize = Math.min(1000, data.length / 3);
  for (let i = 0; i < sampleSize; i++) maxVal = Math.max(maxVal, Math.abs(data[i]));
  const isNormalized = maxVal <= 2.0;
  for (let i = 0; i < width * height; i++) {
    let r = data[i];
    let g = data[width * height + i];
    let b = data[2 * width * height + i];
    if (isNormalized) { r *= 255; g *= 255; b *= 255; }
    rgbaData[i * 4] = Math.min(255, Math.max(0, Math.round(r)));
    rgbaData[i * 4 + 1] = Math.min(255, Math.max(0, Math.round(g)));
    rgbaData[i * 4 + 2] = Math.min(255, Math.max(0, Math.round(b)));
    rgbaData[i * 4 + 3] = 255;
  }
  return new ImageData(rgbaData, width, height);
}

export function composeFinalImageWithMask(
  originalBitmap: ImageBitmap,
  processedImageData: ImageData,
  maskImageData: ImageData
): string {
  const { width: origWidth, height: origHeight } = originalBitmap;
  const processedSize = MODEL_INPUT_SIZE;

  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = origWidth; finalCanvas.height = origHeight;
  const finalCtx = finalCanvas.getContext('2d', { willReadFrequently: true })!;
  finalCtx.drawImage(originalBitmap, 0, 0);
  const originalImageData = finalCtx.getImageData(0, 0, origWidth, origHeight);

  const processedCanvas = document.createElement('canvas');
  processedCanvas.width = processedSize; processedCanvas.height = processedSize;
  processedCanvas.getContext('2d')!.putImageData(processedImageData, 0, 0);

  const scaledCanvas = document.createElement('canvas');
  scaledCanvas.width = origWidth; scaledCanvas.height = origHeight;
  const scaledCtx = scaledCanvas.getContext('2d', { willReadFrequently: true })!;
  scaledCtx.drawImage(processedCanvas, 0, 0, origWidth, origHeight);
  const scaledProcessedData = scaledCtx.getImageData(0, 0, origWidth, origHeight);

  const maskCanvas = document.createElement('canvas');
  maskCanvas.width = processedSize; maskCanvas.height = processedSize;
  maskCanvas.getContext('2d')!.putImageData(maskImageData, 0, 0);

  const scaledMaskCanvas = document.createElement('canvas');
  scaledMaskCanvas.width = origWidth; scaledMaskCanvas.height = origHeight;
  const scaledMaskCtx = scaledMaskCanvas.getContext('2d', { willReadFrequently: true })!;
  scaledMaskCtx.drawImage(maskCanvas, 0, 0, origWidth, origHeight);
  const scaledMaskData = scaledMaskCtx.getImageData(0, 0, origWidth, origHeight);

  for (let i = 0; i < origWidth * origHeight; i++) {
    if (scaledMaskData.data[i * 4] > 128) {
      originalImageData.data[i * 4] = scaledProcessedData.data[i * 4];
      originalImageData.data[i * 4 + 1] = scaledProcessedData.data[i * 4 + 1];
      originalImageData.data[i * 4 + 2] = scaledProcessedData.data[i * 4 + 2];
    }
  }

  finalCtx.putImageData(originalImageData, 0, 0);
  return finalCanvas.toDataURL(OUTPUT_FORMAT, OUTPUT_QUALITY);
}

export function resizeImageForModel(bitmap: ImageBitmap): ImageData {
  const size = MODEL_INPUT_SIZE;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(bitmap, 0, 0, size, size);
  return ctx.getImageData(0, 0, size, size);
}
