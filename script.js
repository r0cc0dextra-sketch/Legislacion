// Carousel functionality
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.convention-slide');
const dots = document.querySelectorAll('.dot');

function showSlide(index) {
    // Hide all slides
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Show current slide
    if (slides[index]) {
        slides[index].classList.add('active');
        dots[index].classList.add('active');
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

// Drag and Drop Game
let gameScore = 0;
let draggedElement = null;

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
        this.classList.add('correct');
        draggedElement.style.opacity = '0.5';
        draggedElement.style.pointerEvents = 'none';
        gameScore++;
        updateScore();
        
        // Show success message
        showGameMessage('¡Correcto!', 'success');
    } else {
        // Incorrect match
        showGameMessage('Inténtalo de nuevo', 'error');
    }
}

function updateScore() {
    document.getElementById('score').textContent = `${gameScore}/6`;
    
    if (gameScore === 6) {
        showGameMessage('¡Felicitaciones! Has completado el juego', 'success');
    }
}

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

// Quiz functionality
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

let currentQuestionIndex = 0;
let userAnswers = [];
let quizCompleted = false;

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
    
    // Update button styles
    document.querySelectorAll('.option-btn').forEach((btn, index) => {
        btn.classList.remove('selected');
        if (index === optionIndex) {
            btn.classList.add('selected');
        }
    });
    
    updateNavigation();
}

function updateProgress() {
    const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
    document.getElementById('progress-fill').style.width = `${progress}%`;
    document.getElementById('question-counter').textContent = `Pregunta ${currentQuestionIndex + 1} de ${quizQuestions.length}`;
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
    } else if (percentage >= 60) {
        feedback = '¡Muy bien! Tienes un buen conocimiento, pero puedes mejorar estudiando más sobre la OIT.';
    } else {
        feedback = 'No te preocupes, la OIT es un tema complejo. Te recomendamos revisar los convenios y objetivos para mejorar tu conocimiento.';
    }
    
    document.getElementById('results-feedback').textContent = feedback;
}

function restartQuiz() {
    currentQuestionIndex = 0;
    userAnswers = [];
    quizCompleted = false;
    
    document.querySelector('.quiz-container').style.display = 'block';
    document.getElementById('quiz-results').style.display = 'none';
    
    loadQuestion(0);
}

// Smooth scrolling for navigation links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Initialize quiz
document.addEventListener('DOMContentLoaded', function() {
    loadQuestion(0);
    
    // Add CSS animation for game messages
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
    `;
    document.head.appendChild(style);
});

// Add scroll effect to navigation
window.addEventListener('scroll', function() {
    const nav = document.querySelector('.nav');
    if (window.scrollY > 100) {
        nav.style.background = 'rgba(30, 64, 175, 0.95)';
        nav.style.backdropFilter = 'blur(10px)';
    } else {
        nav.style.background = '#1e40af';
        nav.style.backdropFilter = 'none';
    }
});

// Add intersection observer for section highlighting
const observerOptions = {
    threshold: 0.3,
    rootMargin: '-50px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (correspondingLink) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                correspondingLink.classList.add('active');
            }
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section[id]').forEach(section => {
    observer.observe(section);
});

// Add active class styling
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        background-color: rgba(255, 255, 255, 0.2);
        transform: translateY(-2px);
    }
`;
document.head.appendChild(style);