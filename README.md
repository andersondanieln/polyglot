<div align="center">
  <img src="public/logo-dark.svg" alt="Polyglot Air Logo" width="250">
</div>

<h3 align="center">Translate Any Text, Anywhere. Then Correct, Refine, and Summarize with AI.</h3>

<p align="center">
  Polyglot Air is a desktop application that makes high-quality, private AI translation an instant part of your workflow.
</p>

<p align="center">
  <!-- Badges -->
  <img src="https://img.shields.io/badge/AI_Translation-Fast_&_Local-50d493?style=for-the-badge" alt="AI Translation">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Electron-191970?style=for-the-badge&logo=electron&logoColor=white" alt="Electron">
  <img src="https://img.shields.io/github/v/release/andersondanieln/polyglot-air?style=for-the-badge&color=50d493" alt="Latest Release">
  <img src="https://img.shields.io/github/stars/andersondanieln/polyglot-air?style=for-the-badge&logo=github&color=50d493" alt="GitHub Stars">
</p>

<div align="center">
  <img src="public/app-gif.gif" alt="Polyglot Air Demonstration GIF" width="80%" style="border-radius: 16px; border: 1px solid #40454a; margin-top: 20px;">
</div>

---

## 📖 About the Project

Polyglot Air was born from a simple need: to make **translation** a seamless, instant part of any workflow. It eliminates the need to copy-paste text into web translators by bringing the power of large language models directly to your desktop.

By integrating with your local Ollama instance, it allows you to select any text on your screen, press a global shortcut, and have it instantly translated.

But it doesn't stop there. Polyglot Air is also a powerful writing assistant. Using simple text suffixes, you can correct grammar, change the tone of your writing, summarize long passages, and more—all with the same simple shortcut and with 100% privacy.

---

## ✨ Key Features

*   ### Core Feature: Intelligent Translation
    Instantly translate text between Portuguese, English, Spanish, and Chinese. Set a default target language for quick translations or specify one on-the-fly using suffixes like `::en` for English or `::pt` for Portuguese.

*   ### Beyond Translation: Your AI Toolkit
    Enhance your text with a suite of powerful AI actions, all accessible via simple suffixes:
    *   **Correct (`::fix`):** Automatically detect the language and fix grammar and spelling mistakes.
    *   **Change Tone (`::formal`, `::friendly`):** Rewrite text to be more professional, casual, or friendly.
    *   **Modify Length (`::summarize`, `::shorten`, `::expand`):** Get the gist of long articles, make your writing more concise, or add detail to your ideas.

*   ### 100% Local & Private
    All processing is done on your machine through Ollama. Your selected text, prompts, and generated content never leave your computer, ensuring complete privacy and data security.

*   ### Global & Seamless Workflow
    Polyglot Air works across all your applications—browsers, text editors, messengers, you name it. Select text, press the shortcut, and watch the transformation happen in place.

*   ### Polished User Experience
    A clean, modern interface with multi-language support (EN, PT, ES, ZH) and beautiful light & dark themes to match your OS preference.

---

## 📸 Visual Tour

### Light & Dark Themes
A sleek and comfortable interface that adapts to your preference, whether you work during the day or at night.

<p align="center">
  <img src="public/darkandlight.png" alt="Main Screen - Dark and Light Theme" width="75%">
  <br>
  <i>The application supports both light and dark modes.</i>
</p>

### All Commands at a Glance
A clear and accessible tutorial explains all available suffix commands, making it easy to harness the full power of the application.

<p align="center">
  <img src="public/tutorial.gif" alt="Tutorial Modal" width="75%">
  <br>
  <i>The built-in tutorial with all available actions.</i>
</p>

---

## 🚀 Installation (For Users)

1.  Go to the [**Releases**](https://github.com/andersondmn/polyglot-air/releases) page of this repository.
2.  Download the `.exe` installer file for the latest version.
3.  Run the installer and follow the instructions.

---

## 🛠️ For Developers (Development Environment)

If you want to contribute or just run the project locally, follow these steps:

### Prerequisites
*   [Node.js](https://nodejs.org/) (v18 or later recommended).
*   [Ollama](https://ollama.com/download) installed and running.
*   At least one model downloaded (e.g., `ollama pull gemma:2b`).

### Setup
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/andersondmn/polyglot-air.git
    ```

2.  **Navigate to the project folder:**
    ```bash
    cd polyglot-air
    ```

3.  **Install the dependencies:**
    ```bash
    npm install
    ```

4.  **Start the development environment:**
    ```bash
    npm run dev
    ```
    This command starts the Vite server and the Electron app simultaneously with hot-reloading.

---

## 💻 Tech Stack

*   **[Electron](https://www.electronjs.org/):** Framework for creating desktop applications.
*   **[React](https://react.dev/):** Library for building the user interface.
*   **[Vite](https://vitejs.dev/):** Frontend build tool for a fast development experience.
*   **[TypeScript](https://www.typescriptlang.org/):** For type safety and robust code.
*   **[Node.js](https://nodejs.org/):** Powers the backend logic in the Electron main process.
*   **[CSS Modules](https://github.com/css-modules/css-modules):** For scoped and conflict-free styling.
*   **[Electron-Store](https://github.com/sindreshus/electron-store):** To persist user settings.
*   **[@nut-tree/nut-js](https://nut-tree.io/):** For native keyboard simulation.

---

## 📄 License

This software is provided under a custom license.

*   **Permitted Use:** You are granted a free, perpetual, non-exclusive license to use, copy, modify, and distribute this software for **personal and non-commercial purposes only**.

*   **Commercial Use:** Any use of this software for commercial purposes is strictly prohibited without prior written permission. Commercial purposes include, but are not limited to, integrating it into a paid product, using it for business operations in a corporate environment, or reselling it.

*   **Liability:** The software is provided "as-is", without any warranty. The author is not liable for any damages arising from its use.

To request a commercial license, please contact the author at <a href="mailto:contato@andercoder.com">contato@andercoder.com</a>.

---

## 👨‍💻 Author

Made with ❤️ by **AnderCoder (Anderson Nascimento)**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/andersondn/)
&nbsp;
[![Website](https://img.shields.io/badge/Site-andercoder.com-50d493?style=for-the-badge)](https://andercoder.com)
