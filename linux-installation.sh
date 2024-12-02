#! /bin/bash

current_directory=$(pwd)
echo $current_directory

sudo apt install gnome-terminal
sudo apt install nodejs
sudo apt install python3.11-venv
sudo apt install python-is-python3

cd ./src
npm ci

sudo add-apt-repository -y ppa:openjdk-r/ppa

wget -q -O - https://debian.neo4j.com/neotechnology.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/neotechnology.gpg
echo 'deb [signed-by=/etc/apt/keyrings/neotechnology.gpg] https://debian.neo4j.com stable latest' | sudo tee -a /etc/apt/sources.list.d/neo4j.list
sudo apt-get update

sudo apt-get install neo4j=1:5.24.0

#Start server
sudo neo4j-admin server start

#Load database
sudo neo4j-admin database load --from-path="$current_directory/INFILTR8-DUMP" INFILTR8 --verbose

#Set password 
sudo neo4j-admin dbms set-initial-password INFILTR8

#Close server
sudo neo4j-admin server stop

cd ../python-backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt --no-cache
deactivate

#Express Server
cd ../server
npm install