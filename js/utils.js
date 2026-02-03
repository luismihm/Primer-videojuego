/**
 * Restringe un valor entre un mínimo y un máximo.
 * @param {number} value - Valor a restringir.
 * @param {number} min - Valor mínimo permitido.
 * @param {number} max - Valor máximo permitido.
 * @returns {number} Valor restringido.
 */
export function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

/**
 * Calcula la distancia entre dos puntos.
 * @param {{x:number, y:number}} a - Primer punto.
 * @param {{x:number, y:number}} b - Segundo punto.
 * @returns {number} Distancia entre los puntos.
 */
export function distance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Guarda datos del juego en localStorage.
 * @param {Object} data - Datos a guardar.
 */
export function saveGameData(data) {
    localStorage.setItem("dodgeCollectData", JSON.stringify(data));
}

/**
 * Carga datos del juego desde localStorage.
 * @returns {Object|null} Datos guardados o null si no existe.
 */
export function loadGameData() {
    const data = localStorage.getItem("dodgeCollectData");
    return data ? JSON.parse(data) : null;
}
