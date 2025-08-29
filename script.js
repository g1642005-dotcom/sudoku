document.addEventListener('DOMContentLoaded', () => {
    const setupContainer = document.getElementById('setup-container');
    const gameContainer = document.getElementById('game-container');
    const randomModeRadio = document.getElementById('random-mode');
    const customModeRadio = document.getElementById('custom-mode');
    const customBoardInput = document.getElementById('custom-board-input');
    const startButton = document.getElementById('start-button');
    const sudokuGrid = document.getElementById('sudoku-grid');
    const numberButtonsContainer = document.getElementById('number-buttons');
    const noteModeToggle = document.getElementById('note-mode-toggle');
    const checkButton = document.getElementById('check-button');
    const resetButton = document.getElementById('reset-button');
    const timerDisplay = document.getElementById('timer');

    let selectedCell = null;
    let noteMode = false;
    let timerInterval = null;
    let startTime = null;

    // 問題の配列（ランダム問題として使用）
    const randomBoards = [
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
        // ここに別の数独の問題を追加できます
    ];

    let currentBoard = [];

    // ゲームモード選択の切り替え
    customModeRadio.addEventListener('change', () => {
        customBoardInput.classList.remove('hidden');
    });
    randomModeRadio.addEventListener('change', () => {
        customBoardInput.classList.add('hidden');
    });

    // スタートボタンのクリックイベント
    startButton.addEventListener('click', () => {
        setupContainer.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        
        if (customModeRadio.checked) {
            try {
                // ユーザー入力の問題をパース
                const input = `[${customBoardInput.value}]`;
                currentBoard = JSON.parse(input.replace(/\s/g, ''));
                if (!Array.isArray(currentBoard) || currentBoard.length !== 9 || !currentBoard.every(row => Array.isArray(row) && row.length === 9)) {
                    throw new Error("Invalid board format");
                }
            } catch (e) {
                alert("問題の形式が正しくありません。9x9の配列形式で入力してください。");
                gameContainer.classList.add('hidden');
                setupContainer.classList.remove('hidden');
                return;
            }
        } else {
            // ランダム問題を選択
            currentBoard = JSON.parse(JSON.stringify(randomBoards[0])); // ディープコピー
        }

        createBoard(currentBoard);
        createNumberButtons();
        startTimer();
    });

    // タイマー機能
    function startTimer() {
        startTime = Date.now();
        timerInterval = setInterval(() => {
            const elapsedTime = Date.now() - startTime;
            const hours = Math.floor(elapsedTime / 3600000);
            const minutes = Math.floor((elapsedTime % 3600000) / 60000);
            const seconds = Math.floor((elapsedTime % 60000) / 1000);

            const format = (num) => String(num).padStart(2, '0');
            timerDisplay.textContent = `${format(hours)}:${format(minutes)}:${format(seconds)}`;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    // 数独盤面の生成
    function createBoard(board) {
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
                    cell.appendChild(input);

                    cell.addEventListener('click', () => {
                        if (selectedCell) {
                            selectedCell.classList.remove('selected');
                        }
                        selectedCell = cell;
                        selectedCell.classList.add('selected');

                        if (!noteMode) {
                            input.focus();
                        }
                    });

                    // キーボード入力に対応 (メモモード切り替え)
                    input.addEventListener('keydown', (e) => {
                        if (e.key === 'Control') {
                            noteMode = true;
                            noteModeToggle.classList.add('active');
                        }
                    });
                    input.addEventListener('keyup', (e) => {
                        if (e.key === 'Control') {
                            noteMode = false;
                            noteModeToggle.classList.remove('active');
                        }
                    });
                }
                sudokuGrid.appendChild(cell);
            }
        }
    }

    // 数字ボタンとメモモードボタンの生成
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
                        const inputElement = selectedCell.querySelector('input');
                        if (inputElement) {
                            inputElement.value = i;
                            inputElement.dispatchEvent(new Event('input'));
                        }
                    }
                }
            });
            numberButtonsContainer.appendChild(button);
        }

        // メモモードボタンのクリックイベント
        noteModeToggle.addEventListener('click', () => {
            noteMode = !noteMode;
            if (noteMode) {
                noteModeToggle.classList.add('active');
                if (selectedCell && selectedCell.querySelector('input')) {
                     selectedCell.querySelector('input').blur(); // カーソルを非表示
                }
            } else {
                noteModeToggle.classList.remove('active');
                if (selectedCell && selectedCell.querySelector('input')) {
                     selectedCell.querySelector('input').focus(); // カーソルを表示 (見えないが入力可能に)
                }
            }
        });
    }

    // メモ機能
    function toggleNote(cell, number) {
        let notesDiv = cell.querySelector('.notes');
        if (!notesDiv) {
            notesDiv = document.createElement('div');
            notesDiv.classList.add('notes');
            cell.appendChild(notesDiv);
        }

        const existingNote = notesDiv.querySelector(`.note-${number}`);
        if (existingNote) {
            existingNote.remove(); // 既にメモがあれば削除
        } else {
            const noteSpan = document.createElement('span');
            noteSpan.classList.add('notes-cell', `note-${number}`);
            noteSpan.textContent = number;
            notesDiv.appendChild(noteSpan); // なければ追加
        }

        const inputElement = cell.querySelector('input');
        if (inputElement) {
            inputElement.value = ''; // メモ入力時はメインの数字を消す
        }
    }

    // 解答チェック機能
    checkButton.addEventListener('click', () => {
        const solution = [];
        let isSolved = true;
        const cells = sudokuGrid.querySelectorAll('.cell');

        for (let i = 0; i < 81; i++) {
            const cell = cells[i];
            const value = cell.querySelector('input')?.value || cell.textContent;
            solution.push(value === '' ? 0 : parseInt(value));
        }

        // 行、列、ブロックのチェック
        const solvedBoard = [];
        for (let i = 0; i < 9; i++) {
            solvedBoard.push(solution.slice(i * 9, (i + 1) * 9));
        }

        for (let i = 0; i < 9; i++) {
            const row = solvedBoard[i];
            const col = solvedBoard.map(r => r[i]);
            const box = [];
            const boxRowStart = Math.floor(i / 3) * 3;
            const boxColStart = (i % 3) * 3;

            for (let r = 0; r < 3; r++) {
                for (let c = 0; c < 3; c++) {
                    box.push(solvedBoard[boxRowStart + r][boxColStart + c]);
                }
            }

            const checkSet = (arr) => {
                const filtered = arr.filter(n => n !== 0);
                return new Set(filtered).size === filtered.length;
            };

            if (!checkSet(row) || !checkSet(col) || !checkSet(box)) {
                isSolved = false;
                break;
            }
        }

        if (isSolved) {
            stopTimer();
            const time = timerDisplay.textContent;
            alert(`正解です！クリアタイム: ${time}`);
        } else {
            alert("残念、まだ間違いがあります。");
        }
    });

    // リセットボタン
    resetButton.addEventListener('click', () => {
        stopTimer();
        gameContainer.classList.add('hidden');
        setupContainer.classList.remove('hidden');
    });

});
