const State = {
    PLAYING: 'playing',
    VICTORY: 'victory',
    DEFEAT: 'defeat'
};

class GameStateManager {
    constructor() {
        this.state = State.PLAYING;
        this.listeners = [];
    }
    
    getState() {
        return this.state;
    }
    
    setState(newState) {
        this.state = newState;
        this.notifyListeners();
    }
    
    addListener(callback) {
        this.listeners.push(callback);
    }
    
    notifyListeners() {
        this.listeners.forEach(cb => cb(this.state));
    }
    
    isPlaying() {
        return this.state === State.PLAYING;
    }
    
    isVictory() {
        return this.state === State.VICTORY;
    }
    
    isDefeat() {
        return this.state === State.DEFEAT;
    }
}// Estados posibles
const GameState = {
  MENU: 'menu',           // selección de dificultad (no usado realmente)
  PLAYING: 'playing',     // partida activa
  VICTORY: 'victory',     // victoria - muestra animación
  DEFEAT: 'defeat'        // derrota - muestra minas
};
