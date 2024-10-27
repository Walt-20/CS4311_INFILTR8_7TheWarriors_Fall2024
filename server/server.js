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
    console.log(`the fuq is ${filePath}`);
    console.log(`the fuq is ${rootDir}`);
    exec(`python main.py "${filePath}"`, { cwd: rootDir }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).send('Error processing file');
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return res.status(500).send('Error processing file');
        }
        res.send(stdout);

        const csvFiles = [
            path.join(rootDir, 'machine_learning', 'data_with_exploits.csv'),
            path.join(rootDir, 'machine_learning', 'ranked_entry_points.csv'),
        ];
        const columnsToExtract = ['ip', 'archetype', 'pluginName', 'combined_score'];
        
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
                        fileResults.push(filteredData);
                    })
                    .on('end', () => resolve(fileResults))
                    .on('error', (csvError) => reject(csvError));
            });
        }
        
        // Parse all CSV files
        Promise.all(csvFiles.map(parseCSVFile))
            .then((allFilesData) => {
                allFilesData.forEach(fileData => results.push(...fileData));
        
                // Sort results by combined_score in descending order
                results.sort((a, b) => {
                    const scoreA = parseFloat(a.combined_score) || 0;
                    const scoreB = parseFloat(b.combined_score) || 0;
                    return scoreB - scoreA; // Sorts from highest to lowest score
                });
        
                // Send the combined and sorted data
                res.json({
                    extractedColumns: results // Send combined and ranked extracted columns from all CSVs
                });
            })
            .catch((error) => {
                console.error('Error processing CSV files:', error);
                return res.status(500).send('Error processing CSV files');
            });
    });
});

app.listen(5001, () => {
    console.log('Server is running on port 5001');
});