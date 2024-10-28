### INFILTR8 Description

The Intelligent Network Findings with In-Depth Learning for Targeted Reconnaissance (INFILTR8) system is designed to assist analysts in performing automated reconnaissance and vulnerability assessment during penetration testing. By leveraging a Machine Learning (ML) algorithm, the system ingests reconnaissance files and generates a prioritized list of potential entry points, such as unauthorized port bypasses, default credentials, unpatched software exploits, weak passwords, and protocols missing encryption. This tool serves analysts by expediting the vulnerability identification process and presenting targeted entry points for further investigation, making it a critical tool for improving security testing efficiency. INFILTR8 also allows analysts to specify device types and entry points for a more distinctive analysis test.

INFILTR8 assists the urge for secure and resilient systems by automating the early stages of penetration testing. In addition to automating reconnaissance, INFILTR8 provides features that enable analysts to schedule analyses, monitor progress, adjust test scopes, and export compiled results. This comprehensive functionality makes INFILTR8 an invaluable asset for penetration testers and cybersecurity experts focused on discovering and mitigating vulnerabilities in defense-related systems.


## Installation 
Before running the installation commands,ensure you have a .env file named .env with your database credentials inside the python-backend folder.

Run the following command on a linux system:
```bash   
./linux-installation.sh
```

## Launching INFILTR8

To start the app, run the following scrip that initializes the front end, back end, and the database.

```bash
./linux-script.sh
```

## Stack Foundation 

- **Frontend**: Svelte ^4.2.7 , Tailwind ^3.4.9 , Flowbite ^2.5.2
- **Backend**: Node.js ^21.6.1, Python ^3.12.0
- **Package Manager**: npm ^10.8.3g
- **Database**: Neo4J Enviornment ^5.24.2
