/**
 * Apps Script doPost handler for registration and ticket emails.
 * Accepts JSON or form-encoded data. Verifies token from Script Properties.
 * Supports two templates:
 *  - default / registration: fields: name,email,phone,program_name/program_title,group_link
 *  - ticket: payload.template === 'ticket' and expects ticketCode, qrUrl, ticketLink
 */

const DEFAULT_EXPECTED_TOKEN = "tedx-itech-2026-email-9fA3xPqL82VhK7MZ";

function _parsePayload(e) {
  if (
    e &&
    e.postData &&
    e.postData.type === "application/json" &&
    e.postData.contents
  ) {
    try {
      return JSON.parse(e.postData.contents);
    } catch (err) {
      console.error("Error parsing JSON: " + err);
    }
  }
  return e.parameter || {};
}

function _jsonResponse(obj) {
  const out = ContentService.createTextOutput(JSON.stringify(obj));
  out.setMimeType(ContentService.MimeType.JSON);
  return out;
}

function _getExpectedToken() {
  try {
    const t =
      PropertiesService.getScriptProperties().getProperty("EXPECTED_TOKEN");
    return t || DEFAULT_EXPECTED_TOKEN;
  } catch (e) {
    return DEFAULT_EXPECTED_TOKEN;
  }
}

function doPost(e) {
  console.log("Received request");
  const payload = _parsePayload(e) || {};
  console.log("Parsed payload:", JSON.stringify(payload));

  const token = payload.token || "";
  const expected = _getExpectedToken();
  if (!token || token !== expected) {
    console.warn("Unauthorized token");
    return _jsonResponse({ error: "Unauthorized" });
  }

  const template = payload.template || "registration";

  // common fields
  const name = payload.name || "";
  const email = payload.email || "";
  const phone = payload.phone || "";

  if (!email || !name) {
    return _jsonResponse({ error: "Missing required fields" });
  }

  if (template === "ticket") {
    // support multiple tickets (e.g., friends package)
    const ticketCode = payload.ticketCode || "";
    const qrUrl = payload.qrUrl || "";
    const ticketLink = payload.ticketLink || "#";
    const program_name = payload.program_name || payload.program_title || "";

    // Accept arrays if provided (backend may pass ticketCodes / qrUrls)
    const ticketCodes = Array.isArray(payload.ticketCodes) && payload.ticketCodes.length > 0
      ? payload.ticketCodes
      : ticketCode ? [ticketCode] : [];
    const qrUrls = Array.isArray(payload.qrUrls) && payload.qrUrls.length > 0
      ? payload.qrUrls
      : qrUrl ? [qrUrl] : [];

    // Build HTML containing one section per ticket
    let ticketsHtml = "";
    for (let i = 0; i < ticketCodes.length; i++) {
      const code = escapeHtml(ticketCodes[i] || "");
      const q = qrUrls[i] || qrUrls[0] || "";
      ticketsHtml += `
        <div style="margin-top:20px; padding:18px; background:#fff; color:#000; border-radius:10px; margin-bottom:18px;">
          <p style="margin:0 0 8px;">Ticket ${i + 1} code:</p>
          <h3 style="margin:0 0 12px; background:#000; color:#fff; display:inline-block; padding:8px; border-radius:6px;">${code}</h3>
          <div style="margin-top:12px;">
            <img src="${q}" alt="Ticket QR" style="width:200px;height:200px;border-radius:8px;background:#fff;" />
          </div>
        </div>`;
    }

    const html = `<!doctype html>
    <html>
    <head><meta charset="utf-8"><title>Your Tickets</title></head>
    <body style="font-family:Arial,Helvetica,sans-serif;background:#fff;margin:0;padding:20px;">
      <div style="max-width:700px;margin:0 auto;background:#171717;color:#fff;padding:30px;border-radius:12px;">
        <h2 style="margin-top:0;">Your Tickets for ${escapeHtml(program_name)}</h2>
        <p>Hi ${escapeHtml(name)},</p>
        <p>Thank you for your purchase. Below are your tickets:</p>
        ${ticketsHtml}
        <p style="margin-top:20px;">You can also open this link to check in: <a href="${ticketLink}" style="color:#e53935;">Check ticket</a></p>
        <p style="margin-top:30px;color:#ccc;">Keep this email safe; the QR codes represent your tickets.</p>
      </div>
    </body>
    </html>`;

    const subject = `Your tickets for ${program_name}`;
    const plainList = ticketCodes.join(", ");
    const plain = `Thank you ${name}. Your ticket codes: ${plainList}`;
    GmailApp.sendEmail(email, subject, plain, { htmlBody: html });
    return _jsonResponse({ success: true, message: "Ticket email sent", tickets: ticketCodes.length });
  }

  // default registration template
  const program_name = payload.program_name || payload.program_title || "";
  const group_link = payload.group_link || "#";

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Thank You for Your Registration</title>
  </head>
  <body style="margin:0; padding:0; background-color:#ffffff; font-family:Arial, Helvetica, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff; padding:40px 0;">
      <tr>
        <td align="center">
          <!-- Email Container -->
          <table width="600" cellpadding="0" cellspacing="0" style="background-color:#171717; border-radius:16px; padding:40px; color:#ffffff;">
            <!-- Logo / Header -->
            <tr>
              <td align="center" style="padding-bottom:30px;">
                <img src="https://res.cloudinary.com/dejwvjifh/image/upload/v1766512477/wide_banner_irouzt.png" alt="Logo" style="display:block; width:100%;" />
              </td>
            </tr>
            <!-- Title -->
            <tr>
              <td style="padding-bottom:20px;">
                <h1 style="margin:0; font-size:32px; font-weight:bold; line-height:1.3;">
                  THANK YOU FOR<br>
                  <span style="color:#ffffff;">YOUR REGISTRATION</span>
                </h1>
                <div style="width:50px; height:3px; background:#e53935; margin-top:15px;"></div>
              </td>
            </tr>
            <!-- Content -->
            <tr>
              <td style="padding:20px 0; font-size:15px; line-height:1.7; color:#dddddd;">
                <p style="margin:0 0 15px;">
                  Thank you for applying to <strong>${escapeHtml(
                    program_name
                  )}</strong>. We're excited to have you and appreciate your interest in joining our program.
                </p>
                <p style="margin:0 0 10px; font-weight:bold;">
                  What's next?
                </p>
                <p style="margin:0;">
                  To stay updated with all announcements, session schedules, and important instructions, please join our official WhatsApp group using the link below:
                </p>
              </td>
            </tr>
            <!-- Button -->
            <tr>
              <td align="left" style="padding:30px 0;">
                <a href="${group_link}" style="display:inline-block; padding:14px 28px; background-color:#e53935; color:#ffffff; text-decoration:none; font-weight:bold; border-radius:8px; font-size:14px; letter-spacing:0.5px;">
                  JOIN WHATSAPP
                </a>
              </td>
            </tr>
            <!-- Footer Text -->
            <tr>
              <td style="padding-top:20px; font-size:13px; color:#aaaaaa;">
                The link will expire at the start date of the program.
              </td>
            </tr>
            <!-- Divider -->
            <tr>
              <td style="padding:30px 0;">
                <hr style="border:none; border-top:1px solid #2a2a2a;">
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td align="center" style="font-size:12px; color:#777777;">
                Thank you for applying to ${escapeHtml(
                  program_name
                )}. We're excited to have you and appreciate your interest in joining our program.
              </td>
            </tr>
          </table>
          <!-- End Container -->
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  const subject = "Program registration";
  const plainBody = "Thank you for your registration to " + program_name + ".";
  GmailApp.sendEmail(email, subject, plainBody, { htmlBody: html });
  return _jsonResponse({ success: true, message: "Email sent" });
}

// helper to set the EXPECTED_TOKEN in script properties
function setExpectedToken(token) {
  PropertiesService.getScriptProperties().setProperty("EXPECTED_TOKEN", token);
}

// minimal HTML-escape helper for safe insertion
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
