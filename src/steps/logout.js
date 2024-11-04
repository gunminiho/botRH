const failed = require("../../index");

const logout = async (page) => {

try {
    await page.waitForSelector("button[id='btnSalir']", { visible: true });
    await page.click("button[id='btnSalir']");
    console.log("Sesión cerrada exitosamente.");
    failed = false;
    return 0;
} catch (error) {
    console.error("Error al intentar cerrar sesión: ", error.message);
}
    // Esperar y hacer clic en el botón "Salir"

};

module.exports = logout;
