export class InputHeader {
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