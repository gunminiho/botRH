async function fillFormAndContinue(frame, tipoServicio, sueldo) {
    // Paso 1: Llenar el campo "Descripción o Tipo de Servicio Prestado"
    await frame.waitForSelector('input[name="motivo"]', { visible: true });
    await frame.type('input[name="motivo"]', tipoServicio);
    //console.log("Campo 'Descripción o Tipo de Servicio Prestado' llenado");

    // Paso 2: Seleccionar "No" para "Retención del Impuesto a la Renta"
     await frame.waitForSelector('input[name="indretencion"][value="00"]', { visible: true });
    await frame.click('input[name="indretencion"][value="00"]');
    //console.log("Opción 'No' seleccionada para 'Retención del Impuesto a la Renta'");

    // Paso 3: Seleccionar "Depósito en Cuenta" en el campo correspondiente
    await frame.waitForSelector('select#medioPagoId', { visible: true });
    await frame.select('select#medioPagoId', '001');
    //console.log("Opción 'Depósito en Cuenta' seleccionada en el campo de medio de pago");
    
    // Paso 4: Llenar el campo "Monto Total de los Honorarios"
    await clearAndType(frame, 'input[name="cantidad"]', sueldo.trim());
    
    // Paso 5: Hacer clic en el botón "Continuar"
    await frame.waitForSelector('input[name="wacepta"]', { visible: true });
    await frame.click('input[name="wacepta"]');
    //console.log("Botón 'Continuar' clicado");

     // Paso 5: Hacer clic en el botón "Continuar"
     await new Promise(resolve => setTimeout(resolve, 2000));
     await frame.waitForSelector('input[name="wacepta"]', { visible: true });
     await frame.click('input[name="wacepta"]');
     //console.log("Botón 'Continuar' clicado");
}

async function clearAndType(frame, selector, newText) {
    // Esperar a que el campo esté disponible
    await frame.waitForSelector(selector, { visible: true });

    // Hacer clic en el campo para asegurarse de que esté enfocado
    await frame.click(selector);

    // Borrar el texto existente
    await frame.click(selector, { clickCount: 3 }); // Selecciona todo el texto
    //await frame.press('Backspace'); // Elimina el texto seleccionado

    // Escribir el nuevo texto
    await frame.type(selector, newText);
    //console.log(`Campo ${selector} borrado y texto '${newText}' ingresado`);
}


module.exports = fillFormAndContinue;
