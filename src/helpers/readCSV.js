const fs = require('fs');
const csv = require('csv-parser');

async function readCSV(filePath = "./config/login.csv") {
    const accounts = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => accounts.push(data))
            .on('end', () => resolve(accounts))
            .on('error', reject);
    });
}

module.exports = readCSV;
