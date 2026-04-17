// TABLERO: 32x32 = 1024 celdas totales
// Máximo de minas posible: 1015 (dejando 9 celdas libres para el primer clic)

const LEVELS = {
    normal: {
        name: 'Normal',
        mines: 120,
        size: 32,
        image: 'assets/normal.png'
    },
    dificil: {
        name: 'Difícil',
        mines: 180,
        size: 32,
        image: 'assets/dificil.png'
    },
    experto: {
        name: 'Experto',
        mines: 260,
        size: 32,
        image: 'assets/experto.png'
    }
};

const BOARD_SIZE = 32;
const CELL_SIZE = 24; // píxeles
const CANVAS_SIZE = BOARD_SIZE * CELL_SIZE;
