"""Moteur de calcul et de simulation actuarielle des produits de bancassurance vie.

Conforme aux dispositions du Code des assurances CIMA (Livre I)
et aux spécifications techniques officielles de SUNU Assurances Vie Togo
distribuées par SUNU Bank Togo.
"""

from dataclasses import asdict, dataclass
import math
from typing import Any, Dict, Optional


@dataclass
class SimulationResult:
    product_id: str
    product_name: str
    category: str
    monthly_amount: float
    duration_years: int
    total_contributed: float
    guaranteed_capital_at_term: float
    specific_benefit: str
    fidelity_bonus: float
    quarterly_pension: float
    death_disability_guarantee: str
    cima_mentions: str
    summary_text: str

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


def calculate_future_value(monthly_payment: float, years: int, annual_rate: float = 0.035) -> float:
    """Calcule la valeur acquise d'une épargne à versements mensuels constants.
    
    Formule actuarielle standard : S = (P * 12) * ((1 + r)^n - 1) / r
    avec r = taux technique annuel garanti (3,5% selon le Code CIMA).
    """
    if annual_rate <= 0 or years <= 0:
        return monthly_payment * 12 * years
    annual_contrib = monthly_payment * 12
    # Capitalisation avec versements en début de période :
    future_val = annual_contrib * (((1 + annual_rate) ** years - 1) / annual_rate) * (1 + annual_rate / 2)
    return round(future_val)


def simulate_product(
    product_key: str,
    monthly_amount: float,
    duration_years: int,
    child_age: Optional[int] = None,
    client_age: Optional[int] = None,
) -> SimulationResult:
    """Génère une simulation précontractuelle certifiée CIMA pour l'un des 8 produits du portefeuille."""
    norm_key = product_key.lower().replace("-", "_").replace(" ", "_")

    # 1. VISA ÉTUDES (PROD-EP-EDUCATION)
    if "visa_etudes_plus" in norm_key or "edupro" in norm_key:
        min_amount = 10000.0
        actual_amount = max(monthly_amount, min_amount)
        dur = max(5, min(duration_years, 15))
        total_paid = actual_amount * 12 * dur
        capital = calculate_future_value(actual_amount, dur, 0.035)
        # Rente d'études trimestrielle sur 4 ans (16 trimestres)
        pension_trim = round((capital / 16) * 1.02)
        
        return SimulationResult(
            product_id="PROD-EP-EDUPRO",
            product_name="Visa Études Plus",
            category="Épargne-Éducation Renforcée",
            monthly_amount=actual_amount,
            duration_years=dur,
            total_contributed=total_paid,
            guaranteed_capital_at_term=capital,
            specific_benefit=f"Rente d'orphelinat immédiate en cas de décès + Bourse d'études trimestrielle de {pension_trim:,.0f} FCFA pendant 4 ans (16 trimestres).",
            fidelity_bonus=0.0,
            quarterly_pension=pension_trim,
            death_disability_guarantee="Exonération totale des primes + Rente d'orphelinat immédiate + Doublement du capital si décès accidentel.",
            cima_mentions="Conforme Art. 6 & 65-1 Code CIMA. Faculté de renonciation de 30 jours (Art. 76). Rachat encadré (Art. 74).",
            summary_text=(
                f"Simulation Visa Études Plus ({dur} ans à {actual_amount:,.0f} FCFA/mois) :\n"
                f"• Total cotisé : {total_paid:,.0f} FCFA\n"
                f"• Capital garanti à terme (TMG 3,5% + PB) : {capital:,.0f} FCFA\n"
                f"• Rente trimestrielle d'études : ~{pension_trim:,.0f} FCFA / trimestre pendant 4 ans\n"
                f"• Prévoyance : Exonération des cotisations, rente orphelinat immédiate et doublement du capital en cas de décès accidentel."
            ),
        )

    if "visa_etudes" in norm_key or "education" in norm_key:
        min_amount = 4250.0
        actual_amount = max(monthly_amount, min_amount)
        dur = max(3, min(duration_years, 15))
        total_paid = actual_amount * 12 * dur
        capital = calculate_future_value(actual_amount, dur, 0.035)
        pension_trim = round((capital / 16) * 1.02)

        return SimulationResult(
            product_id="PROD-EP-EDUCATION",
            product_name="Visa Études",
            category="Épargne-Éducation",
            monthly_amount=actual_amount,
            duration_years=dur,
            total_contributed=total_paid,
            guaranteed_capital_at_term=capital,
            specific_benefit=f"Rente trimestrielle d'études de {pension_trim:,.0f} FCFA pendant 4 ans (ou capital unique à l'échéance).",
            fidelity_bonus=0.0,
            quarterly_pension=pension_trim,
            death_disability_guarantee="Prise en charge intégrale des cotisations restantes par l'assureur en cas de décès ou IAD du parent.",
            cima_mentions="Conforme Art. 6 Code CIMA. Taux minimum garanti 3,5%. Renonciation 30 jours (Art. 76).",
            summary_text=(
                f"Simulation Visa Études ({dur} ans à {actual_amount:,.0f} FCFA/mois) :\n"
                f"• Total cotisé : {total_paid:,.0f} FCFA\n"
                f"• Capital garanti à terme : {capital:,.0f} FCFA\n"
                f"• Rente trimestrielle d'études : ~{pension_trim:,.0f} FCFA / trimestre pendant 4 ans\n"
                f"• Prévoyance : Exonération totale des primes si décès ou invalidité du souscripteur."
            ),
        )

    # 2. HORIZON RETRAITE 5 (PROD-EP-RET5)
    if "horizon_retraite_5" in norm_key or "ret5" in norm_key:
        min_amount = 25000.0
        actual_amount = max(monthly_amount, min_amount)
        dur = 5
        total_paid = actual_amount * 12 * dur
        capital = calculate_future_value(actual_amount, dur, 0.035)

        return SimulationResult(
            product_id="PROD-EP-RET5",
            product_name="Horizon Retraite 5",
            category="Retraite Accélérée (5 ans ferme)",
            monthly_amount=actual_amount,
            duration_years=dur,
            total_contributed=total_paid,
            guaranteed_capital_at_term=capital,
            specific_benefit="Capitalisation courte et sécurisée sur 5 ans ferme pour seniors et cadres proches de la retraite.",
            fidelity_bonus=0.0,
            quarterly_pension=0.0,
            death_disability_guarantee="Reversement immédiat de l'épargne constituée majorée aux ayants droit en cas de décès avant terme.",
            cima_mentions="Conforme Code CIMA Livre I. Taux d'intérêt technique garanti 3,5% l'an. Participation aux bénéfices Art. 84.",
            summary_text=(
                f"Simulation Horizon Retraite 5 (5 ans ferme à {actual_amount:,.0f} FCFA/mois) :\n"
                f"• Total cotisé : {total_paid:,.0f} FCFA\n"
                f"• Capital garanti au terme de 5 ans : {capital:,.0f} FCFA\n"
                f"• Idéal pour préparer sereinement son départ en retraite sur une courte période."
            ),
        )

    # 3. HORIZON RETRAITE CLASSIQUE (PROD-EP-RETRAITE)
    if "retraite" in norm_key or "horizon" in norm_key:
        min_amount = 10000.0
        actual_amount = max(monthly_amount, min_amount)
        dur = max(5, min(duration_years, 25))
        total_paid = actual_amount * 12 * dur
        base_capital = calculate_future_value(actual_amount, dur, 0.035)
        # Bonus de fidélité de 92% de la 1ère annuité si contrat >= 10 ans sans rachat
        fidelity = round(0.92 * (actual_amount * 12)) if dur >= 10 else 0.0
        total_capital = base_capital + fidelity
        rente_mensuelle = round(total_capital * 0.0065)

        return SimulationResult(
            product_id="PROD-EP-RETRAITE",
            product_name="Horizon Retraite",
            category="Capitalisation Retraite",
            monthly_amount=actual_amount,
            duration_years=dur,
            total_contributed=total_paid,
            guaranteed_capital_at_term=total_capital,
            specific_benefit=f"Bonus de fidélité de 92% de la 1ère annuité ({fidelity:,.0f} FCFA) + Choix de rente viagère estimée à ~{rente_mensuelle:,.0f} FCFA/mois.",
            fidelity_bonus=fidelity,
            quarterly_pension=round(rente_mensuelle * 3),
            death_disability_guarantee="Versement du capital constitué aux bénéficiaires + exonération de cotisations si invalidité définitive.",
            cima_mentions="Code CIMA Art. 6, 74 & 84. Taux minimum garanti 3,5% + Participation aux bénéfices annuelle obligatoire.",
            summary_text=(
                f"Simulation Horizon Retraite ({dur} ans à {actual_amount:,.0f} FCFA/mois) :\n"
                f"• Total cotisé : {total_paid:,.0f} FCFA\n"
                f"• Capital garanti constitué : {base_capital:,.0f} FCFA\n"
                f"• Bonus de fidélité au terme (92% annuité 1) : {fidelity:,.0f} FCFA\n"
                f"• TOTAL ESTIMÉ À TERME : {total_capital:,.0f} FCFA (ou rente viagère de ~{rente_mensuelle:,.0f} FCFA/mois)"
            ),
        )

    # 4. ÉPARGNE BONUS SUNU (PROD-EP-BONUS)
    if "bonus" in norm_key:
        min_amount = 5000.0
        actual_amount = max(monthly_amount, min_amount)
        dur = 15 if duration_years >= 12 else 10
        total_paid = actual_amount * 12 * dur
        capital = calculate_future_value(actual_amount, dur, 0.035)

        return SimulationResult(
            product_id="PROD-EP-BONUS",
            product_name="Épargne Bonus SUNU",
            category="Épargne Bonifiée avec Tirages au Sort",
            monthly_amount=actual_amount,
            duration_years=dur,
            total_contributed=total_paid,
            guaranteed_capital_at_term=capital,
            specific_benefit="Tirages au sort trimestriels : en cas de tirage gagnant, versement immédiat du capital intégral à terme et dispense des cotisations futures !",
            fidelity_bonus=0.0,
            quarterly_pension=0.0,
            death_disability_guarantee="Protection du capital constitué et versement aux ayants droit en cas de décès de l'assuré.",
            cima_mentions="Régime de capitalisation avec loterie réglementée conforme au Code CIMA. Droit de renonciation de 30 jours.",
            summary_text=(
                f"Simulation Épargne Bonus SUNU ({dur} ans à {actual_amount:,.0f} FCFA/mois) :\n"
                f"• Total cotisé théorique : {total_paid:,.0f} FCFA\n"
                f"• Capital garanti à l'échéance : {capital:,.0f} FCFA\n"
                f"• Facteur de gain accéléré : Tirage au sort trimestriel offrant le règlement anticipé de la totalité du capital sans payer le reste des cotisations !"
            ),
        )

    # 5. PROTECT PLUS (PROD-PR-PROTPLUS)
    if "protect" in norm_key:
        # Formule Petite Mise vs Grande Mise
        is_grande = monthly_amount >= 1000 or monthly_amount >= 10000
        cotisation_label = "1 000 FCFA/mois (ou 10 000 FCFA/an)" if is_grande else "500 FCFA/mois (ou 5 000 FCFA/an)"
        cap_deces = 1000000.0 if is_grande else 500000.0
        indemnite_hospit = 250000.0 if is_grande else 150000.0

        return SimulationResult(
            product_id="PROD-PR-PROTPLUS",
            product_name="Protect Plus",
            category="Micro-assurance Santé & Accident",
            monthly_amount=1000.0 if is_grande else 500.0,
            duration_years=1,
            total_contributed=12000.0 if is_grande else 6000.0,
            guaranteed_capital_at_term=cap_deces,
            specific_benefit=f"Prise en charge des frais d'hospitalisation accidentelle jusqu'à {indemnite_hospit:,.0f} FCFA (dès 5 jours consécutifs d'hospitalisation).",
            fidelity_bonus=0.0,
            quarterly_pension=0.0,
            death_disability_guarantee=f"Capital garanti de {cap_deces:,.0f} FCFA versé aux bénéficiaires en cas de décès accidentel ou IAD.",
            cima_mentions="Micro-assurance conforme aux dispositions CIMA. Couverture renouvelable annuellement.",
            summary_text=(
                f"Simulation Protect Plus ({'Grande Mise' if is_grande else 'Petite Mise'}) :\n"
                f"• Cotisation : {cotisation_label}\n"
                f"• Capital Décès / Invalidité accidentelle garanti : {cap_deces:,.0f} FCFA\n"
                f"• Forfait hospitalier (dès le 5e jour consécutif suite à un accident) : jusqu'à {indemnite_hospit:,.0f} FCFA."
            ),
        )

    # 6. SECURE COMPTE (PROD-PR-SECCOMPTE)
    if "secure" in norm_key or "compte" in norm_key:
        # Paliers
        if monthly_amount >= 2500:
            prime_annuelle = 33500.0
            cap_garanti = 5000000.0
        elif monthly_amount >= 1000:
            prime_annuelle = 13000.0
            cap_garanti = 2000000.0
        elif monthly_amount >= 500:
            prime_annuelle = 6500.0
            cap_garanti = 1000000.0
        else:
            prime_annuelle = 2700.0
            cap_garanti = 400000.0

        return SimulationResult(
            product_id="PROD-PR-SECCOMPTE",
            product_name="Secure Compte",
            category="Prévoyance adossée au compte bancaire",
            monthly_amount=round(prime_annuelle / 12),
            duration_years=1,
            total_contributed=prime_annuelle,
            guaranteed_capital_at_term=cap_garanti,
            specific_benefit=f"Sécurisation du compte SUNU Bank Togo avec versement d'un capital immédiat de {cap_garanti:,.0f} FCFA en cas de coup dur.",
            fidelity_bonus=0.0,
            quarterly_pension=0.0,
            death_disability_guarantee=f"Capital décès ou invalidité définitive de {cap_garanti:,.0f} FCFA (adhérents de 18 à 70 ans).",
            cima_mentions="Prévoyance bancassurance régie par le Code CIMA. Adossée à la tenue de compte.",
            summary_text=(
                f"Simulation Secure Compte (palier {cap_garanti:,.0f} FCFA) :\n"
                f"• Prime annuelle : {prime_annuelle:,.0f} FCFA (~{round(prime_annuelle/12):,.0f} FCFA/mois)\n"
                f"• Capital garanti décès/invalidité : {cap_garanti:,.0f} FCFA\n"
                f"• Éligibilité : Tout titulaire de compte SUNU Bank Togo âgé de 18 à 70 ans."
            ),
        )

    # 7. ÉPARGNE MOOV & PRÉVOYANCE MOOV (PROD-EP-DIGMOOV / PROD-PR-DIGMOOV)
    if "moov" in norm_key:
        if "prevoyance" in norm_key:
            return SimulationResult(
                product_id="PROD-PR-DIGMOOV",
                product_name="Prévoyance Moov",
                category="Assurance Décès 100% Mobile",
                monthly_amount=500.0,
                duration_years=1,
                total_contributed=6000.0,
                guaranteed_capital_at_term=500000.0,
                specific_benefit="Souscription et gestion 100% digitale via Moov Money sans compte bancaire physique.",
                fidelity_bonus=0.0,
                quarterly_pension=0.0,
                death_disability_guarantee="Paiement ultra-rapide du capital décès sur le wallet Moov Money des bénéficiaires.",
                cima_mentions="Réglementation micro-assurance mobile CIMA.",
                summary_text=(
                    "Simulation Prévoyance Moov :\n"
                    "• Cotisation : Dès 500 FCFA/mois prélevés directement sur Moov Money\n"
                    "• Capital Décès garanti : 500 000 FCFA versé aux bénéficiaires désignés\n"
                    "• Âge de souscription : 18 à 64 ans."
                ),
            )
        else:
            actual_amount = max(500.0, min(monthly_amount, 5000.0))
            dur = 15
            total_paid = actual_amount * 12 * dur
            capital = calculate_future_value(actual_amount, dur, 0.035)

            return SimulationResult(
                product_id="PROD-EP-DIGMOOV",
                product_name="Épargne Moov",
                category="Épargne Digitale Mobile Money",
                monthly_amount=actual_amount,
                duration_years=dur,
                total_contributed=total_paid,
                guaranteed_capital_at_term=capital,
                specific_benefit="Tirages au sort trimestriels : gain anticipé de l'intégralité du capital sur 15 ans libéré sur Moov Money !",
                fidelity_bonus=0.0,
                quarterly_pension=0.0,
                death_disability_guarantee="Restitution du capital constitué aux bénéficiaires désignés sur l'application.",
                cima_mentions="Cadre micro-assurance CIMA. Prélèvements transparents sur portefeuille mobile.",
                summary_text=(
                    f"Simulation Épargne Moov (15 ans à {actual_amount:,.0f} FCFA/mois via Moov Money) :\n"
                    f"• Total versé : {total_paid:,.0f} FCFA\n"
                    f"• Capital garanti à l'échéance : {capital:,.0f} FCFA\n"
                    f"• Éligible aux tirages au sort trimestriels pour remporter le capital complet par anticipation !"
                ),
            )

    # 8. SÉRÉNITÉ (PROD-EP-SERENITE)
    actual_amount = max(monthly_amount, 5000.0)
    dur = max(5, min(duration_years, 20))
    total_paid = actual_amount * 12 * dur
    capital = calculate_future_value(actual_amount, dur, 0.035)

    return SimulationResult(
        product_id="PROD-EP-SERENITE",
        product_name="Sérénité",
        category="Épargne & Prévoyance Obsèques",
        monthly_amount=actual_amount,
        duration_years=dur,
        total_contributed=total_paid,
        guaranteed_capital_at_term=capital,
        specific_benefit="Garantie de prise en charge rapide des frais funéraires et transmission sécurisée d'un capital aux proches.",
        fidelity_bonus=0.0,
        quarterly_pension=0.0,
        death_disability_guarantee="Capital immédiat pour frais funéraires + préservation du capital constitué.",
        cima_mentions="Conforme au Code CIMA Livre I. Délai de renonciation de 30 jours (Art. 76).",
        summary_text=(
            f"Simulation Sérénité ({dur} ans à {actual_amount:,.0f} FCFA/mois) :\n"
            f"• Total cotisé : {total_paid:,.0f} FCFA\n"
            f"• Capital constitué garanti : {capital:,.0f} FCFA\n"
            f"• Sécurisation immédiate de la famille et prise en charge des obsèques en cas d'aléa de la vie."
        ),
    )
