#! /bin/bash

export NVM_DIR="$HOME/.config/nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm

REQUIRED_NODE_VERSION="v20.17.0"
INSTALL_DIR="/opt/infiltr8"
CONFIG_FILE="$INSTALL_DIR/config.ini"

echo $NVM_DIR
ls -la $NVM_DIR

check_node_version() {
    if ! command -v nvm &> /dev/null; then
        echo "NVM is not installed or not sourced. Please ensure NVM is set up."
        return 1
    fi

    nvm use 20.17.0
    INSTALLED_NODE_VERSION=$(node -v)
    if [ "$INSTALLED_NODE_VERSION" != "v20.17.0" ]; then
        echo "Incorrect Node.js version. Found $INSTALLED_NODE_VERSION, required v20.17.0."
        return 1
    fi
    return 0
}

check_java_version() {
	INSTALLED_JAVA_VERSION=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}' | cut -d. -f1)
	echo "$INSTALLED_JAVA_VERSION"
	if [[ "$INSTALLED_JAVA_VERSION" != "21" && "$INSTALLED_JAVA_VERSION" != "17" ]]; then
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
	
	#install
	current_directory=$(pwd)
	echo $current_directory

	mkdir -p "$INSTALL_DIR"

	cp -r $current_directory/* "$INSTALL_DIR"

	if [! -f "$CONFIG_FILE" ]; then
		echo "[Installation]" > "$CONFIG_FILE"
		echo "installed = false" >> "$CONFIG_FILE"
	fi


	sudo apt install gnome-terminal
	sudo apt install nodejs

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
	cypher-shell "CREATE (n:Admin {username: 'admin',password:'admin'})" -u "neo4j" -p "INFILTR8"

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

	sed -i 's/installed = false/installed = true/' "$CONFIG_FILE"
	echo "Installation completed."

else
	echo "Project already installed."
fi
	echo "Installing INFILTR8."

