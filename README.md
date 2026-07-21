# Site WizExpert — HTML statique (GitHub Pages)

Site vitrine de WizExpert reconstruit en HTML statique, prêt à héberger sur **GitHub Pages** (gratuit).

## Contenu

| Page | Fichier | URL finale |
|------|---------|-----------|
| Accueil | `index.html` | `/` |
| WizTax | `wiz-tax/index.html` | `/wiz-tax` |
| WizValue | `wiz-value/index.html` | `/wiz-value` |
| WizApp | `wiz-app/index.html` | `/wiz-app` *(à venir)* |
| Pages légales | `mentions-legales/`, `cgv-*/`, `politique-de-confidentialite/` | *(à venir)* |

`.nojekyll` force GitHub Pages à servir les fichiers tels quels (sous-dossiers inclus).

---

## Mise en ligne — Méthode A : Git (recommandée)

1. Crée un dépôt **vide** sur github.com (ex. `wiz-expert-site`), sans README.
2. Dans ce dossier, lance :

```bash
git remote add origin https://github.com/TON-COMPTE/wiz-expert-site.git
git branch -M main
git push -u origin main
```

## Méthode B : sans Git (glisser-déposer)

1. Crée un dépôt sur github.com.
2. « Add file » → « Upload files » → glisse **tout le contenu** de ce dossier.
3. Commit.

---

## Activer GitHub Pages

Dans le dépôt : **Settings → Pages → Build and deployment → Source : Deploy from a branch → Branch : `main` / `(root)`** → Save.

Ton site sera en ligne sur `https://TON-COMPTE.github.io/wiz-expert-site/` en ~1 minute.

---

## Domaine wiz-expert.com (étape finale, après validation)

⚠️ **Ne pas toucher aux enregistrements MX** (emails Google Workspace) — on ne modifie que les enregistrements web.

1. Dans **Settings → Pages → Custom domain** : saisir `www.wiz-expert.com` → Save (GitHub crée un fichier `CNAME`).
2. Chez **Squarespace (DNS)** :
   - `CNAME` `www` → `TON-COMPTE.github.io`
   - Pour l'apex `wiz-expert.com`, 4 enregistrements `A` vers : `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
3. Cocher **Enforce HTTPS** une fois le certificat émis.

Le basculement met tout en ligne d'un coup, sans coupure ; Framer continue de servir jusqu'à ce que le DNS pointe sur GitHub.
