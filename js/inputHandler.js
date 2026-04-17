class InputHandler {
    constructor(canvasId, board, renderer, onReveal) {
        this.canvas = document.getElementById(canvasId);
        this.board = board;
        this.renderer = renderer;
        this.onReveal = onReveal;  // callback cuando se revela una casilla
        
        this.canvas.addEventListener('click', this.handleClick.bind(this));
    }
    
    handleClick(e) {
        const { row, col } = this.getCellFromClick(e);
        if (row === undefined) return;
        
        // Intentar revelar la casilla
        const result = this.board.reveal(row, col);
        
        // Redibujar siempre
        this.renderer.render();
        
        // Notificar al main qué pasó
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
