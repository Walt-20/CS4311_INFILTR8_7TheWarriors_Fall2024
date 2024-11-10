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
const targetParsedDir = path.join(__dirname, 'parsed-results');
const jsonParsedFilePath = path.join(rootDir, 'server', 'parsed-results', 'results.json')
const targetUserDir = path.join(__dirname, 'user-results');
const jsonUserFilePath = path.join(rootDir, 'server', 'user-results', 'results.json')
const uploadedFiles = {};
const pythonPath = path.join(rootDir, 'python-backend', 'venv', 'bin', 'python')


const uploadDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

if (!fs.existsSync(targetParsedDir) || !fs.existsSync(targetUserDir)) {
    fs.mkdirSync(targetParsedDir, { recursive: true })
    fs.mkdirSync(targetUserDir, { recursive: true })
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const newFilename = uniqueSuffix + path.extname(file.originalname)
        cb(null, newFilename)
    }
})

const upload = multer({ storage: storage })

app.use(cors(), express.json());

app.post('/upload', upload.single('file'), (req, res) => {
    
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    
    const filePath = path.join(req.file.path);
    const filename = req.file.originalname;
    uploadedFiles[1] = filePath
    exec(`"${pythonPath}" parse.py "${filePath}"`, { cwd: rootDir }, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`)
            return res.status(500).send('Error executing Python script.')
        }
        // After Python execution, read and process the CSV file
        const columnsToExtract = ['ip', 'archetype', 'pluginName', 'severity'];

        const csvFiles = [
            path.join(rootDir, 'machine_learning', 'data_with_exploits.csv'),
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

                const jsonData = JSON.stringify(results, null, 2)

                fs.writeFile(jsonParsedFilePath, jsonData, (err) => {
                    if (err) {
                        console.error('Error writing JSON file: ', err);
                        return res.status(500).send('Error savings results');
                    }
                    return res.status(200).send({ message: 'Results saved successfully' });
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

app.get('/parsed-results', (req, res) => {
    res.sendFile(jsonParsedFilePath);
})

app.get('/user-results', (req, res) => {
    res.sendFile(jsonUserFilePath);
})

function deleteDirectory(directoryPath) {
    if (fs.existsSync(directoryPath)) {
        fs.readdirSync(directoryPath).forEach((file) => {
            const currentPath = path.join(directoryPath, file);
            if (fs.lstatSync(currentPath).isDirectory()) {
                deleteDirectory(currentPath);
            } else {
                fs.unlinkSync(currentPath);
            }
        });
        fs.rmdirSync(directoryPath)
    }
}

function cleanup() {
    console.log('Cleaning up...')
    deleteDirectory(uploadDir)
    deleteDirectory(targetParsedDir)
    deleteDirectory(targetUserDir)
    console.log('Cleanup complete.')
}

process.on('SIGINT', () => {
    console.log('Shutting Down....')
    cleanup()
    process.exit(0)
})

process.on('SIGTERM', () => {
    console.log('Shutting Down....')
    cleanup()
    process.exit(0)
})

app.listen(5001, () => {
    console.log('Server is running on port 5001');
});