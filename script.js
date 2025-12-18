document.addEventListener('DOMContentLoaded', () => {
    const guessInput = document.getElementById('guess-input');
    const guessButton = document.getElementById('guess-button');
    const historyList = document.getElementById('history-list');
    const resultArea = document.getElementById('result-area');
    const resetButton = document.getElementById('reset-button');

    let secret;
    let turn;

    function initGame() {
        secret = generateSecret();
        turn = 0;
        historyList.innerHTML = '';
        resultArea.innerHTML = '';
        guessInput.value = '';
        guessInput.disabled = false;
        guessButton.disabled = false;
        resetButton.classList.add('hidden');
        console.log(`Secret: ${secret}`); // For debugging
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

    function handleGuess() {
        const guess = guessInput.value;

        if (!/^\d{4}$/.test(guess) || new Set(guess).size !== 4) {
            resultArea.textContent = '重複しない4桁の数字を入力してください。';
            return;
        }

        turn++;
        const { hits, blows } = checkGuess(guess);

        addHistory(guess, hits, blows);

        if (hits === 4) {
            endGame();
        } else {
            resultArea.textContent = '';
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

    function addHistory(guess, hits, blows) {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="guess-value">${guess}</span>
            <span class="guess-result">${hits} Hit, ${blows} Blow</span>
        `;
        historyList.prepend(li);
    }

    function endGame() {
        guessInput.disabled = true;
        guessButton.disabled = true;
        resetButton.classList.remove('hidden');
        resultArea.innerHTML = getCelebrationMessage(turn);
    }

    function getCelebrationMessage(turns) {
        if (turns === 1) {
            return `
                <h2>🎉奇跡！🎉</h2>
                <p>1ターンでクリアとは！あなたは神ですか？</p>
            `;
        } else if (turns <= 5) {
            return `
                <h2>🎊素晴らしい！🎊</h2>
                <p>${turns}ターンでクリア！お見事です！</p>
            `;
        } else if (turns <= 10) {
            return `
                <h2>✨おめでとうございます！✨</h2>
                <p>${turns}ターンでクリア！なかなかの腕前です。</p>
            `;
        } else {
            return `
                <h2>クリア！</h2>
                <p>${turns}ターンで正解にたどり着きました。</p>
            `;
        }
    }

    guessButton.addEventListener('click', handleGuess);
    guessInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            handleGuess();
        }
    });
    resetButton.addEventListener('click', initGame);

    initGame();
});
