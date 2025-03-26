export class GameSettings {
  private static instance: GameSettings;
  private _musicVolume: number = 0.5;
  private _sfxVolume: number = 0.5;
  private _fov: number = 75;

  private constructor() {}

  public static getInstance(): GameSettings {
    if (!GameSettings.instance) {
      GameSettings.instance = new GameSettings();
    }
    return GameSettings.instance;
  }

  get musicVolume(): number { return this._musicVolume; }
  set musicVolume(value: number) { this._musicVolume = Math.max(0, Math.min(1, value)); }

  get sfxVolume(): number { return this._sfxVolume; }
  set sfxVolume(value: number) { this._sfxVolume = Math.max(0, Math.min(1, value)); }

  get fov(): number { return this._fov; }
  set fov(value: number) { this._fov = Math.max(60, Math.min(120, value)); }
} 