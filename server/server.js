import express from 'express';
import multer from 'multer';
import { exec } from 'child_process';
import path, { dirname } from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import cors from 'cors';
import csv from 'csv-parser';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = path.join(__dirname, '..');
const pythonPath = path.join(rootDir, 'python-backend', 'venv', 'bin', 'python')

app.use(cors(), express.json(), express.urlencoded({ extended: true }));

function initializeFolderStructure() {
    const projectsFolderPath = path.join(rootDir, 'server', 'projects')
    if (!fs.existsSync(projectsFolderPath)) {
        fs.mkdirSync(projectsFolderPath, { recursive: true })
    }
}

initializeFolderStructure();

function createProjectFolder(userId, projectName) {
    const projectFolderPath = path.join(rootDir, 'server', 'projects', userId, projectName)
    const uploadsFolderPath = path.join(projectFolderPath, 'uploads')
    const parsedResultsFolderPath = path.join(projectFolderPath, 'parsed-results')
    const userResultsFolderPath = path.join(projectFolderPath, 'user-results')
    const machineLearningFolderPath = path.join(projectFolderPath, 'machine_learning')
    if (!fs.existsSync(uploadsFolderPath)) {
        fs.mkdirSync(uploadsFolderPath, { recursive: true })
    }

    if (!fs.existsSync(parsedResultsFolderPath)) {
        fs.mkdirSync(parsedResultsFolderPath, { recursive: true })
    }

    if (!fs.existsSync(userResultsFolderPath)) {
        fs.mkdirSync(userResultsFolderPath, { recursive: true })
    }

    if (!fs.existsSync(machineLearningFolderPath)) {
        fs.mkdirSync(machineLearningFolderPath, { recursive: true })
    }

    return uploadsFolderPath
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const userId = req.body.userId;
        const projectName = req.body.projectName
        const uploadsFolderPath = createProjectFolder(userId, projectName)
        cb(null, uploadsFolderPath)
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage })

app.post('/upload', upload.array('files'), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).send('No files uploaded.');
    }

    const userId = req.body.userId;
    const projectName = req.body.projectName;

    const machineLearningFolderPath = path.join(
        rootDir,
        'server',
        'projects',
        userId,
        projectName,
        'machine_learning'
    );
    const combinedCSVFilePath = path.join(machineLearningFolderPath, 'data_with_exploits.csv');
    const columnsToExtract = ['ip', 'archetype', 'pluginName', 'severity'];

    const processFilePromises = req.files.map(file => {
        return new Promise((resolve, reject) => {
            const filePath = path.join(file.destination, file.filename);

            // Run the Python script to process the file
            exec(`"${pythonPath}" parse.py "${filePath}" "${machineLearningFolderPath}"`, { cwd: rootDir }, (error) => {
                if (error) {
                    console.error(`Error processing file ${file.filename}:`, error);
                    return reject(error);
                }

                // Append the results of the current CSV file to `data_with_exploits.csv`
                const currentCSVFilePath = path.join(machineLearningFolderPath, 'data_with_exploits.csv');
                if (fs.existsSync(currentCSVFilePath)) {
                    fs.createReadStream(currentCSVFilePath)
                        .pipe(csv())
                        .on('data', (data) => {
                            const filteredData = {};
                            columnsToExtract.forEach(col => {
                                if (data[col]) {
                                    filteredData[col] = data[col];
                                }
                            });
                            if (
                                filteredData.archetype &&
                                filteredData.archetype.toLowerCase() !== 'other'
                            ) {
                                const csvLine = `${filteredData.ip},${filteredData.archetype},${filteredData.pluginName},${filteredData.severity}\n`;
                                fs.appendFileSync(combinedCSVFilePath, csvLine);
                            }
                        })
                        .on('end', resolve)
                        .on('error', reject);
                } else {
                    resolve();
                }
            });
        });
    });

    Promise.all(processFilePromises)
        .then(() => {
            // After combining, generate JSON from `data_with_exploits.csv`
            const results = [];
            fs.createReadStream(combinedCSVFilePath)
                .pipe(csv())
                .on('data', (data) => {
                    const filteredData = {};
                    columnsToExtract.forEach(col => {
                        if (data[col]) {
                            filteredData[col] = data[col];
                        }
                    });
                    if (filteredData.archetype && filteredData.archetype.toLowerCase() !== 'other') {
                        results.push(filteredData);
                    }
                })
                .on('end', () => {
                    const jsonParsedFilePath = path.join(
                        rootDir,
                        'server',
                        'projects',
                        userId,
                        projectName,
                        'parsed-results',
                        'results.json'
                    );
                    fs.writeFile(jsonParsedFilePath, JSON.stringify(results, null, 2), (err) => {
                        if (err) {
                            console.error('Error writing JSON file:', err);
                            return res.status(500).send({ message: 'Error saving results.' });
                        }
                        return res.status(200).send({
                            message: 'Results saved successfully.',
                            filepath: jsonParsedFilePath,
                        });
                    });
                })
                .on('error', (error) => {
                    console.error('Error reading combined CSV file:', error);
                    return res.status(500).send('Error processing combined CSV.');
                });
        })
        .catch((error) => {
            console.error('Error processing files:', error);
            return res.status(500).send('Error processing files.');
        });
});


app.post('/start-analysis', upload.single('file'), (req, res) => {
    const { disallowedIps, disallowedEntryPoints, userId, projectName } = req.body;

    if (!disallowedIps || !disallowedEntryPoints) {
        return res.status(400).send('Invalid data')
    }

    console.log("disallowedIps ", disallowedIps)

    const folderToAnalyze = path.join(rootDir, 'server', 'projects', userId, projectName, 'uploads')
    let fileList = fs.readdirSync(folderToAnalyze, (err, folder) => {
        if (err) {
            console.error('Error reading user projects: ', err)
        }

        const fileMapping = folder.map(file => ({
            fileName: file,
        }))
        console.log(fileMapping)
        console.log("Inside")
        return fileMapping
    })

    console.log(fileList)
    const fileToAnalyze = path.join(folderToAnalyze, fileList[0])
    const machineLearningFolderPath = path.join(rootDir, 'server', 'projects', userId, projectName, 'machine_learning')

    const disallowedIpsStr = disallowedIps.join(','); // Convert array to comma-separated string
    const disallowedEntryPointsStr = disallowedEntryPoints.join(','); // Convert array to comma-separated string

    const command = `"${pythonPath}" main.py "${fileToAnalyze}" "${disallowedIpsStr}" "${disallowedEntryPointsStr}" "${machineLearningFolderPath}"`


    exec(command, { cwd: rootDir }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing Python script: ${error}`);
            return res.status(500).send('Error executing analysis');
        }

        // After Python execution, read and process the CSV file
        const csvFiles = [
            path.join(machineLearningFolderPath, 'data_with_exploits.csv'),
            path.join(machineLearningFolderPath, 'entrypoint_most_info.csv'),
            path.join(machineLearningFolderPath, 'port_0_entries.csv'),
            path.join(machineLearningFolderPath, 'ranked_entry_points.csv'),
        ]
        const columnsToExtract = {
            'data_with_exploits.csv': ['ip', 'port', 'protocol', 'archetype', 'pluginName', 'severity'],
            'entrypoint_most_info.csv': ['ip', 'port', 'vulnerability_count'],
            'port_0_entries.csv': ['ip', 'port', 'protocol', 'archetype', 'pluginName', 'severity'],
            'ranked_entry_points.csv': ['ip', 'port', 'severity_score']
        }

        const results = {};

        // Function to read a single CSV file and extract specific columns
        function parseCSVFile(filePath, columns) {
            return new Promise((resolve, reject) => {
                const fileResults = [];
                fs.createReadStream(filePath)
                    .pipe(csv())
                    .on('data', (data) => {
                        const filteredData = {};
                        columns.forEach(col => {
                            if (data[col]) {
                                filteredData[col] = data[col];
                            }
                        });
                        fileResults.push(filteredData);
                    })
                    .on('end', () => resolve(fileResults))
                    .on('error', (error) => reject(error));
            });
        }

        // Parse all CSV files
        Promise.all(csvFiles.map(filePath => {
            const fileName = path.basename(filePath);
            return parseCSVFile(filePath, columnsToExtract[fileName])
                .then(fileResults => ({ [fileName]: fileResults }));
        }))
            .then(fileResults => {
                // Combine results from all files into a single object
                fileResults.forEach(result => {
                    const key = Object.keys(result)[0];
                    results[key] = result[key];
                });

                // Write combined results to JSON file
                const userResultsFolderPath = path.join(rootDir, 'server', 'projects', userId, projectName, 'user-results');
                if (!fs.existsSync(userResultsFolderPath)) {
                    fs.mkdirSync(userResultsFolderPath, { recursive: true });
                }

                const jsonParsedFilePath = path.join(userResultsFolderPath, 'results.json');
                const jsonData = JSON.stringify(results, null, 2);

                fs.writeFile(jsonParsedFilePath, jsonData, (err) => {
                    if (err) {
                        console.error('Error writing JSON file:', err);
                        return res.status(500).send('Error saving results');
                    }
                    res.status(200).send('Results saved successfully');
                });
            })
            .catch(error => {
                console.error('Error processing CSV files:', error);
                return res.status(500).send('Error processing CSV files');
            });
    });
});

app.post('/user-projects', (req, res) => {
    console.log("Fetching user projects")
    const userId = req.body.userId
    const userProjectsPath = path.join(rootDir, 'server', 'projects', userId)
    if (!fs.existsSync(userProjectsPath)) {
        fs.mkdirSync(userProjectsPath, { recursive: true })
    }

    fs.readdir(userProjectsPath, (err, projects) => {
        if (err) {
            console.error('Error reading user projects: ', err)
            return res.status(500).send('Error reading user projects')
        }

        const projectList = projects.map(project => ({
            projectName: project,
            projectPath: path.join(userProjectsPath, project)
        }))

        console.log(projectList)

        res.status(200).json(projectList)
    })

})

app.post('/parsed', (req, res) => {
    try {
        console.log(req.body.userId)
        console.log(req.body.projectName)
        const userId = req.body.userId;
        const projectname = req.body.projectName;
        const reqParsedPath = path.join(rootDir, 'server', 'projects', userId, projectname, 'parsed-results', 'results.json')
        console.log("Fetching for user " + req.body.userId + " project " + req.body.projectName);
        res.sendFile(reqParsedPath);
    } catch (error) {
        return res.status(404).send('Parsed not found')
    }
})

app.post('/all-user-results', (req, res) => {
    console.log("Fetching user results")
    const userId = req.body.userId
    const userResults = path.join(rootDir, 'server', 'projects', userId)
    if (!fs.existsSync(userResults)) {
        return res.status(404).send('User not found')
    }

    fs.readdir(userResults, (err, projects) => {
        if (err) {
            console.error('Error reading user projects: ', err)
            return res.status(500).send('Error reading user projects')
        }

        const projectList = projects.map(project => ({
            projectName: project,
            projectPath: path.join(userResults, project)
        }))

        console.log(projectList)

        res.status(200).json(projectList)
    })

})

app.post('/user-results', (req, res) => {
    console.log("Fetching user projects")
    const userId = req.body.userId;
    const projectname = req.body.projectname;
    const userResultsPath = path.join(rootDir, 'server', 'projects', userId, projectname, 'user-results', 'results.json')
    if (!fs.existsSync(userResultsPath)) {
        return res.status(404).send('User not found')
    }
    res.sendFile(userResultsPath);
})

app.post('/discard', (req, res) => {
    // console.log(req.body)
    fs.unlinkSync(req.body.filepath, (err) => {
        if (err) {
            return res.status(500).send({ message: 'Error discarding file' });
        } else {
            return res.status(200).send({ message: "Success discarding file" })
        }
    })
})

process.on('SIGINT', () => {
    console.log('Shutting Down....')
    process.exit(0)
})

process.on('SIGTERM', () => {
    console.log('Shutting Down....')
    process.exit(0)
})

app.get("/", (req, res) => {
    res.send("hello");
})

app.listen(5001, () => {
    console.log('Server is running on port 5001');
});