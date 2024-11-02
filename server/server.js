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

app.post('/start-analysis', (req, res) => {
    const { disallowedIps, disallowedEntryPoints } = req.body;

    if (!disallowedIps || !disallowedEntryPoints ) {
        return res.status(400).send('Invalid data')
    }

    console.log('disallowedIps: ', disallowedIps)
    console.log('disallowedEntryPoints: ', disallowedEntryPoints)

    const filePath = path.join(__dirname, req.file.path);
    const rootDir = path.join(__dirname, '..');
    const disallowedIpsStr = disallowedIps.join(','); // Convert array to comma-separated string
    const disallowedEntryPointsStr = disallowedEntryPoints.join(','); // Convert array to comma-separated string

    exec(`python main.py "${filePath}" "${disallowedIpsStr}" "${disallowedEntryPointsStr}"`, { cwd: rootDir }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing Python script: ${error}`);
            return res.status(500).send('Error executing analysis');
        }
        
        console.log(`Python script output: ${stdout}`); // Log the output of the Python script
        console.error(`Python script errors: ${stderr}`); // Log any errors from the Python script

        return res.status(200).send('Analysis completed successfully');
    })
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