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
        
        while (minesPlaced < this.mineCount) {
            const idx = Math.floor(Math.random() * totalCells);
            const row = Math.floor(idx / this.size);
            const col = idx % this.size;
            
            // No poner mina en el primer clic ni en sus adyacentes (para garantizar seguridad)
            const isFirstCell = (row === firstRow && col === firstCol);
            const isAdjacent = Math.abs(row - firstRow) <= 1 && Math.abs(col - firstCol) <= 1;
            
            if (!isFirstCell && !isAdjacent && !this.minesPositions.has(`${row},${col}`)) {
                this.minesPositions.add(`${row},${col}`);
                this.grid[row][col] = -1; // -1 representa mina
                minesPlaced++;
            }
        }
        
        // Calcular números
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
        if (this.gameOver) return false;
        if (row < 0 || row >= this.size || col < 0 || col >= this.size) return false;
        if (this.revealed[row][col]) return false;
        
        // Primer movimiento
        if (this.firstMove) {
            this.placeMines(row, col);
            this.firstMove = false;
        }
        
        // Mina
        if (this.grid[row][col] === -1) {
            this.gameOver = true;
            return false;
        }
        
        this.revealCell(row, col);
        return true;
    }
    
    revealCell(row, col) {
        if (row < 0 || row >= this.size || col < 0 || col >= this.size) return;
        if (this.revealed[row][col]) return;
        if (this.grid[row][col] === -1) return;
        
        this.revealed[row][col] = true;
        this.revealedCount++;
        
        // Relleno automático para casillas 0
        if (this.grid[row][col] === 0) {
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    if (dr === 0 && dc === 0) continue;
                    this.revealCell(row + dr, col + dc);
                }
            }
        }
    }
    
    doubleClick(row, col) {
        if (this.gameOver) return false;
        if (!this.revealed[row][col]) return false;
        if (this.grid[row][col] <= 0) return false;
        
        // Contar adyacentes no reveladas
        let adjacentUnrevealed = [];
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                const nr = row + dr;
                const nc = col + dc;
                if (nr >= 0 && nr < this.size && nc >= 0 && nc < this.size) {
                    if (!this.revealed[nr][nc]) {
                        adjacentUnrevealed.push([nr, nc]);
                    }
                }
            }
        }
        
        // Revelar todas las adyacentes no reveladas
        let hitMine = false;
        for (const [nr, nc] of adjacentUnrevealed) {
            if (this.grid[nr][nc] === -1) {
                hitMine = true;
            } else {
                this.revealCell(nr, nc);
            }
        }
        
        if (hitMine) {
            this.gameOver = true;
            return false;
        }
        return true;
    }
    
    checkVictory() {
        const totalSafe = this.size * this.size - this.mineCount;
        return this.revealedCount === totalSafe;
    }
    
    getFiftyFiftySolution() {
        // Buscar exactamente 2 casillas sin revelar
        const unrevealed = [];
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (!this.revealed[row][col] && this.grid[row][col] !== -1) {
                    unrevealed.push([row, col]);
                }
            }
        }
        
        if (unrevealed.length === 2) {
            // Verificar cuál tiene mina
            const minesRemaining = this.mineCount - this.getRevealedMinesCount();
            if (minesRemaining === 1) {
                // Revelar la que no tiene mina
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
        // Contar minas ya reveladas (en derrota)
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
