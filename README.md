# Gîte de l'Ormoy — Site Web

Site vitrine du Gîte de l'Ormoy, meublé de tourisme 4★ en Sologne & Berry.

Construit avec [Astro](https://astro.build) + React + Tailwind CSS.

---

## 🚀 Démarrage rapide

```bash
# Installer les dépendances
npm install

# Lancer en local
npm run dev
# → http://localhost:4321

# Builder pour la production
npm run build

# Prévisualiser le build
npm run preview
```

---

## 📁 Structure du projet

```
src/
├── pages/              ← Pages du site (.astro)
│   ├── index.astro     ← Accueil
│   ├── le-gite.astro
│   ├── galerie.astro
│   ├── services.astro
│   ├── tarifs.astro
│   ├── contact.astro
│   └── blog/
│       ├── index.astro      ← Liste des articles
│       └── [slug].astro     ← Article dynamique
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   ├── home/
│   │   ├── HeroSection.jsx
│   │   ├── IntroSection.jsx
│   │   ├── ServicesSection.jsx
│   │   ├── TestimonialsSection.jsx
│   │   ├── NearbySection.jsx
│   │   └── CTASection.jsx
│   ├── ContactForm.jsx      ← Formulaire Formspree
│   └── GalerieGrid.jsx      ← Galerie avec lightbox
├── content/
│   ├── config.ts            ← Schéma des articles de blog
│   └── blog/                ← Articles en Markdown (.md)
├── layouts/
│   └── BaseLayout.astro     ← Layout de base (SEO, meta)
└── styles/
    └── global.css
```

---

## ✍️ Ajouter un article de blog

Créer un fichier `.md` dans `src/content/blog/` :

```markdown
---
title: "Titre de l'article"
description: "Résumé court pour le SEO"
pubDate: 2024-10-15
category: activites  # activites | region | sejour | conseils
readingTime: 5       # en minutes
image: "https://..."
tags: ["sologne", "nature"]
---

Contenu de l'article en Markdown...
```

L'article sera automatiquement disponible à `/blog/mon-slug`.

---

## 📬 Configurer le formulaire de contact (Formspree)

1. Créer un compte gratuit sur [formspree.io](https://formspree.io)
2. Créer un nouveau formulaire et copier l'ID
3. Ouvrir `src/components/ContactForm.jsx`
4. Remplacer `YOUR_FORM_ID` par ton ID Formspree

---

## 🌐 Déploiement sur GitHub Pages

1. Pousser le code sur GitHub (branche `main`)
2. Dans les **Settings** du repo → **Pages** → Source : **GitHub Actions**
3. Le site se déploie automatiquement à chaque push

Pour lier le domaine `gitedelormoy.fr` :
- Dans Settings → Pages → Custom domain → entrer `www.gitedelormoy.fr`
- Configurer chez OVH les DNS : CNAME `www` → `[username].github.io`

---

## 🎨 Palette de couleurs

| Couleur | Valeur |
|---------|--------|
| Vert primaire | `hsl(150, 25%, 28%)` |
| Beige fond | `hsl(40, 30%, 97%)` |
| Accent doré | `hsl(38, 50%, 75%)` |

Typographies : **Cormorant Garamond** (titres) + **Inter** (corps)
