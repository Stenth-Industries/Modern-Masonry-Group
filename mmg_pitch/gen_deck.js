const pptxgen = require('pptxgenjs');

let pptx = new pptxgen();
pptx.layout = 'LAYOUT_16x9'; // This is 10 x 5.625 by default in pptxgenjs natively

const COLORS = {
    dark: '050505',
    dark_navy: '0D1117',
    panel: '151E2A',
    gold: 'C9A449',
    gold_soft: 'E8D5A0',
    gold_dark: '7A6430',
    stenth: 'C84B31',
    ivory: 'F0ECE4',
    ivory_dim: 'A89F94',
    white: 'FFFFFF',
    slate: '546472'
};

const URLS = {
    stenth_logo: 'https://stenth.com/Stenth_Logo-removebg.png',
    mmg_logo: 'https://modern-masonry-group.vercel.app/Logo-PNG.png',
    wall_bg: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1920&auto=format&fit=crop'
};

// MASTER SLIDES
pptx.defineSlideMaster({
    title: 'MASTER_DARK',
    background: { fill: COLORS.dark },
    objects: [
        { rect: { x: 0, y: 0, w: 0.07, h: 5.625, fill: { color: COLORS.gold } } } // Gold left vertical bar
    ]
});

pptx.defineSlideMaster({
    title: 'MASTER_GOLD_ACCENTS',
    background: { fill: COLORS.dark },
    objects: [
        { rect: { x: 0, y: 0, w: 10, h: 0.1, fill: { color: COLORS.gold } } }, // Top bar
        { rect: { x: 0, y: 5.525, w: 10, h: 0.1, fill: { color: COLORS.gold } } } // Bottom bar
    ]
});

// Helper for gold horizontal rule
const addGoldRule = (slide, x, y, w = 1.5) => {
    slide.addShape(pptx.ShapeType.rect, { x: x, y: y, w: w, h: 0.02, fill: { color: COLORS.gold } });
};

// Helper for small standard text box
const addText = (slide, text, x, y, w, h, opts) => {
    slide.addText(text, { x, y, w, h, ...opts, wrap: true });
};

// Start building slides
let slide;

// SLIDE 1
slide = pptx.addSlide({ masterName: 'MASTER_DARK' });
slide.addShape(pptx.ShapeType.rect, { x: 5, y: 0, w: 5, h: 5.625, fill: { color: COLORS.dark_navy } });
slide.addImage({ path: URLS.wall_bg, x: 5, y: 0, w: 5, h: 5.625, sizing: { type: 'crop', w: 5, h: 5.625 } });

// Gold border frame
slide.addShape(pptx.ShapeType.rect, { x: 0.07, y: 0, w: 9.93, h: 5.625, fill: { transparency: 100 }, line: { color: COLORS.gold, width: 1 } });
slide.addImage({ path: URLS.mmg_logo, x: 0.5, y: 0.5, w: 2, h: 0.5, sizing: { type: 'contain', w: 2, h: 0.5 } });
addGoldRule(slide, 0.5, 1.25, 2);
addText(slide, 'GROWTH & DIGITAL STRATEGY', 0.5, 2.2, 4, 0.3, { fontFace: 'Calibri', fontSize: 10, color: COLORS.gold, bold: true, charSpacing: 3 });
addText(slide, 'A Partnership Proposal', 0.5, 2.5, 4.5, 1, { fontFace: 'Georgia', fontSize: 44, color: COLORS.ivory, bold: true });
addText(slide, 'Presented by', 8.5, 4.8, 1, 0.3, { fontFace: 'Calibri', fontSize: 11, color: COLORS.ivory_dim });
slide.addImage({ path: URLS.stenth_logo, x: 8.5, y: 5.1, w: 0.6, h: 0.2, sizing: { type: 'contain', w: 0.6, h: 0.2 } });
slide.addNotes("Appreciate you taking the time today. I'll walk you through what we see, what's currently missing, and exactly how we can help you scale this.");

// SLIDE 2
slide = pptx.addSlide({ masterName: 'MASTER_DARK' });
addText(slide, "Here's something most masonry businesses share:", 1, 1, 8, 0.5, { fontFace: 'Georgia', fontSize: 14, color: COLORS.ivory_dim, italic: true });
addText(slide, `"Most masonry companies grow through referrals... but that limits how much they can scale."`, 1, 1.6, 8, 1.5, { fontFace: 'Georgia', fontSize: 40, color: COLORS.ivory, bold: true });
addGoldRule(slide, 1, 3.2, 1.2);
addText(slide, "Meanwhile, people are actively searching for your services every single day.", 1, 3.6, 8, 0.5, { fontFace: 'Calibri', fontSize: 16, color: COLORS.gold });
slide.addNotes("Most masonry companies grow through referrals and word of mouth — which works, but it puts a ceiling on how much you can scale.");

// SLIDE 3
slide = pptx.addSlide({ masterName: 'MASTER_DARK' });
addText(slide, "Customers Are Already Searching", 0.5, 0.5, 8, 0.6, { fontFace: 'Georgia', fontSize: 30, color: COLORS.ivory, bold: true });
addGoldRule(slide, 0.5, 1.2, 1.5);
addText(slide, "Real searches happening in Ontario — every single day", 0.5, 1.3, 8, 0.4, { fontFace: 'Georgia', fontSize: 13, color: COLORS.ivory_dim, italic: true });

const searches = [
    { text: "masonry contractor near me", vol: "HIGH VOLUME" },
    { text: "brick installation Ontario", vol: "HIGH VOLUME" },
    { text: "stone wall builders Toronto", vol: "MED VOLUME" },
    { text: "masonry company commercial", vol: "MED VOLUME" }
];
searches.forEach((s, i) => {
    let _x = (i % 2 === 0) ? 0.5 : 5.0;
    let _y = (i < 2) ? 1.9 : 2.8;
    slide.addShape(pptx.ShapeType.rect, { x: _x, y: _y, w: 4.2, h: 0.7, fill: { color: COLORS.panel }, line: { color: COLORS.gold, width: 1 } });
    addText(slide, "🔍 " + s.text, _x + 0.1, _y + 0.1, 4.0, 0.3, { fontFace: 'Calibri', fontSize: 14, color: COLORS.ivory });
    addText(slide, s.vol, _x + 0.1, _y + 0.4, 4.0, 0.2, { fontFace: 'Calibri', fontSize: 10, color: COLORS.gold, bold: true, charSpacing: 2 });
});

const stats3 = [
    { num: "97%", text: "consumers search online for local services" },
    { num: "78%", text: "mobile searches lead to a purchase within 24hrs" },
    { num: "681%", text: "avg ROI for construction cos. using digital marketing" }
];
stats3.forEach((s, i) => {
    let _x = 0.5 + (i * 3.1);
    let _y = 4.0;
    slide.addShape(pptx.ShapeType.rect, { x: _x, y: _y, w: 2.9, h: 1.2, fill: { color: COLORS.gold_dark }, line: { color: COLORS.gold, width: 1 } });
    slide.addShape(pptx.ShapeType.rect, { x: _x, y: _y, w: 0.05, h: 1.2, fill: { color: COLORS.gold } });
    addText(slide, s.num, _x + 0.15, _y + 0.1, 2.6, 0.5, { fontFace: 'Georgia', fontSize: 28, color: COLORS.gold, bold: true });
    addText(slide, s.text, _x + 0.15, _y + 0.6, 2.6, 0.5, { fontFace: 'Calibri', fontSize: 10, color: COLORS.ivory_dim });
});
slide.addNotes("97% of consumers search online for local services. 78% of mobile searches lead to a purchase within 24 hours. The demand is there — it just needs to be captured.");

// SLIDE 4
slide = pptx.addSlide({ background: { fill: COLORS.dark } });
slide.addImage({ path: URLS.wall_bg, x: 0, y: 0, w: 5, h: 5.625, sizing: { type: 'crop', w: 5, h: 5.625 } });
// Dark overlay to darken image
slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 5, h: 5.625, fill: { type: 'solid', color: COLORS.dark, transparency: 50 } });
slide.addShape(pptx.ShapeType.rect, { x: 5, y: 0, w: 5, h: 5.625, fill: { color: COLORS.dark } });
slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.1, fill: { color: COLORS.gold } });

addText(slide, "EST. 1994", 0.5, 0.2, 2, 0.3, { fontFace: 'Calibri', fontSize: 10, color: COLORS.ivory_dim, charSpacing: 3 });
addText(slide, "A High-Ticket Business", 0.5, 4.8, 4, 0.5, { fontFace: 'Georgia', fontSize: 22, color: COLORS.ivory, bold: true });

addText(slide, "You're in a High-Ticket Business", 5.4, 0.8, 4.2, 0.8, { fontFace: 'Georgia', fontSize: 30, color: COLORS.ivory, bold: true });
addText(slide, "Project-based. High value. Every lead matters.", 5.4, 1.6, 4.2, 0.4, { fontFace: 'Georgia', fontSize: 13, color: COLORS.ivory_dim, italic: true });

const stats4 = [
    { num: "$15K–100K+", text: "typical project value" },
    { num: "1 deal", text: "can change the month" },
    { num: "Est. 1994", text: "decades of expertise" }
];
stats4.forEach((s, i) => {
    let _y = 2.4 + (i * 0.95);
    slide.addShape(pptx.ShapeType.rect, { x: 5.4, y: _y, w: 4.2, h: 0.8, fill: { color: COLORS.panel } });
    addText(slide, s.num, 5.5, _y + 0.1, 4.0, 0.4, { fontFace: 'Georgia', fontSize: 26, color: COLORS.gold, bold: true });
    addText(slide, s.text, 5.5, _y + 0.5, 4.0, 0.3, { fontFace: 'Calibri', fontSize: 13, color: COLORS.ivory_dim });
});
slide.addNotes("You're in a high-ticket business. One project can be $15–100K+. Growth comes from consistent, high-quality leads — not volume.");

// SLIDE 5
slide = pptx.addSlide({ masterName: 'MASTER_DARK' });
addText(slide, "GAP 01", 1, 0.5, 2, 0.3, { fontFace: 'Calibri', fontSize: 10, color: COLORS.gold, bold: true, charSpacing: 3 });
addText(slide, "Website", 1, 0.8, 8, 0.7, { fontFace: 'Georgia', fontSize: 42, color: COLORS.ivory, bold: true });
addText(slide, "Presence Without Performance", 1, 1.5, 8, 0.4, { fontFace: 'Georgia', fontSize: 20, color: COLORS.gold });
addGoldRule(slide, 1, 2.0, 1.5);
addText(slide, "A website that exists but doesn't convert is a missed opportunity every single day.", 1, 2.2, 8, 0.4, { fontFace: 'Georgia', fontSize: 13, color: COLORS.ivory_dim, italic: true });

const rows5 = [
    { title: "🌐 No clear call to action", desc: "Visitors land and don't know what to do next. No quote forms, no lead capture, no next step." },
    { title: "🔍 No structured service pages", desc: "Each service needs its own SEO-optimised page to rank on Google and convert intent into enquiries." },
    { title: "📊 No lead capture system", desc: "No enquiry forms, no quote requests, no follow-up — visitors leave without a way to reach you." }
];
rows5.forEach((r, i) => {
    let _y = 2.7 + (i * 0.9);
    slide.addShape(pptx.ShapeType.rect, { x: 1, y: _y, w: 8, h: 0.75, fill: { color: COLORS.panel }, line: { color: COLORS.gold_dark, width: 0.5 } });
    slide.addShape(pptx.ShapeType.rect, { x: 1, y: _y, w: 0.05, h: 0.75, fill: { color: COLORS.gold } });
    addText(slide, r.title, 1.2, _y + 0.1, 7.6, 0.3, { fontFace: 'Calibri', fontSize: 13, color: COLORS.gold, bold: true });
    addText(slide, r.desc, 1.2, _y + 0.35, 7.6, 0.35, { fontFace: 'Calibri', fontSize: 12, color: COLORS.ivory_dim });
});
slide.addNotes("Right now, the website exists — but it's not working as a system to bring in leads consistently.");

// Run generation
// Next is Slide 6 - 20
require('./slides_6_to_10.js')(pptx, COLORS, URLS, addGoldRule, addText);
require('./slides_11_to_15.js')(pptx, COLORS, URLS, addGoldRule, addText);
require('./slides_16_to_20.js')(pptx, COLORS, URLS, addGoldRule, addText);

// Save the Presentation
pptx.writeFile({ fileName: 'MMG_Stenth_Pitch_v2.pptx' }).then(fileName => {
    console.log(`Created file: ${fileName}`);
});

