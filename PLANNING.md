# Planning — Encyclopedia Punkorum (sept. 2026 → fév. 2027)

## Règles du jeu

- **Soirs de semaine : 20 min minimum.** Une seule petite tâche. Si tu as l'énergie, tu continues ; sinon, 20 min = journée réussie.
- **Au moins 1 soir de repos par semaine**, sans culpabiliser. Il y a 4 tâches du soir par semaine, pas 5.
- **Week-end : 2–5 h**, de préférence le matin. C'est là que se fait le vrai travail.
- **Si une semaine glisse, on ne rattrape pas** : on décale. Les semaines des fêtes (S14–S15) servent de tampon.
- **Le dimanche soir** : cocher, puis regarder la semaine suivante (2 min) pour ne pas avoir à choisir quoi faire en rentrant fatigué.
- 🎤 **Une phrase en anglais par semaine** : la dire à voix haute plusieurs fois. En février, tu auras tout ton discours.
- Premier week-end : associer chaque thème ci-dessous à la **week Ironhack** correspondante (cours weeks 1–9).

---

## Phase 1 — Réviser React avec ton propre code (21 sept → 8 nov)

### S1 — 21 → 27 sept · JavaScript moderne (la base de React)
Soirs :
- [ ] Cours : arrow functions, `const`/`let`, template strings
- [ ] Cours : destructuring et spread (`...band` dans `src/services/api.js`)
- [ ] Cours : `map` / `filter` / `find` sur les tableaux
- [ ] Cours : Promises et `async/await` (relire `getAllBands()` dans `api.js`)

Week-end :
- [ ] Faire tourner le projet (`npm install`, `npm run server`, `npm run dev`)
- [ ] Parcourir toutes les pages, noter chaque bug dans la section « Bugs & idées » en bas
- [ ] Associer les thèmes de ce planning aux weeks Ironhack

🎤 EN : *"Encyclopedia Punkorum is an online encyclopedia of punk bands, inspired by Encyclopaedia Metallum."*

### S2 — 28 sept → 4 oct · Components, JSX, props
Soirs :
- [ ] Cours : JSX et function components
- [ ] Lire `main.jsx` puis `App.jsx` : qui affiche quoi ?
- [ ] Cours : props ; lire `Navbar.jsx` et `BandsList.jsx`
- [ ] Glossaire React ↔ Angular : ajouter 2 lignes

Week-end :
- [ ] Dessiner l'arbre des composants (App → Routers → layouts → components). Il servira pour les slides.
- [ ] Expliquer l'arbre à voix haute en anglais (2 min)

🎤 EN : *"A component is a function that returns UI. Data flows from parent to child through props."*

### S3 — 5 → 11 oct · State (`useState`) et events
Soirs :
- [ ] Cours : `useState`
- [ ] Cours : events (`onClick`, `onChange`, `onSubmit`)
- [ ] Lire `AddBandForm.jsx` : les controlled inputs
- [ ] Comparer avec un formulaire Angular (Reactive Forms / `ngModel`)

Week-end :
- [ ] Exercice sur le projet : ajouter une barre de recherche par nom dans la liste des groupes (`useState` + `filter`)

🎤 EN : *"State is data that, when it changes, makes React re-render the component."*

### S4 — 12 → 18 oct · `useEffect` et appels API
Soirs :
- [ ] Cours : `useEffect` et le tableau de dépendances
- [ ] Relire le `useEffect` de `App.jsx` : quand s'exécute-t-il ?
- [ ] Lire `BandsId.jsx` : le `useEffect` avec un paramètre
- [ ] Comprendre pourquoi `StrictMode` exécute les effets deux fois en dev

Week-end :
- [ ] Rendre l'app robuste : si MusicBrainz ne répond pas, afficher quand même les groupes locaux

🎤 EN : *"useEffect runs side effects after render, like fetching data from an API."*

### S5 — 19 → 25 oct · Routing
Soirs :
- [ ] Cours : React Router (`Routes`, `Route`, `Link`)
- [ ] Lire `Routers.tsx` et le comparer au routing Angular
- [ ] Cours : `useParams` et `useNavigate`
- [ ] Lire `BandsIdPage.jsx` et `UpdateBand.jsx` : d'où vient l'id ?

Week-end :
- [ ] Décider JS ou TS, puis corriger l'incohérence `Routers.jsx` / `Routers.tsx`
- [ ] Vérifier tous les liens et la page 404

🎤 EN : *"The router maps each URL to a component, so the app feels like multiple pages without reloading."*

### S6 — 26 oct → 1 nov · CRUD et flux de données
Soirs :
- [ ] Lire `localBandsAPI` dans `api.js` : GET, POST, PUT, DELETE
- [ ] Suivre le flux « ajouter un groupe » : formulaire → API → `setBands`
- [ ] Suivre le flux « modifier » puis « supprimer »
- [ ] Cours : « lifting state up »

Week-end :
- [ ] Écrire en anglais un paragraphe : « How data flows in my app ». Ce sera une slide.
- [ ] Comprendre json-server et le comparer à Spring Boot (controller + service + repository)

🎤 EN : *"The bands state lives in App and is passed down, so every page shares the same data."*

### S7 — 2 → 8 nov · Bilan et choix des améliorations
Soirs :
- [ ] Relire le glossaire et les notes Notion
- [ ] Lister les notions encore floues
- [ ] Expliquer 1 fichier en 1 min en anglais (au choix)
- [ ] Vidéo React 19 (00:00 → 02:02) : fin de `forwardRef` (ref devient une prop), Context en tant que composant, balises `<title>` / `<meta>` dans les composants

Week-end :
- [ ] **Figer la liste des améliorations** (Must / Should / Could) avec Claude, en incluant les nouveautés React 19. On ne rajoute plus rien ensuite.

🎤 EN : *"I rebuilt my understanding of React by reading my own code, file by file."*

---

## Phase 2 — Améliorer le projet (9 nov → 20 déc)

> Le contenu exact dépend de la liste figée en S7. Voici la proposition par défaut.

### S8 — 9 → 15 nov · Supprimer le prop drilling
Soirs :
- [ ] Cours / doc : Context API
- [ ] Comparer Context ↔ service Angular + injection de dépendances
- [ ] Repérer tous les composants qui reçoivent `bands` / `setBands`
- [ ] Préparer le plan du refactor avec Claude

Week-end :
- [ ] Créer un `BandsContext` + un hook `useBands`, puis migrer les composants
- [ ] Syntaxe React 19 : `<BandsContext value={...}>` (plus de `.Provider`) et `use(BandsContext)`

🎤 EN : *"I replaced prop drilling with Context, similar to a shared service in Angular."*

### S9 — 16 → 22 nov · Formulaires React 19 (Actions)
Soirs :
- [ ] Vidéo (02:02 → 09:24) : Actions, `useFormStatus`, `useActionState`
- [ ] `AddBandForm.jsx` : passer de `onSubmit` + `useState` à `<form action={...}>` + `useActionState` (erreurs de validation)
- [ ] Bouton submit avec `useFormStatus` (« Saving… », désactivé pendant l'envoi)
- [ ] Même chose pour `UpdateBandForm.jsx`

Week-end :
- [ ] Vidéo (09:24 → 21:25) : `useTransition` et `useOptimistic`
- [ ] Suppression dans `BandsList.jsx` : le groupe disparaît tout de suite (`useOptimistic`), il revient si l'API échoue
- [ ] Afficher un état de chargement et d'erreur par page, puis corriger les bugs de la liste

🎤 EN : *"With React 19 Actions, forms handle pending state and errors without extra useState."*

### S10 — 23 → 29 nov · Recherche et filtres
Soirs :
- [ ] Filtre par pays
- [ ] Filtre par statut (Active / Split-up)
- [ ] Filtre par genre
- [ ] Combiner recherche + filtres

Week-end :
- [ ] Pagination ou « load more » (MusicBrainz renvoie beaucoup de groupes)

🎤 EN : *"Users can search and filter bands by country, genre and status."*

### S11 — 30 nov → 6 déc · Design 1 : identité visuelle
Soirs :
- [ ] Chercher de l'inspiration (Metal Archives, affiches et fanzines punk)
- [ ] Choisir une palette de couleurs et des polices
- [ ] Centraliser les couleurs dans des variables CSS (`Global.css`)
- [ ] Appliquer la palette à la Navbar

Week-end :
- [ ] Refaire la page d'accueil et la liste des groupes

🎤 EN : *"The visual identity is inspired by punk fanzines: raw, bold and high contrast."*

### S12 — 7 → 13 déc · Design 2 : responsive et page détail
Soirs :
- [ ] Tester sur mobile (DevTools) et lister les problèmes
- [ ] Rendre la Navbar responsive
- [ ] Rendre la liste responsive
- [ ] Rendre les formulaires responsive

Week-end :
- [ ] Refaire la page détail d'un groupe (membres, albums, image)
- [ ] Titre d'onglet dynamique : `<title>{band.name} — Encyclopedia Punkorum</title>` directement dans le composant (React 19)

🎤 EN : *"The site is responsive and works on mobile as well as desktop."*

### S13 — 14 → 20 déc · Déploiement
Soirs :
- [ ] Choisir l'hébergement du front (Netlify ou Vercel)
- [ ] Choisir l'hébergement de json-server (ex. Render) et comprendre ses limites
- [ ] Configurer `VITE_LOCAL_SERVER_URL`
- [ ] Tester le build (`npm run build` + `npm run preview`)

Week-end :
- [ ] Déployer front + back, puis tester en ligne

🎤 EN : *"The app is deployed online: the front end on [host] and the API on [host]."*

---

## Phase 3 — Fêtes, semaines tampon (21 déc → 3 janv)

### S14–S15 — Allégé
- [ ] Rattraper ce qui a glissé (si besoin)
- [ ] Sinon : repos. 10 min d'anglais de temps en temps suffisent.

---

## Phase 4 — Finitions et présentation (4 janv → 31 janv)

### S16 — 4 → 10 janv · Finitions
Soirs :
- [ ] Dernier tour de bugs
- [ ] Supprimer le code mort et les `console.log`
- [ ] `npm run lint` sans erreur
- [ ] Captures d'écran de chaque page

Week-end :
- [ ] Écrire le README (description, stack, captures, lien en ligne, installation)
- [ ] **Code freeze** : plus de nouvelle fonctionnalité

### S17 — 11 → 17 janv · Structure de la présentation
Soirs :
- [ ] Confirmer le format : durée, attentes du jury
- [ ] Plan : problem → solution → demo → tech → challenges → what I learned → next steps
- [ ] Rassembler les phrases 🎤 des semaines précédentes
- [ ] Choisir les 2–3 morceaux de code à montrer (idée : un avant/après du formulaire, de `onSubmit` + `useState` vers React 19 Actions)

Week-end :
- [ ] Premier jet des slides

### S18 — 18 → 24 janv · Slides et démo
Soirs :
- [ ] Finaliser les slides
- [ ] Écrire le scénario de la démo (quelles pages, dans quel ordre)
- [ ] Enregistrer une vidéo de la démo (plan B si Internet ou l'API tombe)
- [ ] Préparer la slide « What I learned » (React après Angular)

Week-end :
- [ ] Première répétition complète, chronométrée et enregistrée

### S19 — 25 → 31 janv · Questions du jury
Soirs :
- [ ] Lister les questions probables (pourquoi React ? pourquoi json-server ? limites ? next steps ?)
- [ ] Préparer les réponses en anglais
- [ ] S'entraîner à répondre à voix haute
- [ ] Revoir les notions encore fragiles

Week-end :
- [ ] Répétition complète n°2, en corrigeant ce qui accroche

---

## Phase 5 — Répétitions (1 fév → présentation)

### S20 — 1 → 7 fév
- [ ] Répétition devant quelqu'un (collègue, ami) et recueillir un retour
- [ ] Ajuster les slides et le timing
- [ ] 2 répétitions complètes dans la semaine
- [ ] Vérifier que le site en ligne fonctionne

### S21 — 8 fév → présentation
- [ ] Une courte répétition par jour
- [ ] Rien de nouveau dans le code
- [ ] La veille : vérifier le site, la vidéo de secours, les slides hors ligne
- [ ] Dormir 🤘

---

## Bugs & idées

> Noter ici tout ce qui est trouvé en route. On trie en S7.

- ✅ ~~(Must, S5) La page 404 plante~~ — corrigé le 19/09/2026 (import renommé `NotFound`, styles adaptés au thème sombre).
- ✅ ~~(Should, S5) HTML invalide dans la liste~~ — corrigé le 19/09/2026 (vrai `<table>`, `<td>` au lieu de `<div>`, `<Link>` sans `<button>`, attribut `header` retiré).
- (Must, S9) **Modifier un groupe puis cliquer sur « Cancel » modifie quand même ses albums et membres (en mémoire)** : dans `UpdateBandForm.jsx`, `albums` et `members` sont initialisés avec les **mêmes objets** que ceux du state `bands`, et `albumChange` / `memberChange` les modifient directement (`newAlbums[i][cat] = value`). Correction : copier les objets (`{ ...album, [cat]: value }`). Le problème existe aussi dans `AddBandForm.jsx`, mais sans conséquence visible. Même fichier : plantage si un groupe local n'a pas de tableau `albums` ou `members`.
- (Should, S9) **Les genres ne sont pas nettoyés** : `"punk, hardcore"` devient `["punk", " hardcore"]` (espace au début). Le `.map(genreStyle => genreStyle)` ne sert à rien : il faudrait `.map(genre => genre.trim())`. Ça touche l'ajout et la modification, et la modification ajoute même l'espace toute seule, puisque le champ est pré-rempli avec `join(", ")`.
- (Must, S9) **Les formulaires de recherche et de connexion rechargent toute la page** : ils n'ont pas de `onSubmit` avec `preventDefault()`. Cliquer sur « Submit » ou « Login » recharge l'app et relance les appels API.
- (Should, S9) **Le statut n'est pas le même selon la page** pour un groupe MusicBrainz : « Still Active / Split-up » dans la liste, « Active / Disbanded » dans le détail. La logique est aussi différente (`ended === null` contre `ended ?`).
- (Should, S9) CSS dupliqué : `AddBandForm.css` et `UpdateBand.css` contiennent les mêmes règles (`.input-group`, `.input-row`, `.remove-btn`, `.cancel-btn`…). À regrouper dans un seul `BandForm.css` lors de la refonte des formulaires en React 19.
- (Could, S16) Nommage des fichiers CSS : `bandsId.css`, `RandomInfo.css` et `UpdateBand.css` ne suivent pas le nom de leur composant. ⚠️ Sous Windows, un renommage qui ne change que la casse (`bandsId` → `BandsId`) doit passer par `git mv`, sinon le déploiement sous Linux cassera.
- (Could, S16) `src/index.css` est entièrement commenté mais toujours importé dans `main.jsx`. `import React` est inutile dans plusieurs fichiers (React 19 n'en a plus besoin pour le JSX).
- (Must, S6 ou S9) **json-server épinglé en `1.0.0-beta.3`** : à partir de la beta.14, le serveur ignore l'`id` envoyé par le client et en génère un autre. `AddBandForm.jsx` crée l'id avec `uuid()` et met `bandToAdd` dans le state sans lire la réponse du serveur : les ids ne correspondraient plus, et modifier ou supprimer un groupe tout juste ajouté échouerait. Correction : utiliser `response.data` (l'id vient du serveur), puis mettre json-server à jour et retirer `uuid`.
- (Should, S16) Mises à jour majeures en attente : Vite 8 + `@vitejs/plugin-react` 6 (Rolldown), ESLint 10 + `@eslint/js` 10 + `globals` 17 + `eslint-plugin-react-refresh` 0.5, `uuid` 14 (inutile si on le retire). Une à la fois, avec lint + build + test du site après chaque étape.
- (Could) Vidéo 21:25 : `use(promise)` + `<Suspense>` pour charger les groupes. ⚠️ La promesse doit être stable (créée hors du render ou mise en cache), sinon boucle infinie. À tenter seulement si tout le reste est fini.
