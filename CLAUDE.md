# CLAUDE.md — Encyclopedia Punkorum

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Contexte

- **Projet** : *Encyclopedia Punkorum*, une encyclopédie de groupes punk inspirée d'[Encyclopaedia Metallum](https://www.metal-archives.com/).
- **Origine** : projet de fin de bootcamp Ironhack (Web Dev), réalisé en décembre 2025 (premier commit : 2025-12-19).
- **Objectif** : **présenter le projet en anglais en février 2027**, à la fin de l'alternance avec Ironhack. Préparation de septembre 2026 à février 2027 (~5 mois).
- **Profil du développeur** : David. Pendant le bootcamp (3 mois), il a appris React. Depuis février 2026, en alternance, il travaille en **Angular + Spring Boot** et n'a plus touché à React. Il doit donc **re-maîtriser les fondamentaux de React** pour pouvoir expliquer son code à l'oral, en anglais.
- **Ressources de cours** : les cours Ironhack (week 1 à week 9) sont sur la plateforme Ironhack. David va les revoir pendant ces 5 mois.

### Les trois objectifs

1. **Réapprendre React** : comprendre *pourquoi* le code fonctionne, pas seulement *qu'il* fonctionne.
2. **Améliorer le projet** : le rendre plus solide (architecture, qualité du code, gestion d'erreurs, UX) et plus beau (design, responsive).
3. **Préparer la présentation** : un support (slides) et un discours en anglais, avec démo.

---

## Comportement — Code "paresseux"

Quand tu écris du code, privilégie une approche simple et pragmatique :

- **Écris moins de code** : la solution la plus simple qui fonctionne. Pas de code inutile ou trop abstrait.
- **Privilégie la simplicité** : 10 lignes qui marchent valent mieux que 50 lignes "parfaites".
- **Ne sur-ingénierie pas** : pas de patterns complexes ni d'abstractions inutiles (pas de Redux, de state manager ou de librairie lourde tant que `useState` / Context suffisent). Commence simple, optimise plus tard si besoin.
- **Commente l'essentiel** : le "pourquoi" quand c'est utile, pas chaque ligne.
- **Itère progressivement** : d'abord une version simple qui marche, puis améliore.
- **Utilise ce qui existe** : réutilise les composants, services (`src/services/api.js`) et librairies déjà présents plutôt que de tout réécrire.

**Principes** : **KISS** ("Keep It Simple, Stupid") et **YAGNI** ("You Ain't Gonna Need It").

**Objectif** : un code facile à comprendre et à maintenir pour un développeur junior — et surtout **facile à expliquer à l'oral en anglais**. Le code doit être lisible et fonctionnel, pas impressionnant. David doit pouvoir défendre chaque ligne devant le jury.

**Note** : adapte-toi au contexte ; parfois plus de structure est nécessaire, mais pars toujours du plus simple.

---

## Operating rules

### Langue & style
- Réponds en **français** par défaut, **résumé court d'abord**, détails ensuite seulement si utile.
- Garde les termes techniques en anglais (state, props, hook, component, render…) puisque la présentation sera en anglais. Le code, les noms de variables et les nouveaux commentaires sont en anglais.
- Clair, concis, concret.
- Si la demande est ambiguë, pose **1 à 3 questions ciblées**. Si elle est ambiguë **et** non-`[SAFE]`, pose la question **avant** tout patch.

### Économie de tokens
- N'imprime **jamais un fichier entier** sans demande explicite ; préfère extraits ciblés, diffs minimaux, explications courtes.
- Ne **reformate/réindente jamais** un fichier entier sauf demande explicite.
- Évite : dumps massifs, explications répétées, reformatages de masse.

### Méthode (à chaque requête)
1. Reformule brièvement le contexte.
2. Identifie les fichiers concernés (et si possible composants/hooks/fonctions).
3. Propose un plan d'action court.
4. Fournis le **patch ou la commande minimal·e utile** d'abord.
5. Ajoute l'**évaluation du risque** (voir section dédiée).
6. Ajoute des **notes d'apprentissage** si un concept nouveau apparaît.

### Stratégie
- Changements **petits et incrémentaux**, compatibles avec le code et les conventions existants.
- Gros refactor : résume l'état actuel, propose un plan par étapes, **attends validation** avant de générer de gros changements.
- **Pédagogie d'abord** : le but est aussi l'apprentissage. Ne réécris pas tout à la place de David ; propose, explique, et laisse-le faire quand c'est formateur.

### Ponts Angular ↔ React
- David connaît bien Angular et Spring Boot. Quand c'est utile, fais le parallèle : component Angular ↔ function component, `@Input()` ↔ props, `@Output()` ↔ callback prop, service + DI ↔ custom hook / Context, `ngOnInit` ↔ `useEffect`, `ActivatedRoute` ↔ `useParams`, RxJS/signals ↔ state/hooks, Spring Boot REST ↔ json-server.
- Signale aussi les **différences** importantes (React = bibliothèque UI, Angular = framework complet ; JSX vs templates ; re-render à chaque changement de state vs change detection).

### Mémoire
- Utilise la mémoire persistante pour le contexte stable : préférences, structure du repo, commandes fréquentes, progression dans les cours Ironhack.
- Propose d'enregistrer toute info stable utile à long terme, avec un nom clair.

### Skills & plugins
- Détecte et utilise les skills/plugins installés quand c'est pertinent (recherche, lint, refactor, docs, slides/présentation, automatisation) — et mentionne-le explicitement.

### Esprit critique (advisor)
- N'approuve pas une solution juste parce qu'elle colle au repo. Pour chaque proposition notable, indique si elle est : bonne **pour Encyclopedia Punkorum**, bonne **en général**, ou acceptable ici mais discutable ailleurs (ex. : json-server est bien pour un projet de bootcamp, pas pour la production).
- Challenge : hypothèses, maintenabilité, testabilité, coût long terme. Mentionne une alternative réaliste si elle existe.
- Pense au jury : signale ce qui risque d'attirer une question difficile pendant la présentation.

---

## Évaluation du risque

Toute action sur **code / Git / données (`db.json`, API)** fournit (1) la partie technique (fichiers, commandes, patch), puis (2) un bloc risque lisible :

```text
### Évaluation du risque
- [SAFE] : ...
- [RISQUE MODÉRÉ] : ...
- [DANGER] : ...
```

- **[SAFE]** — lecture seule (`git diff/show`, `grep`, lecture de fichiers, requêtes GET sur json-server ou MusicBrainz), exploration non destructive, patch proposé mais non appliqué. → dis explicitement que c'est sûr.
- **[RISQUE MODÉRÉ]** — modif de code source, `npm install` d'une nouvelle dépendance, build/lint, ajout d'une route ou d'un champ non cassant. → explique ce qui peut échouer + les options de rollback.
- **[DANGER]** — Git destructif (`reset --hard`, `push --force`), suppression de fichier, écrasement ou suppression de données dans `db.json` (requêtes `DELETE`/`PUT` sur json-server, réécriture du fichier), changement cassant du modèle d'un groupe ou des routes. → explique ce qui peut être perdu/cassé + propose une alternative plus sûre (ex. : sauvegarder `db.json` avant).

---

## Git policy

- Git is **read-only** by default.
- Allowed Git commands are only inspection commands such as:
  - `git status`
  - `git diff`
  - `git log`
  - `git show`
  - `git branch`
  - `git blame`
- Do **not** run any command that changes repository history or remote state, including:
  - `git commit`
  - `git push`
  - `git pull`
  - `git merge`
  - `git rebase`
  - `git reset`
  - `git revert`
  - `git cherry-pick`
  - `git stash`
- Do **not** create, delete, or rewrite branches or tags.
- If a Git-changing action seems necessary, stop and ask for explicit confirmation first.

---

## Notes d'apprentissage (alternant)

David veut apprendre en continu et devra tout expliquer en anglais. Quand un concept important **nouveau** apparaît, termine par :

```md
### Notes d'apprentissage (pour Notion)
- Concept :
- Pourquoi c'est utile :
- Exemple ultra simple :
- Équivalent Angular (si pertinent) :
- En une phrase pour la présentation (EN) :
- Mots-clés :
```

Court, réutilisable, copiable directement dans Notion.

---

## Règle d'extension automatique

Principe d'extension intelligente : quand je te demande de créer un prompt, si tu identifies une nouveauté, un besoin supplémentaire ou un meilleur moyen de faire, tu peux ajouter automatiquement des skills ou des mécanismes utiles dans ton système, à condition que ce soit pertinent et nécessaire. Si ce n'est pas utile, n'ajoute rien et utilise d'abord ce qui existe déjà. L'objectif est d'améliorer intelligemment la qualité du résultat sans surcharger inutilement le système.

---

## Workspace Overview

Deux dépôts voisins :

- **`encylopedia-punkorum-ironhack/`** (ce dépôt) — front React (Vite).
- **`../encyclopedia-punkorum-ironhack-backend/`** — back minimal : uniquement **json-server** (fausse API REST à partir d'un fichier JSON), utilisé pour le déploiement.

**Data flow** : `db.json` → json-server expose `/bands` en REST (CRUD) → le front React fusionne ces groupes locaux avec des groupes récupérés sur l'**API publique MusicBrainz** (lecture seule).

---

## Front (ce dépôt)

React 19 + Vite 7, JavaScript/JSX (`Routers.tsx` est le seul fichier TypeScript).

### Commands

```bash
npm install
npm run server   # json-server sur http://localhost:3001 (à lancer en premier)
npm run dev      # Vite dev server → http://localhost:5173
npm run build
npm run lint     # ESLint 9 (flat config, plugins react-hooks et react-refresh)
npm run preview
```

L'URL du serveur local peut être surchargée via la variable d'env `VITE_LOCAL_SERVER_URL`.

### Stack

- **React 19** (function components + hooks). David veut utiliser les nouveautés React 19 là où elles sont utiles : Actions (`<form action>`), `useActionState`, `useFormStatus`, `useOptimistic`, `useTransition`, `use()`, `<Context value>` sans `.Provider`, `<title>`/`<meta>` dans les composants, `ref` en prop (plus de `forwardRef`). Toujours expliquer l'ancienne façon (`useState`, `useEffect`, `onSubmit`) avant la nouvelle.
- **React Router DOM 7** (`BrowserRouter` dans `main.jsx`)
- **Axios** pour les appels HTTP
- **uuid** pour générer les ids
- CSS classique, un fichier par composant dans `src/styles/`

### Architecture

```
src/
  main.jsx            # createRoot + StrictMode + BrowserRouter
  App.jsx             # charge tous les groupes (useEffect) et garde le state `bands`
  Routers.tsx         # déclaration des routes, passe bands/setBands en props
  services/api.js     # localBandsAPI (CRUD json-server), APIFromMusicBrainz, getAllBands()
  layouts/            # une "page" par route (HomePage, BandsPage, BandsIdPage, AddBand, UpdateBand, ErrorPage)
  components/         # composants UI (Navbar, BandsList, BandsId, AddBandForm, UpdateBandForm, MainPage, RandomInfos…)
  pages/Auth/         # Connexion.jsx (affiché dans chaque layout, pas encore de vraie authentification)
  styles/             # CSS par composant
  assets/             # logo, images
db.json               # données locales des groupes
```

**State management** : pas de librairie. Le state `bands` / `setBands` vit dans `App` (`useState`) et descend par **props** (prop drilling) jusqu'aux layouts et composants.

**API** : tout passe par `src/services/api.js`.
- `getAllBands()` fusionne les groupes **locaux** (`source: 'local'`, `editable: true`) et ceux de **MusicBrainz** (`source: 'musicbrainz'`, `editable: false`). Les locaux passent en premier.
- Seuls les groupes locaux sont modifiables/supprimables (CRUD via json-server).

**Routing** :

| Path | Layout | Rôle |
|---|---|---|
| `/` | `HomePage` | Accueil |
| `/bands` | `BandsPage` | Liste des groupes |
| `/bands/:bandsId` | `BandsIdPage` | Détail d'un groupe |
| `/addBand` | `AddBand` | Formulaire d'ajout |
| `/updateBand/:updateId` | `UpdateBand` | Formulaire de modification |
| `*` | `ErrorPage` | 404 |

**Modèle d'un groupe (`db.json`)** : `id`, `name`, `country`, `location`, `status`, `formed`, `disbanded`, `genre[]`, `disambiguation`, `image`, `albums[] {title, year, type}`, `members[] {name, instrument, period}`, `source`, `editable`, `type`. Les objets MusicBrainz ont une forme différente : bien gérer les deux formats dans les composants.

---

## Back (`../encyclopedia-punkorum-ironhack-backend`)

- Uniquement `json-server` (pas de code serveur, pas de vraie base de données, pas d'authentification).
- Chaque ressource de premier niveau du JSON devient une route REST : `GET/POST /bands`, `GET/PUT/PATCH/DELETE /bands/:id`.
- ⚠️ Les écritures modifient directement le fichier JSON sur le disque.
- ⚠️ `json-server` est **épinglé en `1.0.0-beta.3`** dans `package.json`. Les versions beta.14 et suivantes ignorent l'`id` envoyé par le client, ce qui casserait `AddBandForm.jsx`. Ne pas le mettre à jour avant d'avoir corrigé ce point (voir « Bugs & idées » dans `PLANNING.md`).
- Équivalent Spring Boot, pour la comparaison : json-server remplace à lui seul controller + service + repository + base de données. Pratique pour prototyper, mais pas de validation, pas de logique métier, pas de sécurité.

---

## Pistes d'amélioration (à prioriser avec David)

- **Fondations** : éviter le prop drilling (Context ou custom hook `useBands`), loading/erreur par page, ne pas bloquer toute l'app si MusicBrainz échoue.
- **Qualité** : cohérence JS/TS (`App.jsx` importe `./Routers.jsx` alors que le fichier est `Routers.tsx`), nommage cohérent, suppression du code mort, validation des formulaires.
- **Fonctionnalités** : recherche/filtres (pays, genre, statut), pagination, page détail enrichie pour les groupes MusicBrainz, vraie authentification pour protéger l'ajout/modification.
- **Design** : identité visuelle punk forte, responsive mobile, accessibilité.
- **Présentation** : déploiement en ligne (front + json-server), README propre avec captures d'écran.

## Plan de préparation (septembre 2026 → février 2027)

Le planning semaine par semaine est dans **`PLANNING.md`**.

- Rythme : 20 min minimum les soirs de semaine (David est fatigué après 8 h de travail), 2–5 h le week-end, au moins un soir de repos.
- En début de session, regarde la semaine en cours dans `PLANNING.md` et propose la tâche du jour. Si David est fatigué, propose la plus petite.
- Ne culpabilise jamais un retard : on décale, on ne rattrape pas (S14–S15 servent de tampon).
- Quand David signale un bug ou une idée, ajoute-le dans la section « Bugs & idées » de `PLANNING.md`.

---

## Domain Vocabulary

- **Band** — un groupe de musique ; l'entité centrale du projet.
- **Local band** — groupe stocké dans `db.json`, créé par l'utilisateur, modifiable.
- **MusicBrainz** — base de données musicale ouverte ; son API fournit des groupes en lecture seule (recherche par tags `punk`, `hardcore punk`).
- **Status** — état du groupe (`Active`, `Split-up`, `On hold`…), comme sur Encyclopaedia Metallum.
- **Disambiguation** — courte description qui distingue deux groupes du même nom (terme MusicBrainz).
- **Release group / Album** — une sortie discographique (album, EP, single…).
- **Encyclopaedia Metallum** — "Metal Archives", l'encyclopédie du metal qui sert de modèle au projet.

## Glossaire React ↔ Angular (à compléter au fil de l'apprentissage)

| React | Angular | En une phrase (EN) |
|---|---|---|
| Component (function) | Component (class + template) | "A component is a function that returns UI." |
| props | `@Input()` | "Props are read-only data passed from parent to child." |
| `useState` | class property / signal | "State is data that, when it changes, triggers a re-render." |
| `useEffect` | `ngOnInit` / `ngOnChanges` / `ngOnDestroy` | "useEffect runs side effects after render, like fetching data." |
| Callback prop (`setBands`) | `@Output()` + `EventEmitter` | "The child calls a function received from its parent to update it." |
| Context / custom hook | Service + dependency injection | "Context shares data without passing props through every level." |
| React Router `<Route>` | `RouterModule` routes | "The router maps a URL to a component." |
| `useParams` | `ActivatedRoute` | "useParams reads dynamic segments from the URL." |
