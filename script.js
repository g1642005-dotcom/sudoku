document.addEventListener('DOMContentLoaded', () => {
    const sudokuGrid = document.getElementById('sudoku-grid');
    const numberButtonsContainer = document.getElementById('number-buttons');
    const checkButton = document.getElementById('check-button');
    const resetButton = document.getElementById('reset-button');

    const noteModeToggle = document.createElement('button');
    noteModeToggle.id = 'note-mode-toggle';
    noteModeToggle.textContent = 'メモモード';
    
    const buttonsContainer = document.querySelector('.buttons');
    if(buttonsContainer) {
        const controlsDiv = document.createElement('div');
        controlsDiv.id = 'controls';
        controlsDiv.appendChild(numberButtonsContainer);
        controlsDiv.appendChild(noteModeToggle);
        buttonsContainer.parentNode.insertBefore(controlsDiv, buttonsContainer);
    }

    let selectedCell = null;
    let selectedInput = null;
    let noteMode = false;

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

                    // キーボード入力の処理
                    input.addEventListener('keydown', (e) => {
                        if (e.key === 'Backspace' || e.key === 'Delete') {
                            e.preventDefault();
                            selectedInput.value = '';
                            clearNotes(selectedCell);
                        } else if (/^[1-9]$/.test(e.key)) {
                            e.preventDefault(); // デフォルトの入力を防ぐ
                            if (noteMode) {
                                toggleNote(selectedCell, parseInt(e.key));
                            } else {
                                selectedInput.value = e.key;
                                clearNotes(selectedCell);
                            }
                        } else {
                            e.preventDefault();
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

    createBoard();
    createNumberButtons();
});
