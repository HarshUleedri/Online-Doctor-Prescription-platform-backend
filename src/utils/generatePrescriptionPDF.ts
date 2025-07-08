import puppeteer from "puppeteer";
import imageKit from "./imagekitConfig";

export const generatePrescriptionPDF = async (prescriptionData: any) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Medical Prescription</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .doctor-info { margin-bottom: 20px; }
            .patient-info { margin-bottom: 30px; background: #f5f5f5; padding: 15px; border-radius: 5px; }
            .prescription-content { margin-bottom: 30px; }
            .section { margin-bottom: 20px; }
            .section h3 { color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #666; }
            .signature { margin-top: 40px; text-align: right; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Medical Prescription</h1>
            <p>Date: ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="doctor-info">
            <h2>Dr. ${prescriptionData.doctorName}</h2>
            <p><strong>Specialty:</strong> ${
              prescriptionData.doctorSpecialty
            }</p>
            <p><strong>Experience:</strong> ${
              prescriptionData.doctorExperience
            } years</p>
        </div>
        
        <div class="patient-info">
            <h3>Patient Information</h3>
            <p><strong>Name:</strong> ${prescriptionData.patientName}</p>
            <p><strong>Age:</strong> ${prescriptionData.patientAge}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="prescription-content">
            <div class="section">
                <h3>Care to be Taken</h3>
                <p>${prescriptionData.careToBeTaken}</p>
            </div>
            
            <div class="section">
                <h3>Medicines</h3>
                <p>${
                  prescriptionData.medicines || "No medicines prescribed"
                }</p>
            </div>
        </div>
        
        <div class="signature">
            <p>_________________________</p>
            <p>Dr. ${prescriptionData.doctorName}</p>
            <p>Digital Signature</p>
        </div>
        
        <div class="footer">
            <p>This is a digitally generated prescription. Please consult your doctor for any clarifications.</p>
        </div>
    </body>
    </html>
    `;

    await page.setContent(htmlContent);

    const pdfBuffer = Buffer.from(
      await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
          top: "20px",
          right: "20px",
          bottom: "20px",
          left: "20px",
        },
      })
    );

    const fileName = `prescription_${prescriptionData.patientName}.pdf`;

    const uploadedPdf = await imageKit.upload({
      file: pdfBuffer,
      fileName: fileName, // Ensures it overwrites if file name already exists
      folder: "OnlineConsultationProject/prescriptions",
    });
    if (!uploadedPdf || !uploadedPdf.url) {
      throw new Error("failed to generate pdf url");
    }
    return uploadedPdf.url;
  } finally {
    await browser.close();
  }
};
