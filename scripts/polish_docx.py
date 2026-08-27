"""
Script de mise à jour académique et perfectionnement professionnel du document Word :
MEMOIRE_MASTER_SUNU_BANK_TOGO_RAG_FINAL.docx

Rôles & Actions :
1. Remplacement de toutes les figures et captures existantes par les versions 300 DPI haute fidélité.
2. Insertion harmonieuse des deux figures d'expérimentation manquantes :
   - Figure III.1 : Structure et volumétrie du corpus documentaire SUNU Bank (fig_corpus_distribution.png)
   - Figure IV.2 : Évaluation empirique de la calibration du chunking (fig_chunking.png)
3. Application de bordures de mise en page académiques et professionnelles :
   - Encadrement subtil de la page de garde / métadonnées universitaires.
   - Boîtes d'appels réglementaires et conceptuelles (Callout Boxes) avec bordure gauche élégante (Bordeaux/Navy SUNU) et fond teinté pour les articles clés (Code CIMA Art. 6, 74, 76, Loi IPDCP Togo).
   - Uniformisation des légendes de figures (centrées, italique, numérotation normalisée FASEG / Université de Lomé).
   - Mise en valeur des tableaux d'évaluation et de métriques avec bordures précises.
"""

import os
import shutil
import zipfile
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

DOC_PATH = "MEMOIRE_MASTER_SUNU_BANK_TOGO_RAG_FINAL.docx"
BACKUP_PATH = "MEMOIRE_MASTER_SUNU_BANK_TOGO_RAG_FINAL_BACKUP.docx"

# Assurer une sauvegarde avant traitement
if not os.path.exists(BACKUP_PATH):
    shutil.copy(DOC_PATH, BACKUP_PATH)
    print(f"[OK] Sauvegarde créée : {BACKUP_PATH}")

def set_cell_border(cell, **kwargs):
    """Définit les bordures d'une cellule XML."""
    tcPr = cell._tc.get_or_add_tcPr()
    tcBorders = parse_xml(f'<w:tcBorders {nsdecls("w")}>\n'
                          f'<w:top w:val="{kwargs.get("top", "none")}" w:sz="{kwargs.get("top_sz", "4")}" w:space="0" w:color="{kwargs.get("color", "003366")}"/>\n'
                          f'<w:left w:val="{kwargs.get("left", "none")}" w:sz="{kwargs.get("left_sz", "4")}" w:space="0" w:color="{kwargs.get("color", "003366")}"/>\n'
                          f'<w:bottom w:val="{kwargs.get("bottom", "none")}" w:sz="{kwargs.get("bottom_sz", "4")}" w:space="0" w:color="{kwargs.get("color", "003366")}"/>\n'
                          f'<w:right w:val="{kwargs.get("right", "none")}" w:sz="{kwargs.get("right_sz", "4")}" w:space="0" w:color="{kwargs.get("color", "003366")}"/>\n'
                          f'</w:tcBorders>')
    tcPr.append(tcBorders)

def add_callout_styling(paragraph, border_color="003366", bg_color="F8FAFC"):
    """Ajoute une bordure gauche épaisse et un arrière-plan doux pour un encadré académique."""
    pPr = paragraph._p.get_or_add_pPr()
    pBdr = parse_xml(f'<w:pBdr {nsdecls("w")}>\n'
                     f'<w:left w:val="single" w:sz="24" w:space="15" w:color="{border_color}"/>\n'
                     f'<w:top w:val="none"/>\n'
                     f'<w:right w:val="none"/>\n'
                     f'<w:bottom w:val="none"/>\n'
                     f'</w:pBdr>')
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{bg_color}"/>')
    pPr.append(pBdr)
    pPr.append(shd)

def update_document_media():
    """Remplace les médias du docx par les nouveaux graphiques haute résolution générés."""
    # Mapping des fichiers médias existants dans le docx vers nos nouvelles figures
    media_map = {
        "image1.png": "Memoire/figures/fig_architecture.png",       # P383 - Fig I.1
        "image2.png": "Memoire/figures/fig_pipeline.png",           # P389 - Fig I.2
        "image3.png": "Memoire/figures/fig_ui_home_dark.png",       # P407 - Fig IV.5
        "image4.png": "Memoire/figures/fig_ui_home_light.png",      # P409 - Fig IV.6
        "image5.png": "Memoire/figures/fig_ui_chat.png",            # P412 - Fig IV.7
        "image6.png": "Memoire/figures/fig_ui_citation.png",        # P415 - Fig IV.8
        "image7.png": "Memoire/figures/fig_ui_login.png",           # P420 - Fig IV.9
        "image8.png": "Memoire/figures/fig_categories.png",         # P427 - Fig IV.1
        "image9.png": "Memoire/figures/fig_embeddings.png",         # P444 - Fig IV.3
        "image10.png": "Memoire/figures/fig_retrieval_by_category.png" # P450 - Fig IV.4
    }

    temp_zip = "temp_doc_update.zip"
    shutil.copy(DOC_PATH, temp_zip)
    
    # Extraire, remplacer et reconstruire l'archive docx
    extract_dir = "temp_docx_extracted"
    if os.path.exists(extract_dir):
        shutil.rmtree(extract_dir)
        
    with zipfile.ZipFile(temp_zip, 'r') as zf:
        zf.extractall(extract_dir)

    for img_name, local_path in media_map.items():
        dest = os.path.join(extract_dir, "word", "media", img_name)
        if os.path.exists(dest) and os.path.exists(local_path):
            shutil.copy(local_path, dest)
            print(f"[OK] Remplacé word/media/{img_name} avec {local_path}")

    # Re-pack into DOC_PATH
    shutil.make_archive("repacked_doc", 'zip', extract_dir)
    shutil.move("repacked_doc.zip", DOC_PATH)
    shutil.rmtree(extract_dir)
    if os.path.exists(temp_zip):
        os.remove(temp_zip)
    print("[OK] Toutes les images embarquées dans le document Word ont été synchronisées.")

def polish_and_insert_missing_figures():
    """Charge le document Word, insère les figures III.1 et IV.2, et applique la mise en page."""
    doc = docx.Document(DOC_PATH)
    
    # 1. Insertion de la Figure III.1 (Corpus) après le paragraphe P354
    # et de la Figure IV.2 (Calibration Chunking) après le paragraphe IV.3.2
    p_idx_corpus = -1
    p_idx_chunking = -1

    for i, p in enumerate(doc.paragraphs):
        if "III.3.2. Description des documents retenus" in p.text:
            p_idx_corpus = i + 1 # paragraphe qui liste les 5 documents
        if "IV.3.2. Résultats de l'expérience de calibration du chunking" in p.text:
            p_idx_chunking = i + 1

    print(f"Index repères : Corpus = P{p_idx_corpus}, Chunking = P{p_idx_chunking}")

    # Insérons proprement dans le flux textuel
    # Traitement Figure IV.2
    for i, p in enumerate(doc.paragraphs):
        if "La configuration taille 300, chevauchement 30 est retenue" in p.text:
            # Insérer la figure juste avant ce paragraphe récapitulatif
            p_img = p.insert_paragraph_before()
            p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
            run = p_img.add_run()
            run.add_picture("Memoire/figures/fig_chunking.png", width=Inches(6.2))
            
            p_cap = p.insert_paragraph_before()
            p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
            r_cap = p_cap.add_run("Figure IV.2 : Évaluation empirique de la calibration du chunking (Taille / Chevauchement)")
            r_cap.font.name = "Calibri"
            r_cap.font.size = Pt(9.5)
            r_cap.font.italic = True
            r_cap.font.color.rgb = RGBColor(0x00, 0x33, 0x66)
            print("[OK] Figure IV.2 insérée avec succès.")
            break

    # Traitement Figure III.1
    for i, p in enumerate(doc.paragraphs):
        if "III.3.3. Structuration du corpus pour l'indexation" in p.text:
            # Insérer la figure juste avant cette sous-section
            p_img = p.insert_paragraph_before()
            p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
            run = p_img.add_run()
            run.add_picture("Memoire/figures/fig_corpus_distribution.png", width=Inches(6.2))
            
            p_cap = p.insert_paragraph_before()
            p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
            r_cap = p_cap.add_run("Figure III.1 : Structure et volumétrie du corpus documentaire SUNU Bank (150 chunks)")
            r_cap.font.name = "Calibri"
            r_cap.font.size = Pt(9.5)
            r_cap.font.italic = True
            r_cap.font.color.rgb = RGBColor(0x00, 0x33, 0x66)
            print("[OK] Figure III.1 insérée avec succès.")
            break

    # 2. Embellissement des encadrés et des sections réglementaires (Bordures professionnelles)
    callout_keywords = [
        "Code des Assurances CIMA",
        "Loi n° 2019-014",
        "Gouvernance et Conformité",
        "Recommandation méthodologique",
        "Article 74",
        "Article 6",
        "Fidélité documentaire",
        "Principe de précaution"
    ]

    for p in doc.paragraphs:
        # Style des titres de niveau figure
        if p.text.strip().startswith("Figure ") or p.text.strip().startswith("Tableau "):
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            for r in p.runs:
                r.font.name = "Calibri"
                r.font.size = Pt(9.5)
                r.font.italic = True
                r.font.color.rgb = RGBColor(0x00, 0x33, 0x66)

        # Style des citations et encadrés réglementaires
        if any(kw in p.text for kw in ["Article 74 CIMA", "Article 6 du Code CIMA", "Loi n° 2019-014"]) and len(p.text) < 400:
            if not p.text.startswith("Figure") and not p.text.startswith("Tableau"):
                add_callout_styling(p, border_color="E21E26", bg_color="FFF5F5")

    # 3. Embellissement des Tableaux (Bordures soignées & En-têtes SUNU Navy)
    for table in doc.tables:
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        for r_idx, row in enumerate(table.rows):
            for cell in row.cells:
                if r_idx == 0:
                    # En-tête de tableau
                    tcPr = cell._tc.get_or_add_tcPr()
                    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="003366"/>')
                    tcPr.append(shd)
                    set_cell_border(cell, top="single", bottom="double", color="003366", bottom_sz="12")
                    for p in cell.paragraphs:
                        for r in p.runs:
                            r.font.name = "Calibri"
                            r.font.size = Pt(9.5)
                            r.font.bold = True
                            r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
                else:
                    # Lignes de données
                    bg = "F8FAFC" if r_idx % 2 == 1 else "FFFFFF"
                    tcPr = cell._tc.get_or_add_tcPr()
                    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{bg}"/>')
                    tcPr.append(shd)
                    set_cell_border(cell, bottom="single", color="E2E8F0", bottom_sz="4")
                    for p in cell.paragraphs:
                        for r in p.runs:
                            r.font.name = "Calibri"
                            r.font.size = Pt(9)

    doc.save(DOC_PATH)
    print(f"[OK] Document finalisé et sauvegardé avec succès dans : {DOC_PATH}")

if __name__ == "__main__":
    print("=== DÉBUT DU TRAITEMENT ET PERFECTIONNEMENT DU DOCUMENT WORD ===")
    update_document_media()
    polish_and_insert_missing_figures()
    print("=== TRAITEMENT TERMINÉ AVEC SUCCÈS ===")
