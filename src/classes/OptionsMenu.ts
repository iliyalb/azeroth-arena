import { GameSettings } from '../config/settings';

export class OptionsMenu {
  private container: HTMLDivElement;
  private settings: GameSettings;

  constructor(onBack: () => void) {
    this.settings = GameSettings.getInstance();
    this.container = document.createElement('div');
    this.container.style.cssText = `
      position: fixed;
      left: 40px;
      top: 50%;
      transform: translateY(-50%) translateY(-20px);
      display: flex;
      flex-direction: column;
      gap: 20px;
      min-width: 300px;
      opacity: 0;
      transition: opacity 0.3s ease, transform 0.7s ease;
    `;

    const createSlider = (
      label: string,
      value: number,
      onChange: (value: number) => void,
      min: number = 0,
      max: number = 1,
      step: number = 0.01
    ) => {
      const container = document.createElement('div');
      container.style.cssText = `
        background: rgba(0, 0, 0, 0.7);
        padding: 15px;
        border: 2px solid white;
        color: white;
      `;

      const labelElement = document.createElement('div');
      labelElement.textContent = label;
      labelElement.style.marginBottom = '10px';

      const slider = document.createElement('input');
      slider.type = 'range';
      slider.min = min.toString();
      slider.max = max.toString();
      slider.step = step.toString();
      slider.value = value.toString();
      slider.style.width = '100%';

      const valueDisplay = document.createElement('div');
      valueDisplay.textContent = value.toFixed(2);
      valueDisplay.style.textAlign = 'right';

      slider.addEventListener('input', () => {
        const newValue = parseFloat(slider.value);
        onChange(newValue);
        valueDisplay.textContent = newValue.toFixed(2);
      });

      container.appendChild(labelElement);
      container.appendChild(slider);
      container.appendChild(valueDisplay);
      return container;
    };

    // Music Volume Slider
    this.container.appendChild(
      createSlider('Music Volume', this.settings.musicVolume, (value) => {
        this.settings.musicVolume = value;
      })
    );

    // SFX Volume Slider
    this.container.appendChild(
      createSlider('SFX Volume', this.settings.sfxVolume, (value) => {
        this.settings.sfxVolume = value;
      })
    );

    // FOV Slider
    this.container.appendChild(
      createSlider('Field of View', this.settings.fov, (value) => {
        this.settings.fov = value;
      }, 60, 120, 1)
    );

    // Back Button
    const backButton = document.createElement('div');
    backButton.textContent = 'Back';
    backButton.style.cssText = `
      padding: 15px 30px;
      font-size: 24px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      border: 2px solid white;
      cursor: pointer;
      text-align: center;
      margin-top: 20px;
      transition: background-color 0.3s ease;
    `;

    backButton.addEventListener('mouseover', () => {
      backButton.style.background = 'rgba(255, 255, 255, 0.2)';
    });

    backButton.addEventListener('mouseout', () => {
      backButton.style.background = 'rgba(0, 0, 0, 0.7)';
    });

    backButton.addEventListener('click', onBack);
    this.container.appendChild(backButton);
  }

  public show(): void {
    document.body.appendChild(this.container);
    requestAnimationFrame(() => {
      this.container.style.opacity = '1'; // Fade in
      this.container.style.transform = 'translateY(-50%)'; // Move to original position
    });
  }

  public hide(): void {
    this.container.style.opacity = '0'; // Fade out
    this.container.style.transform = 'translateY(-50%) translateY(-20px)'; // Move to hidden position 
    setTimeout(() => {
      this.container.remove();
    }, 300); // Match the transition duration
  }
} 