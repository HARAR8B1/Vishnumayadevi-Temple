import { useState } from "react";
import jsPDF from "jspdf";

export default function AdminReceipt() {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0], // Default to today
    receiptNo: "",
    name: "",
    address: "",
    receivedFrom: "",
    towards: "",
    rupees: "",
    rupeesInWords: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generatePDF = () => {
    // Create landscape A5 pdf (approx 210 x 148 mm)
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a5",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const yellowBg = "#FAF089";
    const darkGreen = "#064E3B";

    // 1. Draw Background
    doc.setFillColor(yellowBg);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // 2. Draw Borders
    doc.setDrawColor(darkGreen);
    doc.setLineWidth(1.5);
    // Outer border
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
    // Inner thin border
    doc.setLineWidth(0.5);
    doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

    // 3. Draw Header
    doc.setTextColor(darkGreen);
    doc.setFont("times", "bold");
    doc.setFontSize(16);
    doc.text("SRI VISHNU MAYADEVI AMMAN TEMPLE", pageWidth / 2, 25, { align: "center" });

    doc.setFont("times", "normal");
    doc.setFontSize(9);
    doc.text("Sai Ganesh Nagar, Jalladiyanpet, Pallikaranai, Chennai - 600 100.", pageWidth / 2, 32, { align: "center" });

    // 4. Donation Receipt Badge
    doc.setFillColor(darkGreen);
    doc.roundedRect(pageWidth / 2 - 25, 36, 50, 7, 2, 2, "F");
    doc.setTextColor("#FFFFFF");
    doc.setFont("times", "bold");
    doc.setFontSize(11);
    doc.text("DONATION RECEIPT", pageWidth / 2, 40.8, { align: "center" });

    // 5. Form Fields
    doc.setTextColor(darkGreen);
    doc.setFont("times", "normal");
    doc.setFontSize(11);

    const startX = 15;
    const lineEndX = pageWidth - 15;
    
    // Receipt No & Date
    doc.text("Receipt No.", startX, 58);
    doc.setLineDashPattern([1, 1], 0);
    doc.line(38, 59, 80, 59);
    doc.text(formData.receiptNo, 40, 57);

    doc.text("Date :", pageWidth - 60, 48);
    doc.line(pageWidth - 45, 49, pageWidth - 15, 49);
    const formattedDate = formData.date ? new Date(formData.date).toLocaleDateString('en-GB') : '';
    doc.text(formattedDate, pageWidth - 43, 47);

    // Name
    doc.text("Name", startX, 68);
    doc.line(28, 69, lineEndX, 69);
    doc.text(formData.name, 30, 67);

    // Address
    doc.text("Address", startX, 78);
    doc.line(33, 79, lineEndX, 79);
    doc.text(formData.address, 35, 77);

    // Received From
    doc.text("Received from", startX, 88);
    doc.line(43, 89, lineEndX, 89);
    doc.text(formData.receivedFrom, 45, 87);

    // Towards
    doc.text("Towards", startX, 98);
    doc.line(33, 99, lineEndX, 99);
    doc.text(formData.towards, 35, 97);

    // Rupees (in words)
    doc.text("Rupees (in words)", 70, 110);
    doc.line(103, 111, lineEndX, 111);
    doc.text(formData.rupeesInWords, 105, 109);

    // Rupees Box
    doc.setLineDashPattern([], 0); // Solid line
    doc.setLineWidth(0.8);
    doc.roundedRect(startX, 105, 45, 12, 2, 2, "S");
    doc.setFont("times", "bold");
    doc.setFontSize(11);
    doc.text("Rupees", startX + 2, 113);
    doc.setLineDashPattern([1, 1], 0);
    doc.line(startX + 16, 113.5, startX + 43, 113.5);
    doc.text(`${formData.rupees}`, startX + 18, 112);

    // Footer Text
    doc.setFont("times", "normal");
    doc.setFontSize(10);
    
    // Middle text
    doc.text("Thank you for", pageWidth / 2, 125, { align: "center" });
    doc.text("your donation.", pageWidth / 2, 130, { align: "center" });

    // Left disclaimer
    doc.setFont("times", "italic");
    doc.setFontSize(7);
    doc.text("*This is computer generated receipt, so no need of signature", startX, 129);

    // Right signature
    doc.setFont("times", "bolditalic");
    doc.setFontSize(8);
    doc.text("M. SIVAKUMAR", pageWidth - 42.5, 124, { align: "center" });
    
    doc.setLineWidth(0.3);
    doc.setLineDashPattern([1, 1], 0);
    doc.line(pageWidth - 65, 126, pageWidth - 20, 126);
    
    doc.setFont("times", "normal");
    doc.setFontSize(9);
    doc.text("Treasurer /", pageWidth - 42.5, 130, { align: "center" });
    doc.text("Temple Representative", pageWidth - 42.5, 134, { align: "center" });

    // Generate PDF and open in new tab / download
    doc.save(`Receipt_${formData.receiptNo || 'Draft'}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-charcoal">Receipt Generator</h2>
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
