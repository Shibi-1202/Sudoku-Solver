import tkinter as tk
from tkinter import messagebox
from Sudoku import solve, valid  

# Validation of input (1-9)
def validate_input(P):
    if P == "" or (P.isdigit() and 1 <= int(P) <= 9):
        return True
    return False

# Navigate through the cells
def move_focus(event, i, j):
    if event.keysym == 'Right' and j < 8:
        entries[i][j + 1].focus()
    elif event.keysym == 'Left' and j > 0:
        entries[i][j - 1].focus()
    elif event.keysym == 'Down' and i < 8:
        entries[i + 1][j].focus()
    elif event.keysym == 'Up' and i > 0:
        entries[i - 1][j].focus()
    elif event.keysym == 'Return':  
        if j < 8:
            entries[i][j + 1].focus()
        elif i < 8:
            entries[i + 1][0].focus()

# Highlight user inputed cells for better readablity 
def highlight_input_cells():
    board = get_board()
    for row in range(9):
        for col in range(9):
            num = board[row][col]
            if num != 0 and not valid(board, row, col, num):
                entries[row][col].config(bg="red")  
            else:
                entries[row][col].config(bg="white")  

# Functionality of solve button
def solve_button_click():
    board = get_board()
    highlight_input_cells()  
    if solve(board):
        display_board(board)
        messagebox.showinfo("Success", "Sudoku solved successfully!")
    else:
        messagebox.showerror("Error", "No solution exists.")

# Functionality of reset button 
def reset_board():
    for i in range(9):
        for j in range(9):
            entries[i][j].delete(0, tk.END)
            entries[i][j].config(bg="white")

# Display the board in GUI
def display_board(board):
    for i in range(9):
        for j in range(9):
            entries[i][j].delete(0, tk.END)
            if board[i][j] != 0:
                entries[i][j].insert(0, str(board[i][j]))

# To get the unsolved board 
def get_board():
    board = []
    for i in range(9):
        row = []
        for j in range(9):
            value = entries[i][j].get()
            if value == "":
                row.append(0)
            else:
                row.append(int(value))
        board.append(row)
    return board

# TKinter 
root = tk.Tk()
root.title("Sudoku Solver")

# Validation command to ensure only valid input is accepted
validcmd = (root.register(validate_input), '%P')

# Grid of Entry widgets (9x9 containing 'None' for the Sudoku board)
entries = [[None for p in range(9)] for q in range(9)]

# Background of the GUI
main_frame = tk.Frame(root, bg="black", bd=2)
main_frame.grid(padx=10, pady=10)

for i in range(9):
    for j in range(9):
        # Frame to create a border
        cell_frame = tk.Frame(main_frame, highlightbackground="black", highlightthickness=2 if (i % 3 == 0 or j % 3 == 0) else 1)
        cell_frame.grid(row=i, column=j, padx=(0, 3) if (j+1) % 3 == 0 else 1, pady=(0, 3) if (i+1) % 3 == 0 else 1)

        # Creating a entry box for all cell
        entries[i][j] = tk.Entry(cell_frame, width=2 ,font=('Arial', 18), justify='center', validate="key", validatecommand=validcmd)
        entries[i][j].pack(padx=1, pady=1)

        # Bind the arrow keys and Enter key for navigation
        entries[i][j].bind('<KeyPress>', lambda event, row=i, col=j: move_focus(event, row, col))
# Frame for solve and reset button 
button_frame = tk.Frame(root)
button_frame.grid(row=10, column=0, columnspan=9, pady=10)

# Create Solve and Reset buttons inside the Frame 
solve_button = tk.Button(button_frame, text="Solve", command=solve_button_click, font=('Arial', 14))
solve_button.grid(row=0, column=0, padx=10)

reset_button = tk.Button(button_frame, text="Reset", command=reset_board, font=('Arial', 14))
reset_button.grid(row=0, column=1, padx=10)

# Run the GUI event loop
root.mainloop()
