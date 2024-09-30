#! /bin/bash

cd ./src
npm ci

cd ../python-backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
deactivate