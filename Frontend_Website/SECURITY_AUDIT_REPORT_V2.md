# Security Audit Report V2: Edvayu Educational Foundations Website

**Date:** 2025-12-11
**Target:** Complete System (Frontend, Backend API, CMS)
**Auditor:** Antigravity AI
**Status:** 🚨 CRITICAL VULNERABILITIES DETECTED

## 1. Executive Summary
A second, more exhaustive audit revealed that the security posture of the application is **critically compromised**. While the database interaction layer is secure against SQL Injection, the **Application Layer (API)** lacks almost all necessary access controls. 
**Any user on the internet can currently delete results, modify site settings, and upload files without logging in.**

## 2. Critical Vulnerabilities (Immediate Action Required)

### 🚨 2.1. Missing Authorization on Administrative Endpoints (IDOR / Broken Access Control)
*   **Severity:** **CRITICAL** (Score: 10/10)
*   **Location:** Almost ALL Backend Controllers (`Settings.php`, `Results.php`, `Franchise.php`, etc.)
*   **Issue:** Responsive methods like `update()`, `create()`, and `delete()` **do not check if the user is logged in**. They only check if the request method is `POST`.
*   **Evidence:** 
    *   `c:\xampp\htdocs\Yoga_Web\Yoga_Backend\app\Controllers\Results.php`: The `delete()` function accepts a POST request and immediately deletes a record based on `id` param.
    *   `c:\xampp\htdocs\Yoga_Web\Yoga_Backend\app\Controllers\Settings.php`: The `update()` function allows overwriting any site setting.
*   **Impact:** An attacker can remotely wipe your database content, deface the website, or change admin credentials without ever authenticating.
*   **Recommendation:** Create a `Middleware` or `BaseController` check that verifies a valid Session or JWT Token before allowing access to `create`, `update`, or `delete` methods.

### 🚨 2.2. Systemic Stored Cross-Site Scripting (XSS)
*   **Severity:** **HIGH** (Score: 8/10)
*   **Location:** Widespread across Frontend JS files.
*   **Issue:** The use of `.innerHTML` to render API data is systemic.
*   **Evidence:** `grep` search found **76+ instances** of `innerHTML` in files including:
    *   `js/dynamic-alumni.js`
    *   `js/dynamic-careers.js`
    *   `js/dynamic-exam-dates.js`
    *   `files: gallarysection.html, exam_eligibility.html`
*   **Impact:** While `index.html` and `contact.html` were fixed, the rest of the site handles user-controlled data unsafeley. If an attacker uses the "Missing Authorization" (2.1) to inject malicious scripts into the DB (e.g., as a "Career" or "Event"), that script will execute for every visitor.
*   **Recommendation:** Apply the `escapeHtml` helper function (introduced in `index.html`) to **ALL** dynamic rendering scripts in the `js/` folder.

### 🚨 2.3. Broken Authentication System
*   **Severity:** **HIGH**
*   **Location:** `app/Controllers/Auth.php`
*   **Issue:** (Reconfirmed) The login system returns a hardcoded `dummy_token_for_now`. There is no actual session management code implemented.
*   **Impact:** Even if you added checks to Controllers, the current token is useless for validating identity.
*   **Recommendation:** Implement `firebase/php-jwt` to generate real signed tokens and validate them on every request.

## 3. Moderate Severity Issues

### 🟠 3.1. Sensitive Data Exposure (Results)
*   **Severity:** Medium
*   **Location:** `app/Controllers/Results.php` -> `check()`
*   **Issue:** Public endpoint allows checking results with simple parameters (Roll No, Year).
*   **Impact:** Susceptible to enumeration attacks. An attacker could script a loop through Roll Numbers to scrape all student marks.
*   **Recommendation:** Implement Rate Limiting (e.g., max 5 requests per minute per IP) and CAPTCHA on the frontend query form.

### 🟠 3.2. Unrestricted File Uploads (Partial)
*   **Severity:** Medium
*   **Location:** `app/Controllers/Media.php`
*   **Issue:** Relies on `$_FILES['type']` which can be spoofed.
*   **Impact:** An attacker could upload a PHP shell named `image.jpg.php` (if server config is weak) or spoof MIME types to upload malicious executables.
*   **Recommendation:** Use server-side MIME detection (`finfo`) and rename files to random hashes (which is partially implemented).

## 4. Positive Findings (Good News)
*   ✅ **SQL Injection Safe:** The codebase consistently uses `PDO` with Prepared Statements (e.g., `User.php`, `Result.php`). This protects against standard SQL injection attacks properly.
*   ✅ **Password Hashing:** `password_hash` and `password_verify` are used correctly for storing admin credentials.
*   ✅ **Token Hiding:** `User.php` correctly `unsets` the password and token from the user object before returning it (mostly).

## 5. Remediation Roadmap

1.  **Phase 1 (Lockdown):**
    *   Implement `AuthMiddleware` in PHP.
    *   Add `if (!AuthMiddleware::validate()) return;` to the top of EVERY `create/update/delete` controller method.
2.  **Phase 2 (True Auth):**
    *   Replace `dummy_token` with real JWT generation.
3.  **Phase 3 (Sanitization):**
    *   Refactor all `js/dynamic-*.js` files to use `textContent` or `escapeHtml`.

---
**Report Generated by Antigravity AI**
