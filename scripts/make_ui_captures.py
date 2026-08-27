"""
Script de génération des captures d'écran UI ultra-réalistes et professionnelles en Français
pour le Mémoire de Master SUNU Bank Togo.
Génère 5 interfaces haute résolution (300 DPI) au design moderne (Tailwind-like/Glassmorphism).
"""

import matplotlib.pyplot as plt
import matplotlib.patches as patches
import matplotlib.patheffects as pe
from PIL import Image, ImageDraw, ImageFont
import os

os.makedirs('Memoire/figures', exist_ok=True)

# Couleurs de la charte graphique SUNU Bank Togo
C_SUNU_RED = "#E21E26"
C_SUNU_NAVY = "#003366"
C_DARK_BG = "#0B1120"
C_DARK_CARD = "#1E293B"
C_DARK_BORDER = "#334155"
C_LIGHT_BG = "#F8FAFC"
C_LIGHT_CARD = "#FFFFFF"
C_LIGHT_BORDER = "#E2E8F0"
C_TEXT_LIGHT = "#F1F5F9"
C_TEXT_MUTED = "#94A3B8"
C_TEXT_DARK = "#0F172A"
C_TEXT_DARK_MUTED = "#64748B"
C_ACCENT_TEAL = "#0D9488"
C_ACCENT_AMBER = "#D97706"

def render_home_dark():
    """Figure IV.5 : Accueil Concierge Financier SUNU Bank (Mode Sombre)"""
    fig, ax = plt.subplots(figsize=(14, 8.5), dpi=300)
    fig.patch.set_facecolor(C_DARK_BG)
    ax.set_facecolor(C_DARK_BG)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    # Top Navbar
    nav = patches.Rectangle((0, 90), 100, 10, facecolor=C_DARK_CARD, edgecolor=C_DARK_BORDER, linewidth=1.2)
    ax.add_patch(nav)
    
    # Logo & Brand
    logo_sq = patches.FancyBboxPatch((2, 91.8), 3.2, 6.4, boxstyle="round,pad=0.3", facecolor=C_SUNU_RED, edgecolor="none")
    ax.add_patch(logo_sq)
    ax.text(3.6, 95, "SB", color="white", fontsize=12, fontweight='bold', ha='center', va='center')
    ax.text(6.5, 96.2, "SUNU BANK TOGO", color="white", fontsize=11, fontweight='bold', va='center')
    ax.text(6.5, 93.2, "Concierge Financier IA • Portail Bancassurance", color=C_TEXT_MUTED, fontsize=8, va='center')

    # Navigation tabs (centered)
    tabs = ["Accueil", "Discussion IA", "Souscription CIMA", "Conformité"]
    tab_x = 34
    for i, t in enumerate(tabs):
        active = (i == 0)
        col = "white" if active else C_TEXT_MUTED
        ax.text(tab_x + i*13, 95, t, color=col, fontsize=9.5, fontweight='bold' if active else 'normal', va='center')
        if active:
            ax.plot([tab_x - 0.5, tab_x + 7.5], [91.5, 91.5], color=C_SUNU_RED, lw=2.5)

    # Status Pill / User Profile (placed neatly on the far right)
    user_pill = patches.FancyBboxPatch((85.5, 92), 12.5, 5.8, boxstyle="round,pad=0.4", facecolor="#0F172A", edgecolor=C_DARK_BORDER)
    ax.add_patch(user_pill)
    ax.text(91.75, 94.9, "Conseiller Lomé 01", color=C_TEXT_LIGHT, fontsize=8, ha='center', va='center', fontweight='bold')

    # Hero Banner
    hero_box = patches.FancyBboxPatch((8, 64), 84, 22, boxstyle="round,pad=1.5", facecolor=C_DARK_CARD, edgecolor=C_DARK_BORDER, linewidth=1.5)
    ax.add_patch(hero_box)
    
    # Tag
    tag = patches.FancyBboxPatch((11, 78.5), 18, 4.5, boxstyle="round,pad=0.4", facecolor=(0.886, 0.118, 0.149, 0.15), edgecolor=C_SUNU_RED, linewidth=1)
    ax.add_patch(tag)
    ax.text(20, 80.75, "RAG MULTILINGUE CERTIFIÉ", color=C_SUNU_RED, fontsize=8, fontweight='bold', ha='center', va='center')

    ax.text(11, 74.5, "Bonjour ! Je suis votre Concierge Bancassurance SUNU Bank", color="white", fontsize=15, fontweight='bold')
    ax.text(11, 70, "Assistant d'aide à la décision et d'information précontractuelle en temps réel.", color=C_TEXT_MUTED, fontsize=10.5)
    ax.text(11, 66.5, "Posez vos questions sur nos solutions d'assurance vie, les garanties CIMA, ou la fiscalité UEMOA.", color=C_TEXT_MUTED, fontsize=9.5)

    # Product Cards (3 products)
    products = [
        ("Visa Études", "Épargne éducation & prévoyance parentale garantie.", "Taux revalorisation 3.5% • Déduction fiscale", C_SUNU_RED),
        ("Visa Études Plus", "Couverture premium avec rente éducation trimestrielle.", "Capital jusqu'à 20M FCFA • Rente d'appoint", C_ACCENT_TEAL),
        ("Horizon Retraite", "Constitution d'un capital retraite complémentaire.", "Rente viagère ou capital • Exonération après 5 ans", C_ACCENT_AMBER)
    ]

    for idx, (title, desc, details, pcol) in enumerate(products):
        cx = 8 + idx * 29.3
        pbox = patches.FancyBboxPatch((cx, 28), 26, 32, boxstyle="round,pad=1.2", facecolor=C_DARK_CARD, edgecolor=C_DARK_BORDER, linewidth=1.2)
        ax.add_patch(pbox)
        
        # Color bar top
        ax.add_patch(patches.Rectangle((cx, 58.5), 26, 1.5, facecolor=pcol, edgecolor="none"))
        
        ax.text(cx + 2, 54, title, color="white", fontsize=12, fontweight='bold')
        ax.text(cx + 2, 47, desc, color=C_TEXT_MUTED, fontsize=8.5, wrap=True)
        
        # Pill badge
        badge = patches.FancyBboxPatch((cx + 2, 38), 22, 5, boxstyle="round,pad=0.3", facecolor="#0F172A", edgecolor=C_DARK_BORDER)
        ax.add_patch(badge)
        ax.text(cx + 13, 40.5, details, color=pcol, fontsize=7.5, ha='center', va='center', fontweight='bold')

        # Action btn
        btn = patches.FancyBboxPatch((cx + 2, 30.5), 22, 5.5, boxstyle="round,pad=0.4", facecolor=pcol, edgecolor="none")
        ax.add_patch(btn)
        ax.text(cx + 13, 33.25, "Consulter & Simuler →", color="white", fontsize=8.5, fontweight='bold', ha='center', va='center')

    # Bottom Quick Prompts
    ax.text(8, 22, "Suggestions d'interrogations rapides :", color="white", fontsize=10, fontweight='bold')
    
    prompts = [
        "« Quel est le montant minimum de cotisation pour Visa Études ? »",
        "« Que prévoit l'Article 74 CIMA en cas de rachat après 2 ans ? »",
        "« Comment s'articule la clause bénéficiaire d'Horizon Retraite ? »"
    ]
    
    for i, p in enumerate(prompts):
        px = 8 + i * 29.3
        pbtn = patches.FancyBboxPatch((px, 8), 26, 11, boxstyle="round,pad=0.8", facecolor="#0F172A", edgecolor=C_DARK_BORDER, linewidth=1)
        ax.add_patch(pbtn)
        ax.text(px + 13, 13.5, p, color=C_TEXT_LIGHT, fontsize=7.8, ha='center', va='center', wrap=True)

    # Footer note
    ax.text(50, 3, "Plateforme SUNU Bank Togo • Conforme Code des Assurances CIMA & Réglementation IPDCP Togo", 
            color=C_TEXT_MUTED, fontsize=8, ha='center')

    plt.tight_layout()
    plt.savefig("Memoire/figures/fig_ui_home_dark.png", dpi=300, facecolor=C_DARK_BG)
    plt.close()
    print("[OK] fig_ui_home_dark.png généré.")

def render_home_light():
    """Figure IV.6 : Accueil Concierge Financier (Mode Clair)"""
    fig, ax = plt.subplots(figsize=(14, 8.5), dpi=300)
    fig.patch.set_facecolor(C_LIGHT_BG)
    ax.set_facecolor(C_LIGHT_BG)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    # Top Navbar
    nav = patches.Rectangle((0, 90), 100, 10, facecolor=C_LIGHT_CARD, edgecolor=C_LIGHT_BORDER, linewidth=1.2)
    ax.add_patch(nav)
    
    # Logo & Brand
    logo_sq = patches.FancyBboxPatch((2, 91.8), 3.2, 6.4, boxstyle="round,pad=0.3", facecolor=C_SUNU_RED, edgecolor="none")
    ax.add_patch(logo_sq)
    ax.text(3.6, 95, "SB", color="white", fontsize=12, fontweight='bold', ha='center', va='center')
    ax.text(6.5, 96.2, "SUNU BANK TOGO", color=C_SUNU_NAVY, fontsize=11, fontweight='bold', va='center')
    ax.text(6.5, 93.2, "Concierge Financier IA • Portail Bancassurance", color=C_TEXT_DARK_MUTED, fontsize=8, va='center')

    # Navigation tabs (centered)
    tabs = ["Accueil", "Discussion IA", "Souscription CIMA", "Conformité"]
    tab_x = 34
    for i, t in enumerate(tabs):
        active = (i == 0)
        col = C_SUNU_NAVY if active else C_TEXT_DARK_MUTED
        ax.text(tab_x + i*13, 95, t, color=col, fontsize=9.5, fontweight='bold' if active else 'normal', va='center')
        if active:
            ax.plot([tab_x - 0.5, tab_x + 7.5], [91.5, 91.5], color=C_SUNU_RED, lw=2.5)

    # Status Pill / User Profile
    user_pill = patches.FancyBboxPatch((85.5, 92), 12.5, 5.8, boxstyle="round,pad=0.4", facecolor="#F1F5F9", edgecolor=C_LIGHT_BORDER)
    ax.add_patch(user_pill)
    ax.text(91.75, 94.9, "Conseiller Lomé 01", color=C_SUNU_NAVY, fontsize=8, ha='center', va='center', fontweight='bold')

    # Hero Banner
    hero_box = patches.FancyBboxPatch((8, 64), 84, 22, boxstyle="round,pad=1.5", facecolor=C_LIGHT_CARD, edgecolor=C_LIGHT_BORDER, linewidth=1.5)
    ax.add_patch(hero_box)
    
    # Tag
    tag = patches.FancyBboxPatch((11, 78.5), 18, 4.5, boxstyle="round,pad=0.4", facecolor="#FEE2E2", edgecolor=C_SUNU_RED, linewidth=1)
    ax.add_patch(tag)
    ax.text(20, 80.75, "RAG MULTILINGUE CERTIFIÉ", color=C_SUNU_RED, fontsize=8, fontweight='bold', ha='center', va='center')

    ax.text(11, 74.5, "Bonjour ! Je suis votre Concierge Bancassurance SUNU Bank", color=C_SUNU_NAVY, fontsize=15, fontweight='bold')
    ax.text(11, 70, "Assistant d'aide à la décision et d'information précontractuelle en temps réel.", color=C_TEXT_DARK_MUTED, fontsize=10.5)
    ax.text(11, 66.5, "Posez vos questions sur nos solutions d'assurance vie, les garanties CIMA, ou la fiscalité UEMOA.", color=C_TEXT_DARK_MUTED, fontsize=9.5)

    # Product Cards (3 products)
    products = [
        ("Visa Études", "Épargne éducation & prévoyance parentale garantie.", "Taux revalorisation 3.5% • Déduction fiscale", C_SUNU_RED),
        ("Visa Études Plus", "Couverture premium avec rente éducation trimestrielle.", "Capital jusqu'à 20M FCFA • Rente d'appoint", C_ACCENT_TEAL),
        ("Horizon Retraite", "Constitution d'un capital retraite complémentaire.", "Rente viagère ou capital • Exonération après 5 ans", C_ACCENT_AMBER)
    ]

    for idx, (title, desc, details, pcol) in enumerate(products):
        cx = 8 + idx * 29.3
        pbox = patches.FancyBboxPatch((cx, 28), 26, 32, boxstyle="round,pad=1.2", facecolor=C_LIGHT_CARD, edgecolor=C_LIGHT_BORDER, linewidth=1.2)
        ax.add_patch(pbox)
        
        # Color bar top
        ax.add_patch(patches.Rectangle((cx, 58.5), 26, 1.5, facecolor=pcol, edgecolor="none"))
        
        ax.text(cx + 2, 54, title, color=C_SUNU_NAVY, fontsize=12, fontweight='bold')
        ax.text(cx + 2, 47, desc, color=C_TEXT_DARK_MUTED, fontsize=8.5, wrap=True)
        
        # Pill badge
        badge = patches.FancyBboxPatch((cx + 2, 38), 22, 5, boxstyle="round,pad=0.3", facecolor="#F8FAFC", edgecolor=C_LIGHT_BORDER)
        ax.add_patch(badge)
        ax.text(cx + 13, 40.5, details, color=pcol, fontsize=7.5, ha='center', va='center', fontweight='bold')

        # Action btn
        btn = patches.FancyBboxPatch((cx + 2, 30.5), 22, 5.5, boxstyle="round,pad=0.4", facecolor=pcol, edgecolor="none")
        ax.add_patch(btn)
        ax.text(cx + 13, 33.25, "Consulter & Simuler →", color="white", fontsize=8.5, fontweight='bold', ha='center', va='center')

    # Bottom Quick Prompts
    ax.text(8, 22, "Suggestions d'interrogations rapides :", color=C_SUNU_NAVY, fontsize=10, fontweight='bold')
    
    prompts = [
        "« Quel est le montant minimum de cotisation pour Visa Études ? »",
        "« Que prévoit l'Article 74 CIMA en cas de rachat après 2 ans ? »",
        "« Comment s'articule la clause bénéficiaire d'Horizon Retraite ? »"
    ]
    
    for i, p in enumerate(prompts):
        px = 8 + i * 29.3
        pbtn = patches.FancyBboxPatch((px, 8), 26, 11, boxstyle="round,pad=0.8", facecolor=C_LIGHT_CARD, edgecolor=C_LIGHT_BORDER, linewidth=1)
        ax.add_patch(pbtn)
        ax.text(px + 13, 13.5, p, color=C_TEXT_DARK, fontsize=7.8, ha='center', va='center', wrap=True)

    # Footer note
    ax.text(50, 3, "Plateforme SUNU Bank Togo • Conforme Code des Assurances CIMA & Réglementation IPDCP Togo", 
            color=C_TEXT_DARK_MUTED, fontsize=8, ha='center')

    plt.tight_layout()
    plt.savefig("Memoire/figures/fig_ui_home_light.png", dpi=300, facecolor=C_LIGHT_BG)
    plt.close()
    print("[OK] fig_ui_home_light.png généré.")

def render_chat_view():
    """Figure IV.7 : Discussion IA interactive avec suggestions de requêtes rapides"""
    fig, ax = plt.subplots(figsize=(14, 8.5), dpi=300)
    fig.patch.set_facecolor(C_DARK_BG)
    ax.set_facecolor(C_DARK_BG)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    # Sidebar (Left 22%)
    side = patches.Rectangle((0, 0), 22, 100, facecolor=C_DARK_CARD, edgecolor=C_DARK_BORDER, linewidth=1)
    ax.add_patch(side)

    # Logo
    logo_sq = patches.FancyBboxPatch((2, 92), 3.5, 5.5, boxstyle="round,pad=0.3", facecolor=C_SUNU_RED, edgecolor="none")
    ax.add_patch(logo_sq)
    ax.text(3.75, 94.75, "SB", color="white", fontsize=11, fontweight='bold', ha='center', va='center')
    ax.text(6.5, 95, "SUNU BANK", color="white", fontsize=11, fontweight='bold', va='center')

    # New conversation btn
    new_btn = patches.FancyBboxPatch((2, 84), 18, 5, boxstyle="round,pad=0.4", facecolor=C_SUNU_RED, edgecolor="none")
    ax.add_patch(new_btn)
    ax.text(11, 86.5, "+ Nouvelle Session", color="white", fontsize=8.5, fontweight='bold', ha='center', va='center')

    ax.text(2, 79, "HISTORIQUE RÉCENT", color=C_TEXT_MUTED, fontsize=7.5, fontweight='bold')
    
    hist_items = [
        "Visa Études - Délais de carence",
        "Horizon Retraite - Rachat partiel",
        "Comparatif Visa Études vs Plus",
        "Fiscalité UEMOA primes assurance"
    ]
    for i, item in enumerate(hist_items):
        active = (i == 0)
        h_bg = "#0F172A" if active else "none"
        h_box = patches.FancyBboxPatch((2, 70 - i*7), 18, 5.5, boxstyle="round,pad=0.3", facecolor=h_bg, edgecolor=C_DARK_BORDER if active else "none")
        ax.add_patch(h_box)
        ax.text(3, 72.75 - i*7, "• " + item, color=C_TEXT_LIGHT if active else C_TEXT_MUTED, fontsize=7.5, va='center')

    # Main Chat Area (Right 78%)
    # Header
    chat_hdr = patches.Rectangle((22, 92), 78, 8, facecolor=C_DARK_CARD, edgecolor=C_DARK_BORDER)
    ax.add_patch(chat_hdr)
    ax.text(25, 96.5, "Discussion IA • Assistant Bancassurance", color="white", fontsize=11, fontweight='bold')
    ax.text(25, 93.8, "Modèle d'embedding : all-MiniLM-L6-v2 | Base ChromaDB (150 chunks indexés)", color=C_TEXT_MUTED, fontsize=8)

    # Chat Messages
    # User message
    user_bubble = patches.FancyBboxPatch((45, 78), 50, 10, boxstyle="round,pad=0.8", facecolor="#1E3A8A", edgecolor="#3B82F6", linewidth=1)
    ax.add_patch(user_bubble)
    ax.text(47, 84, "Client (Prospect) :", color="#93C5FD", fontsize=8, fontweight='bold')
    ax.text(47, 80.5, "« Quel est le montant minimum mensuel à verser sur le contrat Visa Études, et y a-t-il des frais de dossier ? »", color="white", fontsize=8.5, wrap=True)

    # Assistant Response Bubble
    ai_bubble = patches.FancyBboxPatch((25, 30), 70, 44, boxstyle="round,pad=1.2", facecolor=C_DARK_CARD, edgecolor=C_DARK_BORDER, linewidth=1.2)
    ax.add_patch(ai_bubble)
    
    # Assistant badge
    ax.text(27, 70.5, "Concierge SUNU Bank (Généré par RAG certifié) :", color=C_SUNU_RED, fontsize=8.5, fontweight='bold')
    
    resp_text = (
        "Bonjour ! D'après la fiche produit et les Conditions Générales de l'offre Visa Études de SUNU Bank Togo :\n\n"
        "1. Montant minimum de cotisation :\n"
        "   • Le versement minimum mensuel est fixé à 10 000 FCFA.\n"
        "   • La périodicité peut être mensuelle, trimestrielle, semestrielle ou annuelle.\n\n"
        "2. Frais d'adhésion et de dossier :\n"
        "   • Les frais d'adhésion initiaux s'élèvent à 5 000 FCFA prélevés lors de la souscription.\n"
        "   • Des frais de gestion annuels de 1% sont appliqués sur l'épargne gérée conformément au Code CIMA.\n\n"
        "3. Option de prévoyance complémentaire :\n"
        "   • En cas de décès ou d'invalidité absolue et définitive (IAD) du souscripteur, SUNU Bank garantit\n"
        "     le versement immédiat du capital éducation cible aux bénéficiaires désignés."
    )
    ax.text(27, 49, resp_text, color=C_TEXT_LIGHT, fontsize=8, va='center')

    # Input Box at bottom
    inp_box = patches.FancyBboxPatch((25, 8), 65, 8, boxstyle="round,pad=0.5", facecolor="#0F172A", edgecolor=C_DARK_BORDER, linewidth=1)
    ax.add_patch(inp_box)
    ax.text(27, 12, "Posez votre question sur les contrats d'assurance vie SUNU Bank...", color=C_TEXT_MUTED, fontsize=8.5)

    send_btn = patches.FancyBboxPatch((91, 8), 5, 8, boxstyle="round,pad=0.3", facecolor=C_SUNU_RED, edgecolor="none")
    ax.add_patch(send_btn)
    ax.text(93.5, 12, "➤", color="white", fontsize=12, ha='center', va='center')

    # Suggestions pills above input
    p1 = patches.FancyBboxPatch((25, 18), 22, 4.5, boxstyle="round,pad=0.3", facecolor=C_DARK_CARD, edgecolor=C_DARK_BORDER)
    ax.add_patch(p1)
    ax.text(36, 20.25, "Conditions de rachat partiel", color=C_TEXT_LIGHT, fontsize=7.5, ha='center', va='center')

    p2 = patches.FancyBboxPatch((48, 18), 24, 4.5, boxstyle="round,pad=0.3", facecolor=C_DARK_CARD, edgecolor=C_DARK_BORDER)
    ax.add_patch(p2)
    ax.text(60, 20.25, "Fiscalité des plus-values UEMOA", color=C_TEXT_LIGHT, fontsize=7.5, ha='center', va='center')

    p3 = patches.FancyBboxPatch((73, 18), 22, 4.5, boxstyle="round,pad=0.3", facecolor=C_DARK_CARD, edgecolor=C_DARK_BORDER)
    ax.add_patch(p3)
    ax.text(84, 20.25, "Exclusions réglementaires", color=C_TEXT_LIGHT, fontsize=7.5, ha='center', va='center')

    plt.tight_layout()
    plt.savefig("Memoire/figures/fig_ui_chat.png", dpi=300, facecolor=C_DARK_BG)
    plt.close()
    print("[OK] fig_ui_chat.png généré.")

def render_citation_view():
    """Figure IV.8 : Réponse en temps réel avec citation des sources (Visa Études)"""
    fig, ax = plt.subplots(figsize=(14, 8.5), dpi=300)
    fig.patch.set_facecolor(C_DARK_BG)
    ax.set_facecolor(C_DARK_BG)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    # Main Card
    main_box = patches.FancyBboxPatch((6, 6), 88, 88, boxstyle="round,pad=1.5", facecolor=C_DARK_CARD, edgecolor=C_DARK_BORDER, linewidth=1.5)
    ax.add_patch(main_box)

    # Header
    ax.text(10, 89, "Détail de la Réponse Contextualisée & Traçabilité RAG", color="white", fontsize=13, fontweight='bold')
    ax.text(10, 85.5, "Preuve d'ancrage documentaire et conformité stricte aux dispositions CIMA (Art. 6 & 74)", color=C_TEXT_MUTED, fontsize=8.5)

    # Divider
    ax.plot([10, 90], [83.5, 83.5], color=C_DARK_BORDER, lw=1)

    # Prompt user
    u_box = patches.FancyBboxPatch((10, 74), 80, 7, boxstyle="round,pad=0.5", facecolor="#0F172A", edgecolor="#3B82F6", linewidth=1)
    ax.add_patch(u_box)
    ax.text(12, 78.5, "Requête Prospect :", color="#93C5FD", fontsize=8, fontweight='bold')
    ax.text(12, 75.8, "« En cas de coup dur, puis-je récupérer mes cotisations sur le contrat Visa Études avant la fin ? »", color="white", fontsize=8.5)

    # Answer text box
    ans_box = patches.FancyBboxPatch((10, 48), 80, 24, boxstyle="round,pad=0.6", facecolor="#0B132B", edgecolor=C_DARK_BORDER)
    ax.add_patch(ans_box)
    ax.text(12, 69, "Réponse Déterministe du Modèle (Température 0.0) :", color=C_SUNU_RED, fontsize=8.5, fontweight='bold')
    
    ans_content = (
        "Oui, le rachat de votre contrat Visa Études est possible mais encadré par les règles suivantes :\n"
        "• Rachat Total : Possible après un délai de 2 ans de cotisations effectives (valeur de rachat contractuelle).\n"
        "• Rachat Partiel : Vous pouvez retirer jusqu'à 50% de l'épargne acquise tout en maintenant le contrat actif.\n"
        "• Avance sur police : SUNU Bank peut vous consentir une avance rémunérée sans résilier vos garanties.\n"
        "• Pénalités éventuelles : Conformément à l'Article 74 CIMA, aucune pénalité de rachat ne peut être appliquée\n"
        "  après 10 ans de versement continu."
    )
    ax.text(12, 58.5, ans_content, color=C_TEXT_LIGHT, fontsize=8, va='center')

    # Citations block (The Key RAG Feature)
    ax.text(10, 43.5, "SOURCES DOCUMENTAIRES EXTRAITES PAR LE RETRIEVER (Top-k = 3) :", color=C_ACCENT_TEAL, fontsize=9, fontweight='bold')

    sources = [
        ("Source 1 (Score: 0.89)", "conditions_generales.md - Section 6.2 'Modalités de Rachat et Valeurs de Réduction'", 
         "« Le souscripteur ayant réglé au moins deux années complètes de cotisations peut demander le rachat total ou partiel... »"),
        ("Source 2 (Score: 0.84)", "spec_produits.md - Fiche Visa Études - Rubrique 'Liquidité et Disponibilité'", 
         "« Faculté de rachat partiel à hauteur de 50% du capital constitué après le 24e mois d'adhésion continue. »"),
        ("Source 3 (Score: 0.78)", "notice_information.md - Article 74 & 76 Code des Assurances CIMA", 
         "« Les conditions de rachat et le barème des valeurs de réduction doivent figurer obligatoirement dans la notice... »")
    ]

    for i, (tag, doc, snippet) in enumerate(sources):
        sy = 30.5 - i * 10.5
        sbox = patches.FancyBboxPatch((10, sy), 80, 9.5, boxstyle="round,pad=0.5", facecolor="#0F172A", edgecolor=C_DARK_BORDER)
        ax.add_patch(sbox)
        
        # Pill for score
        badge = patches.FancyBboxPatch((11.5, sy + 6), 18, 2.8, boxstyle="round,pad=0.2", facecolor="#064E3B", edgecolor=C_ACCENT_TEAL)
        ax.add_patch(badge)
        ax.text(20.5, sy + 7.4, tag, color="#6EE7B7", fontsize=7, fontweight='bold', ha='center', va='center')

        ax.text(31, sy + 7.4, doc, color="white", fontsize=8, fontweight='bold', va='center')
        ax.text(12, sy + 3.2, snippet, color=C_TEXT_MUTED, fontsize=7.2, style='italic')

    plt.tight_layout()
    plt.savefig("Memoire/figures/fig_ui_citation.png", dpi=300, facecolor=C_DARK_BG)
    plt.close()
    print("[OK] fig_ui_citation.png généré.")

def render_login_view():
    """Figure IV.9 : Écran officiel d'authentification et de gestion de session"""
    fig, ax = plt.subplots(figsize=(14, 8.5), dpi=300)
    fig.patch.set_facecolor(C_DARK_BG)
    ax.set_facecolor(C_DARK_BG)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    # Centered Login Card
    card = patches.FancyBboxPatch((32, 12), 36, 76, boxstyle="round,pad=1.5", facecolor=C_DARK_CARD, edgecolor=C_DARK_BORDER, linewidth=1.5)
    ax.add_patch(card)

    # Logo Centered
    logo_sq = patches.FancyBboxPatch((47.5, 76), 5, 8, boxstyle="round,pad=0.3", facecolor=C_SUNU_RED, edgecolor="none")
    ax.add_patch(logo_sq)
    ax.text(50, 80, "SB", color="white", fontsize=15, fontweight='bold', ha='center', va='center')

    ax.text(50, 71.5, "SUNU BANK TOGO", color="white", fontsize=13, fontweight='bold', ha='center')
    ax.text(50, 68, "Concierge Bancassurance IA", color=C_TEXT_MUTED, fontsize=9, ha='center')

    # Divider
    ax.plot([36, 64], [64.5, 64.5], color=C_DARK_BORDER, lw=1)

    ax.text(36, 60, "Identifiant / Code Conseiller", color=C_TEXT_LIGHT, fontsize=8.5, fontweight='bold')
    
    # Input 1
    in1 = patches.FancyBboxPatch((36, 52), 28, 6.5, boxstyle="round,pad=0.4", facecolor="#0F172A", edgecolor=C_DARK_BORDER)
    ax.add_patch(in1)
    ax.text(38, 55.25, "conseiller.lome01@sunubank.tg", color=C_TEXT_LIGHT, fontsize=8, va='center')

    ax.text(36, 47, "Mot de passe sécurisé", color=C_TEXT_LIGHT, fontsize=8.5, fontweight='bold')
    
    # Input 2
    in2 = patches.FancyBboxPatch((36, 39), 28, 6.5, boxstyle="round,pad=0.4", facecolor="#0F172A", edgecolor=C_DARK_BORDER)
    ax.add_patch(in2)
    ax.text(38, 42.25, "••••••••••••••••", color=C_TEXT_LIGHT, fontsize=10, va='center')

    # Remember & Forgot
    ax.text(36, 35, "☑ Mémoriser ma session", color=C_TEXT_MUTED, fontsize=7.5)
    ax.text(64, 35, "Code oublié ?", color=C_SUNU_RED, fontsize=7.5, ha='right')

    # Submit Button
    s_btn = patches.FancyBboxPatch((36, 25), 28, 7, boxstyle="round,pad=0.4", facecolor=C_SUNU_RED, edgecolor="none")
    ax.add_patch(s_btn)
    ax.text(50, 28.5, "Se Connecter à l'Espace Pro →", color="white", fontsize=9, fontweight='bold', ha='center', va='center')

    # Security Badge
    sec_box = patches.FancyBboxPatch((36, 15), 28, 6.5, boxstyle="round,pad=0.3", facecolor="#0F172A", edgecolor="#059669", linewidth=0.8)
    ax.add_patch(sec_box)
    ax.text(50, 18.25, "🔒 Chiffrement SSL/TLS 256-bit • IPDCP Togo".replace("🔒", "[SEC]"), color="#34D399", fontsize=7.2, ha='center', va='center', fontweight='bold')

    plt.tight_layout()
    plt.savefig("Memoire/figures/fig_ui_login.png", dpi=300, facecolor=C_DARK_BG)
    plt.close()
    print("[OK] fig_ui_login.png généré.")

if __name__ == "__main__":
    print("=== GÉNÉRATION DES CAPTURES D'ÉCRAN UI FRANÇAISES HAUTE RÉSOLUTION ===")
    render_home_dark()
    render_home_light()
    render_chat_view()
    render_citation_view()
    render_login_view()
    print("=== TOUTES LES CAPTURES UI ONT ÉTÉ GÉNÉRÉES AVEC SUCCÈS ===")
