document.addEventListener('DOMContentLoaded', () => {
    function getSavedDifficulty() {
        const saved = localStorage.getItem('minesweeper_difficulty');
        if (saved && LEVELS[saved]) {
            return saved;
        }
        return 'normal';
    }
    
    let currentDifficulty = getSavedDifficulty();
    let board = null;
    let renderer = null;
    let gameState = null;
    let inputHandler = null;
    
    function initGame(difficulty) {
        const level = LEVELS[difficulty];
        if (!level) return;
        
        if (inputHandler) {
            inputHandler.destroy();
        }
        
        board = new Board(level.size, level.mines);
        board.init();
        
        if (!renderer) {
            renderer = new Renderer('game-canvas', board);
        } else {
            renderer.board = board;
        }
        renderer.setDifficulty(difficulty);
        
        gameState = new GameStateManager();
        
        inputHandler = new InputHandler('game-canvas', board, renderer, gameState, (result) => {
            handleRevealResult(result);
        });
        
        gameState.addListener((state) => {
            if (state === GameState.VICTORY) {
                renderer.showVictoryAnimation();
            }
        });
        
        renderer.render();
        console.log('Juego iniciado con dificultad:', difficulty);
    }
    
    function resetGame() {
        if (!board || !renderer || !gameState) return;
        
        const level = LEVELS[currentDifficulty];
        const newBoard = new Board(level.size, level.mines);
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
        localStorage.setItem('minesweeper_difficulty', difficulty);
        initGame(difficulty);
        
        document.querySelectorAll('.difficulty-buttons button').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.difficulty === difficulty) {
                btn.classList.add('active');
            }
        });
    }
    
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
    
    initGame(currentDifficulty);
    
    document.querySelectorAll('.difficulty-buttons button').forEach(btn => {
        if (btn.dataset.difficulty === currentDifficulty) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
});
