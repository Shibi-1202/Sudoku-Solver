# 🎮 Sudoku Solver - Web Edition

A modern web-based Sudoku solver with an enhanced UI/UX, built using Flask, HTML5, CSS3, and JavaScript.

## 🌟 Features

- **Interactive 9x9 Sudoku Grid**: Input your puzzle with real-time validation
- **Smart Solver**: Advanced backtracking algorithm solves any valid Sudoku puzzle
- **Real-time Validation**: Highlights conflicts immediately as you type
- **Keyboard Navigation**: Use arrow keys, Tab, and arrow keys to move through cells
- **Live Statistics**: Track filled vs empty cells
- **Animated Solutions**: Watch the solution populate with a smooth animation
- **Confetti Effect**: Celebrate your solved puzzles!
- **Example Puzzle**: Load a sample puzzle to test
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark Mode UI**: Modern gradient background with glassmorphism effects

## 📋 Prerequisites

- Python 3.7 or higher
- pip (Python package installer)

## 🚀 Local Setup & Running

### 1. Install Dependencies

```bash
cd "c:\Shibi Chakaravarthy\Shibi RTC\My_Projects\Sudoku-Solver-main"
pip install -r requirements.txt
```

### 2. Run the Flask Application

```bash
python app.py
```

The application will start on `http://localhost:5000`

### 3. Open in Browser

Open your web browser and navigate to:
```
http://localhost:5000
```

## 🕹️ How to Use

1. **Enter Puzzle**: Click on cells and enter numbers 1-9 (empty cells are 0)
2. **Validate**: Click "Validate" to check for conflicts
3. **Solve**: Click "Solve" to automatically solve the puzzle
4. **Reset**: Click "Reset" to clear the board
5. **Example**: Click "Load Example" to try a sample puzzle

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Tab | Move to next cell |
| Arrow Keys | Navigate between cells |
| Ctrl+S / Cmd+S | Solve puzzle |
| Ctrl+R / Cmd+R | Reset board |
| Backspace/Delete | Clear cell |

## 🌐 Deploy to the Web

### Option 1: Deploy to Heroku (Recommended for Beginners)

#### Prerequisites:
- Heroku account (free): https://www.heroku.com
- Heroku CLI installed

#### Steps:

1. **Create a `Procfile`** in the project root:
```
web: python app.py
```

2. **Create a `.gitignore`** file:
```
__pycache__/
*.pyc
.DS_Store
venv/
.env
```

3. **Initialize Git and push to Heroku**:
```bash
git init
git add .
git commit -m "Initial commit"
heroku login
heroku create your-app-name
git push heroku main
```

Your app will be live at: `https://your-app-name.herokuapp.com`

---

### Option 2: Deploy to Render.com (Simple & Free)

#### Steps:

1. Create a Render account: https://render.com

2. Create a `render.yaml` file:
```yaml
services:
  - type: web
    name: sudoku-solver
    env: python
    buildCommand: "pip install -r requirements.txt"
    startCommand: "gunicorn app:app"
```

3. Install gunicorn:
```bash
pip install gunicorn
pip freeze > requirements.txt
```

4. Push to GitHub

5. Connect your GitHub repo to Render and deploy

---

### Option 3: Deploy to PythonAnywhere (Easiest)

1. Go to https://www.pythonanywhere.com
2. Create a free account
3. Upload your files via the web interface
4. Configure a web app with Flask
5. Reload the web app

---

### Option 4: Deploy to Azure App Service

#### Prerequisites:
- Azure account (free trial available): https://azure.microsoft.com
- Azure CLI installed

#### Steps:

1. **Create `requirements.txt`** (already done)

2. **Create `app.py` with proper configuration**:
```python
# Add at the end of app.py:
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
```

3. **Create deployment files**:
```bash
az login
az group create --name sudoku-group --location eastus
az appservice plan create --name sudoku-plan --resource-group sudoku-group --sku FREE
az webapp create --resource-group sudoku-group --plan sudoku-plan --name sudoku-solver-app
```

4. **Deploy using Git**:
```bash
az webapp up --name sudoku-solver-app --resource-group sudoku-group
```

Your app will be at: `https://sudoku-solver-app.azurewebsites.net`

---

### Option 5: Deploy to AWS (EC2)

#### Steps:

1. **Create EC2 Instance**:
   - Go to AWS Console
   - Launch an Ubuntu instance
   - Configure security groups to allow port 80 and 443

2. **SSH into instance and setup**:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install python3-pip python3-venv -y
git clone <your-repo-url>
cd Sudoku-Solver-main
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install gunicorn
```

3. **Run with Gunicorn**:
```bash
gunicorn -w 4 -b 0.0.0.0:8000 app:app
```

4. **Setup Nginx reverse proxy** (optional but recommended)

---

### Option 6: Deploy with Docker

1. **Create `Dockerfile`**:
```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["python", "app.py"]
```

2. **Build and run locally**:
```bash
docker build -t sudoku-solver .
docker run -p 5000:5000 sudoku-solver
```

3. **Deploy to Docker Hub or cloud services**

---

## 📁 Project Structure

```
Sudoku-Solver-main/
├── app.py                    # Flask application
├── Sudoku.py                 # Core solver logic
├── Sudoku_GUI.py             # Legacy Tkinter GUI
├── requirements.txt          # Python dependencies
├── Procfile                  # For Heroku
├── README.md                 # This file
├── templates/
│   └── index.html            # Main HTML template
└── static/
    ├── css/
    │   └── style.css         # Styling
    └── js/
        └── script.js         # Client-side logic
```

## 🔧 Troubleshooting

### Port 5000 Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### Module Not Found
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### CORS Issues (for advanced deployment)
Add this to `app.py`:
```python
from flask_cors import CORS
CORS(app)
```

## 🎨 Customization

### Change Colors
Edit `static/css/style.css` and modify `:root` variables:
```css
:root {
    --primary-color: #6366f1;  /* Change this */
    --secondary-color: #ec4899;
    /* ... */
}
```

### Modify Button Styles
Edit the button styles in `style.css`

### Add Features
Extend `static/js/script.js` with new functionality

## 📊 Performance

- Solves most Sudoku puzzles in < 100ms
- Optimized backtracking algorithm
- Client-side validation for instant feedback

## 📝 License

This project is open source and free to use.

## 🙋 Support

If you encounter any issues:
1. Check the browser console (F12) for errors
2. Verify Flask is running
3. Ensure all files are in the correct directories
4. Try clearing browser cache

## 🎓 Learning Resources

- Flask Documentation: https://flask.palletsprojects.com
- Sudoku Algorithm: https://en.wikipedia.org/wiki/Sudoku_solving_algorithms
- Web Development: https://developer.mozilla.org

---

**Happy Solving! 🎮✨**

Built with ❤️ using Flask, HTML5, CSS3, and JavaScript
