# --- SLIDE 6 ---
slide = prs.slides.add_slide(blank_layout)
add_bg(slide)
add_gold_left_bar(slide)
add_text(slide, "GAP 02", Inches(1), Inches(0.5), Inches(2), Inches(0.3), "Calibri", Pt(10), C_GOLD, bold=True)
add_text(slide, "No Predictable Lead Pipeline", Inches(1), Inches(0.8), Inches(8), Inches(0.8), "Georgia", Pt(36), C_IVORY, bold=True)
add_text(slide, "Referrals are great. But they're not scalable, predictable, or targetable.", Inches(1), Inches(1.5), Inches(8), Inches(0.5), "Georgia", Pt(13), C_IVORY_DIM, italic=True)

# Left Box TODAY
add_rect(slide, Inches(1), Inches(2), Inches(3.8), Inches(3), C_PANEL)
add_rect(slide, Inches(1), Inches(2), Inches(0.05), Inches(3), C_STENTH)
add_text(slide, "TODAY", Inches(1.2), Inches(2.2), Inches(3.5), Inches(0.3), "Calibri", Pt(9), C_STENTH, bold=True)
list_today = "\n".join(["✗ Growth relies entirely on referrals", "✗ No consistent way to attract new clients", "✗ High-value clients are unreachable online", "✗ Revenue is unpredictable month to month", "✗ Growth plateaus — limited by word of mouth"])
add_text(slide, list_today, Inches(1.2), Inches(2.6), Inches(3.5), Inches(2.2), "Calibri", Pt(12), C_IVORY)

# Right Box WITH A SYSTEM
add_rect(slide, Inches(5), Inches(2), Inches(3.8), Inches(3), C_PANEL)
add_rect(slide, Inches(5), Inches(2), Inches(0.05), Inches(3), C_GOLD)
add_text(slide, "WITH A SYSTEM", Inches(5.2), Inches(2.2), Inches(3.5), Inches(0.3), "Calibri", Pt(9), C_GOLD, bold=True)
list_sys = "\n".join(["✓ Predictable flow of qualified leads monthly", "✓ Targeting builders, developers & commercial clients", "✓ Online presence works 24/7 even when you're not", "✓ Revenue compounds — not dependent on luck", "✓ Scalable growth with a system behind it"])
add_text(slide, list_sys, Inches(5.2), Inches(2.6), Inches(3.5), Inches(2.2), "Calibri", Pt(12), C_IVORY)
add_notes(slide, "The growth right now depends on referrals — not predictable or scalable. A system changes that.")

# --- SLIDE 7 ---
slide = prs.slides.add_slide(blank_layout)
add_bg(slide)
add_gold_left_bar(slide)
add_text(slide, "So what's the real issue?", Inches(1), Inches(1.5), Inches(8), Inches(0.5), "Georgia", Pt(15), C_IVORY_DIM, italic=True)
add_text(slide, "Not a demand problem.\nA system problem.", Inches(1), Inches(2.0), Inches(8), Inches(1.5), "Georgia", Pt(52), C_IVORY, bold=True)
add_gold_rule(slide, Inches(1), Inches(3.7), Inches(1.5))
add_text(slide, "People are searching. The demand is real. The system to capture it just doesn't exist yet.", Inches(1), Inches(4.2), Inches(8), Inches(0.5), "Calibri", Pt(16), C_GOLD)
add_notes(slide, "This isn't a demand problem — it's simply that there's no system in place to capture that demand.")

# --- SLIDE 8 ---
slide = prs.slides.add_slide(blank_layout)
add_bg(slide)
add_gold_left_bar(slide)
add_text(slide, "The Opportunity — In Plain Numbers", Inches(1), Inches(0.5), Inches(8), Inches(0.8), "Georgia", Pt(32), C_IVORY, bold=True)
add_gold_rule(slide, Inches(1), Inches(1.2))
add_text(slide, "What even a conservative improvement in lead flow looks like for MMG", Inches(1), Inches(1.4), Inches(8), Inches(0.5), "Georgia", Pt(13), C_IVORY_DIM, italic=True)

stats3 = [
    ("+2–3", "extra projects per month (conservative)"),
    ("+$50K", "additional monthly revenue (avg project $25K)"),
    ("+$600K", "additional revenue in year one alone")
]
for i, (num, desc) in enumerate(stats3):
    x = Inches(1) + (i * Inches(2.7))
    add_rect(slide, x, Inches(2), Inches(2.5), Inches(1.5), C_PANEL, C_GOLD)
    add_text(slide, num, x+Inches(0.1), Inches(2.2), Inches(2.3), Inches(0.6), "Georgia", Pt(52), C_GOLD, bold=True, align=PP_ALIGN.CENTER)
    add_text(slide, desc, x+Inches(0.1), Inches(2.9), Inches(2.3), Inches(0.5), "Calibri", Pt(14), C_IVORY_DIM, align=PP_ALIGN.CENTER)

add_text(slide, "If we bring you even 2–3 additional qualified projects per month, at an average value of $25,000, that's an extra $50,000/month — or over $600,000 in additional revenue in year one.", Inches(1), Inches(3.8), Inches(8), Inches(0.8), "Calibri", Pt(14), C_IVORY)
add_text(slide, "And that's the conservative estimate.", Inches(1), Inches(4.6), Inches(8), Inches(0.5), "Georgia", Pt(15), C_GOLD, italic=True)
add_notes(slide, "Conservative: 2–3 extra projects at $25K = $50K/month = $600K+ in year one. Strong scenario: nearly $2M additional annually.")

# --- SLIDE 9 ---
slide = prs.slides.add_slide(blank_layout)
add_bg(slide)
add_gold_left_bar(slide)
add_text(slide, "What the Growth Curve Looks Like", Inches(1), Inches(0.5), Inches(8), Inches(0.6), "Georgia", Pt(28), C_IVORY, bold=True)
add_gold_rule(slide, Inches(1), Inches(1.1))
add_text(slide, "Projected monthly revenue: Referral-only vs. With Stenth's system", Inches(1), Inches(1.3), Inches(8), Inches(0.4), "Georgia", Pt(12), C_IVORY_DIM, italic=True)

# Add Chart
chart_data = ChartData()
chart_data.categories = ['Now', 'Month 2', 'Month 4', 'Month 6', 'Month 9', 'Month 12']
chart_data.add_series('Referral-Only', (80, 80, 80, 80, 80, 80))
chart_data.add_series('With Stenth System', (80, 92, 108, 132, 165, 198))

add_rect(slide, Inches(1), Inches(1.8), Inches(5.5), Inches(3.5), C_DARK_NAVY)
chart = slide.shapes.add_chart(
    XL_CHART_TYPE.LINE, Inches(1.1), Inches(1.9), Inches(5.3), Inches(3.3), chart_data
).chart
chart.has_legend = True
chart.legend.position = XL_LEGEND_POSITION.BOTTOM
chart.legend.font.color.rgb = C_IVORY_DIM

series1 = chart.series[0]
series1.format.line.color.rgb = C_SLATE
series2 = chart.series[1]
series2.format.line.color.rgb = C_GOLD

# Right side callouts
y_vals = [Inches(1.8), Inches(3), Inches(4.2)]
texts_c = [
    ("+$111K", "additional monthly revenue by Month 12", True),
    ("+148%", "revenue growth over 12 months with system", False),
    ("681%", "avg ROI for construction cos. (SEO)", False)
]
for i, (num, desc, is_gold) in enumerate(texts_c):
    bg_color = C_GOLD if is_gold else C_PANEL
    txt_color = C_DARK_NAVY if is_gold else C_GOLD
    sub_color = RGBColor(80, 50, 0) if is_gold else C_IVORY_DIM # dark brown approx for gold bg
    add_rect(slide, Inches(6.8), y_vals[i], Inches(2.8), Inches(1), bg_color, C_GOLD if not is_gold else None)
    add_text(slide, num, Inches(7), y_vals[i]+Inches(0.1), Inches(2.4), Inches(0.4), "Georgia", Pt(24), txt_color, bold=True)
    add_text(slide, desc, Inches(7), y_vals[i]+Inches(0.5), Inches(2.4), Inches(0.4), "Calibri", Pt(10), sub_color)
add_notes(slide, "On referrals alone: flat. With Stenth: $198K by Month 12. That's $111K additional per month. And it only grows from there.")

# --- SLIDE 10 ---
slide = prs.slides.add_slide(blank_layout)
add_bg(slide)
add_gold_left_bar(slide)
if f_stenth_logo:
    slide.shapes.add_picture(f_stenth_logo, Inches(9.3), Inches(0.2), width=Inches(0.55))
add_text(slide, "Who We Are", Inches(1), Inches(0.5), Inches(8), Inches(0.8), "Georgia", Pt(36), C_IVORY, bold=True)
add_gold_rule(slide, Inches(1), Inches(1.2))
add_text(slide, "Two founders. One focus — growth systems that drive real revenue.", Inches(1), Inches(1.4), Inches(8), Inches(0.5), "Georgia", Pt(13), C_IVORY_DIM, italic=True)

# Aakash box
add_rect(slide, Inches(1), Inches(2), Inches(3.8), Inches(3.2), C_PANEL, border_color=C_GOLD)
add_text(slide, "👥", Inches(1.2), Inches(2.2), Inches(0.5), Inches(0.5), "Calibri", Pt(20), C_GOLD)
add_text(slide, "Aakash Lakhataria", Inches(1.2), Inches(2.8), Inches(3.4), Inches(0.4), "Georgia", Pt(20), C_IVORY, bold=True)
add_text(slide, "Co-Founder & Growth Lead", Inches(1.2), Inches(3.2), Inches(3.4), Inches(0.3), "Calibri", Pt(13), C_GOLD)
add_text(slide, "Drives client strategy, marketing systems, and pre-client relationships. Leads growth initiatives for Stenth's clients across Canada and Australia.", Inches(1.2), Inches(3.6), Inches(3.4), Inches(0.8), "Calibri", Pt(13), C_IVORY_DIM)
add_text(slide, "Specialises in building scalable systems that turn unknown businesses into recognised brands.", Inches(1.2), Inches(4.4), Inches(3.4), Inches(0.6), "Calibri", Pt(13), C_IVORY_DIM)

# Ansh box
add_rect(slide, Inches(5.2), Inches(2), Inches(3.8), Inches(3.2), C_PANEL, border_color=C_GOLD)
add_text(slide, "⚙️", Inches(5.4), Inches(2.2), Inches(0.5), Inches(0.5), "Calibri", Pt(20), C_GOLD)
add_text(slide, "Ansh", Inches(5.4), Inches(2.8), Inches(3.4), Inches(0.4), "Georgia", Pt(20), C_IVORY, bold=True)
add_text(slide, "Co-Founder & Technical Lead", Inches(5.4), Inches(3.2), Inches(3.4), Inches(0.3), "Calibri", Pt(13), C_GOLD)
add_text(slide, "Oversees all technical delivery — from website builds to digital infrastructure and performance systems. Ensures every system we build actually converts.", Inches(5.4), Inches(3.6), Inches(3.4), Inches(0.8), "Calibri", Pt(13), C_IVORY_DIM)
add_text(slide, "Specialises in web development, conversion architecture, and analytics.", Inches(5.4), Inches(4.4), Inches(3.4), Inches(0.6), "Calibri", Pt(13), C_IVORY_DIM)
add_notes(slide, "Two founders, completely focused on growth systems. Aakash handles strategy and client relationships. Ansh handles the technical build and delivery.")

# --- SLIDE 11 ---
slide = prs.slides.add_slide(blank_layout)
add_bg(slide)
add_gold_left_bar(slide)
add_text(slide, "INTRODUCING", Inches(1), Inches(1), Inches(3), Inches(0.3), "Calibri", Pt(11), C_GOLD, bold=True)
if f_stenth_logo:
    slide.shapes.add_picture(f_stenth_logo, Inches(1), Inches(1.4), width=Inches(1.5))
add_text(slide, "STENTH", Inches(2.7), Inches(1.4), Inches(4), Inches(1), "Georgia", Pt(52), C_IVORY, bold=True)
add_text(slide, "stenth.com", Inches(1), Inches(2.5), Inches(4), Inches(0.4), "Calibri", Pt(14), C_IVORY_DIM)
add_gold_rule(slide, Inches(1), Inches(3), Inches(1.5))
add_text(slide, "Strategy.  Marketing.  Growth.", Inches(1), Inches(3.4), Inches(8), Inches(0.5), "Calibri", Pt(18), C_IVORY, bold=True)
add_text(slide, "We don't just build websites.\We build systems that consistently bring in qualified leads.", Inches(1), Inches(4), Inches(8), Inches(1), "Georgia", Pt(22), C_GOLD, bold=True)
add_notes(slide, "At Stenth, we don't just build websites or run ads — we build complete growth systems that bring in qualified leads consistently.")

# --- SLIDE 12 ---
slide = prs.slides.add_slide(blank_layout)
add_bg(slide)
add_rect(slide, 0, 0, Inches(10), Inches(0.1), C_GOLD)
add_rect(slide, 0, Inches(5.525), Inches(10), Inches(0.1), C_GOLD)
add_text(slide, "MMG'S STORY — TOLD ONLINE", Inches(1), Inches(0.3), Inches(8), Inches(0.4), "Calibri", Pt(12), C_GOLD, bold=True, align=PP_ALIGN.CENTER)

# Video frame
add_rect(slide, Inches(1.5), Inches(1), Inches(7), Inches(3.4), RGBColor(0x08, 0x09, 0x0c), border_color=C_GOLD, border_width=Pt(1.5))
add_text(slide, "▶", Inches(4.5), Inches(2.2), Inches(1), Inches(0.5), "Calibri", Pt(24), C_GOLD, align=PP_ALIGN.CENTER)
add_text(slide, "[VIDEO PLAYS HERE]", Inches(3), Inches(2.8), Inches(4), Inches(0.4), "Calibri", Pt(14), C_IVORY_DIM, italic=True, align=PP_ALIGN.CENTER)

if f_mmg_logo:
    slide.shapes.add_picture(f_mmg_logo, Inches(4), Inches(4.5), width=Inches(2))
add_text(slide, "This is how we want to portray Modern Masonry Group online — telling its story visually, with precision and prestige.", Inches(1), Inches(5), Inches(8), Inches(0.5), "Georgia", Pt(13), C_IVORY_DIM, italic=True, align=PP_ALIGN.CENTER)
add_notes(slide, "AAKASH: Play the video/brand demo here. This is exactly how we want to present MMG's story online — its craftsmanship, its legacy since 1994 — told visually.")

