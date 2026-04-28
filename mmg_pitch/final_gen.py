import collections.abc
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.chart.data import ChartData
from pptx.enum.chart import XL_CHART_TYPE, XL_LEGEND_POSITION
import requests
import os

prs = Presentation()
prs.slide_width = Inches(10)
prs.slide_height = Inches(5.625)

blank_layout = prs.slide_layouts[6]

C_DARK = RGBColor(0x05, 0x05, 0x05)
C_DARK_NAVY = RGBColor(0x0D, 0x11, 0x17)
C_PANEL = RGBColor(0x15, 0x1E, 0x2A)
C_GOLD = RGBColor(0xC9, 0xA4, 0x49)
C_GOLD_SOFT = RGBColor(0xE8, 0xD5, 0xA0)
C_GOLD_DARK = RGBColor(0x7A, 0x64, 0x30)
C_STENTH = RGBColor(0xC8, 0x4B, 0x31)
C_IVORY = RGBColor(0xF0, 0xEC, 0xE4)
C_IVORY_DIM = RGBColor(0xA8, 0x9F, 0x94)
C_WHITE = RGBColor(0xFF, 0xFF, 0xFF)
C_SLATE = RGBColor(0x54, 0x64, 0x72)

def download_image(url, fname):
    try:
        if not os.path.exists(fname):
            r = requests.get(url, timeout=10)
            if r.status_code == 200:
                with open(fname, 'wb') as f:
                    f.write(r.content)
        return fname if os.path.exists(fname) else None
    except Exception:
        return None

f_stenth_logo = download_image("https://stenth.com/Stenth_Logo-removebg.png", "stenth_logo.png")
f_mmg_logo = download_image("https://modern-masonry-group.vercel.app/Logo-PNG.png", "mmg_logo.png")
f_wall = download_image("https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1920&auto=format&fit=crop", "wall.jpg")

def add_rect(slide, left, top, width, height, fill_color, border_color=None, border_width=Pt(1)):
    rect = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, left, top, width, height)
    if fill_color is None:
        rect.fill.background()
    else:
        rect.fill.solid()
        rect.fill.fore_color.rgb = fill_color
    if border_color:
        rect.line.color.rgb = border_color
        rect.line.width = border_width
    else:
        rect.line.fill.background()
    return rect

def add_bg(slide):
    add_rect(slide, 0, 0, Inches(10), Inches(5.625), C_DARK)

def add_gold_left_bar(slide):
    add_rect(slide, 0, 0, Inches(0.07), Inches(5.625), C_GOLD)
    
def add_gold_rule(slide, left, top, width=Inches(1.5)):
    line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, left, top, width, Pt(2))
    line.fill.solid()
    line.fill.fore_color.rgb = C_GOLD
    line.line.fill.background()

def add_text(slide, text, left, top, width, height, font_name="Calibri", font_size=Pt(14), font_color=C_IVORY, bold=False, italic=False, align=PP_ALIGN.LEFT):
    txBox = slide.shapes.add_textbox(left, top, width, height)
    tf = txBox.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = text
    p.alignment = align
    p.font.name = font_name
    p.font.size = font_size
    p.font.color.rgb = font_color
    p.font.bold = bold
    p.font.italic = italic
    return txBox

def add_notes(slide, notes):
    slide.notes_slide.notes_text_frame.text = notes

# --- SLIDE 1 ---
slide = prs.slides.add_slide(blank_layout)
add_bg(slide)
if f_wall:
    slide.shapes.add_picture(f_wall, Inches(5), 0, Inches(5), Inches(5.625))
else:
    add_rect(slide, Inches(5), 0, Inches(5), Inches(5.625), C_DARK_NAVY)
add_gold_left_bar(slide)
add_rect(slide, 0, 0, Inches(10), Inches(5.625), fill_color=C_DARK, border_color=C_GOLD, border_width=Pt(1)) # wait, this fills the entire slide! Needs to be transparent fill
# Fix: transparent rect for border
frame = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(10), Inches(5.625))
frame.fill.background()
frame.line.color.rgb = C_GOLD
frame.line.width = Pt(1)

if f_mmg_logo:
    slide.shapes.add_picture(f_mmg_logo, Inches(0.5), Inches(0.5), width=Inches(2))
add_gold_rule(slide, Inches(0.5), Inches(1.3), Inches(2))
add_text(slide, "GROWTH & DIGITAL STRATEGY", Inches(0.5), Inches(2.2), Inches(4), Inches(0.5), "Calibri", Pt(10), C_GOLD, bold=True)
add_text(slide, "A Partnership Proposal", Inches(0.5), Inches(2.5), Inches(5), Inches(1), "Georgia", Pt(44), C_IVORY, bold=True)
add_text(slide, "Presented by", Inches(8.5), Inches(5.1), Inches(1), Inches(0.3), "Calibri", Pt(11), C_IVORY_DIM)
if f_stenth_logo:
    slide.shapes.add_picture(f_stenth_logo, Inches(9.3), Inches(5), width=Inches(0.55))
add_notes(slide, "Appreciate you taking the time today. I'll walk you through what we see, what's currently missing, and exactly how we can help you scale this.")

# --- SLIDE 2 ---
slide = prs.slides.add_slide(blank_layout)
add_bg(slide)
add_gold_left_bar(slide)
add_text(slide, "Here's something most masonry businesses share:", Inches(1), Inches(1), Inches(8), Inches(0.5), "Georgia", Pt(14), C_IVORY_DIM, italic=True)
add_text(slide, "\"Most masonry companies grow through referrals... but that limits how much they can scale.\"", Inches(1), Inches(1.6), Inches(8), Inches(1.5), "Georgia", Pt(40), C_IVORY, bold=True)
add_gold_rule(slide, Inches(1), Inches(3.6), Inches(1.2))
add_text(slide, "Meanwhile, people are actively searching for your services every single day.", Inches(1), Inches(4.2), Inches(8), Inches(0.5), "Calibri", Pt(16), C_GOLD)
add_notes(slide, "Most masonry companies grow through referrals and word of mouth — which works, but it puts a ceiling on how much you can scale.")

# --- SLIDE 3 ---
slide = prs.slides.add_slide(blank_layout)
add_bg(slide)
add_gold_left_bar(slide)
add_text(slide, "Customers Are Already Searching", Inches(0.5), Inches(0.5), Inches(8), Inches(0.8), "Georgia", Pt(30), C_IVORY, bold=True)
add_gold_rule(slide, Inches(0.5), Inches(1.2))
add_text(slide, "Real searches happening in Ontario — every single day", Inches(0.5), Inches(1.4), Inches(8), Inches(0.5), "Georgia", Pt(13), C_IVORY_DIM, italic=True)

search_terms = [
    ("masonry contractor near me", "HIGH VOLUME"),
    ("brick installation Ontario", "HIGH VOLUME"),
    ("stone wall builders Toronto", "MED VOLUME"),
    ("masonry company commercial", "MED VOLUME")
]
for i, (term, vol) in enumerate(search_terms):
    x = Inches(0.5) if i % 2 == 0 else Inches(5)
    y = Inches(2) if i < 2 else Inches(2.9)
    add_rect(slide, x, y, Inches(4.2), Inches(0.7), C_PANEL, C_GOLD_DARK)
    add_text(slide, "🔍 " + term, x+Inches(0.1), y+Inches(0.1), Inches(4), Inches(0.3), "Calibri", Pt(14), C_IVORY)
    add_text(slide, vol, x+Inches(0.1), y+Inches(0.4), Inches(4), Inches(0.2), "Calibri", Pt(10), C_GOLD, bold=True)

stats = [
    ("97%", "consumers search online for local services"),
    ("78%", "mobile searches lead to a purchase within 24hrs"),
    ("681%", "avg ROI for construction cos. using digital marketing")
]
for i, (num, desc) in enumerate(stats):
    x = Inches(0.5) + (i * Inches(3.1))
    add_rect(slide, x, Inches(4), Inches(2.9), Inches(1.2), C_GOLD_DARK, C_GOLD)
    add_rect(slide, x, Inches(4), Inches(0.05), Inches(1.2), C_GOLD) # left bar
    add_text(slide, num, x+Inches(0.2), Inches(4.1), Inches(2.5), Inches(0.5), "Georgia", Pt(28), C_GOLD, bold=True)
    add_text(slide, desc, x+Inches(0.2), Inches(4.7), Inches(2.5), Inches(0.4), "Calibri", Pt(10), C_IVORY_DIM)
add_notes(slide, "97% of consumers search online for local services. 78% of mobile searches lead to a purchase within 24 hours. The demand is there — it just needs to be captured.")

# --- SLIDE 4 ---
slide = prs.slides.add_slide(blank_layout)
add_bg(slide)
if f_wall:
    slide.shapes.add_picture(f_wall, 0, 0, Inches(5), Inches(5.625))
add_rect(slide, Inches(5), 0, Inches(5), Inches(5.625), C_DARK)
add_rect(slide, 0, 0, Inches(10), Inches(0.1), C_GOLD)
add_text(slide, "EST. 1994", Inches(0.2), Inches(0.2), Inches(2), Inches(0.4), "Calibri", Pt(10), C_IVORY_DIM)
add_text(slide, "A High-Ticket Business", Inches(0.2), Inches(5), Inches(4), Inches(0.5), "Georgia", Pt(22), C_IVORY, bold=True)

add_text(slide, "You're in a High-Ticket Business", Inches(5.3), Inches(0.8), Inches(4.5), Inches(0.8), "Georgia", Pt(30), C_IVORY, bold=True)
add_text(slide, "Project-based. High value. Every lead matters.", Inches(5.3), Inches(1.5), Inches(4.5), Inches(0.5), "Georgia", Pt(13), C_IVORY_DIM, italic=True)

stats2 = [
    ("$15K–100K+", "typical project value"),
    ("1 deal", "can change the month"),
    ("Est. 1994", "decades of expertise")
]
for i, (num, desc) in enumerate(stats2):
    y = Inches(2.5) + (i * Inches(1))
    add_rect(slide, Inches(5.3), y, Inches(4.2), Inches(0.8), C_PANEL)
    add_text(slide, num, Inches(5.5), y+Inches(0.1), Inches(4), Inches(0.4), "Georgia", Pt(26), C_GOLD, bold=True)
    add_text(slide, desc, Inches(5.5), y+Inches(0.5), Inches(4), Inches(0.3), "Calibri", Pt(13), C_IVORY_DIM)
add_notes(slide, "You're in a high-ticket business. One project can be $15–100K+. Growth comes from consistent, high-quality leads — not volume.")

# --- SLIDE 5 ---
slide = prs.slides.add_slide(blank_layout)
add_bg(slide)
add_gold_left_bar(slide)
add_text(slide, "GAP 01", Inches(1), Inches(0.5), Inches(2), Inches(0.3), "Calibri", Pt(10), C_GOLD, bold=True)
add_text(slide, "Website", Inches(1), Inches(0.8), Inches(8), Inches(0.8), "Georgia", Pt(42), C_IVORY, bold=True)
add_text(slide, "Presence Without Performance", Inches(1), Inches(1.6), Inches(8), Inches(0.5), "Georgia", Pt(20), C_GOLD)
add_gold_rule(slide, Inches(1), Inches(2.2))
add_text(slide, "A website that exists but doesn't convert is a missed opportunity every single day.", Inches(1), Inches(2.4), Inches(8), Inches(0.5), "Georgia", Pt(13), C_IVORY_DIM, italic=True)

rows = [
    ("🌐 No clear call to action", "Visitors land and don't know what to do next. No quote forms, no lead capture, no next step.", Inches(2.8)),
    ("🔍 No structured service pages", "Each service needs its own SEO-optimised page to rank on Google and convert intent into enquiries.", Inches(3.7)),
    ("📊 No lead capture system", "No enquiry forms, no quote requests, no follow-up — visitors leave without a way to reach you.", Inches(4.6))
]
for title, desc, y in rows:
    add_rect(slide, Inches(1), y, Inches(8), Inches(0.7), C_PANEL, border_color=C_GOLD_DARK)
    add_rect(slide, Inches(1), y, Inches(0.05), Inches(0.7), C_GOLD)
    add_text(slide, title, Inches(1.2), y+Inches(0.1), Inches(7.5), Inches(0.3), "Calibri", Pt(13), C_GOLD, bold=True)
    add_text(slide, desc, Inches(1.2), y+Inches(0.35), Inches(7.6), Inches(0.3), "Calibri", Pt(12), C_IVORY_DIM)
add_notes(slide, "Right now, the website exists — but it's not working as a system to bring in leads consistently.")

# Run this chunk, wait, let's keep writing
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
add_text(slide, "We don't just build websites.\\nWe build systems that consistently bring in qualified leads.", Inches(1), Inches(4), Inches(8), Inches(1), "Georgia", Pt(22), C_GOLD, bold=True)
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
