document.addEventListener('DOMContentLoaded', () => {
    // i18n Translations Dictionary
    const i18n = {
        ja: {
            docTitle: 'Hit & Blow | 4桁の暗号解読ゲーム',
            codebreakerTag: 'CODEBREAKER',
            bestRecord: 'BEST RECORD',
            currentTurn: 'CURRENT TURN',
            gamesPlayed: 'GAMES PLAYED',
            subtitle: '重複のない4桁の数字（0〜9）を予想してください。',
            guessPlaceholder: '例: 1234',
            guessBtn: '予想する',
            historyTitle: '試行履歴',
            emptyHistory: '数字を入力して「予想する」を押してください',
            turnUnit: 'ターン',
            emptyBest: '-- ターン',
            historyCountUnit: '件',
            errorDigits: '4桁の数字を入力してください。',
            errorDuplicate: '重複しない4桁の数字を入力してください。',
            modalClearTurns: 'クリアターン数',
            modalSecretNumber: '正解の数字',
            resetBtn: '新しいゲームを始める',
            langBtnLabel: 'JA',
            langBtnTitle: '言語切り替え / Switch Language (現在: 日本語)',
            themeDarkTitle: 'ライトテーマに切り替え',
            themeLightTitle: 'ダークテーマに切り替え',
            soundOnTitle: 'サウンドをミュート',
            soundOffTitle: 'サウンドをオン',
            celebrations: {
                miracle: {
                    badge: '🌌 MIRACLE CLEAR 🌌',
                    title: '🎉 奇跡の1ターン解読！！ 🎉',
                    message: '1ターンで解読成功とは…！<br>あなたは神レベルの洞察力と直感の持ち主です！'
                },
                excellent: (turns) => ({
                    badge: '⚡ EXCELLENT ⚡',
                    title: '🎊 素晴らしい成果です！ 🎊',
                    message: `わずか <strong>${turns} ターン</strong> で解読成功！<br>超一流の推理力とお見事な分析力です！`
                }),
                great: (turns) => ({
                    badge: '✨ GREAT JOB ✨',
                    title: '✨ おめでとうございます！ ✨',
                    message: `<strong>${turns} ターン</strong> で解読成功！<br>確かな理論で暗号を見事に破りました。`
                }),
                complete: (turns) => ({
                    badge: '🎯 MISSION COMPLETE 🎯',
                    title: '解読成功！',
                    message: `<strong>${turns} ターン</strong> で正解にたどり着きました。<br>根気強いアプローチで見事勝利です！`
                })
            }
        },
        en: {
            docTitle: 'Hit & Blow | 4-Digit Code Breaker',
            codebreakerTag: 'CODEBREAKER',
            bestRecord: 'BEST RECORD',
            currentTurn: 'CURRENT TURN',
            gamesPlayed: 'GAMES PLAYED',
            subtitle: 'Guess the 4-digit secret number (0–9) with unique digits.',
            guessPlaceholder: 'e.g. 1234',
            guessBtn: 'Guess',
            historyTitle: 'Guess History',
            emptyHistory: 'Enter 4 digits and click "Guess"',
            turnUnit: 'turns',
            emptyBest: '-- turns',
            historyCountUnit: 'guesses',
            errorDigits: 'Please enter a 4-digit number.',
            errorDuplicate: 'Please enter 4 unique digits without duplicates.',
            modalClearTurns: 'Turns Taken',
            modalSecretNumber: 'Secret Code',
            resetBtn: 'Play Again',
            langBtnLabel: 'EN',
            langBtnTitle: 'Switch Language / 言語切り替え (Current: English)',
            themeDarkTitle: 'Switch to Light Theme',
            themeLightTitle: 'Switch to Dark Theme',
            soundOnTitle: 'Mute Sound',
            soundOffTitle: 'Enable Sound',
            celebrations: {
                miracle: {
                    badge: '🌌 MIRACLE CLEAR 🌌',
                    title: '🎉 1-Turn Miracle Solve!! 🎉',
                    message: 'Solved on the very first try...!<br>You have legendary intuition and insight!'
                },
                excellent: (turns) => ({
                    badge: '⚡ EXCELLENT ⚡',
                    title: '🎊 Outstanding Work! 🎊',
                    message: `Decoded in only <strong>${turns} turns</strong>!<br>Top-tier deduction and analytical skills!`
                }),
                great: (turns) => ({
                    badge: '✨ GREAT JOB ✨',
                    title: '✨ Congratulations! ✨',
                    message: `Decoded in <strong>${turns} turns</strong>!<br>Solid logic successfully broke the cipher.`
                }),
                complete: (turns) => ({
                    badge: '🎯 MISSION COMPLETE 🎯',
                    title: 'Mission Complete!',
                    message: `Reached the solution in <strong>${turns} turns</strong>.<br>Persistent deduction earned the win!`
                })
            }
        }
    };

    // DOM Elements
    const guessInput = document.getElementById('guess-input');
    const guessButton = document.getElementById('guess-button');
    const historyList = document.getElementById('history-list');
    const historyCount = document.getElementById('history-count');
    const emptyHistory = document.getElementById('empty-history');
    const messageArea = document.getElementById('message-area');
    const currentTurnEl = document.getElementById('current-turn');
    const bestScoreEl = document.getElementById('best-score');
    const gamesPlayedEl = document.getElementById('games-played');
    
    // Header Action Buttons
    const langToggleBtn = document.getElementById('lang-toggle');
    const langIcon = document.getElementById('lang-icon');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const soundToggleBtn = document.getElementById('sound-toggle');
    const soundIcon = document.getElementById('sound-icon');
    
    // Victory Modal Elements
    const victoryModal = document.getElementById('victory-modal');
    const modalBadge = document.getElementById('modal-celebration-badge');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const modalTurns = document.getElementById('modal-turns');
    const modalSecret = document.getElementById('modal-secret');
    const resetButton = document.getElementById('reset-button');
    
    // Canvas
    const canvas = document.getElementById('celebration-canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;

    // State Variables
    let secret = '';
    let turn = 0;
    let gamesPlayed = parseInt(localStorage.getItem('hitblow_games_played') || '0', 10);
    let bestScore = localStorage.getItem('hitblow_best_score') ? parseInt(localStorage.getItem('hitblow_best_score'), 10) : null;
    let isSoundEnabled = localStorage.getItem('hitblow_sound') !== 'false';
    let particles = [];
    let animationFrameId = null;

    // Theme State: default to 'light'
    let currentTheme = localStorage.getItem('hitblow_theme') || 'light';

    // Language State: default to 'ja' if browser is ja, else 'en'
    let currentLang = localStorage.getItem('hitblow_lang');
    if (!currentLang) {
        const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
        currentLang = browserLang.startsWith('ja') ? 'ja' : 'en';
    }

    // Web Audio API Context
    let audioCtx = null;

    function initAudio() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                audioCtx = new AudioContext();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    function playSynthSound(type) {
        if (!isSoundEnabled) return;
        try {
            initAudio();
            if (!audioCtx) return;

            const now = audioCtx.currentTime;

            if (type === 'click') {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(600, now);
                osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now);
                osc.stop(now + 0.05);
            } else if (type === 'error') {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(150, now);
                osc.frequency.setValueAtTime(110, now + 0.08);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now);
                osc.stop(now + 0.2);
            } else if (type === 'guess') {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now);
                osc.stop(now + 0.1);
            } else if (type === 'fanfare-miracle') {
                const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
                notes.forEach((freq, i) => {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, now + i * 0.1);
                    gain.gain.setValueAtTime(0.25, now + i * 0.1);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.6);
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.start(now + i * 0.1);
                    osc.stop(now + i * 0.1 + 0.6);
                });
            } else if (type === 'fanfare-excellent') {
                const notes = [440, 554.37, 659.25, 880];
                notes.forEach((freq, i) => {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(freq, now + i * 0.12);
                    gain.gain.setValueAtTime(0.2, now + i * 0.12);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.4);
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.start(now + i * 0.12);
                    osc.stop(now + i * 0.12 + 0.4);
                });
            } else if (type === 'fanfare-great') {
                const notes = [523.25, 659.25, 783.99];
                notes.forEach((freq, i) => {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, now + i * 0.12);
                    gain.gain.setValueAtTime(0.18, now + i * 0.12);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.35);
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.start(now + i * 0.12);
                    osc.stop(now + i * 0.12 + 0.35);
                });
            }
        } catch (e) {
            console.warn('Audio play failed:', e);
        }
    }

    // Apply Theme
    function applyTheme(theme) {
        currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('hitblow_theme', theme);
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
        }
        if (themeToggleBtn) {
            const t = i18n[currentLang] || i18n.ja;
            themeToggleBtn.title = theme === 'dark' ? t.themeDarkTitle : t.themeLightTitle;
        }
    }

    // Apply Language
    function applyLanguage(lang) {
        currentLang = lang;
        document.documentElement.setAttribute('lang', lang);
        localStorage.setItem('hitblow_lang', lang);

        const t = i18n[lang] || i18n.ja;
        document.title = t.docTitle;

        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach((el) => {
            const key = el.getAttribute('data-i18n');
            if (t[key]) {
                el.textContent = t[key];
            }
        });

        if (guessInput) {
            guessInput.placeholder = t.guessPlaceholder;
        }

        if (langIcon) {
            langIcon.textContent = t.langBtnLabel;
        }
        if (langToggleBtn) {
            langToggleBtn.title = t.langBtnTitle;
        }

        if (themeToggleBtn) {
            themeToggleBtn.title = currentTheme === 'dark' ? t.themeDarkTitle : t.themeLightTitle;
        }

        if (soundToggleBtn) {
            soundToggleBtn.title = isSoundEnabled ? t.soundOnTitle : t.soundOffTitle;
        }

        updateStatsDisplay();

        // Update victory modal texts if visible
        if (victoryModal && !victoryModal.classList.contains('hidden')) {
            updateCelebrationText(turn);
        }
    }

    // Canvas particle system
    function resizeCanvas() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function createCelebrationParticles(turns) {
        if (!ctx) return;
        particles = [];
        const particleCount = turns === 1 ? 250 : turns <= 5 ? 150 : 80;
        const colors = ['#00f2fe', '#4facfe', '#ffd700', '#ff9f1c', '#00f5d4', '#ff0844', '#ffffff'];

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: turns === 1 ? canvas.width / 2 : Math.random() * canvas.width,
                y: turns === 1 ? canvas.height / 2 : -20,
                vx: (Math.random() - 0.5) * (turns === 1 ? 16 : 8),
                vy: turns === 1 ? (Math.random() - 0.5) * 16 : Math.random() * 6 + 3,
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                vRot: (Math.random() - 0.5) * 10,
                alpha: 1,
                decay: Math.random() * 0.008 + 0.004
            });
        }

        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        animateParticles();
    }

    function animateParticles() {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p, index) => {
            p.x += p.vx;
            p.y += p.vy;
            p.rotation += p.vRot;
            p.alpha -= p.decay;

            ctx.save();
            ctx.globalAlpha = Math.max(0, p.alpha);
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();

            if (p.alpha <= 0 || p.y > canvas.height + 50) {
                particles.splice(index, 1);
            }
        });

        if (particles.length > 0) {
            animationFrameId = requestAnimationFrame(animateParticles);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    // Initialize Game
    function initGame() {
        secret = generateSecret();
        turn = 0;
        historyList.innerHTML = '';
        messageArea.textContent = '';
        guessInput.value = '';
        guessInput.disabled = false;
        guessButton.disabled = false;
        victoryModal.classList.add('hidden');
        if (emptyHistory) emptyHistory.style.display = 'block';
        
        updateStatsDisplay();
        guessInput.focus();
        console.log(`[DEBUG] Secret: ${secret}`);
    }

    function generateSecret() {
        const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        let result = '';
        for (let i = 0; i < 4; i++) {
            const index = Math.floor(Math.random() * digits.length);
            result += digits.splice(index, 1)[0];
        }
        return result;
    }

    function updateStatsDisplay() {
        const t = i18n[currentLang] || i18n.ja;
        currentTurnEl.textContent = turn;
        bestScoreEl.textContent = bestScore ? `${bestScore} ${t.turnUnit}` : t.emptyBest;
        gamesPlayedEl.textContent = gamesPlayed;
        historyCount.textContent = `${turn} ${t.historyCountUnit}`;
        soundIcon.textContent = isSoundEnabled ? '🔊' : '🔇';
    }

    // Handle Guess
    function handleGuess() {
        const guess = guessInput.value.trim();
        const t = i18n[currentLang] || i18n.ja;

        // Validation
        if (!/^\d{4}$/.test(guess)) {
            messageArea.textContent = t.errorDigits;
            playSynthSound('error');
            return;
        }

        if (new Set(guess).size !== 4) {
            messageArea.textContent = t.errorDuplicate;
            playSynthSound('error');
            return;
        }

        messageArea.textContent = '';
        turn++;
        currentTurnEl.textContent = turn;
        historyCount.textContent = `${turn} ${t.historyCountUnit}`;
        if (emptyHistory) emptyHistory.style.display = 'none';

        const { hits, blows } = checkGuess(guess);
        addHistoryRow(guess, hits, blows);
        playSynthSound('guess');

        if (hits === 4) {
            endGame();
        } else {
            guessInput.value = '';
            guessInput.focus();
        }
    }

    function checkGuess(guess) {
        let hits = 0;
        let blows = 0;
        for (let i = 0; i < 4; i++) {
            if (guess[i] === secret[i]) {
                hits++;
            } else if (secret.includes(guess[i])) {
                blows++;
            }
        }
        return { hits, blows };
    }

    function addHistoryRow(guess, hits, blows) {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="history-turn">#${turn}</span>
            <span class="history-guess">${guess}</span>
            <div class="history-result">
                <span class="tag-hit">${hits} H</span>
                <span class="tag-blow">${blows} B</span>
            </div>
        `;
        historyList.prepend(li);
    }

    function endGame() {
        guessInput.disabled = true;
        guessButton.disabled = true;

        // Record Stats
        gamesPlayed++;
        localStorage.setItem('hitblow_games_played', gamesPlayed.toString());
        
        if (!bestScore || turn < bestScore) {
            bestScore = turn;
            localStorage.setItem('hitblow_best_score', bestScore.toString());
        }

        updateStatsDisplay();
        triggerGrandCelebration(turn);
    }

    function updateCelebrationText(turns) {
        const t = i18n[currentLang] || i18n.ja;
        modalTurns.textContent = turns;
        modalSecret.textContent = secret;

        let celebration;
        if (turns === 1) {
            celebration = t.celebrations.miracle;
            modalBadge.textContent = celebration.badge;
            modalBadge.style.background = 'linear-gradient(135deg, #ffd700 0%, #ff0844 100%)';
            modalBadge.style.color = '#ffffff';
            modalTitle.textContent = celebration.title;
            modalMessage.innerHTML = celebration.message;
        } else if (turns <= 5) {
            celebration = t.celebrations.excellent(turns);
            modalBadge.textContent = celebration.badge;
            modalBadge.style.background = 'linear-gradient(135deg, var(--primary-cyan) 0%, var(--primary-blue) 100%)';
            modalBadge.style.color = '#000000';
            modalTitle.textContent = celebration.title;
            modalMessage.innerHTML = celebration.message;
        } else if (turns <= 10) {
            celebration = t.celebrations.great(turns);
            modalBadge.textContent = celebration.badge;
            modalBadge.style.background = 'linear-gradient(135deg, var(--accent-green) 0%, var(--primary-cyan) 100%)';
            modalBadge.style.color = '#000000';
            modalTitle.textContent = celebration.title;
            modalMessage.innerHTML = celebration.message;
        } else {
            celebration = t.celebrations.complete(turns);
            modalBadge.textContent = celebration.badge;
            modalBadge.style.background = 'rgba(255, 255, 255, 0.2)';
            modalBadge.style.color = 'var(--text-main)';
            modalTitle.textContent = celebration.title;
            modalMessage.innerHTML = celebration.message;
        }
    }

    function triggerGrandCelebration(turns) {
        updateCelebrationText(turns);

        if (turns === 1) {
            playSynthSound('fanfare-miracle');
        } else if (turns <= 5) {
            playSynthSound('fanfare-excellent');
        } else {
            playSynthSound('fanfare-great');
        }

        createCelebrationParticles(turns);
        victoryModal.classList.remove('hidden');
    }

    // Event Listeners
    guessButton.addEventListener('click', () => {
        initAudio();
        handleGuess();
    });

    guessInput.addEventListener('keydown', (e) => {
        initAudio();
        if (e.key === 'Enter') {
            handleGuess();
        }
    });

    resetButton.addEventListener('click', () => {
        playSynthSound('click');
        initGame();
    });

    langToggleBtn.addEventListener('click', () => {
        playSynthSound('click');
        const newLang = currentLang === 'ja' ? 'en' : 'ja';
        applyLanguage(newLang);
    });

    themeToggleBtn.addEventListener('click', () => {
        playSynthSound('click');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    });

    soundToggleBtn.addEventListener('click', () => {
        isSoundEnabled = !isSoundEnabled;
        localStorage.setItem('hitblow_sound', isSoundEnabled ? 'true' : 'false');
        soundIcon.textContent = isSoundEnabled ? '🔊' : '🔇';
        const t = i18n[currentLang] || i18n.ja;
        soundToggleBtn.title = isSoundEnabled ? t.soundOnTitle : t.soundOffTitle;
        if (isSoundEnabled) playSynthSound('click');
    });

    // Initialize Theme & Language
    applyTheme(currentTheme);
    applyLanguage(currentLang);

    // Start initial game
    initGame();
});
