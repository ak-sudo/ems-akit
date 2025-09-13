// utils/exportUtils.js
const { createObjectCsvWriter } = require("csv-writer");
const PDFDocument = require("pdfkit");
const path = require("path")
const fs = require("fs")

function exportToCSV(res, data, filename) {
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename=${filename}`);

  const csvWriter = createObjectCsvWriter({
    path: "/tmp/" + filename,
    header: Object.keys(data[0]).map((key) => ({ id: key, title: key })),
  });

  csvWriter
    .writeRecords(data)
    .then(() => {
      res.download("/tmp/" + filename);
    })
    .catch((err) => {
      res.status(500).json({ message: "CSV Export error", error: err.message });
    });
}


function exportToPDF(filename, data, res) {
  const doc = new PDFDocument({ size: "A4", layout: "landscape" });

  res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
  res.setHeader("Content-Type", "application/pdf");

  doc.pipe(res);

  // Title
  doc.fontSize(18).text("Event Registrations Report", { align: "center" });
  doc.moveDown(1.5);

  // Define columns
  const headers = [
    "Name",
    "Email",
    "Phone",
    "Roll Number",
    "Program",
    "Event",
    "Registered At",
  ];

  const columnWidths = [100, 150, 100, 100, 120, 120, 120];
  let startX = 50;
  let startY = 100;

  // Draw header row
  doc.font("Helvetica-Bold").fontSize(10);
  headers.forEach((header, i) => {
    doc.text(header, startX, startY, { width: columnWidths[i], align: "left" });
    startX += columnWidths[i];
  });

  // Reset font
  doc.font("Helvetica").fontSize(9);

  // Draw rows
  startY += 20;
  data.forEach((row) => {
    startX = 50;
    const values = [
      row.Name || "",
      row.Email || "",
      row.Phone || "",
      row["Roll No."] || "",
      row.Program || "",
      row.Event || "",
      row["Registered At"] || "",
    ];

    values.forEach((val, i) => {
      doc.text(val.toString(), startX, startY, {
        width: columnWidths[i],
        align: "left",
      });
      startX += columnWidths[i];
    });

    startY += 20;
    if (startY > 500) {
      doc.addPage({ size: "A4", layout: "landscape" });
      startY = 50;
    }
  });

  doc.end();
}

module.exports = { exportToCSV, exportToPDF };
