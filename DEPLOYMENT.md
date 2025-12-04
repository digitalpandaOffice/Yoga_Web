# Deployment Guide for Edvayu Project

## 1. Database Setup (cPanel/Hosting)
1. **Export Local DB:**
   - Go to `localhost/phpmyadmin`.
   - Export `edvayu_db` to a `.sql` file.
2. **Create Live DB:**
   - In your hosting panel, create a database (e.g., `u123_edvayu`).
   - Create a user (e.g., `u123_admin`) with password: `z179w9snao`.
   - Add user to database with **All Privileges**.
3. **Import:**
   - Open phpMyAdmin on hosting.
   - Import the `.sql` file into the new database.

## 2. Backend Deployment (PHP)
**Destination:** `public_html/api`

1. Create a folder `api` in your `public_html`.
2. Upload contents of `Yoga_Backend` to `public_html/api`.
3. **Update Connection:**
   - Edit `public_html/api/app/Config/Database.php`.
   - Update `$db_name`, `$username`, and `$password` with live details.
4. **Permissions:** Ensure `public/uploads` folder (if exists) has write permissions (755 or 777).

## 3. CMS Deployment (React)
**Destination:** `public_html/admin`

1. **Configure URL:**
   - Open `CMS_MaterLogin/src/config.js`.
   - Change `API_BASE_URL` to `'https://yourdomain.com/api'`.
2. **Build:**
   - Run `npm run build` in VS Code terminal.
3. **Upload:**
   - Create folder `admin` in `public_html`.
   - Upload the **contents** of `CMS_MaterLogin/dist` to `public_html/admin`.
4. **Routing Fix:**
   - Create a file `public_html/admin/.htaccess` with:
     ```apache
     <IfModule mod_rewrite.c>
       RewriteEngine On
       RewriteBase /admin/
       RewriteRule ^index\.html$ - [L]
       RewriteCond %{REQUEST_FILENAME} !-f
       RewriteCond %{REQUEST_FILENAME} !-d
       RewriteRule . /admin/index.html [L]
     </IfModule>
     ```

## 4. Frontend Deployment (HTML/JS)
**Destination:** `public_html` (Root)

1. **Update API URLs:**
   - Search for `http://localhost` in your `Frontend_Website/js` folder.
   - Update `API_BASE_URL` in:
     - `js/dynamic-gallery.js`
     - `js/dynamic-admit-card.js`
   - Set it to `'https://yourdomain.com/api'`.
2. **Upload:**
   - Upload all files from `Frontend_Website` to `public_html`.

## 5. Final Check
- **Website:** Visit `https://yourdomain.com`
- **CMS:** Visit `https://yourdomain.com/admin`
- **API:** Visit `https://yourdomain.com/api/content/home` (should show JSON)
