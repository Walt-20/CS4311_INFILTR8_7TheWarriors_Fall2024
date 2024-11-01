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
const targetDir = path.join(__dirname, 'results');
const jsonFilePath = path.join(targetDir, 'results.json');


const uploadDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true })
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const newFilename = file.filename + '-' + uniqueSuffix + path.extname(file.originalname)
        cb(null, newFilename)
    }
})

const upload = multer({ storage: storage })

app.use(cors(), express.json());

app.post('/upload', upload.single('file'), (req, res) => {
    console.log(req.file);
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    console.log('uploading file');
    console.log(req.file.path)
    const filePath = path.join(__dirname, req.file.path);
    const rootDir = path.join(__dirname, '..');
    exec(`python parse.py "${filePath}"`, { cwd: rootDir }, (error, stdout, stderr) => {

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

                fs.writeFile(jsonFilePath, jsonData, (err) => {
                    if (err) {
                        console.error('Error writing JSON file:', err);
                        return res.status(500).send('Error saving results');
                    }
                    res.send('Results saved successfully');
                });
            })
            .on('error', (csvError) => {
                console.error('Error reading CSV:', csvError);
                return res.status(500).send('Error processing CSV file');
            });
        });
});

app.post('/start-analysis', (req, res) => {
    const { disallowedIps, disallowedEntryPoints } = req.body;

    if (!disallowedIps || !disallowedEntryPoints ) {
        return res.status(400).send('Invalid data')
    }

    console.log('disallowedIps: ', disallowedIps)
    console.log('disallowedEntryPoints: ', disallowedEntryPoints)
})

app.get('/results', (req, res) => {
    res.sendFile(jsonFilePath);
});

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
    deleteDirectory(targetDir)
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