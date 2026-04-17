document.addEventListener('DOMContentLoaded', () => {
    let currentDifficulty = 'normal';
    let board = null;
    let renderer = null;
    let gameState = null;
    let inputHandler = null;
    
    function initGame(difficulty) {
        const level = LEVELS[difficulty];
        if (!level) return;
        
        // Crear y inicializar tablero
        board = new Board(BOARD_SIZE, level.mines);
        board.init();
        
        // Crear o actualizar renderer
        if (!renderer) {
            renderer = new Renderer('game-canvas', board);
        } else {
            renderer.board = board;
        }
        renderer.setDifficulty(difficulty);
        
        // Crear game state (siempre nuevo para resetear estado)
        gameState = new GameStateManager();
        
        // Crear input handler
        inputHandler = new InputHandler('game-canvas', board, renderer, gameState, (result) => {
            handleRevealResult(result);
        });
        
        // Forzar renderizado
        renderer.render();
        updateMessage('', '');
        
        // Debug: confirmar que el tablero existe
        console.log('Juego iniciado con dificultad:', difficulty, 'Tablero:', board);
    }
    
    function resetGame() {
        if (!board || !renderer || !gameState) return;
        
        const level = LEVELS[currentDifficulty];
        const newBoard = new Board(BOARD_SIZE, level.mines);
        newBoard.init();
        
        board = newBoard;
        renderer.board = board;
        inputHandler.board = board;
        inputHandler.gameState = gameState;  // Asegurar referencia
        gameState.setState(State.PLAYING);
        
        renderer.render();
        updateMessage('', '');
    }
    
    function handleRevealResult(result) {
        switch(result.type) {
            case 'mine':
                gameState.setState(State.DEFEAT);
                renderer.renderAllMines(board.getAllMines());
                updateMessage('¡Has perdido! 💥', 'defeat');
                break;
                
            case 'victory':
                gameState.setState(State.VICTORY);
                renderer.showVictoryAnimation();
                updateMessage('¡Victoria! 🎉 Imagen descubierta', 'victory');
                break;
                
            default:
                break;
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
        initGame(difficulty);
        
        document.querySelectorAll('.difficulty-buttons button').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.difficulty === difficulty) {
                btn.classList.add('active');
            }
        });
    }
    
    // Eventos UI
    document.querySelectorAll('.difficulty-buttons button').forEach(btn => {
        btn.addEventListener('click', () => {
            changeDifficulty(btn.dataset.difficulty);
        });
    });
    
    document.getElementById('reset-btn').addEventListener('click', () => {
        resetGame();
    });
    
    // Iniciar juego
    initGame('normal');
});document.addEventListener('DOMContentLoaded', () => {
    let currentDifficulty = 'normal';
    let board = null;
    let renderer = null;
    let gameState = null;
    let inputHandler = null;
    
    function initGame(difficulty) {
        const level = LEVELS[difficulty];
        if (!level) return;
        
        // Crear nuevo tablero
        board = new Board(BOARD_SIZE, level.mines);
        board.init();
        
        // Crear renderer si no existe
        if (!renderer) {
            renderer = new Renderer('game-canvas', board);
        } else {
            renderer.board = board;
        }
        renderer.setDifficulty(difficulty);
        
        // Crear game state
        gameState = new GameStateManager();
        
        // Crear input handler con callback
        inputHandler = new InputHandler('game-canvas', board, renderer, gameState, (result) => {
            handleRevealResult(result);
        });
        
        // Renderizar tablero inicial
        renderer.render();
        updateMessage('', '');
    }
    
    function resetGame() {
        if (!board || !renderer || !gameState) return;
        
        const level = LEVELS[currentDifficulty];
        const newBoard = new Board(BOARD_SIZE, level.mines);
        newBoard.init();
        
        board = newBoard;
        renderer.board = board;
        inputHandler.board = board;
        gameState.setState(State.PLAYING);
        
        renderer.render();
        updateMessage('', '');
    }
    
    function handleRevealResult(result) {
        switch(result.type) {
            case 'mine':
                gameState.setState(State.DEFEAT);
                renderer.renderAllMines(board.getAllMines());
                updateMessage('¡Has perdido! 💥', 'defeat');
                break;
                
            case 'victory':
                gameState.setState(State.VICTORY);
                renderer.showVictoryAnimation();
                updateMessage('¡Victoria! 🎉 Imagen descubierta', 'victory');
                break;
                
            case 'safe':
            case 'already_revealed':
            case 'invalid':
            default:
                // No hacer nada especial
                break;
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
        initGame(difficulty);
        
        document.querySelectorAll('.difficulty-buttons button').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.difficulty === difficulty) {
                btn.classList.add('active');
            }
        });
    }
    
    // Eventos UI
    document.querySelectorAll('.difficulty-buttons button').forEach(btn => {
        btn.addEventListener('click', () => {
            changeDifficulty(btn.dataset.difficulty);
        });
    });
    
    document.getElementById('reset-btn').addEventListener('click', () => {
        resetGame();
    });
    
    // Iniciar juego
    initGame('normal');
});document.addEventListener('DOMContentLoaded', () => {
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
