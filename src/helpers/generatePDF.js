const fs = require('fs');
const PDFDocument = require('pdfkit');

const doc = new PDFDocument();
try {
    doc.pipe(fs.createWriteStream('comprobante.pdf'));

    // Configuraciones iniciales (tamaño del papel, márgenes, etc.)
    //doc.size('A4');
    //doc.margins(50);

    // Dibujar el cuadro
    doc.rect(80, 80, 200, 100)
        .stroke('#0000ff') // Color del borde azul
        .fillOpacity(0.2) // Opacidad del relleno (transparente)
        .fill('#0000ff'); // Color de relleno (azul claro)

    // Título del documento
    doc.fontSize(20).text('Consulta de Validez del Comprobante de Pago Electrónico', { align: 'center', underline: true, color: 'red' });

    // Subtítulo
    doc.fontSize(14).text('Resultado de la Consulta', 100, 100);

    // Contenido principal
    doc.text('EL RECIBO POR HONORARIOS ELECTRÓNICO Nro.003-30 FUE ENCONTRADO EN NUESTRA BASE DE DATOS.', 100, 150);

    // Tabla (si es necesario)
    // ...

    // Finalizar el documento
    doc.end();
} catch (error) {
    console.error("Error al intentar generar el PDF: ", error.message);
}