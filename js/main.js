document.addEventListener('DOMContentLoaded', () => {
    // ========== NUEVO: Cargar dificultad guardada ==========
    function getSavedDifficulty() {
        const saved = localStorage.getItem('minesweeper_difficulty');
        // Validar que la dificultad guardada existe en LEVELS
        if (saved && LEVELS[saved]) {
            return saved;
        }
        return 'normal'; // Default
    }
    
    let currentDifficulty = getSavedDifficulty();  // ← CAMBIADO: usar función
    let board = null;
    let renderer = null;
    let gameState = null;
    let inputHandler = null;
    
    function initGame(difficulty) {
        const level = LEVELS[difficulty];
        if (!level) return;
        
        // Limpiar handler anterior si existe
        if (inputHandler) {
            inputHandler.destroy();
        }
        
        // Crear nuevo tablero
        board = new Board(BOARD_SIZE, level.mines);
        board.init();
        
        // Crear o actualizar renderer
        if (!renderer) {
            renderer = new Renderer('game-canvas', board);
        } else {
            renderer.board = board;
        }
        renderer.setDifficulty(difficulty);
        
        // Crear nuevo game state
        gameState = new GameStateManager();
        
        // Crear input handler
        inputHandler = new InputHandler('game-canvas', board, renderer, gameState, (result) => {
            handleRevealResult(result);
        });
        
        // Configurar listener de gameState para actualizar UI automáticamente
gameState.addListener((state) => {
    if (state === GameState.VICTORY) {
        renderer.showVictoryAnimation();
    }
});
        
        // Renderizar tablero inicial
        renderer.render();
        console.log('Juego iniciado con dificultad:', difficulty);
    }
    
    function resetGame() {
        if (!board || !renderer || !gameState) return;
        
        const level = LEVELS[currentDifficulty];
        const newBoard = new Board(BOARD_SIZE, level.mines);
        newBoard.init();
        
        board = newBoard;
        renderer.board = board;
        inputHandler.board = board;
        gameState.reset();
        renderer.render();
        console.log('Juego reiniciado');
    }
    
    function handleRevealResult(result) {
        switch(result.type) {
            case 'mine':
                gameState.setState(GameState.DEFEAT);
                renderer.renderAllMines(board.getAllMines());
                break;
                
            case 'victory':
                gameState.setState(GameState.VICTORY);
                break;
                
            case 'safe':
            case 'already_revealed':
            case 'invalid':
            default:
                if (result.type === 'safe') {
                    renderer.render();
                }
                break;
        }
    }
    
    function changeDifficulty(difficulty) {
        currentDifficulty = difficulty;
        // ========== NUEVO: Guardar en localStorage ==========
        localStorage.setItem('minesweeper_difficulty', difficulty);
        initGame(difficulty);
        
        document.querySelectorAll('.difficulty-buttons button').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.difficulty === difficulty) {
                btn.classList.add('active');
            }
        });
    }
    
    // Eventos UI
    const difficultyButtons = document.querySelectorAll('.difficulty-buttons button');
    difficultyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            changeDifficulty(btn.dataset.difficulty);
        });
    });
    
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            resetGame();
        });
    }
    
    // ========== CAMBIADO: iniciar con dificultad guardada ==========
    initGame(currentDifficulty);
    
    // ========== NUEVO: Marcar botón activo según dificultad guardada ==========
    document.querySelectorAll('.difficulty-buttons button').forEach(btn => {
        if (btn.dataset.difficulty === currentDifficulty) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
});
