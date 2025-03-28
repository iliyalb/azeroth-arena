import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/addons/loaders/GLTFLoader.js';
import { OptionsMenu } from './classes/OptionsMenu';
import { CreditsScreen } from './classes/CreditsScreen';
import { GameSettings } from './config/settings';

class ThreeScene {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private character: THREE.Group | null = null;
  private moveSpeed: number = 0.1;
  private keys: { [key: string]: boolean } = {};
  private ground: THREE.Mesh;
  private settings: GameSettings;

  constructor(container: HTMLElement, settings: GameSettings) {
    this.settings = settings;
    // Create scene
    this.scene = new THREE.Scene();

    // Set up camera
    this.camera = new THREE.PerspectiveCamera(
      this.settings.fov,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 2, 5);
    this.camera.lookAt(0, 0, 0);

    // Set up renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(this.renderer.domElement);

    // Create ground plane
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x808080,
      roughness: 0.8,
      metalness: 0.2
    });
    this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
    this.ground.rotation.x = -Math.PI / 2;
    this.scene.add(this.ground);

    // Add point light
    const pointLight = new THREE.PointLight(0xffffff, 100, 1000);
    pointLight.position.set(0, 5, 0);
    this.scene.add(pointLight);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040);
    this.scene.add(ambientLight);

    // Load character model
    const loader = new GLTFLoader();
    loader.load(
      'assets/character/paladin.nordstorm.glb',
      (gltf: GLTF) => {
        this.character = gltf.scene;
        if (this.character) {
          this.scene.add(this.character);
          // Center the character on the ground
          this.character.position.y = 0;
          // Rotate the character to face the other way
          this.character.rotation.y = Math.PI;
        }
      },
      undefined,
      (error: unknown) => {
        console.error('Error loading character:', error);
      }
    );

    // Set up keyboard controls
    window.addEventListener('keydown', (event) => {
      this.keys[event.key.toLowerCase()] = true;
    });

    window.addEventListener('keyup', (event) => {
      this.keys[event.key.toLowerCase()] = false;
    });

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

  private updateCharacterMovement(): void {
    if (!this.character) return;

    const moveSpeed = this.moveSpeed;
    const character = this.character;

    if (this.keys['w']) character.position.z -= moveSpeed;
    if (this.keys['s']) character.position.z += moveSpeed;
    if (this.keys['a']) character.position.x -= moveSpeed;
    if (this.keys['d']) character.position.x += moveSpeed;

    // Update camera position to follow character
    const cameraOffset = new THREE.Vector3(0, 2, 5);
    this.camera.position.copy(character.position).add(cameraOffset);
    this.camera.lookAt(character.position);
  }

  private animate(): void {
    requestAnimationFrame(this.animate.bind(this));
    this.updateCharacterMovement();
    this.renderer.render(this.scene, this.camera);
  }
}

class MenuSystem {
  private splashScreen: HTMLImageElement = document.createElement('img');
  private menuVideo: HTMLVideoElement = document.createElement('video');
  private menuContainer: HTMLDivElement = document.createElement('div');
  private buttons: HTMLDivElement = document.createElement('div');
  private content: HTMLElement;
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
    this.splashScreen.src = 'assets/menu.jpg';
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
    this.menuVideo.src = 'assets/menu.mp4';
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

    ['New Game', 'Options', 'Credits', 'Quit'].forEach((text, _index) => {
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

  private startGame(): void {
    this.menuContainer.style.opacity = '0';
    
    setTimeout(() => {
      this.menuContainer.style.display = 'none';
      new ThreeScene(this.content, this.settings);
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