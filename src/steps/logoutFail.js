const failed = require("../../index");

const logoutFail = async (page) => {

    // Esperar y hacer clic en el botón "Salir"
    try {
        await page.waitForSelector("button[id='btnVolver']", { visible: true });
        await page.click("button[id='btnVolver']");
        return false;
    } catch (error) {
        await page.waitForSelector("button[id='btnFinalizarValidacionDatos']", { visible: true });
        await page.click("button[id='btnFinalizarValidacionDatos']");
        return false;
    }

};

module.exports = logoutFail;
