import html2pdf from 'html2pdf.js';

/**
 * Converts an HTML element to PDF and adds the Stenth logo at the bottom of each page.
 * @param {HTMLElement} element - The element to convert.
 * @param {string} fileName - The name of the output PDF file.
 */
export const exportToPDF = async (element, fileName = 'document.pdf') => {
  const logoUrl = '/stenth-logo.png';
  
  // Convert image to base64
  const getBase64Image = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };
      img.onerror = (error) => reject(error);
      img.src = url;
    });
  };

  try {
    const logoBase64 = await getBase64Image(logoUrl);
    
    const opt = {
      margin: [15, 15, 25, 15], // More margin at bottom for the logo
      filename: fileName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        backgroundColor: '#000000', // Matches the theme
        logging: false
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    // Use a clone to avoid affecting the live UI during rendering
    const worker = html2pdf().from(element).set(opt).toPdf().get('pdf').then((pdf) => {
      const totalPages = pdf.internal.getNumberOfPages();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        
        // Add "Stenth" Logo at bottom center
        const logoWidth = 25; // mm
        const logoHeight = 25; // Adjusted based on the logo's aspect ratio (square-ish)
        const x = (pageWidth - logoWidth) / 2;
        const y = pageHeight - 22; // 22mm from top (approx 10mm from bottom)
        
        pdf.addImage(logoBase64, 'PNG', x, y, logoWidth, logoHeight);
        
        // Optional: Add page numbers
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 25, pageHeight - 10);
      }
    });

    await worker.save();
  } catch (error) {
    console.error('PDF Generation failed:', error);
    alert('Failed to generate PDF. Please check the console for details.');
  }
};
