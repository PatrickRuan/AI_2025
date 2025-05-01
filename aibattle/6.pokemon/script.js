// --- DOM Element References ---
const opponentNameElem = document.getElementById('opponent-name');
const opponentHpBarElem = document.getElementById('opponent-hp-bar');
const opponentHpTextElem = document.getElementById('opponent-hp-text');
const opponentSpriteElem = document.getElementById('opponent-sprite');

const playerNameElem = document.getElementById('player-name');
const playerHpBarElem = document.getElementById('player-hp-bar');
const playerHpTextElem = document.getElementById('player-hp-text');
const playerSpriteElem = document.getElementById('player-sprite');

const battleMessageElem = document.getElementById('battle-message');
const optionsBoxElem = document.getElementById('options-box');
const fightOptionsBoxElem = document.getElementById('fight-options-box');
const fightButton = document.getElementById('fight-button');

// --- Pokémon Data ---
// 儲存目前寶可夢的數據 (包括當前 HP)
let playerData = null;
let opponentData = null;
let playerCurrentHP = 0;
let opponentCurrentHP = 0;

// --- PokéAPI Base URL ---
const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2/pokemon/';

// --- Functions ---

/**
 * 從 PokéAPI 獲取寶可夢數據
 * @param {string|number} pokemonIdOrName - 寶可夢的 ID 或名稱
 * @returns {Promise<object|null>} - 包含寶可夢數據的 Promise 物件，失敗時為 null
 */
async function fetchPokemonData(pokemonIdOrName) {
    try {
        const response = await fetch(`${POKEAPI_BASE_URL}${pokemonIdOrName}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        //console.log(`Workspaceed data for ${pokemonIdOrName}:`, data); // Debugging
        return data;
    } catch (error) {
        console.error(`無法獲取寶可夢 "${pokemonIdOrName}" 的數據:`, error);
        battleMessageElem.textContent = `錯誤：無法載入 ${pokemonIdOrName} 的資訊。`;
        return null;
    }
}

/**
 * 更新 HP 條和文字顯示
 * @param {string} side - 'player' 或 'opponent'
 * @param {number} currentHP - 目前 HP
 * @param {number} maxHP - 最大 HP
 */
function updateHP(side, currentHP, maxHP) {
    const hpBarElem = side === 'player' ? playerHpBarElem : opponentHpBarElem;
    const hpTextElem = side === 'player' ? playerHpTextElem : opponentHpTextElem;

    // 確保 HP 不會低於 0 或高於 MaxHP
    currentHP = Math.max(0, Math.min(currentHP, maxHP));

    const percentage = maxHP > 0 ? (currentHP / maxHP) * 100 : 0;
    hpBarElem.style.width = `${percentage}%`;

    // 根據血量百分比改變顏色
    if (percentage > 50) {
        hpBarElem.style.backgroundColor = '#32cd32'; // Green
    } else if (percentage > 20) {
        hpBarElem.style.backgroundColor = '#ffdd57'; // Yellow
    } else {
        hpBarElem.style.backgroundColor = '#ff3860'; // Red
    }

    // 更新 HP 文字 (如果需要顯示最大 HP)
    hpTextElem.textContent = `${currentHP}/${maxHP}`;

     // 更新全局變數
     if (side === 'player') {
        playerCurrentHP = currentHP;
    } else {
        opponentCurrentHP = currentHP;
    }
}

/**
 * 初始化戰鬥畫面
 * @param {object} pData - 玩家寶可夢數據
 * @param {object} oData - 對手寶可夢數據
 */
function initializeBattleScreen(pData, oData) {
    playerData = pData;
    opponentData = oData;

    // -- 更新玩家資訊 --
    if (playerData) {
        playerNameElem.textContent = playerData.name.toUpperCase();
        playerSpriteElem.src = playerData.sprites?.back_default || ''; // 使用後方視角圖片
        playerSpriteElem.alt = playerData.name;
        const playerMaxHP = playerData.stats.find(stat => stat.stat.name === 'hp')?.base_stat || 1; // 找到 HP 基礎值
        playerCurrentHP = playerMaxHP; // 初始滿血
        updateHP('player', playerCurrentHP, playerMaxHP);
    } else {
        playerNameElem.textContent = '錯誤';
        playerSpriteElem.src = '';
        updateHP('player', 0, 1);
    }

    // -- 更新對手資訊 --
    if (opponentData) {
        opponentNameElem.textContent = opponentData.name.toUpperCase();
        opponentSpriteElem.src = opponentData.sprites?.front_default || ''; // 使用前方視角圖片
        opponentSpriteElem.alt = opponentData.name;
        const opponentMaxHP = opponentData.stats.find(stat => stat.stat.name === 'hp')?.base_stat || 1;
        opponentCurrentHP = opponentMaxHP; // 初始滿血
        updateHP('opponent', opponentCurrentHP, opponentMaxHP);
    } else {
         opponentNameElem.textContent = '錯誤';
        opponentSpriteElem.src = '';
        updateHP('opponent', 0, 1);
    }


    // -- 初始訊息 --
    if (playerData) {
        displayMessage(`就決定是你了，${playerData.name.toUpperCase()}！`);
        // 短暫延遲後顯示下一步訊息
        setTimeout(() => {
             displayMessage(`該怎麼做？`);
             showMainOptions(); // 顯示主要選項
        }, 2000); // 延遲 2 秒
    } else {
        displayMessage("戰鬥無法開始...");
    }

    // 顯示招式 (這裡僅為範例，實際應從 API 或預設資料獲取)
    setupFightOptions();
}


/**
 * 顯示戰鬥訊息
 * @param {string} message
 */
function displayMessage(message) {
    battleMessageElem.textContent = message;
}

/** 顯示主要選項，隱藏招式選項 */
function showMainOptions() {
    optionsBoxElem.classList.remove('hidden');
    fightOptionsBoxElem.classList.add('hidden');
}

/** 顯示招式選項，隱藏主要選項 */
function showFightOptions() {
    optionsBoxElem.classList.add('hidden');
    fightOptionsBoxElem.classList.remove('hidden');
    displayMessage("選擇一個招式！"); // 提示選擇招式
}

/** 設置招式按鈕 (範例) */
function setupFightOptions() {
     fightOptionsBoxElem.innerHTML = ''; // 清空舊按鈕

     // --- 模擬獲取招式 (實際應從 playerData.moves 中獲取) ---
     const moves = [
         { name: '電擊', power: 40, type: 'electric' },
         { name: '撞擊', power: 40, type: 'normal' },
         { name: '搖尾巴', power: 0, type: 'normal' }, // 變化招式
         { name: '電光一閃', power: 40, type: 'normal'}
     ];

     // 只取前 4 個招式
     moves.slice(0, 4).forEach(move => {
        const moveButton = document.createElement('button');
        moveButton.classList.add('option-button');
        moveButton.textContent = move.name.toUpperCase();
        moveButton.onclick = () => handleMoveSelection(move); // 添加點擊事件
        fightOptionsBoxElem.appendChild(moveButton);
     });

     // 添加返回按鈕 (如果需要)
     const backButton = document.createElement('button');
     backButton.classList.add('option-button');
     backButton.textContent = '返回';
     backButton.style.gridColumn = 'span 2'; // 讓返回按鈕佔滿兩列
     backButton.onclick = showMainOptions;
     fightOptionsBoxElem.appendChild(backButton);
}


/**
 * 處理招式選擇 (簡易模擬)
 * @param {object} move - 被選擇的招式資訊
 */
function handleMoveSelection(move) {
    if (!playerData || !opponentData) return;

    displayMessage(`${playerData.name.toUpperCase()} 使用了 ${move.name.toUpperCase()}！`);

    // --- 簡易傷害計算 (非常粗略的模擬) ---
    let damage = 0;
    if (move.power && move.power > 0) {
        // 基礎傷害 + 一點隨機性
        damage = Math.floor(move.power * 0.5 + Math.random() * 10);
        // 可以在這裡加入屬性相剋等更複雜邏輯
        console.log(`計算傷害: ${damage}`);
    } else {
         displayMessage("...但沒有效果！"); // 變化招式或威力為 0
    }

    // --- 對手回合 (簡易模擬，對手隨機攻擊) ---
    setTimeout(() => {
        if (damage > 0) {
             const newOpponentHP = opponentCurrentHP - damage;
             updateHP('opponent', newOpponentHP, opponentData.stats.find(stat => stat.stat.name === 'hp').base_stat);
             if (newOpponentHP <= 0) {
                 displayMessage(`${opponentData.name.toUpperCase()} 倒下了！你贏了！`);
                 opponentSpriteElem.style.filter = 'grayscale(100%)'; // 變灰表示倒下
                 // 在這裡可以結束戰鬥或做其他處理
                 return; // 對手倒下，不再反擊
             }
        }

        // 對手反擊 (如果還活著)
        opponentTurn();

    }, 1500); // 延遲顯示對手動作

    // 顯示主要選項，等待下一回合
     setTimeout(() => {
         if (opponentCurrentHP > 0 && playerCurrentHP > 0) { // 只有雙方都還活著才顯示
            displayMessage("該怎麼做？");
            showMainOptions();
         }
     }, 3500); // 等待對手動作完成後再顯示選項
}

/** 對手回合模擬 */
function opponentTurn() {
    if (!playerData || !opponentData || opponentCurrentHP <= 0) return;

    // 隨機選擇一個攻擊方式 (這裡極度簡化，假設對手只會攻擊)
    const opponentMovePower = 35; // 假設對手固定威力的招式
    const opponentDamage = Math.floor(opponentMovePower * 0.5 + Math.random() * 8);

    displayMessage(`${opponentData.name.toUpperCase()} 發動了攻擊！`);

    setTimeout(() => {
        const newPlayerHP = playerCurrentHP - opponentDamage;
        updateHP('player', newPlayerHP, playerData.stats.find(stat => stat.stat.name === 'hp').base_stat);
        if (newPlayerHP <= 0) {
            displayMessage(`${playerData.name.toUpperCase()} 倒下了！你輸了！`);
            playerSpriteElem.style.filter = 'grayscale(100%) brightness(50%)'; // 變暗表示倒下
            // 可以在這裡結束戰鬥或做其他處理
        }
    }, 1000); // 延遲顯示傷害
}

// --- Event Listeners ---
fightButton.addEventListener('click', showFightOptions);

// 其他按鈕 (包包、寶可夢、逃跑) 可以添加類似的事件監聽器
document.getElementById('bag-button').addEventListener('click', () => displayMessage("包包裡空空如也..."));
document.getElementById('pokemon-button').addEventListener('click', () => displayMessage("沒有其他寶可夢了！"));
document.getElementById('run-button').addEventListener('click', () => displayMessage("無法逃跑！"));


// --- Initialization ---
async function startBattle() {
    // 設定玩家和對手的寶可夢 (可以改成你想要的 ID 或名字)
    const playerPokemonId = 25; // 例如：皮卡丘 Pikachu
    const opponentPokemonId = 6; // 例如：噴火龍 Charizard

    displayMessage("正在載入戰鬥資訊...");
    optionsBoxElem.classList.add('hidden'); // 載入時先隱藏選項

    // 同時獲取兩隻寶可夢的數據
    const [pData, oData] = await Promise.all([
        fetchPokemonData(playerPokemonId),
        fetchPokemonData(opponentPokemonId)
    ]);

    // 如果數據成功獲取，則初始化畫面
    if (pData && oData) {
        initializeBattleScreen(pData, oData);
    } else {
        displayMessage("載入戰鬥失敗，請檢查網路連線或寶可夢 ID/名稱是否正確。");
        // 可以顯示一個重試按鈕等
    }
}

// 網頁載入完成後開始戰鬥
window.onload = startBattle;