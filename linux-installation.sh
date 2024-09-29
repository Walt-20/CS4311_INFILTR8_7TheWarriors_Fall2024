#! /bin/bash

cd ./src
npm install -i

cd ../python-backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt