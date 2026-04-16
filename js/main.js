document.addEventListener('DOMContentLoaded', () => {
    let currentDifficulty = 'normal';
    let board = null;
    let renderer = null;
    let gameState = null;
    let inputHandler = null;
    
    function initGame(difficulty, resetOnly = false) {
        const level = LEVELS[difficulty];
        if (!level) return;
        
        const newBoard = new Board(BOARD_SIZE, level.mines);
        newBoard.init();
        
        if (!resetOnly) {
            board = newBoard;
            if (renderer) {
                renderer.setDifficulty(difficulty);
            }
        } else {
            const oldRevealed = board.revealed;
            board = newBoard;
            board.revealed = oldRevealed; // Mantener estado visual en reset? No, mejor reiniciar completo
            // Para reset, simplemente reemplazar
        }
        
        if (!resetOnly) {
            if (renderer) {
                renderer.board = board;
            } else if (board) {
                // Primera inicialización
                renderer = new Renderer('game-canvas', board);
                renderer.setDifficulty(difficulty);
                gameState = new GameStateManager();
                inputHandler = new InputHandler('game-canvas', board, renderer, gameState, updateMessage);
            } else {
                renderer = new Renderer('game-canvas', board);
                renderer.setDifficulty(difficulty);
                gameState = new GameStateManager();
                inputHandler = new InputHandler('game-canvas', board, renderer, gameState, updateMessage);
            }
        } else {
            // Reset: reemplazar board en renderer y inputHandler
            renderer.board = board;
            inputHandler.board = board;
        }
        
        gameState.setState(State.PLAYING);
        renderer.render();
        updateMessage('', '');
    }
    
    function resetGame() {
        if (board && renderer && gameState && inputHandler) {
            const newBoard = new Board(BOARD_SIZE, LEVELS[currentDifficulty].mines);
            newBoard.init();
            board = newBoard;
            renderer.board = board;
            inputHandler.board = board;
            gameState.setState(State.PLAYING);
            renderer.render();
            updateMessage('', '');
        }
    }
    
    function updateMessage(text, type) {
        const msgDiv = document.getElementById('message');
        if (msgDiv) {
            msgDiv.textContent = text;
            msgDiv.style.color = type === 'victory' ? '#4caf50' : (type === 'defeat' ? '#ff5252' : '#aaa');
        }
    }
    
    function changeDifficulty(difficulty) {
        currentDifficulty = difficulty;
        initGame(difficulty, false);
        
        // Actualizar botones activos
        document.querySelectorAll('.difficulty-buttons button').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.difficulty === difficulty) {
                btn.classList.add('active');
            }
        });
    }
    
    // Configurar eventos de UI
    document.querySelectorAll('.difficulty-buttons button').forEach(btn => {
        btn.addEventListener('click', () => {
            changeDifficulty(btn.dataset.difficulty);
        });
    });
    
    document.getElementById('reset-btn').addEventListener('click', () => {
        if (board && renderer && gameState) {
            resetGame();
        } else {
            initGame(currentDifficulty, false);
        }
    });
    
    // Iniciar con dificultad normal
    initGame('normal', false);
});
