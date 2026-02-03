import { clamp, distance } from "./utils.js";

export class Player {
    constructor(game) {
        this.game = game;
        this.width = 40;
        this.height = 40;
        this.x = 200;
        this.y = 200;
        this.speed = 4;
        this.life = 3;

    }

    update(input) {
        if (input.keys.includes("w") || input.keys.includes("arrowup")) this.y -= this.speed;
        if (input.keys.includes("s") || input.keys.includes("arrowdown")) this.y += this.speed;
        if (input.keys.includes("a") || input.keys.includes("arrowleft")) this.x -= this.speed;
        if (input.keys.includes("d") || input.keys.includes("arrowright")) this.x += this.speed;

        this.x = clamp(this.x, 0, this.game.width - this.width);
        this.y = clamp(this.y, 0, this.game.height - this.height);
    }

    draw(ctx) {
        ctx.fillStyle = "blue";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    getCenter() {
        return { x: this.x + this.width / 2, y: this.y + this.height / 2};
    }
}

export class Coin {
    constructor(game) {
        this.game = game;
        this.size = 20;
        this.reset();
    }

    reset() {
        this.x = Math.random() * (this.game.width - this.size);
        this.y = Math.random() * (this.game.height - this.size);
    }

    update() {}

    draw(ctx) {
        ctx.fillStyle = "gold";
        ctx.beginPath();
        ctx.arc(this.x + this.size / 2, this.y + this.size / 2, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
    }

    getCenter() {
        return { x: this.x + this.size / 2, y: this.y + this.size / 2};
    }
}

export class Enemy {
    constructor(game) {
        this.game = game;
        this.size = 40;
        this.speed = 2;
        this.x = Math.random() * (game.width - this.size);
        this.y = Math.random() * (game.height - this.size);
    }

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

    draw(ctx) {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }

    getCenter () {
        return { x: this.x + this.size / 2, y: this.y + this.size / 2 };
    }
}