# Hit & Blow | 4桁の暗号解読ゲーム

[English README (README.md)](README.md)

数字当て・暗号解読の定番推理ゲーム「**Hit & Blow**（ヒット・アンド・ブロー / ヌメロンやマスターマインドに類似）」のWebブラウザ向けモダン実装です。

![Hit & Blow](https://img.shields.io/badge/Game-Hit%20%26%20Blow-0284c7?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## 🎮 ゲームルール

ランダムに設定された**重複のない4桁の数字（0〜9）**を、できるだけ少ないターン数で解読・的中させるゲームです。

- 正解コードは `0` 〜 `9` の中から選ばれた重複しない4桁の数字です。
- 予想した数字を入力すると、結果が **Hit（ヒット）** と **Blow（ブロー）** の数で判定されます：
  - **Hit (H)**: 数字と**桁の位置**が両方一致している数。
  - **Blow (B)**: 数字は含まれているが、**桁の位置が異なる**数。

### 判定の例
正解が **`4821`** の場合：
- 予想 **`1890`** ➔ **1 Hit, 1 Blow**（`8` は位置も一致で Hit、`1` は含まれるが位置違いで Blow）
- 予想 **`4812`** ➔ **2 Hits, 2 Blows**（`4` と `8` は Hit、`1` と `2` は Blow）
- 予想 **`4821`** ➔ **4 Hits, 0 Blows**（暗号解読成功！🎉）

---

## ✨ 主な機能

- 🌓 **ダーク / ライトテーマ切り替え**:
  - デフォルトはクリーンなライトモード。
  - ヘッダーのボタン（`☀️` / `🌙`）でワンクリック切り替えが可能。
  - 選択したテーマは `localStorage` に保存され、次回訪問時にも引き継がれます。
- 🌐 **多言語対応 (i18n)**:
  - ブラウザの言語設定を自動判別（日本語ブラウザは日本語、それ以外は英語を初期表示）。
  - ヘッダーの言語ボタン（`JA` / `EN`）でいつでも手動切り替え可能。
  - UI、統計ラベル、エラーメッセージ、勝利演出メッセージのすべてがローカライズされています。
- 🔊 **Web Audio API による効果音**:
  - 外部音声ファイルを使わず、ブラウザ標準の Web Audio API で効果音（クリック音、予想音、エラー音、ファンファーレ）をリアルタイム生成。
  - サウンドのON/OFF切り替えボタン（`🔊` / `🔇`）付き。
- 🎊 **Canvas 紙吹雪演出 & ランク判定**:
  - 解読成功時に HTML5 Canvas による紙吹雪アニメーションを再生。
  - クリアターン数に応じた演出とメッセージを表示：
    - 🌌 **MIRACLE CLEAR**（1ターン奇跡解読）
    - ⚡ **EXCELLENT**（2〜5ターン）
    - ✨ **GREAT JOB**（6〜10ターン）
    - 🎯 **MISSION COMPLETE**（11ターン以上）
- 📊 **戦績・履歴の記録**:
  - 現在のターン数および試行履歴のリアルタイム表示。
  - ベストスコア（最少ターン数）および累計プレイ回数を `localStorage` に自動記録。
- 📱 **グラスモーフィズム & レスポンシブUI**:
  - スマートフォンやタブレット、PCのすべての画面サイズに最適化。
  - Google Fonts（`Outfit`, `JetBrains Mono`）による視認性の高いタイポグラフィ。
- 📈 **Google Tag Manager 連携**:
  - `config.js` から `GTM_ID` を読み込んでタグを自動配信。

---

## 🚀 使い方 / 実行方法

### 必要な環境
Google Chrome、Safari、Firefox、Microsoft Edge などのモダンWebブラウザ。

### ローカルでの起動手順

1. **リポジトリをクローン**:
   ```bash
   git clone https://github.com/your-username/hit-blow.git
   cd hit-blow
   ```

2. **(任意) Google Tag Manager の設定**:
   プロジェクトルートに `config.js` を作成し、GTMコンテナIDを設定します：
   ```javascript
   const GTM_ID = 'GTM-XXXXXXX';
   ```

3. **ゲームを起動**:
   - `index.html` を直接ブラウザで開く：
     ```bash
     # macOS
     open index.html
     # Linux
     xdg-open index.html
     # Windows
     start index.html
     ```
   - またはローカルHTTPサーバーで配信：
     ```bash
     # Python 3
     python3 -m http.server 8000

     # Node.js (npx serve)
     npx serve .
     ```

---

## 📁 ディレクトリ構成

```text
hit-blow/
├── index.html        # メインHTML構造 & GTMタグ埋め込み
├── style.css         # スタイル定義、グラスモーフィズムUI、ライト/ダークテーマ
├── script.js         # ゲームロジック、i18n、Web Audio API、Canvas演出
├── config.js         # (任意 / Git除外) GTM設定ファイル
├── README.md         # 英語版ドキュメント
└── README.ja.md      # 日本語版ドキュメント
```

---

## 🛠️ 使用技術

- **HTML5** / **CSS3**（CSS Custom Properties, Glassmorphism, Flexbox, CSS Grid）
- **JavaScript (Vanilla ES6+)**（Web Audio API, Canvas API, Web Storage API）
- **Google Fonts**（`Outfit`, `JetBrains Mono`）

---

## 📄 ライセンス

このプロジェクトは MIT ライセンス のもとで公開されています。
