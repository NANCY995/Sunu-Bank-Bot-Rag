"""
Configuration des styles typographiques et de la charte graphique Adogli / SUNU Bank
Applique les styles Word natifs (Heading 1, Heading 2, Heading 3, Heading 4)
conformes aux exigences universitaires et aux normes de mise en page professionnelles.
"""

import re
import docx
import docx.enum.style
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

# Palette de couleurs officielles
C_NAVY = RGBColor(0xE2, 0x1E, 0x26)       # Bleu Nuit Titres / En-têtes (#003366)
C_RED = RGBColor(0xE2, 0x1E, 0x26)        # Rouge Institutionnel SUNU (#E21E26)
C_DARK = RGBColor(0x1A, 0x20, 0x2C)       # Texte principal (#1A202C)
C_MUTED = RGBColor(0x4A, 0x55, 0x68)      # Gris sous-titres / sources (#4A5568)
C_WHITE = RGBColor(0xFF, 0xFF, 0xFF)

HEX_NAVY = "E21E26"
HEX_RED = "E21E26"
HEX_LIGHT_BG = "F8FAFC"
HEX_BORDER = "CBD5E1"

def set_cell_margins(cell, top=120, bottom=120, left=160, right=160):
    """Définit le padding interne d'une cellule XML."""
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}>\n'
                      f'<w:top w:w="{top}" w:type="dxa"/>\n'
                      f'<w:bottom w:w="{bottom}" w:type="dxa"/>\n'
                      f'<w:left w:w="{left}" w:type="dxa"/>\n'
                      f'<w:right w:w="{right}" w:type="dxa"/>\n'
                      f'</w:tcMar>')
    tcPr.append(tcMar)

def set_cell_border(cell, **kwargs):
    """Définit les bordures d'une cellule XML."""
    tcPr = cell._tc.get_or_add_tcPr()
    tcBorders = parse_xml(f'<w:tcBorders {nsdecls("w")}>\n'
                          f'<w:top w:val="{kwargs.get("top", "none")}" w:sz="{kwargs.get("top_sz", "4")}" w:space="0" w:color="{kwargs.get("color", "CBD5E1")}"/>\n'
                          f'<w:left w:val="{kwargs.get("left", "none")}" w:sz="{kwargs.get("left_sz", "4")}" w:space="0" w:color="{kwargs.get("color", "CBD5E1")}"/>\n'
                          f'<w:bottom w:val="{kwargs.get("bottom", "none")}" w:sz="{kwargs.get("bottom_sz", "4")}" w:space="0" w:color="{kwargs.get("color", "CBD5E1")}"/>\n'
                          f'<w:right w:val="{kwargs.get("right", "none")}" w:sz="{kwargs.get("right_sz", "4")}" w:space="0" w:color="{kwargs.get("color", "CBD5E1")}"/>\n'
                          f'</w:tcBorders>')
    tcPr.append(tcBorders)

def configure_document_styles(doc):
    """Configure les styles de titres natifs Word pour activer la navigation et la TOC."""
    styles = doc.styles
    
    # Normal (Corps de texte)
    style_normal = styles['Normal']
    font_normal = style_normal.font
    font_normal.name = 'Times New Roman'
    font_normal.size = Pt(11)
    font_normal.color.rgb = C_DARK
    
    # Heading 1 (Titres de chapitres / Sections majeures)
    try:
        h1 = styles['Heading 1']
    except KeyError:
        h1 = styles.add_style('Heading 1', docx.enum.style.WD_STYLE_TYPE.PARAGRAPH)
    h1.font.name = 'Times New Roman'
    h1.font.size = Pt(14.5)
    h1.font.bold = True
    h1.font.color.rgb = C_NAVY
    h1.paragraph_format.space_before = Pt(18)
    h1.paragraph_format.space_after = Pt(8)
    h1.paragraph_format.keep_with_next = True
    
    # Heading 2 (Niveau I.1, II.1...)
    try:
        h2 = styles['Heading 2']
    except KeyError:
        h2 = styles.add_style('Heading 2', docx.enum.style.WD_STYLE_TYPE.PARAGRAPH)
    h2.font.name = 'Times New Roman'
    h2.font.size = Pt(12.5)
    h2.font.bold = True
    h2.font.color.rgb = C_NAVY
    h2.paragraph_format.space_before = Pt(14)
    h2.paragraph_format.space_after = Pt(6)
    h2.paragraph_format.keep_with_next = True
    
    # Heading 3 (Niveau I.1.1, II.1.1...)
    try:
        h3 = styles['Heading 3']
    except KeyError:
        h3 = styles.add_style('Heading 3', docx.enum.style.WD_STYLE_TYPE.PARAGRAPH)
    h3.font.name = 'Times New Roman'
    h3.font.size = Pt(11.5)
    h3.font.bold = True
    h3.font.color.rgb = C_DARK
    h3.paragraph_format.space_before = Pt(10)
    h3.paragraph_format.space_after = Pt(4)
    h3.paragraph_format.keep_with_next = True
    
    # Heading 4 (Niveau I.1.1.1 / Sous-sections)
    try:
        h4 = styles['Heading 4']
    except KeyError:
        h4 = styles.add_style('Heading 4', docx.enum.style.WD_STYLE_TYPE.PARAGRAPH)
    h4.font.name = 'Times New Roman'
    h4.font.size = Pt(11)
    h4.font.bold = True
    h4.font.italic = True
    h4.font.color.rgb = C_MUTED
    h4.paragraph_format.space_before = Pt(8)
    h4.paragraph_format.space_after = Pt(3)
    h4.paragraph_format.keep_with_next = True

def add_formatted_runs(paragraph, text, base_font="Times New Roman", base_size=Pt(11), base_color=None, default_bold=False, default_italic=False):
    """
    Découpe une chaîne contenant du formatage Markdown inline (**gras**, *italique*, ***gras italique***, `code`)
    et ajoute les runs correspondants avec les vrais styles Word (gras/italique/code).
    """
    if not text:
        return
    tokens = re.split(r'(\*\*\*.*?\*\*\*|\*\*.*?\*\*|\*[^*\n]+?\*|`[^`\n]+?`)', str(text))
    for token in tokens:
        if not token:
            continue
        is_bold = default_bold
        is_italic = default_italic
        is_code = False
        content = token
        
        if token.startswith('***') and token.endswith('***') and len(token) >= 6:
            is_bold = True
            is_italic = True
            content = token[3:-3]
        elif token.startswith('**') and token.endswith('**') and len(token) >= 4:
            is_bold = True
            content = token[2:-2]
        elif token.startswith('*') and token.endswith('*') and len(token) >= 2:
            is_italic = True
            content = token[1:-1]
        elif token.startswith('`') and token.endswith('`') and len(token) >= 2:
            is_code = True
            content = token[1:-1]
            
        r = paragraph.add_run(content)
        r.font.name = "Consolas" if is_code else base_font
        r.font.size = Pt(9.5) if is_code else base_size
        r.font.bold = is_bold
        r.font.italic = is_italic
        if base_color:
            r.font.color.rgb = base_color
        elif is_code:
            r.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)

def add_callout_box(doc, text, title="", border_color="E21E26", bg_color="F8FAFC"):
    """Crée un encadré académique avec bordure gauche épaisse et fond teinté."""
    p = doc.add_paragraph()
    p.paragraph_format.left_indent = Inches(0.2)
    p.paragraph_format.right_indent = Inches(0.2)
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(8)
    pPr = p._p.get_or_add_pPr()
    pBdr = parse_xml(f'<w:pBdr {nsdecls("w")}>\n'
                     f'<w:left w:val="single" w:sz="24" w:space="12" w:color="{border_color}"/>\n'
                     f'<w:top w:val="none"/>\n'
                     f'<w:right w:val="none"/>\n'
                     f'<w:bottom w:val="none"/>\n'
                     f'</w:pBdr>')
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{bg_color}"/>')
    pPr.append(pBdr)
    pPr.append(shd)
    
    if title:
        rt = p.add_run(f"• {title}\n")
        rt.font.name = "Times New Roman"
        rt.font.size = Pt(10.5)
        rt.font.bold = True
        rt.font.color.rgb = C_NAVY
        
    add_formatted_runs(p, text, base_font="Times New Roman", base_size=Pt(10), base_color=C_DARK)
    return p

def add_code_block(doc, code_text):
    """Crée un bloc de code informatique avec police monospace et fond gris."""
    p = doc.add_paragraph()
    p.paragraph_format.left_indent = Inches(0.25)
    p.paragraph_format.right_indent = Inches(0.25)
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(6)
    pPr = p._p.get_or_add_pPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="F1F5F9"/>')
    pPr.append(shd)
    
    run = p.add_run(code_text)
    run.font.name = "Consolas"
    run.font.size = Pt(9)
    run.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)
    return p

def add_header_footer_lines(section, is_roman=False):
    """Configure l'en-tête et le pied de page exactement comme Adogli."""
    # Configuration du format et redémarrage de la numérotation
    sectPr = section._sectPr
    for el in sectPr.findall(qn('w:pgNumType')):
        sectPr.remove(el)
    fmt = 'upperRoman' if is_roman else 'decimal'
    pgNum = parse_xml(f'<w:pgNumType {nsdecls("w")} w:start="1" w:fmt="{fmt}"/>')
    cols = sectPr.find(qn('w:cols'))
    if cols is not None:
        cols.addprevious(pgNum)
    else:
        sectPr.append(pgNum)

    header = section.header
    header.is_linked_to_previous = False
    hp = header.paragraphs[0]
    hp.text = ""
    hp.alignment = WD_ALIGN_PARAGRAPH.CENTER
    hrun = hp.add_run("CONCEPTION D'UN ASSISTANT CONVERSATIONNEL INTELLIGENT BASÉ SUR LE RAG POUR L'ACCOMPAGNEMENT PRÉCONTRACTUEL EN BANCASSURANCE : CAS DE SUNU BANK TOGO")
    hrun.font.name = "Times New Roman"
    hrun.font.size = Pt(8)
    hrun.font.color.rgb = RGBColor(0x4A, 0x55, 0x68)
    
    # Bordure inférieure sous l'en-tête
    pPr = hp._p.get_or_add_pPr()
    pBdr = parse_xml(f'<w:pBdr {nsdecls("w")}>\n'
                     f'<w:bottom w:val="single" w:sz="6" w:space="4" w:color="CBD5E1"/>\n'
                     f'</w:pBdr>')
    pPr.append(pBdr)
    
    # Pied de page
    footer = section.footer
    footer.is_linked_to_previous = False
    fp = footer.paragraphs[0]
    fp.text = ""
    
    # Bordure supérieure au-dessus du pied de page
    fpPr = fp._p.get_or_add_pPr()
    fpBdr = parse_xml(f'<w:pBdr {nsdecls("w")}>\n'
                      f'<w:top w:val="single" w:sz="6" w:space="4" w:color="CBD5E1"/>\n'
                      f'</w:pBdr>')
    fpPr.append(fpBdr)
    
    # Run Auteur à gauche
    run_left = fp.add_run("Rédigé et présenté par JOHNSON Nancy")
    run_left.font.name = "Times New Roman"
    run_left.font.size = Pt(9)
    run_left.font.color.rgb = RGBColor(0x4A, 0x55, 0x68)
    
    # Alignement à droite via tabulations
    run_tab = fp.add_run("\t\t")
    
    # Champ dynamique de numéro de page
    run_page = fp.add_run()
    run_page.font.name = "Times New Roman"
    run_page.font.size = Pt(9.5)
    run_page.font.bold = True
    run_page.font.color.rgb = RGBColor(0x1A, 0x20, 0x2C)
    
    fldSimple = OxmlElement('w:fldSimple')
    fldSimple.set(qn('w:instr'), 'PAGE')
    run_page._r.append(fldSimple)

print("[OK] Fonctions de style Adogli initialisées avec support complet des Heading Styles.")
