import express from 'express';
import prisma from '../config/prisma.js';
import { validateQuote, sanitizeQuote } from '../utils/validateQuote.js';
import nodemailer from 'nodemailer';
import multer from 'multer';
import supabase from '../config/supabase.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// POST /api/quotes
router.post('/', upload.single('attachment'), async (req, res) => {
  try {
    const errors = validateQuote(req.body || {});
    if (errors.length) {
      return res.status(400).json({ success: false, message: errors[0] });
    }

    const data = sanitizeQuote(req.body);
    
    let attachmentUrl = null;
    let emailAttachments = [];

    if (req.file) {
      const fileName = `quotes/${Date.now()}-${req.file.originalname}`;
      
      const { data: uploadData, error } = await supabase.storage
        .from('stenth')
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false
        });

      if (error) {
        console.error('Error uploading file to Supabase:', error);
      } else {
        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
          .from('stenth')
          .createSignedUrl(fileName, 60 * 60 * 24 * 7); // 7 days expiration
          
        if (signedUrlData && signedUrlData.signedUrl) {
          attachmentUrl = signedUrlData.signedUrl;
        } else {
          // Fallback
          const { data: publicUrlData } = supabase.storage
            .from('stenth')
            .getPublicUrl(fileName);
          attachmentUrl = publicUrlData.publicUrl;
        }
        
        emailAttachments.push({
          filename: req.file.originalname,
          content: req.file.buffer
        });
      }
    }

    const newQuote = await prisma.quote.create({ 
      data: {
        ...data,
        attachment: attachmentUrl
      }
    });

    // Send email to owner
    const ownerEmails = (process.env.OWNER_EMAIL || 'info@modernmasonrygroup.ca')
      .split(',')
      .map(email => email.trim())
      .filter(Boolean);

    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@modernmasonrygroup.ca',
      to: ownerEmails,
      subject: `New Quote Request - ${data.role || 'General'} | ${data.fullName}`,
      text: `You have received a new quote request.\n\nName: ${data.fullName}\nEmail: ${data.email}\nPhone: ${data.phone || 'N/A'}\nCompany: ${data.company || 'N/A'}\nRole/Project Type: ${data.role || 'N/A'}\n\nDetails:\n${data.details || 'N/A'}`,
      attachments: emailAttachments,
      html: `
        <!DOCTYPE html>
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

                  <!-- HEADER -->
                  <tr>
                    <td align="center" style="padding:40px 30px 20px;background:#000000;">
                      
                      <img 
                        src="https://modern-masonry-group.vercel.app/Logo-MM%20(1).png" 
                        alt="Modern Masonry Group"
                        width="260"
                        style="display:block;margin-bottom:20px;"
                      />

                      <h1 style="margin:0;font-size:30px;color:#d4af37;font-weight:700;">
                        New Quote Request
                      </h1>

                      <p style="margin-top:10px;color:#bbbbbb;font-size:15px;line-height:24px;">
                        A new customer has submitted a quote request through the website.
                      </p>

                    </td>
                  </tr>

                  <!-- CONTENT -->
                  <tr>
                    <td style="padding:35px 40px;">

                      <table width="100%" cellpadding="0" cellspacing="0" border="0">

                        <tr>
                          <td style="padding-bottom:18px;text-align:left;">
                            <span style="color:#888888;font-size:13px;">Full Name</span>
                            <div style="font-size:18px;font-weight:bold;color:#ffffff;margin-top:4px;">
                              ${data.fullName}
                            </div>
                          </td>
                        </tr>

                        <tr>
                          <td style="padding-bottom:18px;text-align:left;">
                            <span style="color:#888888;font-size:13px;">Email Address</span>
                            <div style="font-size:16px;color:#ffffff;margin-top:4px;">
                              <a href="mailto:${data.email}" style="color:#ffffff;text-decoration:none;">${data.email}</a>
                            </div>
                          </td>
                        </tr>

                        <tr>
                          <td style="padding-bottom:18px;text-align:left;">
                            <span style="color:#888888;font-size:13px;">Phone Number</span>
                            <div style="font-size:16px;color:#ffffff;margin-top:4px;">
                              ${data.phone || 'N/A'}
                            </div>
                          </td>
                        </tr>

                        <tr>
                          <td style="padding-bottom:18px;text-align:left;">
                            <span style="color:#888888;font-size:13px;">Company</span>
                            <div style="font-size:16px;color:#ffffff;margin-top:4px;">
                              ${data.company || 'N/A'}
                            </div>
                          </td>
                        </tr>

                        <tr>
                          <td style="padding-bottom:18px;text-align:left;">
                            <span style="color:#888888;font-size:13px;">Project Type</span>
                            <div style="font-size:16px;color:#ffffff;margin-top:4px;">
                              ${data.role || 'N/A'}
                            </div>
                          </td>
                        </tr>

                        <!-- MESSAGE -->
                        <tr>
                          <td align="left" style="padding-top:10px;text-align:left;">
                            <div align="left" style="background:#111111;border:1px solid #2b2b2b;border-radius:10px;padding:25px;text-align:left;">
                              
                              <div style="color:#d4af37;font-size:16px;font-weight:bold;margin-bottom:12px;text-align:left;">
                                Project Details
                              </div>

                              <div style="color:#dddddd;font-size:15px;line-height:28px;white-space:pre-wrap;text-align:left;">
                                ${data.details || 'No details provided.'}
                              </div>

                            </div>
                          </td>
                        </tr>

                        ${attachmentUrl ? `
                        <!-- ATTACHMENT LINK -->
                        <tr>
                          <td align="left" style="padding-top:10px;text-align:left;">
                            <div align="left" style="background:#111111;border:1px solid #2b2b2b;border-radius:10px;padding:25px;text-align:left;">
                              
                              <div style="color:#d4af37;font-size:16px;font-weight:bold;margin-bottom:12px;text-align:left;">
                                Attachment Link
                              </div>

                              <div style="color:#dddddd;font-size:15px;line-height:28px;text-align:left;">
                                <a href="${attachmentUrl}" target="_blank" style="color:#d4af37;text-decoration:underline;word-break:break-all;">
                                  View / Download Attached File
                                </a>
                              </div>

                            </div>
                          </td>
                        </tr>
                        ` : ''}

                      </table>

                    </td>
                  </tr>

                  <!-- FOOTER -->
                  <tr>
                    <td align="center" style="background:#0a0a0a;padding:30px 20px;border-top:1px solid #1f1f1f;">

                      <div style="color:#888888;font-size:13px;line-height:24px;">
                        Modern Masonry Group<br/>
                        Professional Masonry & Construction Services
                      </div>

                      <div style="margin-top:10px;color:#555555;font-size:12px;">
                        This email was automatically generated from your website quote form.
                      </div>

                    </td>
                  </tr>

                </table>

              </td>
            </tr>
          </table>

        </body>
        </html>
      `
    };

    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        await transporter.sendMail(mailOptions);
      } else {
        console.warn('Email credentials not configured. Skipping email sending.');
      }
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // We don't want to fail the quote creation if email fails
    }

    res.status(201).json({ success: true, data: newQuote, message: 'Quote generated successfully' });
  } catch (error) {
    console.error('Error creating quote:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
