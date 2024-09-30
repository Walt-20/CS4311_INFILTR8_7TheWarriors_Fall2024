import express from 'express';
import multer from 'multer';
import { exec } from 'child_process';
import path, { dirname } from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

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
    const commandExists = (command, callback) => {
        exec(`command -v ${command}`, (error, stdout, stderr) => {
            callback(!error && stdout.trim().length > 0);
        });
    };

    commandExists('python', (pythonExists) => {
        const pythonCommand = pythonExists ? 'python' : 'python3';
        exec(`${pythonCommand} main.py "${filePath}"`, { cwd: rootDir }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                return res.status(500).send('Error processing file');
            }
            if (stderr) {
                console.error(`Stderr: ${stderr}`);
                return res.status(500).send('Error processing file');
            }
            res.send(stdout);
        });
    });

});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});