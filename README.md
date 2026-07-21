# Site WizExpert — HTML statique (GitHub Pages)

Site vitrine de WizExpert reconstruit en HTML statique, hébergé sur **GitHub Pages**.

## Pages

| Page | Fichier | URL |
|------|---------|-----|
| Accueil | `index.html` | `/` |
| WizApp | `wiz-app/index.html` | `/wiz-app` |
| WizValue | `wiz-value/index.html` | `/wiz-value` |
| WizTax | `wiz-tax/index.html` | `/wiz-tax` |
| CGV (unifiées, tous produits) | `cgv/index.html` | `/cgv` |
| Mentions légales | `mentions-legales/index.html` | `/mentions-legales` |
| Politique de confidentialité | `politique-de-confidentialite/index.html` | `/politique-de-confidentialite` |

`.nojekyll` force GitHub Pages à servir les sous-dossiers tels quels. `CNAME` contient `www.wiz-expert.com`.

## Déploiement

Le site est déjà en ligne. Pour publier une modification :

```bash
git add .
git commit -m "maj"
git push
```

GitHub Pages redéploie automatiquement en ~1 minute.
