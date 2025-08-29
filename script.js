document.addEventListener('DOMContentLoaded', () => {
    const sudokuGrid = document.getElementById('sudoku-grid');
    const numberButtonsContainer = document.getElementById('number-buttons');
    const newGameButton = document.getElementById('new-game-button');
    const customGameButton = document.getElementById('custom-game-button');
    const updateDateElement = document.getElementById('update-date');
    const modal = document.getElementById('modal');
    const startButton = document.getElementById('start-button');
    const closeModalButton = document.getElementById('close-modal-button');
    const customBoardInput = document.getElementById('custom-board-input');
    
    // 新しいボタンの要素を取得
    const undoButton = document.getElementById('undo-button');
    const eraseButton = document.getElementById('erase-button');
    const noteModeToggle = document.getElementById('note-mode-toggle');
    const hintButton = document.getElementById('hint-button');

    let selectedCell = null;
    let selectedInput = null;
    let noteMode = false;
    let initialBoard = null;
    let board = null;
    
    // 数独の問題リスト
    const allBoards = [
        [
            [5, 3, 0, 0, 7, 0, 0, 0, 0],
            [6, 0, 0, 1, 9, 5, 0, 0, 0],
            [0, 9, 8, 0, 0, 0, 0, 6, 0],
            [8, 0, 0, 0, 6, 0, 0, 0, 3],
            [4, 0, 0, 8, 0, 3, 0, 0, 1],
            [7, 0, 0, 0, 2, 0, 0, 0, 6],
            [0, 6, 0, 0, 0, 0, 2, 8, 0],
            [0, 0, 0, 4, 1, 9, 0, 0, 5],
            [0, 0, 0, 0, 8, 0, 0, 7, 9]
        ],
        [
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 3, 0, 8, 5],
            [0, 0, 1, 0, 2, 0, 0, 0, 0],
            [0, 0, 0, 5, 0, 7, 0, 0, 0],
            [0, 0, 4, 0, 0, 0, 1, 0, 0],
            [0, 9, 0, 0, 0, 0, 0, 0, 0],
            [5, 0, 0, 0, 0, 0, 0, 7, 3],
            [0, 0, 2, 0, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 4, 0, 0, 0, 9]
        ],
        [
            [0, 0, 0, 6, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]
    ];
    
    // ランダムな数独問題を生成し、`initialBoard`と`board`を更新する関数
    function generateAndSetNewBoard() {
        const randomIndex = Math.floor(Math.random() * allBoards.length);
        const selectedBoard = allBoards[randomIndex];
        initialBoard = JSON.parse(JSON.stringify(selectedBoard));
        board = JSON.parse(JSON.stringify(initialBoard));
        createBoard(board);
    }

    function createBoard(boardToRender) {
        sudokuGrid.innerHTML = '';
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                
                const value = boardToRender[row][col];
                
                if (value !== 0) {
                    cell.textContent = value;
                    cell.classList.add('fixed');
                } else {
                    const input = document.createElement('input');
                    input.type = 'tel';
                    input.maxLength = 1;
                    input.dataset.row = row;
                    input.dataset.col = col;
                    cell.appendChild(input);

                    cell.addEventListener('click', () => {
                        if (selectedCell) {
                            selectedCell.classList.remove('selected');
                        }
                        selectedCell = cell;
                        selectedInput = input;
                        selectedCell.classList.add('selected');
                        
                        if (!noteMode) {
                            input.focus();
                        } else {
                            input.blur();
                        }
                    });
                    
                    input.addEventListener('input', (e) => {
                        const value = e.target.value;
                        if (!/^[1-9]$/.test(value)) {
                            e.target.value = '';
                        }
                    });
                }
                sudokuGrid.appendChild(cell);
            }
        }
    }
    
    document.addEventListener('keydown', (e) => {
        if (selectedCell && !selectedCell.classList.contains('fixed')) {
            if (e.key === 'Backspace' || e.key === 'Delete') {
                e.preventDefault();
                if (selectedInput) {
                    selectedInput.value = '';
                    clearNotes(selectedCell);
                }
            } else if (/^[1-9]$/.test(e.key))
