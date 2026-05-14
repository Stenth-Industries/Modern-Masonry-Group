import prisma from '../../Backend/config/prisma.js';
import { validateQuote, sanitizeQuote } from '../../Backend/utils/validateQuote.js';

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  // x-real-ip is set by Vercel and cannot be spoofed; fall back to the
  // rightmost (proxy-supplied) entry in x-forwarded-for, not the leftmost
  // (which the client can forge).
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

    res.status(201).json({ success: true, data: newQuote, message: 'Quote generated successfully' });
  } catch (error) {
    console.error('[api/quotes] createQuote:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
