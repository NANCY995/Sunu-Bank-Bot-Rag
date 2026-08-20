"""
Theme SUNU Bank Togo — Design System monospace (inspiré OpenCode)
Applique les tokens couleurs, typographie, spacing et composants.
"""

import streamlit as st

# ── Colors ──
INK = "#201d1d"
INK_DEEP = "#0f0000"
CANVAS = "#fdfcfc"
SURFACE_SOFT = "#f8f7f7"
SURFACE_CARD = "#f1eeee"
SURFACE_DARK = "#201d1d"
SURFACE_DARK_ELEVATED = "#302c2c"
HAIRLINE = "rgba(15,0,0,0.12)"
HAIRLINE_STRONG = "#646262"
MUTE = "#646262"
STONE = "#6e6e73"
ASH = "#9a9898"
BODY = "#424245"
CHARCOAL = "#302c2c"
ACCENT = "#007aff"
ACCENT_HOVER = "#0056b3"
DANGER = "#ff3b30"
SUCCESS = "#30d158"
WARNING = "#ff9f0a"
ON_DARK = "#fdfcfc"

# ── Typography ──
FONT = "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
DISPLAY_SIZE = "2rem"
HEADING_SIZE = "1rem"
BODY_SIZE = "0.875rem"
CAPTION_SIZE = "0.75rem"

# ── Spacing ──
SPACING_SECTION = "60px"
SPACING_SM = "8px"
SPACING_MD = "12px"
SPACING_LG = "16px"
SPACING_XL = "24px"
SPACING_XXL = "32px"

# ── Radius ──
RADIUS_NONE = "0px"
RADIUS_SM = "4px"
RADIUS_FULL = "9999px"


def apply_theme():
    """Applique le CSS global du design system à la page Streamlit courante."""
    st.markdown(_GLOBAL_CSS, unsafe_allow_html=True)


_GLOBAL_CSS = f"""
<style>
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap');

/* ── Base ── */
.stApp, .main .block-container {{
    background-color: {CANVAS} !important;
    color: {INK} !important;
    font-family: {FONT} !important;
}}
section[data-testid="stSidebar"] {{
    background-color: {SURFACE_SOFT} !important;
    border-right: 1px solid {HAIRLINE} !important;
}}

/* ── Headings ── */
h1, h2, h3, h4, h5, h6,
.stMarkdown h1, .stMarkdown h2, .stMarkdown h3 {{
    font-family: {FONT} !important;
    font-weight: 700 !important;
    color: {INK} !important;
    letter-spacing: 0 !important;
}}
h1 {{ font-size: {DISPLAY_SIZE} !important; line-height: 1.5 !important; }}
h2 {{ font-size: {HEADING_SIZE} !important; line-height: 1.5 !important; }}
h3 {{ font-size: {BODY_SIZE} !important; line-height: 1.5 !important; font-weight: 700 !important; }}

/* ── Body text ── */
p, span, div, label, .stMarkdown p {{
    font-family: {FONT} !important;
    color: {BODY} !important;
    font-size: {BODY_SIZE} !important;
    line-height: 1.5 !important;
}}

/* ── Links ──
a {{ color: {INK} !important; text-decoration: underline !important; }}

/* ── Buttons ── */
.stButton > button {{
    font-family: {FONT} !important;
    font-weight: 500 !important;
    font-size: {BODY_SIZE} !important;
    line-height: 2 !important;
    border-radius: {RADIUS_SM} !important;
    border: none !important;
    padding: 4px 20px !important;
    height: 36px !important;
    transition: background-color 0.15s, color 0.15s !important;
}}
.stButton > button[kind="primary"],
.stButton > button {{
    background-color: {INK} !important;
    color: {ON_DARK} !important;
}}
.stButton > button:hover {{
    background-color: {ACCENT_HOVER} !important;
    color: {ON_DARK} !important;
}}
.stButton > button:active {{
    background-color: {INK_DEEP} !important;
    color: {ON_DARK} !important;
}}
.stDownloadButton > button {{
    background-color: {SURFACE_CARD} !important;
    color: {INK} !important;
    border: 1px solid {HAIRLINE} !important;
    border-radius: {RADIUS_SM} !important;
    font-family: {FONT} !important;
}}

/* ── Text inputs ── */
.stTextInput > div > div > input,
.stTextArea > div > div > textarea,
.stSelectbox > div > div > div {{
    font-family: {FONT} !important;
    font-size: {BODY_SIZE} !important;
    background-color: {SURFACE_SOFT} !important;
    color: {INK} !important;
    border: 1px solid {HAIRLINE} !important;
    border-radius: {RADIUS_SM} !important;
    padding: 8px 12px !important;
    height: 40px !important;
}}
.stTextInput > div > div > input:focus,
.stTextArea > div > div > textarea:focus {{
    border-color: {INK} !important;
    box-shadow: none !important;
    outline: none !important;
}}

/* ── Metrics cards ── */
[data-testid="stMetric"] {{
    background-color: {SURFACE_SOFT} !important;
    border: 1px solid {HAIRLINE} !important;
    border-radius: {RADIUS_SM} !important;
    padding: {SPACING_LG} !important;
}}
[data-testid="stMetricValue"] {{
    font-family: {FONT} !important;
    font-weight: 700 !important;
    color: {INK} !important;
    font-size: {DISPLAY_SIZE} !important;
}}
[data-testid="stMetricLabel"] {{
    font-family: {FONT} !important;
    font-weight: 500 !important;
    color: {MUTE} !important;
    font-size: {CAPTION_SIZE} !important;
    text-transform: uppercase !important;
    letter-spacing: 0.05em !important;
}}
[data-testid="stMetricDelta"] {{
    font-family: {FONT} !important;
    font-size: {BODY_SIZE} !important;
}}

/* ── Tabs ── */
.stTabs [data-baseweb="tab-list"] {{
    border-bottom: 1px solid {HAIRLINE_STRONG} !important;
    gap: 0 !important;
}}
.stTabs [data-baseweb="tab"] {{
    font-family: {FONT} !important;
    font-weight: 500 !important;
    font-size: {BODY_SIZE} !important;
    color: {MUTE} !important;
    padding: {SPACING_SM} {SPACING_LG} !important;
    border-radius: {RADIUS_NONE} !important;
    border: none !important;
}}
.stTabs [aria-selected="true"] {{
    color: {INK} !important;
    border-bottom: 2px solid {ASH} !important;
}}

/* ── DataFrames ── */
.stDataFrame {{
    border: 1px solid {HAIRLINE} !important;
    border-radius: {RADIUS_SM} !important;
}}
[data-testid="stDataFrame"] th {{
    font-family: {FONT} !important;
    font-weight: 700 !important;
    color: {INK} !important;
    background-color: {SURFACE_SOFT} !important;
    border-bottom: 1px solid {HAIRLINE} !important;
    font-size: {CAPTION_SIZE} !important;
    text-transform: uppercase !important;
    letter-spacing: 0.05em !important;
}}
[data-testid="stDataFrame"] td {{
    font-family: {FONT} !important;
    color: {BODY} !important;
    font-size: {BODY_SIZE} !important;
    border-bottom: 1px solid {HAIRLINE} !important;
}}

/* ── Charts (Plotly via Streamlit) ── */
.stPlotlyChart {{
    border: 1px solid {HAIRLINE} !important;
    border-radius: {RADIUS_SM} !important;
}}

/* ── Hero / KPI banner ── */
.sunu-hero {{
    background-color: {SURFACE_DARK};
    color: {ON_DARK};
    padding: {SPACING_XXL} {SPACING_XL};
    border-radius: {RADIUS_NONE};
    margin: 0 -1rem;
}}
.sunu-hero h1, .sunu-hero h2, .sunu-hero h3, .sunu-hero p {{
    color: {ON_DARK} !important;
}}
.sunu-hero .kpi-value {{
    font-size: {DISPLAY_SIZE};
    font-weight: 700;
    color: {ON_DARK};
}}
.sunu-hero .kpi-label {{
    font-size: {CAPTION_SIZE};
    font-weight: 500;
    color: {ASH};
    text-transform: uppercase;
    letter-spacing: 0.05em;
}}

/* ── Section divider ── */
.sunu-divider {{
    border: none;
    border-top: 1px solid {HAIRLINE};
    margin: {SPACING_SECTION} 0;
}}

/* ── Badge / tag ── */
.sunu-badge {{
    display: inline-block;
    background-color: {SURFACE_DARK};
    color: {ON_DARK};
    font-family: {FONT};
    font-size: {CAPTION_SIZE};
    font-weight: 400;
    padding: 2px 8px;
    border-radius: {RADIUS_SM};
}}
.sunu-badge-accent {{
    background-color: {ACCENT};
    color: {ON_DARK};
}}
.sunu-badge-success {{
    background-color: {SUCCESS};
    color: {INK};
}}
.sunu-badge-warning {{
    background-color: {WARNING};
    color: {INK};
}}
.sunu-badge-danger {{
    background-color: {DANGER};
    color: {ON_DARK};
}}

/* ── Card (chat bubble) ── */
.sunu-card {{
    background-color: {SURFACE_SOFT};
    border: 1px solid {HAIRLINE};
    border-radius: {RADIUS_SM};
    padding: {SPACING_LG};
    margin-bottom: {SPACING_SM};
}}
.sunu-card-dark {{
    background-color: {SURFACE_DARK};
    color: {ON_DARK};
    border: none;
    border-radius: {RADIUS_SM};
    padding: {SPACING_LG};
}}
.sunu-card-dark p, .sunu-card-dark span {{
    color: {ON_DARK} !important;
}}

/* ── Prompt row (chat input) ── */
.sunu-prompt {{
    background-color: {SURFACE_DARK_ELEVATED};
    color: {ON_DARK};
    border-radius: {RADIUS_SM};
    padding: {SPACING_SM} {SPACING_MD};
    font-family: {FONT};
    font-size: {BODY_SIZE};
}}

/* ── Expander ── */
.stExpander {{
    border: 1px solid {HAIRLINE} !important;
    border-radius: {RADIUS_SM} !important;
}}

/* ── Status indicators ── */
.status-ok {{ color: {SUCCESS}; font-weight: 700; }}
.status-warn {{ color: {WARNING}; font-weight: 700; }}
.status-err {{ color: {DANGER}; font-weight: 700; }}
.status-info {{ color: {ACCENT}; font-weight: 500; }}

/* ── Scrollbar ── */
::-webkit-scrollbar {{ width: 6px; height: 6px; }}
::-webkit-scrollbar-track {{ background: {SURFACE_SOFT}; }}
::-webkit-scrollbar-thumb {{ background: {ASH}; border-radius: {RADIUS_FULL}; }}
::-webkit-scrollbar-thumb:hover {{ background: {MUTE}; }}
</style>
"""


def hero_banner(title: str, subtitle: str = "", children: str = "") -> None:
    """Rendu d'un hero banner dark (surface-dark) avec titre et sous-titre."""
    st.markdown(
        f"""<div class="sunu-hero">
<h1>{title}</h1>
{"<p>" + subtitle + "</p>" if subtitle else ""}
{children}
</div>""",
        unsafe_allow_html=True,
    )


def kpi_card(label: str, value: str, delta: str = "", delta_suffix: str = "") -> None:
    """Rendu d'un KPI card monospace."""
    delta_html = ""
    if delta:
        color = (
            SUCCESS
            if delta.startswith("+") or delta.startswith("↑")
            else DANGER
            if delta.startswith("-") or delta.startswith("↓")
            else MUTE
        )
        delta_html = f'<span style="color:{color};font-size:0.75rem;font-weight:500;">{delta}{delta_suffix}</span>'
    st.markdown(
        f"""<div class="sunu-card">
<div class="kpi-label">{label}</div>
<div class="kpi-value">{value}</div>
{delta_html}
</div>""",
        unsafe_allow_html=True,
    )


def badge(text: str, variant: str = "") -> str:
    """Retourne un badge HTML monospace."""
    cls = f"sunu-badge sunu-badge-{variant}" if variant else "sunu-badge"
    return f'<span class="{cls}">{text}</span>'


def section_header(title: str) -> None:
    """Ensection de section avec divider."""
    st.markdown(f"#### {title}")
    st.markdown('<hr class="sunu-divider">', unsafe_allow_html=True)


def status_text(status: str) -> str:
    """Wrap un statut avec la bonne classe CSS."""
    cls = {
        "ok": "status-ok",
        "warn": "status-warn",
        "err": "status-err",
        "info": "status-info",
    }.get(status.lower(), "status-info")
    return f'<span class="{cls}">{status}</span>'
