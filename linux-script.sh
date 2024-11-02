#! /bin/bash

cd ./src
npm run dev --open &

sudo neo4j start 

cd ../python-backend
source venv/bin/activate
python run.py
deactivate
sudo neo4j stop



