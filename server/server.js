import express from 'express';
import multer from 'multer';
import { exec } from 'child_process';
import path, { dirname } from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

const express = require('express');   /// Added this here just in case but can delete anything that seems unnecessary or repetitive 
const multer = require('multer');
const fs = require('fs');
const { parseString } = require('xml2js');
const { Parser } = require('json2csv');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors());

//////////// Parsing Section //////////////////////////////////////////////
app.post('/api/upload-nessus', upload.single('file'), (req, res) => {
    const nessusFilePath = req.file.path;

    // Read and parse the .nessus XML file
    fs.readFile(nessusFilePath, 'utf8', (err, xmlData) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Error reading file');
        }

        // Parse XML to JSON
        parseString(xmlData, (parseErr, result) => {
            if (parseErr) {
                console.error('Error parsing XML:', parseErr);
                return res.status(500).send('Error parsing XML');
            }

            // Extract necessary information
            const hosts = result.NessusClientData_v2.Report[0].ReportHost;
            const records = [];

            hosts.forEach(host => {
                const hostName = host.$.name;

                host.ReportItem.forEach(item => {
                    const record = {
                        Host: hostName,
                        PluginID: item.$.pluginID,
                        PluginName: item.$.pluginName,
                        Severity: item.$.severity,
                        Description: item.description ? item.description[0] : 'N/A',
                        RiskFactor: item.risk_factor ? item.risk_factor[0] : 'N/A',
                    };
                    records.push(record);
                });
            });

            // Convert JSON to CSV
            const fields = ['Host', 'PluginID', 'PluginName', 'Severity', 'Description', 'RiskFactor'];
            const json2csvParser = new Parser({ fields });
            const csvData = json2csvParser.parse(records);

            // Save CSV file
            const csvFilePath = path.join(__dirname, 'uploads', `report_${Date.now()}.csv`);
            fs.writeFile(csvFilePath, csvData, writeErr => {
                if (writeErr) {
                    console.error('Error writing CSV file:', writeErr);
                    return res.status(500).send('Error generating CSV file');
                }

                res.json({ filePath: csvFilePath });
            });
        });
    });
});

app.listen(5001, () => {
    console.log('Server is running on port 5001');
});