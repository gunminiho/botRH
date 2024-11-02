const { SUNAT_URL } = process.env;

//console.log("sunat: ", SUNAT_URL);

async function login(page, dni, clavesol) {
    await page.goto(SUNAT_URL, { waitUntil: 'networkidle0' });
    //await page.type('#username', username);
    //await page.type('#password', password);
    await page.waitForSelector('#btnPorDni');
    await page.click('#btnPorDni');
    await page.waitForSelector('#txtDni');
    await page.type('#txtDni', dni);
    await page.waitForSelector('#txtContrasena');
    await page.type('#txtContrasena', clavesol);
    
    await page.click('#btnAceptar');
    await page.waitForNavigation();
    //console.log(`Logged in as ${dni}`);
}

module.exports = login;
