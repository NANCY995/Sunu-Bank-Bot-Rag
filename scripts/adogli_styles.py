"""
Générateur Haute Fidélité du Mémoire Master SUNU Bank Togo
Conforme à la présentation et charte graphique du Mémoire ADOGLI (Collège de Paris / Université de Lomé)
et intégrant les VRAIES captures d'écran originales de l'application.
"""

import os
import re
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.enum.section import WD_SECTION_START
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

DOC_OUTPUT = "MEMOIRE_MASTER_SUNU_BANK_TOGO_RAG_FINAL.docx"

# Palette de couleurs Adogli / SUNU Bank
C_NAVY = RGBColor(0x00, 0x33, 0x66)       # Bleu Nuit Titres / En-têtes (#003366)
C_RED = RGBColor(0xE2, 0x1E, 0x26)        # Rouge Institutionnel SUNU (#E21E26)
C_DARK = RGBColor(0x1A, 0x20, 0x2C)       # Texte principal (#1A202C)
C_MUTED = RGBColor(0x4A, 0x55, 0x68)      # Gris sous-titres / sources (#4A5568)
C_WHITE = RGBColor(0xFF, 0xFF, 0xFF)

HEX_NAVY = "003366"
HEX_RED = "E21E26"
HEX_LIGHT_BG = "F8FAFC"
HEX_BORDER = "CBD5E1"

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    """Définit les marges internes (padding) d'une cellule."""
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

def add_callout_box(doc, text, border_color="003366", bg_color="F8FAFC"):
    """Crée un encadré académique avec bordure gauche épaisse et fond teinté."""
    p = doc.add_paragraph()
    p.paragraph_format.left_indent = Inches(0.2)
    p.paragraph_format.right_indent = Inches(0.2)
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(6)
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
    
    run = p.add_run(text)
    run.font.name = "Calibri"
    run.font.size = Pt(10.5)
    run.font.color.rgb = C_DARK
    return p

def add_header_footer_lines(section, is_roman=False):
    """Configure l'en-tête et le pied de page exactement comme Adogli."""
    header = section.header
    header.is_linked_to_previous = False
    hp = header.paragraphs[0]
    hp.text = ""
    hp.alignment = WD_ALIGN_PARAGRAPH.CENTER
    hrun = hp.add_run("CONCEPTION D'UN ASSISTANT CONVERSATIONNEL INTELLIGENT BASÉ SUR LE RAG POUR L'ACCOMPAGNEMENT PRÉCONTRACTUEL EN BANCASSURANCE : CAS DE SUNU BANK TOGO")
    hrun.font.name = "Calibri"
    hrun.font.size = Pt(8.5)
    hrun.font.color.rgb = RGBColor(0x33, 0x33, 0x33)
    
    # Bordure inférieure sur l'en-tête
    pPr = hp._p.get_or_add_pPr()
    pBdr = parse_xml(f'<w:pBdr {nsdecls("w")}>\n'
                     f'<w:bottom w:val="single" w:sz="6" w:space="4" w:color="A0AEC0"/>\n'
                     f'</w:pBdr>')
    pPr.append(pBdr)
    
    # Pied de page
    footer = section.footer
    footer.is_linked_to_previous = False
    fp = footer.paragraphs[0]
    fp.text = ""
    
    # Bordure supérieure sur le pied de page
    fpPr = fp._p.get_or_add_pPr()
    fpBdr = parse_xml(f'<w:pBdr {nsdecls("w")}>\n'
                      f'<w:top w:val="single" w:sz="6" w:space="4" w:color="A0AEC0"/>\n'
                      f'</w:pBdr>')
    fpPr.append(fpBdr)
    
    # Création d'une table footer 1 ligne 2 colonnes pour aligner Gauche (Auteur) et Droite (Numéro)
    # Dans Word, on peut utiliser des tabulations ou un run
    run_left = fp.add_run("Rédigé et présenté par ADOGLI Jean-Paul")
    run_left.font.name = "Calibri"
    run_left.font.size = Pt(9)
    run_left.font.color.rgb = RGBColor(0x4A, 0x55, 0x68)
    
    # Tabulation vers la droite
    run_tab = fp.add_run("\t\t")
    
    # Champ de numéro de page
    run_page = fp.add_run()
    run_page.font.name = "Calibri"
    run_page.font.size = Pt(9.5)
    run_page.font.bold = True
    run_page.font.color.rgb = RGBColor(0x1A, 0x20, 0x2C)
    fldSimple = OxmlElement('w:fldSimple')
    fldSimple.set(qn('w:instr'), 'PAGE')
    run_page._r.append(fldSimple)

print("[OK] Fonctions de style Adogli initialisées.")
