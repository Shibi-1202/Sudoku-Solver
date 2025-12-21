__Sudoku Solver__
A Python-based GUI Sudoku Solver built using Tkinter. This tool allows users to input a Sudoku puzzle, validate it, and solve the puzzle. The program visually highlights inputs and offers functionalities to reset the board or attempt to solve the puzzle automatically.

__Features__

1. 9x9 Sudoku Grid: Input your Sudoku puzzle using the interactive grid.
2. Input Validation: Only allows digits between 1 and 9, leaving the grid empty if no number is entered.
3. Ease Of Readablity: Highlights all the input in red, so users can easily read the solution clearly.
4. Automatic Solver: Solve the puzzle by clicking the "Solve" button and the "Reset" button clears the board for another use.

__Screenshots__

![Screenshot 2024-09-29 213249](https://github.com/user-attachments/assets/2659ff63-91dc-4db6-9137-7ff3ce26b538)

![Screenshot 2024-09-29 213536](https://github.com/user-attachments/assets/96c8d7e2-a5de-430f-8920-12cacc0e2607)

![Screenshot 2024-09-29 213732](https://github.com/user-attachments/assets/9f8ef6f7-b90f-4094-bd50-ea93297ee407)

__prequisites__

Before running the program, ensure that you have the following:

- Python 3.x installed on your machine.
- The Tkinter library (comes pre-installed with Python).
- The Sudoku.py file which contains the solve() and valid() functions. This file is crucial for solving and validating the Sudoku puzzles.
  
__Installation__

1. Clone the Repository

Clone the repository to your local machine using the following command: https://github.com/Shibi-1202/Sudoku-Solver.git

2. Ensure Required Files

Ensure you have the following files in your working directory:

SudokuSolver.py: The main file containing the GUI code.

Sudoku.py: This file should contain the _solve()_ and _valid()_ functions that handle the logic for solving and validating the Sudoku puzzle.

3. Run the program by:

   python Sudoku_Gui.py (For the version with GUI)

   python Sudoku.py (For the interpreter version)

__Future Improvements__

1. Add the ability to load a puzzle from a file.
2. Improving the looks of the GUI.
3. Implementing a sudoku game along with this solver.
4. Adding timer to record the time taken to solve and also Adding different difficulties to the sudoku game.
5. Adding strike methods to make It more interesting.

__Built With__

1. python bactracking methods.
2. Gui using Tkinter library widgets.
