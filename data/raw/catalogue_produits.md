# BASE DE CONNAISSANCES : PRODUITS DE BANCASSURANCE VIE & ÉPARGNE
## CAS DE SUNU BANK TOGO & SUNU ASSURANCES VIE TOGO

> **Note d'intégration RAG** : Ce document est structuré de manière sémantique avec des balises de métadonnées et des en-têtes explicites pour faciliter le découpage structurel (*Layout-Aware Chunking*) et la récupération parent-enfant (*Parent-Child Retrieval*). Chaque fiche produit constitue une unité autonome de connaissances.

---

## CONTEXTE ET ENGAGEMENT RÉGLEMENTAIRE (ZONE CIMA)
Conformément à l'**Article 6 du Code CIMA**, SUNU Bank Togo et SUNU Assurances Vie Togo sont tenus, avant la conclusion de tout contrat, de fournir au client une fiche d'information claire sur :
1. **Le prix** (primes, cotisations, frais de gestion).
2. **Les garanties offertes** (capital décès, hospitalisation, épargne).
3. **Les exclusions de garantie** (circonstances dans lesquelles l'assurance ne s'applique pas).

Cette base de connaissances sert de référence exclusive pour l'assistant conversationnel afin de respecter le devoir d'information et d'accompagnement précontractuel.

---

## PARTIE I : CATALOGUE DE PRODUITS (FICHES TECHNIQUES)

### 1. ÉPARGNE BONUS SUNU
- **ID Produit** : `PROD-EP-BONUS`
- **Catégorie** : Épargne & Capitalisation
- **Partenaire Émetteur** : SUNU Assurances Vie Togo
- **Canal de Distribution** : Agences SUNU Bank Togo

#### Description Générale
L'Épargne Bonus SUNU est un contrat de capitalisation à versements périodiques conçu pour aider les clients à se constituer progressivement un capital de sécurité ou à financer des projets de moyen/long terme, tout en bénéficiant d'un mécanisme incitatif de tirages au sort.

#### Fonctionnement et Mécanisme Spécifique
- **Tirages au sort périodiques** : Des tirages au sort nationaux (généralement trimestriels) sont organisés.
- **Règlement par anticipation** : Si le contrat du souscripteur est tiré au sort, il gagne le règlement par anticipation de l'intégralité du capital garanti à l'échéance de son contrat (ex: un chèque de 500 000 FCFA), sans devoir attendre le terme théorique de son contrat et sans avoir à payer les cotisations restantes. Le contrat prend alors fin de manière anticipée et heureuse.
- **Capital Garanti** : En cas de vie au terme sans gain par tirage au sort, le souscripteur récupère la totalité de son capital garanti, majoré d'intérêts et de participations aux bénéfices selon les conditions contractuelles.

#### Profil Utilisateur Cible
Clients particuliers de SUNU Bank Togo souhaitant épargner à leur rythme avec un facteur de gain rapide (effet de levier du tirage).

---

### 2. PROTECT PLUS
- **ID Produit** : `PROD-PR-PROTPLUS`
- **Catégorie** : Prévoyance & Assistance (Micro-assurance)
- **Partenaire Émetteur** : SUNU Assurances Vie Togo
- **Canal de Distribution** : Agences SUNU Bank Togo

#### Description Générale
Protect Plus est une solution d'assurance de personnes et d'assistance médicale rapide en cas d'accident ou d'hospitalisation prolongée. Ce contrat offre une protection financière à vie pour faire face aux dépenses imprévues de santé.

#### Garanties et Prestations
- **Garantie Décès ou Invalidité par accident** : Versement d'un capital garanti aux bénéficiaires désignés en cas de décès accidentel ou d'invalidité totale de l'assuré.
- **Garantie Hospitalisation** : En cas d'hospitalisation suite à un accident dont la durée dépasse cinq (5) jours consécutifs, l'assurance prend en charge ou rembourse une partie des frais médicaux.
  - *Niveau de mise de base* : Remboursement des frais médicaux supportables à partir de 150 000 F CFA (pour la plus petite mise).
  - *Niveau de mise maximal* : Remboursement des frais médicaux jusqu'à 250 000 F CFA (pour la plus grande mise).

#### Conditions Financières (Mises & Capitaux)
- **Petite Mise** : Cotisation unique de 5 000 F CFA pour un capital garanti de 500 000 F CFA en cas d'accident.
- **Grande Mise** : Cotisation de 10 000 F CFA pour un capital garanti de 1 000 000 F CFA en cas d'accident.
- **Durée du contrat** : Protection à vie (sous réserve de paiement des mises).

---

### 3. SECURE COMPTE
- **ID Produit** : `PROD-PR-SECCOMPTE`
- **Catégorie** : Prévoyance bancaire
- **Partenaire Émetteur** : SUNU Assurances Vie Togo
- **Canal de Distribution** : SUNU Bank Togo (Adossement de compte)

#### Description Générale
Secure Compte est une assurance vie de prévoyance qui protège le solde et les dépôts du client sur ses comptes chèques ou d'épargne en garantissant le versement d'un capital en cas de décès ou d'invalidité absolue et définitive.

#### Caractéristiques Principales
- **Durée de la couverture** : Couverture à vie (tant que le compte bancaire est actif et la prime payée).
- **Conditions d'Âge à la souscription** :
  - *Âge minimum* : 18 ans révolus.
  - *Âge maximum* : 70 ans au moment de l'adhésion.

#### Grille des Cotisations et Capitaux Garantis
- **Palier Minimal** : Mise périodique de 2 700 F CFA pour un capital garanti de 400 000 F CFA versé aux bénéficiaires.
- **Palier Maximal** : Mise périodique de 33 500 F CFA pour un capital garanti de 5 000 000 F CFA versé aux bénéficiaires.

#### Objectif Client
Sécuriser l'avenir financier de ses proches en évitant que le décès ou l'invalidité ne bloque le niveau de vie de la famille, tout en garantissant un capital de secours lié au compte de SUNU Bank Togo.

---

### 4. HORIZON RETRAITE / HORIZON RETRAITE 5
- **ID Produit** : `PROD-EP-RETRAITE`
- **Catégorie** : Épargne Retraite (Individuel ou Collectif)
- **Partenaire Émetteur** : SUNU Assurances Vie Togo
- **Canal de Distribution** : SUNU Bank Togo & Agents généraux

#### Description Générale
Contrat d'épargne à versements périodiques conçu pour aider à préparer sa retraite en toute sérénité. L'assuré constitue progressivement un capital afin de maintenir son niveau de vie une fois qu'il aura cessé son activité professionnelle.

#### Fonctionnement et Flexibilité
- **Versement des primes** : Mensuel, trimestriel, semestriel ou annuel selon le choix et le budget de l'assuré.
- **Cotisation minimale** : À partir de 10 000 F CFA par mois (Horizon Retraite classique).
- **Bonus exceptionnel au terme** : Au terme du contrat, l'assuré bénéficie d'un bonus attractif équivalent à 92 % de sa première année de cotisation pour récompenser sa fidélité d'épargne.
- **Récupération des fonds** : À l'échéance, sous forme de capital unique versé en une fois, ou sous forme de rentes régulières (complément de revenu).

#### Variante : HORIZON RETRAITE 5 (Moyen terme)
- Conçu pour les horizons de court à moyen terme (durée de cotisation stricte inférieure à 10 ans).
- Idéal pour constituer rapidement un apport ou sécuriser une transition professionnelle.
- **Mise minimale (ticket d'entrée)** : À partir de 25 000 F CFA de versement.

#### Garanties en cas de Décès ou d'Invalidité
Si l'assuré décède ou est victime d'invalidité totale et définitive avant le terme du contrat, l'épargne constituée ou le capital garanti de protection est immédiatement reversé aux bénéficiaires désignés pour assurer leur sécurité financière.

---

### 5. VISA ÉTUDES / VISA ÉTUDES PLUS
- **ID Produit** : `PROD-EP-EDUCATION`
- **Catégorie** : Épargne Éducation & Prévoyance Scolaire
- **Partenaire Émetteur** : SUNU Assurances Vie Togo
- **Canal de Distribution** : Agences SUNU Bank Togo & SUNU Assurances Vie

#### Description Générale
Visa Études Plus est un contrat d'assurance épargne-éducation qui garantit le financement des études supérieures ou de la scolarité de l'enfant bénéficiaire, même si le parent souscripteur venait à disparaître ou à perdre son autonomie physique.

#### Fonctionnement Technique
- **Âge requis pour souscrire** : Être majeur (18 ans minimum).
- **Durée de cotisation** : Déterminée lors de la souscription, généralement calquée sur l'âge de l'enfant et l'échéance de ses besoins d'études (ex: majorité ou baccalauréat).
- **Cotisation minimale** : À partir de 4 250 F CFA par mois (ou formule classique à partir de 10 000 F CFA par mois).

#### Double Effet des Garanties (Vie et Décès)
- **En cas de vie à l'échéance du contrat** : SUNU Assurances reverse l'épargne cumulée et capitalisée sous forme de capital d'études ou de versements réguliers (bourses d'études) pour couvrir les frais de scolarité ou d'université.
- **En cas de décès ou d'invalidité absolue du parent avant le terme** : L'avenir de l'enfant est protégé. SUNU Assurances Vie Togo prend le relais et garantit le versement du capital d'études prévu ou d'une rente d'éducation régulière à l'enfant pour qu'il puisse poursuivre sa scolarité dans les meilleures conditions.

---

### 6. ÉPARGNE MOOV
- **ID Produit** : `PROD-EP-DIGMOOV`
- **Catégorie** : Assurance Mobile (Capitalisation 100% Digitale)
- **Co-partenaires** : SUNU Assurances Vie Togo & Moov Africa Togo
- **Canal de Distribution** : Application Moov Money / Menu USSD Moov Money Togo (Rubrique "Assurances")

#### Description Générale
Lancé en août 2026, Épargne Moov est un produit de capitalisation de micro-assurance entièrement dématérialisé. Il vise à démocratiser l'épargne pour toute la population togolaise en permettant de cotiser de très petites sommes directement depuis son téléphone portable.

#### Modalités de Fonctionnement
- **Durée du contrat** : 15 ans (permet d'établir un plan d'épargne de long terme).
- **Niveau de cotisation très bas** : De 500 F CFA à 5 000 F CFA par mois.
- **Prélèvements automatiques** : Débités de manière transparente sur le portefeuille Mobile Money (Moov Money).
- **Rachat possible** : Possibilité pour le souscripteur d'effectuer des retraits (rachats partiels) sous certaines conditions contractuelles après une certaine période minimale d'épargne.

#### Mécanisme d'Effet de Levier (Tirage au Sort)
- Le produit intègre des tirages au sort trimestriels.
- Les heureux gagnants perçoivent de manière anticipée l'intégralité du capital correspondant à leur souscription sur 15 ans, sans devoir verser les cotisations mensuelles restantes et sans attendre l'échéance. Le capital garanti est ainsi libéré immédiatement par SUNU Assurances Vie Togo.

---

### 7. PRÉVOYANCE MOOV
- **ID Produit** : `PROD-PR-DIGMOOV`
- **Catégorie** : Assurance Décès Mobile (Micro-assurance Prévoyance)
- **Co-partenaires** : SUNU Assurances Vie Togo & Moov Africa Togo
- **Canal de Distribution** : Application Moov Money / Menu USSD Moov Money Togo

#### Description Générale
Lancé conjointement en août 2026, Prévoyance Moov est une couverture d'assurance décès ultra-accessible, souscrite directement sur smartphone. Elle vise à apporter une protection financière immédiate et à faible coût à la famille d'un abonné Moov en cas de disparition soudaine de ce dernier.

#### Conditions d'Admissibilité
- **Éligibilité** : Réservé aux abonnés actifs de Moov Africa Togo.
- **Conditions d'Âge** : Avoir entre 18 ans et 64 ans à la souscription.
- **Durée d'engagement** : Contrat de 1 an renouvelable par tacite reconduction via validation sur l'application mobile.

#### Garantie Principale
- En cas de décès de l'assuré au cours de la période de validité du contrat, SUNU Assurances Vie Togo s'engage à liquider rapidement un capital garanti prédéfini aux bénéficiaires désignés par l'abonné sur l'interface numérique Moov Money.
- **Facilité de paiement** : Le règlement de la prime annuelle ou périodique est directement effectué par débit du compte Moov Money.

---

### 8. SÉRÉNITÉ
- **ID Produit** : `PROD-EP-SERENITE`
- **Catégorie** : Épargne & Retraite Individuelle
- **Partenaire Émetteur** : SUNU Assurances Vie Togo
- **Canal de Distribution** : Agences SUNU Bank Togo

#### Description Générale
Le produit Sérénité est une formule d'épargne à long terme conçue pour sécuriser la transition de la fin de carrière professionnelle. Contrairement à une simple épargne bancaire, il offre des garanties d'assurance de personnes et des rendements financiers sécurisés par le Code CIMA.

#### Caractéristiques
- **Objectif** : Constituer à son rythme un capital confortable pour maintenir son pouvoir d'achat au moment de la retraite.
- **Garantie Décès adossée** : En cas de décès prématuré, préservation du capital constitué au profit des ayants droit désignés, évitant ainsi la perte de l'épargne.

---

## PARTIE II : TERMINOLOGIE ET CONCEPTS CLÉS (POUR LE RAG)

Lors de l'accompagnement précontractuel, le bot doit être capable d'expliquer de manière simple les notions juridiques suivantes imposées par le Code CIMA :

- **Souscripteur** : La personne physique (ou morale) qui signe le contrat et s'engage à payer les cotisations/primes d'assurance (ex : le parent pour le contrat Visa Études).
- **Assuré** : La personne sur la tête de laquelle repose le risque (le risque de décès ou de maladie). Dans de nombreux cas d'épargne, le souscripteur et l'assuré sont la même personne.
- **Bénéficiaire** : La personne désignée par le souscripteur pour recevoir les prestations financières (capital ou rente) en cas de sinistre ou au terme du contrat (ex : l'enfant pour le produit Visa Études Plus).
- **Prime / Cotisation / Mise** : La somme d'argent payée par le souscripteur à la compagnie d'assurance en échange de la garantie (ex : de 500 F à 5 000 F CFA pour Épargne Moov).
- **Sinistre** : La survenance de l'événement incertain prévu au contrat (décès, accident, hospitalisation supérieure à 5 jours pour Protect Plus).
- **Rachat (Partiel ou Total)** : L'opération par laquelle le souscripteur demande à récupérer tout ou partie de l'épargne constituée sur son contrat avant l'échéance théorique du contrat. *(Attention : les Articles 74 et 76 du Code CIMA régissent strictement la valeur de rachat et l'indemnité maximale de rachat de 5% de la provision mathématique)*.
- **Délai de carence (ou Délai d'attente)** : Période minimale après la souscription durant laquelle certaines garanties ne s'appliquent pas encore (par exemple en cas de maladie préexistante). En cas d'accident, le délai de carence est généralement nul.
- **Provision mathématique** : La réserve financière que l'assureur doit obligatoirement constituer au bilan pour faire face à ses engagements futurs envers l'assuré.

---

## PARTIE III : FOIRE AUX QUESTIONS (FAQ CLIENTÈLE)

#### Q1 : Puis-je récupérer mon argent avant la fin d'un contrat d'épargne (comme Épargne Moov ou Horizon Retraite) ?
> **Réponse** : Oui, c'est ce qu'on appelle un rachat. Les contrats d'assurance vie épargne de SUNU Assurances Vie Togo prévoient des facultés de rachat partiel ou total après une période minimale d'épargne. Attention, conformément au Code CIMA, des frais ou une indemnité de rachat (plafonnée à 5% de votre provision mathématique) peuvent être appliqués si le rachat a lieu de manière anticipée par rapport aux clauses spécifiques de votre contrat.

#### Q2 : Que se passe-t-il si je gagne au tirage au sort d'Épargne Bonus ou Épargne Moov ?
> **Réponse** : C'est le grand avantage de ces produits ! Si votre contrat est tiré au sort lors des tirages périodiques, SUNU Assurances Vie Togo vous règle immédiatement et par anticipation l'intégralité du capital que vous aviez prévu de garantir à la fin de votre contrat. Vous n'avez plus à verser de cotisations mensuelles et le contrat se termine par cette heureuse anticipation.

#### Q3 : Pour Protect Plus, à partir de combien de jours d'hospitalisation suis-je couvert ?
> **Réponse** : Pour bénéficier de l'assistance et de la prise en charge des frais médicaux (compris entre 150 000 F CFA et 250 000 F CFA selon votre mise), l'hospitalisation doit faire suite à un accident et sa durée doit dépasser cinq (5) jours consécutifs.

#### Q4 : Quelle est la différence entre Épargne Moov et Prévoyance Moov ?
> **Réponse** :
> - **Épargne Moov** est un contrat d'épargne sur 15 ans permettant de constituer un capital à partir de petites sommes (500 F à 5 000 F CFA par mois via Moov Money) avec possibilité de gagner son capital par anticipation via tirage au sort.
> - **Prévoyance Moov** est une assurance prévoyance décès d'un an renouvelable (pour les 18 à 64 ans) qui garantit le versement rapide d'un capital de secours à votre famille en cas de décès de l'assuré, sans constitution d'épargne.

#### Q5 : Quel est l'âge limite pour souscrire au produit Secure Compte ?
> **Réponse** : Pour souscrire au contrat Secure Compte auprès de votre conseiller SUNU Bank Togo, vous devez être âgé d'au moins 18 ans et ne pas avoir dépassé 70 ans au moment de l'adhésion.

---

## PARTIE IV : RÈGLES D'OR DU BOT CONVERSATIONNEL (FILTRES ET GARDE-FOUS)

1. **Ne pas donner de conseils d'investissement définitifs** : Le bot doit guider mais toujours inviter le client à finaliser son recueil de besoins avec un conseiller SUNU Bank agréé.
2. **Abstention en cas de doute** : Si l'utilisateur pose une question complexe sur les exclusions médicales spécifiques ou les clauses juridiques de litige, le bot doit répondre : *« Pour des questions d'ordre médical ou de litige spécifique, je vous invite à consulter directement la notice d'information contractuelle ou à vous rapprocher d'un conseiller clientèle dans l'une de nos 28 agences SUNU Bank Togo. »*
3. **Mise en avant des tarifs exacts** : Ne jamais inventer de tarifs de cotisations. Les seules limites de cotisations valides sont celles indiquées dans cette base (ex : minimum 4 250 F/mois pour Visa Études Plus, 500 F à 5 000 F pour Épargne Moov, 2 700 F à 33 500 F pour Secure Compte, 5 000 F ou 10 000 F pour Protect Plus).
