# Move to the src directory
Set-Location ./src

# Start development server in background
Start-Process -FilePath npm -ArgumentList "run", "dev", "--open" -Wait:$false

Set-Location ..

# Start database server
neo4j-windows\bin\neo4j start

# Move to the python-backend directory
Set-Location ./python-backend

# Activate the virtual environment
.\venv\Scripts\Activate

# Start the Python backend application
python run.py