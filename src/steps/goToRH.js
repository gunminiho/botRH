async function navigateToTargetPage(page, rucNumber) {
    // Paso 1: Navegar por los menús de la página principal
    await navigateMenus(page);

    // Paso 2: Acceder al iframe donde está la aplicación embebida
    const frame = await accessIframe(page, '#iframeApplication');

    // Paso 3: Hacer clic en el botón "Continuar" dentro del iframe
    await clickContinuarInIframe(frame);

    // Paso 4: Seleccionar RUC, llenar el campo y validar
    await  accessAndValidateRUC(frame, rucNumber);

    return frame;
}

async function navigateMenus(page) {
    // Navegar por los menús de la página
    await page.waitForSelector('#nivel1_11', { visible: true });
    await page.click('#nivel1_11');
    await new Promise(resolve => setTimeout(resolve, 500));

    await page.waitForSelector('#nivel2_11_5', { visible: true });
    await page.click('#nivel2_11_5');
    await new Promise(resolve => setTimeout(resolve, 500));

    await page.waitForSelector('#nivel3_11_5_1', { visible: true });
    await page.click('#nivel3_11_5_1');
    await new Promise(resolve => setTimeout(resolve, 500));

    await page.waitForSelector('#nivel4_11_5_1_1_2', { visible: true });
    await page.click('#nivel4_11_5_1_1_2');
    //console.log("Navegación por los menús completada.");
}

async function accessIframe(page, iframeSelector) {
    // Acceder al iframe especificado
    const iframeElement = await page.waitForSelector(iframeSelector);
    const frame = await iframeElement.contentFrame();
    if (!frame) throw new Error("No se pudo acceder al iframe.");
    //console.log("Acceso al iframe exitoso.");
    return frame;
}

async function clickContinuarInIframe(frame) {
    // Hacer clic en el botón "Continuar" dentro del iframe
    await frame.waitForSelector('input[name="wacepta"]', { visible: true });
    await frame.click('input[name="wacepta"]');
    //console.log("Botón 'Continuar' clicado dentro del iframe");
}

async function accessAndValidateRUC(frame,rucNumber) {
    // Acceder al `iframe` principal
    //console.log("llenando el campo de RUC", rucNumber);
    
    //const iframeElement = await page.waitForSelector('#iframeApplication', { visible: true });
    //const frame = await iframeElement.contentFrame();
    
    if (!frame) throw new Error("No se pudo acceder al iframe.");

    // Esperar a que el campo de RUC esté disponible
    await frame.waitForSelector('input[name="numdoc"]', { visible: true });
    
    // Llenar el campo de RUC
    await frame.type('input[name="numdoc"]', rucNumber);
    //console.log(`RUC ${rucNumber} ingresado en el campo de documento`);

    // Hacer clic en el botón "Validar RUC o DNI"
    //console.log("valdiar click");
    await frame.waitForSelector('input[name="wvalidar"]', { visible: true });
    //console.log("valdiar click done");
    await frame.click('input[name="wvalidar"]');
    //console.log("Botón 'Validar RUC o DNI' clicado");
    await new Promise(resolve => setTimeout(resolve, 500));
    await frame.click('input[name="wacepta"]');
    //console.log("Botón 'continuar' clicado");
    
}



module.exports = navigateToTargetPage;
