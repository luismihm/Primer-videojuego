import { Player, Coin, Enemy } from "./entities.js";
import { InputHeader } from "./input.js";
import { distance, saveGameData, loadGameData } from "./utils.js";

console.log("Iniciando juego")

const GAME_STATE = {
    MENU: "MENU",
    RUNNING: "RUNNING",
    GAME_OVER: "GAME_OVER"
};

export class Game{
    constructor() {
        this.canvas = document.getElementById("gameCanvas");
        this.ctx = this.canvas.getContext("2d");

        this.gameLoop = this.gameLoop.bind(this);

        this.resize();
        window.addEventListener("resize", () => this.resize());

        this.input = new InputHeader();
        this.player = new Player(this);

        this.coins = [new Coin(this)];
        this.enemies = [];

        this.score = 0;
        this.level = 1;

        const saved = loadGameData();
        this.record = saved?.record || 1;
        this.bestLevel = saved?.bestLevel || 1;

        this.uiScore = document.getElementById("score");
        this.uiRecord = document.getElementById("record");
        this.uiLife = document.getElementById("life");
        this.uiRecord.textContent = "Récord: " + this.record;

        this.state = GAME_STATE.MENU;

        this.lastTime = 0;
        this.gameLoop(0);
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    startGame() {
        this.state = GAME_STATE.RUNNING;
        this.score = 0;
        this.level = 1;
        this.player.life = 3;
        this.player.x = 200;
        this.player.y = 200;

        this.coins = [new Coin(this)];
        this.enemies = [new Enemy(this)];
    }

    gameOver() {
        this.state = GAME_STATE.GAME_OVER;
        if (this.score > this.record) this.record = this.score;
        if (this.level > this.bestLevel) this.bestLevel = this.level;

        saveGameData({
            record: this.record,
            bestLevel: this.bestLevel
        });
    }

    checkCollision(a, b, sizeA, sizeB) {
        const dx = a.getCenter().x - b.getCenter().x;
        const dy = a.getCenter().y - b.getCenter().y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        return dist < (sizeA / 2 + sizeB / 2);
    }

    updateDifficulty() {
        if (this.score % 30 === 0 && this.score !== 0) {
            this.level++;
            this.enemies.push(new Enemy(this));
        }
        if (this.score > this.record) this.record = this.score;
    }

    update(deltaTime) {
        if (this.state !== GAME_STATE.RUNNING) return;

        this.player.update(this.input);

        this.coins.forEach(coin => {
            if (this.checkCollision(this.player, coin, this.player.width, coin.size)) {
                this.score += 10;
                coin.reset();
                this.updateDifficulty();
            }
        });

        this.enemies.forEach(enemy => {
            enemy.update(this.player);
            if (this.checkCollision(this.player, enemy, this.player.width, enemy.size)) {
                this.player.life--;
                this.player.x = 200;
                this.player.y = 200;
                if (this.player.life <= 0) this.gameOver();
            }
        });

        this.uiScore.textContent = "Puntos: " + this.score;
        this.uiLife.textContent = "Vida: " + this.player.life;
        this.uiRecord.textContent = "Récord: " + this.record;
    }

    drawMenu() {
        this.ctx.fillStyle = "white";
        this.ctx.font = "40px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText("DODGE & COLLECT", this.width / 2, this.height / 2 - 40);
        this.ctx.font = "24px Arial";
        this.ctx.fillText("PRESS ENTER TO START", this.width / 2, this.height / 2 + 10);
    }

    drawGameOver() {
        this.ctx.fillStyle = "white";
        this.ctx.font = "40px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText("GAME OVER", this.width / 2, this.height / 2 - 40);
        this.ctx.font = "24px Arial";
        this.ctx.fillText("PRESS ENTER TO RESTART", this.width / 2, this.height / 2 +10);
    }

    draw() {

        this.ctx.fillStyle = "#1c1b1b";
        this.ctx.fillRect(0, 0, this.width, this.height);

        if (this.state === GAME_STATE.MENU) {
            this.drawMenu();
            return;
        }

        if (this.state === GAME_STATE.GAME_OVER) {
            this.drawGameOver();
            return;
        }

        this.player.draw(this.ctx);
        this.coins.forEach(coin => coin.draw(this.ctx));
        this.enemies.forEach(enemy => enemy.draw(this.ctx));
    }

    gameLoop(timestamp) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update(deltaTime);
        
        try {
            this.draw();
        } catch (e) {
            console.error("Error en draw(): " + e);
        }

        requestAnimationFrame(this.gameLoop);
    }
}