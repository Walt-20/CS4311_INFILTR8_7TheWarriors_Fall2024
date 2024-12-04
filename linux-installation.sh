#! /bin/bash

REQUIRED_JAVA_VERSION=("21" "17")
REQUIRED_NODE_VERSION="v20.17.0"
INSTALL_DIR="/opt/infiltr8"
CONFIG_FILE="$INSTALL_DIR/config.ini"

check_node_version() {
	if ! command -v node &> /dev/null; then
		echo "Node.js is not installed. Please install Node.js $REQUIRED_NODE_VERSION."
		return 1
	fi

	INSTALLED_NODE_VERSION=$(node -v)
	if [ "$INSTALLED_NODE_VERSION" != "$REQUIRED_NODE_VERSION" ]; then
		echo "Incorrect Node.js version. Found $INSTALLED_NODE_VERSION, required $REQUIRED_NODE_VERSION."
		return 1
	fi
	return 0
}

check_java_version() {
	if ! command -v java &> /dev/null; then
		echo "Java is not installed. Please install Java version 21 or 17."
		return 1
	fi

	INSTALLED_JAVA_VERSION=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}' | cut -d. -f1)
	if [[ ! " ${REQUIRED_JAVA_VERSIONS[@]} " =~ " $INSTALLED_JAVA_VERSION " ]]; then
        	echo "Java version $INSTALLED_JAVA_VERSION is not supported. Required versions are 21 or 17."
	        return 1
	fi
	return 0
}

if ! check_node_version; then
	exit 1
fi

if ! check_java_version; then
	exit 1
fi

if [ ! -f "$CONFIG_FILE" ] || ! grep -q "installed = true" "$CONFIG_FILE"; then
    echo "Installing project to $INSTALL_DIR"

	if [! -f "$CONFIG_FILE" ]; then
		echo "[Installation]" > "$CONFIG_FILE"
		echo "installed = false" >> "$CONFIG_FILE"
	fi

	#install

	sed -i 's/installed = false/installed = true/' "$CONFIG_FILE"
	echo "Installation completed."

else
	echo "Project already installed."
fi
	echo "Installing INFILTR8."
current_directory=$(pwd)
echo $current_directory

sudo apt install gnome-terminal
sudo apt install nodejs
# sudo apt install python3.11-venv
# sudo apt install python-is-python3

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

#Create Admin node
cypher-shell "CREATE (n:Admin {username: 'admin',password:'admin'})"

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
