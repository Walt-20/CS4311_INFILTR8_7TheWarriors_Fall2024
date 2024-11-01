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

# Change directory back to original location
Set-Location ..

#Install neo4j as a service
neo4j-windows\bin\neo4j windows-service install

#Start server
neo4j-windows\bin\neo4j start

#Load database
neo4j-windows\bin\neo4j-admin database load --from-path="C:\Users\jvazq\Documents\Computer Science Courses\SWE 2\INFILTR8-DUMP" INFILTR8 --verbose

#Close server
neo4j-windows\bin\neo4j stop

