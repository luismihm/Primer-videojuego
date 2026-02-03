/**
 * Maneja la entrada del usuario (teclado).
 */
export class InputHeader {
    /**
     * Crea una instancia de InputHeader.
     * Guarda las teclas presionadas en un array.
     */
    constructor() {
        this.keys = [];

        window.addEventListener("keydown", (e) => {
            const key = e.key.toLowerCase();
            if (!this.keys.includes(key)) this.keys.push(key);
        });

        window.addEventListener ("keyup", (e) => {
            const key = e.key.toLowerCase();
            this.keys = this.keys.filter(k => k !== key);
        });
    }
}
