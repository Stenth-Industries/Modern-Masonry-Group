import prisma from '../../Backend/config/prisma.js';
import { validateQuote, sanitizeQuote } from '../../Backend/utils/validateQuote.js';
import nodemailer from 'nodemailer';

// Simple in-memory rate limiter (per serverless instance — best-effort)
const ipHits = new Map();
const WINDOW_MS = 60 * 1000;
const MAX_HITS = 5;

function isRateLimited(ip) {
  const now = Date.now();
  const record = ipHits.get(ip) || { count: 0, windowStart: now };
  if (now - record.windowStart > WINDOW_MS) {
    ipHits.set(ip, { count: 1, windowStart: now });
    return false;
  }
  if (record.count >= MAX_HITS) return true;
  record.count++;
  ipHits.set(ip, record);
  return false;
}

function buildEmailHtml(data) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Quote Request</title>
</head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:Arial,sans-serif;color:#333333;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;padding:20px;">
    <tr>
      <td align="center">
        <table width="650" cellpadding="0" cellspacing="0" border="0" style="background:#171717;border-radius:14px;overflow:hidden;border:1px solid #2d2d2d;margin:0 auto;">
          <tr>
            <td align="center" style="padding:40px 30px 20px;background:#000000;">
              <img src="https://modern-masonry-group.vercel.app/Logo-MM%20(1).png" alt="Modern Masonry Group" width="260" style="display:block;margin-bottom:20px;" />
              <h1 style="margin:0;font-size:30px;color:#d4af37;font-weight:700;">New Quote Request</h1>
              <p style="margin-top:10px;color:#bbbbbb;font-size:15px;line-height:24px;">A new customer has submitted a quote request through the website.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:35px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td style="padding-bottom:18px;text-align:left;">
                  <span style="color:#888888;font-size:13px;">Full Name</span>
                  <div style="font-size:18px;font-weight:bold;color:#ffffff;margin-top:4px;">${data.fullName}</div>
                </td></tr>
                <tr><td style="padding-bottom:18px;text-align:left;">
                  <span style="color:#888888;font-size:13px;">Email Address</span>
                  <div style="font-size:16px;color:#ffffff;margin-top:4px;">
                    <a href="mailto:${data.email}" style="color:#ffffff;text-decoration:none;">${data.email}</a>
                  </div>
                </td></tr>
                <tr><td style="padding-bottom:18px;text-align:left;">
                  <span style="color:#888888;font-size:13px;">Phone Number</span>
                  <div style="font-size:16px;color:#ffffff;margin-top:4px;">${data.phone || 'N/A'}</div>
                </td></tr>
                <tr><td style="padding-bottom:18px;text-align:left;">
                  <span style="color:#888888;font-size:13px;">Company</span>
                  <div style="font-size:16px;color:#ffffff;margin-top:4px;">${data.company || 'N/A'}</div>
                </td></tr>
                <tr><td style="padding-bottom:18px;text-align:left;">
                  <span style="color:#888888;font-size:13px;">Project Type</span>
                  <div style="font-size:16px;color:#ffffff;margin-top:4px;">${data.role || 'N/A'}</div>
                </td></tr>
                <tr>
                  <td align="left" style="padding-top:10px;text-align:left;">
                    <div style="background:#111111;border:1px solid #2b2b2b;border-radius:10px;padding:25px;text-align:left;">
                      <div style="color:#d4af37;font-size:16px;font-weight:bold;margin-bottom:12px;">Project Details</div>
                      <div style="color:#dddddd;font-size:15px;line-height:28px;white-space:pre-wrap;">${data.details || 'No details provided.'}</div>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="background:#0a0a0a;padding:30px 20px;border-top:1px solid #1f1f1f;">
              <div style="color:#888888;font-size:13px;line-height:24px;">Modern Masonry Group<br/>Professional Masonry & Construction Services</div>
              <div style="margin-top:10px;color:#555555;font-size:12px;">This email was automatically generated from your website quote form.</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const ip = req.headers['x-real-ip']
    || req.headers['x-forwarded-for']?.split(',').at(-1)?.trim()
    || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ success: false, message: 'Too many requests. Please try again later.' });
  }

  try {
    const errors = validateQuote(req.body || {});
    if (errors.length) {
      return res.status(400).json({ success: false, message: errors[0] });
    }

    const data = sanitizeQuote(req.body);
    const newQuote = await prisma.quote.create({ data });

    // Send email notification
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const ownerEmails = (process.env.OWNER_EMAIL || 'info@modernmasonrygroup.ca')
          .split(',')
          .map(e => e.trim())
          .filter(Boolean);

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: ownerEmails,
          subject: `New Quote Request - ${data.role || 'General'} | ${data.fullName}`,
          text: `New quote request.\n\nName: ${data.fullName}\nEmail: ${data.email}\nPhone: ${data.phone || 'N/A'}\nCompany: ${data.company || 'N/A'}\nRole: ${data.role || 'N/A'}\n\nDetails:\n${data.details || 'N/A'}`,
          html: buildEmailHtml(data),
        });
      } catch (emailError) {
        console.error('[api/quotes] sendMail:', emailError);
      }
    } else {
      console.warn('[api/quotes] EMAIL_USER/EMAIL_PASS not set — skipping email.');
    }

    res.status(201).json({ success: true, data: newQuote, message: 'Quote generated successfully' });
  } catch (error) {
    console.error('[api/quotes] createQuote:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
