import express from 'express';
import multer from 'multer';
import { exec } from 'child_process';
import path, { dirname } from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import cors from 'cors';
import csv from 'csv-parser';

const app = express();
const upload = multer({ dest: 'uploads/' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const targetDir = path.join(__dirname, 'results');
const jsonFilePath = path.join(targetDir, 'results.json');

app.use(cors());

app.post('/upload', upload.single('file'), (req, res) => {
    console.log(req.file);
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    console.log('uploading file');
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

app.get('/results', (req, res) => {
    res.sendFile(jsonFilePath);
});

app.listen(5001, () => {
    console.log('Server is running on port 5001');
});