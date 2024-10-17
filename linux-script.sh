#! /bin/bash

cd ./src
npm install -i
npm run dev --open &

cd ../python-backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python run.py