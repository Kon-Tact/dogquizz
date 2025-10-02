# Vue Starter (Vite + TypeScript + Router + Pinia)

Projet minimal pour démarrer rapidement une app Vue 3, prêt à être versionné.

## Prérequis
- **Node.js LTS 18+** (recommandé avec `nvm`)
- Un gestionnaire de paquets : `npm` (fourni avec Node), `pnpm` ou `yarn`

## Installation
```bash
# installe les dépendances
npm install
# lance le serveur de dev (http://localhost:5173)
npm run dev
# build de prod (génère le dossier dist/)
npm run build
# prévisualisation locale du build
npm run preview
```

## Structure
```
src/
  assets/        # styles & assets
  components/    # composants
  router/        # routes
  stores/        # Pinia stores
  App.vue
  main.ts
```

## Personnalisation rapide
- Change le titre dans `index.html`
- Modifie la page d'accueil : `src/components/HelloWorld.vue`
- Ajoute des routes dans `src/router/index.ts`
- Ajoute des états globaux via `src/stores/`

Bon dev ! 🚀