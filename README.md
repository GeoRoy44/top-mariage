# Top Mariage

Site éditorial statique construit avec Astro, Markdown Content Collections et Cloudflare Workers Assets.

## Prérequis

- Node.js 20 ou supérieur
- npm 10 ou supérieur
- Un compte Cloudflare avec le domaine `top-mariage.fr`

## Développement local

```bash
npm install
npm run check
npm run build
npm run dev
```

La commande `npm install` crée `package-lock.json`. Commitez ce fichier avant de connecter Cloudflare Workers Builds : un lockfile est obligatoire pour garantir des builds reproductibles.

## Publication d’un article

1. Créez un fichier `src/content/blog/mon-slug.md`.
2. Utilisez un frontmatter valide avec `draft: false`.
3. Poussez le fichier sur la branche `main`.
4. Cloudflare Workers Builds exécute `npm run build` puis `npx wrangler deploy`.
5. L’article est généré automatiquement sur `https://top-mariage.fr/blog/mon-slug/`.

Aucune page Astro supplémentaire n’est nécessaire. Les pages `/blog/`, les pages catégories, `/plan-du-site/` et le sitemap sont générés depuis la collection `blog` et excluent automatiquement les brouillons.

## Configuration Cloudflare Workers Builds

Configurez un Worker connecté au dépôt GitHub `GeoRoy44/top-mariage` avec :

```text
Production branch: main
Root directory: /
Build command: npm run build
Deploy command: npx wrangler deploy
```

Ajoutez ensuite les domaines personnalisés dans Cloudflare :

```text
top-mariage.fr
www.top-mariage.fr
```

Le fichier `wrangler.jsonc` sert les assets générés depuis `dist/client`, sans SSR, fallback SPA ni Worker applicatif pour les routes de blog.

## Contrôles avant déploiement

```bash
npm run check
npm run build
find dist/client -path '*blog/organisation-mariage/index.html'
find dist/client -name 'sitemap-index.xml'
```

Le build doit générer notamment :

```text
dist/client/blog/organisation-mariage/index.html
dist/client/sitemap-index.xml
```
