# LinkVolt ⚡

**LinkVolt** is a secure, full-stack file and text sharing application designed for privacy and control. It allows users to upload content and generate shareable links with advanced security features like expiration times, view limits, and password protection.

## 🚀 Features

### Core Functionality
- **📂 File & Text Sharing:** Upload files (images, PDFs, archives) or paste text/code snippets.
- **⏳ Auto-Expiration:** Set links to automatically expire after a specific time (e.g., 10 mins, 1 hour, 1 day).
- **🔗 Unique Links:** Generates short, unique URLs for easy sharing.

### 🛡️ Advanced Security (Bonus Features)
- **🔥 Burn After Reading:** Create "One-Time View" links that permanently delete themselves after being opened once.
- **👁️ Max View Limits:** Restrict the number of times a link can be accessed before it expires.
- **🔒 Password Protection:** Secure your links with a custom password (hashed using bcrypt).
- **✅ Input Validation:** Strict allow-list for file types (JPG, PNG, PDF, ZIP, etc.) and size limits (5MB) to prevent abuse.

### 👤 User Authentication
- **🔐 User Accounts:** Secure Registration and Login system using **JWT (JSON Web Tokens)**.
- **📊 Dashboard:** Logged-in users can view a list of all their active uploads.
- **🗑️ Management:** Users can manually delete their files before they expire.
- **Guest Mode:** Users can still upload and share files without creating an account (limited management).

---

## 🛠️ Tech Stack

- **Frontend:** React.js (Vite), Tailwind CSS, Axios, React Router DOM
- **Backend:** Node.js, Express.js
- **Database:** SQLite (Lightweight, zero-configuration)
- **Authentication:** JWT, Bcrypt.js
- **File Handling:** Multer

---

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### 1. Prerequisites
Ensure you have **Node.js** installed on your machine.

### 2. Clone the Repository
```bash
git clone [https://github.com/your-username/LinkVolt.git](https://github.com/your-username/LinkVolt.git)
cd LinkVolt