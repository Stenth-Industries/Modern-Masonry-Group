# --- SLIDE 13 ---
slide = prs.slides.add_slide(blank_layout)
add_bg(slide)
add_gold_left_bar(slide)
# Badge
add_rect(slide, Inches(1), Inches(0.5), Inches(0.8), Inches(0.8), None, border_color=C_GOLD, border_width=Pt(2))
add_text(slide, "01", Inches(1), Inches(0.65), Inches(0.8), Inches(0.5), "Georgia", Pt(22), C_GOLD, bold=True, align=PP_ALIGN.CENTER)
add_text(slide, "Foundation", Inches(2), Inches(0.55), Inches(7), Inches(0.8), "Georgia", Pt(36), C_IVORY, bold=True)
add_text(slide, "First, we fix what's underneath everything else.", Inches(1), Inches(1.5), Inches(8), Inches(0.5), "Georgia", Pt(13), C_IVORY_DIM, italic=True)

rows_13 = [
    ("🌐 High-converting website", "Not just beautiful — built to turn visitors into enquiries. Clear structure, fast load, mobile-first design.", Inches(2.2)),
    ("🎯 Clear brand messaging", "Every visitor should immediately know who MMG is, what you offer, and why they should call — within 5 seconds.", Inches(3.2)),
    ("🏢 Strong portfolio showcase", "Your past work is your best sales tool. Presented to build instant trust with high-value clients.", Inches(4.2))
]
for title, desc, y in rows_13:
    add_rect(slide, Inches(1), y, Inches(8), Inches(0.8), C_PANEL, border_color=C_GOLD_DARK)
    add_rect(slide, Inches(1), y, Inches(0.05), Inches(0.8), C_GOLD)
    add_text(slide, title, Inches(1.2), y+Inches(0.1), Inches(7.5), Inches(0.3), "Calibri", Pt(13), C_GOLD, bold=True)
    add_text(slide, desc, Inches(1.2), y+Inches(0.35), Inches(7.6), Inches(0.4), "Calibri", Pt(12), C_IVORY_DIM)
add_notes(slide, "Step 1: Fix the foundation. A website that converts, clear messaging, strong portfolio. Everything built to work.")

# --- SLIDE 14 ---
slide = prs.slides.add_slide(blank_layout)
add_bg(slide)
add_gold_left_bar(slide)
add_rect(slide, Inches(1), Inches(0.5), Inches(0.8), Inches(0.8), None, border_color=C_GOLD, border_width=Pt(2))
add_text(slide, "02", Inches(1), Inches(0.65), Inches(0.8), Inches(0.5), "Georgia", Pt(22), C_GOLD, bold=True, align=PP_ALIGN.CENTER)
add_text(slide, "Traffic", Inches(2), Inches(0.55), Inches(7), Inches(0.8), "Georgia", Pt(36), C_IVORY, bold=True)
add_text(slide, "Bring the right people to the right place — consistently.", Inches(1), Inches(1.5), Inches(8), Inches(0.5), "Georgia", Pt(13), C_IVORY_DIM, italic=True)

rows_14 = [
    ("🔍 Google SEO", "Dominate local search. When someone searches masonry in Ontario, MMG appears first.", Inches(2.2)),
    ("📣 Google Ads", "Instant visibility for high-intent searches. Target people ready to hire — not just browse.", Inches(3.2)),
    ("🌐 Local visibility", "Google Business optimisation, local citations, map rankings — own your local market completely.", Inches(4.2))
]
for title, desc, y in rows_14:
    add_rect(slide, Inches(1), y, Inches(8), Inches(0.8), C_PANEL, border_color=C_GOLD_DARK)
    add_rect(slide, Inches(1), y, Inches(0.05), Inches(0.8), C_GOLD)
    add_text(slide, title, Inches(1.2), y+Inches(0.1), Inches(7.5), Inches(0.3), "Calibri", Pt(13), C_GOLD, bold=True)
    add_text(slide, desc, Inches(1.2), y+Inches(0.35), Inches(7.6), Inches(0.4), "Calibri", Pt(12), C_IVORY_DIM)
add_notes(slide, "Step 2: Drive traffic. SEO builds long-term visibility. Ads bring instant leads. Local visibility makes MMG the obvious choice.")

# --- SLIDE 15 ---
slide = prs.slides.add_slide(blank_layout)
add_bg(slide)
add_gold_left_bar(slide)
add_rect(slide, Inches(1), Inches(0.5), Inches(0.8), Inches(0.8), None, border_color=C_GOLD, border_width=Pt(2))
add_text(slide, "03", Inches(1), Inches(0.65), Inches(0.8), Inches(0.5), "Georgia", Pt(22), C_GOLD, bold=True, align=PP_ALIGN.CENTER)
add_text(slide, "Conversion", Inches(2), Inches(0.55), Inches(7), Inches(0.8), "Georgia", Pt(36), C_IVORY, bold=True)
add_text(slide, "Traffic means nothing if visitors don't become clients.", Inches(1), Inches(1.5), Inches(8), Inches(0.5), "Georgia", Pt(13), C_IVORY_DIM, italic=True)

rows_15 = [
    ("💰 Lead funnels", "Guided paths that take a visitor from \"interested\" to \"I want a quote\" — without friction.", Inches(2.2)),
    ("🎯 Quote forms", "Smart, fast enquiry forms designed to capture quality leads with the right information upfront.", Inches(3.2)),
    ("📊 Follow-up systems", "Automated follow-ups so no lead falls through the cracks. Every enquiry gets a timely response.", Inches(4.2))
]
for title, desc, y in rows_15:
    add_rect(slide, Inches(1), y, Inches(8), Inches(0.8), C_PANEL, border_color=C_GOLD_DARK)
    add_rect(slide, Inches(1), y, Inches(0.05), Inches(0.8), C_GOLD)
    add_text(slide, title, Inches(1.2), y+Inches(0.1), Inches(7.5), Inches(0.3), "Calibri", Pt(13), C_GOLD, bold=True)
    add_text(slide, desc, Inches(1.2), y+Inches(0.35), Inches(7.6), Inches(0.4), "Calibri", Pt(12), C_IVORY_DIM)
add_notes(slide, "Step 3: Convert. Lead funnels, quote forms, follow-up systems — so every interested visitor becomes a real enquiry.")

# --- SLIDE 16 ---
slide = prs.slides.add_slide(blank_layout)
add_bg(slide)
add_gold_left_bar(slide)
add_text(slide, "Your Dedicated \nIn-House Marketing Team", Inches(1), Inches(0.5), Inches(8), Inches(1.2), "Georgia", Pt(44), C_IVORY, bold=True)
add_gold_rule(slide, Inches(1), Inches(1.9), Inches(1.4))
add_text(slide, "Every serious, growing company has a dedicated marketing team.", Inches(1), Inches(2.1), Inches(8), Inches(0.4), "Calibri", Pt(15), C_IVORY_DIM)

# Left Box
add_rect(slide, Inches(1), Inches(3), Inches(3.8), Inches(2), C_PANEL)
add_rect(slide, Inches(1), Inches(3), Inches(0.05), Inches(2), C_STENTH)
add_text(slide, "THE TRADITIONAL WAY", Inches(1.2), Inches(3.2), Inches(3.5), Inches(0.3), "Calibri", Pt(10), C_STENTH, bold=True)
add_text(slide, "Hire internal staff.\nHigh cost. Slow to hire. Hard to manage.", Inches(1.2), Inches(3.6), Inches(3.5), Inches(1.2), "Calibri", Pt(14), C_IVORY)

# Right Box
add_rect(slide, Inches(5.2), Inches(3), Inches(3.8), Inches(2), C_PANEL)
add_rect(slide, Inches(5.2), Inches(3), Inches(0.05), Inches(2), C_GOLD)
add_text(slide, "THE STENTH WAY", Inches(5.4), Inches(3.2), Inches(3.5), Inches(0.3), "Calibri", Pt(10), C_GOLD, bold=True)
add_text(slide, "We become that team.\nIntegrated. Accountable. Focused on growth.", Inches(5.4), Inches(3.6), Inches(3.5), Inches(1.2), "Calibri", Pt(14), C_IVORY, bold=True)
add_notes(slide, "Instead of hiring and managing internally, we become that team. We coordinate with your people, learn your business, and operate as a genuine extension of MMG.")

# --- SLIDE 17 ---
slide = prs.slides.add_slide(blank_layout)
add_bg(slide)
add_gold_left_bar(slide)
add_text(slide, "Not an Expense. An Investment.", Inches(1), Inches(0.5), Inches(8), Inches(0.8), "Georgia", Pt(32), C_IVORY, bold=True)

add_rect(slide, Inches(1), Inches(1.5), Inches(8), Inches(1.5), C_PANEL)
add_rect(slide, Inches(1), Inches(1.5), Inches(0.05), Inches(1.5), C_GOLD)
add_text(slide, "\"Just like this office and showroom — the investment you made to build it — you did that because it creates an impression, builds trust, and brings in more business. Your online presence should do exactly the same thing. But at scale.\"", Inches(1.2), Inches(1.7), Inches(7.6), Inches(1.1), "Georgia", Pt(15), C_IVORY, italic=True)

rows_17 = [
    ("A great office & showroom", "Builds trust in person", Inches(3.5)),
    ("A great online presence", "Builds trust at scale — 24/7", Inches(4.0)),
    ("Stenth as your partner", "Turns that presence into revenue", Inches(4.5))
]
for left_t, right_t, y in rows_17:
    add_text(slide, left_t, Inches(1), y, Inches(3.5), Inches(0.4), "Calibri", Pt(13), C_IVORY, bold=True)
    add_text(slide, "→", Inches(4.5), y, Inches(0.4), Inches(0.4), "Calibri", Pt(13), C_GOLD)
    add_text(slide, right_t, Inches(5), y, Inches(4), Inches(0.4), "Calibri", Pt(13), C_GOLD)
add_notes(slide, "This isn't a cost. Just like this office builds trust and brings in clients — your online presence should do the same. At scale.")

# --- SLIDE 18 ---
slide = prs.slides.add_slide(blank_layout)
add_bg(slide)
add_rect(slide, 0, 0, Inches(10), Inches(0.1), C_GOLD)
add_rect(slide, 0, Inches(5.525), Inches(10), Inches(0.1), C_GOLD)
add_text(slide, "Now...", Inches(1), Inches(1), Inches(3), Inches(0.5), "Georgia", Pt(22), C_IVORY_DIM, italic=True)
add_text(slide, "Ready for the\nexciting part?", Inches(1), Inches(1.8), Inches(8), Inches(1.5), "Georgia", Pt(54), C_IVORY, bold=True)
add_gold_rule(slide, Inches(1), Inches(3.7), Inches(2))
add_text(slide, "Because everything we've talked about... it already exists.", Inches(1), Inches(4), Inches(8), Inches(0.5), "Calibri", Pt(16), C_GOLD)
if f_mmg_logo:
    # Adding as ghosted logo
    shape = slide.shapes.add_picture(f_mmg_logo, Inches(7), Inches(0.5), width=Inches(3))
    # Note: python-pptx doesn't natively support picture transparency directly, will let it be normally added for now as watermark
    # The requirement is "barely visible", but pptx xml mangling is complex.
add_notes(slide, "AAKASH: Pause here. Build anticipation. Everything we've talked about — it's not a concept. It already exists. Let me show you.")

# --- SLIDE 19 ---
slide = prs.slides.add_slide(blank_layout)
add_bg(slide)
add_rect(slide, 0, 0, Inches(10), Inches(0.1), C_GOLD)
add_rect(slide, 0, Inches(5.525), Inches(10), Inches(0.1), C_GOLD)

if f_mmg_logo:
    slide.shapes.add_picture(f_mmg_logo, Inches(3.5), Inches(0.8), width=Inches(3))
add_text(slide, "THE NEW", Inches(1), Inches(2.6), Inches(8), Inches(0.4), "Calibri", Pt(16), C_GOLD, bold=True, align=PP_ALIGN.CENTER)
add_text(slide, "Modern Masonry Group", Inches(1), Inches(3.0), Inches(8), Inches(0.8), "Georgia", Pt(42), C_IVORY, bold=True, align=PP_ALIGN.CENTER)

add_rect(slide, Inches(2.5), Inches(4.0), Inches(5), Inches(0.6), C_PANEL, border_color=C_GOLD, border_width=Pt(1))
add_text(slide, "modern-masonry-group.vercel.app", Inches(2.5), Inches(4.15), Inches(5), Inches(0.4), "Calibri", Pt(14), C_GOLD, align=PP_ALIGN.CENTER)
add_notes(slide, "AAKASH: Open the browser. Navigate to modern-masonry-group.vercel.app — walk them through it. Let the work speak.")

# --- SLIDE 20 ---
slide = prs.slides.add_slide(blank_layout)
add_bg(slide)
add_gold_left_bar(slide)
add_text(slide, "If this makes sense...", Inches(1), Inches(1), Inches(8), Inches(0.4), "Georgia", Pt(18), C_IVORY_DIM, italic=True)
add_text(slide, "Let's map out what\nthis looks like for MMG.", Inches(1), Inches(1.5), Inches(8), Inches(1.2), "Georgia", Pt(40), C_IVORY, bold=True)
add_gold_rule(slide, Inches(1), Inches(2.9), Inches(1.8))

add_rect(slide, Inches(1), Inches(3.5), Inches(8), Inches(1.5), C_PANEL)
add_rect(slide, Inches(1), Inches(3.5), Inches(0.05), Inches(1.5), C_GOLD)
add_text(slide, "The next step is simple: we sit down together and map out a strategy specifically tailored to Modern Masonry Group — the right system, the right timeline, and what results look like in month 1, 3, and 6.", Inches(1.2), Inches(3.8), Inches(7.6), Inches(1), "Calibri", Pt(14), C_IVORY)

if f_stenth_logo:
    slide.shapes.add_picture(f_stenth_logo, Inches(9.3), Inches(5), width=Inches(0.55))
add_rect(slide, 0, Inches(5.525), Inches(10), Inches(0.1), C_GOLD)
add_notes(slide, "If this makes sense, the next step is simple: sit down together and map out a strategy tailored entirely to MMG — the right system, the right timeline, what results look like in month 1, 3, and 6.")


# Save
prs.save('MMG_Stenth_Pitch.pptx')
print("Presentation saved as MMG_Stenth_Pitch.pptx")
