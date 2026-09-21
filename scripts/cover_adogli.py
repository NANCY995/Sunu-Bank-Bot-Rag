"""
Script complet de génération du Mémoire Master SUNU Bank Togo
Conforme à 100% à la présentation du Mémoire ADOGLI (Collège de Paris / Université de Lomé)
et intégrant les captures d'écran ORIGINALES de l'application.
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

def set_cell_margins(cell, top=120, bottom=120, left=180, right=180):
    """Définit le padding d'une cellule."""
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}>\n'
                      f'<w:top w:w="{top}" w:type="dxa"/>\n'
                      f'<w:bottom w:w="{bottom}" w:type="dxa"/>\n'
                      f'<w:left w:w="{left}" w:type="dxa"/>\n'
                      f'<w:right w:w="{right}" w:type="dxa"/>\n'
                      f'</w:tcMar>')
    tcPr.append(tcMar)

def set_cell_border(cell, **kwargs):
    """Définit les bordures d'une cellule."""
    tcPr = cell._tc.get_or_add_tcPr()
    tcBorders = parse_xml(f'<w:tcBorders {nsdecls("w")}>\n'
                          f'<w:top w:val="{kwargs.get("top", "none")}" w:sz="{kwargs.get("top_sz", "4")}" w:space="0" w:color="{kwargs.get("color", "CBD5E1")}"/>\n'
                          f'<w:left w:val="{kwargs.get("left", "none")}" w:sz="{kwargs.get("left_sz", "4")}" w:space="0" w:color="{kwargs.get("color", "CBD5E1")}"/>\n'
                          f'<w:bottom w:val="{kwargs.get("bottom", "none")}" w:sz="{kwargs.get("bottom_sz", "4")}" w:space="0" w:color="{kwargs.get("color", "CBD5E1")}"/>\n'
                          f'<w:right w:val="{kwargs.get("right", "none")}" w:sz="{kwargs.get("right_sz", "4")}" w:space="0" w:color="{kwargs.get("color", "CBD5E1")}"/>\n'
                          f'</w:tcBorders>')
    tcPr.append(tcBorders)

def add_header_footer(section, is_preliminary=False):
    """Configure l'en-tête et le pied de page exactement comme Adogli."""
    header = section.header
    header.is_linked_to_previous = False
    hp = header.paragraphs[0]
    hp.text = ""
    hp.alignment = WD_ALIGN_PARAGRAPH.CENTER
    hrun = hp.add_run("CONCEPTION D'UN ASSISTANT CONVERSATIONNEL INTELLIGENT BASÉ SUR LE RAG POUR L'ACCOMPAGNEMENT PRÉCONTRACTUEL EN BANCASSURANCE : CAS DE SUNU BANK TOGO")
    hrun.font.name = "Times New Roman"
    hrun.font.size = Pt(8.5)
    hrun.font.color.rgb = RGBColor(0x33, 0x33, 0x33)
    
    # Bordure inférieure sous l'en-tête
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
    
    # Bordure supérieure au-dessus du pied de page
    fpPr = fp._p.get_or_add_pPr()
    fpBdr = parse_xml(f'<w:pBdr {nsdecls("w")}>\n'
                      f'<w:top w:val="single" w:sz="6" w:space="4" w:color="A0AEC0"/>\n'
                      f'</w:pBdr>')
    fpPr.append(fpBdr)
    
    # Run Auteur à gauche
    run_left = fp.add_run("Rédigé et présenté par JOHNSON Nancy")
    run_left.font.name = "Times New Roman"
    run_left.font.size = Pt(9)
    run_left.font.color.rgb = RGBColor(0x4A, 0x55, 0x68)
    
    # Alignement à droite via tabulations
    run_tab = fp.add_run("\t\t")
    
    # Champ de numéro de page
    run_page = fp.add_run()
    run_page.font.name = "Times New Roman"
    run_page.font.size = Pt(9.5)
    run_page.font.bold = True
    run_page.font.color.rgb = RGBColor(0x1A, 0x20, 0x2C)
    fldSimple = OxmlElement('w:fldSimple')
    fldSimple.set(qn('w:instr'), 'PAGE')
    run_page._r.append(fldSimple)

def create_cover_page(doc):
    """Génère la page de couverture exactement calquée sur celle de Adogli (page 1)."""
    # Table des logos (Haut de page)
    tbl_logos = doc.add_table(rows=1, cols=2)
    tbl_logos.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_logos.autofit = False
    tbl_logos.columns[0].width = Inches(3.2)
    tbl_logos.columns[1].width = Inches(3.2)
    
    c_left = tbl_logos.cell(0, 0)
    c_right = tbl_logos.cell(0, 1)
    
    # Logo Établissement (Collège de Paris / Université)
    p_logo_left = c_left.paragraphs[0]
    p_logo_left.alignment = WD_ALIGN_PARAGRAPH.LEFT
    logo_left_path = "Memoire/adogli_assets/cover_logo_1.png"
    if os.path.exists(logo_left_path):
        p_logo_left.add_run().add_picture(logo_left_path, width=Inches(2.2))
        
    # Logo Entreprise (SUNU Bank / Assurances)
    p_logo_right = c_right.paragraphs[0]
    p_logo_right.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    logo_right_path = "Projet/LOGO-SUNU.png"
    if os.path.exists(logo_right_path):
        p_logo_right.add_run().add_picture(logo_right_path, width=Inches(1.8))
        
    # Espacement
    p_space = doc.add_paragraph()
    p_space.paragraph_format.space_before = Pt(36)
    p_space.paragraph_format.space_after = Pt(12)
    
    # THÈME DU MÉMOIRE
    p_theme_label = doc.add_paragraph()
    p_theme_label.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_theme_label.paragraph_format.space_after = Pt(14)
    r_theme_label = p_theme_label.add_run("THEME DU MEMOIRE")
    r_theme_label.font.name = "Times New Roman"
    r_theme_label.font.size = Pt(13)
    r_theme_label.font.bold = True
    r_theme_label.font.color.rgb = RGBColor(0x11, 0x18, 0x27)
    
    # Grand encadré avec bordure bleu nuit arrondie
    tbl_box = doc.add_table(rows=1, cols=1)
    tbl_box.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_box.autofit = False
    tbl_box.columns[0].width = Inches(6.2)
    
    cell_box = tbl_box.cell(0, 0)
    set_cell_margins(cell_box, top=240, bottom=240, left=240, right=240)
    set_cell_border(cell_box, top="single", bottom="single", left="single", right="single", color="E21E26", top_sz="16", bottom_sz="16", left_sz="16", right_sz="16")
    
    # Fond très légèrement teinté
    tcPr = cell_box._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="F8FAFC"/>')
    tcPr.append(shd)
    
    p_title = cell_box.paragraphs[0]
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.line_spacing = 1.25
    r_title = p_title.add_run("CONCEPTION ET IMPLÉMENTATION D'UN SYSTÈME RAG POUR L'AUTOMATISATION DE L'INFORMATION PRÉCONTRACTUELLE EN BANCASSURANCE VIE : CAS DE SUNU BANK TOGO")
    r_title.font.name = "Times New Roman"
    r_title.font.size = Pt(13)
    r_title.font.bold = True
    r_title.font.color.rgb = C_NAVY
    
    # Espacement
    p_space2 = doc.add_paragraph()
    p_space2.paragraph_format.space_before = Pt(28)
    p_space2.paragraph_format.space_after = Pt(4)
    
    # Rapport en vue de l'obtention du diplôme
    p_dip1 = doc.add_paragraph()
    p_dip1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_dip1.paragraph_format.space_after = Pt(4)
    r_dip1 = p_dip1.add_run("Rapport en vue de l’obtention du diplôme de :")
    r_dip1.font.name = "Times New Roman"
    r_dip1.font.size = Pt(11)
    r_dip1.font.bold = True
    
    p_dip2 = doc.add_paragraph()
    p_dip2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_dip2.paragraph_format.space_after = Pt(24)
    r_dip2 = p_dip2.add_run("Master en Intelligence Artificielle & Big Data")
    r_dip2.font.name = "Times New Roman"
    r_dip2.font.size = Pt(12)
    r_dip2.font.bold = True
    r_dip2.font.color.rgb = C_NAVY
    
    # Présenté par
    p_pres = doc.add_paragraph()
    p_pres.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_pres.paragraph_format.space_after = Pt(4)
    r_pres = p_pres.add_run("Présenté par :")
    r_pres.font.name = "Times New Roman"
    r_pres.font.size = Pt(11)
    r_pres.font.bold = True
    
    p_nom = doc.add_paragraph()
    p_nom.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_nom.paragraph_format.space_after = Pt(36)
    r_nom = p_nom.add_run("JOHNSON Nancy")
    r_nom.font.name = "Times New Roman"
    r_nom.font.size = Pt(12)
    r_nom.font.bold = True
    
    # Tableau des Encadreurs (2 colonnes)
    tbl_enc = doc.add_table(rows=1, cols=2)
    tbl_enc.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_enc.autofit = False
    tbl_enc.columns[0].width = Inches(3.2)
    tbl_enc.columns[1].width = Inches(3.2)
    
    # Encadreur Académique
    c_acad = tbl_enc.cell(0, 0)
    p_acad = c_acad.paragraphs[0]
    p_acad.alignment = WD_ALIGN_PARAGRAPH.LEFT
    r_acad_t = p_acad.add_run("Encadreur Académique :\n")
    r_acad_t.font.name = "Times New Roman"
    r_acad_t.font.size = Pt(10.5)
    r_acad_t.font.bold = True
    r_acad_t.font.italic = True
    r_acad_t.font.underline = True
    
    r_acad_n = p_acad.add_run("Monsieur Essowaba AHOULOUMI\n")
    r_acad_n.font.name = "Times New Roman"
    r_acad_n.font.size = Pt(10.5)
    
    r_acad_f = p_acad.add_run("Ing. spécialiste webmaster")
    r_acad_f.font.name = "Times New Roman"
    r_acad_f.font.size = Pt(10)
    r_acad_f.font.color.rgb = C_MUTED
    
    # Encadreur Professionnel
    c_prof = tbl_enc.cell(0, 1)
    p_prof = c_prof.paragraphs[0]
    p_prof.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r_prof_t = p_prof.add_run("Encadreur Professionnel :\n")
    r_prof_t.font.name = "Times New Roman"
    r_prof_t.font.size = Pt(10.5)
    r_prof_t.font.bold = True
    r_prof_t.font.italic = True
    r_prof_t.font.underline = True
    
    r_prof_n = p_prof.add_run("Monsieur Fissale TCHAKALA\n")
    r_prof_n.font.name = "Times New Roman"
    r_prof_n.font.size = Pt(10.5)
    
    r_prof_f = p_prof.add_run("Ingénieur de formation en Systèmes et Sécurité d'Information,\nResponsable des Opérations IT à SUNU Bank Togo")
    r_prof_f.font.name = "Times New Roman"
    r_prof_f.font.size = Pt(10)
    r_prof_f.font.color.rgb = C_MUTED
    
    # Espacement bas de page
    p_space3 = doc.add_paragraph()
    p_space3.paragraph_format.space_before = Pt(36)
    p_space3.paragraph_format.space_after = Pt(4)
    
    # Ville & Année académique
    p_ville = doc.add_paragraph()
    p_ville.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_ville.paragraph_format.space_after = Pt(2)
    r_ville = p_ville.add_run("LOME, TOGO")
    r_ville.font.name = "Times New Roman"
    r_ville.font.size = Pt(11)
    r_ville.font.bold = True
    
    p_annee = doc.add_paragraph()
    p_annee.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_annee = p_annee.add_run("Année académique : 2024-2025")
    r_annee.font.name = "Times New Roman"
    r_annee.font.size = Pt(10.5)

print("[OK] Fonction Page de Couverture Adogli prête.")
