// --- Audio System (Procedural Web Audio) ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const SoundEffects = {
    playTone(freq, type, duration, vol=0.1) {
        if(audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        
        gain.gain.setValueAtTime(vol, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    },
    
    // Improved Realistic Chop (Wood hitting wood: short low sine + filtered noise burst)
    chop() { 
        if(audioCtx.state === 'suspended') audioCtx.resume();
        const time = audioCtx.currentTime;
        
        // Thud (Oscillator)
        const osc = audioCtx.createOscillator();
        const oscGain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, time);
        osc.frequency.exponentialRampToValueAtTime(50, time + 0.08); // Pitch drop
        oscGain.gain.setValueAtTime(0.8, time);
        oscGain.gain.exponentialRampToValueAtTime(0.01, time + 0.08);
        osc.connect(oscGain);
        oscGain.connect(audioCtx.destination);
        osc.start(time);
        osc.stop(time + 0.08);

        // Crack (Noise)
        const bufferSize = audioCtx.sampleRate * 0.1;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 800;
        const noiseGain = audioCtx.createGain();
        noiseGain.gain.setValueAtTime(0.5, time);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(audioCtx.destination);
        noise.start(time);
    },

    // Improved Realistic Sizzle (Frying crackles using high-pass + peaking filter noise envelopes)
    sizzle() { 
        if(audioCtx.state === 'suspended') audioCtx.resume();
        const time = audioCtx.currentTime;
        
        // Single sharp crackle
        const duration = 0.15;
        const bufferSize = audioCtx.sampleRate * duration;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        
        const hpFilter = audioCtx.createBiquadFilter();
        hpFilter.type = 'highpass';
        hpFilter.frequency.value = 2000 + Math.random() * 4000; // Randomized pitch of crackle
        
        const peakFilter = audioCtx.createBiquadFilter();
        peakFilter.type = 'peaking';
        peakFilter.frequency.value = 5000;
        peakFilter.Q.value = 10;
        peakFilter.gain.value = 15;

        const gain = audioCtx.createGain();
        // Snappy envelope to sound like oil popping
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.4 + Math.random()*0.3, time + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.01, time + duration);
        
        noise.connect(hpFilter);
        hpFilter.connect(peakFilter);
        peakFilter.connect(gain);
        gain.connect(audioCtx.destination);
        noise.start(time);
    },

    ding() { this.playTone(800, 'sine', 0.5, 0.2); setTimeout(()=>this.playTone(1200, 'sine', 0.5, 0.1), 100); },
    error() { this.playTone(150, 'sawtooth', 0.3, 0.2); },
    cash() { this.playTone(1500, 'square', 0.1, 0.1); setTimeout(()=>this.playTone(2000, 'square', 0.2, 0.1), 100); },
    
    // Improved Deep Boom
    boom() { 
        if(audioCtx.state === 'suspended') audioCtx.resume();
        const time = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(100, time);
        osc.frequency.exponentialRampToValueAtTime(20, time + 1.5); // Deep sub hit
        gain.gain.setValueAtTime(1.0, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 1.5);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(time);
        osc.stop(time + 1.5);
        
        // Rumble Noise
        const bufferSize = audioCtx.sampleRate * 1.5;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 150; // Muffled explosion
        const noiseGain = audioCtx.createGain();
        noiseGain.gain.setValueAtTime(0.8, time);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 1.5);
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(audioCtx.destination);
        noise.start(time);
    },
    
    pop() { this.playTone(400, 'sine', 0.1, 0.1); },
    
    footsteps() { 
        const step = () => {
            if(audioCtx.state === 'suspended') audioCtx.resume();
            const time = audioCtx.currentTime;
            const bufferSize = audioCtx.sampleRate * 0.1;
            const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
            const noise = audioCtx.createBufferSource();
            noise.buffer = buffer;
            const filter = audioCtx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 300;
            const gain = audioCtx.createGain();
            gain.gain.setValueAtTime(0.2, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(audioCtx.destination);
            noise.start(time);
        };
        step();
        setTimeout(step, 200); 
    }
};

// --- Game Data & Recipes ---
const INGREDIENTS = {
    iftar: [
        { id: 'domates', name: 'Domates', type: 'raw', baseVisual: 'tomato', action: 'chop', result: 'domates_dogranmis', cookTime: 3 },
        { id: 'mercimek', name: 'Mercimek', type: 'raw', baseVisual: 'lentils', action: 'pot', result: 'mercimek_corba', cookTime: 5 },
        { id: 'fasulye', name: 'Fasulye', type: 'raw', baseVisual: 'beans', action: 'pot', result: 'kuru_fasulye', cookTime: 6 },
        { id: 'et', name: 'Bütün Et', type: 'raw', baseVisual: 'meat', action: 'chop', result: 'et_kavurmalik', cookTime: 4 },
        { id: 'et_butun', name: 'Bütün Et (Fırınlık)', type: 'raw', baseVisual: 'meat', action: 'oven', result: 'firin_guvec', cookTime: 8 }
    ],
    sahur: [
        { id: 'yumurta_cig', name: 'Çiğ Yumurta', type: 'raw', baseVisual: 'egg', action: 'pan', result: 'sahanda_yumurta', cookTime: 4 },
        { id: 'peynir_kalip', name: 'Kalıp Peynir', type: 'raw', baseVisual: 'cheese', action: 'chop', result: 'peynir_dilim', cookTime: 2 },
        { id: 'zeytin', name: 'Zeytin', type: 'ready', baseVisual: 'olives', result: 'zeytin' },
        { id: 'salatalik', name: 'Salatalık', type: 'raw', baseVisual: 'cucumber', action: 'chop', result: 'salatalik_dilim', cookTime: 2 },
        { id: 'domates', name: 'Domates', type: 'raw', baseVisual: 'tomato', action: 'chop', result: 'domates_dilim', cookTime: 2 }
    ]
};

// Intermediate and Final Items
const ITEMSDB = {
    'domates_dogranmis': { id: 'domates_dogranmis', name: 'Doğranmış Domates', type: 'prep', baseVisual: 'tomato-chopped', action: 'pot', result: 'domates_corba', cookTime: 5 },
    'et_kavurmalik': { id: 'et_kavurmalik', name: 'Kuşbaşı Et', type: 'prep', baseVisual: 'meat-chopped', action: 'pan', result: 'sac_kavurma', cookTime: 6 },
    
    // Finished Dishes (Ready to serve)
    'domates_corba': { id: 'domates_corba', name: 'Domates Çorbası', type: 'ready', baseVisual: 'soup-tomato' },
    'mercimek_corba': { id: 'mercimek_corba', name: 'Mercimek Çorbası', type: 'ready', baseVisual: 'soup-lentil' },
    'kuru_fasulye': { id: 'kuru_fasulye', name: 'Kuru Fasulye', type: 'ready', baseVisual: 'dish-beans' },
    'sac_kavurma': { id: 'sac_kavurma', name: 'Saç Kavurma', type: 'ready', baseVisual: 'dish-kavurma' },
    'firin_guvec': { id: 'firin_guvec', name: 'Fırın Güveç', type: 'ready', baseVisual: 'dish-guvec' },
    
    'sahanda_yumurta': { id: 'sahanda_yumurta', name: 'Sahanda Yumurta', type: 'ready', baseVisual: 'dish-egg' },
    'peynir_dilim': { id: 'peynir_dilim', name: 'Dilim Peynir', type: 'ready', baseVisual: 'cheese-sliced' },
    'salatalik_dilim': { id: 'salatalik_dilim', name: 'Dilim Salatalık', type: 'ready', baseVisual: 'cucumber-sliced' },
    'domates_dilim': { id: 'domates_dilim', name: 'Dilim Domates', type: 'ready', baseVisual: 'tomato-sliced' },
    'zeytin': { id: 'zeytin', name: 'Zeytin', type: 'ready', baseVisual: 'olives' }
};

// --- Game State ---
let isIftarMode = true;
let money = 0;
let score = 0;
let currentPlate = [];
let currentCustomer = null;
let customerActive = false;

// Station states map
let stations = {
    cuttingBoard: { active: false, item: null, progress: 0, state: 'empty' },
    burner1: { active: false, item: null, progress: 0, timer: 0, state: 'empty' }, 
    burner2: { active: false, item: null, progress: 0, timer: 0, state: 'empty' },
    oven: { active: false, item: null, progress: 0, timer: 0, state: 'empty' },
    prepArea: { item: null } // Area to hold chopped ingredients before cooking
};

// --- DOM Elements ---
const gameWorld = document.getElementById('game-world');
const modeToggleBtn = document.getElementById('mode-toggle-btn');
const rawIngredientsContainer = document.getElementById('raw-ingredients-container');
const plateEl = document.getElementById('plate');
const serveBtn = document.getElementById('serve-btn');
const customerEl = document.getElementById('customer');
const customerDialogueEl = document.getElementById('customer-dialogue');
const moneyDisplay = document.getElementById('money-display');
const scoreDisplay = document.getElementById('score-display');
const floatingContainer = document.getElementById('floating-texts-container');
const cannonEffect = document.getElementById('cannon-effect');

// Station Elements
const cuttingBoardEl = document.getElementById('cutting-board');
const burner1El = document.getElementById('burner-1');
const burner2El = document.getElementById('burner-2');
const ovenEl = document.getElementById('oven');

let draggedItem = null; // Holds the object context

// --- Initialization ---
function init() {
    setupEventListeners();
    renderIngredients();
    scheduleNextCustomer(2000);
    setInterval(updateCookingStations, 200); // 5 times a second
}

function setupEventListeners() {
    modeToggleBtn.addEventListener('click', toggleMode);
    serveBtn.addEventListener('click', serveOrder);
    cuttingBoardEl.addEventListener('click', handleCuttingBoardClick);
    setupDragAndDrop();
}

// --- Mode Management ---
function toggleMode() {
    isIftarMode = !isIftarMode;
    if (isIftarMode) {
        gameWorld.classList.remove('sahur-mode');
        gameWorld.classList.add('iftar-mode');
        modeToggleBtn.textContent = "Sahur Moduna Geç";
        fireCannon();
    } else {
        gameWorld.classList.remove('iftar-mode');
        gameWorld.classList.add('sahur-mode');
        modeToggleBtn.textContent = "İftar Moduna Geç";
        SoundEffects.pop();
    }
    clearPlate();
    dismissCustomer();
    clearAllStations();
    renderIngredients();
    scheduleNextCustomer(2500);
}

function fireCannon() {
    cannonEffect.classList.remove('fire');
    void cannonEffect.offsetWidth;
    cannonEffect.classList.add('fire');
    setTimeout(() => SoundEffects.boom(), 200); // sync with visual flash
}

// --- Ingredient UI ---
function renderIngredients() {
    rawIngredientsContainer.innerHTML = '';
    const currentMenu = isIftarMode ? INGREDIENTS.iftar : INGREDIENTS.sahur;
    
    currentMenu.forEach(item => {
        const el = createDraggableElement(item);
        rawIngredientsContainer.appendChild(el);
    });
}

function createDraggableElement(item) {
    const el = document.createElement('div');
    el.className = 'ingredient-item';
    el.draggable = true;
    
    // Add visual representation
    const visual = document.createElement('div');
    visual.className = "food-visual " + item.baseVisual;
    el.appendChild(visual);

    const nameEl = document.createElement('span');
    nameEl.className = 'name';
    nameEl.textContent = item.name;
    el.appendChild(nameEl);
    
    el.addEventListener('dragstart', (e) => {
        draggedItem = item;
        e.dataTransfer.setData('text/plain', item.id);
        el.classList.add('dragging');
    });
    el.addEventListener('dragend', () => {
        draggedItem = null;
        el.classList.remove('dragging');
    });
    
    // Click for direct usage if ready
    el.addEventListener('click', () => {
        if (item.type === 'ready') {
            moveToPlate(item);
        } else if (item.type === 'prep') {
            moveToPlate(item); // e.g. sliced cucumber
            // remove from view if it was on prep area
            if(stations.prepArea.item && stations.prepArea.item.id === item.id) {
                stations.prepArea.item = null;
                renderPrepArea();
            }
        }
    });
    
    return el;
}

// --- Drag & Drop ---
function setupDragAndDrop() {
    const dropZones = [
        { el: cuttingBoardEl, station: 'cuttingBoard', accepts: ['chop'] },
        { el: burner1El.querySelector('.pot'), station: 'burner1', accepts: ['pot'] }, 
        { el: burner2El.querySelector('.pan'), station: 'burner2', accepts: ['pan'] },  
        { el: ovenEl, station: 'oven', accepts: ['oven', 'bake'] },
        { el: plateEl, station: 'plate', accepts: ['ready', 'prep'] }
    ];
    
    dropZones.forEach(zone => {
        if(!zone.el) return;
        zone.el.addEventListener('dragover', e => { e.preventDefault(); zone.el.classList.add('drag-hover'); });
        zone.el.addEventListener('dragleave', e => { zone.el.classList.remove('drag-hover'); });
        zone.el.addEventListener('drop', e => {
            e.preventDefault();
            zone.el.classList.remove('drag-hover');
            if (!draggedItem) return;
            
            if (zone.station === 'plate') {
                if (draggedItem.type === 'ready' || draggedItem.type === 'prep') {
                    moveToPlate(draggedItem);
                    // Remove from source if it was prep area
                    if(stations.prepArea.item && stations.prepArea.item.id === draggedItem.id) {
                        stations.prepArea.item = null;
                        renderPrepArea();
                    }
                } else {
                    SoundEffects.error();
                    showFloatingText(0, 0, plateEl.getBoundingClientRect(), "Pişmedi!");
                }
                return;
            }

            const st = stations[zone.station];
            if (st.item !== null) {
                SoundEffects.error();
                showFloatingText(0, 0, zone.el.getBoundingClientRect(), "Dolu!");
                return;
            }
            
            if (zone.accepts.includes(draggedItem.action)) {
                startCooking(zone.station, draggedItem);
                
                // If dragged from prep area, clear prep area
                if (stations.prepArea.item && stations.prepArea.item.id === draggedItem.id) {
                    stations.prepArea.item = null;
                    renderPrepArea();
                }
            } else {
                SoundEffects.error();
                showFloatingText(0, 0, zone.el.getBoundingClientRect(), "Yanlış İşlem!");
            }
        });
        
        // Click to retrieve cooked items
        if(zone.station !== 'plate' && zone.station !== 'cuttingBoard') {
            zone.el.addEventListener('click', () => retrieveItem(zone.station));
        }
    });
}

// --- Cooking Mechanics ---
function startCooking(stationId, item) {
    const st = stations[stationId];
    st.item = item;
    st.state = (stationId === 'cuttingBoard') ? 'raw' : 'cooking';
    st.progress = 0;
    st.timer = item.cookTime || 3;
    
    updateStationVisual(stationId);
}

function handleCuttingBoardClick(e) {
    const st = stations.cuttingBoard;
    if (st.item && st.state === 'raw') {
        st.progress += 1; // 1 click = 1 progress
        SoundEffects.chop();
        cuttingBoardEl.classList.add('active');
        setTimeout(() => cuttingBoardEl.classList.remove('active'), 100);
        
        const bar = cuttingBoardEl.querySelector('.progress-bar');
        if (bar) bar.style.width = ((st.progress / st.timer) * 100) + '%';
        
        if (st.progress >= st.timer) {
            // Finished chopping
            st.state = 'cooked';
            showFloatingText(0, 0, cuttingBoardEl.getBoundingClientRect(), "Doğrandı!", "positive");
            
            // Move to Prep Area so board is free
            const resultItem = ITEMSDB[st.item.result];
            if (resultItem) {
                stations.prepArea.item = resultItem;
                renderPrepArea();
            }
            
            st.item = null;
            st.state = 'empty';
            st.progress = 0;
            updateStationVisual('cuttingBoard');
        }
    }
}

function renderPrepArea() {
    // We will spawn the prepped item in the raw ingredients container for easy dragging
    // First remove old prepped items to avoid clutter
    const oldPreps = rawIngredientsContainer.querySelectorAll('.is-prep');
    oldPreps.forEach(o => o.remove());

    if (stations.prepArea.item) {
        const el = createDraggableElement(stations.prepArea.item);
        el.classList.add('is-prep');
        rawIngredientsContainer.prepend(el);
    }
}

function updateCookingStations() {
    const activeStations = ['burner1', 'burner2', 'oven'];
    
    activeStations.forEach(id => {
        const st = stations[id];
        if (st.item && st.state === 'cooking') {
            st.progress += 0.2; // roughly 1 progress per sec
            updateStationVisual(id);
            
            // Random sizzle sound while cooking
            if (Math.random() > 0.5) SoundEffects.sizzle();

            if (st.progress >= st.timer) {
                st.state = 'cooked';
                SoundEffects.ding();
                showFloatingText(0, 0, getStationElement(id).getBoundingClientRect(), "Pişti!", "positive");
                updateStationVisual(id);
            }
        } else if (st.item && st.state === 'cooked') {
            st.progress += 0.2;
            if (st.progress >= st.timer * 2.5) { // Burns after lingering
                st.state = 'burnt';
                SoundEffects.error();
                showFloatingText(0, 0, getStationElement(id).getBoundingClientRect(), "Yandı!", "negative");
                updateStationVisual(id);
            }
        }
    });
}

function retrieveItem(stationId) {
    const st = stations[stationId];
    if (!st.item) return;
    const el = getStationElement(stationId);
    
    if (st.state === 'cooked') {
        const resultItem = ITEMSDB[st.item.result] || st.item;
        moveToPlate(resultItem);
    } else if (st.state === 'burnt') {
        showFloatingText(0, 0, el.getBoundingClientRect(), "Çöpe atıldı", "negative");
    } else if (st.state === 'cooking') {
         showFloatingText(0, 0, el.getBoundingClientRect(), "Pişmedi!", "negative");
         return; 
    }
    
    st.item = null;
    st.state = 'empty';
    st.progress = 0;
    updateStationVisual(stationId);
}

function updateStationVisual(stationId) {
    const st = stations[stationId];
    const el = getStationElement(stationId);
    if (!el) return;
    
    let foodContainer = el.querySelector('.food-area');
    if (stationId === 'cuttingBoard') foodContainer = el;
    
    const bar = el.querySelector('.progress-bar');
    
    if (st.item) {
        if(foodContainer && stationId !== 'cuttingBoard') {
            // Apply visual class for the food piece
            foodContainer.className = 'food-area food-visual ' + st.item.baseVisual;
            if (st.state === 'cooking') foodContainer.classList.add('state-cooking');
            if (st.state === 'cooked') {
                const resultItem = ITEMSDB[st.item.result];
                if(resultItem) {
                    // Turn into final visual!
                    foodContainer.className = 'food-area food-visual ' + resultItem.baseVisual;
                }
                foodContainer.classList.add('state-cooked');
            }
            if (st.state === 'burnt') foodContainer.classList.add('state-burnt');
        } else if (foodContainer && stationId === 'cuttingBoard') {
            // Cutting board visual logic
            let oldVisual = foodContainer.querySelector('.temp-cutting-visual');
            if(!oldVisual) {
                oldVisual = document.createElement('div');
                oldVisual.className = 'temp-cutting-visual food-visual ' + st.item.baseVisual;
                foodContainer.appendChild(oldVisual);
            }
        }

        if (st.state === 'cooking' || st.state === 'raw') {
            if (bar) bar.style.width = ((st.progress / st.timer) * 100) + '%';
            if (stationId.includes('burner')) el.classList.add('active');
            if (stationId === 'oven') el.classList.add('active');
        } else if (st.state === 'cooked') {
            if (bar) { bar.style.width = '100%'; bar.style.backgroundColor = '#4CAF50'; }
            if (stationId.includes('burner')) el.classList.remove('active');
            if (stationId === 'oven') el.classList.remove('active');
        } else if (st.state === 'burnt') {
            if (bar) { bar.style.width = '100%'; bar.style.backgroundColor = '#F44336'; }
        }
    } else {
        if (foodContainer && stationId !== 'cuttingBoard') foodContainer.className = 'food-area';
        if (stationId === 'cuttingBoard') {
            const oldVisual = foodContainer.querySelector('.temp-cutting-visual');
            if(oldVisual) oldVisual.remove();
        }
        if (bar) { bar.style.width = '0%'; bar.style.backgroundColor = '#4CAF50'; }
        el.classList.remove('active');
    }
}

function getStationElement(id) {
    if (id === 'cuttingBoard') return cuttingBoardEl;
    if (id === 'burner1') return burner1El;
    if (id === 'burner2') return burner2El;
    if (id === 'oven') return ovenEl;
    return null;
}

function clearAllStations() {
    ['cuttingBoard', 'burner1', 'burner2', 'oven'].forEach(id => {
        stations[id].item = null;
        stations[id].state = 'empty';
        stations[id].progress = 0;
        updateStationVisual(id);
    });
    stations.prepArea.item = null;
    renderPrepArea();
}


// --- Plate & Customer Logic ---
function moveToPlate(item) {
    if (currentPlate.length >= 4) {
        SoundEffects.error();
        return;
    }
    currentPlate.push(item);
    
    SoundEffects.pop();
    
    // Create detailed visual for plate
    const visualItem = document.createElement('div');
    visualItem.className = 'plate-item food-visual ' + item.baseVisual;
    // Add small random rotation for realism
    visualItem.style.transform = 'rotate(' + (Math.random() * 20 - 10) + 'deg)';
    
    // Allow clicking to remove the item from the plate (throw away)
    visualItem.addEventListener('click', () => {
        const index = currentPlate.indexOf(item);
        if (index > -1) {
            currentPlate.splice(index, 1);
        }
        visualItem.remove();
        SoundEffects.playNoise(0.2, 0.3); // Quick trash sound
        showFloatingText(0, 0, plateEl.getBoundingClientRect(), "Çöpe Atıldı", "negative");
        updateServeButton();
    });
    
    plateEl.appendChild(visualItem);
    
    updateServeButton();
}

function clearPlate() {
    currentPlate = [];
    plateEl.innerHTML = '';
    updateServeButton();
}

function updateServeButton() {
    serveBtn.disabled = currentPlate.length === 0;
}

// ... Customer generation rules ...
function scheduleNextCustomer(delay = Math.random() * 2000 + 1000) {
    setTimeout(spawnCustomer, delay);
}

function dismissCustomer() {
    customerActive = false;
    customerEl.classList.add('hidden');
}

function spawnCustomer() {
    if (customerActive) return;
    customerActive = true;
    SoundEffects.footsteps();
    currentCustomer = generateRequest();
    customerDialogueEl.innerHTML = currentCustomer.dialogue;
    
    // Generate Random Character type
    const charTypes = ['type-amca', 'type-genc', 'type-teyze', 'type-kadin'];
    const selectedChar = charTypes[Math.floor(Math.random() * charTypes.length)];
    
    const bodyEl = customerEl.querySelector('.customer-body');
    bodyEl.className = 'customer-body ' + selectedChar;
    
    // Inject the HTML structure for the CSS art components
    bodyEl.innerHTML = `
        <div class="char-head">
            <div class="char-hair"></div>
            <div class="char-eyes"></div>
            <div class="char-mouth"></div>
            <div class="char-accessory"></div>
        </div>
        <div class="char-torso">
            <div class="char-clothes"></div>
        </div>
    `;
    
    const isFlipped = Math.random() > 0.5;
    bodyEl.style.transform = isFlipped ? 'scaleX(-1)' : 'scaleX(1)';
    customerEl.classList.remove('hidden');
}

function generateRequest() {
    // Generate logical meal requests from FINISHED dishes
    const menuItems = {
        iftar: [ITEMSDB['domates_corba'], ITEMSDB['mercimek_corba'], ITEMSDB['kuru_fasulye'], ITEMSDB['sac_kavurma'], ITEMSDB['firin_guvec']],
        sahur: [ITEMSDB['sahanda_yumurta'], ITEMSDB['peynir_dilim'], ITEMSDB['salatalik_dilim'], ITEMSDB['domates_dilim'], ITEMSDB['zeytin']]
    };

    const activeMenu = isIftarMode ? menuItems.iftar : menuItems.sahur;
    const request = { items: [], dialogue: "" };
    
    if (isIftarMode) {
        const numItems = Math.floor(Math.random() * 2) + 1; 
        const itemsCopy = [...activeMenu].sort(() => 0.5 - Math.random());
        request.items = itemsCopy.slice(0, numItems);
        
        if (numItems === 1) {
            request.dialogue = "İyi akşamlar. Sadece " + request.items[0].name + " alabilir miyim?";
        } else {
            request.dialogue = "Hayırlı iftarlar. " + request.items[0].name + " ve " + request.items[1].name + " lütfen.";
        }
    } else {
        const numItems = Math.floor(Math.random() * 3) + 2; 
        const itemsCopy = [...activeMenu].sort(() => 0.5 - Math.random());
        request.items = itemsCopy.slice(0, numItems);
        const itemNames = request.items.map(i => i.name);
        
        if (numItems === 2) {
            request.dialogue = "Hayırlı sahurlar. Sadece " + itemNames[0] + " ve " + itemNames[1] + " yeter.";
        } else {
            const lastItem = itemNames.pop();
            request.dialogue = "Sahur için " + itemNames.join(', ') + " ve " + lastItem + " rica edeyim.";
        }
    }
    return request;
}

function serveOrder() {
    if (!customerActive || !currentCustomer) return;
    
    const requestedIds = currentCustomer.items.map(i => i.id).sort();
    const providedIds = currentPlate.map(i => i.id).sort();
    
    let isPerfect = true;
    let isPartial = false;
    let matchCount = 0;
    
    let reqCopy = [...requestedIds];
    let provCopy = [...providedIds];
    
    provCopy.forEach(id => {
        const index = reqCopy.indexOf(id);
        if (index > -1) {
            matchCount++;
            reqCopy.splice(index, 1);
        } else {
            isPerfect = false; 
        }
    });
    
    if (reqCopy.length > 0) isPerfect = false; 
    if (matchCount > 0 && !isPerfect) isPartial = true;
    
    let scoreChange = 0;
    let moneyChange = 0;
    
    if (isPerfect) {
        scoreChange = 25;
        moneyChange = 50 + (currentPlate.length * 10);
        customerDialogueEl.innerHTML = "Ellerine sağlık ustam, nefis!";
        SoundEffects.cash();
    } else if (isPartial) {
        scoreChange = 5;
        moneyChange = matchCount * 15;
        customerDialogueEl.innerHTML = "Eksik olmuş ama canın sağolsun.";
        SoundEffects.cash();
    } else {
        scoreChange = -15;
        moneyChange = 0;
        customerDialogueEl.innerHTML = "Ustam bu yanlış sipariş! Hiç olmamış.";
        SoundEffects.error();
    }
    
    updateStats(scoreChange, moneyChange);
    showFloatingText(scoreChange, moneyChange, customerEl.getBoundingClientRect());
    
    serveBtn.disabled = true;
    setTimeout(() => { clearPlate(); }, 500); 
    
    setTimeout(() => {
        dismissCustomer();
        scheduleNextCustomer(2000);
    }, 2000); 
}

function updateStats(sChange, mChange) {
    score += sChange;
    money += mChange;
    if (money < 0) money = 0;
    scoreDisplay.textContent = score;
    moneyDisplay.textContent = money + " ₺";
    scoreDisplay.parentElement.style.transform = 'scale(1.1)';
    setTimeout(() => scoreDisplay.parentElement.style.transform = 'scale(1)', 200);
}

function showFloatingText(scoreChange, moneyChange, rect, customText) {
    const x = rect.left + rect.width / 2;
    const y = rect.top;
    
    const div = document.createElement('div');
    div.className = 'floating-text ' + (scoreChange >= 0 && !customText?.includes('Yanlış') && !customText?.includes('Hata') ? 'positive' : 'negative');
    div.style.left = x + 'px';
    div.style.top = y + 'px';
    
    let text = "";
    if (customText) {
        text = customText;
    } else {
        if (scoreChange > 0) text += "+" + scoreChange + " Puan<br>";
        else if (scoreChange < 0) text += scoreChange + " Puan<br>";
        if (moneyChange > 0) text += "+" + moneyChange + " ₺";
    }
    
    div.innerHTML = text;
    floatingContainer.appendChild(div);
    setTimeout(() => div.remove(), 1500);
}

init();
