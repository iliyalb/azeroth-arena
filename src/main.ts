import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';
import { OptionsMenu } from './classes/OptionsMenu';
import { CreditsScreen } from './classes/CreditsScreen';
import { GameSettings } from './config/settings';

class ThreeScene {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private character: THREE.Group | null = null;
  private moveSpeed: number = 0.1;
  private keys: { [key: string]: boolean } = {};
  private ground!: THREE.Mesh;
  private settings: GameSettings;
  private loadingScreen!: HTMLDivElement;
  private loadingProgress!: HTMLDivElement;
  private loadingText!: HTMLDivElement;
  private assetsLoaded: number = 0;
  private totalAssets: number = 3; // skybox, grass texture, character model

  constructor(container: HTMLElement, settings: GameSettings) {
    this.settings = settings;
    this.createLoadingScreen(container);
    this.loadAssets(container);
  }

  private createLoadingScreen(container: HTMLElement): void {
    this.loadingScreen = document.createElement('div');
    this.loadingScreen.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    `;

    this.loadingText = document.createElement('div');
    this.loadingText.style.cssText = `
      color: white;
      font-size: 24px;
      margin-bottom: 20px;
      font-family: Arial, sans-serif;
    `;
    this.loadingText.textContent = 'Loading...';

    this.loadingProgress = document.createElement('div');
    this.loadingProgress.style.cssText = `
      width: 300px;
      height: 20px;
      background: rgba(255, 255, 255, 0.1);
      border: 2px solid white;
      border-radius: 10px;
      overflow: hidden;
    `;

    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
      width: 0%;
      height: 100%;
      background: white;
      transition: width 0.3s ease;
    `;
    this.loadingProgress.appendChild(progressBar);

    this.loadingScreen.appendChild(this.loadingText);
    this.loadingScreen.appendChild(this.loadingProgress);
    container.appendChild(this.loadingScreen);
  }

  private updateLoadingProgress(progress: number, assetName: string): void {
    const progressBar = this.loadingProgress.firstChild as HTMLDivElement;
    progressBar.style.width = `${progress * 100}%`;
    this.loadingText.textContent = `Loading ${assetName}... ${Math.round(progress * 100)}%`;
  }

  private loadAssets(container: HTMLElement): void {
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
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;
    container.appendChild(this.renderer.domElement);

    // Load skybox
    const exrLoader = new EXRLoader();
    exrLoader.load(
      'assets/skybox/kloppenheim_02_puresky_1k.exr',
      (texture) => {
        this.scene.background = texture;
        this.assetLoaded('Skybox');
      },
      undefined,
      (error) => {
        console.error('Error loading skybox:', error);
        this.assetLoaded('Skybox');
      }
    );

    // Load grass texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      'assets/texture/grass.png',
      (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(10, 10);
        this.createGround(texture);
        this.assetLoaded('Ground Texture');
      },
      undefined,
      (error) => {
        console.error('Error loading grass texture:', error);
        this.assetLoaded('Ground Texture');
      }
    );

    // Load character model
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      'assets/character/paladin.nordstorm.glb',
      (gltf) => {
        this.character = gltf.scene;
        if (this.character) {
          this.scene.add(this.character);
          this.character.position.y = 0;
          this.character.rotation.y = Math.PI;
          this.character.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
        }
        this.assetLoaded('Character Model');
      },
      undefined,
      (error) => {
        console.error('Error loading character:', error);
        this.assetLoaded('Character Model');
      }
    );

    // Set up lights and other scene elements
    this.setupLights();
    this.setupControls();
  }

  private createGround(texture: THREE.Texture): void {
    const groundGeometry = new THREE.PlaneGeometry(50, 50);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      map: texture,
      roughness: 0.8,
      metalness: 0.2
    });
    this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
    this.ground.rotation.x = -Math.PI / 2;
    this.scene.add(this.ground);
  }

  private setupLights(): void {
    const sunLight = new THREE.DirectionalLight(0xffffff, 1);
    sunLight.position.set(5, 5, 5);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 50;
    sunLight.shadow.camera.left = -10;
    sunLight.shadow.camera.right = 10;
    sunLight.shadow.camera.top = 10;
    sunLight.shadow.camera.bottom = -10;
    this.scene.add(sunLight);

    const pointLight = new THREE.PointLight(0xffffff, 100, 1000);
    pointLight.position.set(0, 5, 0);
    this.scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0x404040);
    this.scene.add(ambientLight);

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  private setupControls(): void {
    window.addEventListener('keydown', (event) => {
      this.keys[event.key.toLowerCase()] = true;
    });

    window.addEventListener('keyup', (event) => {
      this.keys[event.key.toLowerCase()] = false;
    });

    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  private assetLoaded(assetName: string): void {
    this.assetsLoaded++;
    this.updateLoadingProgress(this.assetsLoaded / this.totalAssets, assetName);

    if (this.assetsLoaded === this.totalAssets) {
      setTimeout(() => {
        this.loadingScreen.style.opacity = '0';
        setTimeout(() => {
          this.loadingScreen.remove();
          this.animate();
        }, 500);
      }, 500);
    }
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