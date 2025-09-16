// Carousel functionality
let currentSlideIndex = 0;
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
        // Add celebration animation to all correct items
        document.querySelectorAll('.description-item.correct').forEach(item => {
            item.style.animation = 'bounce 0.6s ease';
        });
    }
    
    // Remove animation class after animation completes
    setTimeout(() => {
        scoreElement.style.animation = '';
    }, 500);
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

// Animation utilities
const AnimationUtils = {
    // Fade in animation
    fadeIn: (element, duration = 500) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    },

    // Slide in from left
    slideInLeft: (element, duration = 500) => {
        element.style.opacity = '0';
        element.style.transform = 'translateX(-50px)';
        element.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        });
    },

    // Slide in from right
    slideInRight: (element, duration = 500) => {
        element.style.opacity = '0';
        element.style.transform = 'translateX(50px)';
        element.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        });
    },

    // Scale in animation
    scaleIn: (element, duration = 500) => {
        element.style.opacity = '0';
        element.style.transform = 'scale(0.8)';
        element.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        });
    },

    // Bounce animation
    bounce: (element, duration = 600) => {
        element.style.animation = `bounce ${duration}ms ease`;
    },

    // Pulse animation
    pulse: (element, duration = 1000) => {
        element.style.animation = `pulse ${duration}ms ease-in-out`;
    }
};

// Intersection Observer for scroll animations
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            const animationType = element.dataset.animation || 'fadeIn';
            const delay = parseInt(element.dataset.delay) || 0;
            
            setTimeout(() => {
                switch(animationType) {
                    case 'fadeIn':
                        AnimationUtils.fadeIn(element);
                        break;
                    case 'slideInLeft':
                        AnimationUtils.slideInLeft(element);
                        break;
                    case 'slideInRight':
                        AnimationUtils.slideInRight(element);
                        break;
                    case 'scaleIn':
                        AnimationUtils.scaleIn(element);
                        break;
                    case 'bounce':
                        AnimationUtils.bounce(element);
                        break;
                }
            }, delay);
            
            scrollObserver.unobserve(element);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Add hover animations to cards
function addHoverAnimations() {
    // Info cards hover effect
    document.querySelectorAll('.info-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
        });
    });

    // Objective cards hover effect
    document.querySelectorAll('.objective-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-12px) scale(1.03)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
        });
    });

    // Right items hover effect
    document.querySelectorAll('.right-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
            this.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = 'none';
        });
    });

    // Quiz options hover effect
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
            this.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = 'none';
        });
    });
}

// Add typing animation to header
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Add floating animation to ILO logo
function addFloatingAnimation() {
    const logo = document.querySelector('.ilo-logo');
    if (logo) {
        logo.style.animation = 'float 3s ease-in-out infinite';
    }
}

// Add parallax effect to header
function addParallaxEffect() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const header = document.querySelector('.header');
        const rate = scrolled * -0.5;
        
        if (header) {
            header.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Add counter animation
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }
    
    updateCounter();
}

// Add progress bar animation
function animateProgressBar(element, target, duration = 1000) {
    element.style.width = '0%';
    
    setTimeout(() => {
        element.style.transition = `width ${duration}ms ease`;
        element.style.width = `${target}%`;
    }, 100);
}

// Add ripple effect to buttons
function addRippleEffect() {
    document.querySelectorAll('button, .nav-link').forEach(element => {
        element.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Add smooth reveal animations to sections
function addRevealAnimations() {
    // Add animation attributes to elements
    document.querySelectorAll('.info-card').forEach((card, index) => {
        card.dataset.animation = 'fadeIn';
        card.dataset.delay = index * 100;
        scrollObserver.observe(card);
    });

    document.querySelectorAll('.objective-card').forEach((card, index) => {
        card.dataset.animation = 'scaleIn';
        card.dataset.delay = index * 150;
        scrollObserver.observe(card);
    });

    document.querySelectorAll('.convention-slide').forEach((slide, index) => {
        slide.dataset.animation = 'fadeIn';
        slide.dataset.delay = index * 200;
    });

    document.querySelectorAll('.right-item').forEach((item, index) => {
        item.dataset.animation = 'slideInLeft';
        item.dataset.delay = index * 100;
        scrollObserver.observe(item);
    });

    document.querySelectorAll('.description-item').forEach((item, index) => {
        item.dataset.animation = 'slideInRight';
        item.dataset.delay = index * 100;
        scrollObserver.observe(item);
    });
}

// Initialize quiz
document.addEventListener('DOMContentLoaded', function() {
    loadQuestion(0);
    
    // Add comprehensive CSS animations
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
        
        @keyframes shimmer {
            0% {
                left: -100%;
            }
            100% {
                left: 100%;
            }
        }
        
        .carousel-slide-enter {
            animation: slideInFromRight 0.5s ease;
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
        
        .game-success {
            animation: successPulse 0.6s ease;
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
        
        .quiz-correct {
            animation: correctAnswer 0.5s ease;
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
    `;
    document.head.appendChild(style);
    
    // Initialize all animations
    addHoverAnimations();
    addFloatingAnimation();
    addParallaxEffect();
    addRippleEffect();
    addRevealAnimations();
    
    // Add typing effect to header title
    const headerTitle = document.querySelector('.header-title');
    if (headerTitle) {
        const originalText = headerTitle.textContent;
        typeWriter(headerTitle, originalText, 80);
    }
    
    // Animate counters when they come into view
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.textContent);
                animateCounter(counter, target);
                counterObserver.unobserve(counter);
            }
        });
    });
    
    // Observe score elements for counter animation
    document.querySelectorAll('#score, #final-score').forEach(score => {
        counterObserver.observe(score);
    });
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