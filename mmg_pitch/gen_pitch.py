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
