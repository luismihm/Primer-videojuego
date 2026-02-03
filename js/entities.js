import { clamp, distance } from "./utils.js";

/**
 * Representa al jugador del juego.
 */
export class Player {
    /**
     * Crea una instancia de Player.
     * @param {Game} game - Instancia del juego donde se ejecuta el jugador.
     */
    constructor(game) {
        this.game = game;
        this.width = 40;
        this.height = 40;
        this.x = 200;
        this.y = 200;
        this.speed = 4;
        this.life = 3;
    }

    /**
     * Actualiza la posición del jugador según la entrada del usuario.
     * @param {InputHeader} input - Objeto que contiene las teclas presionadas.
     */
    update(input) {
        if (input.keys.includes("w") || input.keys.includes("arrowup")) this.y -= this.speed;
        if (input.keys.includes("s") || input.keys.includes("arrowdown")) this.y += this.speed;
        if (input.keys.includes("a") || input.keys.includes("arrowleft")) this.x -= this.speed;
        if (input.keys.includes("d") || input.keys.includes("arrowright")) this.x += this.speed;

        this.x = clamp(this.x, 0, this.game.width - this.width);
        this.y = clamp(this.y, 0, this.game.height - this.height);
    }

    /**
     * Dibuja el jugador en el canvas.
     * @param {CanvasRenderingContext2D} ctx - Contexto 2D del canvas.
     */
    draw(ctx) {
        ctx.fillStyle = "blue";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    /**
     * Obtiene el punto central del jugador (para colisiones).
     * @returns {{x: number, y: number}} Coordenadas del centro.
     */
    getCenter() {
        return { x: this.x + this.width / 2, y: this.y + this.height / 2};
    }
}

/**
 * Representa una moneda del juego.
 */
export class Coin {
    /**
     * Crea una instancia de Coin.
     * @param {Game} game - Instancia del juego.
     */
    constructor(game) {
        this.game = game;
        this.size = 20;
        this.reset();
    }

    /**
     * Reinicia la posición de la moneda en una ubicación aleatoria.
     */
    reset() {
        this.x = Math.random() * (this.game.width - this.size);
        this.y = Math.random() * (this.game.height - this.size);
    }

    /**
     * Actualiza la moneda (en este juego no hace nada, pero se deja por estructura).
     */
    update() {}

    /**
     * Dibuja la moneda en el canvas.
     * @param {CanvasRenderingContext2D} ctx - Contexto 2D del canvas.
     */
    draw(ctx) {
        ctx.fillStyle = "gold";
        ctx.beginPath();
        ctx.arc(this.x + this.size / 2, this.y + this.size / 2, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
    }

    /**
     * Obtiene el punto central de la moneda (para colisiones).
     * @returns {{x: number, y: number}} Coordenadas del centro.
     */
    getCenter() {
        return { x: this.x + this.size / 2, y: this.y + this.size / 2};
    }
}

/**
 * Representa un enemigo que persigue al jugador.
 */
export class Enemy {
    /**
     * Crea una instancia de Enemy.
     * @param {Game} game - Instancia del juego.
     */
    constructor(game) {
        this.game = game;
        this.size = 40;
        this.speed = 2;
        this.x = Math.random() * (game.width - this.size);
        this.y = Math.random() * (game.height - this.size);
    }

    /**
     * Actualiza la posición del enemigo para seguir al jugador.
     * @param {Player} player - Jugador al que se persigue.
     */
    update(player) {
        const px = player.getCenter().x;
        const py = player.getCenter().y;
        const ex = this.x + this.size / 2;
        const ey = this.y + this.size / 2;

        const dx = px - ex;
        const dy = py - ey;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist === 0) return;

        this.x += (dx / dist) * this.speed;
        this.y += (dy / dist) * this.speed;
    }

    /**
     * Dibuja el enemigo en el canvas.
     * @param {CanvasRenderingContext2D} ctx - Contexto 2D del canvas.
     */
    draw(ctx) {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }

    /**
     * Obtiene el punto central del enemigo (para colisiones).
     * @returns {{x: number, y: number}} Coordenadas del centro.
     */
    getCenter () {
        return { x: this.x + this.size / 2, y: this.y + this.size / 2 };
    }
}
