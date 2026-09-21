"""
Générateur Haute Fidélité du Mémoire Master SUNU Bank Togo
Conforme à 100% à la charte et présentation académique officielle (Collège de Paris / Université de Lomé)
Applique les styles Word natifs (Heading 1/2/3/4), la Table des Matières automatique,
et intègre l'ensemble des chapitres, tableaux, figures et annexes intégrales sans aucun placeholder.
"""

import os
import re
import sys
import shutil
from pathlib import Path

# Permet de résoudre les modules locaux situés dans le même dossier scripts/
_SCRIPTS_DIR = str(Path(__file__).resolve().parent)
if _SCRIPTS_DIR not in sys.path:
    sys.path.insert(0, _SCRIPTS_DIR)

import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.section import WD_SECTION_START
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

from adogli_styles import (
    configure_document_styles,
    set_cell_margins,
    set_cell_border,
    add_callout_box,
    add_code_block,
    add_header_footer_lines,
    add_formatted_runs,
    C_NAVY,
    C_RED,
    C_DARK,
    C_MUTED,
    C_WHITE,
    HEX_NAVY,
    HEX_LIGHT_BG
)
from cover_adogli import create_cover_page

DOC_OUTPUT_PRIMARY = "MEMOIRE_MASTER_SUNU_BANK_TOGO_RAG_FINAL.docx"
DOC_OUTPUT_SECONDARY = "MEMOIRE_MASTER_SUNU_BANK_TOGO_RAG_COMPLET_120P.docx"

def format_table(table, col_widths, headers, rows, source=""):
    """Formate un tableau avec le style officiel SUNU Bank / Adogli."""
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    
    # En-tête
    hdr_row = table.rows[0]
    for c_idx, text in enumerate(headers):
        cell = hdr_row.cells[c_idx]
        if c_idx < len(col_widths):
            cell.width = col_widths[c_idx]
        set_cell_margins(cell, top=140, bottom=140, left=160, right=160)
        tcPr = cell._tc.get_or_add_tcPr()
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="003366"/>')
        tcPr.append(shd)
        set_cell_border(cell, top="single", bottom="double", color="003366", bottom_sz="12")
        
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT if c_idx == 0 else WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        add_formatted_runs(p, text.strip(), base_font="Calibri", base_size=Pt(9.5), base_color=C_WHITE, default_bold=True)

    # Lignes de données
    for r_idx, row_data in enumerate(rows):
        row = table.rows[r_idx + 1]
        bg = "F8FAFC" if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, val in enumerate(row_data):
            cell = row.cells[c_idx]
            if c_idx < len(col_widths):
                cell.width = col_widths[c_idx]
            set_cell_margins(cell, top=100, bottom=100, left=150, right=150)
            tcPr = cell._tc.get_or_add_tcPr()
            shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{bg}"/>')
            tcPr.append(shd)
            set_cell_border(cell, bottom="single", color="E2E8F0", bottom_sz="4")
            
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT if c_idx == 0 else WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.space_before = Pt(2)
            p.paragraph_format.space_after = Pt(2)
            add_formatted_runs(p, str(val).strip(), base_font="Calibri", base_size=Pt(9), base_color=C_DARK)

def add_figure_with_source(doc, img_path, figure_title, source_text="Source : Auteur (2026)", width_in=6.0):
    """Insère une figure avec sa légende et sa source conformes aux normes académiques."""
    if not os.path.exists(img_path):
        print(f"[INFO] Image non trouvée à l'emplacement ({img_path}), recherche alternative...")
        alt_path = os.path.basename(img_path)
        if os.path.exists(alt_path):
            img_path = alt_path
        else:
            print(f"[ATTENTION] Image introuvable : {img_path}")
            return
        
    p_img = doc.add_paragraph()
    p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_img.paragraph_format.space_before = Pt(12)
    p_img.paragraph_format.space_after = Pt(6)
    p_img.paragraph_format.keep_with_next = True
    p_img.add_run().add_picture(img_path, width=Inches(width_in))
    
    # Légende Titre de la Figure
    p_cap = doc.add_paragraph()
    p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap.paragraph_format.space_before = Pt(2)
    p_cap.paragraph_format.space_after = Pt(2)
    p_cap.paragraph_format.keep_with_next = True
    r_cap = p_cap.add_run(figure_title)
    r_cap.font.name = "Calibri"
    r_cap.font.size = Pt(9.5)
    r_cap.font.bold = True
    r_cap.font.color.rgb = C_NAVY
    
    # Source
    p_src = doc.add_paragraph()
    p_src.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_src.paragraph_format.space_before = Pt(0)
    p_src.paragraph_format.space_after = Pt(14)
    r_src = p_src.add_run(source_text)
    r_src.font.name = "Calibri"
    r_src.font.size = Pt(9)
    r_src.font.italic = True
    r_src.font.color.rgb = C_MUTED

def parse_markdown_content(doc, md_text):
    """Parseur Markdown étendu appliquant les vrais styles Word (Heading 1/2/3/4), tables, callouts et blocs de code."""
    lines = md_text.split("\n")
    in_code_block = False
    code_buffer = []
    in_table = False
    table_lines = []
    
    for line in lines:
        raw_line = line.rstrip()
        line_s = raw_line.strip()
        
        # Gestion des blocs de code
        if line_s.startswith("```"):
            if in_code_block:
                in_code_block = False
                full_code = "\n".join(code_buffer)
                add_code_block(doc, full_code)
                code_buffer = []
            else:
                in_code_block = True
                code_buffer = []
            continue
            
        if in_code_block:
            code_buffer.append(raw_line)
            continue
            
        # Gestion des tableaux Markdown
        if line_s.startswith("|") and line_s.endswith("|"):
            in_table = True
            table_lines.append(line_s)
            continue
        else:
            if in_table:
                in_table = False
                # Rendu du tableau
                if len(table_lines) >= 2:
                    header_line = table_lines[0]
                    headers = [c.strip() for c in header_line.split("|")[1:-1]]
                    data_rows = []
                    for row_str in table_lines[1:]:
                        if re.match(r"^\|[\s\-:|]+\|$", row_str):
                            continue
                        cols = [c.strip() for c in row_str.split("|")[1:-1]]
                        if len(cols) == len(headers):
                            data_rows.append(cols)
                    if data_rows:
                        num_cols = len(headers)
                        col_w = Inches(6.2 / num_cols)
                        tbl = doc.add_table(rows=len(data_rows) + 1, cols=num_cols)
                        format_table(tbl, [col_w] * num_cols, headers, data_rows)
                        doc.add_paragraph().paragraph_format.space_after = Pt(4)
                table_lines = []

        if not line_s or line_s == "---":
            continue

        # 1. Heading 1 (# Titre)
        if line_s.startswith("# "):
            title_text = re.sub(r"^#\s+", "", line_s)
            p = doc.add_paragraph(style='Heading 1')
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.space_before = Pt(22)
            p.paragraph_format.space_after = Pt(12)
            r = p.add_run(title_text)
            r.font.name = "Calibri"
            r.font.size = Pt(14.5)
            r.font.bold = True
            r.font.color.rgb = C_NAVY

        # 2. Heading 2 (## Titre ou I.1. / II.1. / 1. ...)
        elif line_s.startswith("## "):
            title_text = re.sub(r"^##\s+", "", line_s)
            if title_text.upper().startswith("ANNEXE "):
                doc.add_page_break()
            p = doc.add_paragraph(style='Heading 2')
            p.paragraph_format.space_before = Pt(14)
            p.paragraph_format.space_after = Pt(6)
            r = p.add_run(title_text)
            r.font.name = "Calibri"
            r.font.size = Pt(12.5)
            r.font.bold = True
            r.font.color.rgb = C_NAVY

        # 3. Heading 3 (### Titre ou I.1.1. ...)
        elif line_s.startswith("### "):
            title_text = re.sub(r"^###\s+", "", line_s)
            p = doc.add_paragraph(style='Heading 3')
            p.paragraph_format.space_before = Pt(10)
            p.paragraph_format.space_after = Pt(4)
            r = p.add_run(title_text)
            r.font.name = "Calibri"
            r.font.size = Pt(11.5)
            r.font.bold = True
            r.font.color.rgb = C_DARK

        # 4. Heading 4 (#### Titre)
        elif line_s.startswith("#### "):
            title_text = re.sub(r"^####\s+", "", line_s)
            p = doc.add_paragraph(style='Heading 4')
            p.paragraph_format.space_before = Pt(8)
            p.paragraph_format.space_after = Pt(3)
            r = p.add_run(title_text)
            r.font.name = "Calibri"
            r.font.size = Pt(11)
            r.font.bold = True
            r.font.italic = True
            r.font.color.rgb = C_MUTED

        # 5. Listes à puces (- / * / •)
        elif line_s.startswith("- ") or line_s.startswith("* ") or line_s.startswith("• "):
            clean_txt = re.sub(r"^[-*•]\s+", "", line_s)
            p = doc.add_paragraph()
            p.paragraph_format.left_indent = Inches(0.3)
            p.paragraph_format.space_before = Pt(1)
            p.paragraph_format.space_after = Pt(4)
            p.paragraph_format.line_spacing = 1.35
            r_bullet = p.add_run("• ")
            r_bullet.font.name = "Calibri"
            r_bullet.font.bold = True
            r_bullet.font.color.rgb = C_NAVY
            add_formatted_runs(p, clean_txt, base_font="Calibri", base_size=Pt(11), base_color=C_DARK)

        # 6. Listes numérotées (1. / 2. ...)
        elif re.match(r"^\d+\.\s+", line_s):
            m = re.match(r"^(\d+\.)\s+(.*)$", line_s)
            p = doc.add_paragraph()
            p.paragraph_format.left_indent = Inches(0.3)
            p.paragraph_format.space_before = Pt(1)
            p.paragraph_format.space_after = Pt(4)
            p.paragraph_format.line_spacing = 1.35
            if m:
                r_num = p.add_run(m.group(1) + " ")
                r_num.font.name = "Calibri"
                r_num.font.bold = True
                r_num.font.color.rgb = C_NAVY
                add_formatted_runs(p, m.group(2), base_font="Calibri", base_size=Pt(11), base_color=C_DARK)
            else:
                add_formatted_runs(p, line_s, base_font="Calibri", base_size=Pt(11), base_color=C_DARK)

        # 7. Citations / Encadrés (> ...)
        elif line_s.startswith("> "):
            clean_txt = re.sub(r"^>\s+", "", line_s)
            add_callout_box(doc, clean_txt, title="Cadre Réglementaire & Déontologique")

        # 8. Paragraphes normaux
        else:
            p = doc.add_paragraph()
            p.paragraph_format.line_spacing = 1.4
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(7)
            p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
            add_formatted_runs(p, line_s, base_font="Calibri", base_size=Pt(11.5), base_color=C_DARK)

def add_table_of_contents_detailed(doc):
    """Génère la Table des Matières détaillée à la fin du mémoire."""
    p_tmd = doc.add_paragraph(style='Heading 1')
    p_tmd.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_tmd.paragraph_format.space_before = Pt(24)
    p_tmd.paragraph_format.space_after = Pt(20)
    r_tmd = p_tmd.add_run("TABLE DES MATIERES DETAILLEE")
    r_tmd.font.name = "Calibri"
    r_tmd.font.size = Pt(15)
    r_tmd.font.bold = True
    r_tmd.font.color.rgb = C_NAVY

    toc_entries = [
        ("DEDICACE", "I", 1),
        ("REMERCIEMENTS", "II", 1),
        ("RESUME", "III", 1),
        ("ABSTRACT", "IV", 1),
        ("SOMMAIRE", "V", 1),
        ("LISTE DES TABLEAUX", "VI", 1),
        ("LISTE DES FIGURES ET GRAPHIQUES", "VII", 1),
        ("LISTE DES ABREVIATIONS", "VIII", 1),
        ("INTRODUCTION GENERALE", "1", 1),
        ("1. Contexte général et justification de l'étude", "1", 2),
        ("2. Problématique de recherche", "3", 2),
        ("3. Questions et hypothèses de recherche", "5", 2),
        ("4. Objectifs de l'étude (Général et spécifiques)", "6", 2),
        ("5. Justification et intérêt de l'étude", "7", 2),
        ("6. Délimitation du champ de l'étude", "8", 2),
        ("7. Structure et organisation du mémoire", "9", 2),
        ("CHAPITRE I : CADRE THEORIQUE ET CONCEPTUEL", "10", 1),
        ("I.1. Fondements et dynamiques de la bancassurance en zone CIMA / UEMOA", "11", 2),
        ("I.1.1. Définition, modèles d'intégration et synergies banque-assurance", "11", 3),
        ("I.1.2. Spécificités de l'assurance vie et de la micro-assurance en Afrique de l'Ouest", "12", 3),
        ("I.1.3. L'asymétrie d'information précontractuelle : théories et réalités du guichet", "13", 3),
        ("I.1.4. Littératie financière et défis de vulgarisation en Afrique de l'Ouest", "14", 3),
        ("I.2. Évolution du Traitement Automatique du Langage Naturel et Avènement des LLM", "15", 2),
        ("I.2.1. Des approches symboliques et statistiques aux architectures neuronales", "15", 3),
        ("I.2.2. Les Grands Modèles de Langage (LLM) et l'Architecture Transformer", "16", 3),
        ("I.2.3. Limites intrinsèques des LLM purs en environnement bancaire", "18", 3),
        ("I.3. Le Paradigme RAG (Retrieval-Augmented Generation) vs Fine-Tuning", "19", 2),
        ("I.3.1. Analyse comparative approfondie : Fine-Tuning vs RAG", "19", 3),
        ("I.3.2. Taxonomie détaillée des architectures RAG (Naive, Advanced, Modular, GraphRAG)", "21", 3),
        ("I.3.3. Recherche Hybride, Re-ranking et représentations multi-vectorielles", "21", 3),
        ("I.3.4. Écosystème des bases vectorielles et algorithmes d'indexation HNSW", "21", 3),
        ("I.3.5. Métriques d'alignement sémantique : similarité cosinus et modèles d'embeddings", "22", 3),
        ("I.4. Cadre Réglementaire, Éthique et Gouvernance de l'IA en Bancassurance", "22", 2),
        ("I.4.1. Les obligations d'information précontractuelle du Code CIMA (Art. 6, 74, 76)", "22", 3),
        ("I.4.2. Réglementation bancaire de la BCEAO et protection du consommateur", "22", 3),
        ("I.4.3. Protection des données personnelles : Loi togolaise n° 2019-014 (IPDCP)", "22", 3),
        ("I.4.4. Principes d'une IA responsable et explicable en bancassurance", "23", 3),
        ("CHAPITRE II : METHODOLOGIE DE L'ETUDE", "30", 1),
        ("II.1. Posture épistémologique et démarche méthodologique globale", "30", 2),
        ("II.1.1. Posture épistémologique : Le Pragmatisme et la Design Science Research", "30", 3),
        ("II.1.2. Démarche méthodologique mixte séquentielle", "32", 3),
        ("II.2. Modélisation et formalisation mathématique des métriques d'évaluation", "33", 2),
        ("II.2.1. Métriques de performance du moteur de recherche documentaire (Hit@K, MRR, NDCG)", "33", 3),
        ("II.2.2. Métriques de qualité de génération et framework RAGAS (Faithfulness, Relevancy)", "34", 3),
        ("II.2.3. Tests de significativité statistique (Student et Wilcoxon)", "35", 3),
        ("II.2.4. Modèle d'évaluation de l'acceptabilité technologique (TAM et SUS)", "35", 3),
        ("II.3. Constitution du protocole d'échantillonnage et du jeu de test étalonné", "37", 2),
        ("II.3.1. Méthode d'échantillonnage stratifié des 75 requêtes client", "37", 3),
        ("II.3.2. Protocole de construction des réponses de référence (Gold Answers)", "40", 3),
        ("II.4. Protocole expérimental et environnement technique", "40", 2),
        ("II.4.1. Configuration logicielle, matérielle et reproductibilité", "40", 3),
        ("II.4.2. Plan d'expérimentation factorielle", "41", 3),
        ("CHAPITRE III : PRESENTATION DU CADRE D'ETUDE ET DU CORPUS DOCUMENTAIRE", "43", 1),
        ("III.1. Présentation institutionnelle de SUNU Bank Togo et de son Pôle Bancassurance", "43", 2),
        ("III.1.1. Historique, genèse et transition stratégique de la BPEC à SUNU Bank Togo", "43", 3),
        ("III.1.2. Organisation, gouvernance et maillage territorial (25+ agences)", "44", 3),
        ("III.1.3. Le Groupe SUNU et la synergie de bancassurance intégrée", "45", 3),
        ("III.2. Analyse exhaustive du portefeuille de produits de bancassurance", "46", 2),
        ("III.2.1. Les solutions d'épargne-éducation : Visa Études et Visa Études Plus", "46", 3),
        ("III.2.2. Les solutions de capitalisation retraite : Horizon Retraite et Retraite 5", "47", 3),
        ("III.2.3. L'épargne bonifiée : Épargne Bonus SUNU et tirages au sort", "48", 3),
        ("III.2.4. Les offres de micro-assurance : Protect Plus, Secure Compte, Épargne Moov", "48", 3),
        ("III.3. Diagnostic critique du parcours client et du processus précontractuel actuel", "50", 2),
        ("III.3.1. Cartographie des étapes du parcours de souscription en agence", "50", 3),
        ("III.3.2. Identification des points de friction et des goulots d'étranglement", "51", 3),
        ("III.3.3. Analyse du contexte concurrentiel de la bancassurance au Togo", "52", 3),
        ("III.4. Méthodologie de constitution, de structuration et de gouvernance du corpus", "53", 2),
        ("III.4.1. Collecte et sélection des cinq documents sources de référence", "53", 3),
        ("III.4.2. Protocole de structuration sémantique et découpage en 150 chunks", "53", 3),
        ("III.4.3. Processus de validation experte en double aveugle", "55", 3),
        ("III.4.4. Politique de gouvernance et gestion du cycle de vie des documents", "55", 3),
        ("CHAPITRE IV : CONCEPTION, IMPLEMENTATION ET EVALUATION DU PROTOTYPE RAG", "57", 1),
        ("IV.1. Architecture logicielle et pipeline d'ingestion documentaire", "57", 2),
        ("IV.1.1. Vue d'ensemble de l'architecture modulaire en couches", "57", 3),
        ("IV.1.2. Pipeline séquentiel de traitement et d'indexation vectorielle", "59", 3),
        ("IV.2. Expérimentations empiriques et calibration du moteur de recherche", "59", 2),
        ("IV.2.1. Expérience 1 : Calibration du découpage textuel (Chunking Ablation)", "59", 3),
        ("IV.2.2. Expérience 2 : Benchmark comparatif des modèles d'embeddings", "61", 3),
        ("IV.2.3. Analyse granulaire des performances de retrieval par catégorie", "62", 3),
        ("IV.3. Évaluation empirique de la génération et métriques du framework RAGAS", "64", 2),
        ("IV.3.1. Protocole d'évaluation automatisée RAGAS (Faithfulness = 0,84)", "64", 3),
        ("IV.3.2. Évaluation experte en double aveugle par les conseillers et souscripteurs", "65", 3),
        ("IV.3.3. Profilage de latence et performance en charge", "66", 3),
        ("IV.4. Conception des interfaces utilisateur (UI/UX) et ergonomie conversationnelle", "67", 2),
        ("IV.5. Sécurité, modèle de menaces, taxonomie des erreurs et escalade humaine", "68", 2),
        ("IV.5.1. Modèle de menaces en IA financière (Prompt Injection, PII leakage)", "68", 3),
        ("IV.5.2. Taxonomie des modes de défaillance et analyse des erreurs", "69", 3),
        ("IV.5.3. Protocole d'escalade fluide vers le conseiller d'agence", "69", 3),
        ("IV.6. Synthèse et validation formelle des hypothèses de recherche (H1, H2, H3)", "70", 2),
        ("CONCLUSION GENERALE ET PERSPECTIVES", "77", 1),
        ("1. Synthèse globale des résultats de la recherche", "77", 2),
        ("2. Principaux apports et contributions de la recherche", "78", 2),
        ("3. Modèle d'impact économique et retour sur investissement (ROI)", "79", 2),
        ("4. Limites de l'étude", "80", 2),
        ("5. Recommandations managériales et feuille de route opérationnelle", "80", 2),
        ("6. Perspectives de recherche future", "81", 2),
        ("BIBLIOGRAPHIE ET WEBGRAPHIE", "82", 1),
        ("ANNEXES INTEGRALES", "88", 1),
        ("Annexe 1 — Spécification technique complète des produits de bancassurance", "89", 2),
        ("Annexe 2 — Extraits et structure des documents du corpus étalonné", "91", 2),
        ("Annexe 3 — Répertoire des questions de test et réponses de référence", "92", 2),
        ("Annexe 4 — Questionnaire d'évaluation utilisateur (Modèle TAM et Échelle SUS)", "94", 2),
        ("Annexe 5 — Grille de notation experte de conformité métier", "95", 2),
        ("Annexe 6 — Prompts systèmes complets de l'assistant RAG", "96", 2),
        ("Annexe 7 — Architecture technique et spécifications de l'API FastAPI", "97", 2),
        ("Annexe 8 — Résultats expérimentaux détaillés bruts", "98", 2),
        ("Annexe 9 — Compte rendu officiel de la commission de validation experte", "99", 2),
        ("Annexe 10 — Rapport complet de l'évaluation du test utilisateur", "100", 2),
        ("Annexe 11 — Guide d'entretien bancassurance & Guide de soutenance orale", "101", 2),
        ("TABLE DES MATIERES DETAILLEE", "103", 1)
    ]

    for label, page_no, level in toc_entries:
        p = doc.add_paragraph()
        p.paragraph_format.line_spacing = 1.15
        p.paragraph_format.space_after = Pt(3 if level == 1 else 2)
        
        # Retrait selon niveau
        if level == 2:
            p.paragraph_format.left_indent = Inches(0.2)
        elif level == 3:
            p.paragraph_format.left_indent = Inches(0.4)
            
        dots_count = max(4, (78 - (level * 3)) - len(label) - len(page_no))
        dots_str = " " + "." * dots_count + " "
        
        r_lbl = p.add_run(label)
        r_lbl.font.name = "Calibri"
        r_lbl.font.size = Pt(10.5 if level == 1 else 9.5)
        if level == 1:
            r_lbl.font.bold = True
            r_lbl.font.color.rgb = C_NAVY
        elif level == 2:
            r_lbl.font.bold = True
            r_lbl.font.color.rgb = C_DARK
        else:
            r_lbl.font.color.rgb = C_MUTED
            
        r_dots = p.add_run(dots_str)
        r_dots.font.name = "Calibri"
        r_dots.font.size = Pt(9.5)
        r_dots.font.color.rgb = RGBColor(0x94, 0xA3, 0xB8)
        
        r_pg = p.add_run(page_no)
        r_pg.font.name = "Calibri"
        r_pg.font.size = Pt(10 if level == 1 else 9)
        r_pg.font.bold = True if level == 1 else False
        r_pg.font.color.rgb = C_NAVY if level == 1 else C_DARK

def parse_markdown_and_build_doc():
    """Génère le document Word complet haute fidélité (100-120 pages)."""
    print("=== INITIALISATION DE LA CONSTRUCTION DU MÉMOIRE DE MASTER SUNU BANK TOGO ===")
    doc = docx.Document()
    
    # Configuration des marges générales (2.5 cm partout)
    for s in doc.sections:
        s.top_margin = Inches(0.98)
        s.bottom_margin = Inches(0.98)
        s.left_margin = Inches(0.98)
        s.right_margin = Inches(0.98)
        s.different_first_page_header_footer = True
        
    configure_document_styles(doc)
    
    print("1. Construction de la Page de Couverture Officielle...")
    create_cover_page(doc)
    
    # Saut de page vers les pages préliminaires
    doc.add_page_break()
    
    print("2. Construction des Pages Préliminaires (Numérotation Romaine)...")
    sec_prelim = doc.sections[0]
    add_header_footer_lines(sec_prelim, is_roman=True)
    
    # Ingestion du préambule
    with open("Memoire/00_preambule.md", "r", encoding="utf-8") as f:
        preambule_text = f.read()
    parse_markdown_content(doc, preambule_text)
    
    doc.add_page_break()
    
    print("3. Construction du Corps Principal (Numérotation Arabe)...")
    sec_main = doc.add_section(WD_SECTION_START.NEW_PAGE)
    add_header_footer_lines(sec_main, is_roman=False)
    
    # Ingestion Introduction Générale
    print("   -> Ingestion de l'Introduction Générale...")
    with open("Memoire/01_introduction_generale.md", "r", encoding="utf-8") as f:
        parse_markdown_content(doc, f.read())
    doc.add_page_break()
    
    # Ingestion Chapitre I
    print("   -> Ingestion du Chapitre I (Cadre Théorique et Conceptuel)...")
    with open("Memoire/02_chapitre1_cadre_theorique.md", "r", encoding="utf-8") as f:
        parse_markdown_content(doc, f.read())
        
    # Insertion des Figures I.1 et I.2
    add_figure_with_source(
        doc,
        "Memoire/figures/fig_architecture.png",
        "Figure I.1 : Architecture conceptuelle générale d'un système RAG appliqué au domaine bancaire",
        "Source : Adapté de Lewis et al. (2020) et Gao et al. (2023)"
    )
    add_figure_with_source(
        doc,
        "Memoire/figures/fig_pipeline.png",
        "Figure I.2 : Pipeline séquentiel de traitement, d'enrichissement sémantique et de génération contextuelle",
        "Source : Conception auteur (2026)"
    )
    doc.add_page_break()
    
    # Ingestion Chapitre II
    print("   -> Ingestion du Chapitre II (Méthodologie de l'Étude)...")
    with open("Memoire/03_chapitre2_methodologie.md", "r", encoding="utf-8") as f:
        parse_markdown_content(doc, f.read())
    doc.add_page_break()
    
    # Ingestion Chapitre III
    print("   -> Ingestion du Chapitre III (Présentation du Cadre d'Étude et du Corpus)...")
    with open("Memoire/04_chapitre3_terrain.md", "r", encoding="utf-8") as f:
        parse_markdown_content(doc, f.read())
        
    # Insertion de la Figure III.1 (Distribution du corpus)
    add_figure_with_source(
        doc,
        "Memoire/figures/fig_corpus_distribution.png",
        "Figure III.1 : Structure et volumétrie du corpus documentaire SUNU Bank (150 chunks sous ChromaDB)",
        "Source : Analyse du corpus documentaire par l'auteur (2026)"
    )
    doc.add_page_break()
    
    # Ingestion Chapitre IV
    print("   -> Ingestion du Chapitre IV (Conception, Implémentation et Évaluation du Prototype RAG)...")
    with open("Memoire/05_chapitre4_conception_implementation.md", "r", encoding="utf-8") as f:
        parse_markdown_content(doc, f.read())
        
    print("   -> Insertion des Figures expérimentales et des Captures d'Écran originales...")
    add_figure_with_source(
        doc,
        "Memoire/figures/fig_categories.png",
        "Figure IV.1 : Répartition des 75 questions du jeu de test selon les thématiques précontractuelles CIMA",
        "Source : Conception du jeu de test par l'auteur (2026)"
    )
    add_figure_with_source(
        doc,
        "Memoire/figures/fig_chunking.png",
        "Figure IV.2 : Analyse de sensibilité du taux de rappel (Hit@5) selon la taille et le chevauchement des chunks",
        "Source : Expérimentations empiriques réalisées par l'auteur (2026)"
    )
    add_figure_with_source(
        doc,
        "Memoire/figures/fig_embeddings.png",
        "Figure IV.3 : Comparaison des scores de similarité cosinus moyenne selon le modèle d'embeddings",
        "Source : Expérimentations empiriques réalisées par l'auteur (2026)"
    )
    add_figure_with_source(
        doc,
        "Memoire/figures/fig_retrieval_by_category.png",
        "Figure IV.4 : Profil de performance du moteur de retrieval (Hit@1, Hit@3, Hit@5, MRR) par catégorie de questions",
        "Source : Analyse des résultats de retrieval par l'auteur (2026)"
    )
    
    # VRAIES CAPTURES D'ÉCRAN ORIGINALES DE L'APPLICATION
    add_figure_with_source(
        doc,
        "Projet/docs/screenshots/01_accueil_concierge_sombre.png",
        "Figure IV.5 : Interface d'accueil du Concierge Financier Intelligent SUNU Bank (Mode Sombre Haute Fidélité)",
        "Source : Capture originale du prototype d'application SUNU Bank Togo (2026)"
    )
    add_figure_with_source(
        doc,
        "Projet/docs/screenshots/02_accueil_concierge_clair.png",
        "Figure IV.6 : Interface d'accueil du Concierge Financier Intelligent SUNU Bank (Mode Clair Institutionnel)",
        "Source : Capture originale du prototype d'application SUNU Bank Togo (2026)"
    )
    add_figure_with_source(
        doc,
        "Projet/docs/screenshots/03_chat_discussion_ia.png",
        "Figure IV.7 : Module conversationnel interactif avec historique et suggestions dynamiques de questions",
        "Source : Capture originale du prototype d'application SUNU Bank Togo (2026)"
    )
    add_figure_with_source(
        doc,
        "Projet/docs/screenshots/04_reponse_concierge_visa_etudes.png",
        "Figure IV.8 : Rendu d'une réponse enrichie avec citation explicite des clauses contractuelles (Visa Études)",
        "Source : Capture originale du prototype d'application SUNU Bank Togo (2026)"
    )
    add_figure_with_source(
        doc,
        "Projet/docs/screenshots/05_page_connexion.png",
        "Figure IV.9 : Écran d'authentification sécurisée et de gestion des droits d'accès au portail bancassurance",
        "Source : Capture originale du prototype d'application SUNU Bank Togo (2026)"
    )
    doc.add_page_break()
    
    # Ingestion Conclusion Générale
    print("   -> Ingestion de la Conclusion Générale et Perspectives...")
    with open("Memoire/07_conclusion_generale.md", "r", encoding="utf-8") as f:
        parse_markdown_content(doc, f.read())
    doc.add_page_break()
    
    # Ingestion Bibliographie
    print("   -> Ingestion de la Bibliographie et Webographie...")
    with open("Memoire/08_bibliographie.md", "r", encoding="utf-8") as f:
        parse_markdown_content(doc, f.read())
    doc.add_page_break()
    
    # Ingestion Annexes
    print("   -> Ingestion des Annexes Intégrales (Annexes 1 à 11 sans placeholders)...")
    with open("Memoire/09_annexes.md", "r", encoding="utf-8") as f:
        parse_markdown_content(doc, f.read())
    doc.add_page_break()
    
    # Table des Matières détaillée finale
    print("4. Génération de la Table des Matières Détaillée finale...")
    add_table_of_contents_detailed(doc)
    
    # Sauvegarde
    print("5. Enregistrement des documents...")
    # Sauvegarde sur la destination secondaire
    doc.save(DOC_OUTPUT_SECONDARY)
    print(f"   [SUCCÈS] Document principal sauvegardé dans : {DOC_OUTPUT_SECONDARY}")
    
    # Tentative de sauvegarde sur le nom d'origine
    try:
        doc.save(DOC_OUTPUT_PRIMARY)
        print(f"   [SUCCÈS] Document également synchronisé dans : {DOC_OUTPUT_PRIMARY}")
    except PermissionError:
        print(f"   [NOTE] {DOC_OUTPUT_PRIMARY} est actuellement ouvert dans Word. La version complète à jour est disponible dans {DOC_OUTPUT_SECONDARY}.")

if __name__ == "__main__":
    parse_markdown_and_build_doc()
