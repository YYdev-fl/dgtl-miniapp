import { ImageEntity } from "./entities/ImageEntity";
import { MINERALS, GAME_DURATION, SPAWN_INTERVAL, BASE_HEIGHT, MIN_SPEED, MAX_SPEED } from "./constants/gameData";
import { getRandomMineral } from "./utils/helper";

interface CollectedMinerals {
    [imageSrc: string]: {
        count: number;
        value: number; 
    }
}

interface GameCallbacks {
    onScoreUpdate?: (score: number) => void;
    onTimeLeftUpdate?: (timeLeft: number) => void;
    onGameOver?: (totalCollectedValue: number, collectedMinerals: CollectedMinerals) => void;
}

export class Game {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    offscreenCanvas: HTMLCanvasElement;
    offscreenContext: CanvasRenderingContext2D;
    windowWidth: number;
    windowHeight: number;
    entities: ImageEntity[] = [];
    score: number = 0;
    gameTime: number = GAME_DURATION;
    spawnTimer: NodeJS.Timeout | null = null;
    gameTimer: NodeJS.Timeout | null = null;
    lastUpdateTime: number = 0;
    doublePointsActive: boolean = false;

    // Track collected minerals
    collectedMinerals: CollectedMinerals = {};

    onScoreUpdate?: (score: number) => void;
    onTimeLeftUpdate?: (timeLeft: number) => void;
    onGameOver?: (totalCollectedValue: number, collectedMinerals: CollectedMinerals) => void;

    constructor(canvas: HTMLCanvasElement, callbacks: GameCallbacks = {}) {
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d")!;
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;

        this.onScoreUpdate = callbacks.onScoreUpdate;
        this.onTimeLeftUpdate = callbacks.onTimeLeftUpdate;
        this.onGameOver = callbacks.onGameOver;

        // Create offscreen canvas
        this.offscreenCanvas = document.createElement("canvas");
        this.offscreenCanvas.width = this.windowWidth;
        this.offscreenCanvas.height = this.windowHeight;
        this.offscreenContext = this.offscreenCanvas.getContext("2d")!;

        this.setupCanvas();
        this.setupEventListeners();
    }

    setupCanvas() {
        this.canvas.style.background = "#000";
        this.canvas.width = this.windowWidth;
        this.canvas.height = this.windowHeight;
    }

    setupEventListeners() {
        this.canvas.addEventListener("pointerdown", (event: PointerEvent) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = (event.clientX - rect.left) * (this.canvas.width / rect.width);
            const mouseY = (event.clientY - rect.top) * (this.canvas.height / rect.height);

            // Check top-most entity
            for (let i = this.entities.length - 1; i >= 0; i--) {
                if (this.entities[i].isClicked(mouseX, mouseY)) {
                    const entity = this.entities[i];
                    this.score += this.doublePointsActive ? entity.points * 2 : entity.points;
                    // Track collected minerals
                    const imgSrc = entity.image.src;
                    if (!this.collectedMinerals[imgSrc]) {
                        this.collectedMinerals[imgSrc] = { count: 0, value: entity.points };
                    }
                    this.collectedMinerals[imgSrc].count += 1;

                    this.entities.splice(i, 1);

                    // Call score update callback
                    if (this.onScoreUpdate) {
                        this.onScoreUpdate(this.score);
                    }

                    break;
                }
            }
        });
    }

    spawnEntity() {
        const randomX = Math.random() * (this.windowWidth - 50);
        const speedFactor = this.windowHeight / BASE_HEIGHT; 
        const randomSpeed = (Math.random() * (MAX_SPEED - MIN_SPEED) + MIN_SPEED) * speedFactor; 
        const mineral = getRandomMineral(MINERALS);
        const entity = new ImageEntity(randomX, -50, mineral.src, randomSpeed, mineral.points);
        this.entities.push(entity);
    }

    updateEntities(currentTime: number = 0) {
        const deltaTime = (currentTime - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = currentTime;

        this.offscreenContext.clearRect(0, 0, this.windowWidth, this.windowHeight);
        this.entities.forEach((entity) => entity.update(this.offscreenContext, deltaTime));
        this.entities = this.entities.filter((entity) => !entity.isOffScreen(this.windowHeight));

        // Draw offscreen to main
        this.context.clearRect(0, 0, this.windowWidth, this.windowHeight);
        this.context.drawImage(this.offscreenCanvas, 0, 0);

        if (this.gameTime <= 0) {
            this.endGame();
        } else {
            requestAnimationFrame((time) => this.updateEntities(time));
        }
    }

    startGame() {
        this.lastUpdateTime = performance.now(); 
        this.spawnTimer = setInterval(() => this.spawnEntity(), SPAWN_INTERVAL);
        this.gameTimer = setInterval(() => {
            this.gameTime -= 1;
            if (this.onTimeLeftUpdate) {
                this.onTimeLeftUpdate(this.gameTime);
            }
            if (this.gameTime <= 0) {
                clearInterval(this.spawnTimer!);
                clearInterval(this.gameTimer!);
            }
        }, 1000);

        this.updateEntities(this.lastUpdateTime);
    }

    endGame() {
        // Calculate total collected value
        let totalValue = 0;
        for (const mineralKey in this.collectedMinerals) {
            const { count, value } = this.collectedMinerals[mineralKey];
            totalValue += count * value;
        }

        // Notify via callback that the game ended
        if (this.onGameOver) {
            this.onGameOver(totalValue, this.collectedMinerals);
        }
    }

    useBoost(boostId: string) {
        switch (boostId) {
          case 'boost1':
            this.applySpeedBoost();
            break;
          case 'boost2':
            this.applyDynamite();
            break;
          case 'boost3':
            this.applyDoublePointsBoost();
        }
      }
      
    private applySpeedBoost() {
    // Clear the current spawn timer if any
    if (this.spawnTimer) {
        clearInterval(this.spawnTimer);
    }
    
    // Spawn twice as fast for 5 seconds
    const fastSpawnInterval = SPAWN_INTERVAL / 2;
    this.spawnTimer = setInterval(() => this.spawnEntity(), fastSpawnInterval);
    
    // After 5 seconds, revert to normal
    setTimeout(() => {
        if (this.spawnTimer) {
        clearInterval(this.spawnTimer);
        }
        this.spawnTimer = setInterval(() => this.spawnEntity(), SPAWN_INTERVAL);
    }, 5000);
    }
      
    private applyDynamite() {
    let addedScore = 0;
    
    // For each entity, add its points to score and update collectedMinerals
    for (const entity of this.entities) {
        addedScore += entity.points;
    
        const imgSrc = entity.image.src;
        if (!this.collectedMinerals[imgSrc]) {
        // If this mineral type isn't recorded yet, initialize it
        this.collectedMinerals[imgSrc] = { count: 0, value: entity.points };
        }
    
        // Increase the count for this mineral
        this.collectedMinerals[imgSrc].count += 1;
    }
    
    // Clear all entities from the screen
    this.entities = [];
    
    // Increase the score
    this.score += addedScore;
    
    // Notify the HUD about the updated score
    if (this.onScoreUpdate) {
        this.onScoreUpdate(this.score);
    }
    }

    private applyDoublePointsBoost() {
        if (this.doublePointsActive) return; // Prevent overlapping boosts
    
        console.log("Double Points Boost Activated!");
        this.doublePointsActive = true;
    
        setTimeout(() => {
          console.log("Double Points Boost Ended!");
          this.doublePointsActive = false;
        }, 3000);
      }


}
