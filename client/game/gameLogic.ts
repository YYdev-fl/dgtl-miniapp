import { ImageEntity } from "./entities/ImageEntity";
import { MINERALS, GAME_DURATION, SPAWN_INTERVAL } from "./constants/gameData";
import { getRandomMineral } from "./utils/helper";

export class Game {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    windowWidth: number;
    windowHeight: number;
    entities: ImageEntity[] = [];
    score: number = 0;
    gameTime: number = GAME_DURATION;
    spawnTimer: NodeJS.Timeout | null = null;
    gameTimer: NodeJS.Timeout | null = null;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d")!;
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;

        this.setupCanvas();
        this.setupEventListeners();
    }

    setupCanvas() {
        this.canvas.style.background = "#000";
        this.canvas.width = this.windowWidth;
        this.canvas.height = this.windowHeight;
    }

    setupEventListeners() {
        this.canvas.addEventListener("mousedown", (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            for (let i = this.entities.length - 1; i >= 0; i--) {
                if (this.entities[i].isClicked(mouseX, mouseY)) {
                    this.score += this.entities[i].points;
                    this.entities.splice(i, 1);
                    break;
                }
            }
        });
    }

    spawnEntity() {
        const randomX = Math.random() * (this.windowWidth - 50);
        const randomSpeed = Math.random() * 3 + 1;
        const mineral = getRandomMineral(MINERALS);
        const entity = new ImageEntity(randomX, -50, mineral.src, randomSpeed, mineral.points);
        this.entities.push(entity);
    }

    updateEntities() {
        this.context.clearRect(0, 0, this.windowWidth, this.windowHeight);

        this.entities.forEach((entity) => entity.update(this.context));
        this.entities = this.entities.filter((entity) => !entity.isOffScreen(this.windowHeight));

        this.renderScore();
        this.renderTimer();

        if (this.gameTime <= 0) {
            this.endGame();
        } else {
            requestAnimationFrame(() => this.updateEntities());
        }
    }

    renderScore() {
        this.context.fillStyle = "#fff";
        this.context.font = "20px Arial";
        this.context.fillText(`Score: ${this.score}`, 10, 30);
    }

    renderTimer() {
        this.context.fillText(`Time Left: ${this.gameTime}s`, this.windowWidth - 150, 30);
    }

    startGame() {
        this.spawnTimer = setInterval(() => this.spawnEntity(), SPAWN_INTERVAL);
        this.gameTimer = setInterval(() => {
            this.gameTime -= 1;
            if (this.gameTime <= 0) {
                clearInterval(this.spawnTimer!);
                clearInterval(this.gameTimer!);
            }
        }, 1000);

        this.updateEntities();
    }

    endGame() {
        this.context.clearRect(0, 0, this.windowWidth, this.windowHeight);
        this.context.fillStyle = "#fff";
        this.context.font = "30px Arial";
        this.context.textAlign = "center";
        this.context.fillText(`Game Over! Final Score: ${this.score}`, this.windowWidth / 2, this.windowHeight / 2);
    }
}
