.class Board {
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
        let maxAttempts = totalCells * 2;
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
        if (this.gameOver) return { type: 'invalid' };
        if (row < 0 || row >= this.size || col < 0 || col >= this.size) return { type: 'invalid' };
        if (this.revealed[row][col]) return { type: 'already_revealed' };
        
        if (this.firstMove) {
            this.placeMines(row, col);
            this.firstMove = false;
        }
        
        if (this.grid[row][col] === -1) {
            this.gameOver = true;
            return { type: 'mine', row, col };
        }
        
        this.revealCell(row, col);
        
        // Resolver situaciones de suerte cuando no hay información
        this.resolveLuckySituations();
        
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
    
    // Verificar si hay ALGÚN número que dé información
    hasDeductiveInformation() {
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (this.revealed[row][col] && this.grid[row][col] > 0) {
                    const adjacentUnrevealed = this.getAdjacentUnrevealedCells(row, col);
                    const adjacentMines = this.countAdjacentMinesFromGrid(row, col);
                    const revealedMines = this.countAdjacentRevealedMines(row, col);
                    
                    // Si hay celdas sin revelar Y no todas las minas están marcadas
                    if (adjacentUnrevealed.length > 0 && revealedMines < adjacentMines) {
                        return true; // Hay información disponible
                    }
                }
            }
        }
        return false; // No hay ningún número que dé información
    }
    
    // Resolver situaciones de suerte
    resolveLuckySituations() {
        // Solo actuar si NO hay información deductiva disponible
        while (!this.hasDeductiveInformation() && !this.gameOver && !this.checkVictory()) {
            const progress = this.revealRandomSafeCell();
            if (!progress) break;
        }
    }
    
    // Revelar una casilla segura al azar
    revealRandomSafeCell() {
        const safeCells = [];
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (!this.revealed[row][col] && this.grid[row][col] !== -1) {
                    safeCells.push([row, col]);
                }
            }
        }
        
        if (safeCells.length === 0) return false;
        
        const randomIndex = Math.floor(Math.random() * safeCells.length);
        const [row, col] = safeCells[randomIndex];
        
        console.log(`🎲 Sin información disponible, revelando casilla al azar: (${row}, ${col})`);
        this.revealCell(row, col);
        return true;
    }
    
    // Funciones auxiliares
    getAdjacentUnrevealedCells(row, col) {
        const cells = [];
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                const nr = row + dr;
                const nc = col + dc;
                if (nr >= 0 && nr < this.size && nc >= 0 && nc < this.size) {
                    if (!this.revealed[nr][nc]) {
                        cells.push([nr, nc]);
                    }
                }
            }
        }
        return cells;
    }
    
    countAdjacentMinesFromGrid(row, col) {
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                const nr = row + dr;
                const nc = col + dc;
                if (nr >= 0 && nr < this.size && nc >= 0 && nc < this.size) {
                    if (this.grid[nr][nc] === -1) {
                        count++;
                    }
                }
            }
        }
        return count;
    }
    
    countAdjacentRevealedMines(row, col) {
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                const nr = row + dr;
                const nc = col + dc;
                if (nr >= 0 && nr < this.size && nc >= 0 && nc < this.size) {
                    if (this.revealed[nr][nc] && this.grid[nr][nc] === -1) {
                        count++;
                    }
                }
            }
        }
        return count;
    }
    
    checkVictory() {
        const totalSafe = this.size * this.size - this.mineCount;
        return this.revealedCount === totalSafe;
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
