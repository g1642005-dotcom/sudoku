document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const sudokuGrid = document.getElementById('sudoku-grid');
    const numberButtonsContainer = document.getElementById('number-buttons');
    const checkButton = document.getElementById('check-button');
    const resetButton = document.getElementById('reset-button');
    const newGameButton = document.getElementById('new-game-button');
    const customGameButton = document.getElementById('custom-game-button');
    const updateDateElement = document.getElementById('update-date');
    const modal = document.getElementById('modal');
    const startButton = document.getElementById('start-button');
    const closeModalButton = document.getElementById('close-modal-button');
    const customBoardInput = document.getElementById('custom-board-input');
    
    const noteModeToggle = document.createElement('button');
    noteModeToggle.id = 'note-mode-toggle';
    noteModeToggle.textContent = 'メモモード';
    
    const controlsDiv = document.createElement('div');
    controlsDiv.id = 'controls';
    controlsDiv.appendChild(numberButtonsContainer);
    controlsDiv.appendChild(noteModeToggle);
    gameContainer.insertBefore(controlsDiv, checkButton.parentNode);

    let selectedCell = null;
    let selectedInput = null;
    let noteMode = false;

    // ランダムな数独問題を生成する関数（仮）
    function generateRandomBoard() {
        const boards = [
            [5, 3, 0, 0, 7, 0, 0, 0, 0],
            [6, 0, 0, 1, 9, 5, 0, 0, 0],
            [0, 9, 8, 0, 0, 0, 0, 6, 0],
            [8, 0, 0, 0, 6, 0, 0, 0, 3],
            [4, 0, 0, 8, 0, 3, 0, 0, 1],
            [7, 0, 0, 0, 2, 0, 0, 0, 6],
            [0, 6, 0, 0, 0, 0, 2, 8, 0],
            [0, 0, 0, 4, 1, 9, 0, 0, 5],
            [0, 0, 0, 0, 8, 0, 0, 7, 9],
            // 新しい問題を追加
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 3, 0, 8, 5],
            [0, 0, 1, 0, 2, 0, 0, 0, 0],
            [0, 0, 0, 5, 0, 7, 0, 0, 0],
            [0, 0, 4, 0, 0, 0, 1, 0, 0],
            [0, 9, 0, 0, 0, 0, 0, 0, 0],
            [5, 0, 0, 0, 0, 0, 0, 7, 3],
            [0, 0, 2, 0, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 4, 0, 0, 0, 9]
        ];
        const randomIndex = Math.floor(Math.random() * boards.length);
        return JSON.parse(JSON.stringify(boards[randomIndex]));
    }

    let initialBoard = generateRandomBoard();
    let board = JSON.parse(JSON.stringify(initialBoard));

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
            } else if (/^[1-9]$/.test(e.key)) {
                e.preventDefault();
                if (noteMode) {
                    toggleNote(selectedCell, parseInt(e.key));
                } else {
                    selectedInput.value = e.key;
                    clearNotes(selectedCell);
                }
            } else if (e.key === 'Control' || e.key === 'Shift' || e.key === 'Alt' || e.key === 'Tab' || e.key === 'Meta') {
            } else {
                e.preventDefault();
            }
        }
    });

    function createNumberButtons() {
        numberButtonsContainer.innerHTML = '';
        for (let i = 1; i <= 9; i++) {
            const button = document.createElement('button');
            button.classList.add('num-button');
            button.textContent = i;
            button.addEventListener('click', () => {
                if (selectedCell && !selectedCell.classList.contains('fixed')) {
                    if (noteMode) {
                        toggleNote(selectedCell, i);
                    } else {
                        clearNotes(selectedCell);
                        const inputElement = selectedCell.querySelector('input');
                        if (inputElement) {
                            inputElement.value = i;
                        }
                    }
                }
            });
            numberButtonsContainer.appendChild(button);
        }

        noteModeToggle.addEventListener('click', () => {
            noteMode = !noteMode;
            noteModeToggle.classList.toggle('active', noteMode);
            if (selectedInput) {
                if (noteMode) {
                    selectedInput.blur();
                } else {
                    selectedInput.focus();
                }
            }
        });
    }

    function toggleNote(cell, number) {
        let notesDiv = cell.querySelector('.notes');
        if (!notesDiv) {
            notesDiv = document.createElement('div');
            notesDiv.classList.add('notes');
            cell.appendChild(notesDiv);
        }
        const existingNote = notesDiv.querySelector(`.note-${number}`);
        if (existingNote) {
            existingNote.remove();
        } else {
            const noteSpan = document.createElement('span');
            noteSpan.classList.add('notes-cell', `note-${number}`);
            noteSpan.textContent = number;
            notesDiv.appendChild(noteSpan);
        }
        const inputElement = cell.querySelector('input');
        if (inputElement) {
            inputElement.value = '';
        }
    }

    function clearNotes(cell) {
        const notesDiv = cell.querySelector('.notes');
        if (notesDiv) {
            notesDiv.remove();
        }
    }

    resetButton.addEventListener('click', () => {
        if (selectedCell && !selectedCell.classList.contains('fixed')) {
            const inputElement = selectedCell.querySelector('input');
            if (inputElement) {
                inputElement.value = '';
            }
            clearNotes(selectedCell);
        }
    });

    // 新しいゲームボタンのイベントリスナー
    newGameButton.addEventListener('click', () => {
        initialBoard = generateRandomBoard();
        board = JSON.parse(JSON.stringify(initialBoard));
        createBoard(board);
    });

    // カスタムゲームボタンのイベントリスナー
    customGameButton.addEventListener('click', () => {
        modal.classList.remove('modal-hidden');
    });

    // ポップアップ内のボタンイベントリスナー
    startButton.addEventListener('click', () => {
        const inputString = customBoardInput.value.replace(/[^0-9]/g, '');
        if (inputString.length !== 81) {
            alert('入力された文字列の長さが正しくありません。数字81個で入力してください。');
            return;
        }
        const newBoard = [];
        for (let i = 0; i < 9; i++) {
            newBoard.push(inputString.slice(i * 9, (i + 1) * 9).split('').map(Number));
        }
        initialBoard = newBoard;
        board = JSON.parse(JSON.stringify(initialBoard));
        createBoard(board);
        modal.classList.add('modal-hidden');
    });

    closeModalButton.addEventListener('click', () => {
        modal.classList.add('modal-hidden');
    });

    // サーバーの最終更新日を取得して表示
    if (updateDateElement) {
        fetch('script.js', { method: 'HEAD' })
            .then(response => {
                const lastModified = response.headers.get('Last-Modified');
                if (lastModified) {
                    const formattedDate = new Date(lastModified).toLocaleString('ja-JP', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric'
                    });
                    updateDateElement.textContent = formattedDate;
                } else {
                    updateDateElement.textContent = '不明';
                }
            })
            .catch(() => {
                updateDateElement.textContent = '取得エラー';
            });
    }

    // 初期化
    createBoard(board);
    createNumberButtons();
});
