import { Game } from "./game.js";

/**
 * Inicia el juego cuando la página carga.
 */
window.onload = () => {
    const game = new Game();

    window.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            if (game.state === "MENU" || game.state === "GAME_OVER") {
                game.startGame();
            }
        }
    });
};
