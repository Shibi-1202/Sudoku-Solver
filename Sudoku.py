# Function to check if a number can be placed in the given cell
def valid(board, row, col, num):
    for x in range(9):
        if board[row][x] == num or board[x][col] == num:
            return False

    startrow = (col // 3) * 3
    startcol = (row // 3) * 3
    for i in range(0,3):
        for j in range(0,3):
            if board[startcol+i][startrow+j] == num:
                return False
    return True

# Backtracking function to solve the Sudoku board
def solve(board):
    for row in range(9):
        for col in range(9):
            if board[row][col] == 0:
                for num in range(1, 10):
                    if valid(board, row, col, num):
                        board[row][col] = num
                        if solve(board):
                            return True
                        board[row][col] = 0
                return False
    return True

# Function to print the Sudoku board
def print_board(board):
    for i in range (len(board)):
        if i % 3 == 0 and i != 0:
            print("- - - - - - - - - - ")

        for j in range(len(board[0])):
            if j % 3 == 0 and j != 0:
                print("|",end = "")

            if j == 8:
                print(board[i][j])
            else:
                print(str(board[i][j]) + " " , end = "")

