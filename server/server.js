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

app.use(cors());

app.post('/upload', upload.single('file'), (req, res) => {
    console.log(req.file);
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    console.log('uploading file');
    const filePath = path.join(__dirname, req.file.path);
    const rootDir = path.join(__dirname, '..');
    console.log(`the fuq is ${filePath}`);
    console.log(`the fuq is ${rootDir}`);
    exec(`python main.py "${filePath}"`, { cwd: rootDir }, (error, stdout, stderr) => {
        console.log(`stdout: ${stdout}`);
        
        res.send(stdout);

        // After Python execution, read and process the CSV file
        const csvFilePath = path.join(rootDir, 'machine_learning', 'data_with_exploits.csv');
        const columnsToExtract = ['ip', 'archetype', 'pluginName'];

        const results = [];

        console.log(`${csvFilePath}`);

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
                results.push(filteredData);
            })
            .on('end', () => {
                // After CSV processing, send the extracted data
                res.json({
                    extractedColumns: results // Send extracted columns from CSV
                });
                console.log(`${extractedColumns}`);
            })
            .on('error', (csvError) => {
                console.error('Error reading CSV:', csvError);
                return res.status(500).send('Error processing CSV file');
            });
    });
});

app.listen(5001, () => {
    console.log('Server is running on port 5001');
});