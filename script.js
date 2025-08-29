document.addEventListener('DOMContentLoaded', () => {
    const sudokuGrid = document.getElementById('sudoku-grid');
    const numberButtonsContainer = document.getElementById('number-buttons');
    let selectedCell = null;
    let selectedInput = null;

    const board = [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ];

    function createBoard() {
        sudokuGrid.innerHTML = '';
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                
                const value = board[row][col];
                
                if (value !== 0) {
                    cell.textContent = value;
                    cell.classList.add('fixed');
                } else {
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.maxLength = 1;
                    input.dataset.row = row;
                    input.dataset.col = col;
                    cell.appendChild(input);

                    input.addEventListener('click', (event) => {
                        if (selectedCell) {
                            selectedCell.classList.remove('selected');
                        }
                        selectedCell = event.target.closest('.cell');
                        selectedInput = event.target;
                        selectedCell.classList.add('selected');
                    });

                    // キーボード入力に対応
                    input.addEventListener('input', (event) => {
                        const value = event.target.value;
                        if (!/^[1-9]$/.test(value)) {
                            event.target.value = '';
                        }
                    });
                }
                sudokuGrid.appendChild(cell);
            }
        }
    }

    function createNumberButtons() {
        for (let i = 1; i <= 9; i++) {
            const button = document.createElement('button');
            button.classList.add('num-button');
            button.textContent = i;
            button.addEventListener('click', () => {
                if (selectedInput) {
                    selectedInput.value = i;
                }
            });
            numberButtonsContainer.appendChild(button);
        }
    }

    createBoard();
    createNumberButtons();
});
