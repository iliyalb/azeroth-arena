import * as THREE from 'three';
import { GameScene } from './classes/GameScene';
import { OptionsMenu } from './classes/OptionsMenu';
import { CreditsScreen } from './classes/CreditsScreen';
import { GameSettings } from './config/settings';

class ThreeScene {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private cube: THREE.Mesh;

  constructor(container: HTMLElement) {
    // Create scene
    this.scene = new THREE.Scene();

    // Set up camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;

    // Set up renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(this.renderer.domElement);

    // Create a cube
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);

    // Add lights
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    this.scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x404040);
    this.scene.add(ambientLight);

    // Handle window resize
    window.addEventListener('resize', this.onWindowResize.bind(this));

    // Start animation loop
    this.animate();
  }

  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private animate(): void {
    requestAnimationFrame(this.animate.bind(this));

    // Rotate the cube
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;

    this.renderer.render(this.scene, this.camera);
  }
}

class MenuSystem {
  private splashScreen: HTMLImageElement = document.createElement('img');
  private menuVideo: HTMLVideoElement = document.createElement('video');
  private menuContainer: HTMLDivElement = document.createElement('div');
  private buttons: HTMLDivElement = document.createElement('div');
  private content: HTMLElement;
  private gameScene: GameScene | null = null;
  private optionsMenu: OptionsMenu | null = null;
  private creditsScreen: CreditsScreen | null = null;
  private settings: GameSettings;

  constructor() {
    this.content = document.getElementById('content') as HTMLElement;
    if (!this.content) throw new Error('Content element not found');
    this.settings = GameSettings.getInstance();
    this.initializeSplashScreen();
  }

  private initializeSplashScreen(): void {
    // Create splash screen
    this.splashScreen.src = '/azeroth-arena/assets/menu.jpg';
    this.splashScreen.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: 1000;
      opacity: 1;
      transition: opacity 1s ease;
    `;
    this.content.appendChild(this.splashScreen);

    // Create menu container
    this.menuContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 999;
      opacity: 0;
      transition: opacity 1s ease;
    `;
    this.content.appendChild(this.menuContainer);

    // Create video background
    this.menuVideo.src = '/azeroth-arena/assets/menu.mp4';
    this.menuVideo.loop = true;
    this.menuVideo.muted = true;
    this.menuVideo.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    `;
    this.menuContainer.appendChild(this.menuVideo);

    // Create buttons container
    this.buttons.style.cssText = `
      position: fixed;
      left: 40px;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      flex-direction: column;
      gap: 20px;
      opacity: 0;
      transition: opacity 1s ease;
    `;
    this.menuContainer.appendChild(this.buttons);

    // Create menu buttons
    const buttonStyles = `
      padding: 15px 30px;
      font-size: 24px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      border: 2px solid white;
      cursor: pointer;
      transition: background-color 0.3s ease;
      min-width: 200px;
      text-align: center;
    `;

    ['New Game', 'Options', 'Credits', 'Quit'].forEach((text, index) => {
      const button = document.createElement('div');
      button.textContent = text;
      button.style.cssText = buttonStyles;
      if (text === 'Quit') {
        button.style.marginTop = '40px';
      }

      button.addEventListener('mouseover', () => {
        button.style.background = 'rgba(255, 255, 255, 0.2)';
      });

      button.addEventListener('mouseout', () => {
        button.style.background = 'rgba(0, 0, 0, 0.7)';
      });

      button.addEventListener('click', () => {
        switch (text) {
          case 'New Game':
            this.startGame();
            break;
          case 'Options':
            this.showOptions();
            break;
          case 'Credits':
            this.showCredits();
            break;
          case 'Quit':
            window.close();
            break;
        }
      });

      this.buttons.appendChild(button);
    });

    // Load video and handle transitions
    this.menuVideo.addEventListener('loadeddata', () => {
      // Fade out splash screen
      setTimeout(() => {
        this.splashScreen.style.opacity = '0';
        this.menuContainer.style.opacity = '1';
        this.menuVideo.play();
        
        // Remove splash screen after fade
        setTimeout(() => {
          this.splashScreen.remove();
          this.buttons.style.opacity = '1';
        }, 1000);
      }, 1000);
    });
  }

  private showMainMenu(): void {
    if (this.optionsMenu) {
      this.optionsMenu.hide();
      this.optionsMenu = null;
    }
    if (this.creditsScreen) {
      this.creditsScreen.hide();
      this.creditsScreen = null;
    }
    this.menuContainer.style.opacity = '1';
    this.buttons.style.opacity = '1';
  }

  private startGame(): void {
    this.menuContainer.style.opacity = '0';
    
    setTimeout(() => {
      this.menuContainer.style.display = 'none';
      this.gameScene = new GameScene(this.content);
    }, 700);
  }

  private showOptions(): void {
    this.buttons.style.opacity = '0';
    
    setTimeout(() => {
      this.optionsMenu = new OptionsMenu(() => {
        this.optionsMenu?.hide();
        this.optionsMenu = null;
        this.buttons.style.opacity = '1';
      });
      this.optionsMenu.show();
    }, 300);
  }

  private showCredits(): void {
    this.buttons.style.opacity = '0';
    
    setTimeout(() => {
      this.creditsScreen = new CreditsScreen(() => {
        this.creditsScreen?.hide();
        this.creditsScreen = null;
        this.buttons.style.opacity = '1';
      });
      this.creditsScreen.show();
    }, 750);
  }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  new MenuSystem();
}); 