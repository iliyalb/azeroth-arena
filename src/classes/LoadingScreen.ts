export class LoadingScreen {
  private container: HTMLDivElement;
  private progressBar: HTMLDivElement;
  private progressText: HTMLDivElement;

  constructor() {
    this.container = document.createElement('div');
    this.container.style.cssText = `
      position: fixed;
      bottom: 40px;
      left: 50%;
      transform: translateX(-50%);
      width: 300px;
      height: 30px;
      background: rgba(0, 0, 0, 0.7);
      border: 2px solid white;
      z-index: 1000;
    `;

    this.progressBar = document.createElement('div');
    this.progressBar.style.cssText = `
      width: 0%;
      height: 100%;
      background: rgba(255, 255, 255, 0.7);
      transition: width 0.3s ease;
    `;
    this.container.appendChild(this.progressBar);

    this.progressText = document.createElement('div');
    this.progressText.style.cssText = `
      position: absolute;
      width: 100%;
      text-align: center;
      color: white;
      font-size: 14px;
      line-height: 26px;
      font-family: Arial, sans-serif;
    `;
    this.container.appendChild(this.progressText);
  }

  public show(): void {
    document.body.appendChild(this.container);
  }

  public hide(): void {
    this.container.remove();
  }

  public updateProgress(progress: number, text?: string): void {
    const percentage = Math.min(100, Math.max(0, progress * 100));
    this.progressBar.style.width = `${percentage}%`;
    this.progressText.textContent = text || `Loading... ${Math.round(percentage)}%`;
  }
} 