# Tek Communication Website

Site web professionnel pour Tek Communication - Partenaire de choix dans la sous-traitance, numérisation et conseil en République Démocratique du Congo.

## 📁 Structure du Projet

```
tek-website-new/
├── index.html              # Page d'accueil
├── css/
│   ├── style.css          # Styles principaux avec navigation sticky
│   └── pages.css          # Styles pour les pages secondaires
├── js/
│   └── main.js            # JavaScript pour navigation et interactions
├── pages/
│   ├── a-propos.html      # Page À Propos
│   ├── services.html      # Page Services
│   ├── projets.html       # Page Projets
│   └── contact.html       # Page Contact
├── images/                # Dossier pour toutes les images
│   └── IMAGES_NEEDED.txt  # Liste des images à ajouter
└── README.md              # Ce fichier
```

## 🎨 Fonctionnalités

- ✅ **HTML5 sémantique** - Structure accessible avec balises sémantiques (<main>, <article>, <section>, etc.)
- ✅ **Accessibilité (WCAG)** - Navigation au clavier, ARIA labels, skip links, contrastes respectés
- ✅ **Navigation sticky** - Le menu reste visible lors du défilement
- ✅ **Design responsive** - Compatible mobile, tablette et desktop
- ✅ **Menu dropdown** - Sous-menu pour la section Projets avec support clavier
- ✅ **Animations** - Effets de survol et transitions fluides
- ✅ **Formulaire de contact** - Validation et accessibilité améliorées
- ✅ **5 pages complètes** - Accueil, À Propos, Services, Projets, Contact
- ✅ **SEO optimisé** - Meta tags, structure sémantique, images lazy loading
- ✅ **Design professionnel** - Interface élégante avec une touche corporate

## 📸 Images Requises

Veuillez ajouter les images suivantes dans le dossier `images/` :

1. **logo.png** - Logo Tek Communication (fond transparent recommandé)
2. **favicon.ico** - Icône du site (16x16, 32x32, 48x48 en format ICO, recommandé avec logo circulaire et bordure gris foncé de 1px)
3. **hero-mining.jpg** - Photo aérienne du site minier pour la bannière principale
4. **meeting-room.jpg** - Photo de la salle de réunion avec chaises
5. **office-chairs.jpg** - Photo des 4 chaises de bureau
6. **numerisation.jpg** - Image du code binaire (Matrix style)
7. **conseil.jpg** - Image grise/texture pour conseil
8. **sous-traitance.jpg** - Photo du sol/terrain minier
9. **binary-code.jpg** - Code binaire en tunnel
10. **contract.jpg** - Photo du contrat avec stylo
11. **construction.jpg** - Photo du bulldozer sur chantier

### Création du Favicon

Pour créer un favicon avec un logo circulaire et une bordure gris foncé :
1. Utiliser un outil en ligne comme [favicon.io](https://favicon.io) ou [realfavicongenerator.net](https://realfavicongenerator.net)
2. Uploader logo2.png
3. Appliquer un border-radius: 50% pour un effet circulaire
4. Ajouter une bordure gris foncé de 1px (#2c3e50)
5. Télécharger et placer le fichier `favicon.ico` dans le dossier racine
6. Mettre à jour les liens dans les fichiers HTML de `images/logo2.png` vers `favicon.ico`

## 🚀 Déploiement sur Votre Serveur

### Option 1 : Serveur Apache

1. **Télécharger les fichiers**
   ```bash
   # Copier tous les fichiers du projet vers votre serveur
   scp -r tek-website-new/* utilisateur@votre-serveur:/var/www/html/
   ```

2. **Configuration Apache**
   ```bash
   # Vérifier que le module rewrite est activé
   sudo a2enmod rewrite
   
   # Redémarrer Apache
   sudo systemctl restart apache2
   ```

3. **Permissions**
   ```bash
   sudo chown -R www-data:www-data /var/www/html/
   sudo chmod -R 755 /var/www/html/
   ```

### Option 2 : Serveur Nginx (Recommandé)

1. **Créer le répertoire pour le site**
   ```bash
   sudo mkdir -p /var/www/tekcommunication
   ```

2. **Configuration Nginx** (`/etc/nginx/sites-available/tekcommunication`)
   ```nginx
   server {
       listen 80;
       server_name votre-domaine.com www.votre-domaine.com;
       
       root /var/www/tekcommunication;
       index index.html;
       
       # Configuration de base
       charset utf-8;
       client_max_body_size 10M;
       
       # Gestion des erreurs
       error_page 404 /404.html;
       
       # Serveur les fichiers statiques
       location / {
           try_files $uri $uri/ =404;
       }
       
       # Cache pour les fichiers statiques
       location ~* \.(jpg|jpeg|png|gif|ico|webp|svg)$ {
           expires 30d;
           add_header Cache-Control "public, immutable";
           access_log off;
       }
       
       location ~* \.(css|js)$ {
           expires 7d;
           add_header Cache-Control "public, immutable";
           access_log off;
       }
       
       # Sécurité : cacher les fichiers sensibles
       location ~ /\. {
           deny all;
           access_log off;
           log_not_found off;
       }
       
       # Compression GZIP
       gzip on;
       gzip_vary on;
       gzip_min_length 1024;
       gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
       
       # Headers de sécurité
       add_header X-Frame-Options "SAMEORIGIN" always;
       add_header X-Content-Type-Options "nosniff" always;
       add_header X-XSS-Protection "1; mode=block" always;
   }
   ```

2. **Copier les fichiers**
   ```bash
   # Depuis votre machine locale
   scp -r tek-website-new/* utilisateur@serveur:/var/www/tekcommunication/
   
   # Ou depuis le serveur, après avoir transféré l'archive
   sudo tar -xzf tek-website.tar.gz -C /var/www/tekcommunication/
   ```

3. **Configurer les permissions**
   ```bash
   sudo chown -R www-data:www-data /var/www/tekcommunication
   sudo find /var/www/tekcommunication -type d -exec chmod 755 {} \;
   sudo find /var/www/tekcommunication -type f -exec chmod 644 {} \;
   ```

4. **Activer le site**
   ```bash
   sudo ln -s /etc/nginx/sites-available/tekcommunication /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

5. **Vérifier le site**
   ```bash
   curl -I http://votre-domaine.com
   ```

### Option 3 : Hébergement Simple (cPanel/Plesk)

1. Compresser le dossier `tek-website-new` en ZIP
2. Se connecter au panneau de contrôle (cPanel/Plesk)
3. Aller dans "Gestionnaire de fichiers"
4. Naviguer vers `public_html` ou `www`
5. Télécharger et extraire le fichier ZIP
6. Vérifier les permissions (755 pour dossiers, 644 pour fichiers)

### Option 4 : Serveur local de test

Pour tester localement avant déploiement :

```bash
# Avec Python 3
cd tek-website-new
python3 -m http.server 8000

# Avec Node.js (installer http-server d'abord)
npx http-server -p 8000

# Avec PHP
php -S localhost:8000
```

Puis ouvrir http://localhost:8000 dans votre navigateur.

## 🔒 Configuration HTTPS (Recommandé)

Pour sécuriser votre site avec SSL/TLS :

### Avec Let's Encrypt (Gratuit)

```bash
# Installer Certbot
sudo apt install certbot python3-certbot-apache  # Pour Apache
# ou
sudo apt install certbot python3-certbot-nginx   # Pour Nginx

# Obtenir le certificat
sudo certbot --apache -d votre-domaine.com -d www.votre-domaine.com
# ou
sudo certbot --nginx -d votre-domaine.com -d www.votre-domaine.com

# Le renouvellement automatique est configuré par défaut
```

## 📧 Configuration du Formulaire de Contact

Le formulaire de contact est actuellement en mode démo. Pour le rendre fonctionnel :

### Option 1 : Script PHP simple

Créer `contact-handler.php` :
```php
<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $message = htmlspecialchars($_POST['message']);
    
    $to = "contact@tekcommunication.cd";
    $subject = "Nouveau message depuis le site web";
    $body = "Nom: $name\nEmail: $email\nMessage:\n$message";
    $headers = "From: $email";
    
    if (mail($to, $subject, $body, $headers)) {
        echo "Message envoyé avec succès!";
    } else {
        echo "Erreur lors de l'envoi.";
    }
}
?>
```

Mettre à jour dans `pages/contact.html` :
```javascript
document.getElementById('contact-form').setAttribute('action', '../contact-handler.php');
document.getElementById('contact-form').setAttribute('method', 'POST');
```

### Option 2 : Service externe (Formspree, EmailJS)

Intégrer un service comme [Formspree](https://formspree.io) ou [EmailJS](https://www.emailjs.com/) qui gère l'envoi d'emails sans backend.

## 🛠️ Personnalisation

### Changer les couleurs

Modifier dans `css/style.css` :
```css
:root {
    --primary-red: #e63946;      /* Rouge principal */
    --primary-blue: #4a9eff;     /* Bleu du logo */
    --dark-text: #1a1a1a;        /* Texte foncé */
    --light-gray: #f5f5f5;       /* Gris clair */
}
```

### Modifier le contenu

- Ouvrir les fichiers HTML dans un éditeur de texte
- Modifier le texte entre les balises
- Sauvegarder et recharger la page

### Ajouter des sections

Utiliser les classes CSS existantes pour maintenir la cohérence du design.

## 📱 Compatibilité

- ✅ Chrome / Edge (dernières versions)
- ✅ Firefox (dernières versions)
- ✅ Safari (dernières versions)
- ✅ Mobile iOS & Android

## 🐛 Support

Pour toute question ou problème :
- Email : contact@tekcommunication.cd
- Téléphone : +243 XXX XXX XXX

## 📄 Licence

© 2025 Tek Communication Sarl - Tous droits réservés

---

**Développé avec ❤️ pour Tek Communication**


