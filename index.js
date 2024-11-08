const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const readCSV = require('./src/helpers/readCSV');
const login = require('./src/steps/login');
const navigateToTargetPage = require('./src/steps/goToRH');
const fillFormAndContinue = require('./src/steps/fillData');
const triggerPDFDownload = require('./src/steps/printRH');
const logout = require('./src/steps/logout');
const logoutFail = require('./src/steps/logoutFail');

let failed = false;

(async () => {
    const today = new Date();
    const dateFolder = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const downloadPath = path.resolve(__dirname, 'RHs', dateFolder);

    if (!fs.existsSync(downloadPath)) {
        fs.mkdirSync(downloadPath, { recursive: true });
    }

    const accounts = await readCSV();
    const browser = await puppeteer.launch({
        headless: false,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process',
        ]
    });
    const page = await browser.newPage();
    page.on('dialog', async dialog => await dialog.accept());

    const client = await page.target().createCDPSession();
    await client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: downloadPath,
    });

    console.log("Iniciando el proceso de emisión de R.H. para los DNI's proporcionados");

    let totalIntentos = 0;
    let exitosos = 0;
    let fallidos = [];

    for (const account of accounts) {
        totalIntentos++;
        const { dni, clavesol, tipo_servicio, sueldo } = account;

        try {
            if (failed) {
                failed = await logoutFail(page); // Asegurarse de cerrar cualquier sesión antes de iniciar una nueva

            }
            await login(page, dni, clavesol);

            await navigateToTargetPage(page, process.env.RUC_MUNICIPALIDAD);
            const frame = await getMainFrame(page);

            await fillFormAndContinue(frame, tipo_servicio, sueldo);
            await triggerPDFDownload(frame);

            // Espera para que el archivo se descargue
            await new Promise(resolve => setTimeout(resolve, 2000));

            const recentFileName = getMostRecentFileInDirectory(downloadPath);
            if (recentFileName && recentFileName.endsWith('.pdf')) {
                const originalFilePath = path.join(downloadPath, recentFileName);
                const newFilePath = path.join(downloadPath, `${dni}.pdf`);
                fs.renameSync(originalFilePath, newFilePath);
                exitosos++;
            } else {
                throw new Error(`No se encontró un archivo PDF para el DNI ${dni}.`);
            }

            await logout(page);  // Desloguearse al terminar el proceso para el usuario actual

        } catch (error) {
            await logout(page);
            console.error(`Error con el DNI ${dni} no se pudo generar R.H, el error que se encontró fue: `, error.message);
            fallidos.push({ dni, error: error.message });
            // Intentar desloguearse en caso de error antes de continuar con el siguiente usuario
            failed = await logoutFail(page);
        }
    }

    const summary = `
    Resumen del Proceso de Emisión de R.H.:
    Total de Intentos: ${totalIntentos}
    Total Exitosos: ${exitosos}
    Total Fallidos: ${fallidos.length}
    `;

    console.log(summary);

    fs.writeFileSync(path.join(downloadPath, 'resumen.txt'), summary);

    const fallidosLog = fallidos.map(f => `DNI: ${f.dni}, Error: ${f.error}`).join('\n');
    fs.writeFileSync(path.join(downloadPath, 'fallidos.txt'), fallidosLog);

    await browser.close();
})();

async function getMainFrame(page) {
    const iframeElement = await page.waitForSelector('#iframeApplication');
    const frame = await iframeElement.contentFrame();
    if (!frame) throw new Error("No se pudo acceder al iframe : #iframeApplication");
    return frame;
}

function getMostRecentFileInDirectory(directory) {
    const files = fs.readdirSync(directory)
        .map(fileName => ({
            name: fileName,
            time: fs.statSync(path.join(directory, fileName)).mtime.getTime()
        }))
        .sort((a, b) => b.time - a.time);

    return files.length ? files[0].name : null;
}


module.exports = failed;
