document.addEventListener('DOMContentLoaded', () => {
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
                // Grand multi-note fanfare for 1-turn miracle
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
        currentTurnEl.textContent = turn;
        bestScoreEl.textContent = bestScore ? `${bestScore} ターン` : '-- ターン';
        gamesPlayedEl.textContent = gamesPlayed;
        historyCount.textContent = `${turn} 件`;
        soundIcon.textContent = isSoundEnabled ? '🔊' : '🔇';
    }

    // Handle Guess
    function handleGuess() {
        const guess = guessInput.value.trim();

        // Validation
        if (!/^\d{4}$/.test(guess)) {
            messageArea.textContent = '4桁の数字を入力してください。';
            playSynthSound('error');
            return;
        }

        if (new Set(guess).size !== 4) {
            messageArea.textContent = '重複しない4桁の数字を入力してください。';
            playSynthSound('error');
            return;
        }

        messageArea.textContent = '';
        turn++;
        currentTurnEl.textContent = turn;
        historyCount.textContent = `${turn} 件`;
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

    function triggerGrandCelebration(turns) {
        modalTurns.textContent = turns;
        modalSecret.textContent = secret;

        if (turns === 1) {
            modalBadge.textContent = '🌌 MIRACLE CLEAR 🌌';
            modalBadge.style.background = 'linear-gradient(135deg, #ffd700 0%, #ff0844 100%)';
            modalBadge.style.color = '#ffffff';
            modalTitle.textContent = '🎉 奇跡の1ターン解読！！ 🎉';
            modalMessage.innerHTML = '1ターンで解読成功とは…！<br>あなたは神レベルの洞察力と直感の持ち主です！';
            playSynthSound('fanfare-miracle');
        } else if (turns <= 5) {
            modalBadge.textContent = '⚡ EXCELLENT ⚡';
            modalBadge.style.background = 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)';
            modalBadge.style.color = '#000000';
            modalTitle.textContent = '🎊 素晴らしい成果です！ 🎊';
            modalMessage.innerHTML = `わずか <strong>${turns} ターン</strong> で解読成功！<br>超一流の推理力とお見事な分析力です！`;
            playSynthSound('fanfare-excellent');
        } else if (turns <= 10) {
            modalBadge.textContent = '✨ GREAT JOB ✨';
            modalBadge.style.background = 'linear-gradient(135deg, #00f5d4 0%, #00f2fe 100%)';
            modalBadge.style.color = '#000000';
            modalTitle.textContent = '✨ おめでとうございます！ ✨';
            modalMessage.innerHTML = `<strong>${turns} ターン</strong> で解読成功！<br>確かな理論で暗号を見事に破りました。`;
            playSynthSound('fanfare-great');
        } else {
            modalBadge.textContent = '🎯 MISSION COMPLETE 🎯';
            modalBadge.style.background = 'rgba(255, 255, 255, 0.2)';
            modalBadge.style.color = '#ffffff';
            modalTitle.textContent = '解読成功！';
            modalMessage.innerHTML = `<strong>${turns} ターン</strong> で正解にたどり着きました。<br>根気強いアプローチで見事勝利です！`;
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

    soundToggleBtn.addEventListener('click', () => {
        isSoundEnabled = !isSoundEnabled;
        localStorage.setItem('hitblow_sound', isSoundEnabled ? 'true' : 'false');
        soundIcon.textContent = isSoundEnabled ? '🔊' : '🔇';
        if (isSoundEnabled) playSynthSound('click');
    });

    // Start initial game
    initGame();
});
