class Board {
    constructor(size, mineCount) {
        this.size = size;
        this.mineCount = mineCount;
        this.grid = [];
        this.revealed = [];
        this.minesPositions = new Set();
        this.firstMove = true;
        this.gameOver = false;
        this.revealedCount = 0;
    }
    
    init() {
        this.grid = Array(this.size).fill().map(() => Array(this.size).fill(0));
        this.revealed = Array(this.size).fill().map(() => Array(this.size).fill(false));
        this.minesPositions.clear();
        this.firstMove = true;
        this.gameOver = false;
        this.revealedCount = 0;
    }
    
    placeMines(firstRow, firstCol) {
        let minesPlaced = 0;
        const totalCells = this.size * this.size;
        let maxAttempts = totalCells * 2; // Evitar loop infinito
        let attempts = 0;
        
        while (minesPlaced < this.mineCount && attempts < maxAttempts) {
            const idx = Math.floor(Math.random() * totalCells);
            const row = Math.floor(idx / this.size);
            const col = idx % this.size;
            
            const isFirstCell = (row === firstRow && col === firstCol);
            const isAdjacent = Math.abs(row - firstRow) <= 1 && Math.abs(col - firstCol) <= 1;
            
            if (!isFirstCell && !isAdjacent && !this.minesPositions.has(`${row},${col}`)) {
                this.minesPositions.add(`${row},${col}`);
                this.grid[row][col] = -1;
                minesPlaced++;
            }
            attempts++;
        }
        
        // Si no se pudieron colocar todas las minas (raro), llenar el resto en celdas libres
        if (minesPlaced < this.mineCount) {
            for (let row = 0; row < this.size && minesPlaced < this.mineCount; row++) {
                for (let col = 0; col < this.size && minesPlaced < this.mineCount; col++) {
                    const isFirstCell = (row === firstRow && col === firstCol);
                    const isAdjacent = Math.abs(row - firstRow) <= 1 && Math.abs(col - firstCol) <= 1;
                    if (!isFirstCell && !isAdjacent && this.grid[row][col] !== -1) {
                        this.grid[row][col] = -1;
                        this.minesPositions.add(`${row},${col}`);
                        minesPlaced++;
                    }
                }
            }
        }
        
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (this.grid[row][col] !== -1) {
                    this.grid[row][col] = this.countAdjacentMines(row, col);
                }
            }
        }
    }
    
    countAdjacentMines(row, col) {
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                const nr = row + dr;
                const nc = col + dc;
                if (nr >= 0 && nr < this.size && nc >= 0 && nc < this.size) {
                    if (this.grid[nr][nc] === -1) count++;
                }
            }
        }
        return count;
    }
    
    reveal(row, col) {
        // Validaciones
        if (this.gameOver) return { type: 'invalid' };
        if (row < 0 || row >= this.size || col < 0 || col >= this.size) return { type: 'invalid' };
        if (this.revealed[row][col]) return { type: 'already_revealed' };
        
        // Primer movimiento: colocar minas
        if (this.firstMove) {
            this.placeMines(row, col);
            this.firstMove = false;
        }
        
        // Tocar mina
        if (this.grid[row][col] === -1) {
            this.gameOver = true;
            return { type: 'mine', row, col };
        }
        
        // Revelar casilla
        this.revealCell(row, col);
        
        // Verificar y resolver 50/50 al final
        const solution = this.getFiftyFiftySolution();
        if (solution) {
            const [safeRow, safeCol] = solution;
            this.revealCell(safeRow, safeCol);
        }
        
        // Verificar victoria
        const victory = this.checkVictory();
        if (victory) {
            this.gameOver = true;
            return { type: 'victory' };
        }
        
        return { type: 'safe', row, col };
    }
    
    revealCell(row, col) {
        if (row < 0 || row >= this.size || col < 0 || col >= this.size) return;
        if (this.revealed[row][col]) return;
        if (this.grid[row][col] === -1) return;
        
        this.revealed[row][col] = true;
        this.revealedCount++;
        
        if (this.grid[row][col] === 0) {
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    if (dr === 0 && dc === 0) continue;
                    this.revealCell(row + dr, col + dc);
                }
            }
        }
    }
    
    checkVictory() {
        const totalSafe = this.size * this.size - this.mineCount;
        return this.revealedCount === totalSafe;
    }
    
    getFiftyFiftySolution() {
        const unrevealed = [];
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (!this.revealed[row][col] && this.grid[row][col] !== -1) {
                    unrevealed.push([row, col]);
                }
            }
        }
        
        if (unrevealed.length === 2) {
            const minesRemaining = this.mineCount - this.getRevealedMinesCount();
            if (minesRemaining === 1) {
                for (const [row, col] of unrevealed) {
                    if (this.grid[row][col] !== -1) {
                        return [row, col];
                    }
                }
            }
        }
        return null;
    }
    
    getRevealedMinesCount() {
        let count = 0;
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (this.revealed[row][col] && this.grid[row][col] === -1) {
                    count++;
                }
            }
        }
        return count;
    }
    
    getAllMines() {
        const mines = [];
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (this.grid[row][col] === -1) {
                    mines.push([row, col]);
                }
            }
        }
        return mines;
    }
}
