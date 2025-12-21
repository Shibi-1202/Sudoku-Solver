from flask import Flask, render_template, request, jsonify
from Sudoku import solve, valid
import copy
import json

app = Flask(__name__)

def get_board_from_input(data):
    """Convert input data to a 2D board"""
    board = []
    for i in range(9):
        row = []
        for j in range(9):
            value = data.get(f"cell_{i}_{j}", "")
            if value == "":
                row.append(0)
            else:
                try:
                    row.append(int(value))
                except:
                    row.append(0)
        board.append(row)
    return board

def is_valid_sudoku(board):
    """Validate if the input sudoku is valid"""
    for row in range(9):
        for col in range(9):
            if board[row][col] != 0:
                # Check if the number can be placed at this position
                num = board[row][col]
                # Temporarily remove the number
                board[row][col] = 0
                if not valid(board, row, col, num):
                    board[row][col] = num
                    return False
                board[row][col] = num
    return True

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/solve', methods=['POST'])
def solve_sudoku():
    try:
        data = request.get_json()
        board = get_board_from_input(data)
        
        # Validate the input
        if not is_valid_sudoku(copy.deepcopy(board)):
            return jsonify({'success': False, 'message': 'Invalid Sudoku puzzle! Check for conflicts.'}), 400
        
        # Create a copy to solve
        board_copy = copy.deepcopy(board)
        
        if solve(board_copy):
            # Convert solved board to dictionary format
            result = {}
            for i in range(9):
                for j in range(9):
                    result[f"cell_{i}_{j}"] = board_copy[i][j]
            return jsonify({'success': True, 'solution': result, 'message': 'Sudoku solved successfully!'})
        else:
            return jsonify({'success': False, 'message': 'No solution exists for this puzzle!'}), 400
    
    except Exception as e:
        return jsonify({'success': False, 'message': f'Error: {str(e)}'}), 500

@app.route('/api/validate', methods=['POST'])
def validate():
    try:
        data = request.get_json()
        board = get_board_from_input(data)
        
        # Check for conflicts
        conflicts = []
        for row in range(9):
            for col in range(9):
                if board[row][col] != 0:
                    num = board[row][col]
                    board[row][col] = 0
                    if not valid(board, row, col, num):
                        conflicts.append(f"cell_{row}_{col}")
                    board[row][col] = num
        
        if conflicts:
            return jsonify({'valid': False, 'conflicts': conflicts, 'message': 'Conflicts found!'})
        else:
            return jsonify({'valid': True, 'message': 'No conflicts found!'})
    
    except Exception as e:
        return jsonify({'valid': False, 'message': f'Error: {str(e)}'}), 500

@app.route('/api/reset', methods=['POST'])
def reset():
    return jsonify({'success': True, 'message': 'Board reset'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
