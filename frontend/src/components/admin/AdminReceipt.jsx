import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import { adminUploadReceiptTemplate, adminDeleteReceiptTemplate, adminAddDonationRecord } from "../../api/templeApi";

export default function AdminReceipt() {
  const location = useLocation();
  const stateDonation = location.state?.donation;

  const [formData, setFormData] = useState({
    date: stateDonation?.date ? new Date(stateDonation.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    receiptNo: stateDonation?.receipt_no || "",
    name: stateDonation?.donor_name || "",
    address: stateDonation?.address || "",
    receivedFrom: stateDonation?.received_from || "",
    towards: stateDonation?.towards || "",
    rupees: stateDonation?.amount ? String(stateDonation.amount) : "",
    rupeesInWords: stateDonation?.amount_words || "",
  });

  // Clear state on unmount so a refresh doesn't keep old data
  useEffect(() => {
    return () => {
      if (location.state) {
        window.history.replaceState({}, document.title);
      }
    };
  }, [location]);

  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loadTemplateImage = () => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = "/api/images/receipt-template?" + new Date().getTime();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("No template"));
    });
  };

  const generatePDF = async () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a5",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const darkGreen = "#064E3B";

    try {
      const img = await loadTemplateImage();
      doc.addImage(img, "JPEG", 0, 0, pageWidth, pageHeight);
    } catch {
      // Fallback manual background
      const yellowBg = "#FAF089";

      doc.setFillColor(yellowBg);
      doc.rect(0, 0, pageWidth, pageHeight, "F");

      doc.setDrawColor(darkGreen);
      doc.setLineWidth(1.5);
      doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
      doc.setLineWidth(0.5);
      doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

      doc.setTextColor(darkGreen);
      doc.setFont("times", "bold");
      doc.setFontSize(16);
      doc.text("SRI VISHNU MAYADEVI AMMAN TEMPLE", pageWidth / 2, 25, { align: "center" });

      doc.setFont("times", "normal");
      doc.setFontSize(9);
      doc.text("Sai Ganesh Nagar, Jalladiyanpet, Pallikaranai, Chennai - 600 100.", pageWidth / 2, 32, { align: "center" });

      doc.setFillColor(darkGreen);
      doc.roundedRect(pageWidth / 2 - 25, 36, 50, 7, 2, 2, "F");
      doc.setTextColor("#FFFFFF");
      doc.setFont("times", "bold");
      doc.setFontSize(11);
      doc.text("DONATION RECEIPT", pageWidth / 2, 40.8, { align: "center" });

      // Fallback Form Labels
      doc.setTextColor(darkGreen);
      doc.setFont("times", "normal");
      doc.setFontSize(11);

      const startX = 15;
      const lineEndX = pageWidth - 15;

      // Receipt No & Date
      doc.text("Receipt No.", startX, 58);
      doc.setLineDashPattern([1, 1], 0);
      doc.line(38, 59, 80, 59);

      doc.text("Date :", pageWidth - 60, 68);
      doc.line(pageWidth - 45, 69, pageWidth - 15, 69);

      // Name
      doc.text("Name", startX, 78);
      doc.line(28, 79, lineEndX, 79);

      // Address
      doc.text("Address", startX, 88);
      doc.line(33, 89, lineEndX, 89);

      // Received From
      doc.text("Received from", startX, 98);
      doc.line(43, 99, lineEndX, 99);

      // Towards
      doc.text("Towards", startX, 108);
      doc.line(33, 109, lineEndX, 109);

      // Rupees (in words)
      doc.text("Rupees (in words)", 70, 120);
      doc.line(103, 121, lineEndX, 121);

      // Rupees Box
      doc.setLineDashPattern([], 0); // Solid line
      doc.setLineWidth(0.8);
      doc.roundedRect(startX, 115, 45, 12, 2, 2, "S");
      doc.setFont("times", "bold");
      doc.setFontSize(11);
      doc.text("Rupees", startX + 2, 123);
      doc.setLineDashPattern([1, 1], 0);
      doc.line(startX + 16, 123.5, startX + 43, 123.5);

      // Footer Text
      doc.setFont("times", "normal");
      doc.setFontSize(10);

      // Middle text
      doc.text("Thank you for", pageWidth / 2, 130, { align: "center" });
      doc.text("your donation.", pageWidth / 2, 135, { align: "center" });

      // Left disclaimer
      doc.setFont("times", "italic");
      doc.setFontSize(7);
      doc.text("*This is computer generated receipt, so no need of signature", startX, 134);

      // Right signature
      doc.setFont("times", "bolditalic");
      doc.setFontSize(8);
      doc.text("M. SIVAKUMAR", pageWidth - 42.5, 130, { align: "center" });

      doc.setLineWidth(0.3);
      doc.setLineDashPattern([1, 1], 0);
      doc.line(pageWidth - 65, 132, pageWidth - 20, 132);

      doc.setFont("times", "normal");
      doc.setFontSize(9);
      doc.text("Treasurer /", pageWidth - 42.5, 136, { align: "center" });
      doc.text("Temple Representative", pageWidth - 42.5, 140, { align: "center" });
    }

    // 5. Form Fields (Values Only)
    doc.setTextColor(darkGreen);
    doc.setFont("times", "bold");
    doc.setFontSize(12);

    // Receipt No & Date
    if (formData.receiptNo) doc.text(formData.receiptNo, 41, 67);

    const formattedDate = formData.date ? new Date(formData.date).toLocaleDateString('en-GB') : '';
    if (formattedDate) doc.text(formattedDate, pageWidth - 42, 62);

    // Name
    if (formData.name) doc.text(formData.name, 35, 76);

    // Address
    if (formData.address) doc.text(formData.address, 35, 86);

    // Received From
    if (formData.receivedFrom) doc.text(formData.receivedFrom, 49, 97);

    // Towards
    if (formData.towards) doc.text(formData.towards, 37, 109);

    // Rupees (in words)
    if (formData.rupeesInWords) doc.text(formData.rupeesInWords, 117, 120);

    // Rupees Box
    if (formData.rupees) doc.text(`${formData.rupees}`, 35, 127);

    // Generate PDF and open in new tab / download
    doc.save(`Receipt_${formData.receiptNo || 'Draft'}.pdf`);

    // Automatically save to Accounts (Donations) DB if Name is provided AND this wasn't pre-filled from an existing record
    if (formData.name && !stateDonation) {
      try {
        await adminAddDonationRecord({
          receipt_no: formData.receiptNo,
          donor_name: formData.name,
          address: formData.address,
          received_from: formData.receivedFrom,
          towards: formData.towards,
          amount: formData.rupees ? parseFloat(formData.rupees) : 0,
          amount_words: formData.rupeesInWords,
          date: formData.date,
          notes: "Auto-saved from Receipt Generator"
        });
      } catch (err) {
        console.error("Failed to auto-save to Accounts:", err);
      }
    }
  };

  const handleTemplateUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      await adminUploadReceiptTemplate(file);
      alert("Template uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to upload template.");
    } finally {
      setUploading(false);
      e.target.value = null; // reset input
    }
  };

  const handleTemplateDelete = async () => {
    if (!window.confirm("Are you sure you want to delete the template? This will revert to the default receipt design.")) return;
    try {
      await adminDeleteReceiptTemplate();
      alert("Template deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete template.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-charcoal">Receipt Generator</h2>

        <div className="flex gap-2 items-center bg-white p-2 rounded-xl shadow-sm border border-gray-100">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleTemplateUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="text-sm font-medium px-4 py-2 bg-charcoal text-cream rounded-lg hover:bg-charcoal-light transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {uploading ? "Uploading..." : "📄 Upload Template Image"}
          </button>
          <button
            onClick={handleTemplateDelete}
            className="text-sm font-medium px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete custom template and use default design"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Receipt No.</label>
            <input
              type="text"
              name="receiptNo"
              value={formData.receiptNo}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saffron/50"
              placeholder="e.g. 101"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saffron/50"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saffron/50"
              placeholder="Donor Name"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saffron/50"
              placeholder="Donor Address"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Received From</label>
            <input
              type="text"
              name="receivedFrom"
              value={formData.receivedFrom}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saffron/50"
              placeholder="Person making the payment"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Towards</label>
            <input
              type="text"
              name="towards"
              value={formData.towards}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saffron/50"
              placeholder="Purpose of donation (e.g. Annadanam, Puja)"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Rupees (₹)</label>
            <input
              type="number"
              name="rupees"
              value={formData.rupees}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saffron/50"
              placeholder="Amount in numbers"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Rupees (in words)</label>
            <input
              type="text"
              name="rupeesInWords"
              value={formData.rupeesInWords}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saffron/50"
              placeholder="Amount in words"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={() => setFormData({
              date: new Date().toISOString().split("T")[0],
              receiptNo: "",
              name: "",
              address: "",
              receivedFrom: "",
              towards: "",
              rupees: "",
              rupeesInWords: "",
            })}
            className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors font-medium"
          >
            Clear
          </button>
          <button
            onClick={generatePDF}
            className="px-6 py-2.5 rounded-xl bg-saffron text-charcoal hover:bg-saffron/90 transition-colors font-bold shadow-sm"
          >
            Generate PDF
          </button>
        </div>
      </div>
    </div>
  );
}
