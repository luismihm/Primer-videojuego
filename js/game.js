import { Player, Coin, Enemy } from "./entities.js";
import { InputHeader } from "./input.js";
import { distance, saveGameData, loadGameData } from "./utils.js";

/**
 * Estado del juego.
 * @readonly
 * @enum {string}
 */
const GAME_STATE = {
    MENU: "MENU",
    RUNNING: "RUNNING",
    GAME_OVER: "GAME_OVER"
};

/**
 * Clase principal del juego.
 * Se encarga de controlar el bucle principal, la lógica, colisiones y dibujo.
 */
export class Game{
    /**
     * Crea una instancia del juego.
     */
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

    /**
     * Ajusta el canvas al tamaño de la ventana.
     */
    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    /**
     * Inicia o reinicia el juego.
     */
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

    /**
     * Finaliza el juego y guarda el récord si es necesario.
     */
    gameOver() {
        this.state = GAME_STATE.GAME_OVER;
        if (this.score > this.record) this.record = this.score;
        if (this.level > this.bestLevel) this.bestLevel = this.level;

        saveGameData({
            record: this.record,
            bestLevel: this.bestLevel
        });
    }

    /**
     * Verifica colisión entre dos objetos usando distancia entre centros.
     * @param {Object} a - Primer objeto con método getCenter().
     * @param {Object} b - Segundo objeto con método getCenter().
     * @param {number} sizeA - Tamaño del primer objeto.
     * @param {number} sizeB - Tamaño del segundo objeto.
     * @returns {boolean} True si colisionan.
     */
    checkCollision(a, b, sizeA, sizeB) {
        const dx = a.getCenter().x - b.getCenter().x;
        const dy = a.getCenter().y - b.getCenter().y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        return dist < (sizeA / 2 + sizeB / 2);
    }

    /**
     * Aumenta la dificultad del juego según la puntuación.
     * Añade enemigos cada 30 puntos.
     */
    updateDifficulty() {
        if (this.score % 30 === 0 && this.score !== 0) {
            this.level++;
            this.enemies.push(new Enemy(this));
        }
        if (this.score > this.record) this.record = this.score;
    }

    /**
     * Actualiza el estado del juego en cada frame.
     * @param {number} deltaTime - Tiempo transcurrido desde el último frame.
     */
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

    /**
     * Dibuja el menú principal.
     */
    drawMenu() {
        this.ctx.fillStyle = "white";
        this.ctx.font = "40px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText("DODGE & COLLECT", this.width / 2, this.height / 2 - 40);
        this.ctx.font = "24px Arial";
        this.ctx.fillText("PRESS ENTER TO START", this.width / 2, this.height / 2 + 10);
    }

    /**
     * Dibuja la pantalla de game over.
     */
    drawGameOver() {
        this.ctx.fillStyle = "white";
        this.ctx.font = "40px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText("GAME OVER", this.width / 2, this.height / 2 - 40);
        this.ctx.font = "24px Arial";
        this.ctx.fillText("PRESS ENTER TO RESTART", this.width / 2, this.height / 2 +10);
    }

    /**
     * Dibuja todos los elementos del juego según el estado.
     */
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

    /**
     * Bucle principal del juego.
     * @param {number} timestamp - Tiempo actual en milisegundos.
     */
    gameLoop(timestamp) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update(deltaTime);
        
        try {
            this.draw();
        } catch (e) {
            console.error("Error en draw(): " + e);
        }

        requestAnimationFrame(this.gameLoop);
    }
}
