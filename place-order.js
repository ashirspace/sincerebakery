// api/place-order.js
// Vercel Serverless Function — handles order placement
// Saves to Airtable + triggers WhatsApp notification

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { orderId, customerName, phone, address, landmark, pincode, items, total, deliveryFee, grandTotal, payment, upiId } = req.body;

    if (!customerName || !phone || !address || !items || !total) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
    const AIRTABLE_BASE = process.env.AIRTABLE_BASE;
    const AIRTABLE_TABLE = process.env.AIRTABLE_TABLE || "Orders";
    const OWNER_EMAIL = process.env.OWNER_EMAIL;

    // Format items for storage
    const itemsList = items.map((i) => `${i.name} × ${i.qty} = ₹${i.price * i.qty}`).join("\n");
    const createdAt = new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });

    // ─── Save to Airtable ───
    const airtableRes = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${encodeURIComponent(AIRTABLE_TABLE)}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        records: [
          {
            fields: {
              OrderID: orderId,
              CustomerName: customerName,
              Phone: phone,
              Address: address,
              Landmark: landmark || "",
              Pincode: pincode,
              Items: itemsList,
              Total: grandTotal,
              Payment: payment === "cod" ? "Cash on Delivery" : `UPI (${upiId || ""})`,
              Status: "New",
              CreatedAt: createdAt,
            },
          },
        ],
      }),
    });

    if (!airtableRes.ok) {
      const errData = await airtableRes.json();
      console.error("Airtable error:", errData);
      return res.status(500).json({ error: "Failed to save order", details: errData });
    }

    // ─── Send Email via Vercel (using a simple fetch to a free email service) ───
    // We'll use Web3Forms (free, no signup needed for basic use)
    if (OWNER_EMAIL) {
      try {
        const emailBody = `
🧁 NEW ORDER — SINCERE BAKERY

📋 Order ID: ${orderId}
🕐 Time: ${createdAt}

━━━ Items ━━━
${itemsList}

━━━ Bill ━━━
Subtotal: ₹${total}
Delivery: ${deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
TOTAL: ₹${grandTotal}

━━━ Customer ━━━
👤 Name: ${customerName}
📞 Phone: ${phone}

━━━ Delivery Address ━━━
📍 ${address}
${landmark ? `Landmark: ${landmark}` : ""}
Pincode: ${pincode}

━━━ Payment ━━━
💳 ${payment === "cod" ? "Cash on Delivery" : `UPI (${upiId || ""})`}
        `.trim();

        // Using Web3Forms free API for email
        const WEB3FORMS_KEY = process.env.WEB3FORMS_KEY;
        if (WEB3FORMS_KEY) {
          await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              access_key: WEB3FORMS_KEY,
              subject: `🧁 New Order #${orderId} — Sincere Bakery`,
              from_name: "Sincere Bakery Orders",
              to: OWNER_EMAIL,
              message: emailBody,
            }),
          });
        }
      } catch (emailErr) {
        console.error("Email error:", emailErr);
        // Don't fail the order if email fails
      }
    }

    return res.status(200).json({
      success: true,
      orderId,
      message: "Order placed successfully!",
    });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
