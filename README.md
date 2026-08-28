# Hit & Blow | 4-Digit Codebreaker Game

[日本語版 README (README.ja.md)](README.ja.md)

A modern, responsive web-based implementation of the classic **Hit & Blow** (also known as *Bulls and Cows* or numeric *Mastermind*) codebreaking game.

![Hit & Blow](https://img.shields.io/badge/Game-Hit%20%26%20Blow-0284c7?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## 🎮 Game Rules

The goal of Hit & Blow is to deduce a hidden **4-digit secret number** in as few attempts (turns) as possible.

- The secret code consists of 4 unique digits between `0` and `9` (no duplicate digits).
- For each guess you make, the game returns clues in **Hits** and **Blows**:
  - **Hit (H)**: A correct digit in the **exact position**.
  - **Blow (B)**: A correct digit in the **wrong position**.

### Example
If the secret number is **`4821`**:
- Guess **`1890`** ➔ **1 Hit, 1 Blow** (Digit `8` is a Hit; digit `1` is a Blow).
- Guess **`4812`** ➔ **2 Hits, 2 Blows** (Digits `4` and `8` are Hits; `1` and `2` are Blows).
- Guess **`4821`** ➔ **4 Hits, 0 Blows** (Cipher Solved! 🎉).

---

## ✨ Features

- 🌓 **Dark & Light Theme**:
  - Light mode enabled by default.
  - Smooth toggle between light and dark themes using the header button (`☀️` / `🌙`).
  - Automatically persists user theme choice in `localStorage`.
- 🌐 **Internationalization (i18n)**:
  - Automatically displays Japanese for Japanese browsers (`ja`) and English for all other languages.
  - Manual language switch button (`JA` / `EN`) in the header.
  - Fully translated UI, stat labels, validation messages, and victory celebrations.
- 🔊 **Web Audio API Synthesizer**:
  - Native sound effects generated via Web Audio API oscillators (no external audio assets required).
  - Includes click, guess, error, and victory fanfares.
  - Mute / unmute audio toggle button (`🔊` / `🔇`).
- 🎊 **Interactive Particle Celebration**:
  - Fullscreen HTML5 canvas particle celebration upon solving the puzzle.
  - Dynamic celebration tiers based on performance:
    - 🌌 **Miracle Clear** (1 Turn)
    - ⚡ **Excellent** (2–5 Turns)
    - ✨ **Great Job** (6–10 Turns)
    - 🎯 **Mission Complete** (11+ Turns)
- 📊 **Statistics & History**:
  - Live turn counter and history log.
  - Best record (fewest turns) and total games played tracking via `localStorage`.
- 📱 **Modern Glassmorphism Design**:
  - Responsive design optimized for mobile and desktop displays.
  - Beautiful typography with Google Fonts (*Outfit* and *JetBrains Mono*).
- 📈 **Google Tag Manager Support**:
  - Configurable `GTM_ID` loaded from `config.js`.

---

## 🚀 Getting Started

### Prerequisites
All you need is a modern web browser (Chrome, Firefox, Safari, Edge).

### Installation & Running Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/hit-blow.git
   cd hit-blow
   ```

2. **(Optional) Configure Google Tag Manager**:
   Create a `config.js` file in the root directory:
   ```javascript
   const GTM_ID = 'GTM-XXXXXXX';
   ```

3. **Launch the game**:
   - Open `index.html` directly in your browser:
     ```bash
     # macOS
     open index.html
     # Linux
     xdg-open index.html
     # Windows
     start index.html
     ```
   - Or serve with any local HTTP server:
     ```bash
     # Python 3
     python3 -m http.server 8000

     # Node.js (npx serve)
     npx serve .
     ```

---

## 📁 Project Structure

```text
hit-blow/
├── index.html        # Main HTML structure & GTM integration
├── style.css         # Styling, glassmorphism UI, light/dark themes
├── script.js         # Game logic, i18n, Web Audio, canvas particle system
├── config.js         # (Optional / Gitignored) GTM configuration
├── README.md         # English documentation
└── README.ja.md      # Japanese documentation
```

---

## 🛠️ Built With

- **HTML5** & **CSS3** (CSS Custom Properties, Glassmorphism, Flexbox / Grid)
- **Vanilla JavaScript** (ES6+, Web Audio API, Canvas API, Web Storage API)
- **Google Fonts** (`Outfit`, `JetBrains Mono`)

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
