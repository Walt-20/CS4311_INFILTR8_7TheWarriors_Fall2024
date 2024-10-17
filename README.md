### INFILTR8 Description

The Intelligent Network Findings with In-Depth Learning for Targeted Reconnaissance (INFILTR8) system is designed to assist analysts in performing automated reconnaissance and vulnerability assessment during penetration testing. By leveraging a Machine Learning (ML) algorithm, the system ingests reconnaissance files and generates a prioritized list of potential entry points, such as unauthorized port bypasses, default credentials, unpatched software exploits, weak passwords, and protocols missing encryption. This tool serves analysts by expediting the vulnerability identification process and presenting targeted entry points for further investigation, making it a critical tool for improving security testing efficiency. INFILTR8 also allows analysts to specify device types and entry points for a more distinctive analysis test.

INFILTR8 assists the urge for secure and resilient systems by automating the early stages of penetration testing. In addition to automating reconnaissance, INFILTR8 provides features that enable analysts to schedule analyses, monitor progress, adjust test scopes, and export compiled results. This comprehensive functionality makes INFILTR8 an invaluable asset for penetration testers and cybersecurity experts focused on discovering and mitigating vulnerabilities in defense-related systems.

## Installation 
Before instaliing INFILTR8 ensure you have a .env file with your databse credentials inside the pyhton backend folder.
```bash   
linux: linuxinstallation.sh

windows: windowsinstallation.ps1

windows: ./venv/scripts/activate 

virtual pythonbackend/run.py 
linux: source venv/bin/activate 

```

## Launching INFILTR8

Install required dependencies with `npm install` (or `pnpm install` or `yarn`), then start a server:

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
