// ========================================
// ILO WEBSITE - COMPLETE JAVASCRIPT FILE
// ========================================

// Global variables
let currentSlideIndex = 0;
let gameScore = 0;
let draggedElement = null;
let currentQuestionIndex = 0;
let userAnswers = [];
let quizCompleted = false;

// Game state variables
let currentGame = 'drag-drop';
let totalScore = 0;

// Memory game variables
let memoryCards = [];
let flippedCards = [];
let matchedPairs = 0;
let memoryMoves = 0;
let memoryTimer = null;
let memoryTime = 0;

// Word search variables
let wordSearchGrid = [];
let wordSearchWords = [];
let foundWords = [];
let selectedCells = [];

// Timeline game variables
let timelineEvents = [];
let timelineOrder = [];
let timelineCorrect = 0;

// True/False game variables
let trueFalseQuestions = [];
let trueFalseCurrent = 0;
let trueFalseScore = 0;

// Matching game variables
let matchingItems = [];
let selectedImage = null;
let selectedLabel = null;
let matchingPairs = 0;

// Quiz questions data
const quizQuestions = [
    {
        question: "¿En qué año fue fundada la OIT?",
        options: ["1919", "1920", "1918", "1921"],
        correct: 0
    },
    {
        question: "¿Cuál es el principio fundamental de la OIT?",
        options: ["El tripartismo", "La globalización", "La privatización", "La centralización"],
        correct: 0
    },
    {
        question: "¿Qué convenio prohíbe el trabajo forzoso?",
        options: ["Convenio No. 87", "Convenio No. 29", "Convenio No. 100", "Convenio No. 138"],
        correct: 1
    },
    {
        question: "¿Cuántos Estados Miembros tiene la OIT actualmente?",
        options: ["185", "186", "187", "188"],
        correct: 2
    },
    {
        question: "¿Qué convenio establece la edad mínima de admisión al empleo?",
        options: ["Convenio No. 100", "Convenio No. 138", "Convenio No. 87", "Convenio No. 29"],
        correct: 1
    }
];

// True/False questions data
const trueFalseQuestionsData = [
    { question: "La OIT fue fundada en 1919 como parte del Tratado de Versalles.", answer: true },
    { question: "La OIT tiene 200 Estados Miembros actualmente.", answer: false },
    { question: "El tripartismo es un principio fundamental de la OIT.", answer: true },
    { question: "La OIT solo se enfoca en países desarrollados.", answer: false },
    { question: "El Convenio No. 29 prohíbe el trabajo forzoso.", answer: true },
    { question: "La OIT no tiene poder para crear convenios internacionales.", answer: false },
    { question: "La libertad sindical está protegida por el Convenio No. 87.", answer: true },
    { question: "La OIT solo trabaja con gobiernos, no con trabajadores.", answer: false },
    { question: "El trabajo decente es uno de los objetivos principales de la OIT.", answer: true },
    { question: "La OIT fue creada después de la Segunda Guerra Mundial.", answer: false }
];

// Timeline events data
const timelineEventsData = [
    { year: 1919, event: "Fundación de la OIT" },
    { year: 1920, event: "Primera Conferencia Internacional del Trabajo" },
    { year: 1944, event: "Declaración de Filadelfia" },
    { year: 1946, event: "OIT se convierte en agencia de la ONU" },
    { year: 1969, event: "Premio Nobel de la Paz a la OIT" },
    { year: 1998, event: "Declaración sobre los Principios y Derechos Fundamentales" }
];

// Memory cards data
const memoryCardsData = [
    { id: 1, content: "🔨", name: "Trabajo" },
    { id: 2, content: "🤝", name: "Negociación" },
    { id: 3, content: "⚖️", name: "Justicia" },
    { id: 4, content: "🛡️", name: "Protección" },
    { id: 5, content: "👥", name: "Sindicatos" },
    { id: 6, content: "💰", name: "Salario" },
    { id: 7, content: "⏰", name: "Jornada" },
    { id: 8, content: "🏖️", name: "Vacaciones" }
];

// Word search words
const wordSearchWordsData = [
    "TRABAJO", "SINDICATO", "SALARIO", "JORNADA", "VACACIONES", "SEGURIDAD", "IGUALDAD", "NEGOCIACION"
];

// Matching game data
const matchingGameData = [
    { id: 1, icon: "🔨", label: "Trabajo Decente", description: "Trabajo productivo en condiciones de libertad, equidad y dignidad" },
    { id: 2, icon: "🤝", label: "Negociación Colectiva", description: "Diálogo entre trabajadores, empleadores y gobiernos" },
    { id: 3, icon: "⚖️", label: "Justicia Social", description: "Principio fundamental de la OIT" },
    { id: 4, icon: "🛡️", label: "Protección Social", description: "Sistemas de protección contra riesgos laborales" },
    { id: 5, icon: "👥", label: "Libertad Sindical", description: "Derecho a formar y afiliarse a sindicatos" },
    { id: 6, icon: "💰", label: "Salario Justo", description: "Remuneración adecuada para una vida digna" }
];

// ========================================
// GAME NAVIGATION
// ========================================
function showGame(gameType) {
    // Hide all game contents
    document.querySelectorAll('.game-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.game-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected game
    document.getElementById(gameType + '-game').classList.add('active');
    
    // Add active class to clicked tab
    event.target.classList.add('active');
    
    currentGame = gameType;
    
    // Initialize the selected game
    switch(gameType) {
        case 'memory':
            if (memoryCards.length === 0) startMemoryGame();
            break;
        case 'wordsearch':
            if (wordSearchGrid.length === 0) startWordSearch();
            break;
        case 'timeline':
            if (timelineEvents.length === 0) startTimelineGame();
            break;
        case 'truefalse':
            if (trueFalseQuestions.length === 0) startTrueFalseGame();
            break;
        case 'matching':
            if (matchingItems.length === 0) startMatchingGame();
            break;
    }
}

// ========================================
// MEMORY GAME
// ========================================
function startMemoryGame() {
    memoryCards = [];
    flippedCards = [];
    matchedPairs = 0;
    memoryMoves = 0;
    memoryTime = 0;
    
    // Create pairs of cards
    const cardPairs = [...memoryCardsData, ...memoryCardsData];
    
    // Shuffle cards
    for (let i = cardPairs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cardPairs[i], cardPairs[j]] = [cardPairs[j], cardPairs[i]];
    }
    
    // Create memory board
    const board = document.getElementById('memory-board');
    board.innerHTML = '';
    
    cardPairs.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'memory-card';
        cardElement.dataset.cardId = card.id;
        cardElement.dataset.index = index;
        cardElement.innerHTML = '<i class="fas fa-question"></i>';
        cardElement.onclick = () => flipCard(index);
        board.appendChild(cardElement);
        
        memoryCards.push({
            element: cardElement,
            id: card.id,
            content: card.content,
            name: card.name,
            flipped: false,
            matched: false
        });
    });
    
    updateMemoryStats();
    startMemoryTimer();
}

function flipCard(index) {
    const card = memoryCards[index];
    
    if (card.flipped || card.matched || flippedCards.length >= 2) return;
    
    card.flipped = true;
    card.element.classList.add('flipped');
    card.element.innerHTML = card.content;
    flippedCards.push(card);
    
    if (flippedCards.length === 2) {
        memoryMoves++;
        updateMemoryStats();
        
        setTimeout(() => {
            checkMatch();
        }, 1000);
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    
    if (card1.id === card2.id) {
        // Match found
        card1.matched = true;
        card2.matched = true;
        card1.element.classList.add('matched');
        card2.element.classList.add('matched');
        matchedPairs++;
        
        if (matchedPairs === memoryCardsData.length) {
            clearInterval(memoryTimer);
            showGameMessage('¡Felicitaciones! Has completado el juego de memoria', 'success');
            totalScore += 100;
            updateTotalScore();
        }
    } else {
        // No match
        card1.flipped = false;
        card2.flipped = false;
        card1.element.classList.remove('flipped');
        card2.element.classList.remove('flipped');
        card1.element.innerHTML = '<i class="fas fa-question"></i>';
        card2.element.innerHTML = '<i class="fas fa-question"></i>';
    }
    
    flippedCards = [];
    updateMemoryStats();
}

function startMemoryTimer() {
    memoryTimer = setInterval(() => {
        memoryTime++;
        updateMemoryStats();
    }, 1000);
}

function updateMemoryStats() {
    document.getElementById('memory-moves').textContent = memoryMoves;
    document.getElementById('memory-pairs').textContent = `${matchedPairs}/${memoryCardsData.length}`;
    
    const minutes = Math.floor(memoryTime / 60);
    const seconds = memoryTime % 60;
    document.getElementById('memory-time').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// ========================================
// WORD SEARCH GAME
// ========================================
function startWordSearch() {
    wordSearchGrid = [];
    wordSearchWords = [...wordSearchWordsData];
    foundWords = [];
    selectedCells = [];
    
    // Create 12x12 grid
    const gridSize = 12;
    for (let i = 0; i < gridSize; i++) {
        wordSearchGrid[i] = [];
        for (let j = 0; j < gridSize; j++) {
            wordSearchGrid[i][j] = { letter: '', found: false, selected: false };
        }
    }
    
    // Place words in grid
    placeWordsInGrid();
    
    // Fill empty spaces with random letters
    fillEmptySpaces();
    
    // Create visual grid
    createWordSearchGrid();
    createWordList();
    updateWordSearchStats();
}

function placeWordsInGrid() {
    const directions = [
        { dx: 1, dy: 0 },   // Horizontal
        { dx: 0, dy: 1 },   // Vertical
        { dx: 1, dy: 1 },   // Diagonal
        { dx: 1, dy: -1 }   // Diagonal inversa
    ];
    
    wordSearchWords.forEach(word => {
        let placed = false;
        let attempts = 0;
        
        while (!placed && attempts < 100) {
            const direction = directions[Math.floor(Math.random() * directions.length)];
            const startX = Math.floor(Math.random() * (12 - word.length * direction.dx));
            const startY = Math.floor(Math.random() * (12 - word.length * direction.dy));
            
            if (canPlaceWord(word, startX, startY, direction)) {
                placeWord(word, startX, startY, direction);
                placed = true;
            }
            attempts++;
        }
    });
}

function canPlaceWord(word, x, y, direction) {
    for (let i = 0; i < word.length; i++) {
        const newX = x + i * direction.dx;
        const newY = y + i * direction.dy;
        
        if (newX < 0 || newX >= 12 || newY < 0 || newY >= 12) return false;
        if (wordSearchGrid[newY][newX].letter !== '' && wordSearchGrid[newY][newX].letter !== word[i]) return false;
    }
    return true;
}

function placeWord(word, x, y, direction) {
    for (let i = 0; i < word.length; i++) {
        const newX = x + i * direction.dx;
        const newY = y + i * direction.dy;
        wordSearchGrid[newY][newX].letter = word[i];
        wordSearchGrid[newY][newX].word = word;
        wordSearchGrid[newY][newX].direction = direction;
        wordSearchGrid[newY][newX].startX = x;
        wordSearchGrid[newY][newX].startY = y;
    }
}

function fillEmptySpaces() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < 12; i++) {
        for (let j = 0; j < 12; j++) {
            if (wordSearchGrid[i][j].letter === '') {
                wordSearchGrid[i][j].letter = letters[Math.floor(Math.random() * letters.length)];
            }
        }
    }
}

function createWordSearchGrid() {
    const grid = document.getElementById('wordsearch-grid');
    grid.innerHTML = '';
    
    for (let i = 0; i < 12; i++) {
        for (let j = 0; j < 12; j++) {
            const cell = document.createElement('div');
            cell.className = 'wordsearch-cell';
            cell.textContent = wordSearchGrid[i][j].letter;
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.onclick = () => selectCell(i, j);
            grid.appendChild(cell);
        }
    }
}

function createWordList() {
    const wordList = document.getElementById('word-list');
    wordList.innerHTML = '';
    
    wordSearchWords.forEach(word => {
        const wordItem = document.createElement('div');
        wordItem.className = 'word-item';
        wordItem.textContent = word;
        wordItem.dataset.word = word;
        wordList.appendChild(wordItem);
    });
}

function selectCell(row, col) {
    const cell = wordSearchGrid[row][col];
    
    if (cell.found) return;
    
    if (selectedCells.length === 0) {
        selectedCells = [{ row, col }];
        cell.selected = true;
        updateCellAppearance(row, col);
    } else if (selectedCells.length === 1) {
        selectedCells.push({ row, col });
        cell.selected = true;
        updateCellAppearance(row, col);
        checkWordSelection();
    } else {
        clearSelection();
        selectedCells = [{ row, col }];
        cell.selected = true;
        updateCellAppearance(row, col);
    }
}

function updateCellAppearance(row, col) {
    const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    const cell = wordSearchGrid[row][col];
    
    if (cell.found) {
        cellElement.classList.add('found');
    } else if (cell.selected) {
        cellElement.classList.add('selected');
    } else {
        cellElement.classList.remove('selected');
    }
}

function checkWordSelection() {
    if (selectedCells.length !== 2) return;
    
    const [cell1, cell2] = selectedCells;
    const word1 = wordSearchGrid[cell1.row][cell1.col].word;
    const word2 = wordSearchGrid[cell2.row][cell2.col].word;
    
    if (word1 && word1 === word2) {
        // Word found!
        foundWords.push(word1);
        markWordAsFound(word1);
        updateWordList(word1);
        clearSelection();
        
        if (foundWords.length === wordSearchWords.length) {
            showGameMessage('¡Excelente! Has encontrado todas las palabras', 'success');
            totalScore += 150;
            updateTotalScore();
        }
    } else {
        setTimeout(() => {
            clearSelection();
        }, 1000);
    }
}

function markWordAsFound(word) {
    for (let i = 0; i < 12; i++) {
        for (let j = 0; j < 12; j++) {
            if (wordSearchGrid[i][j].word === word) {
                wordSearchGrid[i][j].found = true;
                updateCellAppearance(i, j);
            }
        }
    }
}

function updateWordList(word) {
    const wordItem = document.querySelector(`[data-word="${word}"]`);
    wordItem.classList.add('found');
}

function clearSelection() {
    selectedCells.forEach(({ row, col }) => {
        wordSearchGrid[row][col].selected = false;
        updateCellAppearance(row, col);
    });
    selectedCells = [];
}

function updateWordSearchStats() {
    document.getElementById('words-found').textContent = `${foundWords.length}/${wordSearchWords.length}`;
}

// ========================================
// TIMELINE GAME
// ========================================
function startTimelineGame() {
    timelineEvents = [...timelineEventsData];
    timelineOrder = [];
    timelineCorrect = 0;
    
    // Shuffle events
    for (let i = timelineEvents.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [timelineEvents[i], timelineEvents[j]] = [timelineEvents[j], timelineEvents[i]];
    }
    
    createTimelineItems();
    createTimelineAnswer();
    updateTimelineStats();
}

function createTimelineItems() {
    const itemsContainer = document.getElementById('timeline-items');
    itemsContainer.innerHTML = '';
    
    timelineEvents.forEach((event, index) => {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        item.draggable = true;
        item.dataset.year = event.year;
        item.textContent = `${event.year} - ${event.event}`;
        item.ondragstart = (e) => handleTimelineDragStart(e, index);
        itemsContainer.appendChild(item);
    });
}

function createTimelineAnswer() {
    const answerContainer = document.getElementById('timeline-answer');
    answerContainer.innerHTML = '';
    
    // Sort events by year for correct order
    const sortedEvents = [...timelineEventsData].sort((a, b) => a.year - b.year);
    
    sortedEvents.forEach((event, index) => {
        const slot = document.createElement('div');
        slot.className = 'timeline-slot';
        slot.dataset.year = event.year;
        slot.ondragover = handleTimelineDragOver;
        slot.ondrop = (e) => handleTimelineDrop(e, event.year);
        answerContainer.appendChild(slot);
    });
}

function handleTimelineDragStart(e, index) {
    e.dataTransfer.setData('text/plain', index);
    e.target.classList.add('dragging');
}

function handleTimelineDragOver(e) {
    e.preventDefault();
    e.target.classList.add('drag-over');
}

function handleTimelineDrop(e, correctYear) {
    e.preventDefault();
    e.target.classList.remove('drag-over');
    
    const index = parseInt(e.dataTransfer.getData('text/plain'));
    const draggedItem = timelineEvents[index];
    
    if (draggedItem.year === correctYear) {
        e.target.textContent = `${draggedItem.year} - ${draggedItem.event}`;
        e.target.classList.add('correct');
        e.target.classList.remove('drag-over');
        timelineCorrect++;
        
        // Remove from items list
        const itemsContainer = document.getElementById('timeline-items');
        const itemToRemove = itemsContainer.children[index];
        itemToRemove.remove();
        
        if (timelineCorrect === timelineEventsData.length) {
            showGameMessage('¡Perfecto! Has ordenado correctamente la historia de la OIT', 'success');
            totalScore += 120;
            updateTotalScore();
        }
    } else {
        e.target.classList.remove('drag-over');
        showGameMessage('Inténtalo de nuevo. Revisa el año correcto.', 'error');
    }
    
    updateTimelineStats();
}

function updateTimelineStats() {
    document.getElementById('timeline-correct').textContent = `${timelineCorrect}/${timelineEventsData.length}`;
}

// ========================================
// TRUE/FALSE GAME
// ========================================
function startTrueFalseGame() {
    trueFalseQuestions = [...trueFalseQuestionsData];
    trueFalseCurrent = 0;
    trueFalseScore = 0;
    
    // Shuffle questions
    for (let i = trueFalseQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [trueFalseQuestions[i], trueFalseQuestions[j]] = [trueFalseQuestions[j], trueFalseQuestions[i]];
    }
    
    loadTrueFalseQuestion();
    updateTrueFalseStats();
}

function loadTrueFalseQuestion() {
    if (trueFalseCurrent >= trueFalseQuestions.length) {
        showTrueFalseResults();
        return;
    }
    
    const question = trueFalseQuestions[trueFalseCurrent];
    document.getElementById('truefalse-text').textContent = question.question;
    updateTrueFalseStats();
}

function answerTrueFalse(answer) {
    const question = trueFalseQuestions[trueFalseCurrent];
    
    if (answer === question.answer) {
        trueFalseScore++;
        showGameMessage('¡Correcto!', 'success');
    } else {
        showGameMessage('Incorrecto. La respuesta correcta era ' + (question.answer ? 'Verdadero' : 'Falso'), 'error');
    }
    
    trueFalseCurrent++;
    
    setTimeout(() => {
        loadTrueFalseQuestion();
    }, 2000);
}

function showTrueFalseResults() {
    const percentage = (trueFalseScore / trueFalseQuestions.length) * 100;
    let message = `¡Juego completado! Puntuación: ${trueFalseScore}/${trueFalseQuestions.length} (${Math.round(percentage)}%)`;
    
    if (percentage >= 80) {
        message += ' ¡Excelente!';
        totalScore += 100;
    } else if (percentage >= 60) {
        message += ' ¡Muy bien!';
        totalScore += 70;
    } else {
        message += ' ¡Sigue practicando!';
        totalScore += 40;
    }
    
    showGameMessage(message, percentage >= 60 ? 'success' : 'error');
    updateTotalScore();
}

function updateTrueFalseStats() {
    document.getElementById('truefalse-current').textContent = `${trueFalseCurrent + 1}/${trueFalseQuestions.length}`;
    document.getElementById('truefalse-score').textContent = trueFalseScore;
}

// ========================================
// MATCHING GAME
// ========================================
function startMatchingGame() {
    matchingItems = [...matchingGameData];
    selectedImage = null;
    selectedLabel = null;
    matchingPairs = 0;
    
    // Shuffle items
    for (let i = matchingItems.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [matchingItems[i], matchingItems[j]] = [matchingItems[j], matchingItems[i]];
    }
    
    createMatchingImages();
    createMatchingLabels();
    updateMatchingStats();
}

function createMatchingImages() {
    const imagesContainer = document.getElementById('matching-images');
    imagesContainer.innerHTML = '';
    
    matchingItems.forEach((item, index) => {
        const imageItem = document.createElement('div');
        imageItem.className = 'matching-item';
        imageItem.dataset.id = item.id;
        imageItem.innerHTML = `<div class="matching-icon">${item.icon}</div>`;
        imageItem.onclick = () => selectMatchingItem('image', index);
        imagesContainer.appendChild(imageItem);
    });
}

function createMatchingLabels() {
    const labelsContainer = document.getElementById('matching-labels');
    labelsContainer.innerHTML = '';
    
    // Shuffle labels
    const shuffledLabels = [...matchingItems].sort(() => Math.random() - 0.5);
    
    shuffledLabels.forEach((item, index) => {
        const labelItem = document.createElement('div');
        labelItem.className = 'matching-item';
        labelItem.dataset.id = item.id;
        labelItem.innerHTML = `<div>${item.label}</div><small>${item.description}</small>`;
        labelItem.onclick = () => selectMatchingItem('label', index);
        labelsContainer.appendChild(labelItem);
    });
}

function selectMatchingItem(type, index) {
    const item = type === 'image' ? 
        document.querySelectorAll('.matching-item')[index] :
        document.querySelectorAll('.matching-item')[index + matchingItems.length];
    
    if (item.classList.contains('matched')) return;
    
    if (type === 'image') {
        if (selectedImage) selectedImage.classList.remove('selected');
        selectedImage = item;
        item.classList.add('selected');
    } else {
        if (selectedLabel) selectedLabel.classList.remove('selected');
        selectedLabel = item;
        item.classList.add('selected');
    }
    
    if (selectedImage && selectedLabel) {
        checkMatchingPair();
    }
}

function checkMatchingPair() {
    if (selectedImage.dataset.id === selectedLabel.dataset.id) {
        // Match found!
        selectedImage.classList.add('matched');
        selectedLabel.classList.add('matched');
        selectedImage.classList.remove('selected');
        selectedLabel.classList.remove('selected');
        matchingPairs++;
        
        if (matchingPairs === matchingItems.length) {
            showGameMessage('¡Perfecto! Has emparejado todas las imágenes correctamente', 'success');
            totalScore += 130;
            updateTotalScore();
        }
        
        selectedImage = null;
        selectedLabel = null;
    } else {
        // No match
        setTimeout(() => {
            selectedImage.classList.remove('selected');
            selectedLabel.classList.remove('selected');
            selectedImage = null;
            selectedLabel = null;
        }, 1000);
    }
    
    updateMatchingStats();
}

function updateMatchingStats() {
    document.getElementById('matching-pairs').textContent = `${matchingPairs}/${matchingItems.length}`;
}

// ========================================
// DRAG AND DROP GAME (Original)
// ========================================
function initDragAndDropGame() {
    // Make rights items draggable
    document.querySelectorAll('.right-item').forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
    });

    // Make description areas droppable
    document.querySelectorAll('.description-item').forEach(item => {
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('drop', handleDrop);
        item.addEventListener('dragenter', handleDragEnter);
        item.addEventListener('dragleave', handleDragLeave);
    });
}

function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    draggedElement = null;
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleDragEnter(e) {
    e.preventDefault();
    this.classList.add('drag-over');
}

function handleDragLeave(e) {
    this.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    this.classList.remove('drag-over');
    
    if (draggedElement && this.dataset.right === draggedElement.dataset.right) {
        // Correct match
        this.classList.add('correct', 'game-success');
        draggedElement.style.opacity = '0.5';
        draggedElement.style.pointerEvents = 'none';
        gameScore++;
        updateScore();
        
        // Add success animation
        this.style.animation = 'successPulse 0.6s ease';
        
        // Show success message
        showGameMessage('¡Correcto!', 'success');
        
        // Remove animation class after animation completes
        setTimeout(() => {
            this.classList.remove('game-success');
        }, 600);
    } else {
        // Incorrect match
        this.style.animation = 'shake 0.5s ease';
        showGameMessage('Inténtalo de nuevo', 'error');
        
        // Remove animation class after animation completes
        setTimeout(() => {
            this.style.animation = '';
        }, 500);
    }
}

function updateScore() {
    const scoreElement = document.getElementById('score');
    scoreElement.textContent = `${gameScore}/6`;
    scoreElement.style.animation = 'scoreUpdate 0.5s ease';
    
    if (gameScore === 6) {
        showGameMessage('¡Felicitaciones! Has completado el juego', 'success');
        totalScore += 80;
        updateTotalScore();
    }
    
    // Remove animation class after animation completes
    setTimeout(() => {
        scoreElement.style.animation = '';
    }, 500);
}

function resetGame() {
    gameScore = 0;
    updateScore();
    
    // Reset all elements
    document.querySelectorAll('.right-item').forEach(item => {
        item.style.opacity = '1';
        item.style.pointerEvents = 'auto';
    });
    
    document.querySelectorAll('.description-item').forEach(item => {
        item.classList.remove('correct');
    });
    
    // Remove any existing messages
    const existingMessage = document.querySelector('.game-message');
    if (existingMessage) {
        existingMessage.remove();
    }
}

function resetAllGames() {
    // Reset drag and drop game
    resetGame();
    
    // Reset all other games
    memoryCards = [];
    flippedCards = [];
    matchedPairs = 0;
    memoryMoves = 0;
    memoryTime = 0;
    if (memoryTimer) clearInterval(memoryTimer);
    
    wordSearchGrid = [];
    wordSearchWords = [];
    foundWords = [];
    selectedCells = [];
    
    timelineEvents = [];
    timelineOrder = [];
    timelineCorrect = 0;
    
    trueFalseQuestions = [];
    trueFalseCurrent = 0;
    trueFalseScore = 0;
    
    matchingItems = [];
    selectedImage = null;
    selectedLabel = null;
    matchingPairs = 0;
    
    totalScore = 0;
    updateTotalScore();
    
    // Clear all game displays
    document.getElementById('memory-board').innerHTML = '';
    document.getElementById('wordsearch-grid').innerHTML = '';
    document.getElementById('word-list').innerHTML = '';
    document.getElementById('timeline-items').innerHTML = '';
    document.getElementById('timeline-answer').innerHTML = '';
    document.getElementById('matching-images').innerHTML = '';
    document.getElementById('matching-labels').innerHTML = '';
    
    // Reset all stats
    updateMemoryStats();
    updateWordSearchStats();
    updateTimelineStats();
    updateTrueFalseStats();
    updateMatchingStats();
    
    showGameMessage('Todos los juegos han sido reiniciados', 'success');
}

function updateTotalScore() {
    document.getElementById('total-score').textContent = totalScore;
}

// ========================================
// QUIZ FUNCTIONALITY (Original)
// ========================================
function initQuiz() {
    function loadQuestion(index) {
        const question = quizQuestions[index];
        const questionElement = document.getElementById('question-text');
        const optionsContainer = document.querySelector('.quiz-options');
        
        questionElement.textContent = question.question;
        
        // Clear previous options
        optionsContainer.innerHTML = '';
        
        // Create new options
        question.options.forEach((option, optionIndex) => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = option;
            button.onclick = () => selectAnswer(optionIndex);
            
            // Check if this option was previously selected
            if (userAnswers[index] === optionIndex) {
                button.classList.add('selected');
            }
            
            optionsContainer.appendChild(button);
        });
        
        // Update progress
        updateProgress();
        updateNavigation();
    }

    function selectAnswer(optionIndex) {
        userAnswers[currentQuestionIndex] = optionIndex;
        
        // Update button styles with animation
        document.querySelectorAll('.option-btn').forEach((btn, index) => {
            btn.classList.remove('selected');
            if (index === optionIndex) {
                btn.classList.add('selected');
                btn.style.animation = 'pulse 0.3s ease';
            }
        });
        
        updateNavigation();
        
        // Remove animation class after animation completes
        setTimeout(() => {
            document.querySelectorAll('.option-btn').forEach(btn => {
                btn.style.animation = '';
            });
        }, 300);
    }

    function updateProgress() {
        const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
        const progressFill = document.getElementById('progress-fill');
        const questionCounter = document.getElementById('question-counter');
        
        // Animate progress bar
        animateProgressBar(progressFill, progress, 500);
        
        // Animate counter text
        questionCounter.style.animation = 'fadeIn 0.3s ease';
        questionCounter.textContent = `Pregunta ${currentQuestionIndex + 1} de ${quizQuestions.length}`;
        
        // Remove animation class after animation completes
        setTimeout(() => {
            questionCounter.style.animation = '';
        }, 300);
    }

    function updateNavigation() {
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const finishBtn = document.querySelector('.finish-btn');
        
        prevBtn.disabled = currentQuestionIndex === 0;
        nextBtn.disabled = userAnswers[currentQuestionIndex] === undefined;
        
        if (currentQuestionIndex === quizQuestions.length - 1) {
            nextBtn.style.display = 'none';
            finishBtn.style.display = 'inline-block';
            finishBtn.disabled = userAnswers[currentQuestionIndex] === undefined;
        } else {
            nextBtn.style.display = 'inline-block';
            finishBtn.style.display = 'none';
        }
    }

    function nextQuestion() {
        if (currentQuestionIndex < quizQuestions.length - 1) {
            currentQuestionIndex++;
            loadQuestion(currentQuestionIndex);
        }
    }

    function previousQuestion() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            loadQuestion(currentQuestionIndex);
        }
    }

    function finishQuiz() {
        quizCompleted = true;
        calculateScore();
        showResults();
    }

    function calculateScore() {
        let correctAnswers = 0;
        userAnswers.forEach((answer, index) => {
            if (answer === quizQuestions[index].correct) {
                correctAnswers++;
            }
        });
        
        return correctAnswers;
    }

    function showResults() {
        const score = calculateScore();
        const percentage = (score / quizQuestions.length) * 100;
        
        document.querySelector('.quiz-container').style.display = 'none';
        document.getElementById('quiz-results').style.display = 'block';
        
        document.getElementById('final-score').textContent = `${score}/${quizQuestions.length}`;
        
        let feedback = '';
        if (percentage >= 80) {
            feedback = '¡Excelente! Tienes un gran conocimiento sobre la OIT y los derechos laborales.';
            totalScore += 100;
        } else if (percentage >= 60) {
            feedback = '¡Muy bien! Tienes un buen conocimiento, pero puedes mejorar estudiando más sobre la OIT.';
            totalScore += 70;
        } else {
            feedback = 'No te preocupes, la OIT es un tema complejo. Te recomendamos revisar los convenios y objetivos para mejorar tu conocimiento.';
            totalScore += 40;
        }
        
        document.getElementById('results-feedback').textContent = feedback;
        updateTotalScore();
    }

    function restartQuiz() {
        currentQuestionIndex = 0;
        userAnswers = [];
        quizCompleted = false;
        
        document.querySelector('.quiz-container').style.display = 'block';
        document.getElementById('quiz-results').style.display = 'none';
        
        loadQuestion(0);
    }

    // Make functions globally available
    window.selectAnswer = selectAnswer;
    window.nextQuestion = nextQuestion;
    window.previousQuestion = previousQuestion;
    window.finishQuiz = finishQuiz;
    window.restartQuiz = restartQuiz;

    // Initialize quiz
    loadQuestion(0);
}

// ========================================
// CAROUSEL FUNCTIONALITY (Original)
// ========================================
function initCarousel() {
    const slides = document.querySelectorAll('.convention-slide');
    const dots = document.querySelectorAll('.dot');

    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Show current slide with animation
        if (slides[index]) {
            slides[index].classList.add('active');
            slides[index].classList.add('carousel-slide-enter');
            dots[index].classList.add('active');
            
            // Remove animation class after animation completes
            setTimeout(() => {
                slides[index].classList.remove('carousel-slide-enter');
            }, 500);
        }
    }

    function changeSlide(direction) {
        currentSlideIndex += direction;
        
        if (currentSlideIndex >= slides.length) {
            currentSlideIndex = 0;
        } else if (currentSlideIndex < 0) {
            currentSlideIndex = slides.length - 1;
        }
        
        showSlide(currentSlideIndex);
    }

    function currentSlide(index) {
        currentSlideIndex = index - 1;
        showSlide(currentSlideIndex);
    }

    // Auto-advance carousel
    setInterval(() => {
        changeSlide(1);
    }, 8000);

    // Make functions globally available
    window.changeSlide = changeSlide;
    window.currentSlide = currentSlide;
}

// ========================================
// UTILITY FUNCTIONS
// ========================================
function showGameMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.game-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `game-message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
    `;
    
    document.body.appendChild(messageDiv);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

function animateProgressBar(element, target, duration = 1000) {
    element.style.width = '0%';
    
    setTimeout(() => {
        element.style.transition = `width ${duration}ms ease`;
        element.style.width = `${target}%`;
    }, 100);
}

// ========================================
// CSS ANIMATIONS INJECTION
// ========================================
function injectCSSAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes slideInLeft {
            from {
                opacity: 0;
                transform: translateX(-50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes scaleIn {
            from {
                opacity: 0;
                transform: scale(0.8);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
        
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
                transform: translateY(0);
            }
            40% {
                transform: translateY(-10px);
            }
            60% {
                transform: translateY(-5px);
            }
        }
        
        @keyframes float {
            0%, 100% {
                transform: translateY(0px);
            }
            50% {
                transform: translateY(-10px);
            }
        }
        
        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.05);
            }
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes shimmer {
            0% {
                left: -100%;
            }
            100% {
                left: 100%;
            }
        }
        
        @keyframes slideInFromRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes successPulse {
            0% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.1);
                box-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
            }
            100% {
                transform: scale(1);
            }
        }
        
        @keyframes correctAnswer {
            0% {
                background: #f3f4f6;
            }
            50% {
                background: #ecfdf5;
                transform: scale(1.05);
            }
            100% {
                background: #ecfdf5;
                transform: scale(1);
            }
        }
        
        @keyframes shake {
            0%, 100% {
                transform: translateX(0);
            }
            10%, 30%, 50%, 70%, 90% {
                transform: translateX(-5px);
            }
            20%, 40%, 60%, 80% {
                transform: translateX(5px);
            }
        }
        
        @keyframes scoreUpdate {
            0% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.2);
                color: #10b981;
            }
            100% {
                transform: scale(1);
            }
        }
        
        .nav-link {
            position: relative;
            overflow: hidden;
        }
        
        .nav-link::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
        }
        
        .nav-link:hover::before {
            left: 100%;
        }
        
        .section-title {
            position: relative;
            overflow: hidden;
        }
        
        .section-title::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(107, 114, 128, 0.1), transparent);
            animation: shimmer 2s infinite;
        }
        
        .carousel-slide-enter {
            animation: slideInFromRight 0.5s ease;
        }
        
        .game-success {
            animation: successPulse 0.6s ease;
        }
        
        .quiz-correct {
            animation: correctAnswer 0.5s ease;
        }
        
        .nav-link.active {
            background-color: rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
        }
    `;
    document.head.appendChild(style);
}

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    // Inject CSS animations
    injectCSSAnimations();
    
    // Initialize all components
    initCarousel();
    initDragAndDropGame();
    initQuiz();
    
    // Initialize game navigation
    showGame('drag-drop');
    
    // Make functions globally available
    window.showGame = showGame;
    window.startMemoryGame = startMemoryGame;
    window.startWordSearch = startWordSearch;
    window.startTimelineGame = startTimelineGame;
    window.startTrueFalseGame = startTrueFalseGame;
    window.startMatchingGame = startMatchingGame;
    window.answerTrueFalse = answerTrueFalse;
    window.resetGame = resetGame;
    window.resetAllGames = resetAllGames;
    
    console.log('ILO Website with all games initialized successfully! 🚀');
});