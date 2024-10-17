# Change directory to src
Set-Location ./src

# Install dependencies using npm ci
npm ci

# Change directory to python-backend
Set-Location ../python-backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
.\venv\Scripts\activate

# Install requirements from requirements.txt
pip install -r requirements.txt

#Close virtual environment
deactivate