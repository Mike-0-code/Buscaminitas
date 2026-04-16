class InputHandler {
    constructor(canvasId, board, renderer, gameState, onGameUpdate) {
        this.canvas = document.getElementById(canvasId);
        this.board = board;
        this.renderer = renderer;
        this.gameState = gameState;
        this.onGameUpdate = onGameUpdate;
        this.lastClickTime = 0;
        this.lastClickPos = null;
        
        this.canvas.addEventListener('click', this.handleClick.bind(this));
        this.canvas.addEventListener('dblclick', this.handleDoubleClick.bind(this));
    }
    
    handleClick(e) {
        if (!this.gameState.isPlaying()) return;
        
        const { row, col } = this.getCellFromClick(e);
        if (row === undefined) return;
        
        const success = this.board.reveal(row, col);
        
        if (!success && this.board.gameOver) {
            this.gameState.setState(State.DEFEAT);
            this.renderer.renderAllMines(this.board.getAllMines());
            this.onGameUpdate('¡Has perdido! 💥', 'defeat');
        } else {
            this.renderer.render();
            
            // Verificar 50/50
            const solution = this.board.getFiftyFiftySolution();
            if (solution) {
                const [safeRow, safeCol] = solution;
                this.board.reveal(safeRow, safeCol);
                this.renderer.render();
            }
            
            if (this.board.checkVictory()) {
                this.gameState.setState(State.VICTORY);
                this.renderer.showVictoryAnimation();
                this.onGameUpdate('¡Victoria! 🎉 Imagen descubierta', 'victory');
            } else {
                this.onGameUpdate('', '');
            }
        }
    }
    
    handleDoubleClick(e) {
        if (!this.gameState.isPlaying()) return;
        
        const { row, col } = this.getCellFromClick(e);
        if (row === undefined) return;
        
        const success = this.board.doubleClick(row, col);
        
        if (!success && this.board.gameOver) {
            this.gameState.setState(State.DEFEAT);
            this.renderer.renderAllMines(this.board.getAllMines());
            this.onGameUpdate('¡Has perdido! 💥', 'defeat');
        } else {
            this.renderer.render();
            
            if (this.board.checkVictory()) {
                this.gameState.setState(State.VICTORY);
                this.renderer.showVictoryAnimation();
                this.onGameUpdate('¡Victoria! 🎉 Imagen descubierta', 'victory');
            } else {
                this.onGameUpdate('', '');
            }
        }
    }
    
    getCellFromClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        const mouseX = (e.clientX - rect.left) * scaleX;
        const mouseY = (e.clientY - rect.top) * scaleY;
        
        if (mouseX < 0 || mouseX >= this.canvas.width || mouseY < 0 || mouseY >= this.canvas.height) {
            return {};
        }
        
        const col = Math.floor(mouseX / CELL_SIZE);
        const row = Math.floor(mouseY / CELL_SIZE);
        
        if (row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE) {
            return { row, col };
        }
        return {};
    }
}
