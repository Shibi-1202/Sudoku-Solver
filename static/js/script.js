// Initialize the board on page load
document.addEventListener('DOMContentLoaded', function() {
    createBoard();
    updateStatistics();
    
    // Add keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
});

// Create the Sudoku board
function createBoard() {
    const board = document.getElementById('sudokuBoard');
    board.innerHTML = '';
    
    for (let i = 0; i < 9; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('td');
            const input = document.createElement('input');
            
            input.type = 'text';
            input.maxLength = '1';
            input.id = `cell_${i}_${j}`;
            input.className = 'sudoku-input';
            input.inputMode = 'numeric';
            
            // Input validation
            input.addEventListener('input', function(e) {
                if (this.value && (isNaN(this.value) || this.value < 1 || this.value > 9)) {
                    this.value = '';
                }
                removeConflict(this.id);
                updateStatistics();
            });
            
            // Handle Tab and Enter keys
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Tab') {
                    e.preventDefault();
                    const [row, col] = this.id.split('_').slice(1).map(Number);
                    const nextCol = col + 1;
                    
                    if (nextCol < 9) {
                        document.getElementById(`cell_${row}_${nextCol}`).focus();
                    } else if (row + 1 < 9) {
                        document.getElementById(`cell_${row + 1}_0`).focus();
                    }
                } else if (e.key === 'Backspace' || e.key === 'Delete') {
                    this.value = '';
                    updateStatistics();
                } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || 
                           e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                    handleArrowKey(e, this.id);
                }
            });
            
            // Clear on focus
            input.addEventListener('focus', function() {
                this.select();
            });
            
            cell.appendChild(input);
            row.appendChild(cell);
        }
        board.appendChild(row);
    }
}

// Handle arrow key navigation
function handleArrowKey(e, cellId) {
    const [row, col] = cellId.split('_').slice(1).map(Number);
    let newRow = row;
    let newCol = col;
    
    switch(e.key) {
        case 'ArrowUp':
            newRow = Math.max(0, row - 1);
            e.preventDefault();
            break;
        case 'ArrowDown':
            newRow = Math.min(8, row + 1);
            e.preventDefault();
            break;
        case 'ArrowLeft':
            newCol = Math.max(0, col - 1);
            e.preventDefault();
            break;
        case 'ArrowRight':
            newCol = Math.min(8, col + 1);
            e.preventDefault();
            break;
    }
    
    const nextCell = document.getElementById(`cell_${newRow}_${newCol}`);
    if (nextCell) {
        nextCell.focus();
    }
}

// Keyboard navigation helper
function handleKeyboardNavigation(e) {
    if (e.ctrlKey || e.metaKey) {
        if (e.key === 's') {
            e.preventDefault();
            solveSudoku();
        } else if (e.key === 'r') {
            e.preventDefault();
            resetBoard();
        }
    }
}

// Mark user input cells
function markUserInputs() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const input = document.getElementById(`cell_${i}_${j}`);
            if (input.value && input.classList.contains('original')) {
                input.classList.add('user-input');
            }
        }
    }
}

// Solve Sudoku
async function solveSudoku() {
    const solveBtn = document.getElementById('solveBtn');
    const statusMsg = document.getElementById('statusMessage');
    
    // Disable button and show loading
    solveBtn.disabled = true;
    solveBtn.classList.add('loading');
    statusMsg.className = 'status-message info';
    statusMsg.textContent = '⏳ Solving your puzzle...';
    
    try {
        const boardData = getBoardData();
        
        const response = await fetch('/api/solve', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(boardData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Display the solution with animation
            displaySolution(result.solution);
            statusMsg.className = 'status-message success';
            statusMsg.textContent = '✅ ' + result.message;
            
            // Show confetti effect
            showConfetti();
        } else {
            statusMsg.className = 'status-message error';
            statusMsg.textContent = '❌ ' + result.message;
        }
    } catch (error) {
        statusMsg.className = 'status-message error';
        statusMsg.textContent = '❌ Error: ' + error.message;
    } finally {
        solveBtn.disabled = false;
        solveBtn.classList.remove('loading');
    }
}

// Display solution with animation
function displaySolution(solution) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cellId = `cell_${i}_${j}`;
            const input = document.getElementById(cellId);
            const value = solution[cellId];
            
            if (value) {
                // Animate the display
                setTimeout(() => {
                    input.value = value;
                    input.classList.add('solved');
                }, (i * 9 + j) * 20); // Staggered animation
            }
        }
    }
}

// Validate board
async function validateBoard() {
    const validateBtn = document.getElementById('validateBtn');
    const statusMsg = document.getElementById('statusMessage');
    
    validateBtn.disabled = true;
    statusMsg.className = 'status-message info';
    statusMsg.textContent = '⏳ Validating...';
    
    try {
        const boardData = getBoardData();
        
        const response = await fetch('/api/validate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(boardData)
        });
        
        const result = await response.json();
        
        if (result.valid) {
            statusMsg.className = 'status-message success';
            statusMsg.textContent = '✅ ' + result.message;
            clearAllConflicts();
        } else {
            statusMsg.className = 'status-message error';
            statusMsg.textContent = '❌ ' + result.message;
            highlightConflicts(result.conflicts);
        }
    } catch (error) {
        statusMsg.className = 'status-message error';
        statusMsg.textContent = '❌ Error: ' + error.message;
    } finally {
        validateBtn.disabled = false;
    }
}

// Reset board
function resetBoard() {
    const resetBtn = document.getElementById('resetBtn');
    const statusMsg = document.getElementById('statusMessage');
    
    // Confirm reset
    if (!confirm('Are you sure you want to clear the board?')) {
        return;
    }
    
    resetBtn.disabled = true;
    resetBtn.classList.add('loading');
    
    // Clear all cells with animation
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const input = document.getElementById(`cell_${i}_${j}`);
            setTimeout(() => {
                input.value = '';
                input.className = 'sudoku-input';
            }, (i * 9 + j) * 20);
        }
    }
    
    statusMsg.className = 'status-message info';
    statusMsg.textContent = '🔄 Board cleared!';
    
    setTimeout(() => {
        statusMsg.textContent = '';
        resetBtn.disabled = false;
        resetBtn.classList.remove('loading');
        updateStatistics();
    }, 200);
}

// Fill example puzzle
function fillExample() {
    const examplePuzzle = [
        [5,3,0,0,7,0,0,0,0],
        [6,0,0,1,9,5,0,0,0],
        [0,9,8,0,0,0,0,6,0],
        [8,0,0,0,6,0,0,0,3],
        [4,0,0,8,0,3,0,0,1],
        [7,0,0,0,2,0,0,0,6],
        [0,6,0,0,0,0,2,8,0],
        [0,0,0,4,1,9,0,0,5],
        [0,0,0,0,8,0,0,7,9]
    ];
    
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const input = document.getElementById(`cell_${i}_${j}`);
            if (examplePuzzle[i][j] !== 0) {
                input.value = examplePuzzle[i][j];
            }
        }
    }
    
    updateStatistics();
    document.getElementById('statusMessage').textContent = '📝 Example puzzle loaded!';
    document.getElementById('statusMessage').className = 'status-message info';
}

// Get board data
function getBoardData() {
    const data = {};
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const input = document.getElementById(`cell_${i}_${j}`);
            data[`cell_${i}_${j}`] = input.value;
        }
    }
    return data;
}

// Highlight conflicts
function highlightConflicts(conflicts) {
    clearAllConflicts();
    conflicts.forEach(cellId => {
        const input = document.getElementById(cellId);
        if (input) {
            input.classList.add('conflict');
        }
    });
}

// Remove conflict from single cell
function removeConflict(cellId) {
    const input = document.getElementById(cellId);
    if (input) {
        input.classList.remove('conflict');
    }
}

// Clear all conflicts
function clearAllConflicts() {
    document.querySelectorAll('.sudoku-input.conflict').forEach(input => {
        input.classList.remove('conflict');
    });
}

// Update statistics
function updateStatistics() {
    let filled = 0;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const input = document.getElementById(`cell_${i}_${j}`);
            if (input.value) {
                filled++;
            }
        }
    }
    
    const empty = 81 - filled;
    document.getElementById('filledCells').textContent = `${filled}/81`;
    document.getElementById('emptyCells').textContent = `${empty}/81`;
}

// Confetti animation
function showConfetti() {
    const confettiPieces = 50;
    
    for (let i = 0; i < confettiPieces; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = '-10px';
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '9999';
        
        document.body.appendChild(confetti);
        
        // Animate
        const duration = 2000 + Math.random() * 1000;
        const keyframes = [
            { 
                transform: 'translate(0, 0) rotate(0deg)', 
                opacity: 1 
            },
            { 
                transform: `translate(${Math.random() * 200 - 100}px, ${window.innerHeight + 10}px) rotate(${Math.random() * 360}deg)`, 
                opacity: 0 
            }
        ];
        
        confetti.animate(keyframes, {
            duration: duration,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        
        // Remove after animation
        setTimeout(() => {
            confetti.remove();
        }, duration);
    }
}

// Keyboard shortcuts info
console.log('🎮 Sudoku Solver Shortcuts:');
console.log('Ctrl+S or Cmd+S: Solve');
console.log('Ctrl+R or Cmd+R: Reset');
console.log('Tab: Move to next cell');
console.log('Arrow Keys: Navigate');
