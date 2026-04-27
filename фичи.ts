
// ============================================================
// FILE: src/LogicDefines.ts
// ============================================================

export class LogicDefines {
    static isPlatformIOS(): boolean {
        return Process.platform == "darwin";
    }

    static isPlatformAndroid(): boolean {
        return Process.platform == "linux";
    }

    static toString(): string {
        return `${this.isPlatformAndroid() ? "Android" : "iOS"} ${Process.arch.toUpperCase()}`;
    }
}

// ============================================================
// FILE: src/gene/BattleDebug.ts
// ============================================================
import {DebugBattleButton} from "./debug/DebugBattleButton";
import {Sprite} from "../titan/flash/Sprite";
import {LogicVersion} from "../logic/LogicVersion";
import {Configuration} from "./Configuration";

export class BattleDebug {
    public debugButtons: DebugBattleButton[] = [];

    public update(deltaTime: number) {
        this.debugButtons.forEach(function (button) {
            button.visibility = Configuration.showBattleShortcuts;
        });
    }

    public spawnButtons() {
        this.debugButtons = [];

        this.debugButtons.push(new DebugBattleButton("3D", "CAMERA_MODE", 0));
        this.debugButtons.push(new DebugBattleButton("AMT", "BATTLE", 75));
    }

    public drawButtons(combatHUD: NativePointer) {
        this.spawnButtons();
        this.debugButtons.forEach(function (button) {
            Sprite.addChild(combatHUD, button.instance);
        });
    }
}
// ============================================================
// FILE: src/gene/Configuration.ts
// ============================================================
import {Path} from "../titan/Path";
import {Constants} from "./Constants";
import {NCoder} from "./networking/NetworkManager";

const DO_NOT_SAVE_KEYS = [
    "isChinaVersion",
    "braille", "braille_textfield"
];

export class Configuration {
    // static [name]: [type] = [defaultValue (optional)]
    static useProxy: boolean;
    static useStage: boolean;

    static key: string;
    static validKey: string = Constants.UNAVAILABLE_KEY_STRING;
    static nonce: string;

    static showSidemask: boolean = true;
    static emoteAnimation: boolean = true;
    static drawOutline: boolean = true;
    static showDebugItems: boolean = true;
    static showLobbyInfo: boolean = true;
    static contentCreatorBoost: boolean = true;
    static specialOffers: boolean = true;
    static heroSounds: boolean = true;
    static showUlti: boolean = true;
    static showName: boolean = true;
    static showTags: boolean = true;
    static showBotPrefix: boolean = false;

    static fakePremiumPass: boolean;
    static showFutureEvents: boolean;
    static slowMode: boolean;
    static staticBackground: boolean;
    static showConnectionIndicator: boolean;
    static darkTheme: boolean;
    static isChinaVersion: boolean;
    static antiOutOfSync: boolean;
    static hideBattleState: boolean;
    static autoPlayAgain: boolean;
    static autoExitAfterBattle: boolean;
    static skipReplayIntro: boolean;
    static antiAFK: boolean;
    static moveToTarget: boolean;
    static autoAim: boolean;
    static holdToShoot: boolean;
    static autoUlti: boolean;
    static autoOvercharge: boolean;
    static autoDodge: boolean;
    static movementBasedAutoshoot: boolean;
    static skipBattleEndReplay: boolean;
    static moveToAlly: boolean;
    static skinChanger: boolean = false;
    static skinChangerOnline: boolean = false;
    static themeId: number = -1;
    static themeMusicId: number = -1;
    static useLegacyThemeMode: boolean = false;
    static hideHeroesIntro: boolean = false;
    static useOldIntro: boolean = false;
    static hideLeagueBattleCard: boolean = false;
    static showEnemyAmmo: boolean = false;
    static skipRandomAnimation: boolean = false;
    static battleCammeraMode: number = 0;
    static autoReady: boolean;
    static alpha: number = 100;
    static opacity: number = 100;
    static stopLolaClone: boolean = false;
    static lolaControlState: number = 0; // 0 - both, 1 - only lola, 2 - only clone
    static kitMoveHack: boolean = false;
    static antiProfanity: boolean = false;
    static showEditControls: boolean = false;
    static showBattleShortcuts: boolean = false;
    static antiknockback: boolean = false;
    static showTicks: boolean = false;
    static enableProtective: boolean = false;

    //
    static udpConnectionAddress: string;
    static showSVOButton: boolean = false;

    static preferredStatus: number = -1;
    static lastChangelogVersionSeen: number = -1;


    // Useful Info
    static showFPS: boolean;
    static showCurrentTime: boolean;
    static showSessionTime: boolean;
    static showBattlePing: boolean;
    static showTeam: boolean;
    static showBattleInfo: boolean;
    static showChatButton: boolean;

    // Battle servers
    static regionId: number = -1;

    // skinChanger
    static skinChangerObjects: { [key: number]: number; } = {};

    // Visual name
    static accountNames: { [key: string]: string; } = {};

    // Braille
    /**
     * самая лучшая фича, после добавления которой продажи вырастут на 1200%
     */
    static braille: boolean;
    static braille_textfield: boolean;

    static markFakeNinja: boolean;
    static cameraRotateY: number = 4000.0;
    static cameraY: number = 300.0;
    static cameraX: number = 0.0;
    static cameraAlign: number = 0.0;
    static cameraRotateX: number = 0.0;
    static cameraDistance: number = 0.0;
    static cameraZ: number = 0.0;

    static currentUserThemeSet: string = "";

    static snowTheme: boolean;

    static load() {
        let path = Path.getDataPath() + "settings.json";
        try {
            let json = File.readAllText(path);

            let decryptedJson = JSON.parse(NCoder.n2s(json));

            for (let key in decryptedJson) {
                (<any>this)[key] = decryptedJson[key];
            }
        } catch (e) {
            console.log(e);
        }

        Configuration.braille = false;
        Configuration.isChinaVersion = false;
        Configuration.braille_textfield = false;

        console.log("Configuration.load:", `Loaded ${Object.keys(this).length} values!`);
    }

    static writeToFile(filepath: string, mode: string, content: string) {
        let file = new File(filepath, mode);
        file.write(content);
        file.close();
    }

    static save() {
        let path = Path.getDataPath() + "settings.json";
        let json = this.toJSON();

        let encryptedJson = JSON.stringify(NCoder.s2n(json));

        this.writeToFile(path, "w", encryptedJson);

        console.log("Configuration.save:", "saved successfully!");
    }

    static toJSON(): string {
        let dictionary: { [key: string]: any; } = {};

        for (let key of Object.keys(this)) {
            if (DO_NOT_SAVE_KEYS.includes(key)) {
                //console.log("Configuration::toJSON:", `skip ${key}`);
                continue;
            }

            dictionary[key] = (<any>this)[key];
        }

        return JSON.stringify(dictionary);
    }
}
// ============================================================
// FILE: src/gene/Constants.ts
// ============================================================
export class Constants {
    static POPUPBASE_PATCH_DISALLOWED_REPLACEMENTS = ['Brawlbox_info_popup', 'gatcha_screen_hud_noBox', 'random_reward_opening', 'seasonend_popup', 'team_up_popup', 'create_name_popup', 'age_gate_dialog', 'age_gate_number_pad_dialog'];
    static DARK_THEME_REPLACEMENT = "Arcade"; // Replace if disabled
    static DARK_THEME_SHOWDOWN_REPLACEMENT = "ArcadeShowdown";

    static UNAVAILABLE_KEY_STRING = "unavailable :(";

    static ANTIPROFANITY_BYTES = "\uFE00";

    static IMAGE_FORMAT_REGEX: RegExp = /\.(png|jp[e]?g)$/i;
    static USER_IMAGES_DIR = "image/user_images/";

    static COMBATHUD_ALPHA_OFFSETS: number[] = [
        888 // virtuastick_move_bg
        //896, // virtuastick_move_stick
        //904, // virtuastick_attack_bg
        //984, // special_shot
        //912, // virtuastick_attack_stick
        //936, // movement_dot
        //1032, // virtuastick_ulti_bg ?
        //920, // virtuastick_ulti_bg ?
        //1448, //emote ?
        //1432 // overcharge_button

        /*912,
        928, // ulti_stick
        // 352,
        // 1240
        1424, // button_use_item
        944, // button_use_item*/
    ];
}
// ============================================================
// FILE: src/gene/Debug.ts
// ============================================================
import {GameMain} from "../laser/client/GameMain";
import {DebugButton} from "./debug/DebugButton";
import {DebugInfo} from "./debug/DebugInfo";
import {DebugMenu} from "./debug/DebugMenu";
import {DisplayObject} from "../titan/flash/DisplayObject";
import {DebugHud} from "./debug/DebugHud";
import {UsefulInfo} from "./features/UsefulInfo";
import {LogicVersion} from "../logic/LogicVersion";
import {Hamster} from "./features/Hamster";
import {LatencyManager} from "../laser/client/network/LatencyManager";
import {Configuration} from "./Configuration";
import {GUI} from "../titan/flash/gui/GUI";
import {SoundManager} from "../titan/sound/SoundManager";
import {LogicDataTables} from "../logic/data/LogicDataTables";
import {Application} from "../titan/utils/Application";
import {LocalizationManager} from "./localization/index";
import {Resources} from "./Resources";
import {GameStateManager} from "../laser/client/state/GameStateManager";
import {LobbyInfo} from "./features/LobbyInfo";
import {HamsterScreen} from "./popups/HamsterScreen";
import {SVOButton} from "./debug/SVOButton";
import {Storage} from "./Storage";
import {Constants} from "./Constants";
import {OpenChatButton} from "./debug/OpenChatButton";
import {BattleSettingsPopup} from "./popups/BattleSettingsPopup";
import {SpeechCharacter} from "./popups/SpeechCharacter";
import {HomeScreen} from "../logic/home/HomeScreen";
import {BattleDebug} from "./BattleDebug";
import {MessageManager} from "../laser/client/network/MessageManager";
import {UserImagesScreen} from "./popups/UserImagesScreen";
import {Filesystem} from "./features/filesystem";
import {Path} from "../titan/Path";

export class Debug {
    private static debugMenu?: DebugMenu;
    private static debugButton?: DebugButton;
    private static battleDebug?: BattleDebug;
    private static SVOButton?: SVOButton;
    private static openChatButton?: OpenChatButton;
    private static debugInfo?: DebugInfo;
    private static debugHud?: DebugHud;
    private static lobbyInfo?: LobbyInfo;
    private static hamsterScreen?: HamsterScreen;
    private static userImagesScreen?: UserImagesScreen;
    private static hamster?: Hamster;
    private static battleSettingsPopup?: BattleSettingsPopup;
    private static latencyTestsAdded: boolean;
    private static resourcesLoaded: boolean;

    private static enforceOpenNewHamsterMenu: boolean = true;
    static isGeneAssetsPreloaded: boolean = false;

    private static displayObjectQueue: DisplayObject[] = [];

    static addResourcesToLoad() {
        if (!this.resourcesLoaded) {
            try {
                Resources.loadList.map((asset: string) => {
                    try {
                        if (Filesystem.doesFileExist(Path.getUpdatePath() + asset)) {
                            GameMain.loadAsset(asset);
                        }
                        else {
                            if (Filesystem.doesFileExist(Path.getResourcePath() + asset)) {
                                GameMain.loadAsset(asset);
                            }
                            else {
                                console.warn("Debug.addResourcesToLoad:", "not exist:", asset);
                            }
                        }
                    } catch (e) {
                        console.warn("Debug.addResourcesToLoad:", "failed to load", asset);
                    }
                });
            } catch (e) {
                console.warn("Debug.addResourcesToLoad:", "failed to load resources!");
            }

            this.resourcesLoaded = true;
        }
    }

    static update(deltaTime: number) {
        if (this.debugMenu) {
            this.debugMenu.update(deltaTime);

            if (!this.latencyTestsAdded) {
                if (LatencyManager.latencyTestsDone() && MessageManager.getLatencyTests().length > 0) {
                    console.log("LatencyManager: tests are done, add servers to debug menu");

                    LatencyManager.addServersToDebugMenu(this.debugMenu);

                    this.latencyTestsAdded = true;
                }
            }
        }

        if (this.debugHud) {
            const usefulInfoState = UsefulInfo.canBeUpdated();

            if (usefulInfoState !== this.debugHud.getShowMessageState()) {
                this.debugHud.showMessages(usefulInfoState);
            }

            // fix useful info drawing same value and not updating  when its completely disabled
            UsefulInfo.update();

            this.debugHud.draw();
        }

        if (this.displayObjectQueue.length > 0) {
            let gameSprite = GameMain.getGameSprite();

            this.displayObjectQueue.forEach((child) => {
                gameSprite.addChild(child);
            });

            this.displayObjectQueue = [];
        }

        if (GameStateManager.isHomeMode()) {
            LatencyManager.update();
        }

        this.lobbyInfo?.update();
        this.battleSettingsPopup?.update(deltaTime);

        Storage.dvd.filter(e => e.createdOnStage).forEach(e => e.update());

        // TODO: don't forget to remove strip block when it's complete.
        /// #if DEBUG
        this.hamsterScreen?.update(deltaTime);

        if (this.hamster) {
            this.hamster.encountEnergyRestorationAmount();
        }

        // 11/30/2025 10:59 PM:
        // why is this part of the code under the DEBUG strip block?
        // wasn't this already a feature?
        if (this.openChatButton) {
            this.openChatButton.visibility = Configuration.showChatButton;
        }

        this.userImagesScreen?.update(deltaTime);
        /// #endif
    }

    static hideDebugItems() {
        this.debugButton?.hide();
        this.debugMenu?.hide();
        this.debugHud?.showMessages(false);
        this.debugInfo?.hide();

        Configuration.showDebugItems = false;
        Configuration.save();
    }

    static showDebugItems() {
        this.debugButton?.show();

        Configuration.showDebugItems = true;
        Configuration.save();
    }

    static createDebugInfo(): DebugInfo {
        Debug.debugInfo = new DebugInfo();

        return Debug.debugInfo;
    }

    static createSpeechCharacter(text: string): SpeechCharacter {
        return new SpeechCharacter(text);
    }

    static create() {
        try {
            this.destruct(); // To make sure old debug menu doesn't exist

            this.displayObjectQueue = [];

            this.spawnLobbyInfo();
            this.spawnDebugButton();
            this.spawnDebugBattle();
            //this.spawnSVOButton();
            this.spawnOpenChatButton();
            this.spawnDebugMenu();
            this.spawnDebugHud();
            this.spawnBattleSettings();

            //this.storeReloadData();

            console.log("Debug::create", "success!");
        } catch (e: any) {
            console.log(e.stack);
        }
    }

    private static spawnDebugBattle() {
        this.battleDebug = new BattleDebug();
        console.log("Debug.spawnDebugBattle");
    }

    private static spawnDebugButton() {
        this.debugButton = new DebugButton();

        this.displayObjectQueue.push(this.debugButton);

        console.log("Debug.spawnDebugButton:", "spawned debug button at " + this.debugButton.x + "," + this.debugButton.y);
    }

    private static spawnSVOButton() {
        this.SVOButton = new SVOButton();

        this.displayObjectQueue.push(this.SVOButton);
    }

    private static spawnOpenChatButton() {
        this.openChatButton = new OpenChatButton();

        this.displayObjectQueue.push(this.openChatButton);
    }

    private static spawnDebugMenu() {
        this.debugMenu = new DebugMenu();
        this.debugMenu.hide();

        this.displayObjectQueue.push(this.debugMenu);
    }

    private static spawnDebugHud() {
        this.debugHud = new DebugHud();
        this.debugHud.showMessages(true);
    }

    private static spawnBattleSettings() {
        this.battleSettingsPopup = new BattleSettingsPopup();
        this.battleSettingsPopup.hide();

        this.displayObjectQueue.push(this.battleSettingsPopup);
    }

    private static spawnUserImagesScreen() {
        this.userImagesScreen = new UserImagesScreen();
    }

    private static storeReloadData() {
        /// #if DEBUG
        if (LogicVersion.isDeveloperBuild()) {

            this.debugHud!.addMessage("Gene Brawl DEV Build");
        }
        /// #endif
    }

    private static spawnLobbyInfo() {
        this.lobbyInfo = new LobbyInfo();
        this.lobbyInfo.showInfo(true);

        GameMain.getHomeSprite().addChildAt(this.lobbyInfo, 0);
    }

    static toggleDebugButtonPressed() {
        if (this.debugInfo?.visibility) {
            this.debugInfo?.hide();
        }

        this.debugMenu?.toggle();
        console.log(this.debugMenu);
        if (this.hamster?.visibility) {
            this.hamster?.toggle();
        }

        if (this.battleSettingsPopup?.visibility) {
            this.battleSettingsPopup?.toggle();
        }
    }

    static setupSpeechCharacter() {
        const speechCharacter = this.createSpeechCharacter(LocalizationManager.getString("NEED_TO_ACTIVATE").replace("$KEY", Configuration.validKey));
        //if (shouldHide) speechCharacter?.hideAfter(3)
        GameMain.getHomeSprite().addChild(speechCharacter);

        return speechCharacter;
    }

    static toggleUserImagesButtonPressed() {
        this.userImagesScreen = new UserImagesScreen();

        this.userImagesScreen.setXy();

        GUI.showPopup(this.userImagesScreen.instance, 0, 0, 0);
    }

    static toggleDebugClickerButtonPressed() {
        if (!LogicVersion.isDeveloperBuild()) {
            const music = LogicDataTables.getMusicByName("Godzilla_Ingame"); // fuck this shit ass
            SoundManager.playMusic(music);
            return;
        }

        /// #if DEBUG
        if (this.enforceOpenNewHamsterMenu) {
            this.hamsterScreen = new HamsterScreen();

            this.hamsterScreen.setXy();

            GUI.showPopup(this.hamsterScreen.instance, 0, 0, 0);

            Debug.toggleDebugButtonPressed();
            return;
        }

        if (this.hamster) {
            this.hamster.toggle();
        }

        if (!this.hamster) {
            this.hamster = new Hamster();

            GameMain.getGameSprite().addChild(this.hamster);

        }
        /// #endif
    }

    static toggleSetAlphaButtonClicked() {
        this.battleSettingsPopup?.toggle();

        if (!this.battleSettingsPopup) {
            this.battleSettingsPopup = new BattleSettingsPopup();

            GameMain.getGameSprite().addChild(this.battleSettingsPopup);
        }
    }

    static getDebugButton(): DebugButton {
        return this.debugButton!;
    }

    static getBattleDebug(): BattleDebug {
        return this.battleDebug!;
    }

    static getSVOButton(): SVOButton {
        return this.SVOButton!;
    }

    static getOpenChatButton(): OpenChatButton {
        return this.openChatButton!;
    }

    static getDebugMenu(): DebugMenu {
        return this.debugMenu!;
    }

    static getHamster(): Hamster {
        return this.hamster!;
    }

    static getDebugHud(): DebugHud {
        return this.debugHud!;
    }

    static getHamsterScreen(): HamsterScreen {
        return this.hamsterScreen!;
    }

    static getLobbyInfo(): LobbyInfo {
        return this.lobbyInfo!;
    }

    static getAlphaPopup(): BattleSettingsPopup {
        return this.battleSettingsPopup!;
    }

    static getUserImagesScreen(): UserImagesScreen {
        return this.userImagesScreen!;
    }

    static destruct() {
        if (!this.debugButton) {
            return;
        }

        this.debugButton.hide();
        GameMain.getGameSprite().removeChild(this.debugButton);
        this.debugButton = undefined;

        if (this.debugMenu) {
            this.debugMenu.hide();
            GameMain.getGameSprite().removeChild(this.debugMenu);

            this.debugMenu.destruct();
            this.debugMenu = undefined;
        }

        if (this.debugHud) {
            this.debugHud.showMessages(false);
            this.debugHud.destruct();
            this.debugHud = undefined;
        }

        if (this.debugInfo) {
            this.debugInfo.hide();

            GameMain.getGameSprite().removeChild(this.debugInfo);

            this.debugInfo.destruct();
        }

        if (this.lobbyInfo) {
            this.lobbyInfo.hide();

            GameMain.getHomeSprite().removeChild(this.lobbyInfo);

            this.lobbyInfo = undefined;
        }

        if (this.battleSettingsPopup) {
            this.battleSettingsPopup.hide();

            GameMain.getGameSprite().removeChild(this.battleSettingsPopup);

            this.battleSettingsPopup.destruct();
        }
    }
}
// ============================================================
// FILE: src/gene/GeneAssets.ts
// ============================================================
import {Path} from "../titan/Path";
import {DownloadedImage} from "../titan/flash/DownloadedImage";
import {HttpClient} from "./features/HttpClient/index";
import {Filesystem} from "./features/filesystem/index";
import {LogicVersion} from "../logic/LogicVersion";
import {Application} from "../titan/utils/Application";
import {NativeDialog} from "../titan/utils/NativeDialog";
import {NativeHTTPClient} from "../titan/utils/NativeHTTPClient";
import {LogicDefines} from "../LogicDefines";

interface IAssignments {
    [key: string]: IAssignment;
}

interface IAssignment {
    path: string,
    url: string;
}

export class GeneAssets {
    static assignments: IAssignments = {};
    static loaded: string[] = [];
    static downloaded: string[] = [];

    static init() {
        GeneAssets.initAssignments();
        GeneAssets.preloadAssets();
    }

    private static initAssignments() {
        GeneAssets.createAssignment("WHEELCHAIR", {
            path: "image/wheelchair.png",
            url: "http://cloud.mysticte.ch/storage/09a66dbfbbdf14075d25fff527dee6e4a8274d614dcb6bbf/wheel.png"
        });

        GeneAssets.createAssignment("BG_GENEBRAWL", {
            path: "sc/background_genebrawl.sc",
            url: "http://cloud.mysticte.ch/storage/09a66dbfbbdf14075d25fff527dee6e4a8274d614dcb6bbf/background_genebrawl.sc"
        });

        GeneAssets.createAssignment("BG_GENEBRAWL_TEX", {
            path: "sc/background_genebrawl_tex.sc",
            url: "http://cloud.mysticte.ch/storage/09a66dbfbbdf14075d25fff527dee6e4a8274d614dcb6bbf/background_genebrawl_tex.sc"
        });

        if (LogicVersion.isDeveloperBuild())
            GeneAssets.createAssignment("CUSTOM_BG", {
                path: "image/background.png",
                url: ""
            });
    }

    private static createAssignment(name: string, data: IAssignment) {
        GeneAssets.assignments[name] = data;
    }

    private static preloadAssets() {
        for (const key in GeneAssets.assignments) {
            const file = GeneAssets.assignments[key];
            const path = Path.getUpdatePath() + file.path;
            console.log(path, Filesystem.doesFileExist(path));
            if (!Filesystem.doesFileExist(path) && file.url != "") {
                if (LogicDefines.isPlatformIOS()) { //not working on Android

                    const splitPath = path.split("/");
                    Filesystem.createDirectoryIfNotExist(Path.getUpdatePath() + splitPath[splitPath.length - 2] + "/");

                    GeneAssets.downloadAssetNative(file.url, path);
                    GeneAssets.downloaded.push(file.path);
                }
                else {
                    GeneAssets.downloadAsset(file.url).then((response) => {
                        if (response.getStatusCode() !== 200) {
                            console.warn("GeneAssets.preloadAssets:", "Server thrown", response.getStatusCode(), "code when tried to download", file.path, "asset. Skipping it!");
                            NativeDialog.showNativeDialog(NULL, "Error", `Failed to load ${file.path} asset from server. Status code: ${response.getStatusCode()}`, "OK");
                            return;
                        }

                        const body = response.getBody();
                        Filesystem.writeToFile(path, body);

                        console.log("GeneAssets.preloadAssets: Downloaded asset", file.path.split("/").slice(-1)[0]);

                        GeneAssets.downloaded.push(file.path);
                    });
                }
            } else {
                GeneAssets.downloaded.push(file.path);
            }
        }
    }

    static getAsset(assetName: string) {
        if (!GeneAssets.assignments[assetName]) {
            throw new Error("No image defined! Please put it into GeneAssets.createAssignment!");
        }

        const assignment = GeneAssets.assignments[assetName];

        if (GeneAssets.wasLoaded(assignment.path)) {
            console.warn("GeneAssets.getAsset:", assignment.path, "wasn't loaded successfully!");
        }

        const image = new DownloadedImage(Path.getUpdatePath() + assignment.path);

        return image;
    }

    static wasLoaded(file: string) {
        return GeneAssets.loaded.includes(file);
    }

    static wasDownloaded(file: string) {
        return GeneAssets.downloaded.includes(file);
    }

    private static downloadAsset(url: string) {
        const client = new HttpClient();

        return client.sendRequest(url, "GET", {
            'User-Agent': `Gene Brawl ${LogicVersion.scriptEnvironment.toUpperCase()}/${LogicVersion.toDebugString()} (${Application.getDeviceType()})`
        });
    }

    private static downloadAssetNative(url: string, path: string) {
        const nativeHttpClient = new NativeHTTPClient();
      //  nativeHttpClient.downloadFile(url, path);

        console.log("[*] downloading", url, "to", path);
    }
}
// ============================================================
// FILE: src/gene/PromonBreaker.ts
// ============================================================

export class PromonBreaker {
    static patch() {
         // that's the part you have to figure out yourself.
    }
}
// ============================================================
// FILE: src/gene/Resources.ts
// ============================================================
export class Resources {
    static DEBUG = "sc/debug.sc";
    static GENE_DEBUG = "sc/background_genebrawl.sc";
    static UI = "sc/ui.sc";
    static OLD_UI = "sc/old_ui.sc";
    static EMOJI = "sc/emoji.sc";

    static loadList: Array<string> = [
        // Resources.OLD_UI,
        Resources.DEBUG,
        Resources.GENE_DEBUG
        //"badge/default_diffuse.png"
    ];
}
// ============================================================
// FILE: src/gene/Storage.ts
// ============================================================
import {GlobalID} from "../logic/data/GlobalID";
import {PopupBase} from "../titan/flash/gui/PopupBase";
import {DVD} from "./features/DVD";

export class Storage {
    static popups: PopupBase[] = [];
    static serverThemeId: number = GlobalID.createGlobalID(41, 0);
    static dvd: DVD[] = [];

    static freePopups() {
        Storage.popups = [];
    }

    static addPopup(popup: PopupBase) {
        Storage.popups = Storage.popups.filter(e => e.constructor !== popup.constructor);
        Storage.popups.push(popup);
    }

    static getPopup(popup: PopupBase) {
        return Storage.popups.find(e => e.constructor === popup.constructor);
    }

    static removePopupByInstance(instance: NativePointer) {
        Storage.popups = Storage.popups.filter(e => !e.instance.equals(instance));
    }
}
// ============================================================
// FILE: src/gene/TestCase.ts
// ============================================================
import {GUI} from "../titan/flash/gui/GUI";
import {INativeDialogListener} from "../titan/utils/INativeDialogListener";
import {NativeDialog} from "../titan/utils/NativeDialog";
import {RGBA} from "./features/RGBA";
import {BlackListScreen} from "./popups/BlackListScreen";

const libc = Module.getGlobalExportByName('opendir');
const readdir = Module.getGlobalExportByName('readdir');
const closedir = Module.getGlobalExportByName('closedir');

export class TestCase {
    static async doCase() {
        // Here was something but that's definitely not a thing that should be public.
    }

    static test() {
        // maybe
    }

    static dialogListener: INativeDialogListener = new INativeDialogListener(TestCase.listenerTest);

    static nativeDialogListenerTest() {
        NativeDialog.showNativeDialog(TestCase.dialogListener, "Hello world!", "Press da button", "guacamole", "bomb", 'penis');
    }

    static listenerTest(listener: NativePointer, buttonIndex: number) {
        GUI.showFloaterText("You pressed on " + buttonIndex + "!", RGBA.green);
    }

    static testFileExists() {
        /// #if DEBUG
        //let json = File.readAllText("/data/user/0/com.supercell.brawlstarts/assets/");
        const opendir = new NativeFunction(libc!, 'pointer', ['pointer']);
        const readDir = new NativeFunction(readdir!, 'pointer', ['pointer']);
        const closeDir = new NativeFunction(closedir!, 'int', ['pointer']);

        const dirPath = Memory.allocUtf8String('/data/user/0/com.supercell.brawlstarts/update/badge');
        const dirPointer = opendir(dirPath);

        if (!dirPointer.isNull()) {
            console.log(`Opened directory: ${dirPath.readUtf8String()}`);
            let dirEntry = readDir(dirPointer);
            console.log(hexdump(dirEntry, { length: 128 * 4 }));
            closeDir(dirPointer);
            console.log('Closed directory');
        } else {
            console.error('Failed to open directory');
        }
        /// #endif
    }

    static createBlackListScreen() {
        /// #if DEBUG
        const screen = new BlackListScreen();

        screen.setXy();

        GUI.showPopup(screen.instance, 0, 0, 0);
        /// #endif
    }
}

// ============================================================
// FILE: src/gene/battle/LogicVector2.ts
// ============================================================
export class LogicVector2 {
    constructor(
        private _x: number = 0,
        private _y: number = 0
    ) { }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    add(vector: LogicVector2) {
        return new LogicVector2(this._x + vector.x, this._y + vector.y);
    }

    subtract(vector: LogicVector2) {
        return new LogicVector2(this._x - vector.x, this._y - vector.y);
    }

    dotProduct(vector: LogicVector2) {
        return this._x * vector.x + this._y * vector.y;
    }

    magnitude() {
        return Math.sqrt(this._x * this._x + this._y * this._y);
    }

    static fromAngle(angle: number, distance: number) {
        const rad = (angle * Math.PI) / 180;
        return new LogicVector2(
            Math.round(Math.sin(rad) * distance),
            Math.round(-Math.cos(rad) * distance)
        );
    }

    static getLineParam(t: number, a: LogicVector2, b: LogicVector2): LogicVector2 {
        const ab = b.subtract(a);
        return new LogicVector2(a.x + ab.x * t, a.y + ab.y * t);
    }

    static isPointOnLine(start: LogicVector2, end: LogicVector2, point: LogicVector2, tolerance: number) {
        const isXBetween = (point.x >= Math.min(start.x, end.x) - tolerance && point.x <= Math.max(start.x, end.x) + tolerance);
        const isYBetween = (point.y >= Math.min(start.y, end.y) - tolerance && point.y <= Math.max(start.y, end.y) + tolerance);

        // Пограничная проверка на прямую
        const crossProduct = (point.y - start.y) * (end.x - start.x) - (point.x - start.x) * (end.y - start.y);
        const isOnLine = Math.abs(crossProduct) <= tolerance; // Точка на одной прямой с допустимой погрешностью

        console.log(Math.abs(crossProduct));

        return isXBetween && isYBetween && isOnLine;
    }

    toString() {
        return `LogicVector(x=${this._x}, y=${this._y})`;
    }
}
// ============================================================
// FILE: src/gene/battle/ProjectileData.ts
// ============================================================
import {LogicBattleModeClient} from "../../logic/battle/LogicBattleModeClient";
import {LogicProjectileClient} from "../../logic/battle/objects/LogicProjectileClient";
import {LogicVector2} from "./LogicVector2";

export class ProjectileData {
    projectileClient: LogicProjectileClient;
    startPosition: LogicVector2;
    endPosition!: LogicVector2;
    summonTick: number = 0;

    constructor(projectileClient: LogicProjectileClient, summonTick: number) {
        this.projectileClient = projectileClient;
        this.startPosition = new LogicVector2(
            projectileClient.getX(),
            projectileClient.getY()
        );
        this.summonTick = summonTick;
    }

    calculateEndPosition() {
        let angle = (this.projectileClient.resolveAngle() + 90) % 360;

        const projectileData = this.projectileClient.getData();
        const ownerIndex = this.projectileClient.getOwnerIndex();

        // похуй, придумаю че нить

        if (ownerIndex > -1) {
            const player = LogicBattleModeClient.self.getPlayer(ownerIndex);

            const characterData = player.getCharacterData(0);

            const weaponSkill = characterData.getWeaponSkill();

            const weaponCastingRange = 100 * weaponSkill.getCastingRange();

            console.log("resolveAngle", angle, weaponCastingRange);

            const direction = LogicVector2.fromAngle(angle, weaponCastingRange);

            const endPoint = this.startPosition.add(direction);

            this.endPosition = endPoint;

            //console.log(ownerIndex, this.startPosition.x, this.startPosition.y, endPoint.x, endPoint.y)
        }
    }
}
// ============================================================
// FILE: src/gene/chatcommands/CommandsHandler.ts
// ============================================================
import {LogicVersion} from "../../logic/LogicVersion";
import {MainCommand} from "./MainCommand";
import {Permissions} from "./Permissions";
import * as commands from "./cmds/index";

const commandModules: { [key: string]: typeof MainCommand; } = commands;

export class CommandsHandler {
    static commands: Array<MainCommand> = [];
    static isLoaded: Boolean = false;

    static load() {
        if (CommandsHandler.isLoaded) {
            return console.log("CommandsHandler.load:", "Commands already was loaded!");
        }

        for (const key in commandModules) {
            if (Object.prototype.hasOwnProperty.call(commandModules, key)) {
                const CommandClass = commandModules[key];
                const commandInstance = new CommandClass(); // Instantiate the command
                CommandsHandler.commands.push(commandInstance);
            }
        }

        CommandsHandler.isLoaded = true;

        console.log("CommandsHandler.load:", "Loaded", this.commands.length, "commands!");
    }

    static execute(search: string, args: Array<string | number>) {
        if (!CommandsHandler.isLoaded) {
            console.log("CommandsHandler.execute:", "Commands wasn't loaded! Loading...");
            CommandsHandler.load();
        }

        const command = CommandsHandler.commands.find(cmd => cmd.getCommandRegexp().test(search));

        if (!command) {
            return "NO_COMMAND_DEFINED";
        }

        switch (command.getPermission()) {
            case Permissions.DEVELOPER:
                if (!LogicVersion.isDeveloperBuild())
                    return "NO_COMMAND_DEFINED";
                break;
        }

        return command.execute(args);
    }
}
// ============================================================
// FILE: src/gene/chatcommands/MainCommand.ts
// ============================================================
import {Permissions} from "./Permissions";

export class MainCommand {
    getCommandRegexp() {
        return /main/i;
    }

    execute(args: Array<string | number>) {
        return "";
    }

    getPermission() {
        return Permissions.EVERYONE;
    }

    getCommandInformation() {
        return {
            name: "",
            desc: "",
            isHidden: true
        };
    }
}
// ============================================================
// FILE: src/gene/chatcommands/Permissions.ts
// ============================================================
export enum Permissions {
    EVERYONE,
    DEVELOPER
}
// ============================================================
// FILE: src/gene/chatcommands/cmds/debug.ts
// ============================================================
import {MainCommand} from "../MainCommand";
import {Debug} from "../../Debug";
import {Permissions} from "../Permissions";

export class RestoreDebugCommand extends MainCommand {
    getCommandRegexp() {
        return /debug/i;
    }

    execute(args: Array<string | number>) {
        Debug.showDebugItems();

        return "OK";
    }

    getPermission() {
        return Permissions.EVERYONE;
    }

    getCommandInformation() {
        return {
            name: "debug",
            desc: "Get your debug items back",
            isHidden: false
        };
    }
}
// ============================================================
// FILE: src/gene/chatcommands/cmds/frida.ts
// ============================================================
import {MainCommand} from "../MainCommand";
import {Permissions} from "../Permissions";

export class FridaCommand extends MainCommand {
    getCommandRegexp() {
        return /frida/i;
    }

    execute(args: Array<string | number>) {
        return `Frida ${Frida.version}`;
    }

    getPermission() {
        return Permissions.EVERYONE;
    }

    getCommandInformation() {
        return {
            name: "frida",
            desc: "get frida version",
            isHidden: true
        };
    }
}
// ============================================================
// FILE: src/gene/chatcommands/cmds/index.ts
// ============================================================
export * from "./frida";
export * from "./lobbyinfo";
export * from "./test";
export * from "./zov";
export * from "./debug";
export * from "./name";
export * from "./spectate";
// ============================================================
// FILE: src/gene/chatcommands/cmds/lobbyinfo.ts
// ============================================================
import {Configuration} from "../../Configuration";
import {MainCommand} from "../MainCommand";
import {Permissions} from "../Permissions";

export class LobbyInfoCommand extends MainCommand {
    getCommandRegexp() {
        return /lobbyinfo/i;
    }

    execute(args: Array<string | number>) {
        Configuration.showLobbyInfo = !Configuration.showLobbyInfo;

        return "";
    }

    getPermission() {
        return Permissions.DEVELOPER;
    }

    getCommandInformation() {
        return {
            name: "lobbyinfo",
            desc: "hide/show lobby info",
            isHidden: true
        };
    }
}
// ============================================================
// FILE: src/gene/chatcommands/cmds/name.ts
// ============================================================
import {Configuration} from "../../Configuration";
import {GradientNickname} from "../../features/GradientNickname";
import {MainCommand} from "../MainCommand";
import {Permissions} from "../Permissions";

export class ChangeNameCommand extends MainCommand {
    getCommandRegexp() {
        return /name/i;
    }

    execute(args: Array<string | number>) {
        let hashtag = args[0];
        let name = args[1];

        if (!hashtag || !name) {
            return "NAME_CMD_WRONG_INPUT";
        }

        if ((typeof hashtag == "number")
            || (typeof name == "number")) {

            return "NAME_CMD_WRONG_INPUT";
        }

        hashtag = hashtag.toUpperCase()
            .replace("#", "")
            .replace("O", "0");

        if (GradientNickname.doPlayerHaveGradient(hashtag)) {
            return "NAME_CMD_INVALID_TAG";
        }

        console.log(`Changing name to ${name} for ${hashtag}`);

        Configuration.accountNames[hashtag] = name;
        Configuration.save();

        return "";
    }

    getPermission() {
        return Permissions.EVERYONE;
    }

    getCommandInformation() {
        return {
            name: "nane",
            desc: "locally change someone's name",
            isHidden: false
        };
    }
}
// ============================================================
// FILE: src/gene/chatcommands/cmds/spectate.ts
// ============================================================
import {Libc} from "../../../libs/Libc";
import {AllianceManager} from "../../../logic/alliance/AllianceManager";
import {HashTagCodeGenerator} from "../../../titan/logic/util/HashTagCodeGenerator";
import {MainCommand} from "../MainCommand";
import {Permissions} from "../Permissions";

export class SpectateCommand extends MainCommand {
    getCommandRegexp() {
        return /spectate/i;
    }

    execute(args: Array<string | number>) {
        let hashtag = args[0];
        let accountId = HashTagCodeGenerator.toId(hashtag as string);

        let ptr = Libc.malloc(8);
        ptr.writeInt(accountId[0]);
        ptr.add(4).writeInt(accountId[1]);

        AllianceManager.startSpectate(ptr);

        return "";
    }

    getPermission() {
        return Permissions.EVERYONE;
    }

    getCommandInformation() {
        return {
            name: "spectate",
            desc: "Spectate command",
            isHidden: false
        };
    }
}
// ============================================================
// FILE: src/gene/chatcommands/cmds/test.ts
// ============================================================
import {LogicVersion} from "../../../logic/LogicVersion";
import {MainCommand} from "../MainCommand";
import {Permissions} from "../Permissions";

export class TestCommand extends MainCommand {
    getCommandRegexp() {
        return /test/i;
    }

    execute(args: Array<string | number>) {
        if (!LogicVersion.isDeveloperBuild()) {
            return "";
        }

        return "";
        //return LocalizationManager.getString("TEST")
    }

    getPermission() {
        return Permissions.DEVELOPER;
    }

    getCommandInformation() {
        return {
            name: "test",
            desc: "test command",
            isHidden: false
        };
    }
}
// ============================================================
// FILE: src/gene/chatcommands/cmds/zov.ts
// ============================================================
import {Debug} from "../../Debug";
import {MainCommand} from "../MainCommand";
import {Permissions} from "../Permissions";

export class ZovCommand extends MainCommand {
    getCommandRegexp() {
        return /zov/i;
    }

    execute(args: Array<string | number>) {
        Debug.getDebugButton().setText("Z");

        return "";
    }

    getPermission() {
        return Permissions.EVERYONE;
    }

    getCommandInformation() {
        return {
            name: "zov",
            desc: "Z button",
            isHidden: false
        };
    }
}
// ============================================================
// FILE: src/gene/debug/DebugBattleButton.ts
// ============================================================
import {GameButton} from "../../titan/flash/gui/GameButton";
import {IButtonListener} from "../../titan/flash/gui/IButtonListener";
import {ResourceManager} from "../../titan/ResourceManager";
import {Debug} from "../Debug";
import {Resources} from "../Resources";

export class DebugBattleButton extends GameButton {
    constructor(name: string, category: string, x: number) {
        super();

        this.setMovieClip(ResourceManager.getMovieClip(Resources.DEBUG, "debug_button"));
        this.setText(name);
        this.instance.add(490).writePointer(name.scptr());
        this.instance.add(498).writePointer(category.scptr());
        this.instance.add(516).writePointer(name.scptr());

        this.setXY(x, 150);

        this.setButtonListener(new IButtonListener(this.callback));
    }

    protected callback(listener: NativePointer, button: NativePointer) {
        Debug.getDebugMenu().buttonPressed(listener, button);
    }
}
// ============================================================
// FILE: src/gene/debug/DebugButton.ts
// ============================================================
import {GameButton} from "../../titan/flash/gui/GameButton";
import {IButtonListener} from "../../titan/flash/gui/IButtonListener";
import {Stage} from "../../titan/flash/Stage";
import {ResourceManager} from "../../titan/ResourceManager";
import {Debug} from "../Debug";
import {Resources} from "../Resources";

export class DebugButton extends GameButton {
    constructor() {
        super();

        this.setMovieClip(ResourceManager.getMovieClip(Resources.DEBUG, "debug_button"));
        this.setText("D");

        let v8 = Stage.getPointSize() != 0.0 ? Stage.getPointSize() : 0.1;
        let v11 = (Stage.getOffset340() - ((Stage.getSafeMarginBottom() + Stage.getSafeMarginTop()) / v8));
        this.setXY(10, v11);
        this.setButtonListener(new IButtonListener(this.callback));
    }

    protected callback(listener: NativePointer, button: NativePointer) {
        console.log("click!");
        Debug.toggleDebugButtonPressed();
    }
}
// ============================================================
// FILE: src/gene/debug/DebugCommandButton.ts
// ============================================================
import {LogicDebugCommand} from "../../logic/command/LogicDebugCommand";
import {HomeMode} from "../../logic/home/HomeMode";
import {GameButton} from "../../titan/flash/gui/GameButton";
import {IButtonListener} from "../../titan/flash/gui/IButtonListener";

export class DebugCommandButton extends GameButton {
    private readonly debugActionIdx: number;
    private readonly debugIntParameter: number;
    readonly btnType: number;

    constructor(actionIdx: number, intParameter: number, btnType: number) {
        super();

        this.debugActionIdx = actionIdx;
        this.debugIntParameter = intParameter;
        this.btnType = btnType;

        this.instance.add(450).writeInt(this.debugActionIdx);
        this.instance.add(454).writeInt(this.debugIntParameter);

        this.setButtonListener(new IButtonListener(this.callback));
    }

    callback(listener: NativePointer, button: NativePointer) {
        let actionIdx = button.add(450).readInt();
        let intParameter = button.add(454).readInt();

        console.log("DebugCommandButton::callback: actionIdx " + actionIdx + ", intParameter: " + intParameter);

        let command = new LogicDebugCommand(actionIdx, intParameter);
        command.execute(HomeMode.getLogic());
    }
}
// ============================================================
// FILE: src/gene/debug/DebugDangerousFunctionPopup.ts
// ============================================================
import {IButtonListener} from "../../titan/flash/gui/IButtonListener";
import {Storage} from "../Storage";
import {LocalizationManager} from "../localization";
import {OwnQuestionPopup} from "../popups/OwnQuestionPopup";

export class DebugDangerousFunctionPopup extends OwnQuestionPopup {
    constructor(functionName: string) {
        super(
            LocalizationManager.getString("DANGEROUS_POPUP_TITLE"),
            LocalizationManager.getString("DANGEROUS_POPUP_BODY").replace("{functionName}", functionName)
        );

        this.addCloseButton(
            "button_no",
            LocalizationManager.getString("DANGEROUS_POPUP_BUTTON_NO")
        );

        const previousPopup = Storage.getPopup(this);

        if (previousPopup) {
            Storage.removePopupByInstance(previousPopup.instance);
        }
    }

    addYesButton(func: Function) {
        const self = this;
        this.addPopupButton(
            "button_yes",
            LocalizationManager.getString("DANGEROUS_POPUP_BUTTON_YES"),
            new IButtonListener(() => {
                func();

                self.fadeOut();
                Storage.removePopupByInstance(self.instance);
            })
        );
    }
}
// ============================================================
// FILE: src/gene/debug/DebugHud.ts
// ============================================================
import {GameMain} from "../../laser/client/GameMain";
import {ResourceManager} from "../../titan/ResourceManager";
import {Screen} from "../../titan/device/Screen";
import {MovieClip} from "../../titan/flash/MovieClip";
import {TextField} from "../../titan/flash/TextField";
import {DebugHudMessageCollector} from "./DebugHudMessageCollector";
import {Libc} from "../../libs/Libc";
import {Resources} from "../Resources";

export class DebugHud {
    protected mainMovieClip: MovieClip;
    protected textField: TextField | null;
    protected movieClip: MovieClip;
    private showMessage: boolean = false;
    private messageCollector: DebugHudMessageCollector;

    constructor() {
        this.messageCollector = new DebugHudMessageCollector();
        this.mainMovieClip = ResourceManager.getMovieClip(Resources.DEBUG, "debug_menu_text");
        this.textField = this.mainMovieClip.getTextFieldByName("Text");

        if (this.textField === null) {
            console.error("DebugHud::DebugHud", "TextField is NULL!");
        }

        this.movieClip = new MovieClip(this.textField?.instance as NativePointer);
        this.movieClip.setXY(10, 10);
        GameMain.getGameSprite().addChild(this.movieClip); // так-как debughud не наследуется от DisplayObject
    }

    showMessages(state: boolean) {
        this.showMessage = state;
        this.mainMovieClip.setChildVisible("Text", state);
    }

    addMessage(line: string) {
        this.messageCollector.addMessage(line);

        const lastLineY = 30 * this.messageCollector.getMessageCount();
        const screenHeight = Screen.getHeight();

        if (lastLineY > screenHeight) {
            const overload = lastLineY - screenHeight;
            const amount = Math.ceil(overload / 30);

            this.messageCollector.setMessages(this.messageCollector.getMessages().slice(amount));
        }
    }

    setMessageCollector(messageCollector: DebugHudMessageCollector) {
        this.messageCollector = messageCollector;
    }

    draw() {
        if (this.showMessage) {
            this.textField?.setText(this.messageCollector.combineMessageLinesToString());
        }
    }

    getShowMessageState() {
        return this.showMessage;
    }

    destruct() {
        this.showMessage = false;

        GameMain.getGameSprite().removeChild(this.mainMovieClip);
        try {
            Libc.free(this.mainMovieClip.instance);
        }
        catch (e) { }

        GameMain.getGameSprite().removeChild(this.movieClip);
        try {
            Libc.free(this.movieClip.instance);
        }
        catch (e) { }
    }
}
// ============================================================
// FILE: src/gene/debug/DebugHudMessageCollector.ts
// ============================================================
export class DebugHudMessageCollector {
    private messages: Array<string>;

    constructor() {
        this.messages = [];
    }

    addMessage(message: string) {
        this.messages.push(message);
    }

    combineMessageLinesToString() {
        return this.messages.join("\n");
    }

    getMessageCount() {
        return this.messages.length;
    }

    getMessage(index: number) {
        if (index > this.getMessageCount()) {
            console.log("DebugHudMessageCollector::getMessage", "Message", index, "is NULL!");
            return null;
        }

        return this.messages[index];
    }

    setMessages(messages: Array<string>) {
        this.messages = messages;
    }

    getMessages() {
        return this.messages;
    }

    clone() {
        const messageCollector = new DebugHudMessageCollector();

        messageCollector.setMessages(this.messages);

        return messageCollector;
    }
}
// ============================================================
// FILE: src/gene/debug/DebugInfo.ts
// ============================================================
import {ResourceManager} from "../../titan/ResourceManager";
import {Resources} from "../Resources";
import {DebugMenuBase} from "./DebugMenuBase";
import {ToggleDebugMenuButton} from "./ToggleDebugMenuButton";

export class DebugInfo extends DebugMenuBase {
    private readonly toggleDebugMenuButton: ToggleDebugMenuButton;
    private lastLineY: number;

    constructor() {
        super("debug_menu");

        this.setTitle("Debug Info");

        this.toggleDebugMenuButton = new ToggleDebugMenuButton();
        this.toggleDebugMenuButton.setMovieClip(this.movieClip.getChildByName("close_button"));

        this.movieClip.addChild(this.toggleDebugMenuButton);

        this.lastLineY = 0.0;
    }

    addLine(line: string) {
        let debugMenuTxt = ResourceManager.getMovieClip(Resources.DEBUG, "debug_menu_text");
        let textField = debugMenuTxt.getTextFieldByName("Text");

        textField!.setText(line);
        textField!.setFontSize(17);

        debugMenuTxt.setXY(debugMenuTxt.x, this.lastLineY);

        this.scrollArea.addContent(debugMenuTxt);

        this.lastLineY += debugMenuTxt.getHeight() + 3.0;
    }
}
// ============================================================
// FILE: src/gene/debug/DebugMenu.ts
// ============================================================
import {GameMain} from "../../laser/client/GameMain";
import {GameButton} from "../../titan/flash/gui/GameButton";
import {FlutterSCIDManager} from "../../titan/nativescid/FlutterSCIDManager";
import {ResourceManager} from "../../titan/ResourceManager";
import {Configuration} from "../Configuration";
import {Debug} from "../Debug";
import {DebugCommandButton} from "./DebugCommandButton";
import {DebugMenuBase} from "./DebugMenuBase";
import {DebugMenuCategory, EDebugCategory} from "./DebugMenuCategory";
import {MovieClip} from "../../titan/flash/MovieClip";
import {LogicVersion} from "../../logic/LogicVersion";
import {MessageManager} from "../../laser/client/network/MessageManager";
import {ClientInput, ClientInputType} from "../../logic/battle/ClientInput";
import {ClientInputManager} from "../../logic/battle/ClientInputManager";
import {BattleMode} from "../../logic/battle/BattleMode";
import {GUI} from "../../titan/flash/gui/GUI";
import {LocalizationManager} from "../../gene/localization/index";
import {TeamSpam} from "../features/TeamSpam";
import {ToggleDebugClickerButton} from "./ToggleDebugClickerButton";
import {LatencyManager} from "../../laser/client/network/LatencyManager";
import {GameSettings} from "../../laser/client/GameSettings";
import {SpectateByTagPopup} from "../popups/SpectateByTagPopup";
import {LogicDataTables} from "../../logic/data/LogicDataTables";
import {LogicThemeData} from "../../logic/data/LogicThemeData";
import {Resources} from "../Resources";
import {GameStateManager} from "../../laser/client/state/GameStateManager";
import {RGBA} from "../features/RGBA";
import {OpenUrlPopup} from "../popups/OpenUrlPopup";
import {TextField} from "../../titan/flash/TextField";
import {Settings} from "../../laser/client/Settings";
import {Braille} from "../features/Braille";
import {HomeScreen} from "../../logic/home/HomeScreen";
import {LogicDefines} from "../../LogicDefines";
import {StringTable} from "../../logic/data/StringTable";
import {StartSpectateMessage} from "../../logic/message/battle/StartSpectateMessage";
import {LogicRevealMutationCommand} from "../../logic/command/LogicRevealMutationCommand";
import {HomeMode} from "../../logic/home/HomeMode";
import {GlobalID} from "../../logic/data/GlobalID";
import {Storage} from "../Storage";
import {LogicData} from "../../logic/data/LogicData";
import {SkinChanger} from "../features/SkinChanger";
import {ToggleDebugMenuButton} from "./ToggleDebugMenuButton";
import {ProfileByTagPopup} from "../popups/ProfileByTagPopup";
import {NativeDialog} from "../../titan/utils/NativeDialog";
import {UsefulInfo} from "../features/UsefulInfo";
import {DVD} from "../features/DVD";
import {PlayAgainMessage} from "../../logic/message/battle/PlayAgainMessage";
import {TestCase} from "../TestCase";
import {IButtonListener} from "../../titan/flash/gui/IButtonListener";
import {GeneAssets} from "../GeneAssets";
import {ClientInfoMessage} from "../../logic/message/udp/ClientInfoMessage";
import {NativeHTTPClient} from "../../titan/utils/NativeHTTPClient";
import {Path} from "../../titan/Path";
import {DebugDangerousFunctionPopup} from "./DebugDangerousFunctionPopup";
import {TeamManager} from "../../logic/home/team/TeamManager";

export class DebugMenu extends DebugMenuBase {
    private readonly toggleDebugMenuButton: ToggleDebugMenuButton;
    private clicker?: ToggleDebugClickerButton;

    private brailleTimeout: NodeJS.Timeout = setTimeout(() => { }, 1);
    private darkThemeTimeout: NodeJS.Timeout = setTimeout(() => { }, 1);
    private isBrailleSwitchBegan: boolean = false;
    private isDarkThemeSwitchBegan: boolean = false;

    private static notImplementedFunctions: string[] = [

    ];

    private static notImplementedIOSFunctions: string[] = [

    ];

    private static notImplementedAndroidFunctions: string[] = [

    ];

    private static dangerousFunctions: string[] = [
        "BYPASS_ANTI_PROFANITY"
    ];

    constructor() {
        super("debug_menu");

        this.setTitle("Debug Menu");

        const textField = this.movieClip.getTextFieldByName("version")!;
        textField.setText(LogicVersion.toDebugString());
        textField.setTextColor(RGBA.color(0, 255, 15));
        this.addChild(new MovieClip(textField.instance!));

        this.toggleDebugMenuButton = new ToggleDebugMenuButton();
        this.toggleDebugMenuButton.setMovieClip(this.movieClip.getChildByName("close_button"));
        this.movieClip.addChild(this.toggleDebugMenuButton);

        try {
            const anotherMovieClip = ResourceManager.getMovieClip(Resources.GENE_DEBUG, "debug_menu");
            if (anotherMovieClip) {
                this.clicker = new ToggleDebugClickerButton();
                this.clicker.setMovieClip(anotherMovieClip.getChildById(10));

                this.movieClip.addChild(this.clicker);
                this.movieClip.addChild(anotherMovieClip.getChildById(11));
            }
        } catch (e) {
            console.error(new Error("DebugMenu::DebugMenu: background_genebrawl is missing or something else.").stack);
            // background_genebrawl.sc missing
        }

        this.createDebugMenuButton("RESTART_GAME", -1, -1, 0);

        this.createDebugMenuButton("DISABLE_SPOOF", -1, -1, 2, EDebugCategory.LATENCY);

        this.createDebugMenuButton("DEBUG_INFO", -1, -1, 2, EDebugCategory.PREVIEW);
        this.createDebugMenuButton("DEBUG_OPEN_URL", -1, -1, 2, EDebugCategory.PREVIEW);

        this.createDebugMenuButton("OPEN_ACCOUNT_SWITCHER", -1, -1, 2, EDebugCategory.SC_ID, -1, () => FlutterSCIDManager.openWindow("profile-selector"));

        this.createDebugMenuButton("ADD_RESOURCES", 1, -1, 2, EDebugCategory.ACCOUNT);
        this.createDebugMenuButton("ADD_GEMS", 14, 800, 2, EDebugCategory.ACCOUNT);
        this.createDebugMenuButton("BYPASS_OUT_OF_SYNC", -1, -1, 2, EDebugCategory.ACCOUNT, Configuration.antiOutOfSync ? 1 : 0);
        this.createDebugMenuButton("REMOVE_ALL_COINS", 19, -1, 2, EDebugCategory.ACCOUNT);
        this.createDebugMenuButton("REMOVE_ALL_GEMS", 18, -1, 2, EDebugCategory.ACCOUNT);
        this.createDebugMenuButton("UNLOCK_ALL_LVL7", 113, 7, 2, EDebugCategory.ACCOUNT);
        this.createDebugMenuButton("UNLOCK_ALL_LVL9", 113, 9, 2, EDebugCategory.ACCOUNT);
        this.createDebugMenuButton("UNLOCK_GADGETS", 114, 1, 2, EDebugCategory.ACCOUNT);
        this.createDebugMenuButton("UNLOCK_STAR_POWERS", 114, 2, 2, EDebugCategory.ACCOUNT);
        this.createDebugMenuButton("UNLOCK_ONE", 72, -1, 2, EDebugCategory.ACCOUNT);
        this.createDebugMenuButton("UNLOCK_MAX_ONE", 72, 1, 2, EDebugCategory.ACCOUNT);
        this.createDebugMenuButton("UNLOCK_ALL", 23, -1, 2, EDebugCategory.ACCOUNT);
        this.createDebugMenuButton("UNLOCK_MAX_ALL", 23, 1, 2, EDebugCategory.ACCOUNT);
        this.createDebugMenuButton("UNLOCK_MAX_ALL_NO_STAR_POWERS", 23, 2, 2, EDebugCategory.ACCOUNT);
        this.createDebugMenuButton("UNLOCK_EVENT_SLOTS", 63, -1, 2, EDebugCategory.ACCOUNT);
        this.createDebugMenuButton("REMOVE_HERO_SKINS", 184, 0, 2, EDebugCategory.ACCOUNT);
        this.createDebugMenuButton("ADD_POWER", 54, 50, 2, EDebugCategory.ACCOUNT);
        this.createDebugMenuButton("ADD_SCORE", 25, 125, 2, EDebugCategory.ACCOUNT);
        this.createDebugMenuButton("DECREASE_SCORE", 26, -50, 2, EDebugCategory.ACCOUNT);
        this.createDebugMenuButton("CLAIM_35_MILESTONES", 154, -1, 2, EDebugCategory.ACCOUNT);
        this.createDebugMenuButton("ADD_1_WINSTREAK", 210, 1, 2, EDebugCategory.ACCOUNT);
        this.createDebugMenuButton("ADD_10_WINSTREAK", 210, 10, 2, EDebugCategory.ACCOUNT);
        this.createDebugMenuButton("ADD_100_WINSTREAK", 210, 100, 2, EDebugCategory.ACCOUNT);
        this.createDebugMenuButton("REMOVE_WINSTREAK", 211, -1, 2, EDebugCategory.ACCOUNT);
        this.createDebugMenuButton("ADD_1000_BLINGS", 182, 1000, 2, EDebugCategory.ACCOUNT);

        // not needed yet. this.createDebugMenuButton("Reveal Angel Mutation", -1, -1, 0, EDebugCategory.ACCOUNT);
        // not needed yet. this.createDebugMenuButton("Reveal Demon Mutation", -1, -1, 0, EDebugCategory.ACCOUNT);
        this.createDebugMenuButton("HIDE_SIDE_MASK", -1, -1, 0, EDebugCategory.GFX, Configuration.showSidemask ? 0 : 1);
        this.createDebugMenuButton("DARK_THEME", -1, -1, 0, EDebugCategory.GFX, Configuration.darkTheme ? 1 : 0);
        this.createDebugMenuButton("SHOW_EDIT_CONTROLS", -1, -1, 0, EDebugCategory.GFX, Configuration.showEditControls ? 1 : 0);
        this.createDebugMenuButton("SHOW_BATTLE_SHORTCUTS", -1, -1, 0, EDebugCategory.GFX, Configuration.showBattleShortcuts ? 1 : 0);
        //this.createDebugMenuButton("Win match", 35, -1, 0, EDebugCategory.BATTLE);
        this.createDebugMenuButton("AUTO_AIM", -1, -1, 0, EDebugCategory.BATTLE, Configuration.autoAim ? 1 : 0);
        this.createDebugMenuButton("AUTO_ULTI", -1, -1, 0, EDebugCategory.BATTLE, Configuration.autoUlti ? 1 : 0);
        this.createDebugMenuButton("AUTO_HYPERCHARGE", -1, -1, 0, EDebugCategory.BATTLE, Configuration.autoOvercharge ? 1 : 0);
        this.createDebugMenuButton("HOLD_TO_SHOOT", -1, -1, 0, EDebugCategory.BATTLE, Configuration.holdToShoot ? 1 : 0);
        this.createDebugMenuButton("AUTO_MOVE_TO_TARGET", -1, -1, 0, EDebugCategory.BATTLE, Configuration.moveToTarget ? 1 : 0);
        this.createDebugMenuButton("FOLLOW_CLOSEST_TEAMMATE", -1, -1, 0, EDebugCategory.BATTLE, Configuration.moveToAlly ? 1 : 0);
        this.createDebugMenuButton("AUTO_PLAY_AGAIN", -1, -1, 0, EDebugCategory.BATTLE, Configuration.autoPlayAgain ? 1 : 0);
        this.createDebugMenuButton("SEND_EMPTY_EMOTE", -1, -1, 1, EDebugCategory.BATTLE);
        this.createDebugMenuButton("SKIP_REPLAY_INTRO", -1, -1, 1, EDebugCategory.BATTLE, Configuration.skipReplayIntro ? 1 : 0);
        this.createDebugMenuButton("SKIP_BATTLE_END_REPLAY", -1, -1, 1, EDebugCategory.BATTLE, Configuration.skipBattleEndReplay ? 1 : 0);
        this.createDebugMenuButton("AUTO_READY", -1, -1, 1, EDebugCategory.BATTLE, Configuration.autoReady ? 1 : 0);
        this.createDebugMenuButton("BATTLE_SETTINGS", -1, -1, 0, EDebugCategory.BATTLE);
        this.createDebugMenuButton("SHOW_CHAT_BUTTON", -1, -1, 0, EDebugCategory.BATTLE, Configuration.showChatButton ? 1 : 0);

        this.createDebugMenuButton("SHOW_ENEMY_AMMO", -1, -1, 1, EDebugCategory.BATTLE, Configuration.showEnemyAmmo);
        this.createDebugMenuButton("STOP_LOLA_CLONE", -1, -1, 1, EDebugCategory.BATTLE, Configuration.lolaControlState !== 0);

        this.createDebugMenuButton("ADD_BRAWL_PASS_POINTS_THIS_SEASON", 81, 50, 2, EDebugCategory.BRAWL_PASS);
        this.createDebugMenuButton("ADD_CHAMPIONSHIP_CHALLENGE_WIN", 84, 1, 2, EDebugCategory.CHALLENGE);
        this.createDebugMenuButton("ADD_CHAMPIONSHIP_CHALLENGE_LOSS", 95, 1, 2, EDebugCategory.CHALLENGE);
        this.createDebugMenuButton("SET_CC_ESPORTS_QUALIFIED", 102, 1, 2, EDebugCategory.CHALLENGE);
        this.createDebugMenuButton("REMOVE_CC_ESPORTS_QUALIFIED", 103, 1, 2, EDebugCategory.CHALLENGE);

        this.createDebugMenuButton("FORCE_CHINA_GFX_TWEAKS", -1, -1, 0, EDebugCategory.PRC_CHINA, Configuration.isChinaVersion ? 1 : 0);

        this.createDebugMenuButton("HIDE_DEBUG_ITEMS", -1, -1, 0, EDebugCategory.GFX, Configuration.showDebugItems ? 0 : 1);
        //fixme looks like it got removed too this.createDebugMenuButton("HIDE_SHOW_CONNECTION_INDICATOR", -1, -1, 0, EDebugCategory.GFX, Configuration.showConnectionIndicator ? 1 : 0);
        this.createDebugMenuButton("HIDE_TAGS", -1, -1, 0, EDebugCategory.STREAMER_MODE, Configuration.showTags ? 0 : 1);
        this.createDebugMenuButton("HIDE_NAME", -1, -1, 2, EDebugCategory.STREAMER_MODE, Configuration.showName ? 0 : 1);

        //this.createDebugMenuButton("HIDE_SHOW_FPS", -1, -1, 2, EDebugCategory.USEFUL_INFO);
        //this.createDebugMenuButton("HIDE_SHOW_AVG_FPS", -1, -1, 2, EDebugCategory.USEFUL_INFO);
        //this.createDebugMenuButton("HIDE_SHOW_MIN_FPS", -1, -1, 2, "FPS Counter");
        //this.createDebugMenuButton("HIDE_SHOW_MAX_FPS", -1, -1, 2, EDebugCategory.USEFUL_INFO);
        //this.createDebugMenuButton("HIDE_SHOW_TIME", -1, -1, 2, EDebugCategory.USEFUL_INFO);
        //this.createDebugMenuButton("HIDE_SHOW_SESSION_TIME", -1, -1, 2, EDebugCategory.USEFUL_INFO);

        this.createDebugMenuButton("START_ROOM_SPAM", -1, -1, 2, EDebugCategory.SPAM, -1, () => {
            TeamSpam.start();
        });

        this.createDebugMenuButton("STOP_ROOM_SPAM", -1, -1, 2, EDebugCategory.SPAM, -1, () => {
            TeamSpam.end();
        });


        if (!Configuration.useStage) {
            this.createDebugMenuButton("SWITCH_TO_STAGE_SERVER", -1, -1, 0, EDebugCategory.SERVERS);
        } else {
            this.createDebugMenuButton("SWITCH_TO_PROD_SERVER", -1, -1, 0, EDebugCategory.SERVERS);
        }


        this.createDebugMenuButton("UNLOCK_GEARS", 117, -1, 2, EDebugCategory.GEARS);
        this.createDebugMenuButton("UNLOCK_CURRENT_BRAWL_PASS_SEASON", 0x9F, 0, 2, EDebugCategory.BRAWL_PASS);
        this.createDebugMenuButton("UNLOCK_CURRENT_BRAWL_PASS_PLUS_SEASON", 0x9F, -1, 2, EDebugCategory.BRAWL_PASS);
        this.createDebugMenuButton("SKIN_CHANGER", -1, -1, 0, EDebugCategory.SKIN_CHANGER, Configuration.skinChanger ? 1 : 0);
        this.createDebugMenuButton("HIDE_ULTI_AIMING", -1, -1, 0, EDebugCategory.BATTLE, Configuration.showUlti ? 0 : 1);

        this.createDebugMenuButton("STATIC_BACKGROUND", -1, -1, 2, EDebugCategory.GFX, Configuration.staticBackground ? 1 : 0);
        this.createDebugMenuButton("ANTI_AFK", -1, -1, 0, EDebugCategory.BATTLE, Configuration.antiAFK ? 1 : 0);



        // Optimization
        this.createDebugMenuButton("HIDE_SPECIAL_OFFERS", -1, -1, 0, EDebugCategory.OPTIMIZATION, Configuration.specialOffers ? 0 : 1);
        this.createDebugMenuButton("CHARACTER_SOUNDS", -1, -1, 0, EDebugCategory.OPTIMIZATION, Configuration.heroSounds ? 1 : 0);

        this.createDebugMenuButton("HIDE_BRAWLERS_IN_INTRO", -1, -1, 0, EDebugCategory.OPTIMIZATION, Configuration.hideHeroesIntro ? 1 : 0);
        this.createDebugMenuButton("HIDE_LEAGUE_IN_BATTLE_CARD", -1, -1, 0, EDebugCategory.OPTIMIZATION, Configuration.hideLeagueBattleCard ? 1 : 0);
        this.createDebugMenuButton("USE_OLD_INTRO", -1, -1, 0, EDebugCategory.OPTIMIZATION, Configuration.useOldIntro ? 1 : 0);

        this.createDebugMenuButton("BYPASS_ANTI_PROFANITY", -1, -1, 0, EDebugCategory.MISC, Configuration.antiProfanity);
        this.createDebugMenuButton("CLOSE_RANKED_SCREEN", -1, -1, 0, EDebugCategory.MISC);
        this.createDebugMenuButton("PROFILE_BY_TAG", -1, -1, 0, EDebugCategory.MISC);

        //this.createDebugMenuButton("FORCE_LOWRES_TEXTURES", -1, -1, 0, EDebugCategory.OPTIMIZATION);

        this.createDebugMenuButton("SLOW_MODE", -1, -1, 0, EDebugCategory.GFX, Configuration.slowMode ? 1 : 0);
        this.createDebugMenuButton("VISUAL_CHROMATIC_NAME", -1, -1, 0, EDebugCategory.GFX, Configuration.fakePremiumPass ? 1 : 0);
        this.createDebugMenuButton("DISABLE_OUTLINE", -1, -1, 0, EDebugCategory.GFX, Configuration.drawOutline ? 0 : 1);

        this.createDebugMenuButton("EMOTE_ANIMATION", -1, -1, 0, EDebugCategory.GFX, Configuration.emoteAnimation ? 1 : 0);
        this.createDebugMenuButton("SHOW_FUTURE_EVENTS", -1, -1, 0, EDebugCategory.GFX, Configuration.showFutureEvents ? 1 : 0);
        this.createDebugMenuButton("HIDE_CREATOR_BOOST", -1, -1, 0, EDebugCategory.GFX, Configuration.contentCreatorBoost ? 0 : 1);
        this.createDebugMenuButton("SHOW_BOT_PREFIX", -1, -1, 0, EDebugCategory.GFX, Configuration.showBotPrefix ? 1 : 0);
        this.createDebugMenuButton("USE_LEGACY_BACKGROUND", -1, -1, 0, EDebugCategory.GFX, Configuration.useLegacyThemeMode);
        // FIXME this.createDebugMenuButton("SKIP_STARR_DROP_ANIMATION", -1, -1, 0, EDebugCategory.GFX, Configuration.skipRandomAnimation);
        this.createDebugMenuButton("HIDE_LOBBY_INFO", -1, -1, 0, EDebugCategory.GFX, 0);

        this.createDebugMenuButton("MOVEMENT_BASED_AUTOSHOOT", -1, -1, 0, EDebugCategory.BATTLE, Configuration.movementBasedAutoshoot ? 1 : 0);
        this.createDebugMenuButton("SPECTATE_BY_TAG", -1, -1, 0, EDebugCategory.BATTLE);
        this.createDebugMenuButton("HIDE_BATTLE_STATE", -1, -1, 0, EDebugCategory.BATTLE, Configuration.hideBattleState ? 1 : 0);
        this.createDebugMenuButton("AUTO_EXIT_AFTER_BATTLE", -1, -1, 0, EDebugCategory.BATTLE, Configuration.autoExitAfterBattle ? 1 : 0);
        this.createDebugMenuButton("MARK_FAKE_LEON", -1, -1, 0, EDebugCategory.BATTLE, Configuration.markFakeNinja ? 1 : 0);
        this.createDebugMenuButton("NEXT_CAMERA_MODE", -1, -1, -1, EDebugCategory.CAMERA_MODE);

        this.createDebugMenuButton("SHOW_FPS", -1, -1, 2, EDebugCategory.USEFUL_INFO, Configuration.showFPS ? 1 : 0);
        this.createDebugMenuButton("SHOW_TIME", -1, -1, 2, EDebugCategory.USEFUL_INFO, Configuration.showCurrentTime ? 1 : 0);
        this.createDebugMenuButton("SHOW_SESSION_TIME", -1, -1, 2, EDebugCategory.USEFUL_INFO, Configuration.showSessionTime ? 1 : 0);
        this.createDebugMenuButton("SHOW_OWN_TEAM", -1, -1, 2, EDebugCategory.USEFUL_INFO, Configuration.showTeam ? 1 : 0);
        this.createDebugMenuButton("SHOW_BATTLE_INFO", -1, -1, 2, EDebugCategory.USEFUL_INFO, Configuration.showBattleInfo ? 1 : 0);

        this.createDebugMenuButton("SHOW_BATTLE_PING", -1, -1, 2, EDebugCategory.USEFUL_INFO, Configuration.showBattlePing ? 1 : 0);
        this.createDebugMenuButton("SHOW_TICKS", -1, -1, 2, EDebugCategory.USEFUL_INFO, Configuration.showTicks ? 1 : 0);

        this.createDebugMenuButton("CHANGELOGS", -1, -1, 2, EDebugCategory.USEFUL_INFO);

        this.createDebugMenuButton("SFX", -1, -1, 2, EDebugCategory.GAME_SETTINGS, GameSettings.sfxEnabled);
        this.createDebugMenuButton("MUSIC", -1, -1, 2, EDebugCategory.GAME_SETTINGS, GameSettings.musicEnabled);
        this.createDebugMenuButton("HAPTICS", -1, -1, 2, EDebugCategory.GAME_SETTINGS, GameSettings.hapticsEnabled);

        this.createDebugMenuButton("NO_PROXY", -1, -1, 0, EDebugCategory.PROXY);
        this.createDebugMenuButton("Gene Proxy", -1, -1, 0, EDebugCategory.PROXY);

        this.createDebugMenuButton("PROBING_CANE_MODE", -1, -1, 0, EDebugCategory.FUN, Configuration.braille ? 1 : 0);
        this.createDebugMenuButton("ADVANCED_PROBING_CANE_MODE", -1, -1, 0, EDebugCategory.FUN, Configuration.braille_textfield ? 1 : 0);
        this.createDebugMenuButton("SPAWN_DVD", -1, -1, 0, EDebugCategory.FUN);
        this.createDebugMenuButton("REMOVE_DVD", -1, -1, 0, EDebugCategory.FUN);
        this.createDebugMenuButton("REMOVE_ALL_DVD", -1, -1, 0, EDebugCategory.FUN);

        this.createDebugMenuButton("CURRENT_SERVER_THEME", -1, -1, 0, EDebugCategory.CHANGE_THEME, Configuration.themeId == -1);

        const themeTable = LogicDataTables.getTable(41);

        for (let i = 0; i < themeTable.add(20).readU8(); i++) {
            const themeData = LogicDataTables.getDataById(41, i) as LogicThemeData;

            if (!themeData.isDisabled())
                this.createDebugMenuButton(themeData.getName(), -1, i, -1, EDebugCategory.CHANGE_THEME, Configuration.themeId == i);
        }

        this.createDebugMenuButton("STATUS_NORMAL", -1, -1, 0, EDebugCategory.CHANGE_STATUS, Configuration.preferredStatus == -1);

        for (let i = 1; i < 12; i++) {
            if (i == 6)
                continue;

            this.createDebugMenuButton(
                StringTable.getString("TID_TEAM_MEMBER_STATUS_" + i),
                -1,
                i,
                -1,
                EDebugCategory.CHANGE_STATUS,
                Configuration.preferredStatus == i
            );
        }

        /// #if DEBUG
        if (LogicVersion.isDeveloperBuild()) {
            this.createDebugMenuButton(`Toggle DEV Build Message`, -1, -1, -1, EDebugCategory.TESTS, -1, () => {
                UsefulInfo.disableDevBuildMessage = !UsefulInfo.disableDevBuildMessage;
            });

            this.createDebugMenuButton(`Spawn Test Popup`, -1, -1, -1, EDebugCategory.TESTS);
            this.createDebugMenuButton("Send StartSpectate myself", -1, -1, 0, EDebugCategory.BATTLE);
            this.createDebugMenuButton("DVD Test", -1, -1, 0, EDebugCategory.TESTS);

            if (GeneAssets.getAsset("CUSTOM_BG"))
                this.createDebugMenuButton(`Change background`, -1, -1, -1, EDebugCategory.TESTS, -1, () => {
                    HomeScreen.setTheme(GeneAssets.getAsset("CUSTOM_BG"));
                });
        }

        if (LogicVersion.isDeveloperBuild()) {
            this.createDebugMenuButton("Hamster", -1, -1, 0, EDebugCategory.TESTS, -1, () => {
                Debug.toggleDebugClickerButtonPressed();
            });

            this.createDebugMenuButton("Test Case", -1, -1, 0, EDebugCategory.TESTS, -1, () => {
                console.log("Init test case!");
                TestCase.doCase();
                console.log("Test case done!");
            });

            this.createDebugMenuButton("Test callback button", -1, -1, 0, EDebugCategory.TESTS, 0, (button: NativePointer, listener: NativePointer) => {
                console.log("Test callback button pressed!");

                GUI.showFloaterText("Test callback button works!");
            });

            this.createDebugMenuButton("Print Non-localized strings", -1, -1, 0, EDebugCategory.TESTS, 0, () => {
                console.log(LocalizationManager.unknownStrings.toString().split(",").map(key => `${key}: ""`).join(",\n"));
            });

            this.createDebugMenuButton("HTTP test", -1, -1, 0, EDebugCategory.EXPERIMENTAL, 0, () => {
                console.log("HTTP Test...");

                const httpClient = new NativeHTTPClient();
                httpClient.downloadFile("https://brawlstars.inbox.supercell.com/data/en/news/manifest.json", Path.getUpdatePath() + "manifest.json");
            });
        }
        /// #endif

        //let searchHelp = this.movieClip.getTextFieldByName("search_help");
        //searchHelp?.setText("type here to search");

        let searchHelp = this.movieClip.getTextFieldByName("search_help");
        searchHelp?.setText("t.me/gene_land");

        //searchHelp?.setTextColor(RGBA.purple)

        let clear = this.movieClip.getChildByName("clear_button");
        clear.getTextFieldByName("text")?.setText("clear");

        let categories: DebugMenuCategory[] = [];
        let buttons: GameButton[] = [];

        this.buttons.forEach(function (a: GameButton) {
            if (a instanceof DebugMenuCategory) {
                categories.push(a);
            } else {
                buttons.push(a);
            }
        });

        buttons.sort((a, b) => {
            let name = a.getText();
            let name2 = b.getText();

            if (name < name2) {
                return -1;
            }
            if (name > name2) {
                return 1;
            }

            return 0;
        });

        categories.sort((a, b) => {
            let name = a.name;
            let name2 = b.name;

            if (name < name2) {
                return -1;
            }
            if (name > name2) {
                return 1;
            }

            return 0;
        });

        this.buttons = buttons.concat(categories);

        this.shouldUpdateLayout = true;
    }

    private static isNotImplemented(name: string): boolean {
        return DebugMenu.notImplementedFunctions.includes(name);
    }

    private static isNotImplementedForIOS(name: string): boolean {
        return DebugMenu.notImplementedIOSFunctions.includes(name);
    }

    private static isNotImplementedForAndroid(name: string): boolean {
        return DebugMenu.notImplementedAndroidFunctions.includes(name);
    }

    private accountButtonPressed(button: GameButton) {
        let text = button.getOriginalName();

        switch (text) {
            case "BYPASS_OUT_OF_SYNC":
                button.switchCheckbox(Configuration.antiOutOfSync);
                Configuration.antiOutOfSync = !Configuration.antiOutOfSync;
                Configuration.save();

                GUI.showFloaterText(
                    LocalizationManager.getStateString("OUT_OF_SYNC", Configuration.antiOutOfSync)
                );
                break;
            case "Reveal Demon Mutation":
                const _command = new LogicRevealMutationCommand(0);

                HomeMode.addCommand(_command);
                break;
            case "Reveal Angel Mutation":
                const command = new LogicRevealMutationCommand(1);

                HomeMode.addCommand(command);
                break;
        }
    }

    private battleButtonPressed(button: GameButton) {
        let text = button.getOriginalName();

        switch (text) {
            case "BATTLE_SETTINGS":
                Debug.toggleSetAlphaButtonClicked();
                break;
            case "HIDE_ULTI_AIMING":
                button.switchCheckbox(!Configuration.showUlti);
                GUI.showFloaterText(LocalizationManager.getStateString("HIDE_ULTI_AIMING", Configuration.showUlti));

                Configuration.showUlti = !Configuration.showUlti;
                Configuration.save();
                break;
            case "HIDE_BATTLE_STATE":
                button.switchCheckbox(Configuration.hideBattleState);
                Configuration.hideBattleState = !Configuration.hideBattleState;
                Configuration.save();

                GUI.showFloaterText(LocalizationManager.getString(
                    Configuration.hideBattleState ? "BATTLE_STATE_HIDDEN" : "BATTLE_STATE_VISIBLE"
                ));
                break;
            case "PROTECTIVE_FEATURES":
                button.switchCheckbox(Configuration.enableProtective);
                Configuration.enableProtective = !Configuration.enableProtective;
                Configuration.save();

                GUI.showFloaterText(
                    LocalizationManager.getStateString("PROTECTIVE_FEATURES", Configuration.enableProtective)
                );
                break;
            case "AUTO_READY":
                button.switchCheckbox(Configuration.autoReady);
                GUI.showFloaterText(LocalizationManager.getStateString("AUTO_READY", !Configuration.autoReady));

                Configuration.autoReady = !Configuration.autoReady;
                Configuration.save();
                break;
            case "SPECTATE_BY_TAG":
                const specPopup = new SpectateByTagPopup();

                GUI.showPopup(specPopup.instance, 1, 0, 1);
                break;
            case "ANTI_AFK":
                button.switchCheckbox(Configuration.antiAFK);
                GUI.showFloaterText(LocalizationManager.getStateString("ANTI_AFK", !Configuration.antiAFK));

                Configuration.antiAFK = !Configuration.antiAFK;
                Configuration.save();
                break;
            case "SEND_EMPTY_EMOTE":
                if (!GameStateManager.isState(5)) {
                    break;
                }

                ClientInputManager.addInput(new ClientInput(ClientInputType.Emote));

                break;
            case "SKIP_BATTLE_END_REPLAY":
                button.switchCheckbox(Configuration.skipBattleEndReplay);
                Configuration.skipBattleEndReplay = !Configuration.skipBattleEndReplay;
                Configuration.save();

                GUI.showFloaterText(
                    LocalizationManager.getStateString("SKIP_BATTLE_END_REPLAY", Configuration.skipBattleEndReplay)
                );
                break;
            case "SKIP_REPLAY_INTRO":
                button.switchCheckbox(Configuration.skipReplayIntro);
                GUI.showFloaterText(LocalizationManager.getStateString("SKIP_REPLAY_INTRO", !Configuration.skipReplayIntro));

                Configuration.skipReplayIntro = !Configuration.skipReplayIntro;
                Configuration.save();
                break;
            case "MOVEMENT_BASED_AUTOSHOOT":
                button.switchCheckbox(Configuration.movementBasedAutoshoot);
                GUI.showFloaterText(LocalizationManager.getStateString("MOVEMENT_BASED_AUTOSHOOT", !Configuration.movementBasedAutoshoot));

                Configuration.movementBasedAutoshoot = !Configuration.movementBasedAutoshoot;
                Configuration.save();
                break;
            case "Send StartSpectate myself":
                let message = new StartSpectateMessage(MessageManager.accountId, false);

                MessageManager.sendMessage(message);
                //  MessageManager.sendMessage(new StopSpectateMessage());
                break;
            case "MARK_FAKE_LEON":
                button.switchCheckbox(Configuration.markFakeNinja);
                GUI.showFloaterText(LocalizationManager.getStateString("MARK_FAKE_NINJA", !Configuration.markFakeNinja));

                Configuration.markFakeNinja = !Configuration.markFakeNinja;
                Configuration.save();
                break;
            case "SHOW_ENEMY_AMMO":
                button.switchCheckbox(Configuration.showEnemyAmmo);
                GUI.showFloaterText(
                    LocalizationManager.getStateString("ENEMY_BULLETS", !Configuration.showEnemyAmmo)
                );

                Configuration.showEnemyAmmo = !Configuration.showEnemyAmmo;
                Configuration.save();
                break;

            case "SHOW_CHAT_BUTTON":
                button.switchCheckbox(Configuration.showChatButton);

                GUI.showFloaterText(
                    LocalizationManager.getStateString("CHAT_BUTTON", !Configuration.showChatButton)
                );

                Configuration.showChatButton = !Configuration.showChatButton;
                Configuration.save();

                if (!BattleMode.getInstance().isNull() && TeamManager.shouldShowOpenChatButton()) {
                    Debug.getOpenChatButton().visibility = Configuration.showChatButton;
                }
                break;
            default:
                console.warn("DebugMenu.battleButtonPressed:", "no case for", text);
                break;
        }
    }

    private changeThemeButtonPressed(button: GameButton) {
        let text = button.getOriginalName();

        if (text == "CURRENT_SERVER_THEME") {
            Configuration.themeId = -1;
            Configuration.save();

            // TODO: check after fucking event ends.
            const themeData = LogicDataTables.getDataById(41, GlobalID.getInstanceID(Storage.serverThemeId)) as LogicThemeData;

            if (themeData.instance.isNull()) return;

            HomeScreen.replaceTheme(themeData, themeData);

            const category = this.getCategory(EDebugCategory.CHANGE_THEME)!;

            category.buttons.forEach(function (btn) {
                if (!btn.getCheckbox().isNull())
                    btn.switchCheckbox(btn.instance.add(454).readInt() != -1);
            });

            return;
        }
        const themeData = LogicDataTables.getThemeByName(text);

        if (themeData.instance.isNull()) return;
        if (Configuration.themeId == themeData.getGlobalID() || Configuration.themeMusicId == -1) {
            Configuration.themeMusicId = themeData.getGlobalID();
        } else {
            GUI.showFloaterText(LocalizationManager.getString("DOUBLE_CLICK_TO_SET_THEME_MUSIC"));
        }

        const musicData = new LogicThemeData(LogicDataTables.getByGlobalId(Configuration.themeMusicId));

        if (themeData.instance.isNull()) return;
        Configuration.themeId = themeData.getGlobalID();
        Configuration.save();
        HomeScreen.replaceTheme(themeData, musicData);
        const intParameter = button.instance.add(454).readInt();
        const category = this.getCategory(EDebugCategory.CHANGE_THEME)!;
        category.buttons.forEach(function (btn) {
            if (!btn.getCheckbox().isNull())
                btn.switchCheckbox(btn.instance.add(454).readInt() != intParameter);
        });
    }

    private changeStatusButtonPressed(gameButton: GameButton) {
        let text = gameButton.getOriginalName();

        const intParameter = gameButton.instance.add(454).readInt();

        let category = this.getCategory(EDebugCategory.CHANGE_STATUS)!;

        category.buttons.forEach(function (btn) {
            if (!btn.getCheckbox().isNull())
                btn.switchCheckbox(btn.instance.add(454).readInt() != intParameter);
        });

        if (intParameter != -1)
            GUI.showFloaterText(LocalizationManager.getString("STATUS_CHANGED").replace("%STATUS", text));
        else
            GUI.showFloaterText(LocalizationManager.getString("STATUS_REVERTED"));

        Configuration.preferredStatus = intParameter;
        Configuration.save();
    }

    private funButtonPressed(button: GameButton) {
        let text = button.getOriginalName();

        switch (text) {
            case "PROBING_CANE_MODE":
                button.switchCheckbox(Configuration.braille);
                Configuration.braille = !Configuration.braille;

                if (this.isBrailleSwitchBegan) {
                    this.isBrailleSwitchBegan = false;
                    clearTimeout(this.brailleTimeout);

                    GUI.showFloaterText(
                        LocalizationManager.getString("BRAILLE_INTERRUPTED")
                    );
                    break;
                }

                GUI.showFloaterText(LocalizationManager.getStateString("BRAILLE", Configuration.braille));

                this.isBrailleSwitchBegan = true;
                this.brailleTimeout = setTimeout(() => {
                    if (Configuration.braille) {
                        const currentLanguage = StringTable.getCurrentLanguageCode();

                        if (!Braille.isLanguageSupported(currentLanguage)) {
                            Settings.setSelectedLanguage("EN");
                        }
                    }

                    Debug.destruct();
                    GameMain.reloadGame();
                    Configuration.save();
                }, 4000);
                break;
            case "ADVANCED_PROBING_CANE_MODE":
                button.switchCheckbox(Configuration.braille_textfield);
                Configuration.braille_textfield = !Configuration.braille_textfield;
                TextField.patch();
                break;

            case "SPAWN_DVD":
                const dvd = new DVD();
                dvd.createOnStage();
                Storage.dvd.push(dvd);
                break;

            case "REMOVE_DVD":
                if (Storage.dvd.length === 0) return;
                const _dvd = Storage.dvd[Storage.dvd.length - 1];
                _dvd.destruct();
                Storage.dvd = Storage.dvd.filter(e => !e.instance.equals(_dvd.instance));
                break;

            case "REMOVE_ALL_DVD":
                for (const dvd of Storage.dvd) {
                    dvd.destruct();
                    Storage.dvd = Storage.dvd.filter(e => !e.instance.equals(dvd.instance));
                }
                break;
        }
    }

    private gfxButtonPressed(button: GameButton) {
        let text = button.getOriginalName();
        let gameButton = button;

        switch (text) {
            case "DARK_THEME":
                gameButton.switchCheckbox(Configuration.darkTheme);
                Configuration.darkTheme = !Configuration.darkTheme;
                Configuration.save();

                if (this.isDarkThemeSwitchBegan) {
                    this.isDarkThemeSwitchBegan = false;
                    clearTimeout(this.darkThemeTimeout);

                    GUI.showFloaterText(
                        LocalizationManager.getString("DARK_THEME_INTERRUPTED")
                    );
                    break;
                }

                GUI.showFloaterText(LocalizationManager.getStateString("DARK_THEME", Configuration.darkTheme));

                this.isDarkThemeSwitchBegan = true;
                this.darkThemeTimeout = setTimeout(() => {
                    Debug.destruct();
                    GameMain.reloadGame();
                    Configuration.save();
                }, 4000);
                break;
            case "SHOW_BOT_PREFIX":
                button.switchCheckbox(Configuration.showBotPrefix);

                Configuration.showBotPrefix = !Configuration.showBotPrefix;
                Configuration.save();

                GUI.showFloaterText(
                    LocalizationManager.getStateString("BOT_PREFIX", Configuration.showBotPrefix)
                );
                break;
            case "STATIC_BACKGROUND":
                gameButton.switchCheckbox(Configuration.staticBackground);
                Configuration.staticBackground = !Configuration.staticBackground;
                Configuration.save();

                GUI.showFloaterText(
                    LocalizationManager.getStateString("STATIC_BACKGROUND", Configuration.staticBackground)
                );
                break;
            case "SHOW_EDIT_CONTROLS":
                gameButton.switchCheckbox(Configuration.showEditControls);
                Configuration.showEditControls = !Configuration.showEditControls;
                Configuration.save();

                GUI.showFloaterText(
                    LocalizationManager.getStateString("EDIT_CONTROLS", Configuration.showEditControls)
                );
                break;
            case "SHOW_BATTLE_SHORTCUTS":
                gameButton.switchCheckbox(Configuration.showBattleShortcuts);
                Configuration.showBattleShortcuts = !Configuration.showBattleShortcuts;
                Configuration.save();

                GUI.showFloaterText(
                    LocalizationManager.getStateString("BATTLE_SHORTCUTS", Configuration.showBattleShortcuts)
                );
                break;
            case "HIDE_DEBUG_ITEMS":
                gameButton.switchCheckbox(Configuration.showDebugItems);
                Configuration.showDebugItems = !Configuration.showDebugItems;
                Configuration.save();

                if (!Configuration.showDebugItems)
                    Debug.hideDebugItems();

                GUI.showFloaterText(LocalizationManager.getString(
                    Configuration.showDebugItems ? "DEBUG_ITEMS_VISIBLE" : "DEBUG_ITEMS_HIDDEN"
                ));
                break;
            case "Hide/show connection indicator":
                gameButton.switchCheckbox(Configuration.showConnectionIndicator);
                Configuration.showConnectionIndicator = !Configuration.showConnectionIndicator;
                Configuration.save();

                GUI.showFloaterText(
                    LocalizationManager.getStateString("CONNECTION_INDICATOR", Configuration.showConnectionIndicator)
                );
                break;
            case "SLOW_MODE":
                gameButton.switchCheckbox(Configuration.slowMode);
                Configuration.slowMode = !Configuration.slowMode;
                Configuration.save();

                GameMain.setSlowMode(Configuration.slowMode);

                GUI.showFloaterText(
                    LocalizationManager.getStateString("SLOW_MODE", Configuration.slowMode)
                );

                break;
            case "DISABLE_OUTLINE":
                gameButton.switchCheckbox(!Configuration.drawOutline);
                Configuration.drawOutline = !Configuration.drawOutline;

                GUI.showFloaterText(
                    LocalizationManager.getStateString("DISABLE_OUTLINE", !Configuration.drawOutline)
                );

                Configuration.save();
                break;
            case "VISUAL_CHROMATIC_NAME":
                gameButton.switchCheckbox(Configuration.fakePremiumPass);
                Configuration.fakePremiumPass = !Configuration.fakePremiumPass;
                Configuration.save();

                GUI.showFloaterText(
                    LocalizationManager.getStateString("FAKE_PREMIUM_PASS", Configuration.fakePremiumPass)
                );
                break;
            case "HIDE_SIDE_MASK":
                gameButton.switchCheckbox(!Configuration.showSidemask);
                Configuration.showSidemask = !Configuration.showSidemask;
                Configuration.save();

                GUI.showFloaterText(LocalizationManager.getStateString("SIDE_MASK", Configuration.showSidemask));
                break;
            case "FORCE_CHINA_GFX_TWEAKS":
                gameButton.switchCheckbox(Configuration.isChinaVersion);
                Configuration.isChinaVersion = !Configuration.isChinaVersion;
                Configuration.save();

                GUI.showFloaterText(
                    LocalizationManager.getStateString("CHINA_VERSION", Configuration.isChinaVersion)
                );
                break;
            case "HIDE_CREATOR_BOOST":
                gameButton.switchCheckbox(!Configuration.contentCreatorBoost);
                Configuration.contentCreatorBoost = !Configuration.contentCreatorBoost;
                Configuration.save();

                GUI.showFloaterText(
                    LocalizationManager.getStateString("CONTENT_CREATOR_BOOST", Configuration.contentCreatorBoost)
                );
                break;
            case "EMOTE_ANIMATION":
                gameButton.switchCheckbox(Configuration.emoteAnimation);
                Configuration.emoteAnimation = !Configuration.emoteAnimation;
                Configuration.save();

                if (Configuration.emoteAnimation)
                    LogicData.revertEmoteAnimationPatch();
                else
                    LogicData.patchEmoteAnimation();

                GUI.showFloaterText(
                    LocalizationManager.getStateString("EMOTE_ANIMATION", Configuration.emoteAnimation)
                );
                break;
            case "SHOW_FUTURE_EVENTS":
                gameButton.switchCheckbox(Configuration.showFutureEvents);
                Configuration.showFutureEvents = !Configuration.showFutureEvents;
                Configuration.save();

                GUI.showFloaterText(
                    LocalizationManager.getStateString("FUTURE_EVENTS", Configuration.showFutureEvents)
                );
                break;
            case "SKIP_STARR_DROP_ANIMATION":
                gameButton.switchCheckbox(Configuration.skipRandomAnimation);
                Configuration.skipRandomAnimation = !Configuration.skipRandomAnimation;
                Configuration.save();

                GUI.showFloaterText(
                    LocalizationManager.getStateString("SKIP_RANDOM_ANIMATION", Configuration.skipRandomAnimation)
                );
                break;
            case "HIDE_LOBBY_INFO":
                let visible = Debug.getLobbyInfo().visibility;

                gameButton.switchCheckbox(!visible);
                Debug.getLobbyInfo().showInfo(!visible);

                break;
            case "USE_LEGACY_BACKGROUND":
                gameButton.switchCheckbox(Configuration.useLegacyThemeMode);
                Configuration.useLegacyThemeMode = !Configuration.useLegacyThemeMode;
                Configuration.save();

                const themeMovieClip = HomeScreen.getThemeMovieClip();
                HomeScreen.setLegacyTheme(themeMovieClip, Configuration.useLegacyThemeMode);

                GUI.showFloaterText(
                    LocalizationManager.getStateString("LEGACY_BACKGROUND", Configuration.useLegacyThemeMode)
                );
                break;
            default:
                console.warn("DebugMenu.gfxButtonPressed:", "no case for", text);
                break;
        }
    }

    private gameSettingButtonPressed(button: GameButton) {
        let text = button.getOriginalName();

        switch (text) {
            case "SFX":
                GameSettings.sfxEnabled = (!GameSettings.sfxEnabled);
                button.switchCheckbox(!GameSettings.sfxEnabled);

                GUI.showFloaterText(
                    LocalizationManager.getStateString("SFX", GameSettings.sfxEnabled)
                );
                break;
            case "MUSIC":
                GameSettings.musicEnabled = (!GameSettings.musicEnabled);
                button.switchCheckbox(!GameSettings.musicEnabled);

                GUI.showFloaterText(
                    LocalizationManager.getStateString("MUSIC", GameSettings.musicEnabled)
                );
                break;
            case "HAPTICS":
                GameSettings.hapticsEnabled = (!GameSettings.hapticsEnabled);
                button.switchCheckbox(!GameSettings.hapticsEnabled);

                GUI.showFloaterText(
                    LocalizationManager.getStateString("HAPTICS", GameSettings.hapticsEnabled)
                );
                break;
        }
    }

    private latencyButtonPressed(button: GameButton) {
        let text = button.getOriginalName();

        if (text.startsWith("#")) {
            let a = text.split(" ");
            let regionId = Number(a[0].substring(1));

            LatencyManager.changeRegion(regionId);

            return;
        }

        switch (text) {
            case "DISABLE_SPOOF":
                LatencyManager.disableSpoof();

                GUI.showFloaterText(LocalizationManager.getString("BATTLE_SERVER_SPOOF_DISABLED"));
                break;
        }
    }

    private optimizationButtonPressed(button: GameButton) {
        let text = button.getOriginalName();

        switch (text) {
            case "HIDE_SPECIAL_OFFERS":
                button.switchCheckbox(!Configuration.specialOffers);

                Configuration.specialOffers = !Configuration.specialOffers;
                Configuration.save();

                GUI.showFloaterText(
                    LocalizationManager.getStateString("SPECIAL_OFFERS", !Configuration.specialOffers)
                );
                break;
            case "HIDE_BRAWLERS_IN_INTRO":
                button.switchCheckbox(Configuration.hideHeroesIntro);
                Configuration.hideHeroesIntro = !Configuration.hideHeroesIntro;
                Configuration.save();

                GUI.showFloaterText(
                    LocalizationManager.getStateString("HIDE_HEROES_INTRO", Configuration.hideHeroesIntro)
                );
                break;
            case "HIDE_LEAGUE_IN_BATTLE_CARD":
                button.switchCheckbox(Configuration.hideLeagueBattleCard);
                Configuration.hideLeagueBattleCard = !Configuration.hideLeagueBattleCard;
                Configuration.save();

                GUI.showFloaterText(
                    LocalizationManager.getStateString("HIDE_LEAGUE_BATTLE_CARD", Configuration.hideLeagueBattleCard)
                );
                break;
            case "USE_OLD_INTRO":
                button.switchCheckbox(Configuration.useOldIntro);
                Configuration.useOldIntro = !Configuration.useOldIntro;
                Configuration.save();

                GUI.showFloaterText(
                    LocalizationManager.getStateString("USE_OLD_INTRO", Configuration.useOldIntro)
                );

                LogicDataTables.patchClientGlobals();
                break;

            case "CHARACTER_SOUNDS":
                button.switchCheckbox(!Configuration.heroSounds);
                Configuration.heroSounds = !Configuration.heroSounds;
                Configuration.save();

                GameMain.reloadGame();
                break;
        }
    }

    private previewButtonPressed(button: GameButton) {
        let text = button.getOriginalName();

        switch (text) {
            case "DEBUG_OPEN_URL":
                const urlPopup = new OpenUrlPopup();

                GUI.showPopup(urlPopup.instance, 1, 0, 1);
                break;
            case "DEBUG_INFO":
                const debugInfo = Debug.createDebugInfo();
                debugInfo.addLine(MessageManager.accountInfo);
                GameMain.getGameSprite().addChild(debugInfo);

                this.hide();

                break;
        }
    }

    private proxyButtonPressed(button: GameButton) {
        let text = button.getOriginalName();

        switch (text) {
            case "NO_PROXY":
                Configuration.useProxy = false;
                Configuration.save();

                GUI.showFloaterText(LocalizationManager.getString(
                    "PROXY_DISABLED"
                ));
                break;
            case "Gene Proxy":
                Configuration.useProxy = true;
                Configuration.save();


                GUI.showFloaterText(LocalizationManager.getString(
                    "GENE_PROXY"
                ));
                break;
        }
    }

    private serverButtonPressed(button: GameButton) {
        let text = button.getOriginalName();

        switch (text) {
            case "SWITCH_TO_STAGE_SERVER":
                Configuration.useStage = true;
                Configuration.save();

                GameMain.reloadGame();
                break;
            case "SWITCH_TO_PROD_SERVER":
                Configuration.useStage = false;
                Configuration.save();

                GameMain.reloadGame();
                break;
        }
    }

    private streamerModeButtonPressed(button: GameButton) {
        let text = button.getOriginalName();

        switch (text) {
            case "HIDE_TAGS":
                button.switchCheckbox(!Configuration.showTags);
                Configuration.showTags = !Configuration.showTags;
                Configuration.save();

                GUI.showFloaterText(
                    LocalizationManager.getStateString("SHOW_TAGS", Configuration.showTags)
                );
                break;
            case "HIDE_NAME":
                button.switchCheckbox(!Configuration.showName);
                Configuration.showName = !Configuration.showName;
                Configuration.save();

                GUI.showFloaterText(
                    LocalizationManager.getStateString("SHOW_NAME", Configuration.showName)
                );
                break;
        }
    }

    private testButtonPressed(button: GameButton) {
        let text = button.getOriginalName();

        switch (text) {
            case "Spawn Test Popup":
                Debug.toggleUserImagesButtonPressed();
                break;
            case "DVD Test": // be quiet about this
                // Nothing ever happened here.
                break;

        }
    }

    private miscButtonPressed(button: GameButton) {
        let text = button.getOriginalName();

        switch (text) {
            case "BYPASS_ANTI_PROFANITY":
                if (!Configuration.antiProfanity) {
                    this.summonDebugDangerousPopup(button, this.switchBypassAntiProfanityFunction);
                    return;
                }

                this.switchBypassAntiProfanityFunction(button);
                break;
            case "CLOSE_RANKED_SCREEN":
                HomeScreen.terminateRankedMatch();
                break;
            case "PROFILE_BY_TAG":
                const profPopup = new ProfileByTagPopup();

                GUI.showPopup(profPopup.instance, 1, 0, 1);
                break;
        }
    }

    private usefulInfoButtonPressed(button: GameButton) {
        let text = button.getOriginalName();

        switch (text) {
            case "SHOW_FPS":
                button.switchCheckbox(Configuration.showFPS);
                Configuration.showFPS = !Configuration.showFPS;
                Configuration.save();

                GUI.showFloaterText(
                    LocalizationManager.getStateString("SHOW_FPS", Configuration.showFPS)
                );
                break;
            case "SHOW_TIME":
                button.switchCheckbox(Configuration.showCurrentTime);
                Configuration.showCurrentTime = !Configuration.showCurrentTime;
                Configuration.save();

                GUI.showFloaterText(
                    LocalizationManager.getStateString("SHOW_CURRENT_TIME", Configuration.showCurrentTime)
                );
                break;
            case "SHOW_SESSION_TIME":
                button.switchCheckbox(Configuration.showSessionTime);
                Configuration.showSessionTime = !Configuration.showSessionTime;
                Configuration.save();

                GUI.showFloaterText(
                    LocalizationManager.getStateString("SHOW_SESSION_TIME", Configuration.showSessionTime)
                );
                break;
            case "SHOW_OWN_TEAM":
                button.switchCheckbox(Configuration.showTeam);
                Configuration.showTeam = !Configuration.showTeam;
                Configuration.save();

                GUI.showFloaterText(
                    LocalizationManager.getStateString("SHOW_TEAM", Configuration.showTeam)
                );
                break;
            case "SHOW_BATTLE_INFO":
                button.switchCheckbox(Configuration.showBattleInfo);

                Configuration.showBattleInfo = !Configuration.showBattleInfo;
                Configuration.save();

                GUI.showFloaterText(
                    LocalizationManager.getStateString("BATTLE_INFO", Configuration.showBattleInfo)
                );
                break;
            case "Show svo button":
                button.switchCheckbox(Configuration.showSVOButton);

                Configuration.showSVOButton = !Configuration.showSVOButton;
                Configuration.save();

                Debug.getSVOButton().visibility = Configuration.showSVOButton;
                break;
            case "SHOW_BATTLE_PING":
                button.switchCheckbox(Configuration.showBattlePing);

                Configuration.showBattlePing = !Configuration.showBattlePing;
                Configuration.save();

                GUI.showFloaterText(
                    LocalizationManager.getStateString("BATTLE_PING", Configuration.showBattlePing)
                );
                break;
            case "SHOW_TICKS":
                button.switchCheckbox(Configuration.showTicks);

                Configuration.showTicks = !Configuration.showTicks;
                Configuration.save();

                GUI.showFloaterText(
                    LocalizationManager.getStateString("SHOW_TICKS", Configuration.showTicks)
                );
                break;
            case "CHANGELOGS":
                NativeDialog.showNativeDialog(
                    NULL,
                    LocalizationManager.getString("CHANGELOGS_DIALOG_TITLE"),
                    LocalizationManager.changelogs,
                    LocalizationManager.getString("CHANGELOGS_DIALOG_BUTTON")
                );
                break;
        }
    }

    private xrayButtonPressed(button: GameButton) {
        let text = button.getOriginalName();

        // text - playerName

        if (text == "Disable X-Ray") {
            GUI.showFloaterText(
                LocalizationManager.getString("XRAY_OFF")
            );

            BattleMode.xrayTargetGlobalId = -1;
            BattleMode.xrayTargetPlayerIndex = -1;

            return;
        }

        BattleMode.setXrayTarget(text);
    }

    isButtonAvailable(name: string): boolean {
        if (DebugMenu.isNotImplemented(name)) {
            if (LogicVersion.isDeveloperBuild()) {
                console.warn("DebugMenu.isButtonAvailable", name, "is not implemented!");
                return true;
            }

            GUI.showFloaterText(LocalizationManager.getString("NOT_IMPLEMENTED_YET"));
            return false;
        }

        if (LogicDefines.isPlatformAndroid() && DebugMenu.isNotImplementedForAndroid(name)) {
            if (LogicVersion.isDeveloperBuild()) {
                console.warn("DebugMenu.isButtonAvailable", name, "is not implemented for Android!");
            }

            GUI.showFloaterText(LocalizationManager.getString("NOT_IMPLEMENTED_YET_ANDROID"));
            return false;
        }

        if (LogicDefines.isPlatformIOS() && DebugMenu.isNotImplementedForIOS(name)) {
            if (LogicVersion.isDeveloperBuild()) {
                console.warn("DebugMenu.isButtonAvailable", name, "is not implemented for iOS!");
            }

            GUI.showFloaterText(LocalizationManager.getString("NOT_IMPLEMENTED_YET_IOS"));
            return false;
        }

        return true;
    }

    buttonPressed(listener: NativePointer, button: NativePointer): void {
        let debugMenu = Debug.getDebugMenu();

        let gameButton = new GameButton(button);
        let name = gameButton.getOriginalName();

        if (!debugMenu.isButtonAvailable(name)) {
            return;
        }

        let category = button.add(498).readPointer().fromsc();

        console.log("DebugMenu::buttonPressed:", gameButton.getTextString(), "(category:", category + ")");

        switch (category) {
            case "ACCOUNT":
                debugMenu.accountButtonPressed(gameButton);
                break;
            case "BATTLE":
                debugMenu.battleButtonPressed(gameButton);
                break;
            case "CAMERA_MODE":
                debugMenu.cameraModeButtonPressed(gameButton);
                break;
            case "CHANGE_THEME":
                debugMenu.changeThemeButtonPressed(gameButton);
                break;
            case "CHANGE_STATUS":
                debugMenu.changeStatusButtonPressed(gameButton);
                break;
            case "FUN":
                debugMenu.funButtonPressed(gameButton);
                break;
            case "GFX":
            case "PRC_CHINA":
                debugMenu.gfxButtonPressed(gameButton);
                break;
            case "GAME_SETTINGS":
                debugMenu.gameSettingButtonPressed(gameButton);
                break;
            case "LATENCY":
                debugMenu.latencyButtonPressed(gameButton);
                break;
            case "OPTIMIZATION":
                debugMenu.optimizationButtonPressed(gameButton);
                break;
            case "PREVIEW":
                debugMenu.previewButtonPressed(gameButton);
                break;
            case "PROXY":
                debugMenu.proxyButtonPressed(gameButton);
                break;
            case "SERVERS":
                debugMenu.serverButtonPressed(gameButton);
                break;
            case "STREAMER_MODE":
                debugMenu.streamerModeButtonPressed(gameButton);
                break;
            case "TESTS":
                debugMenu.testButtonPressed(gameButton);
                break;
            case "USEFUL_INFO":
                debugMenu.usefulInfoButtonPressed(gameButton);
                break;
            case "XRAY":
                debugMenu.xrayButtonPressed(gameButton);
                break;
            case "MISC":
                debugMenu.miscButtonPressed(gameButton);
                break;
            default:
                console.warn("DebugMenu.buttonPressed:", "no case for", category);
                break;
        }

        switch (name) {
            case "RESTART_GAME":
                Debug.destruct();
                GameMain.reloadGame();
                break;
        }
    }

    createDebugMenuButton(name: string, actionIdx: number = -1, intParameter: number = -1, btnType: number = 0, category?: EDebugCategory, state: number | boolean = -1, callback?: Function, translate = true) {
        let movieClip = ResourceManager.getMovieClip(Resources.DEBUG, "debug_menu_item");
        let checkBox: MovieClip | null = null;
        let localizedName = translate ? LocalizationManager.getString(name) : name;

        if (state != -1) {
            try {
                if (GeneAssets.wasLoaded(Resources.GENE_DEBUG)) {
                    let anotherMovieClip = ResourceManager.getMovieClip(Resources.GENE_DEBUG, "debug_menu_checkbox");

                    checkBox = anotherMovieClip.getChildById(2);
                    checkBox.instance.add(Process.pointerSize).writeU8(Number(state));
                    movieClip.addChild(checkBox);
                }
                else {
                    console.warn("DebugMenu.spawnDebugMenuButton:", "Resources.GENE_DEBUG wasn't loaded!");
                }
            } catch (e) {
                console.error("GENE_DEBUG not loaded!");
            }
        }

        let categoryName = category ? EDebugCategory[category] : "";

        if (actionIdx != -1) {
            let debugCmdButton = new DebugCommandButton(actionIdx, intParameter, btnType);
            debugCmdButton.setMovieClip(movieClip);
            debugCmdButton.instance.add(498).writePointer(categoryName ? categoryName.scptr() : "".scptr());

            /// #if DEBUG
            if (LogicVersion.isDeveloperBuild()) {
                localizedName += ` (<c3>action</c>=${actionIdx} <c5>intP</c>=${intParameter})`;
            }
            /// #endif

            debugCmdButton.setOriginalName(name);
            debugCmdButton.setText(localizedName);

            this.addButton(debugCmdButton, category);
        }

        else {
            let button = new GameButton();
            button.setMovieClip(movieClip);

            let formattedName = localizedName;

            if (DebugMenu.dangerousFunctions.includes(name)) {
                formattedName = `<cff0000>${localizedName}</c>`;
            }

            button.setText(formattedName);
            button.instance.add(454).writeInt(intParameter);

            button.instance.add(490).writePointer(localizedName.scptr());

            button.instance.add(498).writePointer(categoryName ? categoryName.scptr() : "".scptr());

            if (checkBox) {
                button.setCheckbox(checkBox.instance);
            }

            button.setOriginalName(name);

            this.addButton(button, category);

            if (callback && this.isButtonAvailable(localizedName)) {
                button.setButtonListener(new IButtonListener(callback));
            }
        }
    }

    private cameraModeButtonPressed(gameButton: GameButton) {
        let text = gameButton.getOriginalName();

        switch (text) {
            case "3D":
            case "NEXT_CAMERA_MODE":
                Configuration.battleCammeraMode++;
                if (Configuration.battleCammeraMode > 3)
                    Configuration.battleCammeraMode = 0;

                Configuration.save();

                GUI.showFloaterText(
                    LocalizationManager.getString("CAMERA_MODE_CHANGED").replace(
                        "{cameraMode}",
                        LocalizationManager.getString("CAMERA_MODE_" + Configuration.battleCammeraMode)
                    )
                );

                break;
        }
    }

    private switchBypassAntiProfanityFunction(button: GameButton) {
        Configuration.antiProfanity = !Configuration.antiProfanity;
        Configuration.save();
        button.switchCheckbox(!Configuration.antiProfanity);
        GUI.showFloaterText(
            LocalizationManager.getStateString("ANTI_PROFANITY", Configuration.antiProfanity)
        );
    }

    private summonDebugDangerousPopup(button: GameButton, executeFunction: Function) {
        const dangerous = new DebugDangerousFunctionPopup(button.getText().removeColorCodes());

        dangerous.addYesButton(() => {
            executeFunction(button);
        });

        GUI.showPopup(dangerous.instance, 1, 0, 1);
    }
}
// ============================================================
// FILE: src/gene/debug/DebugMenuBase.ts
// ============================================================
import {DropGUIContainer} from "../../titan/flash/gui/DropGUIContainer";
import {ScrollArea} from "../../titan/flash/ScrollArea";
import {Stage} from "../../titan/flash/Stage";
import {GameButton} from "../../titan/flash/gui/GameButton";
import {DebugCommandButton} from "./DebugCommandButton";
import {IButtonListener} from "../../titan/flash/gui/IButtonListener";
import {DebugMenuCategory, EDebugCategory} from "./DebugMenuCategory";
import {Resources} from "../Resources";
import {LocalizationManager} from "../localization";

export class DebugMenuBase extends DropGUIContainer {
    scrollArea: ScrollArea;
    protected tabScrollArea?: ScrollArea;
    protected shouldUpdateLayout: boolean;
    protected buttons: GameButton[];

    constructor(exportName: string) {
        super(Resources.DEBUG, exportName);

        this.buttons = [];

        let v8 = 0.1;

        let v9 = Stage.getSafeMarginLeft();
        let v10 = Stage.getSafeMarginRight();
        if (Stage.getPointSize() != 0.0) {
            v8 = Stage.getPointSize();
        }
        let v11 = (Stage.getOffset340() - ((Stage.getSafeMarginBottom() + Stage.getSafeMarginTop()) / v8));
        let v12 = Stage.getOffset336();
        let v13 = this.getHeight();

        this.setScale(v11 / v13);

        let v14 = (v12 - (v10 + v9) / v8);

        this.setPixelSnappedXY(v14, 0.0);


        let itemArea = this.getMovieClip().getTextFieldByName("item_area");
        let itemWidth = itemArea!.getWidth();
        let itemHeight = itemArea!.getHeight();

        this.scrollArea = new ScrollArea(itemWidth, itemHeight + - 5.0, 1);
        this.scrollArea.setUnk(true);

        let itemX = itemArea!.x;
        let itemY = itemArea!.y;

        this.scrollArea.setXY(itemX, itemY + 5.0);
        this.scrollArea.enablePinching(false);
        this.scrollArea.setAlignment(4);
        this.scrollArea.enableHorizontalDrag(false);

        this.movieClip.addChild(this.scrollArea);
        let tabArea = this.movieClip.getTextFieldByName("tab_area");
        if (tabArea) {
            this.tabScrollArea = new ScrollArea(tabArea!.getWidth(), tabArea!.getHeight(), 1);
            this.tabScrollArea.setUnk(true);

            this.tabScrollArea.setXY(tabArea!.x, tabArea!.y);
            this.tabScrollArea.enablePinching(false);
            this.tabScrollArea.setAlignment(8);
            this.tabScrollArea.enableHorizontalDrag(true);
            this.tabScrollArea.enableVerticalDrag(false);

            this.movieClip.addChild(this.tabScrollArea);
        }

        this.movieClip.setChildVisible("clear_button", false);
        this.movieClip.setChildVisible("debug_menu_input_button", true);

        this.createCategory(" ", EDebugCategory.MAIN);
        this.shouldUpdateLayout = false;
    }

    needToUpdateLayout() {
        this.shouldUpdateLayout = true;
    }

    buttonPressed(listener: NativePointer, button: NativePointer) {
        console.log("DebugMenuBase::buttonPressed: should be OVERRIDEN!");
    }

    createCategory(categoryName: string, enumeration: EDebugCategory): DebugMenuCategory {
        let category = new DebugMenuCategory(categoryName, enumeration);
        this.buttons.push(category);
        return category;
    }

    getCategory(enumeration: EDebugCategory): DebugMenuCategory | null {
        let category: DebugMenuCategory | null = null;

        this.buttons.forEach(function (btn) {
            if (btn instanceof DebugMenuCategory) {
                if ((btn as DebugMenuCategory).enumeration == enumeration) {
                    category = btn;
                    return;
                }
            }
        });

        return category;
    }

    removeCategory(enumeration: EDebugCategory) {
        this.buttons = this.buttons.filter((btn) => {
            if (btn instanceof DebugMenuCategory) {
                return btn.enumeration != enumeration;
            }
            return true;
        });

        this.needToUpdateLayout();
    }

    addButton(button: GameButton | DebugCommandButton, categoryEnum?: EDebugCategory) {
        if (!(button instanceof DebugCommandButton)) {
            button.setButtonListener(new IButtonListener(this.buttonPressed));
        }

        if (categoryEnum) {
            let category: DebugMenuCategory | null = this.getCategory(categoryEnum);
            if (!category) {
                const categoryTranslation = LocalizationManager.getString(
                    EDebugCategory[categoryEnum]
                );
                category = this.createCategory(categoryTranslation, categoryEnum);
            }

            category.buttons.push(button);
        }

        else
            this.buttons.push(button);
    }

    setTitle(title: string) {
        this.setText("title", title);
    }

    update(deltaTime: number): void {
        if (this.shouldUpdateLayout) {
            this.updateLayout();
        }

        this.scrollArea.update(deltaTime);
        this.tabScrollArea?.update(deltaTime);
    }

    private updateLayout() {
        const self = this;

        this.tabScrollArea?.removeAllContent();
        this.scrollArea.removeAllContent();

        if (this.tabScrollArea) {
            let i = 0;

            this.buttons.forEach(function (btn) {
                if (btn instanceof DebugMenuCategory) {
                    btn.mini.setXY(i * 45.0 + 20.0, 25);

                    self.tabScrollArea!.addContent(btn.mini);

                    i += 1;
                }
            });
        }

        let Y = 0.0;

        this.buttons.forEach(function (btn) {
            if (btn instanceof DebugMenuCategory) {
                let categoryButtons = btn.sortButtons();
                if (categoryButtons.length > 0) {
                    let width = btn.getWidth();
                    let height = btn.getHeight();

                    btn.setXY(width * 0.5, Y + (height * 0.5));

                    self.scrollArea.addContent(btn);

                    Y += 8.0 + height;

                    let prefix = btn.isCategoryOpened() ? "- " : "+ ";

                    btn.setText(prefix + btn.name);

                    if (btn.isCategoryOpened()) {
                        categoryButtons.forEach(function (a) {
                            let width = a.getWidth();
                            let height = a.getHeight();

                            a.setXY(width * 0.5, Y + (height * 0.5));

                            self.scrollArea.addContent(a);

                            Y += 8.0 + height;
                        });
                    }
                }
            }
            else {
                let width = btn.getWidth();
                let height = btn.getHeight();

                btn.setXY(width * 0.5, Y + (height * 0.5));

                self.scrollArea.addContent(btn);

                Y += 8.0 + height;
            }
        });

        this.shouldUpdateLayout = false;
    }

    destruct() {
        this.scrollArea.removeAllContent();
        this.tabScrollArea?.removeAllContent();
    }

    toggle() {
        this.visibility ? this.hide() : this.show();
    }
}
// ============================================================
// FILE: src/gene/debug/DebugMenuCategory.ts
// ============================================================
import {GameStateManager} from "../../laser/client/state/GameStateManager";
import {GameButton} from "../../titan/flash/gui/GameButton";
import {IButtonListener} from "../../titan/flash/gui/IButtonListener";
import {ResourceManager} from "../../titan/ResourceManager";
import {Debug} from "../Debug";
import {Resources} from "../Resources";
import {DebugCommandButton} from "./DebugCommandButton";

export enum EDebugCategory {
    MAIN,
    ACCOUNT,
    BATTLE,
    LATENCY,
    CAMERA_MODE,
    CHANGE_THEME,
    FUN,
    GFX,
    PRC_CHINA,
    GAME_SETTINGS,
    OPTIMIZATION,
    PROXY,
    SC_UTILS,
    SERVERS,
    SKIN_CHANGER,
    TESTS,
    USEFUL_INFO,
    XRAY,
    MISC,
    PREVIEW,
    SC_ID,
    BRAWL_PASS,
    CHALLENGE,
    STREAMER_MODE,
    SPAM,
    GEARS,
    CHANGE_STATUS,
    EXPERIMENTAL
}

export class DebugMenuCategory extends GameButton {
    name: string;
    enumeration: EDebugCategory;
    mini: GameButton;
    buttons: GameButton[];

    constructor(name: string, enumeration: EDebugCategory) {
        super();

        this.setMovieClip(ResourceManager.getMovieClip(Resources.DEBUG, "debug_menu_category"));

        this.mini = new GameButton();
        this.mini.setMovieClip(ResourceManager.getMovieClip(Resources.DEBUG, "debug_menu_category_mini"));
        this.mini.setText(name.substring(0, 3));

        this.name = name;
        this.enumeration = enumeration;
        this.buttons = [];

        this.instance.add(449).writeU8(0);

        this.setButtonListener(new IButtonListener(this.buttonPressed));
        this.mini.setButtonListener(new IButtonListener(this.buttonPressed));
    }

    isCategoryOpened(): boolean {
        return Boolean(this.instance.add(449).readU8());
    }

    private buttonPressed(listener: NativePointer, button: NativePointer) {
        console.log("DebugMenuCategory::buttonPressed!");

        let dm = Debug.getDebugMenu();

        let gameButton = new GameButton(button);

        let y = gameButton.y;
        let height = gameButton.getHeight();

        dm.scrollArea.scrollTo(0.0, (y + - 5.0) + ((dm.scrollArea.instance.add(112).readFloat() - height) * 0.5), 1.0, 0.2);

        button.add(449).writeU8(Number(!button.add(449).readU8()));

        dm.needToUpdateLayout();
    }

    sortButtons(): GameButton[] {
        let buttons: GameButton[] = [];

        this.buttons.forEach(function (btn) {
            if (btn instanceof DebugCommandButton && !GameStateManager.isState(4)) {
                return;
            }

            buttons.push(btn);
        });

        return buttons;
    }
}
// ============================================================
// FILE: src/gene/debug/DebugSliderComponent.ts
// ============================================================
import {ResourceManager} from "../../titan/ResourceManager";
import {GameSliderComponent} from "../../titan/flash/gui/GameSliderComponent";
import {Resources} from "../Resources";

export class DebugSliderComponent extends GameSliderComponent {
    sliderName: string;
    private callback: Function;

    constructor(sliderName: string, x: number, y: number, updateCallback: Function) {
        const editControlsUi = ResourceManager.getMovieClip(Resources.UI, "edit_controls_ui");
        editControlsUi.setChildVisible("slider_opacity", false);

        const sliderScale = editControlsUi.getChildByName("slider_scale");
        sliderScale.setXY(x, y);

        const button = sliderScale.getChildByName("slider_button");

        super(sliderScale, button, 1);

        this.sliderName = sliderName;

        this.setValueBounds(0, 100);
        this.setXY(x, y);

        sliderScale.setText("TID_EDIT_SCALE", sliderName);

        this.callback = updateCallback;
    }

    override update() {
        super.update();

        this.callback(this);
    }
}
// ============================================================
// FILE: src/gene/debug/OpenChatButton.ts
// ============================================================
import {TeamManager} from "../../logic/home/team/TeamManager";
import {GameButton} from "../../titan/flash/gui/GameButton";
import {IButtonListener} from "../../titan/flash/gui/IButtonListener";
import {Stage} from "../../titan/flash/Stage";
import {ResourceManager} from "../../titan/ResourceManager";
import {Resources} from "../Resources";

export class OpenChatButton extends GameButton {
    constructor() {
        super();

        const chatMovieClip = ResourceManager.getMovieClip(Resources.UI, "gameroom_party_mode");
        const drawer = chatMovieClip.getChildByName("button_chat");
        const movieClip = drawer.getChildById(1);

        this.setMovieClip(movieClip);
        //this.setText("Chat"); 

        let v8 = Stage.getPointSize() != 0.0 ? Stage.getPointSize() : 0.1;
        let v11 = (Stage.getOffset340() - ((Stage.getSafeMarginBottom() + Stage.getSafeMarginTop()) / v8)) - 20;

        const v13 = this.getWidth();
        const v14 = (Stage.getOffset336() - (Stage.getSafeMarginRight() + Stage.getSafeMarginLeft()) / v8);

        this.setXY(v14 - v13, v11);
        this.visibility = false;

        this.setButtonListener(new IButtonListener(this.callback));
    }

    protected callback(listener: NativePointer, button: NativePointer) {
        console.log("OpenChatButton::callback called!");
        TeamManager.openTeamChat();
    }
}
// ============================================================
// FILE: src/gene/debug/SVOButton.ts
// ============================================================
import {GameButton} from "../../titan/flash/gui/GameButton";
import {GUI} from "../../titan/flash/gui/GUI";
import {IButtonListener} from "../../titan/flash/gui/IButtonListener";
import {Stage} from "../../titan/flash/Stage";
import {ResourceManager} from "../../titan/ResourceManager";
import {Configuration} from "../Configuration";
import {Resources} from "../Resources";

export class SVOButton extends GameButton {
    constructor() {
        super();

        this.setMovieClip(ResourceManager.getMovieClip(Resources.DEBUG, "debug_button"));
        this.setText("TEST");

        let v8 = Stage.getPointSize() != 0.0 ? Stage.getPointSize() : 0.1;
        let v11 = (Stage.getOffset340() - ((Stage.getSafeMarginBottom() + Stage.getSafeMarginTop()) / v8)) - 50;

        this.setXY(0, v11);
        this.visibility = Configuration.showSVOButton;

        this.setButtonListener(new IButtonListener(this.callback));
    }

    protected callback(listener: NativePointer, button: NativePointer) {
        console.log("SVOButton::callback");



        GUI.showFloaterText("bomb!");
    }
}
// ============================================================
// FILE: src/gene/debug/ToggleDebugClickerButton.ts
// ============================================================
import {GameButton} from "../../titan/flash/gui/GameButton";
import {IButtonListener} from "../../titan/flash/gui/IButtonListener";
import {Debug} from "../Debug";

export class ToggleDebugClickerButton extends GameButton {
    constructor() {
        super();

        this.setButtonListener(new IButtonListener(this.callback));
    }

    callback() {
        console.log("ToggleDebugClickerButton::callback");

        Debug.toggleDebugClickerButtonPressed();
    }
}
// ============================================================
// FILE: src/gene/debug/ToggleDebugMenuButton.ts
// ============================================================
import {GameButton} from "../../titan/flash/gui/GameButton";
import {IButtonListener} from "../../titan/flash/gui/IButtonListener";
import {Debug} from "../Debug";

export class ToggleDebugMenuButton extends GameButton {
    constructor() {
        super();

        this.setButtonListener(new IButtonListener(this.callback));
    }

    callback() {
        console.log("ToggleDebugMenuButton::callback");

        Debug.toggleDebugButtonPressed();
    }
}
// ============================================================
// FILE: src/gene/features/Braille.ts
// ============================================================
const engDict: string = "qwertyuiopasdfghjklzxcvbnm" + "1234567890" + "QWERTYUIOPASDFGHJKLZXCVBNM";
const rusDict: string = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя" + "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
const brailleDict: string = "⠟⠺⠑⠗⠞⠽⠥⠊⠕⠏⠁⠎⠙⠋⠛⠓⠚⠅⠇⠵⠭⠉⠧⠃⠝⠍" +
    "⠂⠆⠒⠲⠢⠖⠶⠦⠔⠴" +
    "⠠⠟⠠⠺⠠⠑⠠⠗⠠⠞⠠⠽⠠⠥⠠⠊⠠⠕⠠⠏⠠⠁⠠⠎⠠⠙⠠⠋⠠⠛⠠⠓⠠⠚⠠⠅⠠⠇⠠⠵⠠⠭⠠⠉⠠⠧⠠⠃⠠⠝⠠⠍";

const allDict = engDict + rusDict;
const allBrailleDict = brailleDict + brailleDict;

const toBraille: { [key: string]: string; } = Object.fromEntries(allDict.split('').map((char, index) => [char, allBrailleDict[index]]));
const fromBraille: { [key: string]: string; } = Object.fromEntries(allBrailleDict.split('').map((char, index) => [char, allDict[index]]));

const ignored: string[] = [
    "t.me/gene_land",
];

export class Braille {
    static to(text: string): string {
        if (ignored.includes(text)) return text;

        return Braille.processTextWithTags(text, (plainText) =>
            plainText.toLowerCase().split('').map(char => toBraille[char] || char).join('')
        );
    }

    static from(text: string): string {
        return Braille.processTextWithTags(text, (plainText) =>
            plainText.split('').map(char => fromBraille[char] || char).join('')
        );
    }

    static isLanguageSupported(language: string): boolean {
        return Braille.getSupportedLanguages().includes(language);
    }

    static getSupportedLanguages(): string[] {
        return ["EN", "RU"];
    }

    private static processTextWithTags(
        text: string,
        transformFn: (plainText: string) => string
    ): string {
        const regex = /(<[^>]+>|[^<]+)/g;
        return text.replace(regex, (match) => {
            if (match.startsWith('<') && match.endsWith('>')) {
                return match;
            }
            return transformFn(match);
        });
    }
}
// ============================================================
// FILE: src/gene/features/ChatCommandHandler.ts
// ============================================================
import {Libg} from "../../libs/Libg";
import {SCString} from "../../titan/utils/SCString";
import {CommandsHandler} from "../chatcommands/CommandsHandler";
import {Configuration} from "../Configuration";
import {Constants} from "../Constants";
import {LocalizationManager} from "../localization/index";
import {TeamChatMessage_encode} from "./TeamSpam";

const ChatToAllianceStreamMessage_encode = new NativeFunction( // 14315 below ctor
    Libg.offset(0x0, 0x4819F0), 'void', ['pointer']
);

const messageOffset = 144;

export class ChatCommandHandler {
    private static async handleMessage(message: NativePointer) {
        if (message.isNull())
            return false;

        let textMessage = message.fromsc();

        if (textMessage.startsWith("/")) {
            const command = textMessage.split(" ")[0].replace("/", "");
            const args = textMessage.split(" ").slice(1).map((arg: any) => isNaN(arg) ? arg : Number(arg));

            let executionResult = CommandsHandler.execute(command, args);

            switch (executionResult) {
                case "NO_COMMAND_DEFINED":
                    executionResult = LocalizationManager.getString("NO_COMMAND_DEFINED");
                    break;
                case "":
                    executionResult = "OK!";
                    break;
                default:
                    executionResult = executionResult.split(" ").length === 1 ?
                        LocalizationManager.getString(executionResult) :
                        executionResult;
                    break;
            }

            message.scptr(executionResult);
            return true;
        }

        return true;
    }

    static patch(): void {
        CommandsHandler.load();

        Interceptor.replace(TeamChatMessage_encode, new NativeCallback(async function (message) {
            const shouldSendMessage = await ChatCommandHandler.handleMessage(message.add(messageOffset));
            ChatCommandHandler.antiCensorshipBypass(message.add(messageOffset));

            if (shouldSendMessage) TeamChatMessage_encode(message);
        }, 'void', ['pointer']));

        Interceptor.replace(ChatToAllianceStreamMessage_encode, new NativeCallback(async function (message) {
            const shouldSendMessage = await ChatCommandHandler.handleMessage(message.add(messageOffset).readPointer());
            ChatCommandHandler.antiCensorshipBypass(message.add(messageOffset).readPointer());

            if (shouldSendMessage) ChatToAllianceStreamMessage_encode(message);
        }, 'void', ['pointer']));
    }

    private static antiCensorshipBypass(message: NativePointer): void {
        if (!Configuration.antiProfanity) return; // FIXME: remove check when fixed

        let messageText: string = message.fromsc();

        const result = messageText.split("").join(Constants.ANTIPROFANITY_BYTES) + "\x00";

        SCString.setContent(message, result);
    }

    private static addCombiningCharacters(text: string): string {
        const combiningChar = '\uFE00';
        return text.split('').map(char => char + combiningChar).join('');
    }
}
// ============================================================
// FILE: src/gene/features/DVD.ts
// ============================================================
import {GameMain} from "../../laser/client/GameMain";
import {Libc} from "../../libs/Libc";
import {MovieClip} from "../../titan/flash/MovieClip";
import {Stage} from "../../titan/flash/Stage";
import {GeneAssets} from "../GeneAssets";

export class DVD extends MovieClip {
    xSpeed: number = 5;
    ySpeed: number = 5;
    width: number;
    height: number;
    scale: number = 0;
    createdOnStage: boolean = false;

    constructor() {
        const wheelchair = GeneAssets.getAsset("WHEELCHAIR");

        wheelchair.setWidth(100);
        wheelchair.setHeight(100);

        super(wheelchair.instance);

        this.setXY(this.x, this.y);
        this.playOnce();
        this.width = this.getWidth();
        this.height = this.getHeight();
        this.scale = 1;
    }

    update() {
        this.x += this.xSpeed;
        this.y += this.ySpeed;

        this.checkHitBox();
    }

    checkHitBox() {
        if (this.x + this.width * this.scale >= Stage.getX() * 2 || this.x < 0) {
            this.xSpeed *= -1;
        }

        if (this.y + this.height * this.scale >= Stage.getY() * 2 || this.y < 0) {
            this.ySpeed *= -1;
        }
    }

    createOnStage() {
        if (this.createdOnStage) return;
        this.createdOnStage = true;

        GameMain.getHomeSprite().addChild(this.instance);
    }

    destruct() {
        this.createdOnStage = false;

        GameMain.getHomeSprite().removeChild(this.instance);
        Libc.free(this.instance);
    }
}
// ============================================================
// FILE: src/gene/features/GradientNickname.ts
// ============================================================
import {Configuration} from "../Configuration";
import {Libg} from "../../libs/Libg";
import {LogicData} from "../../logic/data/LogicData";
import {Mathematics} from "../../utils/Mathematics";

interface Nicknames { [key: string]: string; }

const LogicPlayerTitleData_getTitleTID = new NativeFunction( // "TitleTID"
    Libg.offset(0x0, 0x404500), 'pointer', ['pointer']
);

// TODO: Custom titles for geneteam members

export class GradientNickname {
    static players: Nicknames = {
        "P9JGPPLYQ": "<c0095ff>R<c00aaff>o<c00bfff>m<c00d4ff>a<c00e9ff>s<c00fefe>h<c00d4ff>k<c00aaff>a<c007fff>G<c0055ff>e<c002aff>n<c0004fe>e</c>", // prod
        "82Y9YL-stage": "<cff002a>R<cff0054>o<cff007f>m<cff00a9>a<cff00d4>s<cfe00fe>h<cd400ff>k<caa00ff>a<c7f00ff>G<c5500ff>e<c2a00ff>n<c0400fe>e</c>", // stage
        "82YQPP-stage": "<cff002a>R<cff0054>o<cff007f>m<cff00a9>a<cff00d4>s<cfe00fe>h<cd400ff>k<caa00ff>a<c7f00ff>G<c5500ff>e<c2a00ff>n<c0400fe>e</c>", // stage
        "UCVL2GUV": "<cff003f>h<cff007f>p<cff00bf>d<cff00ff>e<cbf00ff>v</c>", // hpdev
        "8GCQYL2VL": "<cff891b>h<cff9b37>p<cffac53>d<cffbe6f>e<cffce93>v<cffdeb7>f<cffeedb>o<cfffff1>x</c>", // hpdev
        "VPYGJVJ0": "<cff002a>k<cff0054>i<cff007f>t<cff00a9>e<cff00d4>n<cfe00fe>o<cff00ff>k<cd400ff>g<caa00ff>e<c7f00ff>n<c5500ff>e</c>", // kitenokgene
        "YPCCCJCU": "<cff003f>T<cff007f>o<cff00bf>y<cff00ff>t<cff00ff>y<cbf00ff>i<c7f00ff>s</c>", // toytyis
        "2RGGJPLQU": "<cba0000>t<cd10000>a<ce80000>i<cff0000>l<cff0000>s<cd40006>j<caa010c>s</c>", // tailsjs main (prod)
        "8JGP090P": "<cc20000>Т<ce00000>е<cff0000>й<cff0000>л<cc60008>з</c>", // tailsjs alt (prod)
        "880GGPPL": "<c0032ff>U<c0065ff>m<c0098ff>o<c00cbff>r<c00ffff>i<c00ffff>s<c00ffcc>t<c00ff99>4<c00ff66>7</c>", // umorist
        "QUJPVU0L": "<cdb84fe>B<cd377fe>r<ccb69fe>e<cc45cfe>a<ccf77fe>d<cda92fe>D<ce5adfe>E<cf1c9fe>V</c>", // prod (bread main)
        "PQL90VLR9": "<ccf27c7>B<cdf1ada>r<cef0dec>e<cff00ff>a<cca04eb>d<c9609d7>D<c610dc3>E<c2d12af>V</c>", // prod (bread alt)
        "Y8UGUCPY9": "<cffff24>A<cffff48>z<cffff6d>o<cfefe91>t<cffffb6>i<cffffda>c<cfffffe>a<cfffff1>l<cfffada>L<cfff5b6>i<cfff091>g<cfeeb6d>h<cffe648>t</c>", // AzoticalLight
        "PL2RU2U": "<ce6a4fe>З<cebb6fe>а<cf0c8fe>р<cf5dafe>в<cfaecfe> <cfefefe>ф<cffffff>е<cfaecfe>м<cf5dafe>б<cf0c8fe>о<cebb6fe>й</c> 💞", // Zarv
        "9VUR0YR8J": "<cFF0000>B<c00FF99>O<cFF3366>O<c9900FF>K<c00CC33>L<c00FFFF>O<cFF3399>G<cFFFF00>I<c66FF33>N</c>", // BOOKLOGIN
        "9P0R2YC2Q": "<cfde423>H<cfdd509>e<cfdbf01>d<cfea603>g<cfe9304>e</c>", // Hedge,
        "9PJ0L99UV": "<cff7b1c>м<cff8623>и<cff922a>м<cff9d30>и<cffa937>м<cffb43e>а<cffc045>м<cffcb4b>о<cffd752>м<cffe259>у</c>", //старый мой должок
        "20V9U2CYR0": "<c002aff>к<c0054ff>о<c007fff>к<c00a9ff>с<c00d4ff> <c00fefe>4<c00ffd4>8<c00ffaa> <c00ff7f>г<c00ff55>р<c00ff2a>а<c00fe04>м</c>",
        "82LVCQCRG": "<ce1429b>l<cdc49bc>o<cd750dd>s<cd357fe>t<cac63fe>o<c866ffe>s<c607bfe>h<c3a87fe>a</c>",
        "P8LCCRJ2C": "<c2a2aff>C<c5454ff>H<c7f7fff>I<ca9a9ff>T<cd4d4ff>A<cfefefe>V<cffffff>A<cffd4ff>G<cffaaff>E<cff7fff>N<cff55ff>E</c>🦽",
        "2VYYGUUJQ": "<c0423ff>Б<c0423ff>у<cfcff01>с<cfcff01>т</c>",
        "282LG9LYG": "<cff0032>я<cff0065> <cff0098>т<cff00cb>я<cff00ff>н<cff00ff>о<ccc00ff>ч<c9900ff>к<c6600ff>а</c>",
        "8JPY9VV8G": "<cc4eacc>B<cd2e8d0>a<ce0e6d5>d<ceee4d9>Z<cfde2de>i<cfde2de>k<cf4cfdb>o<cebbcd8>s<ce2aad5>?</c>",
        "P9UJ8PPV8": "<cff0032>r<cff0065>e<cff0098>:<cff00cb>:<cff00ff>T<ccc00ff>h<c9900ff>K<c6600ff> <c3300ff>:<c0100ff>3</c>",
        "UPPR2RL0": "<c3d263b>B<c682341>O<c932047>O<cbf1d4d>K<cea1b53>L<cea1b53>O<ce93365>G<ce94b77>I<ce96289>N</c>",
        "9809CPUU2": "<ca1b8ff>W<c8aa7ff>i<c7396ff>s<c5c85ff>i<c789aff>x<c94afff></c> 🪐"
    };

    private static clubs: Nicknames = {
        "2RYV0LVCQ": "<caa00f9>G<cbb00f3>e<ccc00ee>n<cdd00e8>e<ced00e2>'<cfe00dc>s<cff00dd> <cf500e2>L<cec00e8>a<ce300ee>n<cda00f3>d</c>"
    };

    private static titles: Nicknames = {
        "P9JGPPLYQ": "Коляска-тян",
        "8GCQYL2VL": "лисичковое",
        "2RGGJPLQU": `Выпил ${Mathematics.random(1500, 250000)} литров пива`,
        "8JGP090P": "async/await",
        "VPYGJVJ0": "💎 тян",
        "QUJPVU0L": "хлебные разработки"
    };

    static setPlayerGradient(tag: string, nicknamePtr: NativePointer) {
        if (Configuration.useStage) {
            tag += "-stage";
        }

        if (Object.prototype.hasOwnProperty.call(Configuration.accountNames, tag)) {
            nicknamePtr.scptr(Configuration.accountNames[tag]);
        }

        if (GradientNickname.doPlayerHaveGradient(tag)) {
            nicknamePtr.scptr(GradientNickname.players[tag]);
        }
    }

    static setClubGradient(tag: string, nicknamePtr: NativePointer) {
        if (Configuration.useStage) {
            tag += "-stage";
        }

        if (Object.prototype.hasOwnProperty.call(GradientNickname.clubs, tag)) {
            nicknamePtr.scptr(GradientNickname.clubs[tag]);
        }
    }

    static getPlayerGradient(tag: string) {
        if (GradientNickname.doPlayerHaveGradient(tag)) {
            return GradientNickname.players[tag];
        } else {
            console.log("GradientNickname.getPlayerGradient:", "Player with", tag, "tag doesn't have assigned gradient!");

            return "";
        }
    }

    static doPlayerHaveTitle(tag: string): boolean {
        return Object.prototype.hasOwnProperty.call(GradientNickname.titles, tag);
    }

    static doPlayerHaveGradient(tag: string): boolean {
        return Object.prototype.hasOwnProperty.call(GradientNickname.players, tag);
    }

    static getPlayerTitleIndex(tag: string) {
        if (!GradientNickname.doPlayerHaveTitle(tag)) {
            console.log(`GradientNickname.getPlayerTitleIndex(${tag})`, "-", "Player doesn't have title.");
            return -1;
        }

        return Object.keys(GradientNickname.titles).indexOf(tag);
    }

    static patchGradients() {
        // Patching TitleTIDs

        Interceptor.replace(LogicPlayerTitleData_getTitleTID, new NativeCallback(function (playerTitleDataPtr) {
            const instanceId = LogicData.getInstanceId(playerTitleDataPtr);

            if (instanceId - 1000 >= 0) {
                const owner = Object.keys(GradientNickname.titles)[instanceId - 1000];
                return GradientNickname.titles[owner].scptr();
            }

            return LogicPlayerTitleData_getTitleTID(playerTitleDataPtr);
        }, "pointer", ["pointer"]));
    }
}

// ============================================================
// FILE: src/gene/features/Hamster.ts
// ============================================================
import {GameButton} from "../../titan/flash/gui/GameButton";
import {IButtonListener} from "../../titan/flash/gui/IButtonListener";
import {MovieClip} from "../../titan/flash/MovieClip";
import {TextField} from "../../titan/flash/TextField";
import {ResourceManager} from "../../titan/ResourceManager";
import {Mathematics} from "../../utils/Mathematics";
import {Debug} from "../Debug";
import {DebugMenuBase} from "../debug/DebugMenuBase";
import {ToggleDebugClickerButton} from "../debug/ToggleDebugClickerButton";
import {Resources} from "../Resources";
import {EvolutionData, HamsterData, ItemData} from "./hamster/Data";
import {RGBA} from "./RGBA";

interface HamsterSaveData {
    clicks: number,
    purchasedItems: Array<ItemData>,
    currentEvolution: EvolutionData,
    currentEnergy: number,
    sinceLastClick: number;
}

export class Hamster extends DebugMenuBase { // я обязательно вернусь к этому --tailsjs (предлагаю провести опрос че лучше сделать сначала)
    private readonly hamsterButton: GameButton;
    private readonly toggleDebugClickerButton: ToggleDebugClickerButton;
    private textField: TextField;

    private save: HamsterSaveData = {
        clicks: 0,
        purchasedItems: [], // I guess we need to store here automatic drochilki
        currentEvolution: HamsterData.getEvolutionData()[0],
        currentEnergy: 1000,
        sinceLastClick: Mathematics.getTimestamp()
    };

    // TODO: evolutions, trade clicks to some bonuskas, da, pizda. - tailsjs

    constructor() {
        super("preview_menu");

        this.setTitle("genemoe");

        this.loadSaveData();
        this.encountEnergyRestorationAmount();

        this.toggleDebugClickerButton = new ToggleDebugClickerButton();
        this.toggleDebugClickerButton.setMovieClip(this.movieClip.getChildByName("close_button"));

        const previewArea = this.movieClip.getChildByName("preview_area");
        const mainMovieClip = ResourceManager.getMovieClip(Resources.DEBUG, "debug_menu_text");

        this.textField = mainMovieClip.getTextFieldByName("Text")!; // TODO: Import better text
        const movieClipD = new MovieClip(this.textField?.instance as NativePointer);

        movieClipD.setXY(18, 7);

        this.textField?.setText(`Clicks: ${this.save.clicks}`);
        this.textField?.setFontSize(72);
        this.textField?.setScale(0.06);
        this.textField?.setTextColor(RGBA.purple);

        const emojiMovieClip = ResourceManager.getMovieClip(Resources.EMOJI, this.save.currentEvolution.emoji);

        emojiMovieClip.setXY(25, 25);
        emojiMovieClip.setScale(0.3);
        emojiMovieClip.playOnce();
        emojiMovieClip.setFrame(2);

        this.hamsterButton = new GameButton();

        this.hamsterButton.setMovieClip(emojiMovieClip);
        this.hamsterButton.setButtonListener(new IButtonListener(this.click));

        this.movieClip.addChild(this.toggleDebugClickerButton);
        previewArea.addChild(movieClipD);
        previewArea.addChild(this.hamsterButton);
    }

    click() {
        const hamsterContext = Debug.getHamster();

        if (hamsterContext.save.currentEnergy <= 0) return;

        hamsterContext.addClicks(hamsterContext.save.currentEvolution.clicksPerClick);
        hamsterContext.wasteEnergy(HamsterData.energyRestorationAmount); // :trollface:
        hamsterContext.updateText(`Clicks: ${hamsterContext.getClicks()}`);
    }

    getClicks() {
        return this.save.clicks;
    }

    encountEnergyRestorationAmount() {
        if (this.save.currentEnergy >= this.save.currentEvolution.maxEnergy) return;

        const energyAmount = Math.round((Mathematics.getTimestamp() - this.save.sinceLastClick) / HamsterData.energyRestorationCooldown);

        if (energyAmount < 1) return;

        this.save.sinceLastClick = Mathematics.getTimestamp();

        this.restoreEnergy(energyAmount * HamsterData.energyRestorationAmount);
    }

    restoreEnergy(amount: number) {
        this.save.currentEnergy = Mathematics.getMaxIfHigher(this.save.currentEnergy + amount, this.save.currentEvolution.maxEnergy);
    }

    wasteEnergy(amount: number) {
        this.save.currentEnergy = Mathematics.getMinIfLower(this.save.currentEnergy - amount, 0);
    }

    addClicks(clicks: number) {
        this.save.clicks += clicks;
        this.save.sinceLastClick = Mathematics.getTimestamp();
        const hamsterButton = this.hamsterButton.getMovieClip();
        /*hamsterButton.setScale(0.36)
        setTimeout(function() {
            hamsterButton.setScale(0.3)
        }, 50)*/
    }

    updateText(text: string) {
        this.textField?.setText(text);
    }

    updateProgressBar() {
        const progressBarPercentage = Mathematics.percentage(this.save.currentEnergy, this.save.currentEvolution.maxEnergy);

        // TODO: ProgressBar
    }

    toggle() {
        super.toggle();

        if (this.visibility)
            this.hamsterButton.getMovieClip().playOnce();
    }

    mergeIntoMainSaveData() {
        // TODO: Merging hamster save data into genebrawl save data
        // maybe encrypt it?
    }

    loadSaveData() {
        // TODO: Loading hamster save data from genebrawl save data
    }
}
// ============================================================
// FILE: src/gene/features/HttpClient/Response.ts
// ============================================================
export class Response {
    private readonly statusCode: string;
    private readonly headers: Record<string, string>;
    private readonly body: Uint8Array;

    constructor(statusCode: string, headers: Record<string, string>, body: Uint8Array) {
        this.statusCode = statusCode;
        this.headers = headers;
        this.body = body;
    }

    getJson() {
        return JSON.parse(this.bodyToString());
    }

    getStatusCode() {
        const parsedCode = this.statusCode.split(" ")[1];

        return Number(parsedCode);
    }

    getBody() {
        return this.body;
    }

    getHeaders() {
        return this.headers;
    }

    bodyToString() {
        return this.bytesToString(this.body);
    }

    headersToString() {
        return Object.keys(this.headers).map(e => `${e}: ${this.headers[e]}`).join("\n");
    }

    private bytesToString(arr: any) {
        let str = '';
        arr = new Uint8Array(arr);
        for (const i in arr) {
            str += String.fromCharCode(arr[i]);
        }
        return str;
    }
}
// ============================================================
// FILE: src/gene/features/HttpClient/index.ts
// ============================================================
import {Response} from "./Response";

type TMethod = "GET" | "POST";

export class HttpClient {
    connection!: SocketConnection;
    constructor() { }

    private parseUrl(url: string): { host: string, port: number, path: string; } {
        const urlPattern = /^(http[s]?:\/\/)?([^\/:]+)(:\d+)?(\/.*)?$/i;
        const match = url.match(urlPattern);

        if (!match) {
            throw new Error('Incorrect url');
        }

        const host = match[2];
        const port = match[3] ? parseInt(match[3].substring(1)) : 80;
        const path = match[4] || '/';

        return { host, port, path };
    }

    private async connect(host: string, port: number): Promise<void> {
        try {
            this.connection = await Socket.connect({
                host, port
            });
        } catch (e: any) {
            console.log(e.stack);
            throw new Error("Unsuccessful connection!");
        }
    }

    async sendRequest(url: string, method: TMethod, headers: Record<string, string> = {}, body: string | null = null): Promise<Response> {
        const { host, port, path } = this.parseUrl(url);
        await this.connect(host, port);
        let request = `${method} ${path} HTTP/1.1\r\n`;
        request += `Host: ${host}\r\n`;
        for (const [key, value] of Object.entries(headers)) {
            request += `${key}: ${value}\r\n`;
        }

        if (body) {
            request += `Content-Length: ${body.length}\r\n`;
        }

        request += `Connection: close\r\n\r\n`;

        if (body) {
            request += body;
        }

        this.connection.output.write(this.stringToBytes(request));

        let response = new Uint8Array();
        let responseHeaders = '';
        let responseBody = new Uint8Array();
        let isHeadersComplete = false;
        let statusCode = '';

        try {
            while (true) {
                let data = new Uint8Array(await this.connection.input.read(10000000));

                if (data.length === 0) {
                    break;
                }

                response = this.mergeUint8Arrays(response, data);

                if (!isHeadersComplete) {
                    const stringResponse = this.bytesToString(response);
                    const headerEndIndex = stringResponse.indexOf('\r\n\r\n');

                    if (headerEndIndex !== -1) {
                        responseHeaders = stringResponse.substring(0, headerEndIndex);
                        responseBody = response.slice(headerEndIndex + 4);
                        statusCode = stringResponse.split("\n")[0];
                        isHeadersComplete = true;
                    }
                } else {
                    responseBody = this.mergeUint8Arrays(responseBody, data);
                }

                if (this.isCompleteResponse(responseHeaders)) {
                    break;
                }
            }

            const headersJson = this.parseHeadersToJson(responseHeaders);

            const responseObject = new Response(statusCode, headersJson, responseBody);

            return responseObject;
        } catch (e: any) {
            console.error('Error while reading response:', e.stack);
            throw new Error('Failed to read full response');
        }
    }

    private parseHeadersToJson(headers: string): Record<string, string> { // FIXME: parsing json in headers for some reason {header: "{json: 1}"}
        const headersJson: Record<string, string> = {};
        const lines = headers.split('\r\n');

        for (const line of lines) {
            const [key, value] = line.split(':');

            if (key && value) {
                headersJson[key.trim()] = value.trim();
            }
        }

        return headersJson;
    }

    private isCompleteResponse(headers: string): boolean {
        const contentLengthMatch = headers.match(/Content-Length:\s*(\d+)/);
        if (contentLengthMatch) {
            const contentLength = parseInt(contentLengthMatch[1], 10);
            return headers.length >= contentLength;
        }
        return true;
    }

    private stringToBytes(str: string) {
        let ch, st, re: any[] = [];
        for (let i = 0; i < str.length; i++) {
            ch = str.charCodeAt(i);
            st = [];
            do {
                st.push(ch & 0xFF);
                ch = ch >> 8;
            }
            while (ch);
            re = re.concat(st.reverse());
        }
        return re;
    }

    private bytesToString(arr: any) {
        let str = '';
        arr = new Uint8Array(arr);
        for (const i in arr) {
            str += String.fromCharCode(arr[i]);
        }
        return str;
    }

    private mergeUint8Arrays(array1: Uint8Array, array2: Uint8Array) {
        const result = new Uint8Array(array1.length + array2.length);

        result.set(array1);
        result.set(array2, array1.length);

        return result;
    }
}
// ============================================================
// FILE: src/gene/features/LobbyInfo.ts
// ============================================================
import {MovieClip} from "../../titan/flash/MovieClip";
import {LogicVersion} from "../../logic/LogicVersion";
import {Configuration} from "../Configuration";
import {LatencyManager} from "../../laser/client/network/LatencyManager";
import {ResourceManager} from "../../titan/ResourceManager";
import {Resources} from "../Resources";
import {GameMain} from "../../laser/client/GameMain";
import {TextField} from "../../titan/flash/TextField";
import {GameStateManager} from "../../laser/client/state/GameStateManager";
import {LogicDefines} from "../../LogicDefines";
import {GUI} from "../../titan/flash/gui/GUI";

export class LobbyInfo extends MovieClip {
    private readonly textField: TextField | null;
    private showMessages: boolean = false;

    constructor() {
        let mainMovieClip = ResourceManager.getMovieClip(Resources.DEBUG, "debug_menu_text");
        super(mainMovieClip.instance);

        this.textField = mainMovieClip.getTextFieldByName("Text");
        if (!this.textField) {
            console.error("DebugHud::DebugHud", "TextField is NULL!");
        }

        // TODO: просчитывать корды
        this.setXY(130, 90);

        this.textField?.setXY(10, 0);
    }

    showInfo(state: boolean) {
        this.showMessages = state;
        this.setChildVisible("Text", state);
    }

    isVisible(): boolean {
        return this.showMessages;
    }

    getText() {
        let text = `Gene Brawl ${LogicVersion.scriptEnvironment.toUpperCase()} | Script: ${LogicVersion.getScriptVersion()}\n`;

        // if (LogicDefines.isPlatformIOS() && LogicVersion.isDeveloperBuild())
        //      text += `iOS version: ${LogicVersion.iosVersion}\n`;

        text += `Ping: ${LatencyManager.getBestLatencyDataString()}\n`;
        text += `Platform: ${LogicDefines.toString()}\n`;
        text += "Telegram: t.me/gene_land";
        
        return text;
    }

    update() {
        if (!this.showMessages) {
            return;
        }

        if (GameStateManager.isHomeMode() && !GameMain.shouldShowLoadingScreen() && GUI.getTopPopup().isNull()) {
            this.show();
        }
        else {
            this.hide();
        }

        let text = this.getText();

        this.textField?.setText(text);
    }
}
// ============================================================
// FILE: src/gene/features/RGBA.ts
// ============================================================
export class RGBA {
    static color(r: number, g: number, b: number, a: number = 255) {
        const alpha = Math.round(a) << 24;
        const red = r << 16;
        const green = g << 8;
        const blue = b;

        const hexNumber = alpha | red | green | blue;

        return hexNumber >>> 0;
    }

    static hex(hexNumber: number) {
        const alpha = (hexNumber >> 24) & 255;
        const red = (hexNumber >> 16) & 255;
        const green = (hexNumber >> 8) & 255;
        const blue = hexNumber & 255;

        return { r: red, g: green, b: blue, a: alpha };
    }

    static red = RGBA.color(255, 0, 0);
    static green = RGBA.color(0, 255, 0);
    static blue = RGBA.color(0, 0, 255);
    static yellow = RGBA.color(255, 255, 0);
    static purple = RGBA.color(255, 0, 255);
    static cyan = RGBA.color(0, 255, 255);
    static black = RGBA.color(0, 0, 0);
    static white = RGBA.color(255, 255, 255);
}
// ============================================================
// FILE: src/gene/features/SkinChanger.ts
// ============================================================

import {StartLoadingMessage} from "../../logic/message/battle/StartLoadingMessage";
import {Configuration} from "../Configuration";
import {LogicSkinData} from "../../logic/data/LogicSkinData";


// This class was stripped from the public source code, you have to implement it by yourself.
export class SkinChanger {
    static get available() {
        return Configuration.skinChanger;
    }

    public static load(message: StartLoadingMessage) {
        if (!SkinChanger.available)
            return;
    }

    public static patchSelectedSkins(logicDailyData: NativePointer) {

    }

    public static patchTeamEntry(teamMemberEntryArray: NativePointer) {
        if (!SkinChanger.available)
            return;

    }

    public static revertPatches() {

    }

    public static patch() {

    }
}


// ============================================================
// FILE: src/gene/features/TeamSpam.ts
// ============================================================
import {GUI} from "../../titan/flash/gui/GUI";
import {Libg} from "../../libs/Libg";
import {MessageManager} from "../../laser/client/network/MessageManager";
import {TeamChatMessage} from "../../logic/message/team/TeamChatMessage";
import {LocalizationManager} from "../../gene/localization/index";


export const TeamChatMessage_encode = new NativeFunction( // 14049 below ctor
    Libg.offset(0x970C64, 0x47DFB8), 'void', ['pointer']
);

export class TeamSpam {
    private static encodeListener: InvocationListener | undefined;
    private static spamInterval: NodeJS.Timeout | undefined;
    private static spamText: string;

    static start() {
        if (!TeamSpam.encodeListener) {
            GUI.showFloaterText(LocalizationManager.getString("TEAM_SPAM_INIT"));

            TeamSpam.encodeListener = Interceptor.attach(TeamChatMessage_encode, {
                onEnter(args) {
                    TeamSpam.encodeListener!.detach();
                    TeamSpam.encodeListener = undefined;

                    TeamSpam.spamText = args[0].add(TeamChatMessage.messageOffset).fromsc();

                    setTimeout(function () {
                        TeamSpam.spamInterval = setInterval(function () {
                            const message = new TeamChatMessage();
                            message.setMessage(TeamSpam.spamText);
                            MessageManager.sendMessage(message);
                        }, 50);
                    }, 200);
                }
            });
        }
    }

    static end() {
        if (!TeamSpam.spamInterval && !TeamSpam.encodeListener) {
            GUI.showFloaterText(LocalizationManager.getString("TEAM_SPAM_NOT_RUNNING"));
            return;
        }

        if (TeamSpam.spamInterval) {
            clearInterval(TeamSpam.spamInterval);
            TeamSpam.spamInterval = undefined;
            GUI.showFloaterText(LocalizationManager.getString("TEAM_SPAM_STOPPED"));
        }

        if (TeamSpam.encodeListener) {
            TeamSpam.encodeListener.detach();
            TeamSpam.encodeListener = undefined;
            GUI.showFloaterText(LocalizationManager.getString("TEAM_SPAM_CANCELLED"));
        }
    }
}
// ============================================================
// FILE: src/gene/features/UsefulInfo.ts
// ============================================================
import {LogicDefines} from "../../LogicDefines";
import {Configuration} from "../Configuration";
import {Debug} from "../Debug";
import {DebugHudMessageCollector} from "../debug/DebugHudMessageCollector";
import {MessageManager} from "../../laser/client/network/MessageManager";
import {LocalizationManager} from "../../gene/localization/index";
import {LogicVersion} from "../../logic/LogicVersion";

const dividerOffset = LogicDefines.isPlatformIOS() ? 608 : 624;
const framesOffset = LogicDefines.isPlatformIOS() ? 604 : 620;

export class UsefulInfo {
    private static getDivider = (instance: NativePointer) => instance.add(dividerOffset).readInt();
    private static getFrames = (instance: NativePointer) => instance.add(framesOffset).readFloat();
    private static normalizeNumber = (number: number) => number < 10 ? `0${number}` : number;
    private static oldFPS: Array<number> = [];
    private static currentFps: number = 0;
    private static battleInfo: string = "";
    private static battlePing: number = -1;
    private static secondsSinceLastUpdate: number = Math.round(new Date().getTime() / 1000);
    private static frameCounter: number = 0;

    static sessionStartedTime: number = 0;
    static projectilesAmount: number = 0;
    static ticks: number = 0;
    static disableDevBuildMessage: boolean = false;

    static getFPS() {
        return this.frameCounter;
    }

    static updateOldFps(Instance: NativePointer) {
        UsefulInfo.oldFPS = [
            UsefulInfo.getDivider(Instance),
            UsefulInfo.getFrames(Instance)
        ];
    }

    static getCurrentTime() {
        const date = new Date();

        return `Time: ${date.getFullYear()}.${UsefulInfo.normalizeNumber(date.getMonth() + 1)}.${UsefulInfo.normalizeNumber(date.getDate())} ${UsefulInfo.normalizeNumber(date.getHours())}:${UsefulInfo.normalizeNumber(date.getMinutes())}:${UsefulInfo.normalizeNumber(date.getSeconds())}`;
    }

    static getSessionTime() {
        const currentTime = Date.now();

        const difference = Math.floor((currentTime - UsefulInfo.sessionStartedTime) / 1000);

        const seconds = difference % 60;
        const minutes = Math.floor(difference / 60) % 60;
        const hours = Math.floor(difference / 3600);

        const buildTime = [hours, minutes, seconds].map(UsefulInfo.normalizeNumber).join(':');

        return `Session time: ${buildTime}`;
    }

    static getFPSColor(fps: number): string {
        return fps >= 60 ? "00FF00" : fps >= 30 ? "FFFF00" : "FF0000";
    }

    static getPingColor(fps: number): string {
        return fps >= 200 ? "FF0000" : fps >= 100 ? "FFFF00" : "00FF00";
    }

    static update() {
        if (this.secondsSinceLastUpdate < Math.round(new Date().getTime() / 1000)) {
            const messageCollector = new DebugHudMessageCollector();

            /// #if DEBUG
            if (LogicVersion.isDeveloperBuild() && !UsefulInfo.disableDevBuildMessage) messageCollector.addMessage(`Gene Brawl DEV build [script: ${LogicVersion.getScriptVersion()}]`);
            /// #endif

            const fps = UsefulInfo.getFPS();
            const fpsColor = UsefulInfo.getFPSColor(fps);

            const ping = UsefulInfo.battlePing;
            const pingColor = UsefulInfo.getPingColor(ping);

            if (Configuration.showFPS) messageCollector.addMessage(`<c${fpsColor}>FPS: ${fps}</c>`);
            if (Configuration.showBattlePing && UsefulInfo.battlePing != -1) messageCollector.addMessage(`<c${pingColor}>Ping: ${ping}</c>`);
            if (Configuration.showCurrentTime) messageCollector.addMessage(UsefulInfo.getCurrentTime());
            if (Configuration.showSessionTime) messageCollector.addMessage(UsefulInfo.getSessionTime());
            if (Configuration.showTicks && this.ticks !== 0) messageCollector.addMessage("Ticks: " + this.ticks + ` (${Math.ceil(this.ticks / 20)} sec.)`);

            //if (LogicVersion.isDeveloperBuild()) messageCollector.addMessage("Projectiles: " + this.projectilesAmount)

            if (MessageManager.ownPlayerTeam != -1 && Configuration.showTeam)
                messageCollector.addMessage(`${LocalizationManager.getString("OWN_PLAYER_TEAM").format(
                    LocalizationManager.getString(MessageManager.ownPlayerTeam == 1 ? "RED" :
                        "BLUE"))}`);

            if (Configuration.showBattleInfo && UsefulInfo.battleInfo.length != 0)
                messageCollector.addMessage(UsefulInfo.battleInfo);

            const debugHud = Debug.getDebugHud();

            debugHud.setMessageCollector(messageCollector);

            this.frameCounter = 0;
            this.secondsSinceLastUpdate = Math.round(new Date().getTime() / 1000);
            return;
        }

        this.frameCounter += 1;
    }

    static setBattleInfo(info: string) {
        UsefulInfo.battleInfo = info;
    }

    static setBattlePing(battlePing: number) {
        UsefulInfo.battlePing = battlePing;
    }

    static canBeUpdated() {
        return Configuration.showFPS ||
            Configuration.showCurrentTime ||
            Configuration.showSessionTime ||
            Configuration.showBattleInfo ||
            Configuration.showBattlePing ||
            Configuration.showTeam;
    }
}
// ============================================================
// FILE: src/gene/features/UserImagesManager.ts
// ============================================================
import {Libc} from "../../libs/Libc";
import {Path} from "../../titan/Path";
import {DownloadedImage} from "../../titan/flash/DownloadedImage";
import {GUI} from "../../titan/flash/gui/GUI";
import {JSRandom} from "../../utils/JSRandom";
import {Constants} from "../Constants";
import {LocalizationManager} from "../localization";
import {HttpClient} from "./HttpClient";
import {Filesystem} from "./filesystem";

export class UserImagesManager {
    static getDirName() {
        return Path.getUpdatePath() + Constants.USER_IMAGES_DIR;
    }

    static getImages() {
        return Filesystem.readDirectory(UserImagesManager.getDirName());
    }

    static getImageDataByFullPath(imagePath: string) {
        if (!Filesystem.doesFileExist(imagePath)) {
            return null;
        }

        const file = Filesystem.readFile(imagePath);

        return file;
    }

    static getImageData(fileName: string) {
        return UserImagesManager.getImageDataByFullPath(UserImagesManager.getDirName() + fileName); // /data/user/0/gene.brawl.dev/update/image/user_images/image1.png
    }

    static getDownloadedImage(fileName: string) {
        if (!UserImagesManager.getImages().includes(fileName)) {
            return;
        }

        const downloadedImage = new DownloadedImage(Path.getUpdatePath() + Constants.USER_IMAGES_DIR + fileName);

        return downloadedImage;
    }

    static removeImage(fileName: string) {
        const fullpath = UserImagesManager.getDirName() + fileName;

        return Libc.remove(fullpath);
    }

    static async downloadImage(uri: string) { // TODO: rewrite this mess
        const client = new HttpClient();

        const image = await client.sendRequest(uri, "GET", {
            'Accept': 'image/png, image/jpg',
            'User-Agent': `Mozilla/5.0 (Linux; Android 5.0.2; LG-D700 Build/LRX22G) AppleWebKit/533.10 (KHTML, like Gecko)  Chrome/51.0.2044.194 Mobile Safari/601.3`
        });

        if (image.getStatusCode() !== 200) {
            console.error("Error code:", image.getStatusCode());

            GUI.showFloaterText(
                LocalizationManager.getString("USER_IMAGE_MANAGER_ERROR_WHILE_LOADING")
            );
            return;
        }

        const headers = image.getHeaders();

        console.log(headers, headers['Content-Type']);

        if (!headers['Content-Type']) {
            GUI.showFloaterText(
                LocalizationManager.getString("USER_IMAGE_MANAGER_ERROR_WHILE_LOADING")
            );
            return;
        }

        const imageName = JSRandom.getRandomName();

        const fileType = headers['Content-Type'].includes("png") ? "png" : "jpg";

        Filesystem.createDirectoryIfNotExist(UserImagesManager.getDirName());

        Filesystem.writeToFile(UserImagesManager.getDirName() + `user_${imageName}.${fileType}`, image.getBody());

        GUI.showFloaterText(
            LocalizationManager.getString("USER_IMAGE_MANAGER_LOADED_SUCCESSFULLY")
        );

        // if (Debug.getUserImagesScreen()) {
        //     Debug.getUserImagesScreen().repopulateScrollArea()
        // }

        console.log(imageName, fileType);
    }
}
// ============================================================
// FILE: src/gene/features/Verevka.ts
// ============================================================
import {GameMain} from "../../laser/client/GameMain";
import {Libc} from "../../libs/Libc";
import {MovieClip} from "../../titan/flash/MovieClip";
import {Stage} from "../../titan/flash/Stage";
import {GeneAssets} from "../GeneAssets";

export class Verevka extends MovieClip {
    createdOnStage: boolean = false;

    constructor() {
        const wheelchair = GeneAssets.getAsset("VEREVKA");

        wheelchair.setWidth(100);
        wheelchair.setHeight(100);

        super(wheelchair.instance);

        this.x = Stage.getX();
        this.y = -1000;

        this.setScale(300);
        this.playOnce();
    }

    update() {
        if (!this.createdOnStage) return;

        if (this.y < 120) {
            this.y += 5;
        }
    }

    createOnStage() {
        if (this.createdOnStage) return;
        this.createdOnStage = true;

        GameMain.getHomeSprite().addChild(this.instance);
    }

    destruct() {
        this.createdOnStage = false;

        GameMain.getHomeSprite().removeChild(this.instance);
        Libc.free(this.instance);
    }
}
// ============================================================
// FILE: src/gene/features/filesystem/index.ts
// ============================================================
import {Libc} from "../../../libs/Libc";
import {Path} from "../../../titan/Path";

type FileData = ArrayBuffer | string | Uint8Array;

export class Filesystem {
    static writeToFile(path: string, data: FileData) {
        try {
            if (data instanceof Uint8Array) {
                data = data.buffer as ArrayBuffer;
            }

            const splitPath = path.split("/");
            Filesystem.createDirectoryIfNotExist(Path.getUpdatePath() + splitPath[splitPath.length - 2] + "/");

            const file = new File(path, "w");

            file.write(data);

            file.close();
        } catch (e) {
            console.error(e);
        }
    }

    static readDirectory(directory: string) {
        const dir = Libc.opendir(directory);
        const content: string[] = [];

        if (dir.isNull()) return content;

        let dirent = Libc.readdir(dir);

        while (!dirent.isNull()) {
            const dName = dirent.add(19).readUtf8String();
            const dType = dirent.add(18).readU8();

            if (!dName?.startsWith(".")) {
                content.push(dName!);
            }

            dirent = Libc.readdir(dir);
        }

        Libc.closedir(dir);

        return content;
    }

    static doesFileExist(path: string) {
        return Libc.access(path) !== -1;
    }

    static readFile(path: string) {
        try {
            const file = new File(path, 'r');

            const content = file.readBytes();

            file.close();

            return content;
        } catch (e) {
            return null;
        }
    }
    
    static createDirectoryIfNotExist(path: string) {
        const directories = path.split("/");

        for (let i = 0; i < directories.length; i++) {
            const mergedPath = directories.slice(0, i).join("/");
            if (mergedPath.length === 0) continue;
            if (Libc.access(mergedPath) === -1) {
                Path.mkdir(mergedPath);
            }
        }
    }

    static removeFile(path: string) {
        return Libc.remove(path);
    }
}
// ============================================================
// FILE: src/gene/features/hamster/Data.ts
// ============================================================
enum Category {
    BOOSTER,
    AUTOMATIC
}

interface HamsterShopData {
    emoji?: string, // emoji_digger
    cost: number, // cost 10000
    category: Category,
    repurchasableAmount: 0,
    evolution: EvolutionData | ItemData;
}

export interface EvolutionData { // Manual
    emoji: string,
    clicksPerClick: number,
    maxEnergy: number,
    cost: number;
}

export interface ItemData { // Motorized
    clicksPerTick: number,
    id: number,
    name: string;
}

export class HamsterData {
    static energyRestorationCooldown = 600; // seconds
    static energyRestorationAmount = 1;

    private static evolutionData: Array<EvolutionData> = [
        {
            emoji: "emoji_digger",
            clicksPerClick: 1,
            maxEnergy: 1000,
            cost: 10000
        }
    ];

    private static itemData: Array<ItemData> = [
        {
            clicksPerTick: 2,
            id: 1,
            name: "Drochka"
        }
    ];

    private static shopData: Array<HamsterShopData> = [
        {
            cost: 10000,
            category: Category.AUTOMATIC,
            repurchasableAmount: 0,
            evolution: this.itemData[0]
        }
    ];

    static getShopData() {
        return HamsterData.shopData;
    }

    static getItemData() {
        return HamsterData.itemData;
    }

    static getEvolutionData() {
        return HamsterData.evolutionData;
    }
}
// ============================================================
// FILE: src/gene/localization/changelogs/Change.ts
// ============================================================
export class Change {
    private name: string = "";
    private desc: string = "";

    constructor(name: string, desc?: string) {
        this.name = name;
        this.desc = desc || "";
    }

    build() {
        return `- ${this.name}${this.desc.length > 0 ? `\n${this.desc}` : ""}`;
    }
}
// ============================================================
// FILE: src/gene/localization/changelogs/ChangeLog.ts
// ============================================================
import {LocalizationManager} from "../index";
import {Change} from "./Change";

interface IChanges {
    additions?: Change[],
    fixes?: Change[],
    removals?: Change[];
}

export class ChangeLog {
    releaseDate: string = ""; // please use YYYY.MM.DD type (2024.12.31)
    scriptVersion: number = 0;

    shortDesc: string = "";

    additions: Change[] = [];
    fixes: Change[] = [];
    removes: Change[] = [];

    private logs: string[] = [];

    constructor(releaseDate: string, scriptVersion: number, shortDesc: string, changes?: IChanges) {
        this.releaseDate = releaseDate;
        this.scriptVersion = scriptVersion;
        this.shortDesc = shortDesc;
        this.additions = changes?.additions || [];
        this.fixes = changes?.fixes || [];
        this.removes = changes?.removals || [];
    }

    build() {
        this.logs = [];

        this.addNewLine(`${this.releaseDate} - ${LocalizationManager.getString("CHANGELOGS_SCRIPTVERSION").replace("{scriptVersion}", this.scriptVersion.toString())}`);
        if (this.shortDesc.length > 0) this.addNewLine(this.shortDesc);
        if (this.additions.length > 0) this.addNewLine(`${LocalizationManager.getString("CHANGELOGS_ADDITIONS")}:\n${this.additions.map(e => e.build()).join("\n")}`);
        if (this.fixes.length > 0) this.addNewLine(`${LocalizationManager.getString("CHANGELOGS_FIXES")}:\n${this.fixes.map(e => e.build()).join("\n")}`);
        if (this.removes.length > 0) this.addNewLine(`${LocalizationManager.getString("CHANGELOGS_REMOVALS")}:\n${this.removes.map(e => e.build()).join("\n")}`);

        return this.logs.join("\n");
    }

    addNewLine(line: string) {
        this.logs.push(line);
        this.logs.push("");
    }
}

/*
new ChangeLog(
    "31.12.2099",
    69,
    "something new",
    [
        new Change("New function", "Hell nah this is a new FUNCTION???")
    ],
    [
        new Change("Fixed something", "Now it's fixed. Hopefully")
    ],
    []
)
*/
// ============================================================
// FILE: src/gene/localization/index.ts
// ============================================================
import {Change} from "./changelogs/Change";
import {ChangeLog} from "./changelogs/ChangeLog";

interface Locale {
    [key: string]: string;
}

export class LocalizationManager {
    static localization: Locale;
    static changelogs: string;
    static unknownStrings: Array<string> = [];

    static defaultLanguage = "EN";
    static selectedLanguage = "EN";

    static loadLocalization(localizationName: string) {
        if (!Object.prototype.hasOwnProperty.call(LocalizationManager.locales, localizationName)) {
            LocalizationManager.selectedLanguage = LocalizationManager.defaultLanguage;
            LocalizationManager.localization = LocalizationManager.locales[LocalizationManager.defaultLanguage];
            console.log("LocalizationManager.loadLocalization:", localizationName, "is unknown. Selecting default one:", LocalizationManager.defaultLanguage);
            return;
        }

        LocalizationManager.selectedLanguage = localizationName;
        LocalizationManager.localization = Object.prototype.hasOwnProperty.call(LocalizationManager.locales, localizationName) ? LocalizationManager.locales[localizationName] : LocalizationManager.locales[LocalizationManager.defaultLanguage];
    }

    static getString(str: string) {
        if (LocalizationManager.localization[str]) {
            return LocalizationManager.localization[str];
        }

        if (LocalizationManager.localization[LocalizationManager.defaultLanguage]) {
            console.log("LocalizationManager.getString:", str, "doesn't exist in", LocalizationManager.selectedLanguage, "localization. Selecting from default one:", LocalizationManager.defaultLanguage);
            return LocalizationManager.localization[LocalizationManager.defaultLanguage];
        }

        //console.log("LocalizationManager.getString:", str, "is unknown.");

        LocalizationManager.unknownStrings.push(str);

        return str;
    }

    /**
     * LocalizationManager.getStateString("EXAMPLE", true) // EXAMPLE_ON -> Example is ON!
     * 
     * я просто эту хуйню решил попроще сделать, так сказать чтобы повсюду не сувать тернарки, а просто вот так вызывать и заебись чо
     */
    static getStateString(str: string, state: boolean) {
        str += state ? "_ON" : "_OFF";
        return LocalizationManager.getString(str);
    }

    static buildChangelogs() {
        const changelogs: { [key: string]: ChangeLog[]; } = { // блять прошу меняйте их сука
            RU: [
                new ChangeLog("2024.12.03", 63, "Вероятней всего, последнее обновление скрипта на 58.279", {
                    additions: [
                        new Change("Настройки в бою!", "Battle -> Battle Settings"),
                        new Change("Кнопка чата в бою!", "Она показывается автоматически, если вы в команде и в бою.")
                    ],
                    fixes: [
                        new Change("Андердог теперь показывается в интро"),
                        new Change("Исправлен DVD.")
                    ]
                }),
                new ChangeLog("2024.11.18", 60, "", {
                    additions: [
                        new Change("Просмотр профиля по тэгу", "Account -> Profile by tag"),
                        new Change("Список изменений", "Useful Info -> Changelogs"),
                        new Change("Смена камеры в бою", "Camera Mode -> Next camera mode"),
                        new Change("Отображение пинга в бою", "Useful Info -> Show battle ping"),
                        new Change("Возможность отрубить новое интро", "Optimization -> Use old intro"),
                        new Change("Коляска-трость")
                    ],
                    fixes: [
                        new Change("Вернули показ патронов у противника", "Battle -> Show Enemy Ammo"),
                        new Change("Исправили отображение FPS")
                    ]
                })
            ],
            EN: [
                new ChangeLog("2024.12.03", 63, "Most likely the latest script update at 58.279", {
                    additions: [
                        new Change("Battle Settings!", "Battle -> Battle Settings"),
                        new Change("Chat button in battle!", "It shows up automatically if you are in a team and in battle.")
                    ],
                    fixes: [
                        new Change("Underdog is now displayed in intro"),
                        new Change("DVD fixed.")
                    ]
                }),
                new ChangeLog("2024.11.18", 60, "", {
                    additions: [
                        new Change("Checking profile by tag", "Account -> Profile by tag"),
                        new Change("Changelogs", "Useful Info -> Changelogs"),
                        new Change("Changing camera mode in battle", "Camera Mode -> Next camera mode"),
                        new Change("Showing battle ping", "Useful Info -> Show battle ping"),
                        new Change("Disable new intro", "Optimization -> Use old intro"),
                        new Change("Wheelchair-cane")
                    ],
                    fixes: [
                        new Change("Returned showing enemy's ammo", "Battle -> Show Enemy Ammo"),
                        new Change("Fixed FPS display")
                    ]
                })
            ]
        };

        this.changelogs = changelogs[this.selectedLanguage].map(log => log.build()).join("\n");
    }

    static getLocalizationKey(localed: string) {
        console.log(LocalizationManager.locales[this.selectedLanguage]["BATTLE"], localed);
        return Object.keys(LocalizationManager.locales[this.selectedLanguage]).find(e => LocalizationManager.locales[this.selectedLanguage][e] === localed);
    }

    static locales: { [key: string]: Locale; } = {
        RU: {
            RESTART_GAME: "Перезапустить игру",
            ADD_RESOURCES: "Добавить ресурсы",
            ADD_GEMS: "Добавить кристаллы",
            BYPASS_OUT_OF_SYNC: "Обход потери соединения",
            REMOVE_ALL_COINS: "Обнулить монеты",
            REMOVE_ALL_GEMS: "Обнулить кристаллы",
            UNLOCK_ALL_LVL7: "Разблокировать всё до уровня 7",
            UNLOCK_ALL_LVL9: "Разблокировать всё до уровня 9",
            UNLOCK_GADGETS: "Разблокировать гаджеты",
            UNLOCK_STAR_POWERS: "Разблокировать звездные силы",
            UNLOCK_ONE: "Разблокировать одного",
            UNLOCK_MAX_ONE: "Разблокировать и улучшить одного",
            UNLOCK_ALL: "Разблокировать всех",
            UNLOCK_MAX_ALL: "Разблокировать и улучшить всех",
            UNLOCK_MAX_ALL_NO_STAR_POWERS: "Разблокировать и улучшить всех без звездных сил",
            UNLOCK_EVENT_SLOTS: "Разблокировать события",
            REMOVE_HERO_SKINS: "Удалить скины бравлерам",
            ADD_POWER: "Добавить силу",
            ADD_SCORE: "Добавить кубки",
            DECREASE_SCORE: "Уменьшить кубки",
            CLAIM_35_MILESTONES: "Получить 35 этапов",
            ADD_1_WINSTREAK: "Добавить 1 серию побед",
            ADD_10_WINSTREAK: "Добавить 10 серий побед",
            ADD_100_WINSTREAK: "Добавить 100 серий побед",
            REMOVE_WINSTREAK: "Удалить серию побед",
            ADD_1000_BLINGS: "Добавить 1000 блингов",
            PROFILE_BY_TAG: "Открыть профиль по тегу",
            NEXT_CAMERA_MODE: "Изменить режим камеры",
            STATUS_NORMAL: "<c00ff00>ОБЫЧНЫЙ</c>",
            CURRENT_SERVER_THEME: "Текущая тема с сервера",
            NO_PROXY: "Отключить прокси",
            SFX: "Звук",
            MUSIC: "Музыка",
            HAPTICS: "Вибрация",
            SHOW_FPS: "Показывать FPS",
            SHOW_TIME: "Показывать время",
            SHOW_SESSION_TIME: "Показывать время в игре",
            SHOW_OWN_TEAM: "Показывать свою команду",
            SHOW_BATTLE_INFO: "Показывать информацию о матче",
            SHOW_BATTLE_PING: "Показывать пинг в бою",
            CHANGELOGS: "Список изменений",
            MOVEMENT_BASED_AUTOSHOOT: "Автоатака по направлению ходьбы",
            SPECTATE_BY_TAG: "Наблюдение по тегу",
            AUTO_DODGE: "Автоманс",
            HIDE_BATTLE_STATE: "Скрыть статус \"В бою\"",
            AUTO_EXIT_AFTER_BATTLE: "Авто-выход после боя",
            MARK_FAKE_LEON: "Помечать клона Леона",
            HIDE_ULTI_AIMING: "Скрыть прицеливание супером",
            STATIC_BACKGROUND: "Статичный фон меню",
            STOP_LOLA_CLONE: "Сменить управление Лолой",
            AUTO_AIM: "Автоматическая атака",
            DISABLE_SPOOF: "Отключить смену сервера",
            DEBUG_INFO: "Debug Info",
            DEBUG_OPEN_URL: "Открыть URL",
            OPEN_ACCOUNT_SWITCHER: "Открыть переключатель аккаунтов",
            HIDE_SIDE_MASK: "Спрятать рамки по бокам",
            DARK_THEME: "Тёмная тема",
            AUTO_ULTI: "Автоматический супер",
            AUTO_HYPERCHARGE: "Автоматический гиперзаряд",
            HOLD_TO_SHOOT: "Атака при удерживании кнопки",
            AUTO_MOVE_TO_TARGET: "Автоматически двигаться к цели",
            FOLLOW_CLOSEST_TEAMMATE: "Автоматически двигаться к союзнику",
            AUTO_PLAY_AGAIN: "Автоматически играть снова",
            SEND_EMPTY_EMOTE: "Отправить пустой эмодзи",
            SKIP_REPLAY_INTRO: "Пропускать интро в повторе",
            SKIP_BATTLE_END_REPLAY: "Пропускать \"Лучший Момент\"",
            AUTO_READY: "Автоматически \"ГОТОВО\"",
            BATTLE_SETTINGS: "Настройки камеры",
            SHOW_CHAT_BUTTON: "Показывать кнопку чата",
            SHOW_ENEMY_AMMO: "Показывать патроны соперников",
            ADD_BRAWL_PASS_POINTS_THIS_SEASON: "Добавить опыт Brawl Pass",
            ADD_CHAMPIONSHIP_CHALLENGE_WIN: "Добавить победу в Испытании Чемпионата",
            ADD_CHAMPIONSHIP_CHALLENGE_LOSS: "Добавить поражение в Испытании Чемпионата",
            SET_CC_ESPORTS_QUALIFIED: "Добавить кнопку \"ESPORTS\"",
            REMOVE_CC_ESPORTS_QUALIFIED: "Убрать кнопку \"ESPORTS\"",
            FORCE_CHINA_GFX_TWEAKS: "Включить китайские дополнения графики",
            HIDE_DEBUG_ITEMS: "Спрятать элементы дебага",
            HIDE_TAGS: "Спрятать теги",
            HIDE_NAME: "Спрятать имена",
            START_ROOM_SPAM: "Начать спам в руме",
            STOP_ROOM_SPAM: "Остановить спам в руме",
            SWITCH_TO_STAGE_SERVER: "Переключиться на Stage сервер",
            SWITCH_TO_PROD_SERVER: "Переключиться на Production сервер",
            UNLOCK_GEARS: "Разблокировать снаряжения",
            UNLOCK_CURRENT_BRAWL_PASS_SEASON: "Разблокировать Brawl Pass",
            UNLOCK_CURRENT_BRAWL_PASS_PLUS_SEASON: "Разблокировать Brawl Pass+",
            SKIN_CHANGER: "СКИН ЧЕНДЖЕР",
            ONLINE_SKIN_CHANGER: "Онлайн режим",
            DOUBLE_CLICK_TO_SET_THEME_MUSIC: "Нажми ещё раз, чтобы сменить музыку!",
            ANTI_AFK: "Анти AFK",
            HIDE_SPECIAL_OFFERS: "Спрятать особые акции",
            CHARACTER_SOUNDS: "Звуки бравлеров",
            HIDE_BRAWLERS_IN_INTRO: "Спрятать бравлеров в интро",
            HIDE_LEAGUE_IN_BATTLE_CARD: "Спрятать лигу боевой карты в интро",
            USE_OLD_INTRO: "Использовать старое интро",
            BYPASS_ANTI_PROFANITY: "Обход антицензуры",
            CLOSE_RANKED_SCREEN: "Закрыть ранговый матч",
            SLOW_MODE: "Медленный режим",
            VISUAL_CHROMATIC_NAME: "Хроматическое имя",
            DISABLE_OUTLINE: "Убрать обводку",
            EMOTE_ANIMATION: "Анимация эмодзи",
            SHOW_FUTURE_EVENTS: "Показывать будущие события",
            HIDE_CREATOR_BOOST: "Спрятать поддержку автора контента",
            SHOW_BOT_PREFIX: "Показывать префикс у ботов",
            USE_LEGACY_BACKGROUND: "Использовать оптимизированный фон",
            SKIP_STARR_DROP_ANIMATION: "Пропускать нажатия у Старр Дропов",
            PROBING_CANE_MODE: "Режим для слепых",
            ADVANCED_PROBING_CANE_MODE: "Продвинутый режим для слепых",
            SPAWN_DVD: "Добавить 1 DVD",
            REMOVE_DVD: "Удалить 1 DVD",
            REMOVE_ALL_DVD: "Удалить все DVD",
            KIT_MOVE_HACK: "Ходьба за Кита во время супера",
            HIDE_LOBBY_INFO: "Спрятать Lobby Info",

            TEST: "Тест!",
            AGE_GATE_REMOVAL_STARTED: "Открыт диалог с выбором возраста. Пожалуйста, выберите возраст 21 или выше чтобы снять ограничения.",

            HIDE_ULTI_AIMING_ON: "Теперь никто не увидит, что вы прицеливаетесь ультой!",
            HIDE_ULTI_AIMING_OFF: "Теперь все увидят, что вы прицеливаетесь ультой!",

            STOP_LOLA_CLONE_ON: "Теперь клон Лолы не будет двигаться.",
            STOP_LOLA_CLONE_OFF: "Теперь клон Лолы будет двигаться вместе с Вами.",

            KIT_MOVE_HACK_ON: "Теперь Кит может передвигаться, сидя на другом бравлере.",
            KIT_MOVE_HACK_OFF: "Теперь Кит НЕ может передвигаться, сидя на другом бравлере.",

            EDIT_CONTROLS_ON: "Кнопка смены управления теперь <c41fc03>будет</c> отображаться в бою.",
            EDIT_CONTROLS_OFF: "Кнопка смены управления теперь <cfff700>не будет</c> отображаться в бою.",

            BATTLE_SHORTCUTS_ON: "Кнопки быстрого доступа теперь <c41fc03>будут</c> показаны в бою.",
            BATTLE_SHORTCUTS_OFF: "Кнопки быстрого доступа теперь <cfff700>не будут</c> показаны в бою.",

            SHOW_EDIT_CONTROLS: "Показать кнопку смены управления",
            SHOW_BATTLE_SHORTCUTS: "Показать кнопки быстрого доступа",

            AUTO_READY_ON: "Теперь при выходе в меню \"ГОТОВО\" будет нажиматься автоматически. (Только в команде)",
            AUTO_READY_OFF: "Теперь при выходе в меню \"ГОТОВО\" НЕ будет нажиматься автоматически.",

            AUTO_HYPERCHARGE_ON: "Теперь гиперзаряд будет активироваться автоматически.",
            AUTO_HYPERCHARGE_OFF: "Теперь гиперзаряд не будет активироваться автоматически.",

            AUTO_PLAY_AGAIN_ON: "Теперь кнопка \"Играть снова\" будет нажиматься автоматически после окончания боя!",
            AUTO_PLAY_AGAIN_OFF: "Теперь кнопка \"Играть снова\" больше не будет нажиматься автоматически!",

            AUTO_EXIT_AFTER_BATTLE_ON: "Теперь кнопка \"Выйти\" будет нажиматься автоматически после окончания боя!",
            AUTO_EXIT_AFTER_BATTLE_OFF: "Теперь кнопка \"Выйти\" больше не нажиматься автоматически после окончания боя!",

            SKIP_REPLAY_INTRO_ON: "Теперь лучший момент игры будет пропускаться!",
            SKIP_REPLAY_INTRO_OFF: "Теперь лучший момент игры не будет пропускаться!.",

            ANTI_AFK_ON: "Анти AFK включен!",
            ANTI_AFK_OFF: "Анти AFK выключен!",

            PROTECTIVE_FEATURES: "Защитные фичи",
            PROTECTIVE_FEATURES_ON: "Защитные фичи включены! <cff0900>Внимание!</c> Функция еще в разработке и может быть нестабильна",
            PROTECTIVE_FEATURES_OFF: "Защитные фичи отключены.",

            ANTI_PROFANITY_ON: "Обход запрета матов включён! Будьте осторожны, вас могут заблокировать за использование нецензурных слов!",
            ANTI_PROFANITY_OFF: "Обход запрета матов отключён.",

            PROXY_ERROR: "По всей видимости, прокси не работает.",
            PROD_SERVER_UPDATED: "Требуется обновление клиента! Для того, чтобы продолжить использовать Gene Brawl зайдите сюда - t.me/gene_land.",
            STAGE_SERVER_UPDATED: "Stage-сервер был обновлен до новой версии! Обновление клиента скачать нельзя :(",
            STAGE_SERVER_REQUIRES_VPN: "Stage-сервер недоступен с вашего местоположения.",

            LATENCY_TESTS_TRIGGERED: "Начинаем смену батл сервера, подождите..",
            BATTLE_SERVER_CHANGED: "Батл сервер изменен!",
            BATTLE_SERVER_SPOOF_DISABLED: "Смена батл сервера отключена!",

            NEED_TO_ACTIVATE: "Привет. Тебе нужно выполнить привязку! Введи (/activate $KEY) в ветку \"SCUtils\".",
            KEY_UNAVAILABLE: "Привет. По всей видимости, сервер активации сейчас не работает. Попробуй зайти позже!",

            TEAM_SPAM_INIT: "Спам начинается!",
            TEAM_SPAM_STOPPED: "Спам остановлен!",
            TEAM_SPAM_CANCELLED: "Спам отменен.",
            TEAM_SPAM_NOT_RUNNING: "Спам не был запущен",

            OUT_OF_SYNC_ON: "Теперь вас не будет кикать при выборе чего-то что у вас нет",
            OUT_OF_SYNC_OFF: "Теперь вас БУДЕТ кикать при выборе чего-то что у вас нет",

            CONTENT_CREATOR_BOOST_ON: "Поддержка автора контента включена.",
            CONTENT_CREATOR_BOOST_OFF: "Поддержка автора контента выключена.",

            BATTLE_STATE_HIDDEN: "Статус \"Бой\" теперь скрыт",
            BATTLE_STATE_VISIBLE: "Статус \"Бой\" больше не скрывается",

            SLOW_MODE_ON: "Режим Слоу-Мо включен",
            SLOW_MODE_OFF: "Режим Слоу-Мо выключен",

            SIDE_MASK_ON: "Показ рамок по бокам включен",
            SIDE_MASK_OFF: "Показ рамок по бокам выключен",

            FAKE_PREMIUM_PASS_ON: "Визуальный хроматический ник включен!",
            FAKE_PREMIUM_PASS_OFF: "Визуальный хроматический ник выключен!",

            FUTURE_EVENTS_ON: "Показ будущих событий включен!",
            FUTURE_EVENTS_OFF: "Показ будущих событий выключен!",

            DEBUG_ITEMS_HIDDEN: "Debug скрыт. Чтобы его вернуть, введите /debug в чат.",
            DEBUG_ITEMS_VISIBLE: "Debug вещи теперь показываются.",

            EMOTE_ANIMATION_ON: "Анимация эмодзей включена!",
            EMOTE_ANIMATION_OFF: "Анимация эмодзей выключена!",

            NO_COMMAND_DEFINED: "Такой команды нет!",

            PROXY_DISABLED: "Прокси отключено! При следующем заходе в игру, прокси не будет использоваться",
            GENE_PROXY: "Прокси включено! При следующем заходе в игру, будет использоваться Gene Proxy!",

            STATIC_BACKGROUND_ON: "Теперь в некоторых игровых меню будет использоваться фон из главного меню!",
            STATIC_BACKGROUND_OFF: "Теперь в некоторых игровых меню будет использоваться обычный фон!",

            CONNECTION_INDICATOR_ON: "Теперь в бою будет отображаться ваше подключение к серверу!",
            CONNECTION_INDICATOR_OFF: "Теперь в бою не будет отображаться ваше подключение к серверу!",

            DEFAULT_THEME_ON: "Теперь в главном меню будет использоваться обычный фон!", // потом надо будет смену фонов нормальную забабахать но сейчас этим ограничиваемся
            DEFAULT_THEME_OFF: "Теперь в главном меню будет использоваться тематический фон!",

            SPECIAL_OFFERS_ON: "Особые акции скрыты!",
            SPECIAL_OFFERS_OFF: "Особые акции отображены!",

            CHINA_VERSION_ON: "Теперь клиент игры использует китайские дополнения.",
            CHINA_VERSION_OFF: "Теперь клиент игры не использует китайские дополнения.",

            AUTO_MOVE_TARGET_ON: "Теперь ваш персонаж будет автоматически двигаться к ближайшему врагу.",
            AUTO_MOVE_TARGET_OFF: "Теперь ваш персонаж не будет автоматически двигаться к ближайшему врагу.",

            AUTO_AIM_ON: "Теперь ваш персонаж будет автоматически атаковать ближайшего врага.",
            AUTO_AIM_OFF: "Теперь ваш персонаж не будет автоматически атаковать ближайшего врага.",

            AUTO_ULTI_ON: "Теперь ваш персонаж будет автоматически ультовать в ближайшего врага.",
            AUTO_ULTI_OFF: "Теперь ваш персонаж не будет автоматически ультовать в ближайшего врага.",

            HOLD_TO_SHOOT_ON: "Автоатака при зажатии кнопки атаки включена.",
            HOLD_TO_SHOOT_OFF: "Автоатака при зажатии кнопки атаки выключена.",

            MOVEMENT_BASED_AUTOSHOOT_ON: "Автоатака по направлению движения (для Мортиса) включена.",
            MOVEMENT_BASED_AUTOSHOOT_OFF: "Автоатака по направлению движения (для Мортиса) выключена.",

            LEGACY_BACKGROUND_ON: "Теперь темы в меню менее детализированные.",
            LEGACY_BACKGROUND_OFF: "Теперь темы в меню более детализированные.",

            OWN_PLAYER_TEAM: "Истинная команда игрока: {0}",

            RED: "<cff2600>К<cff2600>Р<cff2600>А<cff2600>С<cff2600>Н<cff2600>А<cff2600>Я</c>",
            BLUE: "<c0433ff>С<c0433ff>И<c0433ff>Н<c0433ff>Я<c0433ff>Я</c>",

            SHOW_SESSION_TIME_ON: "Время сессии отображается.",
            SHOW_SESSION_TIME_OFF: "Время сессии больше не отображается.",

            SHOW_CURRENT_TIME_ON: "Текущее время отображается",
            SHOW_CURRENT_TIME_OFF: "Текущее время больше не отображается",

            SHOW_FPS_ON: "FPS отображается",
            SHOW_FPS_OFF: "FPS больше не отображается",

            SHOW_TEAM_ON: "Теперь в бою будет отображаться ваша настоящая команда.",
            SHOW_TEAM_OFF: "Теперь в бою не будет отображаться ваша настоящая команда.",

            SHOW_NAME_ON: "Имена игроков снова отображаются.",
            SHOW_NAME_OFF: "Имена игроков больше не отображаются.",

            SHOW_TAGS_ON: "Теги игроков снова отображаются.",
            SHOW_TAGS_OFF: "Теги игроков больше не отображаются.",

            SFX_ON: "Звук включен",
            SFX_OFF: "Звук выключен.",

            MUSIC_ON: "Музыка включена.",
            MUSIC_OFF: "Музыка выключена.",

            HAPTICS_ON: "Вибрация включена.",
            HAPTICS_OFF: "Вибрация выключена",

            ENEMY_BULLETS_ON: "Отображение пуль у противников включено!",
            ENEMY_BULLETS_OFF: "Отображение пуль у противников отключено!",

            BATTLE_PING_ON: "Отображение пинга в бою включено!",
            BATTLE_PING_OFF: "Отображение пинга в бою отключено!",

            SKIP_BATTLE_END_REPLAY_ON: "«ЛУЧШИЙ МОМЕНТ» больше не будет показываться после конца боя",
            SKIP_BATTLE_END_REPLAY_OFF: "«ЛУЧШИЙ МОМЕНТ» снова будет показываться после конца боя",

            FOLLOW_ALLY_ON: "Теперь Ваш персонаж будет преследовать ближайшего союзника.",
            FOLLOW_ALLY_OFF: "Ваш персонаж больше не будет преследовать ближайшего союзника.",

            CAMERA_MODE_CHANGED: "Режим камеры изменён на: {cameraMode}",
            CAMERA_MODE_0: "Обычный",
            CAMERA_MODE_1: "Вид с угла",
            CAMERA_MODE_2: "Вид всей карты",
            CAMERA_MODE_3: "Кастомный (менять в Battle->Battle Settings)",

            LOLA_CONTROL_0: "Теперь ты можешь контролировать ЛОЛУ и ЕЁ КЛОНА!",
            LOLA_CONTROL_1: "Теперь ты можешь контролировать только ЛОЛУ!",
            LOLA_CONTROL_2: "Теперь ты можешь контролировать только КЛОНА ЛОЛЫ!",

            SPECTATE_TAG: "Наблюдение по тегу",
            SPECTATE_INPUT: "#2PP",
            SPECTATE: "Наблюдать",
            SPECTATE_TAG_NO_CODE: "Ты не ввёл тег.",
            SPECTATE_TAG_WRONG_CODE: "Некорректный тег!",

            PROFILE_TAG: "Открыть профиль по тегу",
            PROFILE_INPUT: "#2PP",
            PROFILE: "Открыть",
            PROFILE_TAG_NO_CODE: "Ты не ввёл тег.",
            PROFILE_TAG_WRONG_CODE: "Некорректный тег!",

            OPEN_URL: "Введи сюда ссылку...",
            INCORRECT_URL: "Некорректная ссылка!",
            OPEN_URL_BUTTON: "Открыть",

            NOT_IMPLEMENTED_YET: "Эта функция еще не реализована!",
            NOT_IMPLEMENTED_YET_IOS: "Эта функция ещё не реализована на iOS!",
            NOT_IMPLEMENTED_YET_ANDROID: "Эта функция ещё не реализована на Android!",

            BOT_PREFIX_ON: "Префикс <c3>[BOT]</c> будет показываться в реальном бою у ботов.",
            BOT_PREFIX_OFF: "Префикс <c3>[BOT]</c> больше не будет показываться.",

            CHAT_BUTTON_ON: "Теперь кнопка чата будет показываться в бою!",
            CHAT_BUTTON_OFF: "Теперь кнопка чата не будет показываться в бою!",

            // /name
            NAME_CMD_WRONG_INPUT: "/name [тег] [ник]",
            NAME_CMD_INVALID_TAG: "Имя этого игрока нельзя поменять!",

            BATTLE_INFO_ON: "Информация боя будет показываться!",
            BATTLE_INFO_OFF: "Информация боя больше не будет показываться!",

            // Braille
            BRAILLE_ON: "Активирован режим трости!\nИгра перезапустится через 4s.",
            BRAILLE_OFF: "Режим трости деактивирован.\nИгра перезапустится через 4s.",
            BRAILLE_INTERRUPTED: "Смена режима трости была прервана.",

            DARK_THEME_ON: "Тёмная тема включена!\nДля применения всех настроек, игра перезапустится через 4 секунды.",
            DARK_THEME_OFF: "Тёмная тема отключена!\nДля применения всех настроек, игра перезапустится через 4 секунды.",
            DARK_THEME_INTERRUPTED: "Смена тёмной темы была прервана.",

            STATUS_REVERTED: "Статус в команде вернулся в <c00ff00>нормальное</c> состояние",
            STATUS_CHANGED: "Статус в команде изменен на %STATUS",

            TAG_COPIED: "Тег скопирован!",
            IOS_TOO_OLD: "<cfff700>Вы используете устаревшую версию Gene Brawl для iOS. Пожалуйста, установите новый .ipa в ветке \"Обновления\".</c>",
            ANTI_OUT_OF_SYNC: "<cfff700>У вас активировано \"Обход потери соединения\", отключите если вам он не нужен.</c>",

            XRAY_TARGET_SELECTED: "Цель для X-Ray %TARGET выбрана!",

            MARK_FAKE_NINJA_ON: "Теперь клон Леона будет подсвечиваться красным.",
            MARK_FAKE_NINJA_OFF: "Теперь клон Леона не будет подсвечиваться красным.",

            CHANGELOGS_SCRIPTVERSION: "версия скрипта: {scriptVersion}",
            CHANGELOGS_ADDITIONS: "Нововведения",
            CHANGELOGS_FIXES: "Исправления",
            CHANGELOGS_REMOVALS: "Удалено",
            CHANGELOGS_DIALOG_TITLE: "Список изменений",
            CHANGELOGS_DIALOG_BUTTON: "Понятно",

            SKIP_RANDOM_ANIMATION_ON: "Старр Дропы будут готовы к открытию сразу.",
            SKIP_RANDOM_ANIMATION_OFF: "Старр Дропы нужно будет задерживать/нажимать для открытия.",

            HIDE_HEROES_INTRO_ON: "Бравлеры теперь скрыты в интро!",
            HIDE_HEROES_INTRO_OFF: "Бравлеры снова показываются в интро!",

            HIDE_LEAGUE_BATTLE_CARD_ON: "Фон боевой карты теперь скрыт в интро!",
            HIDE_LEAGUE_BATTLE_CARD_OFF: "Фон боевой карты снова показывается в интро!",

            USE_OLD_INTRO_ON: "Используется старое интро в бою.",
            USE_OLD_INTRO_OFF: "Используется новое интро в бою.",

            CANNOT_SEE_PROFILE_IN_BATTLE: "Нельзя смотреть профиль в бою!",
            LEAVE_FROM_BATTLE: "ВЫХОДИМ ИЗ БОЯ...",

            ACCOUNT: "Аккаунт",
            BATTLE: "Бой",
            LATENCY: "Смена боевого сервера",
            CAMERA_MODE: "Режим камеры",
            CHANGE_THEME: "Сменить тему",
            FUN: "Забавки",
            GFX: "Графика",
            PRC_CHINA: "Китай",
            GAME_SETTINGS: "Настройки игры",
            OPTIMIZATION: "Оптимизация",
            PROXY: "Прокси",
            SC_UTILS: "SC Utils",
            SERVERS: "Сервера",
            TESTS: "Коляски (тесты)",
            USEFUL_INFO: "Полезная информация",
            EXPERIMENTS: "Эксперименты",
            XRAY: "X-Ray",
            MISC: "Разное",
            PREVIEW: "Превью",
            SC_ID: "Supercell ID",
            BRAWL_PASS: "Brawl Pass",
            CHALLENGE: "Испытания",
            STREAMER_MODE: "Режим стримера",
            SPAM: "Спам",
            GEARS: "Снаряжение",
            CHANGE_STATUS: "Сменить статус",
            MAIN: " ",

            BUTTONS_OPACITY: "Непрозрачность кнопок",
            CAMERA_X: "Позиция камеры по X",
            CAMERA_Y: "Позиция камеры по Y",
            CAMERA_ROTATE_X: "Поворот камеры по X",
            CAMERA_ROTATE_Y: "Поворот камеры по Y",
            CAMERA_ALIGN: "Выравнивание камеры",
            CAMERA_DISTANCE: "Дистанция камеры",

            USER_IMAGE_MANAGER_LOADED_SUCCESSFULLY: "Картинка успешно загружена! Перезайдите в это меню, чтобы увидень новую картинку.",
            USER_IMAGE_MANAGER_ERROR_WHILE_LOADING: "Произошла ошибка при попытке загрузить картинку!",

            USER_IMAGE_SCREEN_TITLE: "Выберите картинку",
            USER_IMAGE_BUTTON_LOAD_IMAGE: "Загрузить свою картинку",

            USER_IMAGE_SELECTED_TITLE: "Картинка выбрана!",
            USER_IMAGE_SELECTED_BODY: "Что вы хотите сделать с этой картинкой?",
            USER_IMAGE_SELECTED_BUTTON_SET_TO_THEME: "Поставить в главное меню",
            USER_IMAGE_SELECTED_BUTTON_DELETE: "Удалить",

            USER_IMAGE_SET_TO_THEME_SUCCESS: "Картинка установлена в главное меню!",

            USER_IMAGE_DELETE_SUCCESS: "Картинка удалена!",
            USER_IMAGE_DELETE_ERROR: "Не удалось удалить картинку.",

            DANGEROUS_POPUP_TITLE: "Минуточку внимания!",
            DANGEROUS_POPUP_BODY: 'Вы точно хотите включить функцию "{functionName}"? Эта функция отмечена как <cff0000>опасная</c> и может привести к блокировке вашего аккаунта! Вся ответственность за блокировку вашего аккаунта лежит только на вас!',

            DANGEROUS_POPUP_BUTTON_NO: "Нет, спасибо!",
            DANGEROUS_POPUP_BUTTON_YES: "Да, хочу.",

            ANTI_KNOCKBACK: "Анти-отбрасывание",
            ANTI_KB_ON: "Анти-отбрасывание включено!",
            ANTI_KB_OFF: "Анти-отбрасывание выключено!",

            SHOW_TICKS: "Показывать время с начала боя",
            SHOW_TICKS_ON: "Теперь в бою будет отображаться время с начала боя!",
            SHOW_TICKS_OFF: "Теперь в бою не будет отображаться время с начала боя!",

            DISABLE_OUTLINE_ON: "Обводка отключена!",
            DISABLE_OUTLINE_OFF: "Обводка включена!"

        },
        EN: {
            RESTART_GAME: "Restart Game",
            ADD_RESOURCES: "Add Resources",
            ADD_GEMS: "Add Gems",
            BYPASS_OUT_OF_SYNC: "Bypass Out of Sync",
            REMOVE_ALL_COINS: "Remove all Coins",
            REMOVE_ALL_GEMS: "Remove all Gems",
            UNLOCK_ALL_LVL7: "Unlock All to Level 7",
            UNLOCK_ALL_LVL9: "Unlock All to Level 9",
            UNLOCK_GADGETS: "Unlock opened gadgets",
            UNLOCK_STAR_POWERS: "Unlock opened star powers",
            UNLOCK_ONE: "Unlock One",
            UNLOCK_MAX_ONE: "Unlock and Max One",
            UNLOCK_ALL: "Unlock All",
            UNLOCK_MAX_ALL: "Unlock and Max All",
            UNLOCK_MAX_ALL_NO_STAR_POWERS: "Unlock and Max All without star powers",
            UNLOCK_EVENT_SLOTS: "Unlock Event Slots",
            REMOVE_HERO_SKINS: "Remove hero skins",
            ADD_POWER: "Add power",
            ADD_SCORE: "Add score",
            DECREASE_SCORE: "Decrease score",
            CLAIM_35_MILESTONES: "Claim 35 milestones",
            ADD_1_WINSTREAK: "Add 1 winstreak",
            ADD_10_WINSTREAK: "Add 10 sinstreak",
            ADD_100_WINSTREAK: "Add 100 winstreak",
            REMOVE_WINSTREAK: "Remove winstreak",
            ADD_1000_BLINGS: "Add 1000 blings",
            PROFILE_BY_TAG: "Open profile by tag",
            NEXT_CAMERA_MODE: "Next camera mode",
            HIDE_LOBBY_INFO: "Hide Lobby Info",
            DISABLE_SPOOF: "Disable spoof",
            DEBUG_INFO: "Debug Info",
            DEBUG_OPEN_URL: "Open URL",
            OPEN_ACCOUNT_SWITCHER: "Open account switcher",
            HIDE_SIDE_MASK: "Hide side mask",
            DARK_THEME: "Dark theme",
            AUTO_AIM: "Auto aim",
            AUTO_ULTI: "Auto ulti",
            AUTO_HYPERCHARGE: "Auto hypercharge",
            HOLD_TO_SHOOT: "Hold to shoot",
            AUTO_MOVE_TO_TARGET: "Auto move to target",
            FOLLOW_CLOSEST_TEAMMATE: "Follow closest teammate",
            AUTO_PLAY_AGAIN: "Auto play again",
            SEND_EMPTY_EMOTE: "Send empty emote",
            SKIP_REPLAY_INTRO: "Skip replay intro",
            SKIP_BATTLE_END_REPLAY: "Skip battle end replay",
            AUTO_READY: "Auto ready",
            BATTLE_SETTINGS: "Camera settings",
            SHOW_CHAT_BUTTON: "Show chat button",
            SHOW_ENEMY_AMMO: "Show enemy ammo",
            STOP_LOLA_CLONE: "Change Lola Control",
            KIT_MOVE_HACK: "Kit move when attached",
            ADD_BRAWL_PASS_POINTS_THIS_SEASON: "Add Brawl Pass points this season",
            ADD_CHAMPIONSHIP_CHALLENGE_WIN: "Add Championship Challenge Win",
            ADD_CHAMPIONSHIP_CHALLENGE_LOSS: "Add Championship Challenge Loss",
            SET_CC_ESPORTS_QUALIFIED: "Set CC/Esports Qualified",
            REMOVE_CC_ESPORTS_QUALIFIED: "Remove CC/Esports Qualified",
            FORCE_CHINA_GFX_TWEAKS: "Force China GFX Tweaks",
            HIDE_DEBUG_ITEMS: "Hide debug items",
            HIDE_TAGS: "Hide tags",
            HIDE_NAME: "Hide name",
            START_ROOM_SPAM: "Start room spam",
            STOP_ROOM_SPAM: "Stop room spam",
            SWITCH_TO_STAGE_SERVER: "Switch to Stage server",
            SWITCH_TO_PROD_SERVER: "Switch to Production server",
            UNLOCK_GEARS: "Unlock Gears",
            UNLOCK_CURRENT_BRAWL_PASS_SEASON: "Unlock Current Brawl Pass Season",
            UNLOCK_CURRENT_BRAWL_PASS_PLUS_SEASON: "Unlock current Brawl Pass Plus Season",
            SKIN_CHANGER: "Skin changer",
            ONLINE_SKIN_CHANGER: "Online mode",
            DOUBLE_CLICK_TO_SET_THEME_MUSIC: "Tap again to change music!",
            HIDE_ULTI_AIMING: "Hide ulti aiming",
            STATIC_BACKGROUND: "Static background",
            ANTI_AFK: "Anti AFK",
            HIDE_SPECIAL_OFFERS: "Hide special offers",
            CHARACTER_SOUNDS: "Character sounds",
            HIDE_BRAWLERS_IN_INTRO: "Hide brawlers in intro",
            HIDE_LEAGUE_IN_BATTLE_CARD: "Hide league in battle card",
            USE_OLD_INTRO: "Use old intro",
            BYPASS_ANTI_PROFANITY: "Bypass anti profanity",
            CLOSE_RANKED_SCREEN: "Close Ranked screen",
            SLOW_MODE: "Slow mode",
            VISUAL_CHROMATIC_NAME: "Visual chromatic name",
            DISABLE_OUTLINE: "Disable outline",
            EMOTE_ANIMATION: "Emote animation",
            SHOW_FUTURE_EVENTS: "Show future events",
            HIDE_CREATOR_BOOST: "Hide creator boost",
            SHOW_BOT_PREFIX: "Show bot prefix",
            USE_LEGACY_BACKGROUND: "Use legacy background",
            SKIP_STARR_DROP_ANIMATION: "Skip starr drop animation",
            MOVEMENT_BASED_AUTOSHOOT: "Movement based autoshoot",
            SPECTATE_BY_TAG: "Spectate by tag",
            AUTO_DODGE: "Auto dodge",
            HIDE_BATTLE_STATE: "Hide battle state",
            AUTO_EXIT_AFTER_BATTLE: "Auto exit after battle",
            MARK_FAKE_LEON: "Mark fake Leon",
            SHOW_FPS: "Show FPS",
            SHOW_TIME: "Show time",
            SHOW_SESSION_TIME: "Show session time",
            SHOW_OWN_TEAM: "Show own team",
            SHOW_BATTLE_INFO: "Show battle info",
            SHOW_BATTLE_PING: "Show battle ping",
            CHANGELOGS: "Changelogs",
            SFX: "SFX",
            MUSIC: "Music",
            HAPTICS: "Haptics",
            PROBING_CANE_MODE: "Probing cane mode",
            ADVANCED_PROBING_CANE_MODE: "Advanced probing cane mode",
            SPAWN_DVD: "Spawn 1 DVD",
            REMOVE_DVD: "Remove 1 DVD",
            REMOVE_ALL_DVD: "Remove all DVD",
            CURRENT_SERVER_THEME: "Current server theme",
            NO_PROXY: "No proxy",
            STATUS_NORMAL: "<c00ff00>NORMAL</c>",

            TEST: "Test!",
            AGE_GATE_REMOVAL_STARTED: "The Age Gate dialog has been opened. Please enter an age of 21 or above to remove restrictions.",

            HIDE_ULTI_AIMING_ON: "Others will now won't see when you aim ulti!",
            HIDE_ULTI_AIMING_OFF: "Others will now see when you aim ulti!",

            STOP_LOLA_CLONE_ON: "Lola's clone won't move now.",
            STOP_LOLA_CLONE_OFF: "Lola's clone will move now.",


            EDIT_CONTROLS_ON: "Edit controls button now <c41fc03>will</c> be shown in battle.",
            EDIT_CONTROLS_OFF: "Edit controls button now <cfff700>won't</c> be shown in battle.",

            BATTLE_SHORTCUTS_ON: "Battle shortcuts now <c41fc03>will</c> be shown in battle.",
            BATTLE_SHORTCUTS_OFF: "Battle shortcuts now <cfff700>won't</c> be shown in battle.",

            SHOW_EDIT_CONTROLS: "Show edit controls button",
            SHOW_BATTLE_SHORTCUTS: "Show battle shortcuts",

            AUTO_PLAY_AGAIN_ON: "Now you will play again automatically after end of the battle.",
            AUTO_PLAY_AGAIN_OFF: "Now you won't play again automatically after end of the battle.",
            AUTO_EXIT_AFTER_BATTLE_ON: "Now you will exit after battle automatically.",
            AUTO_EXIT_AFTER_BATTLE_OFF: "Now you won't exit after battle automatically.",
            SKIP_REPLAY_INTRO_ON: "Any replay intro will be skipped now.",
            SKIP_REPLAY_INTRO_OFF: "Any replay intro won't be skipped now.",
            ANTI_AFK_ON: "Anti AFK enabled.",
            ANTI_AFK_OFF: "Anti AFK disabled.",

            ANTI_PROFANITY_ON: "Anti-Profanity is enabled! Be careful, you may be banned for using bad words!",
            ANTI_PROFANITY_OFF: "Anti-Profanity is disabled.",

            PROXY_ERROR: "Looks like the proxy didn't work",
            PROD_SERVER_UPDATED: "You need to update client! You can update Gene Brawl here: t.me/gene_land",
            STAGE_SERVER_UPDATED: "Stage server was updated to new version! Unfortuanely, there's no way to download new client for it :(",
            STAGE_SERVER_REQUIRES_VPN: "Stage server is unavailable from your location.",

            LATENCY_TESTS_TRIGGERED: "Changing battle server, wait...",
            BATTLE_SERVER_CHANGED: "Battle server changed!",
            BATTLE_SERVER_SPOOF_DISABLED: "Battle server spoof is disabled!",

            KIT_MOVE_HACK_ON: "Now Kit can move while attached.",
            KIT_MOVE_HACK_OFF: "Now Kit can't move while attached.",

            AUTO_READY_ON: "Now when entering menu you will be auto \"READY\". (Only in team)",
            AUTO_READY_OFF: "Now when entering menu you won't be auto \"READY\".",

            AUTO_HYPERCHARGE_ON: "Now hypercharge will be auto activated.",
            AUTO_HYPERCHARGE_OFF: "Now hypercharge won't be auto activated.",

            // Activation
            NEED_TO_ACTIVATE: "Hey, you need to activate a mod! Type (/activate $KEY) in \"SCUtils\" topic",
            KEY_UNAVAILABLE: "Hi! Looks like activation server isn't available right now. Try login later!",

            // Team spam
            TEAM_SPAM_INIT: "Spam is starting!",
            TEAM_SPAM_STOPPED: "Spam stopped!",
            TEAM_SPAM_CANCELLED: "Spam cancelled.",
            TEAM_SPAM_NOT_RUNNING: "Spam was not running",

            // Out Of Sync
            OUT_OF_SYNC_ON: "You will not be disconnected if you select something you don't have.",
            OUT_OF_SYNC_OFF: "You will be DISCONNECTED if you select something you don't have.",

            // Content Creator Boost
            CONTENT_CREATOR_BOOST_ON: "Content creator boost enabled.",
            CONTENT_CREATOR_BOOST_OFF: "Content creator boost disabled.",

            // Battle State
            BATTLE_STATE_HIDDEN: "Battle state is hidden.",
            BATTLE_STATE_VISIBLE: "Battle state is visible.",

            // Slow mode
            SLOW_MODE_ON: "Slow mode is enabled",
            SLOW_MODE_OFF: "Slow mode is disabled",

            // Side Mask
            SIDE_MASK_ON: "Side mask is enabled",
            SIDE_MASK_OFF: "Side mask is disabled",

            // Fake Premium Pass
            FAKE_PREMIUM_PASS_ON: "Visual chromatic name is enabled!",
            FAKE_PREMIUM_PASS_OFF: "Visual chromatic name is disabled!",

            // Future Events
            FUTURE_EVENTS_ON: "Future events are visible!",
            FUTURE_EVENTS_OFF: "Future events are hidden!",

            // Debug Items
            DEBUG_ITEMS_HIDDEN: "Debug items are hidden. If you want to enable, type /debug command in chat.",
            DEBUG_ITEMS_VISIBLE: "Debug items are visible.",

            // Emote animation
            EMOTE_ANIMATION_ON: "Emote animation is enabled",
            EMOTE_ANIMATION_OFF: "Emote animation is disabled!",

            NO_COMMAND_DEFINED: "No command defined!",

            PROXY_OFF: "Proxy is disabled! The next time you enter the game, the proxy will not be used!",

            STATIC_BACKGROUND_ON: "Some game menus will now use the background from the main menu!",
            STATIC_BACKGROUND_OFF: "Some game menus will now use a default background!",

            CONNECTION_INDICATOR_ON: "Your connection to the server will now be displayed in battle!",
            CONNECTION_INDICATOR_OFF: "Now your connection to the server will not be displayed in battle!",

            SPECIAL_OFFERS_ON: "Special offers now hidden!",
            SPECIAL_OFFERS_OFF: "Special offers now are displayed!",

            CHINA_VERSION_ON: "The game's client now uses Chinese add-ons.",
            CHINA_VERSION_OFF: "Now the game client doesn't use Chinese add-ons.",

            AUTO_MOVE_TARGET_ON: "Now your character will automatically move to the closest enemy.",
            AUTO_MOVE_TARGET_OFF: "Now your character won't automatically move to the closest enemy.",

            AUTO_AIM_ON: "Now your character will automatically attack the closest enemy.",
            AUTO_AIM_OFF: "Now your character won't automatically attack the closest enemy.",

            AUTO_ULTI_ON: "Now your character will automatically ULTI attack the closest enemy.",
            AUTO_ULTI_OFF: "Now your character won't automatically ULTI attack the closest enemy.",

            HOLD_TO_SHOOT_ON: "Autoattack while holding attack stick enabled.",
            HOLD_TO_SHOOT_OFF: "Autoattack while holding attack stick disabled.",

            MOVEMENT_BASED_AUTOSHOOT_ON: "Movement based autoattack (Mortis) enabled.",
            MOVEMENT_BASED_AUTOSHOOT_OFF: "Movement based autoattack (Mortis) disabled.",

            OWN_PLAYER_TEAM: "Own player team: {0}",

            RED: "<cff2600>R<cff2600>E<cff2600>D</c>",
            BLUE: "<c0433ff>B<c0433ff>L<c0433ff>U<c0433ff>E</c>",

            SHOW_SESSION_TIME_ON: "Session time is now displayed.",
            SHOW_SESSION_TIME_OFF: "Session time is no longer displayed.",

            SHOW_CURRENT_TIME_ON: "Current time is now displayed.",
            SHOW_CURRENT_TIME_OFF: "Current time is no longer displayed.",

            SHOW_FPS_ON: "FPS is now displayed.",
            SHOW_FPS_OFF: "FPS is no longer displayed.",

            SHOW_TEAM_ON: "Your actual team will now be displayed in battle.",
            SHOW_TEAM_OFF: "Now your real command will not be displayed in battle.",

            SHOW_NAME_ON: "Player names is now displayed.",
            SHOW_NAME_OFF: "Player names is no longer displayed.",

            SHOW_TAGS_ON: "Player tags is now displayed.",
            SHOW_TAGS_OFF: "Player tags is no longer displayed.",

            SFX_ON: "Sound is now enabled.",
            SFX_OFF: "Sound is now disabled.",

            MUSIC_ON: "Music is now enabled.",
            MUSIC_OFF: "Music is now disabled.",

            HAPTICS_ON: "Haptics is now enabled.",
            HAPTICS_OFF: "Haptics is now disabled.",

            ENEMY_BULLETS_ON: "Showing enemy's bullets enabled!",
            ENEMY_BULLETS_OFF: "Showing enemy's bullets disabled!",

            BATTLE_PING_ON: "Showing ping in battle enabled!",
            BATTLE_PING_OFF: "Showing ping in battle disabled!",

            SKIP_BATTLE_END_REPLAY_ON: "«GAME HIGHLIGHT» is no longer displayed after the end of battle.",
            SKIP_BATTLE_END_REPLAY_OFF: "«GAME HIGHLIGHT» is now displayed after the end of battle.",

            FOLLOW_ALLY_ON: "Now your character will follow closest teammate.",
            FOLLOW_ALLY_OFF: "Now your character won't follow closest teammate.",

            NOT_IMPLEMENTED_YET: "This feature is not implemented yet! We will implement it later.",
            NOT_IMPLEMENTED_YET_IOS: "This feature is not implemented yet for iOS! We will implement it later.",
            NOT_IMPLEMENTED_YET_ANDROID: "This feature is not implemented yet for Android! We will implement it later.",

            GENE_PROXY: "Gene proxy enabled! Restart game to apply changes.",
            PROXY_DISABLED: "Proxy is disabled! Restart game to apply changes.",

            DEFAULT_THEME_ON: "Default theme is enabled",
            DEFAULT_THEME_OFF: "Default theme is disabled!",

            CAMERA_MODE_CHANGED: "Camera mode changed to: {cameraMode}",
            CAMERA_MODE_0: "Default",
            CAMERA_MODE_1: "Corner view",
            CAMERA_MODE_2: "Map view",
            CAMERA_MODE_3: "Custom (you can change camera settings in Battle->Battle Settings)",

            LOLA_CONTROL_0: "Now you can control LOLA and HER CLONE!",
            LOLA_CONTROL_1: "Now you can control only LOLA!",
            LOLA_CONTROL_2: "Now you can control only LOLA'S CLONE!",

            SPECTATE_TAG: "SPECTATE BY TAG",
            SPECTATE_INPUT: "#2PP",
            SPECTATE: "SPECTATE",
            SPECTATE_TAG_NO_CODE: "You didn't put tag!",
            SPECTATE_TAG_WRONG_CODE: "Incorrect tag!",

            PROFILE_TAG: "OPEN PROFILE BY TAG",
            PROFILE_INPUT: "#2PP",
            PROFILE: "OPEN",
            PROFILE_TAG_NO_CODE: "You didn't put tag!",
            PROFILE_TAG_WRONG_CODE: "Incorrect tag!",

            OPEN_URL: "Input URL here...",
            INCORRECT_URL: "Invalid URL!",
            OPEN_URL_BUTTON: "Open",

            BOT_PREFIX_ON: "<c3>[BOT]</c> prefix is now displayed.",
            BOT_PREFIX_OFF: "<c3>[BOT]</c> prefix is no longer displayed.",

            CHAT_BUTTON_ON: "Chat button will now be displayed in battle.",
            CHAT_BUTTON_OFF: "Chat button will now not be displayed in battle.",

            // /name
            NAME_CMD_WRONG_INPUT: "/name [tag] [name]",
            NAME_CMD_INVALID_TAG: "Name for this player can't be changed!",

            BATTLE_INFO_ON: "Battle info is now displayed.",
            BATTLE_INFO_OFF: "Battle info is no longer displayed.",

            // Braille
            BRAILLE_ON: "Probing cane mode enabled!\nGame will reload in 4s.",
            BRAILLE_OFF: "Probing cane mode disabled.\nGame will reload in 4s.",
            BRAILLE_INTERRUPTED: "Probing cane mode change was interrupted.",

            DARK_THEME_ON: "Dark theme is enabled!\nGame will reload in 4s.",
            DARK_THEME_OFF: "Dark theme is disabled!\nGame will reload in 4s.",
            DARK_THEME_INTERRUPTED: "Dark theme changing was interrupted.",

            TAG_COPIED: "Tag was copied!",
            IOS_TOO_OLD: "<cfff700>You are using outdated Gene Brawl version for iOS. Please, update using new .ipa in \"Обновления\" topic.</c>",
            ANTI_OUT_OF_SYNC: "<cfff700>You have \"Bypass Out Of Sync\" activated, disable it if you don't need it anymore.</c>",

            XRAY_TARGET_SELECTED: "Xray target %TARGET selected!",

            STATUS_REVERTED: "Team status is back to <c00ff00>NORMAL</c>",
            STATUS_CHANGED: "Team status changed to %STATUS",

            LEGACY_BACKGROUND_ON: "Legacy menu theme enabled.",
            LEGACY_BACKGROUND_OFF: "Legacy menu theme disabled.",

            MARK_FAKE_NINJA_ON: "Leon's clone will be marked red.",
            MARK_FAKE_NINJA_OFF: "Leon's clone will not be marked red.",

            CHANGELOGS_SCRIPTVERSION: "script version: {scriptVersion}",
            CHANGELOGS_ADDITIONS: "Added",
            CHANGELOGS_FIXES: "Fixed",
            CHANGELOGS_REMOVALS: "Removed",
            CHANGELOGS_DIALOG_TITLE: "Change logs",
            CHANGELOGS_DIALOG_BUTTON: "OK",

            SKIP_RANDOM_ANIMATION_ON: "Starr Drops will be open immediately now.",
            SKIP_RANDOM_ANIMATION_OFF: "You need to hold/tap Starr Drops now.",

            HIDE_HEROES_INTRO_ON: "Brawlers is now hidden in intro!",
            HIDE_HEROES_INTRO_OFF: "Brawlers is now shown in intro!",

            HIDE_LEAGUE_BATTLE_CARD_ON: "Battle card background is now hidden in intro!",
            HIDE_LEAGUE_BATTLE_CARD_OFF: "Battle card background is now shown in intro!",

            USE_OLD_INTRO_ON: "Using OLD intro now.",
            USE_OLD_INTRO_OFF: "Using NEW intro now.",

            CANNOT_SEE_PROFILE_IN_BATTLE: "It's not possible to see profiles in battle!",
            ACCOUNT: "Account",
            BATTLE: "Battle",
            LATENCY: "Latency",
            CAMERA_MODE: "Camera Mode",
            CHANGE_THEME: "Change Theme",
            FUN: "Fun",
            GFX: "GFX",
            PRC_CHINA: "PRC / China",
            GAME_SETTINGS: "Game Settings",
            OPTIMIZATION: "Optimization",
            PROXY: "Proxy",
            SC_UTILS: "SC Utils",
            SERVERS: "Servers",
            TESTS: "Tests",
            USEFUL_INFO: "Useful Info",
            EXPERIMENTAL: "Experiments",
            XRAY: "X-Ray",
            MISC: "Miscellaneous",
            PREVIEW: "Preview",
            SC_ID: "Supercell ID",
            BRAWL_PASS: "Brawl Pass",
            CHALLENGE: "Challenge",
            STREAMER_MODE: "Streamer Mode",
            SPAM: "Spam",
            GEARS: "Gears",
            CHANGE_STATUS: "Change Status",
            MAIN: " ",

            BUTTONS_OPACITY: "Buttons Opacity",
            CAMERA_X: "Camera X",
            CAMERA_Y: "Camera Y",
            CAMERA_ROTATE_X: "Camera Rotate X",
            CAMERA_ROTATE_Y: "Camera Rotate Y",
            CAMERA_ALIGN: "Camera Align",
            CAMERA_DISTANCE: "Camera Distance",

            USER_IMAGE_MANAGER_LOADED_SUCCESSFULLY: "Image has been successfully loaded! Reload this menu to see the new picture.",
            USER_IMAGE_MANAGER_ERROR_WHILE_LOADING: "Error occured while trying to load a picture!",

            USER_IMAGE_SCREEN_TITLE: "Select image",
            USER_IMAGE_BUTTON_LOAD_IMAGE: "Load own image",

            USER_IMAGE_SELECTED_TITLE: "Image seleted!",
            USER_IMAGE_SELECTED_BODY: "What do you want to do with this image?",
            USER_IMAGE_SELECTED_BUTTON_SET_TO_THEME: "Set to main menu as theme",
            USER_IMAGE_SELECTED_BUTTON_DELETE: "Delete",

            USER_IMAGE_SET_TO_THEME_SUCCESS: "Image has been set to main menu as theme!",

            USER_IMAGE_DELETE_SUCCESS: "Image deleted!",
            USER_IMAGE_DELETE_ERROR: "Failed to delete image.",

            DANGEROUS_POPUP_TITLE: "Hold on!",
            DANGEROUS_POPUP_BODY: 'Are you sure you want to enable "{functionName}" function? This function is marked as <cff0000>dangerous</c> and may result in your account being blocked! All responsibility for your account rests solely with you!',

            DANGEROUS_POPUP_BUTTON_NO: "No, thanks!",
            DANGEROUS_POPUP_BUTTON_YES: "Sure, why not.",

            ANTI_KNOCKBACK: "Anti-Knockback",
            ANTI_KB_ON: "Anti-Knockback enabled!",
            ANTI_KB_OFF: "Anti-Knockback disabled!",

            PROTECTIVE_FEATURES: "Protective features",
            PROTECTIVE_FEATURES_ON: "Protective features enabled! <cff0900>Attention!</c> This function is still in development and may be unstable.",
            PROTECTIVE_FEATURES_OFF: "Protective features disabled.",

            SHOW_TICKS: "Show battle time",
            SHOW_TICKS_ON: "Battle time is now displayed!",
            SHOW_TICKS_OFF: "Battle time is no longer displayed.",

            DISABLE_OUTLINE_ON: "Outline was disabled!",
            DISABLE_OUTLINE_OFF: "Outline was enabled!"
        }
    };
}
// ============================================================
// FILE: src/gene/localization/validate.ts
// ============================================================
import * as fs from 'fs';
import * as path from 'path';
import {LocalizationManager} from "./index";

const keys: string[] = [];

function findLocalizationKeys(directory: string = "../../"): string[] {
    const regex = /LocalizationManager\.getStateString\s*\(\s*["'](.*?)["']\s*,\s*(.*)\s*\)/g;

    const files = fs.readdirSync(directory);

    files.forEach(file => {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            findLocalizationKeys(fullPath);
        } else if (file.endsWith('.ts')) {
            const content = fs.readFileSync(fullPath, 'utf-8');
            let match;
            while ((match = regex.exec(content)) !== null) {
                if (match[1] == "EXAMPLE")
                    continue;

                console.log(`Found match in file: ${fullPath}, key: ${match[1]}`);
                keys.push(match[1]);
            }
        }
    });

    return keys;
}

function main(): void {
    const keys = Object.keys(LocalizationManager.locales);
    const localizationKeys = findLocalizationKeys();

    if (keys.length === 0) {
        console.error("No locales defined.");
        return;
    }

    const missingKeys: { [lang: string]: string[]; } = {};

    keys.forEach((lang) => {
        missingKeys[lang] = [];
        const locale = LocalizationManager.locales[lang];
        if (!locale) {
            console.warn(`Locale for ${lang} is missing in LocalizationManager.`);
            return;
        }

        localizationKeys.forEach((key) => {
            if (!(key + "_ON" in locale)) {
                missingKeys[lang].push(key + "_ON");
            }
            if (!(key + "_OFF" in locale)) {
                missingKeys[lang].push(key + "_OFF");
            }
        });
    });

    Object.entries(missingKeys).forEach(([lang, missing]) => {
        console.warn(`Missing keys in ${lang} (${missing.length}):`);

        missing.forEach((miss) => {
            console.log(`${miss}: "",`);
        });
    });
}

main();
// ============================================================
// FILE: src/gene/networking/NetworkManager.ts
// ============================================================
export class NCoder {
    static s2n(str: string): { pesok: string; checksum: number; isSniffDetected: boolean; warn: string; meow: number; } {
        // we've decided to keep our "encryption" (if we can call it like that) private :)
        // not sure if it works after these changes but eh

        return {
            pesok: str,
            checksum: -1,
            isSniffDetected: false,
            warn: "",
            meow: 6967
        };
    }

    static n2s(str: string): string {
        // we've decided to keep our "encryption" (if we can call it like that) private :)
        return str;
    }

    static stringToBytes(str: string): Uint8Array {
        const bytes = new Uint8Array(str.length);
        for (let i = 0; i < str.length; i++) {
            bytes[i] = str.charCodeAt(i);
        }
        return bytes;
    }

    private static hexArrayToString(hexArray: string[]): string {
        return hexArray.map(byte => String.fromCharCode(parseInt(byte, 16))).join('');
    }

    static arrayBufferToString(buffer: ArrayBuffer): string {
        const uint8Array = new Uint8Array(buffer);
        let str = "";
        for (let i = 0; i < uint8Array.length; i++) {
            str += String.fromCharCode(uint8Array[i]);
        }
        return str;
    }
}

const SCUTILS_HOST = "scutils.hpdevfox.ru";
const SCUTILS_PORT = 13337;

export class NetworkManager {
    async transmit(req: string, callback: (response: string) => void, maxValue: number = 2048) {
        const payload = JSON.stringify(NCoder.s2n(req));
        const connection = await Socket.connect({
            host: SCUTILS_HOST,
            port: SCUTILS_PORT
        });

        await connection.output.write(Array.from(NCoder.stringToBytes(payload)));

        let str = "";

        while (!str.endsWith("}")) {
            str += NCoder.arrayBufferToString(await connection.input.read(maxValue));
        }

        if (str.includes("isSniffDetected")) {
            str = NCoder.n2s(str);
        }

        callback(str);

        connection.close();
    }
}
// ============================================================
// FILE: src/gene/popups/BattleSettingsPopup.ts
// ============================================================
import {GameSliderComponent} from "../../titan/flash/gui/GameSliderComponent";
import {ScrollArea} from "../../titan/flash/ScrollArea";
import {Configuration} from "../Configuration";
import {DebugMenuBase} from "../debug/DebugMenuBase";
import {DebugSliderComponent} from "../debug/DebugSliderComponent";
import {ToggleDebugClickerButton} from "../debug/ToggleDebugClickerButton";
import {LocalizationManager} from "../localization";

export class BattleSettingsPopup extends DebugMenuBase {
    private readonly toggleDebugClickerButton: ToggleDebugClickerButton;
    private sliderArray: DebugSliderComponent[] = [];
    private shouldUpdateScrollArea: boolean = false;

    constructor() { // TODO: ScrollArea
        super("preview_menu");

        this.setTitle(LocalizationManager.getString("BATTLE_SETTINGS"));

        this.toggleDebugClickerButton = new ToggleDebugClickerButton();
        this.toggleDebugClickerButton.setMovieClip(this.movieClip.getChildByName("close_button"));

        this.movieClip.getChildByName("preview_area").visibility = false;

        const title = this.movieClip.getChildByName("title");
        title.setXY(title.x + 20, title.y);

        this.createScrollArea();

        this.createSlider("BUTTONS_OPACITY", 0, 100, Configuration.opacity, function (slider: GameSliderComponent) {
            Configuration.opacity = slider.getCurrentValue();
        });

        this.createSlider("CAMERA_X", -10000, 10000, Configuration.cameraX, function (slider: GameSliderComponent) {
            Configuration.cameraX = slider.getCurrentValue();
        });

        this.createSlider("CAMERA_Y", -10000, 10000, Configuration.cameraY, function (slider: GameSliderComponent) {
            Configuration.cameraY = slider.getCurrentValue();
        });

        this.createSlider("CAMERA_ROTATE_X", -100000, 100000, Configuration.cameraRotateX, function (slider: GameSliderComponent) {
            Configuration.cameraRotateX = slider.getCurrentValue();
        });

        this.createSlider("CAMERA_ROTATE_Y", -100000, 100000, Configuration.cameraRotateY, function (slider: GameSliderComponent) {
            Configuration.cameraRotateY = slider.getCurrentValue();
        });

        this.createSlider("CAMERA_ALIGN", -100000, 100000, Configuration.cameraAlign, function (slider: GameSliderComponent) {
            Configuration.cameraAlign = slider.getCurrentValue();
        });

        this.createSlider("CAMERA_DISTANCE", -100000, 100000, Configuration.cameraDistance, function (slider: GameSliderComponent) {
            Configuration.cameraDistance = slider.getCurrentValue();
        });

        this.needToUpdateLayout();
    }

    needToUpdateLayout(): void {
        this.shouldUpdateScrollArea = true;
    }

    createScrollArea() {
        let itemArea = this.getMovieClip().getTextFieldByName("item_area");
        let itemWidth = itemArea!.getWidth();
        let itemHeight = itemArea!.getHeight();

        this.scrollArea = new ScrollArea(itemWidth, itemHeight + 75, 1);
        this.scrollArea.setUnk(true);

        let itemX = itemArea!.x;
        let itemY = itemArea!.y;

        this.scrollArea.setXY(itemX, itemY - 75);
        this.scrollArea.enablePinching(false);
        this.scrollArea.setAlignment(4);
        this.scrollArea.enableHorizontalDrag(false);

        this.movieClip.addChild(this.scrollArea);
    }

    createSlider(name: string, minValue: number, maxValue: number, currentValue: number, updateCallback: Function) {
        const localizedName = LocalizationManager.getString(name);
        const slider = new DebugSliderComponent(localizedName, 0, 120, updateCallback);

        const title = this.movieClip.getTextFieldByName("title")?.x!;

        const textField = slider.getBgMovieClip().getTextFieldByName("TID_EDIT_SCALE")!;

        textField.setXY(textField.x, textField.y - 5);

        slider.setXY(title / 2 - 20, 30 + slider.getHeight() * this.sliderArray.length);

        slider.setValueBounds(minValue, maxValue);
        slider.setCurrentValue(currentValue);

        //this.addChild(slider)

        this.sliderArray.push(slider);
    }

    update(deltaTime: number): void {
        //super.update(deltaTime)
        if (this.shouldUpdateScrollArea) {
            this.updateScrollLayout();
        }

        for (const slider of this.sliderArray) {
            this.updateSlider(slider);
        }
    }

    updateScrollLayout() {
        const self = this;

        this.scrollArea.removeAllContent();

        let Y = 0;

        this.sliderArray.forEach((slider, index) => {
            const textField = slider.getBgMovieClip().getTextFieldByName("TID_EDIT_SCALE")!;

            textField.setXY(textField.x, textField.y - 10);

            slider.setXY(slider.getWidth() / 2, Y); // this.sliderArray.length

            Y += slider.getHeight();

            self.scrollArea.addChild(slider);
        });

        this.shouldUpdateScrollArea = false;
    }

    updateSlider(slider: DebugSliderComponent) {
        slider.update();
    }
}
// ============================================================
// FILE: src/gene/popups/BlackListScreen.ts
// ============================================================
import {Libc} from "../../libs/Libc";
import {Libg} from "../../libs/Libg";
import {MovieClip} from "../../titan/flash/MovieClip";
import {MovieClipHelper} from "../../titan/flash/MovieClipHelper";
import {Rect} from "../../titan/flash/Rect";
import {ScrollArea} from "../../titan/flash/ScrollArea";
import {Stage} from "../../titan/flash/Stage";
import {TextField} from "../../titan/flash/TextField";
import {GUI} from "../../titan/flash/gui/GUI";
import {GameButton} from "../../titan/flash/gui/GameButton";
import {GameSliderComponent} from "../../titan/flash/gui/GameSliderComponent";
import {IButtonListener} from "../../titan/flash/gui/IButtonListener";
import {PopupBase} from "../../titan/flash/gui/PopupBase";
import {BlackListedPlayerButton} from "./buttons/BlackListedPlayerButton";

export class BlackListScreen extends PopupBase {
    private readonly textField: TextField;
    private clicksTextField!: TextField;
    private scrollArea: ScrollArea;
    private slider!: GameSliderComponent;

    constructor() {
        super(Libc.malloc(408), 'sc/ui.sc', "language_popup");

        this.instance.writePointer(Libg.offset(0x0, 0x0));
        this.instance.add(96).writePointer(Libg.offset(0x0, 0x0));
        this.instance.add(448).writeInt(0);

        this.setUpScreenHeader();

        this.scrollArea = new ScrollArea(0, 0, 1);
        this.instance.add(416).writePointer(this.scrollArea.instance);

        this.movieClip = new MovieClip(
            this.instance.add(208).readPointer()
        );

        if (this.movieClip.instance.isNull()) {
            this.movieClip = new MovieClip(
                this.instance.add(112).readPointer()
            );
        }

        this.textField = this.movieClip.getTextFieldByName("title_txt")!;

        this.instance.add(432).writePointer(this.textField.instance);
        this.instance.add(440).writeFloat(this.textField.y);
        this.textField.setText("Black List");

        MovieClipHelper.autoAdjustText(this.textField);

        this.createScrollArea();
    }

    setActiveScrollArea(scrollArea: ScrollArea) {
        this.instance.add(416).writePointer(scrollArea.instance);
    }

    createScrollArea() {
        const rect = new Rect();
        const childMovieClip = new MovieClip(this.instance.add(112).readPointer());

        const area = childMovieClip.getTextFieldByName("area")!;
        GUI.resizeToScreenHeight(area);

        const safeMarginLeft = Stage.getSafeMarginLeft();
        const safeMarginRight = Stage.getSafeMarginRight();
        const pointSize = Stage.getPointSize() === 0.0 ? 0.1 : Stage.getPointSize();
        const offset336 = Stage.getOffset336();
        const areaHeight = area?.getHeight() as number;

        const v13 = ((offset336 - ((safeMarginRight + safeMarginLeft) / pointSize)) - areaHeight) * 0.5;
        const v14 = rect.instance.readFloat() - v13;
        const v15 = v13 + rect.instance.add(8).readFloat();

        rect.instance.writeFloat(v14);
        rect.instance.add(8).writeFloat(v15);

        const rectWidth = rect.getWidth();
        const rectHeight = rect.getHeight();

        const scrollArea = new ScrollArea(rectWidth, rectHeight, 1);

        this.setActiveScrollArea(scrollArea);

        scrollArea.setPixelSnappedXY(v14, 0.0);
        scrollArea.enablePinching(false);
        scrollArea.enableHorizontalDrag(false);
        scrollArea.enableVerticalDrag(true);
        scrollArea.setAlignment(4);
        scrollArea.setUnk(true);

        this.addContent(scrollArea);

        let naviHeight = this.getNaviHeight();

        let buttonIndex = 0;

        const testArray = ["#2PP"];

        for (const player of testArray) {
            const button = new BlackListedPlayerButton(player);

            button.setButtonListener(new IButtonListener(this.buttonClicked));

            const buttonWidth = button.getWidth();
            const buttonHeight = button.getHeight();

            const rectWidth = rect.getWidth();
            const buttonMiddleHeight = buttonHeight / 2;
            let buttonIndexTemp = buttonIndex;

            const x = (rectWidth / 2) + ((buttonIndexTemp + -1) * buttonWidth);
            const y = naviHeight + buttonMiddleHeight;

            button.setXY(x, y);

            if (buttonIndexTemp === 2) {
                naviHeight += buttonHeight;
            }

            buttonIndex = buttonIndexTemp - 2;

            if (buttonIndexTemp !== 2) {
                buttonIndex = buttonIndexTemp + 1;
            }

            scrollArea.addContent(button);
        }

        this.scrollArea = scrollArea;
    }

    buttonClicked(listener: NativePointer, button: NativePointer) {
        const gameButton = new GameButton(button);
        console.log("BlackListScreen.buttonClicked:", "pressed on", gameButton.getText());
    }

    setXy() {
        const x = Stage.getX();
        this.setPixelSnappedXY(x, 0.0);
    }

    update(deltaTime: number) {
        super.update(deltaTime);
    }
}
// ============================================================
// FILE: src/gene/popups/DownloadImagePopup.ts
// ============================================================
import {Libc} from "../../libs/Libc";
import {TextField} from "../../titan/flash/TextField";
import {GameButton} from "../../titan/flash/gui/GameButton";
import {GenericPopup} from "../../titan/flash/gui/GenericPopup";
import {IButtonListener} from "../../titan/flash/gui/IButtonListener";
import {GameInputField} from "../../titan/flash/input/GameInputField";
import {Storage} from "../Storage";
import {LocalizationManager} from "../../gene/localization/index";
import {GUI} from "../../titan/flash/gui/GUI";
import {Constants} from "../Constants";
import {UserImagesManager} from "../features/UserImagesManager";

export class DownloadImagePopup extends GenericPopup {
    gameInputField!: GameInputField;
    button: GameButton;
    textInputButton!: GameButton;
    textField!: TextField;


    constructor() {
        super("club_mail_popup");

        this.setTitle("Download Image popup test");

        this.button = this.addButtonWithText("join_button", 1, LocalizationManager.getString("OPEN_URL_BUTTON"));

        this.createInputField();

        this.closeButton!.setButtonListener(new IButtonListener(this.buttonClicked));
        this.button.setButtonListener(new IButtonListener(this.buttonClicked));

        const previousPopup = Storage.getPopup(this) ? Storage.getPopup(this) as DownloadImagePopup : null;

        if (previousPopup) {
            try {
                previousPopup.gameInputField.activate(false);
                previousPopup.fadeOut();
                Storage.removePopupByInstance(previousPopup.instance);
            } catch (e) { }
        }

        Storage.addPopup(this);
    }

    createInputField() {
        this.textInputButton = this.addButtonWithText("team_code_input", 2, "");

        const movieClip = this.textInputButton.getMovieClip();

        this.textField = movieClip.getTextFieldByName("teamcode_txt") as TextField;

        this.textField.setText("");

        this.gameInputField = new GameInputField(Libc.malloc(200), this.textField, this.instance);

        this.gameInputField.setScaleTextIfNeed(true);
        this.gameInputField.setMaxTextLength(255);

        this.textInputButton.setButtonListener(new IButtonListener(this.textInputClicked));

        this.setActiveInputField(this.gameInputField);
    }

    update(float: number) {
        super.update(float);
    }

    private textInputClicked(listener: NativePointer, button: NativePointer) {
        const popup = Storage.popups.find(e => e instanceof DownloadImagePopup) as DownloadImagePopup;

        popup.gameInputField.activate(true);
    }

    private buttonClicked(listener: NativePointer, button: NativePointer) {
        const popup = Storage.popups.find(e => e instanceof DownloadImagePopup) as DownloadImagePopup;

        const gameInputField = popup.gameInputField;

        if (popup.button.instance.toInt32() == button.toInt32()) {
            const gameInputField = popup.gameInputField;
            const input = gameInputField.getInputText().trim();

            gameInputField.activate(false);

            if (input.trim() == "") {
                GUI.showFloaterText(LocalizationManager.getString("INCORRECT_URL"));
                return;
            }

            let builtInput = input;

            if (input.startsWith("http://")) {
                builtInput = builtInput.replace("http://", "https://");
            }

            if (!input.startsWith("http")) {
                builtInput = "https://" + builtInput;
            }

            if (!Constants.IMAGE_FORMAT_REGEX.test(builtInput)) {
                GUI.showFloaterText("Wrong URI!");
                return;
            }

            UserImagesManager.downloadImage(builtInput);

            popup.gameInputField.activate(false);
            popup.fadeOut();
            Storage.removePopupByInstance(popup.instance);
        }
        else if (popup.closeButton!.instance.toInt32() == button.toInt32()) {
            console.log("Closed!");
            popup.gameInputField.activate(false);
            popup.fadeOut();
            Storage.removePopupByInstance(popup.instance);
        }
    }
}
// ============================================================
// FILE: src/gene/popups/HamsterScreen.ts
// ============================================================
import {Libc} from "../../libs/Libc";
import {Libg} from "../../libs/Libg";
import {ResourceManager} from "../../titan/ResourceManager";
import {MovieClip} from "../../titan/flash/MovieClip";
import {MovieClipHelper} from "../../titan/flash/MovieClipHelper";
import {ScrollArea} from "../../titan/flash/ScrollArea";
import {Stage} from "../../titan/flash/Stage";
import {TextField} from "../../titan/flash/TextField";
import {GUI} from "../../titan/flash/gui/GUI";
import {GameButton} from "../../titan/flash/gui/GameButton";
import {IButtonListener} from "../../titan/flash/gui/IButtonListener";
import {PopupBase} from "../../titan/flash/gui/PopupBase";
import {Debug} from "../Debug";
import {Resources} from "../Resources";

export class HamsterScreen extends PopupBase {
    private readonly textField: TextField;
    private hamsterButton!: GameButton;
    private levelUpButton!: GameButton;
    clicks: number = 0;
    upgrade: number = 1;
    upgradeCost: number = 100;
    private clicksTextField!: TextField;
    private scrollArea: ScrollArea;

    constructor() {
        super(Libc.malloc(408), 'sc/ui.sc', "language_popup");

        this.instance.writePointer(Libg.offset(0x0, 0x0));
        this.instance.add(96).writePointer(Libg.offset(0x0, 0x0));
        this.instance.add(448).writeInt(0);

        this.setUpScreenHeader();

        this.scrollArea = new ScrollArea(0, 0, 1);
        this.instance.add(416).writePointer(this.scrollArea.instance);

        this.movieClip = new MovieClip(
            this.instance.add(208).readPointer()
        );

        if (this.movieClip.instance.isNull()) {
            this.movieClip = new MovieClip(
                this.instance.add(112).readPointer()
            );
        }

        this.textField = this.movieClip.getTextFieldByName("title_txt")!;

        this.instance.add(432).writePointer(this.textField.instance);
        this.instance.add(440).writeFloat(this.textField.y);
        this.textField.setText("Выберите количество тян");

        MovieClipHelper.autoAdjustText(this.textField);

        this.setUpTests();
        this.setUpHamster();
        this.setUpClicksText();
        this.setUpButtons();
    }

    setUpTests() {

    }

    setUpHamster() {
        const emojiMovieClip = ResourceManager.getMovieClip(Resources.EMOJI, "emoji_digger");

        emojiMovieClip.setXY(0, Stage.getY());
        emojiMovieClip.setScale(4);
        emojiMovieClip.playOnce();
        emojiMovieClip.setFrame(2);

        this.hamsterButton = new GameButton();

        this.hamsterButton.setMovieClip(emojiMovieClip);
        this.hamsterButton.setButtonListener(new IButtonListener(this.hamsterPressed));

        this.hamsterButton.visibility = false;

        this.addChild(this.hamsterButton);
    }

    closeButtonPressed() {
        const hamsterScreen = Debug.getHamsterScreen();

        hamsterScreen.fadeOut();
    }

    setUpClicksText() {
        const movieClip = ResourceManager.getMovieClip('sc/ui.sc', "language_popup");

        this.clicksTextField = movieClip.getTextFieldByName("title_txt")!;

        this.clicksTextField.setXY(this.clicksTextField.x, this.clicksTextField.y + this.textField.getHeight() + 10);
        this.clicksTextField.setFontSize(72);
        this.clicksTextField.setText("Clicks: " + this.clicks);

        MovieClipHelper.autoAdjustText(this.clicksTextField);

        this.clicksTextField.visibility = false;

        this.addChild(this.clicksTextField);
    }

    setUpButtons() {
        const button = ResourceManager.getMovieClip("sc/ui.sc", "popover_button_blue");

        button.setXY(Stage.getX() - button.getWidth(), Stage.getY());

        this.levelUpButton = new GameButton();

        this.levelUpButton.setMovieClip(button);

        this.levelUpButton.setText("Level UP! Cost: " + this.upgrade * this.upgradeCost);

        this.levelUpButton.setButtonListener(new IButtonListener(this.levelUpButtonPressed));

        this.levelUpButton.visibility = false;

        this.addChild(this.levelUpButton);
    }

    levelUpButtonPressed() {
        const hamster = Debug.getHamsterScreen();
        const cost = hamster.upgrade * hamster.upgradeCost;

        if (hamster.clicks < cost) {
            return GUI.showFloaterText("not enough");
        }

        hamster.clicks -= cost;
        hamster.upgrade++;
        GUI.showFloaterText("you're good");

        hamster.updateClicksText();
        hamster.updateLevelUpButton();
    }

    hamsterPressed() {
        const hamster = Debug.getHamsterScreen();

        hamster.clicks += 1 * hamster.upgrade;

        hamster.updateClicksText();
    }

    updateClicksText() {
        this.clicksTextField.setText("Clicks: " + this.clicks);
        MovieClipHelper.autoAdjustText(this.clicksTextField);
    }

    updateLevelUpButton() {
        this.levelUpButton.setText("Level UP! Cost: " + this.upgrade * this.upgradeCost);
    }

    setXy() {
        const x = Stage.getX();
        this.setPixelSnappedXY(x, 0.0);
    }

    update(deltaTime: number) {
        super.update(deltaTime);
    }
}
// ============================================================
// FILE: src/gene/popups/OpenUrlPopup.ts
// ============================================================
import {Libc} from "../../libs/Libc";
import {TextField} from "../../titan/flash/TextField";
import {GameButton} from "../../titan/flash/gui/GameButton";
import {GenericPopup} from "../../titan/flash/gui/GenericPopup";
import {IButtonListener} from "../../titan/flash/gui/IButtonListener";
import {GameInputField} from "../../titan/flash/input/GameInputField";
import {Storage} from "../Storage";
import {LocalizationManager} from "../../gene/localization/index";
import {GUI} from "../../titan/flash/gui/GUI";
import {SimpleWebview} from "../../titan/client/SimpleWebview";

export class OpenUrlPopup extends GenericPopup {
    gameInputField!: GameInputField;
    button: GameButton;
    textInputButton!: GameButton;
    textField!: TextField;

    constructor() {
        super("club_mail_popup");

        this.setTitle(LocalizationManager.getString("OPEN_URL"));

        this.button = this.addButtonWithText("join_button", 1, LocalizationManager.getString("OPEN_URL_BUTTON"));

        this.createInputField();

        this.closeButton!.setButtonListener(new IButtonListener(this.buttonClicked));
        this.button.setButtonListener(new IButtonListener(this.buttonClicked));

        const previousPopup = Storage.getPopup(this) ? Storage.getPopup(this) as OpenUrlPopup : null;

        if (previousPopup) {
            try {
                previousPopup.gameInputField.activate(false);
                previousPopup.fadeOut();
                Storage.removePopupByInstance(previousPopup.instance);
            } catch (e) { }
        }

        Storage.addPopup(this);
    }

    createInputField() {
        this.textInputButton = this.addButtonWithText("team_code_input", 2, "");

        const movieClip = this.textInputButton.getMovieClip();

        this.textField = movieClip.getTextFieldByName("teamcode_txt") as TextField;

        this.textField.setText("google.com");

        this.gameInputField = new GameInputField(Libc.malloc(200), this.textField, this.instance);

        this.gameInputField.setScaleTextIfNeed(true);
        this.gameInputField.setMaxTextLength(255);

        this.textInputButton.setButtonListener(new IButtonListener(this.textInputClicked));

        this.setActiveInputField(this.gameInputField);
    }

    update(float: number) {
        super.update(float);
    }

    private textInputClicked(listener: NativePointer, button: NativePointer) {
        const popup = Storage.popups.find(e => e instanceof OpenUrlPopup) as OpenUrlPopup;

        popup.gameInputField.activate(true);
    }

    private buttonClicked(listener: NativePointer, button: NativePointer) {
        const popup = Storage.popups.find(e => e instanceof OpenUrlPopup) as OpenUrlPopup;

        const gameInputField = popup.gameInputField;

        if (popup.button.instance.toInt32() == button.toInt32()) {
            const gameInputField = popup.gameInputField;
            const input = gameInputField.getInputText().trim();

            gameInputField.activate(false);

            if (input.trim() == "") {
                GUI.showFloaterText(LocalizationManager.getString("INCORRECT_URL"));
                return;
            }

            let builtInput = input;

            if (input.startsWith("http://")) {
                builtInput = builtInput.replace("http://", "https://");
            }

            if (!input.startsWith("http")) {
                builtInput = "https://" + builtInput;
            }

            const simpleWebView = new SimpleWebview();
            simpleWebView.setTitle("Gene Brawl Webview"); // FIXME: error
            simpleWebView.loadUrl(builtInput);
            GUI.showPopup(simpleWebView.instance, 0, 0, 1);

            popup.gameInputField.activate(false);
            popup.fadeOut();
            Storage.removePopupByInstance(popup.instance);
        }
        else if (popup.closeButton!.instance.toInt32() == button.toInt32()) {
            console.log("Closed!");
            popup.gameInputField.activate(false);
            popup.fadeOut();
            Storage.removePopupByInstance(popup.instance);
        }
    }
}
// ============================================================
// FILE: src/gene/popups/OwnQuestionPopup.ts
// ============================================================
import {MovieClipHelper} from "../../titan/flash/MovieClipHelper";
import {TextField} from "../../titan/flash/TextField";
import {GameButton} from "../../titan/flash/gui/GameButton";
import {GenericPopup} from "../../titan/flash/gui/GenericPopup";
import {IButtonListener} from "../../titan/flash/gui/IButtonListener";
import {Storage} from "../Storage";

export class OwnQuestionPopup extends GenericPopup {
    textField: TextField;
    buttons: GameButton[] = [];
    //okButton: GameButton;

    constructor(title: string, text: string) { // FIXME: don;t spawn at all! throws error about vtable. traash.
        super("popup_generic");

        //this.setTitle(title);
        const movieclip = this.getMovieClip();

        const titleField = movieclip.getTextFieldByName('title_txt')!;

        titleField.setText(title);

        this.textField = movieclip.getTextFieldByName('txt')!;

        this.textField.setText(text);

        MovieClipHelper.autoAdjustChildTexts(movieclip.instance);

        movieclip.setChildVisible("button_negative", false);
        movieclip.setChildVisible("button_no", false);
        movieclip.setChildVisible("button_yes", false);
        movieclip.setChildVisible("button_ok", false);

        this.closeButton = this.addButton("button_close", 1);

        this.closeButton.setButtonListener(new IButtonListener(this.okButtonClicked));

        const previousPopup = Storage.getPopup(this) ? Storage.getPopup(this) as OwnQuestionPopup : null;

        if (previousPopup) {
            previousPopup.fadeOut();
            Storage.removePopupByInstance(previousPopup.instance);
        }

        Storage.addPopup(this);
    }

    addCloseButton(exportName: string, text: string) {
        const self = this;
        const listener = new IButtonListener(() => {
            self.fadeOut();
            Storage.removePopupByInstance(self.instance);
        });

        const button = this.addButton(exportName, 1);
        button.setText(text);
        button.setButtonListener(listener);

        this.buttons.push(button);
    }

    addPopupButton(exportName: string, text: string, listener: IButtonListener) {
        const button = this.addButton(exportName, 1);
        button.setText(text);
        button.setButtonListener(listener);

        this.buttons.push(button);
    }

    private okButtonClicked(listener: NativePointer, button: NativePointer) {
        const popup = Storage.popups.find(e => e instanceof OwnQuestionPopup) as OwnQuestionPopup;

        popup.fadeOut();
        Storage.removePopupByInstance(popup.instance);
    }
}
// ============================================================
// FILE: src/gene/popups/ProfileByTagPopup.ts
// ============================================================
import {Libc} from "../../libs/Libc";
import {TextField} from "../../titan/flash/TextField";
import {GameButton} from "../../titan/flash/gui/GameButton";
import {GenericPopup} from "../../titan/flash/gui/GenericPopup";
import {IButtonListener} from "../../titan/flash/gui/IButtonListener";
import {GameInputField} from "../../titan/flash/input/GameInputField";
import {Storage} from "../Storage";
import {LocalizationManager} from "../../gene/localization/index";
import {GUI} from "../../titan/flash/gui/GUI";
import {HashTagCodeGenerator} from "../../titan/logic/util/HashTagCodeGenerator";
import {LogicLong} from "../../titan/logic/LogicLong";
import {PlayerInfo} from "../../logic/home/PlayerInfo";
import {AllianceManager} from "../../logic/alliance/AllianceManager";

export class ProfileByTagPopup extends GenericPopup {
    gameInputField!: GameInputField;
    button: GameButton;
    textInputButton!: GameButton;
    textField!: TextField;

    constructor() {
        super("gameroom_joincode_popup");

        this.setTitle(LocalizationManager.getString("PROFILE_TAG"));

        this.button = this.addButtonWithText("join_button", 1, LocalizationManager.getString("PROFILE"));

        this.createInputField();

        this.closeButton!.setButtonListener(new IButtonListener(this.buttonClicked));
        this.button.setButtonListener(new IButtonListener(this.buttonClicked));

        const previousPopup = Storage.getPopup(this) ? Storage.getPopup(this) as ProfileByTagPopup : null;

        if (previousPopup) {
            try {
                previousPopup.gameInputField.activate(false);
                previousPopup.fadeOut();
                Storage.removePopupByInstance(previousPopup.instance);
            } catch (e) { }
        }

        Storage.addPopup(this);
    }

    createInputField() {
        this.textInputButton = this.addButtonWithText("team_code_input", 2, "");

        const movieClip = this.textInputButton.getMovieClip();

        this.textField = movieClip.getTextFieldByName("text") as TextField;

        this.gameInputField = new GameInputField(Libc.malloc(200), this.textField, this.instance);

        this.gameInputField.setScaleTextIfNeed(true);
        this.gameInputField.setMaxTextLength(15);

        this.textInputButton.setButtonListener(new IButtonListener(this.textInputClicked));

        this.setActiveInputField(this.gameInputField);
    }

    update(float: number) {
        super.update(float);
    }

    private textInputClicked(listener: NativePointer, button: NativePointer) {
        const popup = Storage.popups.find(e => e instanceof ProfileByTagPopup) as ProfileByTagPopup;

        popup.gameInputField.activate(true);
    }

    private buttonClicked(listener: NativePointer, button: NativePointer) {
        const popup = Storage.popups.find(e => e instanceof ProfileByTagPopup) as ProfileByTagPopup;

        if (popup.button.instance.toInt32() == button.toInt32()) {
            const gameInputField = popup.gameInputField;
            const input = gameInputField.getInputText().trim().toUpperCase();

            gameInputField.activate(false);

            if (input.length < 1) {
                GUI.showFloaterText(LocalizationManager.getString("PROFILE_TAG_NO_CODE"));
                return;
            }

            if (!input.startsWith('#') || input.length < 4 || input.length > 15) {
                GUI.showFloaterText(LocalizationManager.getString("PROFILE_TAG_WRONG_CODE"));
                return;
            }

            const id = HashTagCodeGenerator.toId(input);

            if (id[1] == 0) {
                GUI.showFloaterText(LocalizationManager.getString("PROFILE_TAG_WRONG_CODE"));
                return;
            }

            const logicLong = new LogicLong(id[0], id[1]);

            const profile = PlayerInfo.createPlayerProfile(logicLong);

            AllianceManager.showPopup(profile);

            console.log("Closed!");
            popup.gameInputField.activate(false);
            popup.fadeOut();
            Storage.removePopupByInstance(popup.instance);
        }
        else if (popup.closeButton!.instance.toInt32() == button.toInt32()) {
            console.log("Closed!");
            popup.gameInputField.activate(false);
            popup.fadeOut();
            Storage.removePopupByInstance(popup.instance);
        }
    }
}
// ============================================================
// FILE: src/gene/popups/SpectateByTagPopup.ts
// ============================================================
import {Libc} from "../../libs/Libc";
import {TextField} from "../../titan/flash/TextField";
import {GameButton} from "../../titan/flash/gui/GameButton";
import {GenericPopup} from "../../titan/flash/gui/GenericPopup";
import {IButtonListener} from "../../titan/flash/gui/IButtonListener";
import {GameInputField} from "../../titan/flash/input/GameInputField";
import {Storage} from "../Storage";
import {LocalizationManager} from "../../gene/localization/index";
import {GUI} from "../../titan/flash/gui/GUI";
import {HashTagCodeGenerator} from "../../titan/logic/util/HashTagCodeGenerator";
import {StartSpectateMessage} from "../../logic/message/battle/StartSpectateMessage";
import {MessageManager} from "../../laser/client/network/MessageManager";

export class SpectateByTagPopup extends GenericPopup {
    gameInputField!: GameInputField;
    button: GameButton;
    textInputButton!: GameButton;
    textField!: TextField;

    constructor() {
        super("gameroom_joincode_popup");

        this.setTitle(LocalizationManager.getString("SPECTATE_TAG"));

        this.button = this.addButtonWithText("join_button", 1, LocalizationManager.getString("SPECTATE"));

        this.createInputField();

        this.closeButton!.setButtonListener(new IButtonListener(this.buttonClicked));
        this.button.setButtonListener(new IButtonListener(this.buttonClicked));

        const previousPopup = Storage.getPopup(this) ? Storage.getPopup(this) as SpectateByTagPopup : null;

        if (previousPopup) {
            try {
                previousPopup.gameInputField.activate(false);
                previousPopup.fadeOut();
                Storage.removePopupByInstance(previousPopup.instance);
            } catch (e) { }
        }

        Storage.addPopup(this);
    }

    createInputField() {
        this.textInputButton = this.addButtonWithText("team_code_input", 2, "");

        const movieClip = this.textInputButton.getMovieClip();

        this.textField = movieClip.getTextFieldByName("text") as TextField;

        this.gameInputField = new GameInputField(Libc.malloc(200), this.textField, this.instance);

        this.gameInputField.setScaleTextIfNeed(true);
        this.gameInputField.setMaxTextLength(15);

        this.textInputButton.setButtonListener(new IButtonListener(this.textInputClicked));

        this.setActiveInputField(this.gameInputField);
    }

    update(float: number) {
        super.update(float);
    }

    private textInputClicked(listener: NativePointer, button: NativePointer) {
        const popup = Storage.popups.find(e => e instanceof SpectateByTagPopup) as SpectateByTagPopup;

        popup.gameInputField.activate(true);
    }

    private buttonClicked(listener: NativePointer, button: NativePointer) {
        const popup = Storage.popups.find(e => e instanceof SpectateByTagPopup) as SpectateByTagPopup;

        if (popup.button.instance.toInt32() == button.toInt32()) {
            const gameInputField = popup.gameInputField;
            const input = gameInputField.getInputText().trim().toUpperCase();

            gameInputField.activate(false);

            if (input.length < 1) {
                GUI.showFloaterText(LocalizationManager.getString("SPECTATE_TAG_NO_CODE"));
                return;
            }

            if (!input.startsWith('#') || input.length < 4 || input.length > 15) {
                GUI.showFloaterText(LocalizationManager.getString("SPECTATE_TAG_WRONG_CODE"));
                return;
            }

            const id = HashTagCodeGenerator.toId(input);

            if (id[1] == 0) {
                GUI.showFloaterText(LocalizationManager.getString("SPECTATE_TAG_WRONG_CODE"));
                return;
            }

            const logicLong = Libc.malloc(8);
            logicLong.writeInt(id[0]);
            logicLong.add(4).writeInt(id[1]);

            MessageManager.sendMessage(new StartSpectateMessage(logicLong, false));
        }
        else if (popup.closeButton!.instance.toInt32() == button.toInt32()) {
            console.log("Closed!");
            popup.gameInputField.activate(false);
            popup.fadeOut();
            Storage.removePopupByInstance(popup.instance);
        }
    }
}
// ============================================================
// FILE: src/gene/popups/SpeechCharacter.ts
// ============================================================
import {GameMain} from "../../laser/client/GameMain";
import {ResourceManager} from "../../titan/ResourceManager";
import {MovieClip} from "../../titan/flash/MovieClip";
import {MovieClipHelper} from "../../titan/flash/MovieClipHelper";
import {Stage} from "../../titan/flash/Stage";
import {Resources} from "../Resources";

export class SpeechCharacter extends MovieClip {
    private bubble: MovieClip;
    private timeout: ReturnType<typeof setTimeout> = setTimeout(() => { }, 0);

    constructor(text: string) {
        const speechMc = ResourceManager.getMovieClip(Resources.UI, "tutorial_character_top");
        super(speechMc.instance);

        const bubble = ResourceManager.getMovieClip(Resources.UI, "tutorial_text_top");

        const movieClip = this;

        const appearStart = movieClip.getFrameIndex("AppearStart");
        const appearEnd = movieClip.getFrameIndex("AppearEnd");
        movieClip.gotoAndPlayFrameIndex(appearStart, appearEnd);

        const bubbleAppearStart = bubble.getFrameIndex("AppearStart");
        const bubbleAppearEnd = bubble.getFrameIndex("AppearEnd");
        bubble.gotoAndPlayFrameIndex(bubbleAppearStart, bubbleAppearEnd);

        const bubbleMc = bubble.getChildByName("bubble");
        const textField = bubbleMc.getTextFieldByName("text")!;

        MovieClipHelper.setTextAndScaleIfNecessary(textField, text);

        const textHeight = textField.getTextHeight();
        const textFieldY = textField.y;

        textField.y = ((textHeight * -0.5) + 40) + textFieldY;
        const child = movieClip.getChildByName("bubble");
        child.addChild(bubble);

        this.bubble = bubble;

        // просчёт координат (надо от правого края )

        const x = Stage.getX() * 2 - this.getWidth() / 2;
        const y = this.getHeight() / 2;

        this.setXY(x, y);
    }

    hideAfter(seconds: number) {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        this.timeout = setTimeout(this.goAway.bind(this), seconds * 1000);
    }

    goAway() {
        const disappearStart = this.getFrameIndex("DisappearStart");
        const disappearEnd = this.getFrameIndex("DisappearEnd");
        this.gotoAndPlayFrameIndex(disappearStart, disappearEnd);

        const bubbleDisappearStart = this.bubble.getFrameIndex("DisappearStart");
        const bubbleDisappearEnd = this.bubble.getFrameIndex("DisappearEnd");
        this.bubble.gotoAndPlayFrameIndex(bubbleDisappearStart, bubbleDisappearEnd);

        while (true) {
            if (bubbleDisappearEnd === this.bubble.getCurrentFrame()) {
                GameMain.getHomeSprite().removeChild(this);
                break;
            }
        }
    }

    setText(text: string) {
        const bubbleMc = this.bubble.getChildByName("bubble");
        const textField = bubbleMc.getTextFieldByName("text")!;

        MovieClipHelper.setTextAndScaleIfNecessary(textField, text);
    }
}
// ============================================================
// FILE: src/gene/popups/UserImagesScreen.ts
// ============================================================
import {Libc} from "../../libs/Libc";
import {Libg} from "../../libs/Libg";
import {HomeScreen} from "../../logic/home/HomeScreen";
import {ResourceManager} from "../../titan/ResourceManager";
import {MovieClip} from "../../titan/flash/MovieClip";
import {MovieClipHelper} from "../../titan/flash/MovieClipHelper";
import {Rect} from "../../titan/flash/Rect";
import {ScrollArea} from "../../titan/flash/ScrollArea";
import {Stage} from "../../titan/flash/Stage";
import {TextField} from "../../titan/flash/TextField";
import {GUI} from "../../titan/flash/gui/GUI";
import {GameButton} from "../../titan/flash/gui/GameButton";
import {IButtonListener} from "../../titan/flash/gui/IButtonListener";
import {PopupBase} from "../../titan/flash/gui/PopupBase";
import {Configuration} from "../Configuration";
import {Debug} from "../Debug";
import {Resources} from "../Resources";
import {UserImagesManager} from "../features/UserImagesManager";
import {LocalizationManager} from "../localization";
import {DownloadImagePopup} from "./DownloadImagePopup";
import {OwnQuestionPopup} from "./OwnQuestionPopup";
import {ImageButton} from "./buttons/ImageButton";

export class UserImagesScreen extends PopupBase {
    private readonly textField: TextField;
    private loadImageButton!: GameButton;
    private scrollArea!: ScrollArea;
    private rect!: Rect;
    private buttons: GameButton[] = [];

    constructor() {
        super(Libc.malloc(456), 'sc/ui.sc', "language_popup"); // If crashes, find new malloc size. If still crashes, fuck supercell.

        this.instance.writePointer(Libg.offset(0x0, 0x0));
        this.instance.add(96).writePointer(Libg.offset(0x0, 0x0));
        this.instance.add(448).writeInt(0);

        this.setUpScreenHeader();

        this.scrollArea = new ScrollArea(0, 0, 1);
        this.instance.add(416).writePointer(this.scrollArea.instance);

        //this.scrollArea = new ScrollArea(0, 0, 1);
        //this.instance.add(416).writePointer(this.scrollArea.instance);

        this.movieClip = new MovieClip(
            this.instance.add(208).readPointer()
        );

        if (this.movieClip.instance.isNull()) {
            this.movieClip = new MovieClip(
                this.instance.add(112).readPointer()
            );
        }

        this.textField = this.movieClip.getTextFieldByName("title_txt")!;

        this.instance.add(432).writePointer(this.textField.instance);
        this.instance.add(440).writeFloat(this.textField.y);
        this.textField.setText(
            LocalizationManager.getString("USER_IMAGE_SCREEN_TITLE")
        );

        MovieClipHelper.autoAdjustText(this.textField);

        this.createScrollArea();
        this.populateScrollArea();
    }

    setActiveScrollArea(scrollArea: ScrollArea) {
        this.instance.add(416).writePointer(scrollArea.instance);
    }

    createScrollArea() {
        const rect = new Rect();
        const childMovieClip = new MovieClip(this.instance.add(112).readPointer());

        this.rect = rect;

        const area = childMovieClip.getTextFieldByName("area")!;
        GUI.resizeToScreenHeight(area);

        area.getBounds(childMovieClip, rect);

        const x = Stage.getX() * 2;
        const areaWidth = area.getWidth();

        const v10 = (x - areaWidth) * 0.5;
        const v11 = rect.instance.readFloat() - v10;
        const v12 = v10 + rect.instance.add(8).readFloat();

        rect.instance.writeFloat(v11);
        rect.instance.add(8).writeFloat(v12);

        const scrollArea = new ScrollArea(rect.getWidth(), rect.getHeight(), 1); // todo: if not working swap 1 and 3 args

        this.scrollArea = scrollArea;
        this.instance.add(416).writePointer(scrollArea.instance);
        this.scrollArea.instance.add(664).writeU8(1);

        scrollArea.setPixelSnappedXY(v11, 0.0);
        scrollArea.enablePinching(false);
        scrollArea.enableHorizontalDrag(false);
        scrollArea.enableVerticalDrag(true);
        scrollArea.setAlignment(4);
        scrollArea.setUnk(true);
        this.addContent(scrollArea);
    }

    populateScrollArea() {
        const buttonClip = ResourceManager.getMovieClip(Resources.UI, "language_item");

        const loadButton = new GameButton();
        loadButton.setMovieClip(buttonClip);
        loadButton.setText(
            LocalizationManager.getString("USER_IMAGE_BUTTON_LOAD_IMAGE")
        );
        loadButton.setXY(this.rect.getWidth() / 2, loadButton.getHeight());

        buttonClip.gotoAndStopFrameIndex(1);

        loadButton.setButtonListener(new IButtonListener(this.onLoadButtonClicked));

        this.scrollArea.addContentDontUpdateBounds(loadButton);

        this.loadImageButton = loadButton;

        let naviHeight = this.getNaviHeight();

        let buttonIndex = 0;
        const spacingX = 20;
        const spacingY = 0;

        const images = UserImagesManager.getImages();

        for (const image of images) {
            const button = new ImageButton(image);

            if (!image) continue;

            button.setButtonListener(new IButtonListener(this.buttonClicked));

            this.buttons.push(button);

            const buttonWidth = button.getWidth();
            const buttonHeight = button.getHeight();

            const rectWidth = this.rect.getWidth();

            const buttonMiddleHeight = buttonHeight / 2 + loadButton.getHeight();
            let buttonIndexTemp = buttonIndex;

            const x = (rectWidth / 2) + (buttonIndexTemp - 1) * (buttonWidth + spacingX);
            const y = naviHeight + buttonMiddleHeight + (spacingY * buttonHeight);

            button.setXY(x, y);

            if (buttonIndexTemp === 2) {
                naviHeight += buttonHeight;
            }

            buttonIndex = buttonIndexTemp - 2;

            if (buttonIndexTemp !== 2) {
                buttonIndex = buttonIndexTemp + 1;
            }

            this.scrollArea.addContentDontUpdateBounds(button);
        }

        this.scrollArea.updateBounds();
    }

    repopulateScrollArea() {
        this.scrollArea.removeAllContent();
        this.buttons = [];
        this.populateScrollArea();
    }

    onLoadButtonClicked(listener: NativePointer, button: NativePointer) {
        const downloadImagePopup = new DownloadImagePopup();

        GUI.showPopup(downloadImagePopup.instance, 1, 0, 1);
    }

    buttonClicked(listener: NativePointer, button: NativePointer) {
        const imageButton = new ImageButton(button);

        const o = new OwnQuestionPopup(
            LocalizationManager.getString("USER_IMAGE_SELECTED_TITLE"),
            LocalizationManager.getString("USER_IMAGE_SELECTED_BODY")
        );

        o.addPopupButton(
            "button_yes",
            LocalizationManager.getString("USER_IMAGE_SELECTED_BUTTON_SET_TO_THEME"),
            new IButtonListener((listener: NativePointer, button: NativePointer) => {
                const fileName = imageButton.getFileName();

                const image = UserImagesManager.getDownloadedImage(fileName);

                if (image) {
                    HomeScreen.replaceThemeByImage(image);

                    Configuration.currentUserThemeSet = fileName;
                    Configuration.save();

                    GUI.showFloaterText(
                        LocalizationManager.getString("USER_IMAGE_SET_TO_THEME_SUCCESS")
                    );
                }

                o.fadeOut();
            })
        );

        o.addPopupButton(
            "button_no",
            LocalizationManager.getString("USER_IMAGE_SELECTED_BUTTON_DELETE"),
            new IButtonListener((listener: NativePointer, gameButton: NativePointer) => {
                const fileName = imageButton.getFileName();

                const result = UserImagesManager.removeImage(fileName);

                if (result === 0) {
                    if (Configuration.currentUserThemeSet === fileName) {
                        Configuration.currentUserThemeSet = "";
                        Configuration.save();
                    }

                    if (Debug.getUserImagesScreen()) {
                        Debug.getUserImagesScreen().repopulateScrollArea();
                    }

                    GUI.showFloaterText(
                        LocalizationManager.getString("USER_IMAGE_DELETE_SUCCESS")
                    );
                } else {
                    GUI.showFloaterText(
                        LocalizationManager.getString("USER_IMAGE_DELETE_ERROR")
                    );
                }


                o.fadeOut();
            })
        );

        GUI.showPopup(o.instance, 1, 0, 1);
    }

    setXy() {
        const x = Stage.getX();
        this.setPixelSnappedXY(x, 0.0);
    }

    update(deltaTime: number) {
        super.update(deltaTime);
        //this.scrollArea.update(deltaTime)
    }
}
// ============================================================
// FILE: src/gene/popups/buttons/BlackListedPlayerButton.ts
// ============================================================
import {ResourceManager} from "../../../titan/ResourceManager";
import {GameButton} from "../../../titan/flash/gui/GameButton";
import {Resources} from "../../Resources";

export class BlackListedPlayerButton extends GameButton {
    text: string = "";
    constructor(text: string) {
        super();

        this.text = text;

        this.setMovieClip(ResourceManager.getMovieClip(Resources.UI, "language_item"));
        this.setText(text);
        this.getMovieClip().gotoAndStopFrameIndex(1);
    }

    setSelected(state: boolean) {
        this.getMovieClip().gotoAndStopFrameIndex(Number(!state));
    }
}
// ============================================================
// FILE: src/gene/popups/buttons/ImageButton.ts
// ============================================================
import {GameButton} from "../../../titan/flash/gui/GameButton";
import {UserImagesManager} from "../../features/UserImagesManager";

export class ImageButton extends GameButton {
    constructor(fileName: string | NativePointer) {
        if (fileName instanceof NativePointer) {
            super(fileName);
            return;
        }

        super();

        const image = UserImagesManager.getDownloadedImage(fileName);

        if (!image) return;

        image.setScale(1);

        image.setWidth(128);
        image.setHeight(128);

        this.instance.add(516).scptr(fileName);

        this.setMovieClip(image.instance);
    }

    getFileName() {
        return this.instance.add(516).fromsc();
    }
}
// ============================================================
// FILE: src/index.ts
// ============================================================
import {Libc} from "./libs/Libc";
import {LogicDefines} from "./LogicDefines";
import {ServerConnection} from "./laser/client/network/ServerConnection";
import {MessageManager} from "./laser/client/network/MessageManager";
import {LogicVersion} from "./logic/LogicVersion";
import {AllianceManager} from "./logic/alliance/AllianceManager";
import {PackageInfo} from "./utils/PackageInfo";
import {Debug} from "./gene/Debug";
import {GameMain} from "./laser/client/GameMain";
import {HomePage} from "./logic/home/HomePage";
import {FramerateManager} from "./titan/client/FramerateManager";
import {ChatCommandHandler} from "./gene/features/ChatCommandHandler";
import {BattleScreen} from "./logic/battle/BattleScreen";
import {LogicClientAvatar} from "./logic/avatar/LogicClientAvatar";
import {LogicClientHome} from "./logic/home/LogicClientHome";
import {StringTable} from "./logic/data/StringTable";
import {LogicData} from "./logic/data/LogicData";
import {LocalizationManager} from "./gene/localization/index";
import {LogicLaserMessageFactory} from "./logic/message/LogicLaserMessageFactory";
import {ClientInputManager} from "./logic/battle/ClientInputManager";
import {UsefulInfo} from "./gene/features/UsefulInfo";
import {HashTagCodeGenerator} from "./titan/logic/util/HashTagCodeGenerator";
import {HomeMode} from "./logic/home/HomeMode";
import {LatencyManager} from "./laser/client/network/LatencyManager";
import {Configuration} from "./gene/Configuration";
import {SCString} from "./titan/utils/SCString";
import {NativeFont} from "./titan/client/common/NativeFont";
import {MapEditorModifierPopup} from "./laser/client/popups/MapEditorModifierPopup";
import {AllianceHeaderEntry} from "./logic/alliance/AllianceHeaderEntry";
import {AllianceMemberEntry} from "./logic/alliance/AllianceMemberEntry";
import {PlayerProfile} from "./logic/home/PlayerProfile";
import {BattleLogPlayerEntry} from "./logic/battle/BattleLogPlayerEntry";
import {FriendEntry} from "./logic/home/FriendEntry";
import {LogicPlayer} from "./logic/battle/LogicPlayer";
import {TeamMemberEntry} from "./logic/home/team/TeamMemberEntry";
import {BattleEndPopup} from "./logic/battle/BattleEndPopup";
import {SkinChanger} from "./gene/features/SkinChanger";
import {TeamEntry} from "./logic/home/team/TeamEntry";
import {LogicDataTables} from "./logic/data/LogicDataTables";
import {Application} from "./titan/utils/Application";
import {PlayerInfo} from "./logic/home/PlayerInfo";
import {AllianceInfo} from "./logic/alliance/AllianceInfo";
import {HomeScreen} from "./logic/home/HomeScreen";
import {Libg} from "./libs/Libg";
import {LogicCharacterData} from "./logic/data/LogicCharacterData";
import {CombatHUD} from "./logic/battle/CombatHUD";
import {Character} from "./logic/battle/objects/Character";
import {TeamManager} from "./logic/home/team/TeamManager";
import {ContextMenu} from "./titan/flash/gui/ContextMenu";
import {GeneAssets} from "./gene/GeneAssets";
import {GUI} from "./titan/flash/gui/GUI";
import {DataIcon} from "./titan/flash/DataIcon";
import {PromonBreaker} from "./gene/PromonBreaker";
import {GradientNickname} from "./gene/features/GradientNickname";
import {LogicBattleModeClient} from "./logic/battle/LogicBattleModeClient";
import {Spoofer} from "./utils/Spoofer";

// global stuff
declare global {
    interface String {
        scptr: () => NativePointer;
        ptr: () => NativePointer;
        removeColorCodes: () => string;
        format: (...args: any[]) => string;
    }
    interface NativePointer {
        fromsc: () => string;
        accountId: () => number[];
        scptr: (str: string) => void;
    }
}

String.prototype.format = function (...args: any[]): string {
    let formattedText = this;

    args.forEach((arg, index) => {
        formattedText = formattedText.replace(`{${index}}`, arg);
    });

    return formattedText as string;
};

String.prototype.scptr = function (): NativePointer {
    let ptr = Libc.malloc(16);
    SCString.ctor(ptr, this.ptr());
    return ptr;
};

String.prototype.ptr = function (): NativePointer {
    return Memory.allocUtf8String(this as string);
};

String.prototype.removeColorCodes = function (): string {
    return this.replace(/<c[^>]+>|<\/c>/g, '');
};

NativePointer.prototype.fromsc = function (): string {
    let stringPtr = this.add(4).readInt() >= 8 ? this.add(8).readPointer() : this.add(8);

    return stringPtr.readUtf8String()!;
};

NativePointer.prototype.scptr = function (str: string) {
    SCString.ctor(this, str.ptr());
};

NativePointer.prototype.accountId = function (): number[] {
    return [
        this.readInt(),
        this.add(4).readInt()
    ];
};

// script start
function printInfo() {
    console.log("Gene Brawl", LogicVersion.toString());
    console.log("Frida:", Frida.version);
    console.log("Platform:", LogicDefines.toString());
    console.log("Device: " + Application.getDeviceType());
    console.log("System version: " + Application.getSystemVersion());
    if (LogicDefines.isPlatformIOS())
        console.log("iOS version: " + LogicVersion.iosVersion);
}

function setupNetwork() {
    ServerConnection.setupMessaging();
    MessageManager.patch();
    LogicLaserMessageFactory.patch();
    LatencyManager.patch();
}

function setupCustomAssets() {
    if (!Debug.isGeneAssetsPreloaded) {
        try {
            GeneAssets.init();
        } catch (e) {

        }
        Debug.isGeneAssetsPreloaded = true;
    }
}

function setupAvatarHooks() {
    LogicClientAvatar.patch();
}

function setupHomeHooks() {
    LogicClientHome.patch();
    HomeMode.patch();

    if (Configuration.skinChanger)
        SkinChanger.patch();

    PlayerProfile.patch();
    FriendEntry.patch();
    PlayerInfo.patch();
    HomePage.patch();
    HomeScreen.patch();
}

function setupAllianceHooks() {
    ChatCommandHandler.patch();
    AllianceManager.patch();
    AllianceInfo.patch();
    AllianceHeaderEntry.patch();
    AllianceMemberEntry.patch();
}

function setupGame() {
    FramerateManager.patch();
    LogicVersion.patch();
    GameMain.patch();

    StringTable.patch();
    LocalizationManager.loadLocalization("EN");

    LogicData.patch();
    LogicDataTables.patch();
    GradientNickname.patchGradients();

    HashTagCodeGenerator.patch();

    NativeFont.patch();
    GUI.patch();
}

function setupBattleHooks() {
    ClientInputManager.patch();
    BattleScreen.patch();
    CombatHUD.patch();

    MapEditorModifierPopup.patch();
    DataIcon.patch()

    BattleEndPopup.patch();
    BattleLogPlayerEntry.patch();
    LogicPlayer.patch();
    Character.patch()

    LogicCharacterData.patch();
    LogicBattleModeClient.patch();
}

function setupTeamHooks() {
    TeamMemberEntry.patch();
    TeamEntry.patch();
    TeamManager.patch();
    ContextMenu.patch();
}

function testStuff() {
    /// #if DEBUG
    // there's nothing for u :D
    /// #endif
}

function initErrorHandler() {
    /// #if DEBUG
    const prepareStack = Error.prepareStackTrace;

    Error.prepareStackTrace = (err, trace) => {
        if (prepareStack) {
            const stack = prepareStack(err, trace);
            console.error(stack);
            return stack;
        } else {
            const fallback = err.stack!;
            console.error(fallback);
            return fallback;
        }
    };

    Process.setExceptionHandler((trace) => {
        console.error(trace.address.sub(Libg.begin));
        console.error(new Error(JSON.stringify(trace)));
    })
    /// #endif
}

rpc.exports.init = function (stage, parameters) {
    try {
        /// #if DEBUG
        initErrorHandler();
        /// #endif

        if (LogicDefines.isPlatformIOS()) {
            LogicVersion.iosVersion = PackageInfo.getValue("GENE_BRAWL_IOS_VERSION") ?? 0;

            PromonBreaker.patch();
            Spoofer.patch();
        }

        printInfo();

        Configuration.load();

        setupGame();
        setupCustomAssets();
        setupNetwork();
        setupAllianceHooks();
        setupAvatarHooks();
        setupHomeHooks();
        setupBattleHooks();
        setupTeamHooks();

        UsefulInfo.sessionStartedTime = Date.now();

        if (LogicVersion.isDeveloperBuild())
            testStuff();

    } catch (e: any) {
        console.log(e.stack);
    }
};
// ============================================================
// FILE: src/laser/client/GameMain.ts
// ============================================================
import {Configuration} from "../../gene/Configuration";
import {Debug} from "../../gene/Debug";
import {Storage} from "../../gene/Storage";
import {Libg} from "../../libs/Libg";
import {LogicDefines} from "../../LogicDefines";
import {Sprite} from "../../titan/flash/Sprite";
import {HashTagCodeGenerator} from "../../titan/logic/util/HashTagCodeGenerator";
import {GeneAssets} from "../../gene/GeneAssets";


// Fields
const shouldReloadGameOffset = LogicDefines.isPlatformAndroid() ? 409 : 441; // "Server didn't reply to to the LoginMessage" xref -> GameMain::update
const lobbySpriteOffset = 288;
const spriteOffset = LogicDefines.isPlatformAndroid() ? 296 : 304; // "https://service.supercell.net/t?app=laser" in GameMain::init
const accountIdOffset = LogicDefines.isPlatformAndroid() ? 600 : 584;
const gameStateOffset = LogicDefines.isPlatformAndroid() ? 424 : 408;
const homeSpriteOffset = LogicDefines.isPlatformAndroid() ? 296 : 288;

// Function offsets
const GameMain_instance = Libg.offset(0x103AB80, 0xEE5B20); // MMWarned_  in GameMain::getInstance

const GameMain_setAccountTier = new NativeFunction( // "LoginFailed due to data version but not in InitState!"
    Libg.offset(0x3F3794, 0xB78C), 'void', ['pointer', 'int']
);

const GameMain_showNativeDialog = Libg.offset(0x0, 0x9418); // "TID_ERROR_POP_UP_SERVER_MAINTENANCE_ESTIMATED_MINUTES"

const GameMain_reloadGameInternal = new NativeFunction(
    Libg.offset(0x3F0A64, 0x8DEC), 'void', ['pointer']
);

// Native functions
const GameMain_setSlowMode = new NativeFunction( // higher than "after_trophies" first sub_xxx(0LL);
    Libg.offset(0x3F393C, 0xB914), 'void', ['bool']
);

const GameMain_loadAsset = new NativeFunction( // "sfx/supercell_jingle.ogg", func below with int 0 in 2nd arg
    Libg.offset(0x3F2D3C, 0xAFC8), 'void', ['pointer', 'bool']
);

const GameMain_draw = new NativeFunction( // vtable index 5 (5 * POINTER_SIZE) [then why tf we don't just get it from vtable???]
    Libg.offset(0x3F1E98, 0xA258), 'void', ['pointer', 'float']
);

export class GameMain {
    static alreadyLoaded: string[] = [];

    static get instance(): NativePointer {
        return GameMain_instance.readPointer();
    }

    static patch(): void {
        if (LogicDefines.isPlatformIOS()) {
            Interceptor.replace(GameMain_reloadGameInternal, new NativeCallback(function (gameMain) {
                if (!GameMain.isShouldReloadGame()) {
                    return;
                }

                GameMain_reloadGameInternal(gameMain);
            }, 'void', ['pointer']));
        }

        Interceptor.replace(GameMain_draw, new NativeCallback(function (gameMain, deltaTime) {
            GameMain_draw(gameMain, deltaTime);
            try {
                Storage.popups.forEach(e => e.update(deltaTime));
                Debug.update(deltaTime); // FIXME

                if (GameMain.isShouldReloadGame()) {
                    console.log("GameMain::draw:", "should reload game!");

                    Debug.destruct();
                }
            } catch (e: any) {
                console.error("GameMain::draw issue!");
                console.log(JSON.stringify(e));
                console.log(e.stack);
            }
        }, 'void', ['pointer', 'float']));

        Interceptor.replace(GameMain_setAccountTier, new NativeCallback(function (gameMain, accountTier) { // Helpshift patch
            accountTier = 3;

            GameMain_setAccountTier(gameMain, accountTier);
        }, 'void', ['pointer', 'int']));

        Interceptor.attach(GameMain_showNativeDialog, { // In case Stage Server is unavailable.
            onEnter(args) {
                if (args[1].toInt32() == 3 || args[1].toInt32() == 8) {
                    if (Configuration.useStage)
                        Configuration.useStage = false;
                }
            }
        });
    }

    static isShouldReloadGame(): boolean {
        return Boolean(
            this.instance.add(shouldReloadGameOffset).readU8()
        );
    }

    static shouldShowLoadingScreen(): boolean {
        return this.instance.add(gameStateOffset).readInt() == 10;
    }

    static reloadGame() {
        this.instance.add(shouldReloadGameOffset).writeU8(1);
    }

    static getAccountTag(): string | null {
        return HashTagCodeGenerator.toCode(
            this.instance.add(accountIdOffset).readPointer()
        );
    }

    static getAccountId(): number[] {
        return this.getAccountIdPtr().accountId();
    }

    static getAccountIdPtr(): NativePointer {
        return this.instance.add(accountIdOffset).readPointer();
    }

    static getGameSprite(): Sprite {
        return new Sprite(
            this.instance.add(spriteOffset).readPointer()
        );
    }

    static getLobbySprite(): Sprite {
        return new Sprite(
            this.instance.add(lobbySpriteOffset).readPointer()
        );
    }

    static getHomeSprite(): Sprite {
        return new Sprite(
            this.instance.add(homeSpriteOffset).readPointer()
        );
    }

    static setSlowMode(slowMode: boolean): void {
        GameMain_setSlowMode(Number(slowMode));
    }

    static loadAsset(filePath: string) {
        if (this.alreadyLoaded.includes(filePath)) return;

        GameMain_loadAsset(filePath.scptr(), 0);

        GameMain.alreadyLoaded.push(filePath);
        GeneAssets.loaded.push(filePath);

        console.log("GameMain::loadAsset: loaded " + filePath);
    }
}
// ============================================================
// FILE: src/laser/client/GameSettings.ts
// ============================================================
import {Libg} from "../../libs/Libg";

// Static instances
const GameSettings_instance = Libg.offset(0x0, 0xEE6708);

// Fields
const isSfxEnabledOffset = 8;
const isMusicEnabledOffset = 12;
const isHapticsEnabledOffset = 16;

// Native functions
// InitFunc "HapticsDisabled"

const GameSettings_enableSfx = new NativeFunction( // TODO
    Libg.offset(-1, 0x35B8F0), 'void', ['pointer', 'int']
);

const GameSettings_enableMusic = new NativeFunction(
    Libg.offset(-1, 0x35B7E8), 'void', ['pointer', 'int']
);

const GameSettings_enableHaptics = new NativeFunction(
    Libg.offset(0x7F34B8, 0x35B96C), 'void', ['pointer', 'int'] // "haptics_toggle"
);

export class GameSettings {
    static get instance(): NativePointer {
        return GameSettings_instance.readPointer();
    }

    static get sfxEnabled(): boolean {
        return Boolean(
            this.instance.add(isSfxEnabledOffset).readU8()
        );
    }

    static get musicEnabled(): boolean {
        return Boolean(
            this.instance.add(isMusicEnabledOffset).readU8()
        );
    }

    static get hapticsEnabled(): boolean {
        return Boolean(
            this.instance.add(isHapticsEnabledOffset).readU8()
        );
    }

    static set sfxEnabled(enabled: boolean) {
        GameSettings_enableSfx(this.instance, enabled ? 100 : 0);
    }

    static set musicEnabled(enabled: boolean) {
        GameSettings_enableMusic(this.instance, enabled ? 100 : 0);
    }

    static set hapticsEnabled(enabled: boolean) {
        GameSettings_enableHaptics(this.instance, Number(enabled));
    }
}
// ============================================================
// FILE: src/laser/client/Settings.ts
// ============================================================
import {Libg} from "../../libs/Libg";

// Static instances
const Settings_instance = Libg.offset(0x103B738, 0xEE5C38);

// Native functions
const Settings_setSelectedLanguage = new NativeFunction( // "Lng" -> 
    Libg.offset(0x9AB89C, 0x12430), 'void', ['pointer', 'pointer']
);

export class Settings {
    static get instance(): NativePointer {
        return Settings_instance.readPointer();
    }

    static setSelectedLanguage(language: string) {
        Settings_setSelectedLanguage(this.instance, language.scptr());
    }
}

// ============================================================
// FILE: src/laser/client/network/LatencyManager.ts
// ============================================================
import {Configuration} from "../../../gene/Configuration";
import {DebugMenu} from "../../../gene/debug/DebugMenu";
import {EDebugCategory} from "../../../gene/debug/DebugMenuCategory";
import {LocalizationManager} from "../../../gene/localization/index";
import {LatencyData} from "../../../logic/latency/LatencyData";
import {LatencyTestConfiguration} from "../../../logic/latency/LatencyTestConfiguration";
import {LatencyTestResultMessage} from "../../../logic/message/latency/LatencyTestResultMessage";
import {TriggerStartLatencyTestMessage} from "../../../logic/message/latency/TriggerStartLatencyTestMessage";
import {GUI} from "../../../titan/flash/gui/GUI";
import {MessageManager} from "./MessageManager";

const maxServersCount = 19;

export class LatencyManager {
    static selectedRegionId: number = -1;
    static goingToSelectRegionId: number = -1;
    static triggeringTests: boolean = false;

    static patch() {
        LatencyTestResultMessage.patch();
        LatencyTestConfiguration.patch();
    }

    static changeRegion(regionId: number) {
        this.selectedRegionId = -1;
        this.goingToSelectRegionId = regionId;

        this.triggerLatencyTest(regionId);
    }

    static latencyTestsDone(): boolean {
        return MessageManager.getLatencyTestsCount() >= maxServersCount;
    }

    static shouldSpoofResult(): boolean {
        return this.selectedRegionId != -1 ||
            this.goingToSelectRegionId != -1 || this.triggeringTests;
    }

    static getBestLatencyDataString(): string {
        let data = this.getBestLatencyData();
        if (data) {
            return `${data.getPing()} ms - ${data.getServerName()}`;
        }

        return "...";
    }

    static addServersToDebugMenu(debugMenu: DebugMenu) {
        let datas = MessageManager.getLatencyTests();
        for (let i = 0; i < datas.length; i++) {
            let data = datas[i];

            debugMenu.createDebugMenuButton(`#${data.getRegionId()} - ${data.getServerName()} - ${data.getPing()}ms`, -1, -1, 0, EDebugCategory.LATENCY);
        }

        debugMenu.needToUpdateLayout();
    }

    static getBestLatencyData(): LatencyData {
        return MessageManager.getLatencyTests()[0];
    }

    static getSelectedRegion(): number {
        return LatencyManager.selectedRegionId == -1 ? LatencyManager.goingToSelectRegionId : LatencyManager.selectedRegionId;
    }

    static triggerLatencyTest(regionId: number) {
        if (this.selectedRegionId == -1) {
            for (let i = 0; i < 30; i++) {
                MessageManager.sendMessage(new TriggerStartLatencyTestMessage(i));
            }
        }

        else {
            MessageManager.sendMessage(new TriggerStartLatencyTestMessage(regionId));
        }

        this.triggeringTests = true;

        GUI.showFloaterText(LocalizationManager.getString("LATENCY_TESTS_TRIGGERED"));
    }

    static regionChanged() {
        GUI.showFloaterText(LocalizationManager.getString("BATTLE_SERVER_CHANGED"));

        Configuration.regionId = this.selectedRegionId;
        Configuration.save();
    }

    static disableSpoof() {
        this.triggeringTests = false;
        this.goingToSelectRegionId = -1;
        this.selectedRegionId = -1;

        Configuration.regionId = -1;
        Configuration.save();
    }

    static update() {
        if (this.triggeringTests) {
            if (!this.latencyTestsDone())
                return;

            let data = this.getBestLatencyData();
            if (!data) return;

            if (data.getRegionId() == this.goingToSelectRegionId) {
                this.triggeringTests = false;

                this.goingToSelectRegionId = -1;
                this.selectedRegionId = data.getRegionId();

                this.regionChanged();

                console.log(data.getRegionId());
                console.log(data.getServerName());
            }
        }
    }
}
// ============================================================
// FILE: src/laser/client/network/MessageManager.ts
// ============================================================
import {Debug} from "../../../gene/Debug";
import {Libg} from "../../../libs/Libg";
import {PiranhaMessage} from "../../../logic/message/PiranhaMessage";
import {LoginFailedMessage} from "../../../logic/message/account/LoginFailedMessage";
import {LogicLaserMessageFactory} from "../../../logic/message/LogicLaserMessageFactory";
import {Configuration} from "../../../gene/Configuration";
import {OwnHomeDataMessage} from "../../../logic/message/home/OwnHomeDataMessage";
import {LoginOkMessage} from "../../../logic/message/account/LoginOkMessage";
import {StringTable} from "../../../logic/data/StringTable";
import {LocalizationManager} from "../../../gene/localization/index";
import {BattleEndMessage} from "../../../logic/message/battle/BattleEndMessage";
import {PlayAgainMessage} from "../../../logic/message/battle/PlayAgainMessage";
import {HomeMode} from "../../../logic/home/HomeMode";
import {GameStateManager} from "../state/GameStateManager";
import {LatencyData} from "../../../logic/latency/LatencyData";
import {LatencyManager} from "./LatencyManager";
import {UdpConnectionInfoMessage} from "../../../logic/message/udp/UdpConnectionInfoMessage";
import {HashTagCodeGenerator} from "../../../titan/logic/util/HashTagCodeGenerator";
import {LogicVersion} from "../../../logic/LogicVersion";
import {StartLoadingMessage} from "../../../logic/message/battle/StartLoadingMessage";
import {UsefulInfo} from "../../../gene/features/UsefulInfo";
import {SkinChanger} from "../../../gene/features/SkinChanger";
import {Libc} from "../../../libs/Libc";
import {BattleMode} from "../../../logic/battle/BattleMode";
import {GameMain} from "../GameMain";
import {GUI} from "../../../titan/flash/gui/GUI";
import {PlayerProfileMessage} from "../../../logic/message/home/PlayerProfileMessage";
import {GetPlayerProfileMessage} from "../../../logic/message/home/GetPlayerProfileMessage";
import {BattleProfile} from "../../../utils/BattleProfile";
import {LogicDataTables} from "../../../logic/data/LogicDataTables";
import {ClaimVouncherFailedMessageReceived} from "../../../logic/message/home/ClaimVouncherFailedMessageReceived";
import {EDebugCategory} from "../../../gene/debug/DebugMenuCategory";
import {TeamStreamMessage} from "../../../logic/message/team/TeamStreamMessage";

const updateUrl = "https://t.me/gene_land";

const MessageManager_instance = Libg.offset(0x103DE60, 0xEE62E0); // "Unable to send analytics event! MessageManager == NULL!"

const MessageManager_sendMessageOffset = 24;
const latencyTestsCountOffset = 404;
const latencyTestsOffset = 392;

const MessageManager_receiveMessage = new NativeFunction( // "BrawlTvManager processed msg of type %d"
    Libg.offset(0x68F6C4, 0x232A54), 'bool', ['pointer', 'pointer']
);

const MessageManager_update = new NativeFunction( // "TID_MATCHMAKE_FAILED_%i"
    Libg.offset(0x695F2C, 0x2386E8), 'void', ['pointer', 'float']
);

export class MessageManager {
    static accountInfo: string;
    static accountId: NativePointer;
    static ownPlayerTeam: number = -1;
    static pendingProfiles: BattleProfile[] = [];

    static getInstance(): NativePointer {
        return MessageManager_instance.readPointer();
    }

    static getVtable(): NativePointer {
        return this.getInstance().readPointer();
    }

    static patch() {
        Interceptor.attach(MessageManager_receiveMessage, function () {
            let message = (this.context as Arm64CpuContext).x1;
            let piranhaMessage = LogicLaserMessageFactory.createMessageByType(message);

            MessageManager.receiveMessage(piranhaMessage);
        });

        if (LogicVersion.isDeveloperBuild()) {
            /// #if DEBUG
            // Here was something but that's a thing we don't want to make public.
            /// #endif
        }
    }

    static getLatencyTests(): LatencyData[] {
        let instance = this.getInstance();
        let count = instance.add(latencyTestsCountOffset).readInt();
        let arrayPtr = instance.add(latencyTestsOffset).readPointer();

        let latencyDatas = [];

        for (let i = 0; i < count; i++) {
            latencyDatas.push(
                new LatencyData(arrayPtr.add(Process.pointerSize * i).readPointer())
            );
        }

        return latencyDatas;
    }

    static getLatencyTestsCount(): number {
        return this.getInstance().add(latencyTestsCountOffset).readInt();
    }

    private static onLoginFailedMessageReceived(message: LoginFailedMessage) {
        let errorCode = message.getErrorCode();

        console.log(`Login failed (error code ${errorCode})`);

        switch (errorCode) {
            case 1: // Account not found
            case 2: // Wrong shard
                message.setUnknown(1); // so the keychain will be wiped
                break;
            case 8: // Update is available
                if (Configuration.useStage) {
                    message.setErrorCode(31);
                    message.setUpdateURL(updateUrl);
                    message.setReason(LocalizationManager.getString("STAGE_SERVER_UPDATED"));

                    Configuration.useStage = false;
                    Configuration.save();
                }
                else {
                    message.setReason(LocalizationManager.getString("PROD_SERVER_UPDATED"));
                    message.setUpdateURL(updateUrl);
                }
                break;
            case 30:
                if (!Configuration.useProxy) {
                    Configuration.useProxy = true;
                    Configuration.save();

                    message.setErrorCode(9);
                    message.setRedirectDomain("proxy.hpdevfox.ru");
                }
                else {
                    if (Configuration.useStage) {
                        message.setReason(LocalizationManager.getString("STAGE_SERVER_REQUIRES_VPN"));

                        Configuration.useStage = false;
                        Configuration.save();

                        return;
                    }

                    message.setReason(LocalizationManager.getString("PROXY_ERROR"));
                }
                break;
        }
    }

    private static onLoginOkMessageReceived(message: LoginOkMessage) {
        try {
            console.log(`Logged in! (account id ${message.getAccountId().join('-')}, server env ${message.getServerEnvironment()})`);

            this.accountInfo =
                `Account ID: ${message.getAccountId().join("-")}
Server Version: ${message.getServerVersion()}
Server Environment: ${message.getServerEnvironment()}
Session Count: ${message.getSessionCount()}
Playtime: ${message.getPlaytimeSeconds()}
Days since started playing: ${message.getDaysSinceStartedPlaying()}
Account tier: ${message.getAccountTier()}
`;
            let accountId = message.getAccountId();

            this.accountId = Libc.malloc(8);

            this.accountId.writeInt(accountId[0]);
            this.accountId.add(4).writeInt(accountId[1]);
        }
        catch (e) {

        }

        let languageCode = StringTable.getCurrentLanguageCode();

        if (!languageCode)
            languageCode = "EN";

        LocalizationManager.loadLocalization(languageCode);
        LocalizationManager.buildChangelogs();

        Debug.addResourcesToLoad();
        Debug.create();

        if (!Configuration.showDebugItems) {
            Debug.getDebugButton().hide();
            Debug.getDebugMenu().hide();
        }
    }

    private static onOwnHomeDataMessageReceived(message: OwnHomeDataMessage) {
        BattleMode.xrayTargetGlobalId = -1;
        BattleMode.xrayTargetPlayerIndex = -1;

        this.ownPlayerTeam = -1;
        UsefulInfo.setBattleInfo("");
        UsefulInfo.setBattlePing(-1);
        MessageManager.pendingProfiles = [];

        if (!LogicVersion.areNewFeaturesAllowed(0))
            setTimeout(() => GUI.showFloaterText(LocalizationManager.getString("IOS_TOO_OLD")), 4000);

        if (Configuration.antiOutOfSync)
            setTimeout(() => GUI.showFloaterText(LocalizationManager.getString("ANTI_OUT_OF_SYNC")), 2000);

        GameMain.setSlowMode(Configuration.slowMode);

        let confData = message.getConfData();
        if (Configuration.themeId != -1 || Configuration.staticBackground) {
            for (let i = 0; i < confData.add(228).readInt(); i++) {
                let ptr = confData.add(216).readPointer().add(Process.pointerSize * i).readPointer();
                Libc.free(ptr);
            }

            Libc.free(confData.add(216).readPointer());

            confData.add(216).writePointer(NULL);
            confData.add(228).writeInt(0);
        }

        if (Configuration.regionId != -1) {
            LatencyManager.selectedRegionId = Configuration.regionId;
            LatencyManager.triggerLatencyTest(Configuration.regionId);
        }

        LogicDataTables.patchClientGlobals();

        message.getClientAvatar().changeNameIfDeveloper();
    }

    private static onUdpConnectionInfoMessageReceived(message: UdpConnectionInfoMessage) {
        console.log("UDP server: " + message.getServerIp() + ":" + message.getServerPort());
        Configuration.udpConnectionAddress = message.getServerIp() + ":" + message.getServerPort();

        return true;
    }

    private static receiveMessage(message: PiranhaMessage) {
        const messageType = message.getMessageType();

        //if (LogicVersion.isDeveloperBuild())
        //    console.log("receiveMessage: " + messageType);

        switch (messageType) {
            case 20103:
                this.onLoginFailedMessageReceived(message as LoginFailedMessage);
                break;
            case 20104:
                this.onLoginOkMessageReceived(message as LoginOkMessage);
                break;
            case 20559:
                this.onStartLoadingMessageReceived(message as StartLoadingMessage);
                break;
            case 23456:
                this.onBattleEndMessageReceived(message as BattleEndMessage);
                break;
            case 24101:
                this.onOwnHomeDataMessageReceived(message as OwnHomeDataMessage);
                break;
            case 24112:
                this.onUdpConnectionInfoMessageReceived(message as UdpConnectionInfoMessage);
                break;
            case 24113:
                this.onPlayerProfileMessageReceived(message as PlayerProfileMessage);
                break;
            case 24131:
                this.onTeamStreamMessageReceived(message as TeamStreamMessage);
                break;
            case 28275:
                this.onClaimVouncherFailedMessageReceived(message as ClaimVouncherFailedMessageReceived);
                break;
        }
    }

    private static onBattleEndMessageReceived(message: BattleEndMessage) {
        BattleMode.xrayTargetGlobalId = -1;
        BattleMode.xrayTargetPlayerIndex = -1;

        Debug.getDebugMenu()?.removeCategory(EDebugCategory.XRAY);

        this.ownPlayerTeam = -1;
        UsefulInfo.setBattleInfo("");
        UsefulInfo.setBattlePing(-1);
        MessageManager.pendingProfiles = [];

        const status = message.getPlayAgainStatus();
        if (!status.isNull() && !message.getPlayAgainStatus().isNull() && Configuration.autoPlayAgain)
            MessageManager.sendMessage(new PlayAgainMessage(true));
    }

    public static sendMessage(message: PiranhaMessage) {
        new NativeFunction(this.getVtable().add(MessageManager_sendMessageOffset).readPointer(), 'void', ['pointer', 'pointer'])(this.getInstance(), message.instance);
    }

    public static receive(message: PiranhaMessage) {
        new NativeFunction(MessageManager_receiveMessage, 'void', ['pointer', 'pointer'])(this.getInstance(), message.instance);
    }

    static hexToByteArray(hexString: string) {
        if (hexString.length % 2 !== 0) {
            throw new Error("Invalid hex string");
        }

        const byteArray = new Uint8Array(hexString.length / 2);
        for (let i = 0; i < hexString.length; i += 2) {
            byteArray[i / 2] = parseInt(hexString.substr(i, 2), 16);
        }
        return byteArray;
    }

    static uint8ArrayToPointer(uint8Array: Uint8Array) {
        const arrayBuffer = uint8Array.buffer instanceof ArrayBuffer ? uint8Array.buffer : new ArrayBuffer(uint8Array.length);
        const pointer = Libc.malloc(arrayBuffer.byteLength);
        pointer.writeByteArray(arrayBuffer);
        return pointer;
    }

    private static onStartLoadingMessageReceived(message: StartLoadingMessage) {
        /// #if DEBUG
        // oh here also was something but guess what?
        /// #endif

        SkinChanger.load(message);

        this.ownPlayerTeam = message.getOwnPlayerTeam();

        let info = "";
        let isBotMatch = Configuration.showBotPrefix;
        let playersArray = message.getPlayersArray();

        let firstTeamAvatarId: number[] = [];

        for (const player of playersArray) {
            if (firstTeamAvatarId.length == 0) {
                if (player.isOwnPlayerTeam(this.ownPlayerTeam)) {
                    firstTeamAvatarId = player.getAvatarId();
                }
            }

            if (!player.isOwnPlayerTeam(message.getOwnPlayerTeam())) {
                isBotMatch = isBotMatch
                    ? (player.getAvatarId()[0] == firstTeamAvatarId[0] && player.getAvatarId()[1] < firstTeamAvatarId[1])
                    : false;
            }

            if (player.isBot()) isBotMatch = false;

            if (!player.isBot()) {
                // MessageManager.addPendingProfile(new BattleProfile(player.getAvatarId(), player.getCharacterGlobalId(), player.instance));
            }

            info += player.toString() + "\n";
        }

        if (isBotMatch && Configuration.showBotPrefix) {
            console.log("BOT MATCH!");

            for (const player of playersArray) {
                if (player.isOwnPlayerTeam(this.ownPlayerTeam)) continue;

                player.setName(`<c3>[BOT]</c> ${player.getName()}`);
            }
        }


        if (LogicVersion.isDeveloperBuild()) {
            Debug.getDebugMenu().createDebugMenuButton("Disable X-Ray", -1, -1, 0, EDebugCategory.XRAY);

            for (const player of playersArray) {
                let teamIndex = player.getTeamIndex();

                if (message.getOwnPlayerTeam() != teamIndex &&
                    message.getOwnPlayerIndex() != player.getPlayerIndex()) {
                    Debug.getDebugMenu().createDebugMenuButton(playersArray.indexOf(player) + ". " + player.getName(), -1, -1, 0, EDebugCategory.XRAY);

                    console.log("MessageManager.onStartLoadingMessageReceived:", "X-Ray target", player.getName(), "added!");
                }

                Debug.getDebugMenu().needToUpdateLayout();
            }
        }

        // console.log(info)

        UsefulInfo.setBattleInfo(info);
    }

    private static onClaimVouncherFailedMessageReceived(message: ClaimVouncherFailedMessageReceived) {
        /// #if DEBUG
        if (LogicVersion.isDeveloperBuild()) {
            const messageFake = LogicLaserMessageFactory.createMessage(20108);
            message.instance.writePointer(messageFake);
        }
        /// #endif
    }

    private static onPlayerProfileMessageReceived(message: PlayerProfileMessage) {
        const playerProfile = message.getPlayerProfile();

        const pendingProfile = MessageManager.getPendingProfile(playerProfile.getPlayerId());
        if (pendingProfile) {

        }
    }

    private static onTeamStreamMessageReceived(message: TeamStreamMessage) {
        const streamLength = message.getStreamLength();

        if (streamLength > 1) return;
    }

    private static getPendingProfile(playerId: number[]): BattleProfile | null {
        for (const pendingProfile in MessageManager.pendingProfiles) {
            const battleProfile = MessageManager.pendingProfiles[pendingProfile];

            const id: number[] = battleProfile.playerId;

            if (id[0] == playerId[0] && id[1] == playerId[1]) {
                return battleProfile;
            }
        }

        return null;
    }

    private static addPendingProfile(battleProfile: BattleProfile) {
        if (!MessageManager.getPendingProfile(battleProfile.playerId)) {
            MessageManager.pendingProfiles.push(battleProfile);
            MessageManager.sendMessage(new GetPlayerProfileMessage(battleProfile.playerId));
        }
    }
}

// ============================================================
// FILE: src/laser/client/network/ServerConnection.ts
// ============================================================
import {Configuration} from "../../../gene/Configuration";
import {Libc} from "../../../libs/Libc";

const STAGE_SERVER_HOST = "stage.brawlstarsgame.com";
const PROD_SERVER_HOST = "game.brawlstarsgame.com";
const DEAD_STAGE_SERVER_HOST = "ec2-54-147-16-212.compute-1.amazonaws.com";
const PROXY_PROD_SERVER_HOST = "179.43.168.108";

const ports = [
    "9339",
    "1863",
    "30000"
];

export class ServerConnection {
    static setupMessaging() {
        Interceptor.replace(Module.getGlobalExportByName("getaddrinfo")!, new NativeCallback(function (node, service, hints, res) {
            if (ports.includes(service.readUtf8String()!)
                && (node.readUtf8String() == PROD_SERVER_HOST ||
                    node.readUtf8String() == DEAD_STAGE_SERVER_HOST)
            ) {
                if (Configuration.useProxy && !Configuration.useStage) {
                    console.log("ServerConnection::setupMessaging: redirecting to proxy!");
                    node = PROXY_PROD_SERVER_HOST.ptr();
                }
                if (Configuration.useStage) {
                    console.log("ServerConnection::setupMessaging: redirecting to stage server!");
                    node = STAGE_SERVER_HOST.ptr();
                }

                console.log("ServerConnection::setupMessaging:", `connecting to ${node.readUtf8String()}:${service.readUtf8String()}`);
            }

            return Libc.getaddrinfo(node, service, hints, res);
        }, 'int', ['pointer', 'pointer', 'pointer', 'pointer']));
    }
}

// ============================================================
// FILE: src/laser/client/popups/MapEditorModifierPopup.ts
// ============================================================
import {Libg} from "../../../libs/Libg";

const MapEditorModifierPopup_ctor = new NativeFunction( // "popup_editor_modifier"
    Libg.offset(0x5E5AEC, 0x1A2A7C), 'pointer', ['pointer']
);

const MapEditorModifierPopup_addModifierItem = new NativeFunction( // in ctor
    Libg.offset(0x5E638C, 0x1A31A4), 'void', ['pointer', 'int']
);

const modifiers: number[] = [
    38
];

export class MapEditorModifierPopup {
    static patch() {
        Interceptor.replace(MapEditorModifierPopup_ctor, new NativeCallback(function (self) {
            MapEditorModifierPopup_ctor(self);

            modifiers.forEach((i) => {
                MapEditorModifierPopup.addModifierItem(self, i);
            });

            return self;
        }, 'pointer', ['pointer']));
    }

    static addModifierItem(self: NativePointer, modifier: number) {
        MapEditorModifierPopup_addModifierItem(self, modifier);
    }
}

// ============================================================
// FILE: src/laser/client/state/GameStateManager.ts
// ============================================================
import {Libg} from "../../../libs/Libg";

const GameStateManager_instance = Libg.offset(0x0, 0xEE67A0);

const GameStateManager_clearGameData = new NativeFunction( // "TID_MAP_EDITOR_SAVE_ERROR"
    Libg.offset(0x8089B4, 0x36EB4C), 'void', ['pointer']
);

const GameStateManager_changeToState = new NativeFunction( // "TID_PLAYER_MAP_ERROR_INVALID_CONTENT" second
    Libg.offset(0x8090A8, 0x36F0F0), 'void', ['pointer']
);

const currentStateOffset = 32;
const currentStateIdOffset = 40;
const changingStateOffset = 44;

export class GameStateManager {
    static getCurrentState(): NativePointer {
        return this.instance.add(currentStateOffset).readPointer();
    }

    static get instance(): NativePointer {
        return GameStateManager_instance.readPointer();
    }

    static clearGameData() {
        GameStateManager_clearGameData(this.instance);
    }

    static changeState(stateId: number) {
        this.instance.add(changingStateOffset).writeInt(stateId);
    }

    static changeToState() {
        GameStateManager_changeToState(this.instance);
    }

    static isState(stateId: number): boolean {
        return this.instance.add(currentStateIdOffset).readInt() == stateId;
    }

    static isBattleMode(): boolean {
        return this.isState(5);
    }

    static isHomeMode(): boolean {
        return this.isState(4);
    }
}
// ============================================================
// FILE: src/laser/logic/utils/LogicGamePlayUtil.ts
// ============================================================
export class LogicGamePlayUtil {
    static roundedDivision(a1: number, a2: number) {
        return (a1 / a2) + 0.5;
    }
}
// ============================================================
// FILE: src/libs/Libc.ts
// ============================================================

const PROP_VALUE_MAX = 256;

export class Libc {
    static getaddrinfo = new NativeFunction(Module.getGlobalExportByName("getaddrinfo")!, 'int', ['pointer', 'pointer', 'pointer', 'pointer']);
    static close = new NativeFunction(Module.getGlobalExportByName("close")!, 'void', ['int']);
    static free = new NativeFunction(Module.getGlobalExportByName("free")!, 'void', ['pointer']);
    static malloc = new NativeFunction(Module.getGlobalExportByName("malloc")!, 'pointer', ['uint']);

    static open(pathname: string, flags: number, mode: string): number {
        let modes: { [name: string]: number; } = {
            "r": 0
        };

        return new NativeFunction(Module.getGlobalExportByName("open")!, 'int', ['pointer', 'int', 'int'])(pathname.ptr(), flags, modes[mode]!);
    }

    static read = new NativeFunction(Module.getGlobalExportByName("read")!, 'int', ['int', 'pointer', 'int']);

    static getSystemProperty(prop: string): string {
        let value = this.malloc(PROP_VALUE_MAX);

        new NativeFunction(Module.getGlobalExportByName("__system_property_get")!, 'int', ['pointer', 'pointer'])(prop.ptr(), value);

        let result = value.readUtf8String();

        this.free(value);

        return result!;
    }

    static sysctlbyname(name: string): string {
        let value = this.malloc(PROP_VALUE_MAX);
        let lengthPtr = this.malloc(4);
        lengthPtr.writeInt(PROP_VALUE_MAX);

        let result = new NativeFunction(Module.getGlobalExportByName("sysctlbyname")!, 'int', ['pointer', 'pointer', 'pointer', 'pointer', 'int'])(name.ptr(), value, lengthPtr, NULL, 0);
        if (result != -1) {
            return value.readUtf8String()!;
        }

        this.free(value);
        this.free(lengthPtr);

        return "";
    }

    static opendir(dir: string) {
        return new NativeFunction(Module.getGlobalExportByName('opendir')!, 'pointer', ['pointer'])(dir.ptr());
    }

    static readdir = new NativeFunction(Module.getGlobalExportByName('readdir')!, 'pointer', ['pointer']);
    static closedir = new NativeFunction(Module.getGlobalExportByName('closedir')!, 'int', ['pointer']);

    static remove(dir: string) {
        return new NativeFunction(Module.getGlobalExportByName('remove')!, 'int', ['pointer'])(dir.ptr());
    }

    static mkdir(dir: string, mode?: number) { // 0o777
        if (mode) {
            new NativeFunction(Module.getGlobalExportByName('mkdir')!, 'void', ['pointer', 'int'])(dir.ptr(), mode);
            return;
        }

        new NativeFunction(Module.getGlobalExportByName('mkdir')!, 'void', ['pointer'])(dir.ptr());
    }

    static chmod(dir: string, mode: number = 0o777) {
        new NativeFunction(Module.getGlobalExportByName('chmod')!, 'void', ['pointer', 'int'])(dir.ptr(), mode);
    }

    static access(dir: string) {
        return new NativeFunction(Module.getGlobalExportByName('access')!, 'int', ['pointer', 'int'])(dir.ptr(), 0);
    }

    static memset(instance: NativePointer, offset: number, count: number) {
        new NativeFunction(Module.getGlobalExportByName('memset')!, 'void', ['pointer', 'int', 'int']);
    }
}
// ============================================================
// FILE: src/libs/Libg.ts
// ============================================================
import {LogicDefines} from "../LogicDefines";
import {Libc} from "./Libc";

const gameLibraryName = LogicDefines.isPlatformIOS() ? "laser" : "libg.so";

export class Libg {
    static module: Module;
    static size: number;
    static begin: NativePointer;
    static end: NativePointer;

    static init(path: string): void {
        this.module = Process.findModuleByName(path)!;
        this.begin = this.module.base;
        this.size = this.module.size;
        this.end = this.begin.add(this.size);
    }

    static offset(android_arm64: number, ios: number): NativePointer {
        if (!this.module)
            this.init(gameLibraryName);

        let offset = LogicDefines.isPlatformAndroid() ? android_arm64 : ios;
        if (offset == -1) {
            return Libc.malloc(8); // ignore
        }

        if (offset < 0x3) {
            console.error(new Error(`Libg.offset - offset is NULL! Please update it. (${LogicDefines.toString()})`).stack);
            return Libc.malloc(8);
        }

        return this.begin.add(offset);
    }
}
// ============================================================
// FILE: src/logic/LogicVersion.ts
// ============================================================
import {Configuration} from "../gene/Configuration";
import {Libg} from "../libs/Libg";
import {LogicDefines} from "../LogicDefines";

const LogicVersion_environment = Libg.offset(0x0, 0xEE68B4);

const LogicVersion_isChinaVersion = Libg.offset(0x0, 0x39271C); // "Only global leaderboard available but fetching local" | or LogicVersion_isStage + 12
const LogicVersion_isDeveloperBuild = Libg.offset(0x0, 0x39275C); // "LATENCY TESTS" | or LogicVersion_isChinaVersion + 8

const version = LogicDefines.isPlatformAndroid() ? "62.250" : "62.258";
const scriptVersion = 87;

type ScriptEnvironment = "dev" | "prod";

export class LogicVersion {
    static readonly scriptEnvironment: ScriptEnvironment = process.env.SCRIPT_ENV as ScriptEnvironment;
    static iosVersion: number = 0;

    static isProd(): boolean {
        return this.scriptEnvironment == "prod";
    }

    static isDeveloperBuild(): boolean {
        return this.scriptEnvironment == 'dev';
    }
    static getScriptVersion(): number {
        return scriptVersion;
    }

    static areNewFeaturesAllowed(version: number): boolean {
        if (LogicDefines.isPlatformAndroid()) return true;
        if (LogicVersion.isDeveloperBuild()) return true;

        return LogicVersion.iosVersion >= version;
    }

    static patch() {
        this.updateEnvironment();

        Interceptor.replace(LogicVersion_isChinaVersion, new NativeCallback(function () {
            return Number(Configuration.isChinaVersion);
        }, 'bool', []));

        // for testing purposes
        Interceptor.replace(LogicVersion_isDeveloperBuild, new NativeCallback(function () {
            return 1;
        }, 'bool', []));
    }

    static updateEnvironment() {
        LogicVersion_environment.writeInt(Configuration.useStage ? 5 : 3);
    }

    static toString(): string {
        return `v${version} (script: ${scriptVersion})`;
    }

    static toDebugString(): string {
        return `${version}`; // don't add "v" prefix here
    }

    static getEnvironment(): string {
        return this.scriptEnvironment;
    }
}
// ============================================================
// FILE: src/logic/alliance/AllianceFullEntry.ts
// ============================================================
import {AllianceHeaderEntry} from "./AllianceHeaderEntry";

export class AllianceFullEntry {
    instance: NativePointer;

    constructor(instance: NativePointer) {
        this.instance = instance;
    }

    getAllianceHeaderEntry() {
        return AllianceFullEntry.getAllianceHeaderEntry(this.instance);
    }

    static getAllianceHeaderEntry(self: NativePointer): AllianceHeaderEntry {
        return new AllianceHeaderEntry(
            self.readPointer()
        );
    }
}
// ============================================================
// FILE: src/logic/alliance/AllianceHeaderEntry.ts
// ============================================================
    import {GradientNickname} from "../../gene/features/GradientNickname";
import {Libg} from "../../libs/Libg";
import {HashTagCodeGenerator} from "../../titan/logic/util/HashTagCodeGenerator";

const AllianceHeaderEntry_decode = new NativeFunction( // 24399 decode
    Libg.offset(0x969BD0, 0x478CE8), 'void', ['pointer', 'pointer']
);

const AllianceHeaderEntry_nameOffset = 8;

export class AllianceHeaderEntry {
    instance: NativePointer;

    constructor(instance: NativePointer) {
        this.instance = instance;
    }

    getAllianceId() {
        return AllianceHeaderEntry.getAllianceId(this.instance);
    }

    getAllianceName() {
        return AllianceHeaderEntry.getAllianceName(this.instance);
    }

    static getAllianceId(self: NativePointer): NativePointer {
        return self.readPointer();
    }

    static getAllianceName(self: NativePointer): string {
        return self.add(AllianceHeaderEntry_nameOffset).readPointer().fromsc();
    }

    static patch() {
        Interceptor.replace(AllianceHeaderEntry_decode, new NativeCallback(function (self, byteStream) {
            AllianceHeaderEntry_decode(self, byteStream);

            const allianceIdPtr = AllianceHeaderEntry.getAllianceId(self);

            const allianceName = self.add(AllianceHeaderEntry_nameOffset).readPointer();
            const allianceTag = HashTagCodeGenerator.toCode(allianceIdPtr);

            GradientNickname.setClubGradient(allianceTag, allianceName);
        }, 'void', ['pointer', 'pointer']));
    }
}
// ============================================================
// FILE: src/logic/alliance/AllianceInfo.ts
// ============================================================
import {RGBA} from "../../gene/features/RGBA";
import {LocalizationManager} from "../../gene/localization/index";
import {Libg} from "../../libs/Libg";
import {DropGUIContainer} from "../../titan/flash/gui/DropGUIContainer";
import {GUI} from "../../titan/flash/gui/GUI";
import {GameButton} from "../../titan/flash/gui/GameButton";
import {IButtonListener} from "../../titan/flash/gui/IButtonListener";
import {HashTagCodeGenerator} from "../../titan/logic/util/HashTagCodeGenerator";
import {Application} from "../../titan/utils/Application";
import {AllianceFullEntry} from "./AllianceFullEntry";

const AllianceInfo_setData = new NativeFunction(
    Libg.offset(0x4DBF68, 0xC1B54), 'void', ['pointer', 'pointer'] // "TID_CLAN_INFO_NO_DESCRIPTION"
);

export class AllianceInfo {
    static copyTagButton: GameButton;
    static allianceId: number[];

    static patch() {
        Interceptor.replace(AllianceInfo_setData, new NativeCallback((allianceInfo, allianceFullEntryPtr) => {
            const allianceFullEntry = new AllianceFullEntry(allianceFullEntryPtr);
            const allianceHeaderEntry = allianceFullEntry.getAllianceHeaderEntry();
            const allianceId = allianceHeaderEntry.getAllianceId();

            AllianceInfo.allianceId = allianceId.accountId();

            AllianceInfo_setData(allianceInfo, allianceFullEntryPtr);

            const guiContainer = new DropGUIContainer(allianceInfo);
            AllianceInfo.copyTagButton = guiContainer.addGameButton("tag_stat", true);
            AllianceInfo.copyTagButton.setButtonListener(new IButtonListener(this.buttonPressed));
        }, 'void', ['pointer', 'pointer']));
    }

    static buttonPressed() {
        const allianceTag = HashTagCodeGenerator.toCode(AllianceInfo.allianceId);

        Application.copyString("#" + allianceTag);
        GUI.showFloaterText(
            LocalizationManager.getString("TAG_COPIED"),
            RGBA.green
        );
    }
}

// ============================================================
// FILE: src/logic/alliance/AllianceManager.ts
// ============================================================
import {Libg} from "../../libs/Libg";

const AllianceManager_instance = Libg.offset(0x0, 0xEE61C8);

const AllianceManager_isAllianceFeatureAvailable = Libg.offset(0x4E27FC, 0xC7440); // "AllianceManager::isAllianceFeatureAvailable called with null mode"

const AllianceManager_doStartSpectate = new NativeFunction( // "TID_ERROR_SPECTATE_WAITING"
    Libg.offset(0x4E570C, 0xC8E48), 'void', ['pointer', 'pointer']
);

const AllianceManager_showPopup = new NativeFunction(
    Libg.offset(0x4E590C, 0xC9024), 'void', ['pointer']
);

export class AllianceManager {
    static getInstance(): NativePointer {
        return AllianceManager_instance.readPointer();
    }

    static patch() {
        Interceptor.replace(AllianceManager_isAllianceFeatureAvailable, new NativeCallback(function () {
            return 1;
        }, 'bool', []));
    }

    static startSpectate(logicLong: NativePointer) {
        AllianceManager_doStartSpectate(this.getInstance(), logicLong);
    }

    static showPopup(popupInstance: NativePointer) {
        AllianceManager_showPopup(popupInstance);
    }
}

// ============================================================
// FILE: src/logic/alliance/AllianceMemberEntry.ts
// ============================================================
import {GradientNickname} from "../../gene/features/GradientNickname";
import {Libg} from "../../libs/Libg";
import {HashTagCodeGenerator} from "../../titan/logic/util/HashTagCodeGenerator";

const AllianceMemberEntry_decode = new NativeFunction( // 24308 decode
    Libg.offset(0x96A528, 0x4794AC), 'void', ['pointer', 'pointer']
);

const AllianceMemberEntry_IDOffset = 40;
const AllianceMemberEntry_PlayerDisplayDataOffset = 56;

export class AllianceMemberEntry {
    static patch() {
        Interceptor.replace(AllianceMemberEntry_decode, new NativeCallback(function (allianceMemberEntry, ByteStream) {
            AllianceMemberEntry_decode(allianceMemberEntry, ByteStream);

            const memberId = allianceMemberEntry.add(AllianceMemberEntry_IDOffset).readPointer();
            const memberTag = HashTagCodeGenerator.toCode(memberId);

            const playerDisplayData = allianceMemberEntry.add(AllianceMemberEntry_PlayerDisplayDataOffset).readPointer();

            GradientNickname.setPlayerGradient(memberTag, playerDisplayData);
        }, 'void', ['pointer', 'pointer']));
    }
}
// ============================================================
// FILE: src/logic/avatar/LogicClientAvatar.ts
// ============================================================
import {Libg} from "../../libs/Libg";
import {Configuration} from "../../gene/Configuration";
import {HashTagCodeGenerator} from "../../titan/logic/util/HashTagCodeGenerator";
import {GradientNickname} from "../../gene/features/GradientNickname";

const tutorialsCompletedCountOffset = 360;
const LogicClientAvatar_shouldGoToFirstTutorialBattle = Libg.offset(0x83A470, 0x39747C); // "MessageManager: start deferred dl" then go to x ref of that function and check condititions func higher (a1 + 320 == 0)

const PlayerDisplayData_PlayerDisplayData = new NativeFunction( // player %i (under string) (LogicDataTables::createDefaultDisplayData)
    Libg.offset(0x9797A0, 0x484BFC), 'pointer', ['pointer', 'pointer', 'pointer', 'pointer', 'pointer', 'pointer']
);

const PlayerDisplayData_decode = new NativeFunction( // check below normal ctor in disasm (only ByteStream arg)
    Libg.offset(0x9798B8, 0x484D10), 'void', ['pointer', 'pointer']
);

const nameOffset = 56;
const accountIdOffset = 28;

export class LogicClientAvatar {
    instance: NativePointer;

    constructor(instance: NativePointer) {
        this.instance = instance;
    }

    static patch(): void {
        Interceptor.replace(LogicClientAvatar_shouldGoToFirstTutorialBattle, new NativeCallback(function (avatar) {
            avatar.add(tutorialsCompletedCountOffset).writeInt(2);
            return 0;
        }, 'bool', ['pointer']));

        Interceptor.replace(PlayerDisplayData_PlayerDisplayData, new NativeCallback(function (instance, name, legendaryLevel, nameColor, playerThumbnail, brawlPassSeason) {
            if (!Configuration.showName) {
                name.scptr("");
            }

            return PlayerDisplayData_PlayerDisplayData(instance, name, legendaryLevel, nameColor, playerThumbnail, brawlPassSeason);
        }, 'pointer', ['pointer', 'pointer', 'pointer', 'pointer', 'pointer', 'pointer']));

        Interceptor.replace(PlayerDisplayData_decode, new NativeCallback(function (instance, byteStream) {
            PlayerDisplayData_decode(instance, byteStream);
            if (!Configuration.showName) {
                instance.scptr("");
            }

            return instance;
        }, 'pointer', ['pointer', 'pointer']));
    }

    shouldGoToFirstTutorialBattle(): boolean {
        return LogicClientAvatar.shouldGoToFirstTutorialBattle(this.instance);
    }

    shouldGoToSecondTutorialBattle(): boolean {
        return LogicClientAvatar.shouldGoToSecondTutorialBattle(this.instance);
    }

    static shouldGoToFirstTutorialBattle(self: NativePointer): boolean {
        return self.add(tutorialsCompletedCountOffset).readInt() == 0;
    }

    static shouldGoToSecondTutorialBattle(self: NativePointer): boolean {
        return self.add(tutorialsCompletedCountOffset).readInt() == 1;
    }

    getAccountId(): number[] {
        return this.instance.add(accountIdOffset).accountId();
    }

    getAccountIdPtr(): NativePointer {
        return this.instance.add(accountIdOffset);
    }

    getName(): string {
        return this.instance.add(nameOffset).fromsc();
    }

    setName(name: string) {
        this.instance.add(nameOffset).scptr(name);
    }

    changeNameIfDeveloper() {
        let hashtag = HashTagCodeGenerator.toCode(this.instance.add(accountIdOffset));

        GradientNickname.setPlayerGradient(hashtag, this.instance.add(nameOffset));
    }
}
// ============================================================
// FILE: src/logic/battle/BattleEndPopup.ts
// ============================================================
import {Libg} from "../../libs/Libg";
import {Configuration} from "../../gene/Configuration";
import {ContextMenu} from "../../titan/flash/gui/ContextMenu";
import {LogicDefines} from "../../LogicDefines";

const BattleEndPopup_proceedToNextState = new NativeFunction( // "goToState(%d) - already in same state" (should be in the start of func)
    Libg.offset(0x544284, 0x10A578), 'void', ['pointer', 'int']
);

const BattleEndPopup_goHome = new NativeFunction( // "Trying exit from battle end state %d, but not allowed"
    Libg.offset(0x544284, 0x114F9C), 'void', ['pointer', 'bool']
);

const BattleEndPopup_kudosPatch1 = new NativeFunction( // is kudos given to any player
    Libg.offset(0x0, -1), 'int', ['pointer', 'int']
);

const BattleEndPopup_kudosPatch2 = new NativeFunction( // is player kudos'ed
    Libg.offset(0x0, -1), 'bool', ['pointer', 'int', 'int']
);

const BattleEndPopup_BattleEndPopup = Libg.offset(0x0, 0x107C68); // "battle_end_top_left" (not sure)

export class BattleEndPopup {
    static patch() {
        Interceptor.replace(BattleEndPopup_proceedToNextState, new NativeCallback(function (battleEndPopup, state) {
            if (state == 4 && Configuration.skipBattleEndReplay) {
                state = 1;
            }

            console.log("BE: " + state);

            if (Configuration.autoExitAfterBattle) {
                BattleEndPopup_proceedToNextState(battleEndPopup, 1);
                BattleEndPopup_proceedToNextState(battleEndPopup, 3);
                BattleEndPopup_goHome(battleEndPopup, 1);
            }
            else {
                BattleEndPopup_proceedToNextState(battleEndPopup, state);
            }
        }, 'void', ['pointer', 'int']));

        Interceptor.attach(BattleEndPopup_BattleEndPopup, {
            onLeave() {
                ContextMenu.shouldShowContextMenu = true;
            }
        });

        Interceptor.attach(BattleEndPopup_goHome, {
            onEnter() {
                if (LogicDefines.isPlatformAndroid()) {
                    Libg.offset(0xFC29C4, -1).writeU8(0);
                }
            }
        });

        return;
        if (LogicDefines.isPlatformIOS()) {
            Interceptor.replace(BattleEndPopup_kudosPatch1, new NativeCallback(function (a1, a2) {
                return 0;
            }, 'int', ['pointer', 'int']));

            Interceptor.replace(BattleEndPopup_kudosPatch2, new NativeCallback(function (a1, a2, a3) {
                return 0;
            }, 'bool', ['pointer', 'int', 'int']));
        }
    }
}

// ============================================================
// FILE: src/logic/battle/BattleLogPlayerEntry.ts
// ============================================================
import {GradientNickname} from "../../gene/features/GradientNickname";
import {Libg} from "../../libs/Libg";
import {HashTagCodeGenerator} from "../../titan/logic/util/HashTagCodeGenerator";

const BattleLogPlayerEntry_ctor = new NativeFunction( // 15081 decode | 23458 decode -> BattleLogEntry -> BattleLogPlayerEntry
    Libg.offset(0x97C2B4, 0x486BDC), 'void', ['pointer', 'pointer']
);

const BattleLogPlayerEntry_playerIdOffset = 8;
const BattleLogPlayerEntry_PlayerDisplayDataOffset = 96;

export class BattleLogPlayerEntry {
    static patch() {
        Interceptor.replace(BattleLogPlayerEntry_ctor, new NativeCallback(function (battleLogPlayerEntry, ByteStream) {
            BattleLogPlayerEntry_ctor(battleLogPlayerEntry, ByteStream);

            const playerId = battleLogPlayerEntry.add(BattleLogPlayerEntry_playerIdOffset).readPointer();
            const playerTag = HashTagCodeGenerator.toCode(playerId);

            const playerDisplayData = battleLogPlayerEntry.add(BattleLogPlayerEntry_PlayerDisplayDataOffset).readPointer();

            GradientNickname.setPlayerGradient(playerTag, playerDisplayData);
        }, 'void', ['pointer', 'pointer']));
    }
}
// ============================================================
// FILE: src/logic/battle/BattleMode.ts
// ============================================================
import {GameStateManager} from "../../laser/client/state/GameStateManager";
import {LogicBattleModeClient_gameModeVariationOffset} from "./LogicBattleModeClient";
import {LogicPlayer} from "./LogicPlayer";
import {LocalizationManager} from "../../gene/localization/index";
import {GUI} from "../../titan/flash/gui/GUI";
import {LogicVersion} from "../LogicVersion";
import {Libg} from "../../libs/Libg";

const logicOffset = 40;
const screenOffset = 8;
const clientInputManagerOffset = 88;
const LogicBattleModeClient_playersCountOffset = 232;

export const BattleMode_isInTrainingCave = new NativeFunction(
    Libg.offset(-1, 0x895FC), 'bool', ['pointer'] // check upper than "edit_controls_ui"
);

const BattleMode_getIntroTicks = new NativeFunction(
    Libg.offset(0x9D650C, 0x4C224C), 'int', ['int'] // "pressReplayControlZap() -> from tick %d to %d" (v13 = sub_100XXXXXX(*(v12 + 292)) also it has ::clamp inlined below)
);                                                  // это че за заклинание для входа в хогвартс

export class BattleMode {
    static xrayTargetPlayerIndex: number = -1;
    static xrayTargetGlobalId: number = 1;

    static getInstance(): NativePointer {
        if (GameStateManager.isState(5)) {
            return GameStateManager.getCurrentState();
        }

        return NULL;
    }

    static getLogic(): NativePointer {
        return this.getInstance().add(logicOffset).readPointer();
    }

    static getScreen(): NativePointer {
        return this.getInstance().add(screenOffset).readPointer();
    }

    static getClientInputManager(): NativePointer {
        return this.getInstance().add(clientInputManagerOffset).readPointer();
    }

    static setXrayTarget(playerName: string) {
        let playerIdx = Number(playerName.split(".")[0]);

        console.log("BattleMode.setXrayTarget:", "xray target: ", playerName);

        let logicBattleModeClient = this.getLogic();
        let players = logicBattleModeClient.readPointer();
        let playerPtr = players.add(Process.pointerSize * playerIdx).readPointer();

        //if (LogicPlayer.getName(playerPtr) == playerName) {
        this.xrayTargetPlayerIndex = LogicPlayer.getPlayerIndex(playerPtr);
        this.xrayTargetGlobalId = LogicPlayer.getCharacterGlobalId(playerPtr);

        console.log("BattleMode.setXrayTarget:", "found player with idx", this.xrayTargetPlayerIndex, "for xray, character id", LogicPlayer.getCharacterGlobalId(playerPtr));

        GUI.showFloaterText(
            LocalizationManager.getString("XRAY_TARGET_SELECTED").replace("%TARGET", LogicPlayer.getName(playerPtr))
        );
    }

    static getIntroTicks(): number {
        return BattleMode_getIntroTicks(this.getLogic().add(LogicBattleModeClient_gameModeVariationOffset).readInt());
    }
}
// ============================================================
// FILE: src/logic/battle/BattleScreen.ts
// ============================================================
import {Configuration} from "../../gene/Configuration";
import {Libg} from "../../libs/Libg";
import {ClientInputManager} from "./ClientInputManager";
import {ClientInput, ClientInputType} from "./ClientInput";
import {BattleMode} from "./BattleMode";
import {LogicBattleModeClient} from "./LogicBattleModeClient";
import {LogicDefines} from "../../LogicDefines";
import {CombatHUD, CombatHUD_shouldHaveSpectateFollowButton} from "./CombatHUD";
import {LogicGameObjectClient} from "./objects/LogicGameObjectClient";
import {Sprite} from "../../titan/flash/Sprite";
import {TeamManager} from "../home/team/TeamManager";
import {Debug} from "../../gene/Debug";
import {TeamChatMessage} from "../message/team/TeamChatMessage";
import {MessageManager} from "../../laser/client/network/MessageManager";
import {TeamStream} from "../home/team/TeamStream";
import {HomeScreen} from "../home/HomeScreen";
import {GameMain} from "../../laser/client/GameMain";
import {ContextMenu} from "../../titan/flash/gui/ContextMenu";

const BattleScreen_instance = Libg.offset(0x103E2F8, 0xEE64D0); // "pressReplayControlZap"

const BattleScreen_enter = new NativeFunction( // "land_zone"
    Libg.offset(0x6C5F50, 0x25F024), 'void', ['pointer']
);

const BattleScreen_getIntroCameraTimeLeft = new NativeFunction( // "tutorial_step"
    Libg.offset(0x485820, 0x260C30), 'float', ['pointer']
);

const BattleScreen_isAFK = new NativeFunction(
    Libg.offset(0x6D4C7C, 0x26C098), 'bool', ['pointer']
);

const BattleScreen_updateSkill = new NativeFunction( // "EnragerStarPowerDamage"
    Libg.offset(0x6CFD7C, 0x267990), 'void', ['pointer', 'pointer', 'float', 'pointer', 'bool']
);

const BattleScreen_updateCameraPosition = new NativeFunction( // return func in BattleScreen::update ("teleport_trail")
    Libg.offset(-1, -1), 'void', ['pointer']
);

const BattleScreen_cameraFunc = new NativePointer(
    Libg.offset(0x0, 0x260198)
);

const BattleScreen_sendGoHomeMessage = new NativeFunction( // "battle_won" | cupper than "TID_AFK_WARNING" in CombatHUD::update
    Libg.offset(0x6D2D84, 0x26A768), 'void', ['pointer', 'bool', 'bool', 'bool', 'bool']
);

const BattleScreen_handleAutoshoot = new NativeFunction( // xref to function that has "TID_CAN_NOT_AUTOSHOOT" string
    Libg.offset(0x0, 0x262190), 'void', ['pointer', 'pointer']
);

const LogicCharacterClientOwn_isAttached = new NativeFunction(
    Libg.offset(-1, -1), 'bool', ['pointer']
);

const BattleScreen_shouldShowMoveStick = new NativeFunction(
    Libg.offset(-1, -1), 'bool', ['pointer']
);

const BattleScreen_shouldShowChatButton = new NativeFunction(
    Libg.offset(-1, 0x26BDE0), 'bool', ['pointer']
);

const afkWarningOffset = 2984;
const targetGlobalIdOffset = 3452;
const targetXOffset = 3604;
const targetYOffset = 3608;
const shootStickActiveOffset = 3553;
const combatHudOffset = 2232;
const sideMaskSidesOffsets = [256, 264, 272, 280];
const cameraFieldsOffset = 2024;

export class BattleScreen {
    static autoAttackTick: number = 0;

    static getInstance(): NativePointer {
        return BattleScreen_instance.readPointer();
    }

    static getCombatHUD(battleScreen: NativePointer): NativePointer {
        return battleScreen.add(combatHudOffset).readPointer();
    }

    static handleAutoshoot(battleScreen: NativePointer, gameObject: NativePointer) {
        BattleScreen_handleAutoshoot(battleScreen, gameObject);
    }

    static sendGoHomeMessage(a1: number, a2: number, a3: number) {
        BattleScreen_sendGoHomeMessage(this.getInstance(), a1, a2, a3, 0);
    }

    static patch(): void {
        const self = this;

        Interceptor.attach(BattleScreen_enter, {
            onEnter(args) {
                this.battleScreen = args[0];
            },
            onLeave(retval) {
                if (HomeScreen.speechCharacter) {
                    GameMain.getHomeSprite().removeChild(HomeScreen.speechCharacter);
                    HomeScreen.speechCharacter = undefined;
                }

                if (Configuration.skipReplayIntro && CombatHUD_shouldHaveSpectateFollowButton()) {
                    const clientInput = new ClientInput(ClientInputType.Movement);
                    clientInput.setXY(180, 0);
                    ClientInputManager.addInput(clientInput);
                }

                const combatHUD = self.getCombatHUD(this.battleScreen);

                if (combatHUD.isNull()) return;
                console.log("combat hud is not null!");
                Debug.getBattleDebug().drawButtons(combatHUD);

                if (!Configuration.showSidemask) {
                    for (const sideOffset of sideMaskSidesOffsets) {
                        const sidePtr = combatHUD.add(sideOffset).readPointer();
                        if (!sidePtr.isNull()) {
                            Sprite.removeChild(combatHUD, sidePtr);
                            combatHUD.add(sideOffset).writePointer(NULL);
                        }
                    }
                }

                if (Configuration.showChatButton && TeamManager.isCurrentlyInTeam()) {
                    if (TeamStream.getLastItem().isNull()) {
                        const message = new TeamChatMessage();

                        message.setMessage("Battle began!");

                        MessageManager.sendMessage(message);
                    }

                    if (TeamManager.shouldShowOpenChatButton()) {
                        Debug.getOpenChatButton().visibility = true;

                        ContextMenu.shouldShowContextMenu = false;
                    }
                }
            }
        });

        Interceptor.attach(BattleScreen_cameraFunc, function () {
            const arm64Context = this.context as Arm64CpuContext;

            const battleScreen = BattleScreen.getInstance();

            const logicBattleModeClient = BattleMode.getLogic();

            const OwnCharacter = LogicBattleModeClient.getOwnCharacter(logicBattleModeClient);

            if (OwnCharacter.isNull())
                return;

            const posX = OwnCharacter.add(48).readU32();
            const posY = OwnCharacter.add(52).readU32();

            switch (Configuration.battleCammeraMode) {
                case 1:
                    battleScreen.add(cameraFieldsOffset).writeFloat(battleScreen.add(cameraFieldsOffset).readFloat() - battleScreen.add(cameraFieldsOffset).readFloat() - battleScreen.add(cameraFieldsOffset + 12).readFloat() + posX); //0
                    battleScreen.add(cameraFieldsOffset + 4).writeFloat(battleScreen.add(cameraFieldsOffset + 4).readFloat() - posY - battleScreen.add(cameraFieldsOffset + 16).readFloat()); //1
                    battleScreen.add(cameraFieldsOffset + 8).writeFloat(4000); //2
                    battleScreen.add(cameraFieldsOffset + 12).writeFloat(posX); //3
                    battleScreen.add(cameraFieldsOffset + 16).writeFloat(-posY); //4
                    battleScreen.add(cameraFieldsOffset + 20).writeFloat(300); //5
                    break;

                case 2:
                    const chair = 0.58779 * (CombatHUD.mirrorPlayfield() ? 1 : -1);

                    const tileMap = LogicBattleModeClient.getTileMap(logicBattleModeClient);
                    const mapWidth = tileMap.getMapWidth();
                    const mapHeight = tileMap.getMapHeight();

                    console.log(CombatHUD.mirrorPlayfield());

                    arm64Context.s2 = mapHeight * 0.5;
                    arm64Context.s3 = mapHeight * 7.5;

                    console.log(arm64Context.s2, arm64Context.s3);

                    battleScreen.add(cameraFieldsOffset).writeFloat(mapWidth * 0.5); //0
                    battleScreen.add(cameraFieldsOffset + 4).writeFloat((mapHeight * -0.5) + (mapHeight * 5.0) * chair); //1
                    battleScreen.add(cameraFieldsOffset + 8).writeFloat(mapHeight + 4.0451); //2
                    battleScreen.add(cameraFieldsOffset + 12).writeFloat(mapWidth * 0.5); //3
                    battleScreen.add(cameraFieldsOffset + 16).writeFloat(mapHeight * -0.5); //4
                    battleScreen.add(cameraFieldsOffset + 20).writeFloat(0.0); //5
                    break;

                case 3:
                    battleScreen.add(cameraFieldsOffset).writeFloat(battleScreen.add(cameraFieldsOffset).readFloat() - battleScreen.add(cameraFieldsOffset).readFloat() - battleScreen.add(cameraFieldsOffset + 12).readFloat() + Configuration.cameraRotateX + posX); //0 battleScreen.add(1672).readFloat() - battleScreen.add(1672).readFloat() - battleScreen.add(1684).readFloat() + posX
                    battleScreen.add(cameraFieldsOffset + 4).writeFloat(battleScreen.add(cameraFieldsOffset + 4).readFloat() - Configuration.cameraRotateY - posY - battleScreen.add(cameraFieldsOffset + 16).readFloat()); //1 battleScreen.add(1676).readFloat() - posY - battleScreen.add(1688).readFloat()
                    battleScreen.add(cameraFieldsOffset + 8).writeFloat(Configuration.cameraRotateY); //2
                    battleScreen.add(cameraFieldsOffset + 12).writeFloat(Configuration.cameraX); //3
                    battleScreen.add(cameraFieldsOffset + 16).writeFloat(Configuration.cameraAlign); //4 -posY
                    battleScreen.add(cameraFieldsOffset + 20).writeFloat(Configuration.cameraDistance); //5
                    //battleScreen.add(1696).writeFloat(Configuration.cameraZ); //5
                    // TEST: 1696
                    break;

            }
        });

        if (LogicDefines.isPlatformIOS()) {
            Interceptor.replace(BattleScreen_shouldShowChatButton, new NativeCallback(function (battleScreen) {
                return 1;
            }, 'bool', ['pointer']));
        }

        // Kit Hack was fixed
        /*Interceptor.replace(LogicCharacterClientOwn_isAttached, new NativeCallback(function (charClientOwn) {
            return Configuration.kitMoveHack ? 0 : LogicCharacterClientOwn_isAttached(charClientOwn);
        }, 'bool', ['pointer']));
        Interceptor.replace(BattleScreen_shouldShowMoveStick, new NativeCallback(function (battleScreen) {
            if (Configuration.kitMoveHack)
                battleScreen.add(3152).writeU8(0)

            return BattleScreen_shouldShowMoveStick(battleScreen);
        }, 'bool', ['pointer']));*/

        Interceptor.replace(BattleScreen_isAFK, new NativeCallback(function (battleScreen) {
            const isAfk = BattleScreen_isAFK(battleScreen);

            if (isAfk && Configuration.antiAFK) {
                const logicBattleModeClient = BattleMode.getLogic();
                const ownGameObject = LogicBattleModeClient.getOwnCharacter(logicBattleModeClient);
                if (ownGameObject.isNull()) {
                    return 0;
                }

                const input = new ClientInput(ClientInputType.Movement);
                input.setXY(LogicGameObjectClient.getX(ownGameObject), LogicGameObjectClient.getY(ownGameObject));
                ClientInputManager.addInput(input);

                battleScreen.add(afkWarningOffset).writeInt(0);
                return 0;
            }

            return isAfk;
        }, 'bool', ['pointer']));

        Interceptor.replace(BattleScreen_updateSkill, new NativeCallback(function (battleScreen, gameObject, a3, a4, a5) {
            BattleScreen_updateSkill(battleScreen, gameObject, a3, a4, a5);

            BattleScreen.tickXray(battleScreen);

            const enabledFunctions = [
                Configuration.autoAim,
                Configuration.holdToShoot,
                Configuration.moveToTarget,
                Configuration.moveToAlly,
                Configuration.autoUlti,
                Configuration.autoOvercharge
            ];

            if (!enabledFunctions.includes(true)) {
                return;
            }

            // I think you can implement whatever you need here by yourself :)
        }, 'void', ['pointer', 'pointer', 'float', 'pointer', 'bool']));
    }

    static tickXray(battleScreen: NativePointer) {
        // you have to implement this by yourself.
    }

    static getIntroCameraTimeLeft() {
        return BattleScreen_getIntroCameraTimeLeft(this.getInstance());
    }

    private static isShootStickActive(battleScreen: NativePointer): boolean {
        return Boolean(battleScreen.add(shootStickActiveOffset).readU8());
    }
}


// ============================================================
// FILE: src/logic/battle/ClientInput.ts
// ============================================================
import {Libc} from "../../libs/Libc";
import {Libg} from "../../libs/Libg";

const allocSize = 60;

export const inputTypeOffset = 4;
const xOffset = 8;
const yOffset = 12;

const ClientInput_ctor = new NativeFunction( // "scid_button_tutorial", find function with 2nd arg is 12
    Libg.offset(0x985690, 0x48D210), 'void', ['pointer', 'int']
);

export class ClientInput {
    instance: NativePointer;

    get inputType(): ClientInputType {
        return this.instance.add(inputTypeOffset).readInt() as ClientInputType;
    }

    constructor(inputType: ClientInputType | number | NativePointer) {
        if (inputType instanceof NativePointer) {
            this.instance = inputType;

            return;
        }

        this.instance = Libc.malloc(allocSize);

        ClientInput_ctor(this.instance, this.inputType);
    }

    setXY(x: number, y: number) {
        this.instance.add(xOffset).writeInt(x);
        this.instance.add(yOffset).writeInt(y);
    }

    getX(): number {
        return this.instance.add(xOffset).readInt();
    }

    getY(): number {
        return this.instance.add(yOffset).readInt();
    }

    toString(): string {
        return `ClientInput{x=${this.getX()}, y=${this.getY()}, type=${ClientInput.getInputType(this.instance)}}`;
    }

    static getInputType(instance: NativePointer): number {
        return instance.add(inputTypeOffset).readInt();
    }
}

export enum ClientInputType {
    Attack = 0,
    Ulti = 1,
    Movement = 2,
    StopMovement = 3,
    EndBattle = 4,
    UltiEnable = 5,
    UltiDisable = 6,
    CarryableAim = 7,
    Accessory = 8,
    Emote = 9,
    ControlledProjectileStopWithStick = 10,
    ToggleEditing = 11,
    LeaveFromBattle = 12,
    StopHoldSkill = 13,
    StartHoldSkill = 14,
    Spray = 15,
    Overcharge = 17
}
// ============================================================
// FILE: src/logic/battle/ClientInputManager.ts
// ============================================================
import {Libg} from "../../libs/Libg";
import {ClientInput, ClientInputType} from "./ClientInput";
import {BattleMode} from "./BattleMode";
import {Configuration} from "../../gene/Configuration";
import {LogicBattleModeClient} from "./LogicBattleModeClient";
import {LogicCharacterData} from "../data/LogicCharacterData";
import {LogicVersion} from "../LogicVersion";

const ClientInputManager_addInput = new NativeFunction( // check by ClientInput ctor
    Libg.offset(0x6746D8, 0x21C2A0), 'void', ['pointer', 'pointer']
);

const pingOffset = 48;

export class ClientInputManager {
    static patch() {
        Interceptor.replace(ClientInputManager_addInput, new NativeCallback(function (manager, input) {
            const inputType = ClientInput.getInputType(input);

            if (!Configuration.showUlti && inputType == ClientInputType.UltiEnable) {
                return;
            }

            const logicBattleModeClient = BattleMode.getLogic();

            const OwnCharacter = LogicBattleModeClient.getOwnCharacter(logicBattleModeClient);

            if (!OwnCharacter.isNull()) {
                const characterDataPtr = OwnCharacter.add(16).readPointer();
                const characterData = new LogicCharacterData(characterDataPtr);

                let shouldBeControlBlocked = false;

                if (characterData.getGlobalID() === 16000053 && Configuration.lolaControlState !== 0) {
                    switch (Configuration.lolaControlState) {
                        case 1:
                            if (inputType === ClientInputType.ControlledProjectileStopWithStick) {
                                shouldBeControlBlocked = true;
                            }
                            break;
                        case 2:
                            if (inputType === ClientInputType.Movement) {
                                shouldBeControlBlocked = true;
                            }
                            break;
                    }
                }

                if (inputType === ClientInputType.Movement && Configuration.antiknockback) {
                    ClientInputManager.addInput(
                        new ClientInput(3)
                    );
                }

                if (shouldBeControlBlocked) {
                    return;
                }

                //if (Configuration.stopLolaClone && inputType == ClientInputType.ControlledProjectileStopWithStick && characterData.getGlobalID() === 16000053) { // Lola detection
                //    return;
                //}
            }

            ClientInputManager_addInput(manager, input);
        }, 'void', ['pointer', 'pointer']));
    }

    static addInput(clientInput: ClientInput): void {
        ClientInputManager_addInput(
            BattleMode.getClientInputManager(),
            clientInput.instance
        );
    }

    static getPing(instance: NativePointer): number {
        return instance.add(pingOffset).readInt();
    }
}

// ============================================================
// FILE: src/logic/battle/CombatHUD.ts
// ============================================================
import {Libg} from "../../libs/Libg";
import {Configuration} from "../../gene/Configuration";
import {LogicVersion} from "../LogicVersion";
import {UsefulInfo} from "../../gene/features/UsefulInfo";
import {ClientInputManager} from "./ClientInputManager";
import {BattleMode, BattleMode_isInTrainingCave} from "./BattleMode";
import {MovieClip} from "../../titan/flash/MovieClip";
import {StringTable} from "../data/StringTable";
import {TeamStream} from "../home/team/TeamStream";
import {DisplayObject} from "../../titan/flash/DisplayObject";
import {Constants} from "../../gene/Constants";
import {LogicDefines} from "../../LogicDefines";
import {LogicBattleModeClient} from "./LogicBattleModeClient";
import {Debug} from "../../gene/Debug";

const CombatHUD_ultiButtonActivated = new NativeFunction( // check last method of handleAutoshoot
    Libg.offset(0x4ABEF4, 0x9D1C0), 'void', ['pointer', 'bool']
);

const CombatHUD_prepareNewIntro = new NativeFunction( // "three_versus_boss"
    Libg.offset(0x47EC94, 0x76D6C), 'void', ['pointer']
);

const CombatHUD_update = new NativeFunction( // "input lat"
    Libg.offset(0x49A2C8, 0x8D398), 'void', ['pointer', 'float']
);

const CombatHUD_setupPlayerCard = new NativeFunction( // "frame_front_levels_ph" | "Must have pointer to player card to setup" end of that func (v121 = sub_10006FFFC(v13, a2, a3, a4, a5, a8, a6, a7);)
    Libg.offset(0x482E20, 0x7A5E8), 'void', ['pointer', 'pointer', 'pointer', 'pointer', 'int', 'pointer', 'pointer', 'int', 'int']
);

// const CombatHUD_CombatHUD = new NativeFunction( // "laser_screen_mask"
//     Libg.offset(0x0, 0x0), 'void', ['pointer']
// )

export const CombatHUD_shouldHaveSpectateFollowButton = new NativeFunction( // CombatHUD::CombatHUD NOTSURE
    Libg.offset(0x4957CC, 0x89704), 'bool', []
);


// not sure about it
const CombatHUD_mirrorPlayfieldOffset = Libg.offset(0x0, 0xEE6188); // upper than "train_lamp_glow_right" if ( byte_10116... == v55)
const CombatHUD_movieClip = 96;
const CombatHUD_battleIntroOffset = 720;
const BattleIntro_movieClipOffset = 328;

const CombatHUD_connectionIndicatorOffset = 800; // v61.249
const CombatHUD_txtDebugOffset = 1136; // v62.258

export class CombatHUD {
    static patch() {
        Interceptor.replace(CombatHUD_update, new NativeCallback(function (combatHud, time) {
            CombatHUD_update(combatHud, time);

            TeamStream.update(time);

            const battleDebug = Debug.getBattleDebug();
            if (battleDebug)
                battleDebug.update(time);

            if (!CombatHUD_shouldHaveSpectateFollowButton()) {
                for (const combatHudOffset of Constants.COMBATHUD_ALPHA_OFFSETS) {
                    const hudObject = combatHud.add(combatHudOffset).readPointer();
                    if (hudObject.isNull())
                        continue;

                    CombatHUD.setAlphaOnHudObject(hudObject, Configuration.opacity / 100)
                }
            }

            const connectionIndicatorClip = combatHud.add(CombatHUD_connectionIndicatorOffset).readPointer();
            if (connectionIndicatorClip) {
                connectionIndicatorClip.add(Process.pointerSize).writeU8(1);
            }

            const txtDebugClip = combatHud.add(CombatHUD_txtDebugOffset).readPointer();
            if (txtDebugClip && LogicVersion.isDeveloperBuild()) {
                txtDebugClip.add(Process.pointerSize).writeU8(1);
            }

            UsefulInfo.setBattlePing(ClientInputManager.getPing(BattleMode.getClientInputManager()));

            const intro = combatHud.add(CombatHUD_battleIntroOffset).readPointer();
            if (intro.isNull())
                return;

            const movieClip = intro.add(BattleIntro_movieClipOffset).readPointer();
            if (movieClip.isNull())
                return;

            movieClip.add(Process.pointerSize).writeU8(Configuration.hideHeroesIntro ? 0 : 1);
        }, 'void', ['pointer', 'float']));

        Interceptor.replace(CombatHUD_setupPlayerCard, new NativeCallback(function (a1, a2, a3, a4, a5, a6, a7, a8, a9) {
            if (Configuration.hideLeagueBattleCard)
                a5 = 0;

            CombatHUD_setupPlayerCard(a1, a2, a3, a4, a5, a6, a7, a8, a9);
        }, 'void', ['pointer', 'pointer', 'pointer', 'pointer', 'int', 'pointer', 'pointer', 'int', 'int']));

        Interceptor.replace(CombatHUD_prepareNewIntro, new NativeCallback(function (combatHUD) {
            CombatHUD_prepareNewIntro(combatHUD);

            const logicBattleModeClient = BattleMode.getLogic();

            if (LogicBattleModeClient.isUnderdog(logicBattleModeClient)) {
                const underdog: MovieClip = new MovieClip(combatHUD.add(CombatHUD_movieClip).readPointer()).getChildByName("underdog");
                if (underdog) {
                    underdog.visibility = true;
                    underdog.getTextFieldByName("label_txt")!.setText(StringTable.getString("TID_UNDERDOG"));
                }
            }
        }, 'void', ['pointer']));

        if (LogicDefines.isPlatformIOS()) {
            Interceptor.replace(BattleMode_isInTrainingCave, new NativeCallback(function (battleMode) {
                if (Configuration.showEditControls)
                    return 1;

                return BattleMode_isInTrainingCave(battleMode);
            }, 'bool', ['pointer']));
        }
    }

    static setAlphaOnHudObject(object: NativePointer, alpha: number) {
        try {
            console.log(alpha);
            DisplayObject.setAlpha(object, alpha);
        } catch (e) { }
    }

    static ultiButtonActivated(combatHUD: NativePointer, a2: boolean) {
        CombatHUD_ultiButtonActivated(combatHUD, Number(a2));
    }

    static mirrorPlayfield() {
        return CombatHUD_mirrorPlayfieldOffset.readU8();
    }
}


// ============================================================
// FILE: src/logic/battle/LogicAccessory.ts
// ============================================================
import {LogicData} from "../data/LogicData";

const dataOffset = 0; // dont touch its 0
const typeOffset = 24;
const cooldownTicksOffset = 16;
const cooldownOffset = 180;

export class LogicAccessory {
    instance: NativePointer;

    constructor(instance: NativePointer) {
        this.instance = instance;
    }

    static getType(accessoryPtr: NativePointer): number {
        return accessoryPtr.add(typeOffset).readInt();
    }

    static canBeUsedForDefense(accessory: NativePointer): boolean {
        const gadgetType = LogicAccessory.getType(accessory);

        const isFly = LogicData.getName(accessory.add(dataOffset).readPointer()) == "InsectMan_Fly";

        return isFly
            || gadgetType == 9 // spawn object
            || gadgetType == 1 // jump (brock, cordelius)
            || gadgetType == 4 // teleport to pet
            || gadgetType == 33 // consumable shield
            || gadgetType == 46 // dive
            || gadgetType == 48 // cocoon self
            || gadgetType == 55; // teleport to shadow realm
    }

    static getCooldownTicks(accessoryPtr: NativePointer) {
        return accessoryPtr.add(cooldownTicksOffset).readInt();
    }

    static getCooldown(accessoryPtr: NativePointer) {
        return accessoryPtr.add(cooldownOffset).readInt();
    }
}
// ============================================================
// FILE: src/logic/battle/LogicBattleModeClient.ts
// ============================================================
import {LogicVector2} from "../../gene/battle/LogicVector2";
import {ProjectileData} from "../../gene/battle/ProjectileData";
import {UsefulInfo} from "../../gene/features/UsefulInfo";
import {Libg} from "../../libs/Libg";
import {LogicMath} from "../../titan/logic/math/LogicMath";
import {LogicProjectileData} from "../data/LogicProjectileData";
import {BattleMode} from "./BattleMode";
import {ClientInput, ClientInputType} from "./ClientInput";
import {ClientInputManager} from "./ClientInputManager";
import {LogicTileMap} from "./level/LogicTileMap";
import {LogicPlayer} from "./LogicPlayer";
import {LogicCharacterClientOwn} from "./objects/LogicCharacterClientOwn";
import {LogicGameObjectManagerClient} from "./objects/LogicGameObjectManagerClient";
import {LogicProjectileClient} from "./objects/LogicProjectileClient";

const LogicBattleModeClient_getOwnCharacter = new NativeFunction( // "spray_def_atk" (not sure)
    Libg.offset(0x9C4330, 0x4B7480), 'pointer', ['pointer']
);

const LogicBattleModeClient_update = new NativeFunction( // TODO
    Libg.offset(0x0, 0x4B5EA4), 'void', ['pointer', 'float', 'float']
);

const LogicBattleModeClient_ownPlayerIndexOffset = 224;
const LogicBattleModeClient_ownPlayerTeamOffset = 228;
const LogicBattleModeClient_tileMapOffset = 248;
const LogicBattleModeClient_currentBattleStateOffset = 284;
export const LogicBattleModeClient_gameModeVariationOffset = 292;
export const LogicBattleModeClient_underdogOffset = 334;

export class LogicBattleModeClient {
    static self: LogicBattleModeClient;

    private instance: NativePointer;
    private bulletXY!: number[][];
    private tileMap: LogicTileMap;
    private ticksGone: number = 0;
    private projectileGameObjectManager: LogicGameObjectManagerClient;

    constructor(instance: NativePointer) {
        this.instance = instance;

        this.tileMap = new LogicTileMap(
            instance.add(LogicBattleModeClient_tileMapOffset).readPointer()
        );

        this.projectileGameObjectManager = new LogicGameObjectManagerClient(
            this.instance.add(40).readPointer() // todo check other values like 48 or 56
        );

        LogicBattleModeClient.self = this;
    }

    tick() {
        this.ticksGone = this.instance.add(72).readInt();

        UsefulInfo.ticks = this.ticksGone;

        if (this.isGameOver()) {
            return;
        }
    }

    getOwnPlayerTeam() {
        return LogicBattleModeClient.getOwnPlayerTeam(this.instance);
    }

    getOwnPlayer() {
        return this.getPlayer(LogicBattleModeClient.getOwnPlayerIndex(this.instance));
    }

    isGameOver() {
        return this.instance.add(LogicBattleModeClient_currentBattleStateOffset).readInt() !== -1;
    }

    findBulletXY(globalId: number): number[] | undefined {
        return this.bulletXY.find(x => x[0] == globalId);
    }

    pushBulletXY(globalId: number, x: number, y: number): void {
        this.bulletXY.push([globalId, x, y]);
    }

    getPlayer(index: number): LogicPlayer {
        return LogicBattleModeClient.getPlayer(this.instance, index);
    }

    static getPlayer(self: NativePointer, index: number): LogicPlayer {
        return new LogicPlayer(
            self.readPointer().add(Process.pointerSize * index).readPointer()
        );
    }

    static getGameObjects(logicBattleModeClient: NativePointer) {
        return logicBattleModeClient.readPointer();
    }

    static getOwnCharacter(logicBattleModeClient: NativePointer): NativePointer {
        return LogicBattleModeClient_getOwnCharacter(logicBattleModeClient);
    }

    static getOwnPlayerIndex(logicBattleModeClient: NativePointer): number {
        return logicBattleModeClient.add(LogicBattleModeClient_ownPlayerIndexOffset).readInt();
    }

    static getOwnPlayerTeam(logicBattleModeClient: NativePointer): number {
        return logicBattleModeClient.add(LogicBattleModeClient_ownPlayerTeamOffset).readInt();
    }

    static getTileMap(logicBattleModeClient: NativePointer): LogicTileMap {
        return new LogicTileMap(
            logicBattleModeClient.add(LogicBattleModeClient_tileMapOffset).readPointer()
        );
    }

    static isUnderdog(self: NativePointer): boolean {
        return Boolean(self.add(LogicBattleModeClient_underdogOffset).readU8());
    }

    static patch() {
        Interceptor.replace(LogicBattleModeClient_update, new NativeCallback(function (battleModeClient, a1, a2) {
            LogicBattleModeClient_update(battleModeClient, a1, a2);

            if (!LogicBattleModeClient.self || !LogicBattleModeClient.self.instance.equals(battleModeClient)) {
                new LogicBattleModeClient(battleModeClient);
            }

            // ain't we already

            LogicBattleModeClient.self.tick();
        }, 'void', ['pointer', 'float', 'float']));
    }
}
// ============================================================
// FILE: src/logic/battle/LogicHeroConfiguration.ts
// ============================================================
import {LogicData} from "../data/LogicData";
import {LogicHeroUpgrades} from "./LogicHeroUpgrades";

const skinOffset = 32;

const heroUpgradesOffset = 8;

export class LogicHeroConfiguration {
    static getHeroUpgrades(logicHeroConfiguration: NativePointer): NativePointer {
        return logicHeroConfiguration.add(heroUpgradesOffset).readPointer();
    }

    static getHero(logicHeroConfiguration: NativePointer): NativePointer {
        return logicHeroConfiguration.readPointer();
    }

    static getSkin(logicHeroConfiguration: NativePointer): NativePointer {
        return logicHeroConfiguration.add(skinOffset).readPointer();
    }

    static toString(logicHeroConfiguration: NativePointer): string {
        const heroName = LogicData.toLocalizedString(LogicHeroConfiguration.getHero(logicHeroConfiguration));

        const skinName = !LogicHeroConfiguration.getSkin(logicHeroConfiguration).isNull()
            ? LogicData.toLocalizedString(LogicHeroConfiguration.getSkin(logicHeroConfiguration))
            : "";

        let result = skinName.length > 0 ? `${skinName} ` : `${heroName} `;
        result += LogicHeroUpgrades.toString(this.getHeroUpgrades(logicHeroConfiguration));
        return result;
    }
}
// ============================================================
// FILE: src/logic/battle/LogicHeroUpgrades.ts
// ============================================================
import {LogicData} from "../data/LogicData";

const uniqueCardOffset = 8;
const accessoryOffset = 16;

export class LogicHeroUpgrades {
    static getHeroLevel(logicHeroUpgrades: NativePointer): number {
        return logicHeroUpgrades.readInt();
    }

    static getStarPower(logicHeroUpgrades: NativePointer): NativePointer {
        return logicHeroUpgrades.add(uniqueCardOffset).readPointer();
    }

    static getAccessory(logicHeroUpgrades: NativePointer): NativePointer {
        return logicHeroUpgrades.add(accessoryOffset).readPointer();
    }

    static toString(logicHeroUpgrades: NativePointer): string {
        let result: string = "";

        result += `Power Level: ${LogicHeroUpgrades.getHeroLevel(logicHeroUpgrades)}, `;

        if (!LogicHeroUpgrades.getStarPower(logicHeroUpgrades).isNull())
            result += ` SP: ${LogicData.toLocalizedString(LogicHeroUpgrades.getStarPower(logicHeroUpgrades))}, `;

        if (!LogicHeroUpgrades.getAccessory(logicHeroUpgrades).isNull())
            result += ` Gadget: ${LogicData.toLocalizedString(LogicHeroUpgrades.getAccessory(logicHeroUpgrades))}`;

        return result;
    }
}
// ============================================================
// FILE: src/logic/battle/LogicPlayer.ts
// ============================================================
import {GradientNickname} from "../../gene/features/GradientNickname";
import {Libg} from "../../libs/Libg";
import {HashTagCodeGenerator} from "../../titan/logic/util/HashTagCodeGenerator";
import {LogicHeroConfiguration} from "./LogicHeroConfiguration";
import {LogicPlayerTitleData} from "../data/LogicPlayerTitleData";
import {LogicDataTables} from "../data/LogicDataTables";
import {GlobalID} from "../data/GlobalID";
import {LogicCharacterData} from "../data/LogicCharacterData";

const LogicPlayer_decode = new NativeFunction( // 20559 decode
    Libg.offset(0x9EAB50, 0x4CA608), 'void', ['pointer', 'pointer']
);

export const battleCard_titleOffset = 40;
export const battleCard = 440;

const LogicPlayer_PlayerDisplayDataOffset = 448;
const logicAccessoryOffset = 280;
const playerIndexOffset = 8;
const teamIndexOffset = 12;
const characterGlobalIdOffset = 16;
const heroesOffset = 48;
const heroesCountOffset = 60;

const ultiCountOffset = 84;
const maxUltiCountOffset = 88;
const overChargeCountOffset = 100;

export class LogicPlayer {
    instance: NativePointer;

    constructor(instance: NativePointer) {
        this.instance = instance;
    }

    getAvatarId() {
        return this.instance.accountId();
    }

    getName(): string {
        return this.getPlayerDisplayData().fromsc();
    }

    getTeamIndex(): number {
        return this.instance.add(teamIndexOffset).readInt();
    }

    hasUlti() {
        return this.instance.add(ultiCountOffset).readInt() === this.instance.add(maxUltiCountOffset).readInt();
    }

    isBot() {
        return LogicPlayer.isBot(this.instance);
    }

    isOwnPlayerTeam(team: number): boolean {
        return this.getTeamIndex() == team;
    }

    getHero(index: number) {
        return this.getHeroes().add(Process.pointerSize * index).readPointer();
    }

    getHeroes() {
        return LogicPlayer.getHeroes(this.instance);
    }

    getHeroesCount() {
        return LogicPlayer.getHeroesCount(this.instance);
    }

    getHashTag() {
        return LogicPlayer.getHashTag(this.instance);
    }

    getPlayerDisplayData() {
        return LogicPlayer.getPlayerDisplayData(this.instance);
    }

    getCharacterData(index: number) {
        return new LogicCharacterData(this.getHero(index).readPointer());
    }

    getPlayerIndex(): number {
        return LogicPlayer.getPlayerIndex(this.instance);
    }

    getCharacterGlobalId(): number {
        return LogicPlayer.getCharacterGlobalId(this.instance);
    }

    getTitle() {
        return LogicPlayer.getTitle(this.instance);
    }

    setTitle(dataRef: NativePointer) {
        LogicPlayer.setTitle(this.instance, dataRef);
    }

    setName(name: string) {
        this.getPlayerDisplayData().scptr(name);
    }

    toString(): string {
        let result = `• ${this.getName()} (#${this.getHashTag()}) `;
        let heroesCount = this.getHeroesCount();
        if (heroesCount > 1) {
            result += "\n    ";
        }

        for (let index = 0; index < this.getHeroesCount(); index++) {
            if (index > 0) {
                result += "\n    ";
            }
            const hero = this.getHero(index);
            result += LogicHeroConfiguration.toString(hero);
        }

        return result;
    }

    static patch() {
        const self = this;

        Interceptor.replace(LogicPlayer_decode, new NativeCallback(function (logicPlayer, byteStream) {
            LogicPlayer.decode(logicPlayer, byteStream);

            const playerTag = HashTagCodeGenerator.toCode(logicPlayer);
            if (logicPlayer.add(battleCard).readPointer().isNull())
                return;

            const playerDisplayData = self.getPlayerDisplayData(logicPlayer);

            if (GradientNickname.doPlayerHaveTitle(playerTag)) {
                let dataRef = new LogicPlayerTitleData(LogicDataTables.getByGlobalId(GlobalID.createGlobalID(76, 83)));

                self.setTitle(logicPlayer, dataRef.instance);

                const instanceId = 1000 + GradientNickname.getPlayerTitleIndex(playerTag);
                dataRef.setGlobalID(GlobalID.createGlobalID(76, instanceId));
            }

            GradientNickname.setPlayerGradient(playerTag, playerDisplayData);
        }, 'void', ['pointer', 'pointer']));
    }

    static decode(logicPlayer: NativePointer, ByteStream: NativePointer) {
        LogicPlayer_decode(logicPlayer, ByteStream);
    }

    static getAvatarId(logicPlayer: NativePointer) {
        return logicPlayer.accountId();
    }

    static getName(logicPlayer: NativePointer): string {
        return LogicPlayer.getPlayerDisplayData(logicPlayer).fromsc();
    }

    static hasUlti(logicPlayer: NativePointer): boolean {
        return logicPlayer.add(ultiCountOffset).readInt() == logicPlayer.add(maxUltiCountOffset).readInt();
    }

    static hasOvercharge(logicPlayer: NativePointer): boolean {
        return logicPlayer.add(overChargeCountOffset).readInt() == logicPlayer.add(maxUltiCountOffset).readInt();
    }

    static isBot(logicPlayer: NativePointer) {
        return this.getName(logicPlayer).length == 1;
    }

    static getCharacterGlobalId(logicPlayer: NativePointer): number {
        return logicPlayer.add(characterGlobalIdOffset).readInt();
    }

    static getHashTag(logicPlayer: NativePointer) {
        return LogicPlayer.isBot(logicPlayer) ? "0" : HashTagCodeGenerator.toCode(logicPlayer);
    }

    static getHeroes(logicPlayer: NativePointer) {
        return logicPlayer.add(heroesOffset).readPointer();
    }

    static getHeroesCount(logicPlayer: NativePointer) {
        return logicPlayer.add(heroesCountOffset).readInt();
    }

    static getHero(logicPlayer: NativePointer, index: number) {
        return LogicPlayer.getHeroes(logicPlayer).add(Process.pointerSize * index).readPointer();
    }

    static getPlayerDisplayData(logicPlayer: NativePointer): NativePointer {
        return logicPlayer.add(battleCard).readPointer().readPointer();
    }

    static getTitle(logicPlayer: NativePointer): NativePointer {
        return logicPlayer.add(battleCard).readPointer().add(battleCard_titleOffset).readPointer();
    }

    static setTitle(logicPlayer: NativePointer, title: NativePointer) {
        logicPlayer.add(battleCard).readPointer().add(battleCard_titleOffset).writePointer(title);
    }

    static toString(logicPlayer: NativePointer): string {
        let result: string = `• ${this.getName(logicPlayer)} (#${HashTagCodeGenerator.toCode(logicPlayer)}) `;

        const heroes = this.getHeroes(logicPlayer);

        for (let j = 0; j < logicPlayer.add(heroesCountOffset).readInt(); j++) {
            const hero = heroes.add(Process.pointerSize * j).readPointer();
            result += LogicHeroConfiguration.toString(hero);
        }

        return result;
    }

    static getPlayerIndex(playerPtr: NativePointer) {
        return playerPtr.add(playerIndexOffset).readInt();
    }

    getAccessory() {
        return this.instance.add(logicAccessoryOffset).readPointer();
    }

    static getAccessory(playerPtr: NativePointer) {
        return playerPtr.add(logicAccessoryOffset).readPointer();
    }
}
// ============================================================
// FILE: src/logic/battle/component/LogicSkillClient.ts
// ============================================================
const dataOffset = 0; // dont touch its 0

export class LogicSkillClient {
    public static chargeOffset: number = 28;
}
// ============================================================
// FILE: src/logic/battle/level/LogicTileMap.ts
// ============================================================
import {Libg} from "../../../libs/Libg";
import {LogicTileData} from "../../data/LogicTileData";

const LogicTileMap_getTile = new NativeFunction(
    Libg.offset(0x840184, 0x39B090), 'pointer', ['pointer', 'int', 'int'] // "sc3d/poison_tile_geo.glb"  upper v292 = *(sub_XXXXX(v265, a3, a4) + 92); if ( v292 <= 9 )
);

const mapWidthOffset = 196; // 208?
const mapHeightOffset = 200;

export class LogicTileMap {
    private readonly instance: NativePointer;

    constructor(instance: NativePointer) {
        this.instance = instance;
    }

    getMapHeight(): number {
        return this.instance.add(mapHeightOffset).readInt();
    }

    getMapWidth(): number {
        return this.instance.add(mapWidthOffset).readInt();
    }

    getTile(x: number, y: number) {
        return new LogicTileData(
            LogicTileMap_getTile(this.instance, x, y)
        );
    }
}
// ============================================================
// FILE: src/logic/battle/objects/Character.ts
// ============================================================
import {Configuration} from "../../../gene/Configuration";
import {Libg} from "../../../libs/Libg";
import {LogicCharacterData} from "../../data/LogicCharacterData";
import {GameObject} from "./GameObject";
import {LogicCharacterClient} from "./LogicCharacterClient";

const Character_updateHealthBar = new NativeFunction(
    Libg.offset(0x43864C, 0x3AA8C), 'void', ['pointer', 'float'] // "hpNumber"
);

const ImpostorMaterial_bind = new NativeFunction(
    Libg.offset(0x465A14, 0x61410), 'void', [ 'pointer', 'int', 'pointer' ]
)

// setaddcolor 0x912FB0 setmulcolor 0x912F2C

const ammoBarOffset = 2544;
const shaderOutlineOffset = 848

export class Character extends GameObject {
    constructor(instance: NativePointer) {
        super(instance)
    }

    getLogicCharacter() {
        return new LogicCharacterClient(
            this.getGameObject().getLogic()
        );
    }

    getCharacterData() {
        return new LogicCharacterData(
            this.instance.add(12).readPointer()
        );
    }

    toString() {
        const logicCharacter = this.getLogicCharacter(); // For test

        return `Character(index=${logicCharacter.getPlayerIndex()})`;
    }

    static patch() {
        let self = NULL
        Interceptor.replace(ImpostorMaterial_bind, new NativeCallback((material, type, value) => {
            if (!Configuration.drawOutline) {
                material.add(868).writeInt(5)
            }

            ImpostorMaterial_bind(material, type, value)
        }, 'void', ['pointer', 'int', 'pointer']))

        Interceptor.replace(Character_updateHealthBar, new NativeCallback(function(character, time) {
            Character_updateHealthBar(character, time)

            if (Configuration.showEnemyAmmo) {
                const ammoBar = character.add(ammoBarOffset).readPointer();
                if (!ammoBar.isNull())
                    ammoBar.add(Process.pointerSize).writeU8(1);
            }
        }, 'void', ['pointer', 'float']));
    }
}

// ============================================================
// FILE: src/logic/battle/objects/GameObject.ts
// ============================================================

const logicOffset = 16;

export class GameObject {
    instance: NativePointer;

    constructor(instance: NativePointer) {
        this.instance = instance;
    }

    getLogic() {
        return this.instance.add(logicOffset).readPointer();
    }

    getGameObject() {
        return new GameObject(
            this.instance.add(logicOffset).readPointer()
        );
    }

    getPlayerIndex() {
        return this.instance.add(8).readPointer().add(60).readInt();
    }

    static getLogic(instance: NativePointer): NativePointer {
        return instance.add(logicOffset).readPointer();
    }
}
// ============================================================
// FILE: src/logic/battle/objects/LogicAreaEffectClient.ts
// ============================================================
import {LogicGameObjectClient} from "./LogicGameObjectClient";

export class LogicAreaEffectClient extends LogicGameObjectClient {
    
}
// ============================================================
// FILE: src/logic/battle/objects/LogicCharacterClient.ts
// ==============