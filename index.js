const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const readCSV = require('./src/helpers/readCSV');
const login = require('./src/steps/login');
const navigateToTargetPage = require('./src/steps/goToRH');
const fillFormAndContinue = require('./src/steps/fillData');
const triggerPDFDownload = require('./src/steps/printRH');

function getMostRecentFileInDirectory(directory) {
    const files = fs.readdirSync(directory)
        .map(fileName => ({
            name: fileName,
            time: fs.statSync(path.join(directory, fileName)).mtime.getTime()
        }))
        .sort((a, b) => b.time - a.time);
    
    return files.length ? files[0].name : null;
}

(async () => {
    // Paso 1: Crear la carpeta RHs con la subcarpeta de la fecha actual
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

    // Configuración de la ruta de descarga en la subcarpeta de fecha actual
    const client = await page.target().createCDPSession();
    await client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: downloadPath,
    });

    console.log("Iniciando el proceso de emision de R.H. para los DNI's proporcionados");

    for (const account of accounts) {
        const { dni, clavesol, tipo_servicio, sueldo } = account;

        try {
            await login(page, dni, clavesol);

            // Navegar y obtener el frame principal
            await navigateToTargetPage(page, process.env.RUC_MUNICIPALIDAD);
            const frame = await getMainFrame(page);
            //console.log("Acceso al iframe principal logrado.");

            await fillFormAndContinue(frame, tipo_servicio, sueldo);

            // Descargar el PDF
            await triggerPDFDownload(frame);

            // Esperar un momento para asegurar que el archivo haya sido descargado
            await new Promise(resolve => setTimeout(resolve, 2000));

             // Buscar el archivo más reciente en la carpeta de descargas
             const recentFileName = getMostRecentFileInDirectory(downloadPath);
             if (recentFileName && recentFileName.endsWith('.pdf')) {
                 const originalFilePath = path.join(downloadPath, recentFileName);
                 const newFilePath = path.join(downloadPath, `${dni}.pdf`);
 
                 fs.renameSync(originalFilePath, newFilePath);
                 //console.log(`Archivo descargado renombrado a: ${newFilePath}`);
             } else {
                 throw new Error(`No se encontró un archivo PDF para el DNI ${dni}.`);
             }
 

        } catch (error) {
            console.error(`Error con el DNI ${dni} no se pudo generar R.H, el error que se encontre fue: `, error.message);
        }
    }

    await browser.close();
})();

async function getMainFrame(page) {
    const iframeElement = await page.waitForSelector('#iframeApplication');
    const frame = await iframeElement.contentFrame();
    if (!frame) throw new Error("No se pudo acceder al iframe : #iframeApplication");
    return frame;
}
