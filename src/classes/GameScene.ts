import * as THREE from 'three';
import { GameSettings } from '../config/settings';
import { LoadingScreen } from './LoadingScreen';

export class GameScene {
  private scene: THREE.Scene = new THREE.Scene();
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private cube!: THREE.Mesh;
  private settings: GameSettings;
  private loadingScreen: LoadingScreen;
  private loadingManager!: THREE.LoadingManager;

  constructor(container: HTMLElement) {
    this.settings = GameSettings.getInstance();
    this.loadingScreen = new LoadingScreen();
    this.setupLoadingManager();
    this.initializeScene(container);
  }

  private setupLoadingManager(): void {
    this.loadingManager = new THREE.LoadingManager();
    
    this.loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      const progress = itemsLoaded / itemsTotal;
      this.loadingScreen.updateProgress(progress);
    };

    this.loadingManager.onLoad = () => {
      setTimeout(() => {
        this.loadingScreen.hide();
        this.startAnimation();
      }, 500);
    };

    this.loadingManager.onError = (url) => {
      console.error('Error loading:', url);
    };
  }

  private initializeScene(container: HTMLElement): void {
    this.loadingScreen.show();

    // Set up camera with FOV from settings
    this.camera = new THREE.PerspectiveCamera(
      this.settings.fov,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;

    // Set up renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(this.renderer.domElement);

    // Load assets (simulated for demo)
    this.loadAssets();

    // Handle window resize
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  private loadAssets(): void {
    // Create a cube (for demo purposes)
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

    // Simulate loading time (remove this in production)
    setTimeout(() => {
      this.loadingManager.onLoad();
    }, 2000);
  }

  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private startAnimation(): void {
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate the cube
      this.cube.rotation.x += 0.01;
      this.cube.rotation.y += 0.01;

      this.renderer.render(this.scene, this.camera);
    };

    animate();
  }

  public updateFOV(fov: number): void {
    this.camera.fov = fov;
    this.camera.updateProjectionMatrix();
  }

  public dispose(): void {
    // Clean up resources
    this.scene.clear();
    this.renderer.dispose();
    window.removeEventListener('resize', this.onWindowResize.bind(this));
  }
} 