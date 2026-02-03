export function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

export function distance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

export function saveGameData(data) {
    localStorage.setItem("dodgeCollectData", JSON.stringify(data));
}

export function loadGameData() {
    const data = localStorage.getItem("dodgeCollectData");
    return data ? JSON.parse(data) : null;
}
