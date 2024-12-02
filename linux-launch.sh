#! /bin/bash

sudo neo4j start 

source python-backend/venv/bin/activate
python python-backend/run.py &

node server/server.js &

npm run dev --open

#Deactivate virtual environments and Neo4J
deactivate
sudo neo4j stop

#Kill all background processes
trap "trap - SIGTERM && kill -- -$$" SIGINT SIGTERM EXIT


