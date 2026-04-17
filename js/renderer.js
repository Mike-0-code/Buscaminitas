class Renderer {
    constructor(canvasId, board) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.board = board;
        this.images = {
            facil: null,
            normal: null,
            dificil: null,
            experto: null
        };
        this.currentImage = null;
        this.victoryAnimationFrame = null;
        this.loadImages();
    }
    
    loadImages() {
        const levels = ['normal', 'dificil', 'experto'];
        levels.forEach(level => {
            const img = new Image();
            img.src = `assets/${level}.png`;
            img.onload = () => {
                console.log(`Cargada imagen: ${level}`);
            };
            img.onerror = () => {
                console.warn(`No se pudo cargar assets/${level}.png, usando color sólido`);
            };
            this.images[level] = img;
        });
    }
    
    setDifficulty(level) {
        this.currentImage = this.images[level];
    }
    
    render() {
        // Cancelar animación de victoria si está activa
        if (this.victoryAnimationFrame) {
            cancelAnimationFrame(this.victoryAnimationFrame);
            this.victoryAnimationFrame = null;
        }
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let row = 0; row < this.board.size; row++) {
            for (let col = 0; col < this.board.size; col++) {
                const x = col * CELL_SIZE;
                const y = row * CELL_SIZE;
                
                if (this.board.revealed[row][col]) {
                    this.renderRevealedCell(row, col, x, y);
                } else {
                    this.renderHiddenCell(x, y);
                }
            }
        }
    }
    
    renderRevealedCell(row, col, x, y) {
        const value = this.board.grid[row][col];

        // Efecto "pop" - escala temporal
        this.ctx.save();
        this.ctx.translate(x + CELL_SIZE/2, y + CELL_SIZE/2);
        this.ctx.scale(0.8, 0.8);
        this.ctx.translate(-(x + CELL_SIZE/2), -(y + CELL_SIZE/2));
        
        if (this.currentImage && this.currentImage.complete) {
            try {
                this.ctx.drawImage(
                    this.currentImage,
                    col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE,
                    x, y, CELL_SIZE, CELL_SIZE
                );
            } catch(e) {
                this.ctx.fillStyle = '#2a2a4a';
                this.ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
            }
        } else {
            this.ctx.fillStyle = '#2a2a4a';
            this.ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
        }
        
        this.ctx.strokeStyle = '#4a4a8a';
        this.ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
        
        if (value > 0) {
            this.ctx.fillStyle = this.getNumberColor(value);
            this.ctx.font = `bold ${CELL_SIZE - 4}px monospace`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(value.toString(), x + CELL_SIZE/2, y + CELL_SIZE/2);
        } else if (value === -1 && this.board.gameOver) {
            this.ctx.fillStyle = '#ff4444';
            this.ctx.font = `${CELL_SIZE - 4}px monospace`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText('💣', x + CELL_SIZE/2, y + CELL_SIZE/2);
        }
    }
    
    renderHiddenCell(x, y) {
        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
        this.ctx.strokeStyle = '#2a2a4a';
        this.ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
    }
    
    getNumberColor(value) {
        const colors = {
            1: '#4a90d9',
            2: '#4caf50',
            3: '#ff5252',
            4: '#9c27b0',
            5: '#ff9800',
            6: '#00bcd4',
            7: '#e91e63',
            8: '#795548'
        };
        return colors[value] || '#ffffff';
    }
    
    renderAllMines(minesPositions) {
        for (const [row, col] of minesPositions) {
            if (!this.board.revealed[row][col]) {
                const x = col * CELL_SIZE;
                const y = row * CELL_SIZE;
                this.ctx.fillStyle = '#ff4444';
                this.ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
                this.ctx.fillStyle = '#fff';
                this.ctx.font = `${CELL_SIZE - 4}px monospace`;
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText('💣', x + CELL_SIZE/2, y + CELL_SIZE/2);
                this.ctx.strokeStyle = '#ff8888';
                this.ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
            }
        }
    }
    
    showVictoryAnimation() {
        if (!this.currentImage || !this.currentImage.complete) return;
        
        let alpha = 0;
        const animate = () => {
            this.render(); // Renderizar el tablero primero
            this.ctx.globalAlpha = alpha;
            this.ctx.drawImage(this.currentImage, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
            this.ctx.globalAlpha = 1;
            
            alpha += 0.05;
            if (alpha < 1) {
                this.victoryAnimationFrame = requestAnimationFrame(animate);
            } else {
                this.victoryAnimationFrame = null;
            }
        };
        
        if (this.victoryAnimationFrame) {
            cancelAnimationFrame(this.victoryAnimationFrame);
        }
        this.victoryAnimationFrame = requestAnimationFrame(animate);
    }
}
