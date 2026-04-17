const GameState = {
    PLAYING: 'playing',
    VICTORY: 'victory',
    DEFEAT: 'defeat'
};

class GameStateManager {
    constructor() {
        this.state = GameState.PLAYING;
        this.listeners = [];
    }
    
    getState() {
        return this.state;
    }
    
    setState(newState) {
        if (this.state !== newState) {
            this.state = newState;
            this.notifyListeners();
        }
    }
    
    addListener(callback) {
        this.listeners.push(callback);
    }
    
    notifyListeners() {
        this.listeners.forEach(cb => cb(this.state));
    }
    
    isPlaying() {
        return this.state === GameState.PLAYING;
    }
    
    isVictory() {
        return this.state === GameState.VICTORY;
    }
    
    isDefeat() {
        return this.state === GameState.DEFEAT;
    }
    
    reset() {
        this.setState(GameState.PLAYING);
    }
}
