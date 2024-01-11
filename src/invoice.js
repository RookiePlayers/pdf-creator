import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";

export async function createInvoice() {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);

  const { width, height } = page.getSize();

  // Add company information
  const companyName = "Your Company";
  const companyInfoText = `${companyName}\n123 Main Street\nCity, Country\nEmail: info@example.com`;
  page.drawText(companyInfoText, {
    x: 50,
    y: height - 80,
    font: await pdfDoc.embedFont(StandardFonts.TimesRoman),
  });

  // Add invoice details
  const invoiceDetails = {
    invoiceNumber: "INV123456",
    date: "2023-01-15",
    dueDate: "2023-02-15",
  };
  const invoiceDetailsText = `Invoice Number: ${invoiceDetails.invoiceNumber}\nDate: ${invoiceDetails.date}\nDue Date: ${invoiceDetails.dueDate}`;
  page.drawText(invoiceDetailsText, {
    x: width - 200,
    y: height - 80,
    font: await pdfDoc.embedFont(StandardFonts.TimesRoman),
  });

  // Add a table for items
  const table = [
    ["Description", "Amount", "Total"],
    ["Product A", "$50.00", "$50.00"],
    ["Product B", "$30.00", "$30.00"],
    // Add more items as needed
  ];

  const tableHeight = height - 120;
  const tableWidth = width - 100;

  const cellPadding = 10;
  const cellHeight = 30;
  const tableX = 50;

  // Draw table headers
  const headerFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  page.drawText(table[0][0], {
    x: tableX,
    y: tableHeight,
    font: headerFont,
    color: rgb(0, 0, 0),
  });
  page.drawText(table[0][1], {
    x: tableX + 200,
    y: tableHeight,
    font: headerFont,
    color: rgb(0, 0, 0),
  });
  page.drawText(table[0][2], {
    x: tableX + 400,
    y: tableHeight,
    font: headerFont,
    color: rgb(0, 0, 0),
  });

  // Draw table rows
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  for (let i = 1; i < table.length; i++) {
    const rowY = tableHeight - i * cellHeight;

    page.drawText(table[i][0], {
      x: tableX,
      y: rowY - cellPadding,
      font: regularFont,
      color: rgb(0, 0, 0),
    });
    page.drawText(table[i][1], {
      x: tableX + 200,
      y: rowY - cellPadding,
      font: regularFont,
      color: rgb(0, 0, 0),
    });
    page.drawText(table[i][2], {
      x: tableX + 400,
      y: rowY - cellPadding,
      font: regularFont,
      color: rgb(0, 0, 0),
    });

    // Draw table borders
    page.drawLine({
      start: { x: tableX, y: rowY },
      end: { x: tableX + tableWidth, y: rowY },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
  }

  // Save the PDF to a buffer
  const pdfBytes = await pdfDoc.save();

  // Do something with the generated PDF, such as saving it to a file or sending it to the client
  // For example, you can use fs.writeFile for Node.js or createObjectURL for the browser

  //fs.writeFile("invoice.pdf", pdfBytes);
  const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
  const pdfUrl = URL.createObjectURL(pdfBlob);
  
  window.open(pdfUrl, "_blank");
}
