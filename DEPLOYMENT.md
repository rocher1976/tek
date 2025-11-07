# Guide de Déploiement - Tek Communication

## 🚀 Déploiement Rapide

### Avant de commencer

✅ **Checklist pré-déploiement :**
- [ ] Toutes les images ont été ajoutées dans `/images/`
- [ ] Le logo a été personnalisé
- [ ] Les informations de contact ont été mises à jour
- [ ] Les numéros de téléphone ont été modifiés
- [ ] L'adresse email a été configurée
- [ ] Le formulaire de contact a été testé localement

### Étape 1 : Préparer les fichiers

```bash
# Créer une archive du site
cd ~/tek-website-new
tar -czf tek-website.tar.gz *

# Ou créer un ZIP
zip -r tek-website.zip *
```

### Étape 2 : Transférer vers le serveur

#### Via FTP/SFTP (FileZilla, Cyberduck, etc.)
```
Hôte : ftp.votre-domaine.com
Port : 21 (FTP) ou 22 (SFTP)
Utilisateur : votre_utilisateur
Mot de passe : votre_mot_de_passe

Dossier de destination : /public_html/ ou /www/ ou /var/www/html/
```

#### Via SSH/SCP
```bash
# Transférer l'archive
scp tek-website.tar.gz user@serveur:/chemin/destination/

# Se connecter au serveur
ssh user@serveur

# Extraire l'archive
cd /var/www/html
tar -xzf tek-website.tar.gz
rm tek-website.tar.gz
```

### Étape 3 : Configurer les permissions

```bash
# Sur le serveur
sudo chown -R www-data:www-data /var/www/html/
sudo find /var/www/html/ -type d -exec chmod 755 {} \;
sudo find /var/www/html/ -type f -exec chmod 644 {} \;
```

### Étape 4 : Tester le site

Ouvrir votre navigateur et aller sur :
- http://votre-domaine.com
- Tester toutes les pages
- Vérifier que les images s'affichent
- Tester le menu responsive sur mobile
- Essayer le formulaire de contact

---

## 🌐 Configuration du Nom de Domaine

### Chez votre registrar (OVH, Namecheap, GoDaddy, etc.)

Configurer les DNS pour pointer vers votre serveur :

```
Type    Nom         Valeur              TTL
A       @           123.456.789.123     3600
A       www         123.456.789.123     3600
```

Remplacer `123.456.789.123` par l'IP de votre serveur.

⏱️ La propagation DNS peut prendre 24-48 heures.

---

## 🔐 Configuration SSL/HTTPS avec Let's Encrypt

### Sur Ubuntu/Debian avec Apache

```bash
# Installer Certbot
sudo apt update
sudo apt install certbot python3-certbot-apache

# Obtenir le certificat
sudo certbot --apache -d tekcommunication.cd -d www.tekcommunication.cd

# Suivre les instructions à l'écran
# Choisir : Redirect - Make all requests redirect to secure HTTPS
```

### Sur Ubuntu/Debian avec Nginx

```bash
# Installer Certbot
sudo apt install certbot python3-certbot-nginx

# Obtenir le certificat
sudo certbot --nginx -d tekcommunication.cd -d www.tekcommunication.cd
```

### Renouvellement automatique

```bash
# Tester le renouvellement
sudo certbot renew --dry-run

# Le renouvellement automatique est configuré via cron
```

---

## 📧 Configuration du Formulaire de Contact

### Option 1 : Script PHP (serveur avec PHP)

1. Créer `/contact-handler.php` :

```php
<?php
header('Content-Type: application/json');

// Configuration
$to_email = "contact@tekcommunication.cd";
$from_name = "Site Web Tek Communication";

// Validation
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Méthode non autorisée"]);
    exit;
}

// Récupération et nettoyage des données
$name = htmlspecialchars(trim($_POST['name'] ?? ''));
$email = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$phone = htmlspecialchars(trim($_POST['phone'] ?? ''));
$company = htmlspecialchars(trim($_POST['company'] ?? ''));
$service = htmlspecialchars(trim($_POST['service'] ?? ''));
$message = htmlspecialchars(trim($_POST['message'] ?? ''));

// Validation
if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Tous les champs obligatoires doivent être remplis"]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Email invalide"]);
    exit;
}

// Préparation de l'email
$subject = "Nouveau message depuis le site web - $service";
$body = "
Nouveau message reçu depuis le site web Tek Communication

Nom: $name
Email: $email
Téléphone: $phone
Entreprise: $company
Service concerné: $service

Message:
$message

---
Envoyé depuis le formulaire de contact
";

$headers = [
    "From: $from_name <noreply@tekcommunication.cd>",
    "Reply-To: $name <$email>",
    "Content-Type: text/plain; charset=UTF-8"
];

// Envoi de l'email
if (mail($to_email, $subject, $body, implode("\r\n", $headers))) {
    echo json_encode([
        "success" => true,
        "message" => "Merci pour votre message! Nous vous répondrons dans les plus brefs délais."
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Une erreur est survenue lors de l'envoi. Veuillez réessayer."
    ]);
}
?>
```

2. Mettre à jour `pages/contact.html` :

```javascript
// Remplacer le script existant par :
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const button = this.querySelector('button[type="submit"]');
    button.disabled = true;
    button.textContent = 'ENVOI...';
    
    fetch('../contact-handler.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        if (data.success) {
            this.reset();
        }
    })
    .catch(error => {
        alert('Erreur réseau. Veuillez réessayer.');
    })
    .finally(() => {
        button.disabled = false;
        button.textContent = 'ENVOYER';
    });
});
```

### Option 2 : Formspree (Sans backend)

1. S'inscrire sur [Formspree.io](https://formspree.io)
2. Créer un nouveau formulaire
3. Copier l'URL fournie (ex: `https://formspree.io/f/xyzabc123`)
4. Modifier `pages/contact.html` :

```html
<form class="contact-form" id="contact-form" 
      action="https://formspree.io/f/VOTRE_ID" 
      method="POST">
```

### Option 3 : EmailJS (Sans backend)

Suivre la documentation sur [EmailJS.com](https://www.emailjs.com/docs/)

---

## 📊 Ajout de Google Analytics (Optionnel)

1. Créer un compte sur [Google Analytics](https://analytics.google.com)
2. Obtenir votre ID de suivi (ex: `G-XXXXXXXXXX`)
3. Ajouter avant `</head>` dans tous les fichiers HTML :

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 🔍 Configuration SEO Supplémentaire

### Créer sitemap.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://tekcommunication.cd/</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://tekcommunication.cd/pages/a-propos.html</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://tekcommunication.cd/pages/services.html</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://tekcommunication.cd/pages/projets.html</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://tekcommunication.cd/pages/contact.html</loc>
    <priority>0.8</priority>
  </url>
</urlset>
```

### Créer robots.txt

```
User-agent: *
Allow: /

Sitemap: https://tekcommunication.cd/sitemap.xml
```

---

## 🐛 Résolution de Problèmes

### Les images ne s'affichent pas
- Vérifier les noms de fichiers (sensible à la casse)
- Vérifier les extensions (.jpg vs .jpeg)
- Vérifier les permissions (644 pour les fichiers)

### Le menu ne fonctionne pas sur mobile
- Vérifier que `js/main.js` est bien chargé
- Ouvrir la console du navigateur (F12) pour voir les erreurs

### Le site n'est pas accessible
- Vérifier la configuration DNS
- Vérifier que le serveur web est démarré
- Vérifier les permissions des fichiers

### Erreur 500
- Vérifier les logs du serveur : `/var/log/apache2/error.log`
- Vérifier la syntaxe du fichier `.htaccess`

---

## 📞 Support

Pour toute assistance :
- Email : contact@tekcommunication.cd
- Documentation complète : README.md

---

**Bonne chance avec votre déploiement! 🚀**


