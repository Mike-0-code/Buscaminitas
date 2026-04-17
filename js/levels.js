// TABLERO: 32x32 = 1024 celdas totales
// Máximo de minas posible: 1015 (dejando 9 celdas libres para el primer clic)
// Niveles actuales están muy por debajo (150-256), es seguro

const LEVELS = {
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
const CANVAS_SIZE = BOARD_SIZE * CELL_SIZE;
