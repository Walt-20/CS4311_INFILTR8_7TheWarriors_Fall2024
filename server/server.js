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
    exec(`python3 main.py "${filePath}"`, { cwd: rootDir }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).send('Error processing file');
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return res.status(500).send('Error processing file');
        }

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

                console.log(groupedResults);
        
                // Sort results by combined_score in descending order
                const sortedResults = Object.values(groupedResults).flatMap(group => {
                    return group.sort((a, b) => {
                        const scoreA = parseFloat(a.combined_score) || 0
                        const scoreB = parseFloat(b.combined_score) || 0
                        return scoreB - scoreA;
                    })
                })

                console.log(sortedResults);
                const jsonFilePath = path.join(rootDir, 'server', 'results', 'results.json')
                const jsonData = JSON.stringify(results, null, 2)

                fs.writeFile(jsonFilePath, jsonData, (err) => {
                    if (err) {
                        console.error('Error writing JSON file: ', err);
                        return res.status(500).send('Error savings results');
                    }
                    res.send('Results created');
                })
            })
            .catch((error) => {
                console.error('Error processing CSV files:', error);
                return res.status(500).send('Error processing CSV files');
            });
    });
});

app.get('/results', (req, res) => {
    res.sendFile(jsonFilePath);
})

app.listen(5001, () => {
    console.log('Server is running on port 5001');
});