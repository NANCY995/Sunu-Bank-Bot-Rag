"""
Theme SUNU Bank Togo — Design System Premium
Applique les tokens couleurs, typographie, spacing, glassmorphism et animations.
"""

import streamlit as st

# ── Colors (Premium Light Theme) ──
INK = "#1A1A1A"
INK_DEEP = "#0A0A0A"
CANVAS = "#F4F7F9"
SURFACE_SOFT = "#FFFFFF"
SURFACE_CARD = "#FFFFFF"
SURFACE_DARK = "#1E232E"
SURFACE_DARK_ELEVATED = "#2A303C"
HAIRLINE = "rgba(0,0,0,0.06)"
HAIRLINE_STRONG = "rgba(0,0,0,0.12)"
MUTE = "#8C92A4"
STONE = "#6E7582"
ASH = "#B3B8C2"
BODY = "#4A505C"
ACCENT = "#0062FF"
ACCENT_HOVER = "#0052CC"
DANGER = "#FF3B30"
SUCCESS = "#34C759"
WARNING = "#FF9F0A"
ON_DARK = "#FFFFFF"
GRADIENT_ACCENT = "linear-gradient(135deg, #0062FF 0%, #3385FF 100%)"
GRADIENT_DARK = "linear-gradient(135deg, #1E232E 0%, #2A303C 100%)"

# ── Typography ──
FONT = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
FONT_DISPLAY = "'Outfit', 'Inter', sans-serif"
DISPLAY_SIZE = "2.25rem"
HEADING_SIZE = "1.25rem"
BODY_SIZE = "0.9375rem"
CAPTION_SIZE = "0.8125rem"

# ── Spacing ──
SPACING_SECTION = "60px"
SPACING_SM = "8px"
SPACING_MD = "12px"
SPACING_LG = "20px"
SPACING_XL = "28px"
SPACING_XXL = "40px"

# ── Radius & Shadow ──
RADIUS_NONE = "0px"
RADIUS_SM = "8px"
RADIUS_MD = "16px"
RADIUS_LG = "24px"
RADIUS_FULL = "9999px"
SHADOW_SM = "0 2px 8px rgba(0,0,0,0.04)"
SHADOW_MD = "0 8px 24px rgba(0,0,0,0.06)"
SHADOW_HOVER = "0 12px 32px rgba(0,64,255,0.08)"

def apply_theme():
    """Applique le CSS global du design system premium à la page Streamlit courante."""
    st.markdown(_GLOBAL_CSS, unsafe_allow_html=True)


_GLOBAL_CSS = f"""
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@500;600;700&display=swap');

/* ── Base ── */
.stApp, .main .block-container {{
    background-color: {CANVAS} !important;
    color: {INK} !important;
    font-family: {FONT} !important;
}}
section[data-testid="stSidebar"] {{
    background-color: {SURFACE_SOFT} !important;
    border-right: 1px solid {HAIRLINE} !important;
    box-shadow: {SHADOW_SM} !important;
}}

/* ── Headings ── */
h1, h2, h3, h4, h5, h6,
.stMarkdown h1, .stMarkdown h2, .stMarkdown h3 {{
    font-family: {FONT_DISPLAY} !important;
    color: {INK} !important;
    letter-spacing: -0.02em !important;
}}
h1 {{ font-size: {DISPLAY_SIZE} !important; line-height: 1.2 !important; font-weight: 700 !important; }}
h2 {{ font-size: {HEADING_SIZE} !important; line-height: 1.3 !important; font-weight: 600 !important; }}
h3 {{ font-size: 1.1rem !important; line-height: 1.4 !important; font-weight: 600 !important; }}

/* ── Body text ── */
p, span, div, label, .stMarkdown p {{
    font-family: {FONT} !important;
    color: {BODY} !important;
    font-size: {BODY_SIZE} !important;
    line-height: 1.6 !important;
}}

/* ── Buttons ── */
.stButton > button {{
    font-family: {FONT_DISPLAY} !important;
    font-weight: 600 !important;
    font-size: {BODY_SIZE} !important;
    border-radius: {RADIUS_SM} !important;
    border: none !important;
    padding: 8px 24px !important;
    height: 44px !important;
    box-shadow: {SHADOW_SM} !important;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
}}
.stButton > button[kind="primary"],
.stButton > button {{
    background: {GRADIENT_ACCENT} !important;
    color: {ON_DARK} !important;
}}
.stButton > button:hover {{
    transform: translateY(-2px) !important;
    box-shadow: {SHADOW_HOVER} !important;
    filter: brightness(1.05) !important;
}}
.stButton > button:active {{
    transform: translateY(0) !important;
}}

/* ── Inputs ── */
.stTextInput > div > div > input,
.stNumberInput > div > div > input,
.stTextArea > div > div > textarea,
.stSelectbox > div > div > div {{
    font-family: {FONT} !important;
    font-size: {BODY_SIZE} !important;
    background-color: {CANVAS} !important;
    color: {INK} !important;
    border: 1px solid {HAIRLINE_STRONG} !important;
    border-radius: {RADIUS_SM} !important;
    padding: 10px 14px !important;
    height: 44px !important;
    transition: all 0.2s ease !important;
}}
.stTextInput > div > div > input:focus,
.stNumberInput > div > div > input:focus,
.stTextArea > div > div > textarea:focus,
.stSelectbox > div > div > div:focus-within {{
    border-color: {ACCENT} !important;
    box-shadow: 0 0 0 3px rgba(0,98,255,0.15) !important;
    outline: none !important;
}}

/* ── Metrics cards ── */
[data-testid="stMetric"] {{
    background-color: {SURFACE_SOFT} !important;
    border: 1px solid {HAIRLINE} !important;
    border-radius: {RADIUS_MD} !important;
    padding: {SPACING_LG} !important;
    box-shadow: {SHADOW_MD} !important;
    transition: transform 0.2s ease, box-shadow 0.2s ease !important;
}}
[data-testid="stMetric"]:hover {{
    transform: translateY(-4px) !important;
    box-shadow: {SHADOW_HOVER} !important;
}}
[data-testid="stMetricValue"] {{
    font-family: {FONT_DISPLAY} !important;
    font-weight: 700 !important;
    color: {INK} !important;
    font-size: {DISPLAY_SIZE} !important;
}}
[data-testid="stMetricLabel"] {{
    font-family: {FONT} !important;
    font-weight: 600 !important;
    color: {MUTE} !important;
    font-size: {CAPTION_SIZE} !important;
    text-transform: uppercase !important;
    letter-spacing: 0.05em !important;
}}

/* ── Custom Cards & Badges ── */
.sunu-card {{
    background-color: {SURFACE_SOFT};
    border: 1px solid {HAIRLINE};
    border-radius: {RADIUS_MD};
    padding: {SPACING_XL};
    margin-bottom: {SPACING_MD};
    box-shadow: {SHADOW_MD};
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}}
.sunu-card:hover {{
    box-shadow: {SHADOW_HOVER};
}}
.sunu-badge {{
    display: inline-block;
    background-color: {CANVAS};
    color: {BODY};
    font-family: {FONT};
    font-size: 0.7rem;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: {RADIUS_FULL};
    text-transform: uppercase;
    letter-spacing: 0.05em;
}}
.sunu-badge-accent {{ background: {GRADIENT_ACCENT}; color: {ON_DARK}; }}
.sunu-badge-success {{ background-color: rgba(52,199,89,0.15); color: #28A745; }}
.sunu-badge-warning {{ background-color: rgba(255,159,10,0.15); color: #E08A00; }}
.sunu-badge-danger {{ background-color: rgba(255,59,48,0.15); color: #D73227; }}

/* ── Hero Banner ── */
.sunu-hero {{
    background: {GRADIENT_DARK};
    color: {ON_DARK};
    padding: {SPACING_XXL} {SPACING_XL};
    border-radius: {RADIUS_LG};
    margin: 0 0 {SPACING_XL} 0;
    box-shadow: {SHADOW_MD};
}}
.sunu-hero h1, .sunu-hero h2, .sunu-hero p {{
    color: {ON_DARK} !important;
}}
.sunu-hero h1 {{
    font-size: 2.5rem !important;
    margin-bottom: 8px !important;
}}

/* ── Layout Dividers ── */
.sunu-divider {{
    border: none;
    border-top: 1px solid {HAIRLINE};
    margin: {SPACING_SECTION} 0;
}}

/* ── Sidebar Navigation ── */
section[data-testid="stSidebar"] .stRadio > label > div {{
    display: flex !important;
    align-items: center !important;
    gap: 12px !important;
    padding: 12px 16px !important;
    border-radius: {RADIUS_SM} !important;
    transition: all 0.2s ease !important;
    margin: 4px 0 !important;
    font-family: {FONT_DISPLAY} !important;
    font-weight: 500 !important;
}}
section[data-testid="stSidebar"] .stRadio > label > div:hover {{
    background-color: {CANVAS} !important;
    transform: translateX(4px) !important;
}}
section[data-testid="stSidebar"] .stRadio > label > div[data-selected="true"] {{
    background: {GRADIENT_ACCENT} !important;
    box-shadow: {SHADOW_SM} !important;
}}
section[data-testid="stSidebar"] .stRadio > label > div[data-selected="true"] span,
section[data-testid="stSidebar"] .stRadio > label > div[data-selected="true"] .stRadio > label {{
    color: {ON_DARK} !important;
    font-weight: 600 !important;
}}

/* ── DataFrames & Charts ── */
.stDataFrame, .stPlotlyChart {{
    border: 1px solid {HAIRLINE} !important;
    border-radius: {RADIUS_MD} !important;
    box-shadow: {SHADOW_MD} !important;
    overflow: hidden !important;
}}
[data-testid="stDataFrame"] th {{
    font-family: {FONT_DISPLAY} !important;
    background-color: {CANVAS} !important;
    font-weight: 600 !important;
    color: {INK} !important;
    text-transform: uppercase !important;
    letter-spacing: 0.05em !important;
}}

/* ── Scrollbar ── */
::-webkit-scrollbar {{ width: 8px; height: 8px; }}
::-webkit-scrollbar-track {{ background: {CANVAS}; }}
::-webkit-scrollbar-thumb {{ background: {ASH}; border-radius: {RADIUS_FULL}; }}
::-webkit-scrollbar-thumb:hover {{ background: {MUTE}; }}
</style>
"""


def hero_banner(title: str, subtitle: str = "", children: str = "") -> None:
    """Rendu d'un hero banner moderne."""
    st.markdown(
        f'''<div class="sunu-hero">
<h1 style="margin:0;">{title}</h1>
{"<p style='opacity:0.8;font-size:1.1rem;margin-top:8px;'>" + subtitle + "</p>" if subtitle else ""}
{children}
</div>''',
        unsafe_allow_html=True,
    )


def kpi_card(label: str, value: str, delta: str = "", delta_suffix: str = "") -> str:
    """Retourne l'HTML d'un KPI card stylé."""
    delta_html = ""
    if delta:
        color = (
            "#34C759" if delta.startswith("+") or delta.startswith("↑")
            else "#FF3B30" if delta.startswith("-") or delta.startswith("↓")
            else MUTE
        )
        delta_html = f'<div style="color:{color};font-size:0.85rem;font-weight:600;margin-top:4px;">{delta}{delta_suffix}</div>'
    return f"""<div class="sunu-card" style="padding: 24px;">
<div style="font-family:'Outfit',sans-serif;font-weight:600;font-size:0.75rem;color:#8C92A4;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px;">{label}</div>
<div style="font-family:'Outfit',sans-serif;font-weight:700;font-size:2rem;color:#1A1A1A;line-height:1;">{value}</div>
{delta_html}
</div>"""


def badge(text: str, variant: str = "") -> str:
    """Retourne un badge HTML."""
    cls = f"sunu-badge sunu-badge-{variant}" if variant else "sunu-badge"
    return f'<span class="{cls}">{text}</span>'


def section_header(title: str) -> None:
    """Titre de section avec Divider."""
    st.markdown(f'<h3 style="margin-top:32px;margin-bottom:16px;">{title}</h3>', unsafe_allow_html=True)
