async function triggerPDFDownload(frame) {
    try {
        //console.log("Esperando a que el enlace de descarga de PDF esté disponible...");

        // Esperar a que el enlace de descarga esté disponible en el frame
        await frame.waitForSelector("a[title*='Presione este link para descargar el archivo pdf del Recibo por Honorarios Electrónico.'][href^='javascript:descargaArchivopdf']", { visible: true, timeout: 30000 });
        
        //console.log("Enlace de descarga de PDF encontrado.");
        
        // Hacer clic en el enlace directamente en el frame
        await frame.click("a[title*='Presione este link para descargar el archivo pdf del Recibo por Honorarios Electrónico.'][href^='javascript:descargaArchivopdf']");
        
        //console.log("Enlace de descarga de PDF clicado.");
    } catch (error) {
        console.error("Error al intentar descargar el PDF: ", error.message);
    }
}

module.exports = triggerPDFDownload;
