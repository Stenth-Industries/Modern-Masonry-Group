module.exports = function(pptx, COLORS, URLS, addGoldRule, addText) {
    let slide;

    // SLIDE 16
    slide = pptx.addSlide({ masterName: 'MASTER_DARK' });
    addText(slide, "Your Dedicated \nIn-House Marketing Team", 1, 0.5, 8, 1.2, { fontFace: 'Georgia', fontSize: 44, color: COLORS.ivory, bold: true });
    addGoldRule(slide, 1, 2.0, 1.4);
    addText(slide, "Every serious, growing company has a dedicated marketing team.", 1, 2.3, 8, 0.4, { fontFace: 'Calibri', fontSize: 15, color: COLORS.ivory_dim });

    // Left Box - TRADITIONAL
    slide.addShape(pptx.ShapeType.rect, { x: 1, y: 3.1, w: 3.8, h: 2, fill: { color: COLORS.panel } });
    slide.addShape(pptx.ShapeType.rect, { x: 1, y: 3.1, w: 0.05, h: 2, fill: { color: COLORS.stenth } });
    addText(slide, "THE TRADITIONAL WAY", 1.2, 3.3, 3.5, 0.3, { fontFace: 'Calibri', fontSize: 10, color: COLORS.stenth, bold: true, charSpacing: 3 });
    addText(slide, "Hire internal staff.\nHigh cost. Slow to hire. Hard to manage.", 1.2, 3.8, 3.5, 1.0, { fontFace: 'Calibri', fontSize: 14, color: COLORS.ivory });

    // Right Box - STENTH
    slide.addShape(pptx.ShapeType.rect, { x: 5.2, y: 3.1, w: 3.8, h: 2, fill: { color: COLORS.panel } });
    slide.addShape(pptx.ShapeType.rect, { x: 5.2, y: 3.1, w: 0.05, h: 2, fill: { color: COLORS.gold } });
    addText(slide, "THE STENTH WAY", 5.4, 3.3, 3.5, 0.3, { fontFace: 'Calibri', fontSize: 10, color: COLORS.gold, bold: true, charSpacing: 3 });
    addText(slide, "We become that team.\nIntegrated. Accountable. Focused on growth.", 5.4, 3.8, 3.5, 1.0, { fontFace: 'Calibri', fontSize: 14, color: COLORS.ivory, bold: true });
    slide.addNotes("Instead of hiring and managing internally, we become that team. We coordinate with your people, learn your business, and operate as a genuine extension of MMG.");

    // SLIDE 17
    slide = pptx.addSlide({ masterName: 'MASTER_DARK' });
    addText(slide, "Not an Expense. An Investment.", 1, 0.5, 8, 0.8, { fontFace: 'Georgia', fontSize: 32, color: COLORS.ivory, bold: true });

    slide.addShape(pptx.ShapeType.rect, { x: 1, y: 1.5, w: 8, h: 1.5, fill: { color: COLORS.panel } });
    slide.addShape(pptx.ShapeType.rect, { x: 1, y: 1.5, w: 0.05, h: 1.5, fill: { color: COLORS.gold } });
    addText(slide, `"Just like this office and showroom — the investment you made to build it — you did that because it creates an impression, builds trust, and brings in more business. Your online presence should do exactly the same thing. But at scale."`, 
        1.2, 1.7, 7.6, 1.1, { fontFace: 'Georgia', fontSize: 15, color: COLORS.ivory, italic: true, lineSpacing: 22 });

    const rows17 = [
        ["A great office & showroom", "Builds trust in person"],
        ["A great online presence", "Builds trust at scale — 24/7"],
        ["Stenth as your partner", "Turns that presence into revenue"]
    ];
    rows17.forEach((r, i) => {
        let _y = 3.5 + (i * 0.5);
        addText(slide, r[0], 1, _y, 3.5, 0.4, { fontFace: 'Calibri', fontSize: 13, color: COLORS.ivory, bold: true });
        addText(slide, "→", 4.5, _y, 0.4, 0.4, { fontFace: 'Calibri', fontSize: 13, color: COLORS.gold });
        addText(slide, r[1], 5, _y, 4.0, 0.4, { fontFace: 'Calibri', fontSize: 13, color: COLORS.gold });
    });
    slide.addNotes("This isn't a cost. Just like this office builds trust and brings in clients — your online presence should do the same. At scale.");

    // SLIDE 18
    slide = pptx.addSlide({ masterName: 'MASTER_GOLD_ACCENTS' });
    addText(slide, "Now...", 1, 1, 3, 0.5, { fontFace: 'Georgia', fontSize: 22, color: COLORS.ivory_dim, italic: true });
    addText(slide, "Ready for the\nexciting part?", 1, 1.8, 8, 1.5, { fontFace: 'Georgia', fontSize: 54, color: COLORS.ivory, bold: true });
    addGoldRule(slide, 1, 3.5, 2);
    addText(slide, "Because everything we've talked about... it already exists.", 1, 4.0, 8, 0.5, { fontFace: 'Calibri', fontSize: 16, color: COLORS.gold });
    
    // Ghosted Logo (low opacity)
    slide.addImage({ path: URLS.mmg_logo, x: 7, y: 0.5, w: 2.5, h: 0.7, sizing: { type: 'contain', w: 2.5, h: 0.7 }, transparency: 88 });
    slide.addNotes("AAKASH: Pause here. Build anticipation. Everything we've talked about — it's not a concept. It already exists. Let me show you.");

    // SLIDE 19
    slide = pptx.addSlide({ masterName: 'MASTER_GOLD_ACCENTS' });
    slide.addImage({ path: URLS.mmg_logo, x: 3.5, y: 0.8, w: 3, h: 1, sizing: { type: 'contain', w: 3, h: 1 } });
    
    addText(slide, "THE NEW", 1, 2.6, 8, 0.4, { fontFace: 'Calibri', fontSize: 16, color: COLORS.gold, bold: true, charSpacing: 10, align: 'center' });
    addText(slide, "Modern Masonry Group", 1, 3.2, 8, 0.8, { fontFace: 'Georgia', fontSize: 42, color: COLORS.ivory, bold: true, align: 'center' });
    
    slide.addShape(pptx.ShapeType.rect, { x: 2.5, y: 4.2, w: 5, h: 0.6, fill: { color: COLORS.panel }, line: { color: COLORS.gold, width: 1 } });
    addText(slide, "modern-masonry-group.vercel.app", 2.5, 4.3, 5, 0.4, { fontFace: 'Calibri', fontSize: 14, color: COLORS.gold, align: 'center' });
    slide.addNotes("AAKASH: Open the browser. Navigate to modern-masonry-group.vercel.app — walk them through it. Let the work speak.");

    // SLIDE 20
    slide = pptx.addSlide({ masterName: 'MASTER_DARK' });
    addText(slide, "If this makes sense...", 1, 1, 8, 0.4, { fontFace: 'Georgia', fontSize: 18, color: COLORS.ivory_dim, italic: true });
    addText(slide, "Let's map out what\nthis looks like for MMG.", 1, 1.5, 8, 1.2, { fontFace: 'Georgia', fontSize: 40, color: COLORS.ivory, bold: true });
    addGoldRule(slide, 1, 3.0, 1.8);
    
    slide.addShape(pptx.ShapeType.rect, { x: 1, y: 3.5, w: 8, h: 1.5, fill: { color: COLORS.panel } });
    slide.addShape(pptx.ShapeType.rect, { x: 1, y: 3.5, w: 0.05, h: 1.5, fill: { color: COLORS.gold } });
    addText(slide, "The next step is simple: we sit down together and map out a strategy specifically tailored to Modern Masonry Group — the right system, the right timeline, and what results look like in month 1, 3, and 6.", 
        1.2, 3.7, 7.6, 1.1, { fontFace: 'Calibri', fontSize: 14, color: COLORS.ivory, lineSpacing: 22 });
        
    slide.addImage({ path: URLS.stenth_logo, x: 9.3, y: 5.1, w: 0.55, h: 0.2, sizing: { type: 'contain', w: 0.55, h: 0.2 } });
    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 5.525, w: 10, h: 0.1, fill: { color: COLORS.gold } });
    slide.addNotes("If this makes sense, the next step is simple: sit down together and map out a strategy tailored entirely to MMG — the right system, the right timeline, what results look like in month 1, 3, and 6.");
};
