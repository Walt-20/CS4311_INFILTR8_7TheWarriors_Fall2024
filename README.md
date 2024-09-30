### INFILTR8 Description

The Intelligent Network Findings with In-Depth Learning for Targeted Reconnaissance (INFILTR8) system is designed to assist analysts in performing automated reconnaissance and vulnerability assessment during penetration testing. By leveraging a Machine Learning (ML) algorithm, the system ingests reconnaissance files and generates a prioritized list of potential entry points, such as unauthorized port bypasses, default credentials, unpatched software exploits, weak passwords, and protocols missing encryption. This tool serves analysts by expediting the vulnerability identification process and presenting targeted entry points for further investigation, making it a critical tool for improving security testing efficiency. INFILTR8 also allows analysts to specify device types and entry points for a more distinctive analysis test.

INFILTR8 assists the urge for secure and resilient systems by automating the early stages of penetration testing. In addition to automating reconnaissance, INFILTR8 provides features that enable analysts to schedule analyses, monitor progress, adjust test scopes, and export compiled results. This comprehensive functionality makes INFILTR8 an invaluable asset for penetration testers and cybersecurity experts focused on discovering and mitigating vulnerabilities in defense-related systems.

## Database Setup
1. Install Neo4J Desktop App: https://neo4j.com/download/?utm_source=Google&utm_medium=PaidSearch&utm_campaign=Evergreen&utm_content=AMS-Search-SEMBrand-Evergreen-None-SEM-SEM-NonABM&utm_term=download%20neo4j&utm_adgroup=download&gad_source=1&gclid=Cj0KCQjwmOm3BhC8ARIsAOSbapW0DHOiM-gVfv3rSdM6Y2MAd3HYZy_6v5_2PMAjM--86RAzx66cFgQaAon-EALw_wcB
2. Create a Neo4J Account
3. Select the +New button in the Projects section within the Neo4J Destop App
4. Select the +Add button in the created Project
5. Set the database password
6. Update the .env folder with the new password to the variable NEO4J_AUTH_KEY

## Installation 
Before running the installation commands,ensure you have a .env file named .env with your database credentials inside the python-backend folder.

For Linux systems run:
```bash   
linuxinstallation.sh
```
For Windows systems run:
```bash
windowsinstallation.ps1
```

## Launching INFILTR8

To start the server, both the backend and the front end need to be launched.

Launching backend Flask app in Windows:
```bash
./python-backend/venv/Scripts/activate 

python  ./python-backend/run.py
```
Launching backend Flask app in Linux:
```bash
source ./python-backend/venv/bin/activate 

python ./python-backend/run.py
```
Launching frontend Svelte app:
```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```


## Stack Foundation 

- **Frontend**: Svelte
- **Backend**: Node.js
- **Package Manager**: npm
- **Database**: Neo4J Enviornment 
