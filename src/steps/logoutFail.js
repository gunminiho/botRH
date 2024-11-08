
const logoutFail = async (page) => {

    // Esperar y hacer clic en el botón "Salir"
    try {
        console.log("intentando desloguear con errores");
        if (await page.waitForSelector("button[id='btnVolver']", { visible: true }) ||  await page.waitForSelector("button[id='btnFinalizarValidacionDatos']", { visible: true })) {
            await page.click("button[id='btnFinalizarValidacionDatos']");
            await page.click("button[id='btnVolver']");
            return false;
        }
        return true;
    } catch (error) {
        console.error("Error al intentar cerrar sesión con errores: ", error.message);
        return true;
    }

};

module.exports = logoutFail;
