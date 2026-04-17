class InputHandler {
    constructor(canvasId, board, renderer, gameState, onReveal) {
        this.canvas = document.getElementById(canvasId);
        this.board = board;
        this.renderer = renderer;
        this.gameState = gameState;
        this.onReveal = onReveal;
        
        this.handleClick = this.handleClick.bind(this);
        this.canvas.addEventListener('click', this.handleClick);
    }
    
    handleClick(e) {
        if (!this.gameState.isPlaying()) return;
        if (this.board.gameOver) return;
        
        const cell = this.getCellFromClick(e);
        if (!cell) return;
        
        const { row, col } = cell;
        
        const result = this.board.reveal(row, col);
        this.renderer.render();
        
        if (this.onReveal) {
            this.onReveal(result);
        }
    }
    
    getCellFromClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        const mouseX = (e.clientX - rect.left) * scaleX;
        const mouseY = (e.clientY - rect.top) * scaleY;
        
        if (mouseX < 0 || mouseX >= this.canvas.width || mouseY < 0 || mouseY >= this.canvas.height) {
            return null;
        }
        
        const CELL_SIZE = this.canvas.width / this.board.size;
        const col = Math.floor(mouseX / CELL_SIZE);
        const row = Math.floor(mouseY / CELL_SIZE);
        
        if (row >= 0 && row < this.board.size && col >= 0 && col < this.board.size) {
            return { row, col };
        }
        return null;
    }
    
    destroy() {
        this.canvas.removeEventListener('click', this.handleClick);
    }
}
