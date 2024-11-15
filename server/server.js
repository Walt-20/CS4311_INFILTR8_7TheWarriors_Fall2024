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
const jsonUserFilePath = path.join(rootDir, 'server', 'user-results', 'results.json')
const uploadedFiles = {};
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
    console.log("in upload")
    if (!req.files || req.files.length === 0) {
        return res.status(400).send('No file uploaded.');
    }

    const userId = req.body.userId
    const projectName = req.body.projectName
    const uploadedFiles = {}

    req.files.forEach(file => {
        let filePath = path.join(file.destination, file.filename)
        uploadedFiles[file.originalname] = filePath
    })

    console.log("this still works")
    const filePath = Object.values(uploadedFiles)[0]

    const machineLearningFolderPath = path.join(rootDir, 'server', 'projects', userId, projectName, 'machine_learning')
    console.log("still working")

    exec(`"${pythonPath}" parse.py "${filePath}" "${machineLearningFolderPath}"`, { cwd: rootDir }, (error, stdout, stderr) => {
        console.log("executing parser")
        if (error) {
            console.error(`exec error: ${error}`)
            return res.status(500).send('Error executing Python script.')
        }
        // After Python execution, read and process the CSV file
        const columnsToExtract = ['ip', 'archetype', 'pluginName', 'severity'];

        const csvFiles = [
            path.join(machineLearningFolderPath, 'data_with_exploits.csv'),
        ];

        const results = [];

        // Function to read a single CSV file
        function parseCSVFile(filePath) {
            return new Promise((resolve, reject) => {
                const fileResults = [];
                fs.createReadStream(filePath)
                    .pipe(csv())
                    .on('data', (data) => {
                        const filteredData = {};
                        columnsToExtract.forEach(col => {
                            if (data[col]) {
                                filteredData[col] = data[col];
                            }
                        });
                        if (filteredData.archetype && filteredData.archetype.toLowerCase() !== 'other') {
                            fileResults.push(filteredData);
                        }
                    })
                    .on('end', () => resolve(fileResults))
                    .on('error', (csvError) => reject(csvError));
            });
        }

        // Parse all CSV files
        Promise.all(csvFiles.map(parseCSVFile))
            .then((allFilesData) => {
                allFilesData.forEach(fileData => results.push(...fileData));

                const groupedResults = results.reduce((acc, item) => {
                    if (!acc[item.ip]) {
                        acc[item.ip] = [];
                    }
                    acc[item.ip].push(item)
                    return acc;
                }, {});

                // Sort results by combined_score in descending order
                const sortedResults = Object.values(groupedResults).flatMap(group => {
                    return group.sort((a, b) => {
                        const scoreA = parseFloat(a.combined_score) || 0
                        const scoreB = parseFloat(b.combined_score) || 0
                        return scoreB - scoreA;
                    })
                })

                const jsonParsedFilePath = path.join(rootDir, 'server', 'projects', userId, projectName, 'parsed-results', 'results.json')
                const jsonData = JSON.stringify(results, null, 2)
                const jsonPath = path.join(jsonParsedFilePath)

                fs.writeFile(jsonPath, jsonData, (err) => {
                    if (err) {
                        console.error('Error writing JSON file: ', err);
                        return res.status(500).send({ message: 'Error savings results' });
                    }
                    return res.status(200).send({ message: 'Results saved successfully', filepath: jsonPath });
                });
            })
            .catch((error) => {
                console.error('Error processing CSV files:', error);
                return res.status(500).send('Error processing CSV files');
            });
    });
});

app.post('/start-analysis', upload.single('file'), (req, res) => {
    const { disallowedIps, disallowedEntryPoints } = req.body;

    if (!disallowedIps || !disallowedEntryPoints) {
        return res.status(400).send('Invalid data')
    }

    const disallowedIpsStr = disallowedIps.join(','); // Convert array to comma-separated string
    const disallowedEntryPointsStr = disallowedEntryPoints.join(','); // Convert array to comma-separated string

    const command = `"${pythonPath}" main.py "${uploadedFiles[1]}" "${disallowedIpsStr}" "${disallowedEntryPointsStr}"`


    exec(command, { cwd: rootDir }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing Python script: ${error}`);
            return res.status(500).send('Error executing analysis');
        }

        // After Python execution, read and process the CSV file
        const csvFilePath = path.join(rootDir, 'machine_learning', 'data_with_exploits.csv');
        const columnsToExtract = ['ip', 'archetype', 'pluginName', 'severity'];

        const results = [];

        // Reading the CSV file and extracting specific columns
        fs.createReadStream(csvFilePath)
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
                const jsonData = JSON.stringify(results, null, 2);


                fs.writeFile(jsonUserFilePath, jsonData, (err) => {
                    if (err) {
                        console.error('Error writing JSON file:', err);
                        return res.status(500).send('Error saving results');
                    }
                    res.status(200).send('Results saved successfully');
                });
            })
            .on('error', (csvError) => {
                console.error('Error reading CSV:', csvError);
                return res.status(500).send('Error processing CSV file');
            });
    });
});

app.post('/user-projects', (req, res) => {
    const userId = req.body.userId
    const userProjectsPath = path.join(rootDir, 'server', 'projects', userId)
    if (!fs.existsSync(userProjectsPath)) {
        return res.status(404).send('User not found')
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

app.get('/parsed', (req, res) => {
    res.sendFile(jsonParsedFilePath);
})

app.get('/user-results', (req, res) => {
    res.sendFile(jsonUserFilePath);
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

app.listen(5001, () => {
    console.log('Server is running on port 5001');
});