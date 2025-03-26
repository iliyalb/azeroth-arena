export class CreditsScreen {
  private container: HTMLDivElement;
  private content: HTMLDivElement;
  private animationFrame: number | null = null;
  private startTime: number = 0;
  private creditsText: string = '';

  constructor(onBack: () => void) {
    this.container = document.createElement('div');
    this.container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      font-family: Arial, sans-serif;
      overflow: hidden;
      z-index: 1000;
    `;

    this.content = document.createElement('div');
    this.content.style.cssText = `
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      width: 80%;
      max-width: 800px;
      text-align: center;
      white-space: pre-wrap;
      font-size: 20px;
      line-height: 1.6;
    `;
    this.container.appendChild(this.content);

    // Back button
    const backButton = document.createElement('div');
    backButton.textContent = 'Back';
    backButton.style.cssText = `
      position: fixed;
      top: 20px;
      left: 20px;
      padding: 10px 20px;
      font-size: 18px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      border: 2px solid white;
      cursor: pointer;
      z-index: 1001;
      transition: background-color 0.3s ease;
    `;

    backButton.addEventListener('mouseover', () => {
      backButton.style.background = 'rgba(255, 255, 255, 0.2)';
    });

    backButton.addEventListener('mouseout', () => {
      backButton.style.background = 'rgba(0, 0, 0, 0.7)';
    });

    backButton.addEventListener('click', () => {
      this.stopScrolling();
      onBack();
    });

    this.container.appendChild(backButton);
  }

  private async loadCredits(): Promise<void> {
    try {
      const response = await fetch('assets/credits.txt');
      this.creditsText = await response.text();
      this.content.textContent = this.creditsText;
      this.content.style.top = '100%';
    } catch (error) {
      console.error('Failed to load credits:', error);
      this.creditsText = 'Error loading credits.';
      this.content.textContent = this.creditsText;
    }
  }

  private startScrolling(): void {
    this.startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - this.startTime;
      const scrollPosition = -elapsed * 0.03; // Adjust speed by changing this value
      this.content.style.transform = `translateX(-50%) translateY(${scrollPosition}px)`;

      // Check if credits have scrolled completely
      const contentHeight = this.content.offsetHeight;
      const windowHeight = window.innerHeight;
      if (Math.abs(scrollPosition) > contentHeight + windowHeight) {
        this.startTime = performance.now(); // Reset for loop
      }

      this.animationFrame = requestAnimationFrame(animate);
    };

    this.animationFrame = requestAnimationFrame(animate);
  }

  private stopScrolling(): void {
    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  public async show(): Promise<void> {
    document.body.appendChild(this.container);
    await this.loadCredits();
    this.startScrolling();
  }

  public hide(): void {
    this.stopScrolling();
    this.container.remove();
  }
} 