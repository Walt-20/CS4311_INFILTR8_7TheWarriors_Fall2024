#! /bin/bash

source ~/.nvm/nvm.sh

nvm use 20.17.0

sudo neo4j start

source python-backend/venv/bin/activate
python python-backend/run.py &
PYTHON_PID=$!

node server/server.js &
EXPRESS_PID=$!

sudo env "PATH=$PATH" npm run dev --open
NPM_PID=$!

wait $NPM_PID

kill $NPM_PID 2>/dev/null#! /bin/bash
kill $NODEJS_PID 2>/dev/null
kill $PYTHON_PID 2>/dev/null

#Deactivate virtual environments and Neo4J
deactivate
sudo neo4j stop

#Kill all background processes
trap "trap - SIGTERM && kill -- -$$" SIGINT SIGTERM EXIT


