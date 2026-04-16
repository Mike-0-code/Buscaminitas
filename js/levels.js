const LEVELS = {
    facil: {
        name: 'Fácil',
        mines: 100,
        image: 'assets/facil.png'
    },
    normal: {
        name: 'Normal',
        mines: 150,
        image: 'assets/normal.png'
    },
    dificil: {
        name: 'Difícil',
        mines: 200,
        image: 'assets/dificil.png'
    },
    experto: {
        name: 'Experto',
        mines: 256,
        image: 'assets/experto.png'
    }
};

const BOARD_SIZE = 32;
const CELL_SIZE = 16; // píxeles
const CANVAS_SIZE = BOARD_SIZE * CELL_SIZE + 2; // +2 para bordes
