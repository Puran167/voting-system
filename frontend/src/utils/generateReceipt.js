import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

/**
 * Generates a professional PDF voting receipt with QR code and triggers a download.
 *
 * @param {Object} receipt - The receipt data returned from the backend
 * @param {string} receipt.voterId - The voter's ID
 * @param {string} receipt.voterName - The voter's full name
 * @param {string} receipt.candidateName - Name of the voted candidate
 * @param {string} receipt.partyName - Party of the voted candidate
 * @param {string} receipt.timestamp - ISO timestamp of the vote
 * @param {string} receipt.verificationId - Unique verification code (VOTE-XXXXX)
 */
const generateReceipt = async (receipt) => {
  // Generate QR code data URL
  const qrData = JSON.stringify({
    verificationId: receipt.verificationId,
    voterId: receipt.voterId,
    timestamp: receipt.timestamp
  });
  const qrDataUrl = await QRCode.toDataURL(qrData, { width: 200, margin: 1 });

  // Create a new PDF document (A4 portrait, mm units)
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();

  // ─── Color palette ───
  const primaryColor = [67, 56, 202];    // Indigo-700
  const darkColor = [15, 23, 42];        // Slate-900
  const mutedColor = [100, 116, 139];    // Slate-500
  const accentColor = [16, 185, 129];    // Emerald-500
  const bgLight = [248, 250, 252];       // Slate-50

  // ─── Helper: draw a horizontal line ───
  const drawLine = (y, color = [226, 232, 240]) => {
    doc.setDrawColor(...color);
    doc.setLineWidth(0.3);
    doc.line(20, y, pageWidth - 20, y);
  };

  // ─── Helper: centered text ───
  const centeredText = (text, y, size, color, style = 'normal') => {
    doc.setFontSize(size);
    doc.setTextColor(...color);
    doc.setFont('helvetica', style);
    doc.text(text, pageWidth / 2, y, { align: 'center' });
  };

  // ─── Header background ───
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 52, 'F');

  // ─── System logo placeholder (circle with ballot icon) ───
  doc.setFillColor(255, 255, 255);
  doc.circle(pageWidth / 2, 18, 8, 'F');
  doc.setFontSize(12);
  doc.setTextColor(...primaryColor);
  doc.text('\u2713', pageWidth / 2, 21, { align: 'center' }); // Checkmark symbol

  // ─── Header text ───
  doc.setFontSize(10);
  doc.setTextColor(199, 210, 254); // Indigo-200
  doc.setFont('helvetica', 'normal');
  doc.text('Smart Biometric Voting System', pageWidth / 2, 32, { align: 'center' });

  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('Voting Confirmation Receipt', pageWidth / 2, 43, { align: 'center' });

  // ─── Date line below header ───
  let y = 62;
  const dateStr = new Date(receipt.timestamp).toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
  });
  centeredText(dateStr, y, 9, mutedColor);

  // ─── Section: Voter Information ───
  y = 78;
  doc.setFillColor(...bgLight);
  doc.roundedRect(20, y - 4, pageWidth - 40, 34, 3, 3, 'F');

  doc.setFontSize(10);
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text('VOTER INFORMATION', 28, y + 4);

  drawLine(y + 8);

  // Voter ID
  doc.setFontSize(9);
  doc.setTextColor(...mutedColor);
  doc.setFont('helvetica', 'normal');
  doc.text('Voter ID', 28, y + 16);
  doc.setTextColor(...darkColor);
  doc.setFont('helvetica', 'bold');
  doc.text(receipt.voterId || 'N/A', 80, y + 16);

  // Voter Name
  doc.setTextColor(...mutedColor);
  doc.setFont('helvetica', 'normal');
  doc.text('Voter Name', 28, y + 24);
  doc.setTextColor(...darkColor);
  doc.setFont('helvetica', 'bold');
  doc.text(receipt.voterName || 'N/A', 80, y + 24);

  // ─── Section: Vote Details ───
  y = 122;
  doc.setFillColor(...bgLight);
  doc.roundedRect(20, y - 4, pageWidth - 40, 34, 3, 3, 'F');

  doc.setFontSize(10);
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text('VOTE DETAILS', 28, y + 4);

  drawLine(y + 8);

  // Candidate Name
  doc.setFontSize(9);
  doc.setTextColor(...mutedColor);
  doc.setFont('helvetica', 'normal');
  doc.text('Candidate Name', 28, y + 16);
  doc.setTextColor(...darkColor);
  doc.setFont('helvetica', 'bold');
  doc.text(receipt.candidateName || 'N/A', 80, y + 16);

  // Party Name
  doc.setTextColor(...mutedColor);
  doc.setFont('helvetica', 'normal');
  doc.text('Party Name', 28, y + 24);
  doc.setTextColor(...darkColor);
  doc.setFont('helvetica', 'bold');
  doc.text(receipt.partyName || 'N/A', 80, y + 24);

  // ─── Verification ID (highlighted box) ───
  y = 170;
  doc.setFillColor(236, 253, 245); // Emerald-50
  doc.roundedRect(30, y - 6, pageWidth - 60, 28, 4, 4, 'F');
  doc.setDrawColor(...accentColor);
  doc.setLineWidth(0.5);
  doc.roundedRect(30, y - 6, pageWidth - 60, 28, 4, 4, 'S');

  doc.setFontSize(8);
  doc.setTextColor(...accentColor);
  doc.setFont('helvetica', 'bold');
  doc.text('VERIFICATION ID', pageWidth / 2, y + 2, { align: 'center' });

  doc.setFontSize(18);
  doc.setTextColor(...darkColor);
  doc.setFont('helvetica', 'bold');
  doc.text(receipt.verificationId || 'N/A', pageWidth / 2, y + 16, { align: 'center' });

  // ─── QR Code ───
  y = 204;
  const qrSize = 36;
  const qrX = (pageWidth - qrSize) / 2;
  doc.addImage(qrDataUrl, 'PNG', qrX, y, qrSize, qrSize);

  doc.setFontSize(7);
  doc.setTextColor(...mutedColor);
  doc.setFont('helvetica', 'normal');
  doc.text('Scan to verify your vote', pageWidth / 2, y + qrSize + 5, { align: 'center' });

  // ─── Thank you message ───
  y = 252;
  centeredText('Thank you for participating in the democratic process!', y, 10, darkColor, 'bold');
  centeredText(
    'Your vote has been recorded securely and cannot be altered.',
    y + 8,
    8,
    mutedColor
  );
  centeredText(
    'Keep this receipt for your records. The verification ID can be used',
    y + 16,
    8,
    mutedColor
  );
  centeredText('to confirm your vote was counted.', y + 22, 8, mutedColor);

  // ─── Footer line ───
  y = 282;
  drawLine(y, primaryColor);
  centeredText('Smart Biometric Voting System', y + 5, 8, primaryColor, 'bold');
  centeredText('This is a computer-generated receipt and does not require a signature.', y + 11, 7, mutedColor);

  // ─── Trigger download with meaningful filename ───
  const safeId = (receipt.verificationId || 'receipt').replace(/[^a-zA-Z0-9-]/g, '');
  doc.save(`Voting_Receipt_${safeId}.pdf`);
};

export default generateReceipt;
