module.exports = function(pptx, COLORS, URLS, addGoldRule, addText) {
    let slide;

    // SLIDE 6
    slide = pptx.addSlide({ masterName: 'MASTER_DARK' });
    addText(slide, "GAP 02", 1, 0.5, 2, 0.3, { fontFace: 'Calibri', fontSize: 10, color: COLORS.gold, bold: true, charSpacing: 3 });
    addText(slide, "No Predictable Lead Pipeline", 1, 0.8, 8, 0.7, { fontFace: 'Georgia', fontSize: 36, color: COLORS.ivory, bold: true });
    addText(slide, "Referrals are great. But they're not scalable, predictable, or targetable.", 1, 1.4, 8, 0.4, { fontFace: 'Georgia', fontSize: 13, color: COLORS.ivory_dim, italic: true });

    // TODAY Box
    slide.addShape(pptx.ShapeType.rect, { x: 1, y: 2.0, w: 3.8, h: 3.0, fill: { color: COLORS.panel } });
    slide.addShape(pptx.ShapeType.rect, { x: 1, y: 2.0, w: 0.05, h: 3.0, fill: { color: COLORS.stenth } });
    addText(slide, "TODAY", 1.2, 2.2, 3.5, 0.3, { fontFace: 'Calibri', fontSize: 9, color: COLORS.stenth, bold: true, charSpacing: 3 });
    addText(slide, "✗ Growth relies entirely on referrals\n✗ No consistent way to attract new clients\n✗ High-value clients are unreachable online\n✗ Revenue is unpredictable month to month\n✗ Growth plateaus — limited by word of mouth", 
        1.2, 2.6, 3.5, 2.2, { fontFace: 'Calibri', fontSize: 12, color: COLORS.ivory, bullet: false, lineSpacing: 28 });

    // WITH A SYSTEM Box
    slide.addShape(pptx.ShapeType.rect, { x: 5, y: 2.0, w: 3.8, h: 3.0, fill: { color: COLORS.panel } });
    slide.addShape(pptx.ShapeType.rect, { x: 5, y: 2.0, w: 0.05, h: 3.0, fill: { color: COLORS.gold } });
    addText(slide, "WITH A SYSTEM", 5.2, 2.2, 3.5, 0.3, { fontFace: 'Calibri', fontSize: 9, color: COLORS.gold, bold: true, charSpacing: 3 });
    addText(slide, "✓ Predictable flow of qualified leads monthly\n✓ Targeting builders, developers & commercial clients\n✓ Online presence works 24/7 even when you're not\n✓ Revenue compounds — not dependent on luck\n✓ Scalable growth with a system behind it", 
        5.2, 2.6, 3.5, 2.2, { fontFace: 'Calibri', fontSize: 12, color: COLORS.ivory, bullet: false, lineSpacing: 28 });
    slide.addNotes("The growth right now depends on referrals — not predictable or scalable. A system changes that.");

    // SLIDE 7
    slide = pptx.addSlide({ masterName: 'MASTER_DARK' });
    addText(slide, "So what's the real issue?", 1, 1.5, 8, 0.5, { fontFace: 'Georgia', fontSize: 15, color: COLORS.ivory_dim, italic: true });
    addText(slide, "Not a demand problem.\nA system problem.", 1, 2.0, 8, 1.5, { fontFace: 'Georgia', fontSize: 52, color: COLORS.ivory, bold: true });
    addGoldRule(slide, 1, 3.8, 1.5);
    addText(slide, "People are searching. The demand is real. The system to capture it just doesn't exist yet.", 1, 4.2, 8, 0.5, { fontFace: 'Calibri', fontSize: 16, color: COLORS.gold });
    slide.addNotes("This isn't a demand problem — it's simply that there's no system in place to capture that demand.");

    // SLIDE 8
    slide = pptx.addSlide({ masterName: 'MASTER_DARK' });
    addText(slide, "The Opportunity — In Plain Numbers", 1, 0.5, 8, 0.8, { fontFace: 'Georgia', fontSize: 32, color: COLORS.ivory, bold: true });
    addGoldRule(slide, 1, 1.3, 1.5);
    addText(slide, "What even a conservative improvement in lead flow looks like for MMG", 1, 1.5, 8, 0.4, { fontFace: 'Georgia', fontSize: 13, color: COLORS.ivory_dim, italic: true });

    const stats8 = [
        { num: "+2–3", text: "extra projects per month (conservative)" },
        { num: "+$50K", text: "additional monthly revenue (avg project $25K)" },
        { num: "+$600K", text: "additional revenue in year one alone" }
    ];
    stats8.forEach((s, i) => {
        let _x = 1 + (i * 2.7);
        slide.addShape(pptx.ShapeType.rect, { x: _x, y: 2.2, w: 2.5, h: 1.5, fill: { color: COLORS.panel }, line: { color: COLORS.gold, width: 1 } });
        addText(slide, s.num, _x + 0.1, 2.4, 2.3, 0.6, { fontFace: 'Georgia', fontSize: 44, color: COLORS.gold, bold: true, align: 'center' }); // Slightly smaller than 52 to fit nicely
        addText(slide, s.text, _x + 0.1, 3.1, 2.3, 0.5, { fontFace: 'Calibri', fontSize: 12, color: COLORS.ivory_dim, align: 'center' });
    });
    addText(slide, "If we bring you even 2–3 additional qualified projects per month, at an average value of $25,000, that's an extra $50,000/month — or over $600,000 in additional revenue in year one.", 1, 4.0, 8, 0.8, { fontFace: 'Calibri', fontSize: 14, color: COLORS.ivory });
    addText(slide, "And that's the conservative estimate.", 1, 4.7, 8, 0.4, { fontFace: 'Georgia', fontSize: 15, color: COLORS.gold, italic: true });
    slide.addNotes("Conservative: 2-3 extra projects at $25K = $50K/month = $600K+ in year one.");

    // SLIDE 9 - Native Chart!
    slide = pptx.addSlide({ masterName: 'MASTER_DARK' });
    addText(slide, "What the Growth Curve Looks Like", 1, 0.5, 8, 0.6, { fontFace: 'Georgia', fontSize: 28, color: COLORS.ivory, bold: true });
    addGoldRule(slide, 1, 1.1, 1.5);
    addText(slide, "Projected monthly revenue: Referral-only vs. With Stenth's system", 1, 1.25, 8, 0.4, { fontFace: 'Georgia', fontSize: 12, color: COLORS.ivory_dim, italic: true });

    let chartData = [
        {
            name: "Referral-Only (Current)",
            labels: ['Now', 'Month 2', 'Month 4', 'Month 6', 'Month 9', 'Month 12'],
            values: [80, 80, 80, 80, 80, 80]
        },
        {
            name: "With Stenth System",
            labels: ['Now', 'Month 2', 'Month 4', 'Month 6', 'Month 9', 'Month 12'],
            values: [80, 92, 108, 132, 165, 198]
        }
    ];
    let chartOpts = {
        x: 1.0, y: 1.7, w: 5.5, h: 3.5,
        chartArea: { fill: { color: COLORS.dark_navy } },
        chartColors: [COLORS.slate, COLORS.gold],
        legendPos: 'b',
        legendColor: COLORS.ivory_dim,
        lineSmooth: true,
        lineDataSymbol: 'none',
        lineSize: 3,
        valAxisLineColor: '444444',
        catAxisLineColor: '444444',
        valGridLine: { color: '222222' }
    };
    slide.addChart(pptx.ChartType.line, chartData, chartOpts);

    const callouts = [
        { num: "+$111K", desc: "additional monthly revenue by Month 12", goldBg: true },
        { num: "+148%", desc: "revenue growth over 12 months with system", goldBg: false },
        { num: "681%", desc: "avg ROI for construction cos. (SEO)", goldBg: false }
    ];
    callouts.forEach((c, i) => {
        let _y = 1.8 + (i * 1.1);
        let _bg = c.goldBg ? COLORS.gold : COLORS.panel;
        let _txtColor = c.goldBg ? COLORS.dark_navy : COLORS.gold;
        let _subColor = c.goldBg ? '503200' : COLORS.ivory_dim;
        let _line = c.goldBg ? undefined : { color: COLORS.gold, width: 1 };
        
        slide.addShape(pptx.ShapeType.rect, { x: 6.8, y: _y, w: 2.8, h: 1.0, fill: { color: _bg }, line: _line });
        addText(slide, c.num, 7.0, _y + 0.1, 2.4, 0.4, { fontFace: 'Georgia', fontSize: 24, color: _txtColor, bold: true });
        addText(slide, c.desc, 7.0, _y + 0.45, 2.4, 0.5, { fontFace: 'Calibri', fontSize: 10, color: _subColor });
    });
    slide.addNotes("On referrals alone: flat. With Stenth: $198K by Month 12. That's $111K additional per month. And it only grows from there.");

    // SLIDE 10
    slide = pptx.addSlide({ masterName: 'MASTER_DARK' });
    slide.addImage({ path: URLS.stenth_logo, x: 9.3, y: 0.2, w: 0.55, h: 0.2, sizing: { type: 'contain', w: 0.55, h: 0.2 } });
    addText(slide, "Who We Are", 1, 0.5, 8, 0.7, { fontFace: 'Georgia', fontSize: 36, color: COLORS.ivory, bold: true });
    addGoldRule(slide, 1, 1.3, 1.5);
    addText(slide, "Two founders. One focus — growth systems that drive real revenue.", 1, 1.4, 8, 0.4, { fontFace: 'Georgia', fontSize: 13, color: COLORS.ivory_dim, italic: true });

    // Aakash
    slide.addShape(pptx.ShapeType.rect, { x: 1, y: 2.0, w: 3.8, h: 3.3, fill: { color: COLORS.panel }, line: { color: COLORS.gold, width: 1 } });
    addText(slide, "👥", 1.2, 2.2, 0.5, 0.5, { fontFace: 'Calibri', fontSize: 20, color: COLORS.gold });
    addText(slide, "Aakash Lakhataria", 1.2, 2.7, 3.4, 0.4, { fontFace: 'Georgia', fontSize: 20, color: COLORS.ivory, bold: true });
    addText(slide, "Co-Founder & Growth Lead", 1.2, 3.1, 3.4, 0.3, { fontFace: 'Calibri', fontSize: 13, color: COLORS.gold });
    addText(slide, "Drives client strategy, marketing systems, and pre-client relationships. Leads growth initiatives for Stenth's clients across Canada and Australia.", 1.2, 3.4, 3.4, 0.8, { fontFace: 'Calibri', fontSize: 13, color: COLORS.ivory_dim });
    addText(slide, "Specialises in building scalable systems that turn unknown businesses into recognised brands.", 1.2, 4.3, 3.4, 0.8, { fontFace: 'Calibri', fontSize: 13, color: COLORS.ivory_dim });

    // Ansh
    slide.addShape(pptx.ShapeType.rect, { x: 5.2, y: 2.0, w: 3.8, h: 3.3, fill: { color: COLORS.panel }, line: { color: COLORS.gold, width: 1 } });
    addText(slide, "⚙️", 5.4, 2.2, 0.5, 0.5, { fontFace: 'Calibri', fontSize: 20, color: COLORS.gold });
    addText(slide, "Ansh", 5.4, 2.7, 3.4, 0.4, { fontFace: 'Georgia', fontSize: 20, color: COLORS.ivory, bold: true });
    addText(slide, "Co-Founder & Technical Lead", 5.4, 3.1, 3.4, 0.3, { fontFace: 'Calibri', fontSize: 13, color: COLORS.gold });
    addText(slide, "Oversees all technical delivery — from website builds to digital infrastructure and performance systems. Ensures every system we build actually converts.", 5.4, 3.4, 3.4, 0.8, { fontFace: 'Calibri', fontSize: 13, color: COLORS.ivory_dim });
    addText(slide, "Specialises in web development, conversion architecture, and analytics.", 5.4, 4.3, 3.4, 0.8, { fontFace: 'Calibri', fontSize: 13, color: COLORS.ivory_dim });
    slide.addNotes("Two founders, completely focused on growth systems. Aakash handles strategy and client relationships. Ansh handles the technical build and delivery.");

};
