module.exports = function(pptx, COLORS, URLS, addGoldRule, addText) {
    let slide;

    // SLIDE 11
    slide = pptx.addSlide({ masterName: 'MASTER_DARK' });
    addText(slide, "INTRODUCING", 1, 1, 3, 0.4, { fontFace: 'Calibri', fontSize: 11, color: COLORS.gold, bold: true, charSpacing: 3 });
    slide.addImage({ path: URLS.stenth_logo, x: 1, y: 1.4, w: 1.5, h: 0.6, sizing: { type: 'contain', w: 1.5, h: 0.6 } });
    addText(slide, "STENTH", 2.7, 1.4, 4, 1, { fontFace: 'Georgia', fontSize: 52, color: COLORS.ivory, bold: true });
    addText(slide, "stenth.com", 1, 2.5, 4, 0.4, { fontFace: 'Calibri', fontSize: 14, color: COLORS.ivory_dim });
    addGoldRule(slide, 1, 3.1, 1.5);
    addText(slide, "Strategy.  Marketing.  Growth.", 1, 3.5, 8, 0.5, { fontFace: 'Calibri', fontSize: 18, color: COLORS.ivory, bold: true, charSpacing: 3 });
    addText(slide, "We don't just build websites.\nWe build systems that consistently bring in qualified leads.", 1, 4.3, 8, 1, { fontFace: 'Georgia', fontSize: 22, color: COLORS.gold, bold: true });
    slide.addNotes("At Stenth, we don't just build websites or run ads — we build complete growth systems that bring in qualified leads consistently.");

    // SLIDE 12
    slide = pptx.addSlide({ masterName: 'MASTER_GOLD_ACCENTS' });
    addText(slide, "MMG'S STORY — TOLD ONLINE", 1, 0.3, 8, 0.4, { fontFace: 'Calibri', fontSize: 12, color: COLORS.gold, bold: true, charSpacing: 3, align: 'center' });
    
    slide.addShape(pptx.ShapeType.rect, { x: 1.5, y: 1.0, w: 7.0, h: 3.4, fill: { color: '08090C' }, line: { color: COLORS.gold, width: 1.5 } });
    addText(slide, "▶", 4.5, 2.0, 1, 0.8, { fontFace: 'Calibri', fontSize: 24, color: COLORS.gold, align: 'center' });
    addText(slide, "[VIDEO PLAYS HERE]", 3, 2.8, 4, 0.4, { fontFace: 'Calibri', fontSize: 14, color: COLORS.ivory_dim, italic: true, align: 'center' });
    
    slide.addImage({ path: URLS.mmg_logo, x: 4.5, y: 4.5, w: 1, h: 0.3, sizing: { type: 'contain', w: 1, h: 0.3 } });
    addText(slide, "This is how we want to portray Modern Masonry Group online — telling its story visually, with precision and prestige.", 1, 4.9, 8, 0.5, { fontFace: 'Georgia', fontSize: 13, color: COLORS.ivory_dim, italic: true, align: 'center' });
    slide.addNotes("AAKASH: Play the video/brand demo here. This is exactly how we want to present MMG's story online — its craftsmanship, its legacy since 1994 — told visually.");

    // Helper for Step slides (13, 14, 15)
    const addStepSlide = (num, title, subtitle, rows, notes) => {
        let s = pptx.addSlide({ masterName: 'MASTER_DARK' });
        s.addShape(pptx.ShapeType.rect, { x: 1, y: 0.5, w: 0.7, h: 0.7, fill: { transparency: 100 }, line: { color: COLORS.gold, width: 2 } });
        addText(s, num, 1, 0.55, 0.7, 0.6, { fontFace: 'Georgia', fontSize: 22, color: COLORS.gold, bold: true, align: 'center' });
        addText(s, title, 1.9, 0.5, 7, 0.8, { fontFace: 'Georgia', fontSize: 36, color: COLORS.ivory, bold: true });
        addText(s, subtitle, 1, 1.5, 8, 0.5, { fontFace: 'Georgia', fontSize: 13, color: COLORS.ivory_dim, italic: true });

        rows.forEach((r, i) => {
            let _y = 2.2 + (i * 1.0);
            s.addShape(pptx.ShapeType.rect, { x: 1, y: _y, w: 8, h: 0.85, fill: { color: COLORS.panel }, line: { color: COLORS.gold_dark, width: 0.5 } });
            s.addShape(pptx.ShapeType.rect, { x: 1, y: _y, w: 0.05, h: 0.85, fill: { color: COLORS.gold } });
            addText(s, r.line1, 1.2, _y + 0.1, 7.6, 0.3, { fontFace: 'Calibri', fontSize: 13, color: COLORS.gold, bold: true });
            addText(s, r.line2, 1.2, _y + 0.4, 7.6, 0.35, { fontFace: 'Calibri', fontSize: 12, color: COLORS.ivory_dim });
        });
        s.addNotes(notes);
    };

    // SLIDE 13
    addStepSlide("01", "Foundation", "First, we fix what's underneath everything else.", [
        { line1: "🌐 High-converting website", line2: "Not just beautiful — built to turn visitors into enquiries. Clear structure, fast load, mobile-first design." },
        { line1: "🎯 Clear brand messaging", line2: "Every visitor should immediately know who MMG is, what you offer, and why they should call — within 5 seconds." },
        { line1: "🏢 Strong portfolio showcase", line2: "Your past work is your best sales tool. Presented to build instant trust with high-value clients." }
    ], "Step 1: Fix the foundation. A website that converts, clear messaging, strong portfolio. Everything built to work.");

    // SLIDE 14
    addStepSlide("02", "Traffic", "Bring the right people to the right place — consistently.", [
        { line1: "🔍 Google SEO", line2: "Dominate local search. When someone searches masonry in Ontario, MMG appears first." },
        { line1: "📣 Google Ads", line2: "Instant visibility for high-intent searches. Target people ready to hire — not just browse." },
        { line1: "🌐 Local visibility", line2: "Google Business optimisation, local citations, map rankings — own your local market completely." }
    ], "Step 2: Drive traffic. SEO builds long-term visibility. Ads bring instant leads. Local visibility makes MMG the obvious choice.");

    // SLIDE 15
    addStepSlide("03", "Conversion", "Traffic means nothing if visitors don't become clients.", [
        { line1: "💰 Lead funnels", line2: "Guided paths that take a visitor from \"interested\" to \"I want a quote\" — without friction." },
        { line1: "🎯 Quote forms", line2: "Smart, fast enquiry forms designed to capture quality leads with the right information upfront." },
        { line1: "📊 Follow-up systems", line2: "Automated follow-ups so no lead falls through the cracks. Every enquiry gets a timely response." }
    ], "Step 3: Convert. Lead funnels, quote forms, follow-up systems — so every interested visitor becomes a real enquiry.");

};
