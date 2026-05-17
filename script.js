const typingTexts = [
    "Web Developer",
    "Computer Engineering Student",
    "Frontend Enthusiast",
    "Problem Solver"
];

const typedTextElement = document.querySelector(".typed-text");
const statNumbers = document.querySelectorAll(".stat-number");
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-menu a");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const chatbotToggle = document.querySelector(".chatbot-toggle");
const chatbotPanel = document.querySelector(".chatbot-panel");
const chatbotClose = document.querySelector(".chatbot-close");
const chatbot = document.querySelector(".chatbot");
const chatbotForm = document.getElementById("chatbotForm");
const chatbotInput = document.getElementById("chatbotInput");
const chatMessages = document.getElementById("chatMessages");
const quickQuestions = document.querySelectorAll(".quick-question");
const themeToggle = document.querySelector(".theme-toggle");
const phoneRevealBtn = document.getElementById("phoneRevealBtn");
const phoneNumber = document.getElementById("phoneNumber");
const themeCycle = ["dark", "light", "green"];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function getCurrentTheme() {
    if (document.body.classList.contains("green-theme")) {
        return "green";
    }

    if (document.body.classList.contains("light-theme")) {
        return "light";
    }

    return "dark";
}

function applyTheme(theme) {
    document.body.classList.toggle("light-theme", theme === "light");
    document.body.classList.toggle("green-theme", theme === "green");
    document.documentElement.style.colorScheme = theme === "light" ? "light" : "dark";
}

function updateThemeIcon() {
    if (!themeToggle) {
        return;
    }

    const icon = themeToggle.querySelector("i");
    const currentTheme = getCurrentTheme();
    const themeIcons = {
        dark: "fas fa-moon",
        light: "fas fa-sun",
        green: "fas fa-leaf"
    };

    icon.className = themeIcons[currentTheme];
    themeToggle.setAttribute("aria-label", `Current theme: ${currentTheme}. Click to change theme.`);
    themeToggle.setAttribute("aria-pressed", currentTheme === "dark" ? "false" : "true");
}

function setupThemeToggle() {
    if (!themeToggle) {
        return;
    }

    let savedTheme = null;

    try {
        savedTheme = localStorage.getItem("portfolio-theme");
    } catch (error) {
        savedTheme = null;
    }

    const initialTheme = themeCycle.includes(savedTheme) ? savedTheme : "dark";
    applyTheme(initialTheme);

    updateThemeIcon();

    themeToggle.addEventListener("click", () => {
        const currentTheme = getCurrentTheme();
        const nextTheme = themeCycle[(themeCycle.indexOf(currentTheme) + 1) % themeCycle.length];
        applyTheme(nextTheme);

        try {
            localStorage.setItem("portfolio-theme", nextTheme);
        } catch (error) {
        }

        updateThemeIcon();
    });
}

function runTypingEffect() {
    if (!typedTextElement) {
        return;
    }

    const currentText = typingTexts[textIndex];

    if (isDeleting) {
        typedTextElement.textContent = currentText.slice(0, charIndex - 1);
        charIndex--;
    } else {
        typedTextElement.textContent = currentText.slice(0, charIndex + 1);
        charIndex++;
    }

    let speed = isDeleting ? 90 : 180;

    if (!isDeleting && charIndex === currentText.length) {
        speed = 1600;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % typingTexts.length;
        speed = 350;
    }

    setTimeout(runTypingEffect, speed);
}

function animateCounters() {
    statNumbers.forEach((stat) => {
        const target = Number(stat.dataset.target);
        let current = 0;
        const increment = Math.max(1, Math.ceil(target / 60));

        const updateCounter = () => {
            current += increment;

            if (current >= target) {
                stat.textContent = `${target}+`;
                return;
            }

            stat.textContent = `${current}+`;
            requestAnimationFrame(updateCounter);
        };

        updateCounter();
    });
}

function setupMobileMenu() {
    if (!hamburger || !navMenu) {
        return;
    }

    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");

        const isOpen = hamburger.classList.contains("active");
        hamburger.setAttribute("aria-expanded", isOpen);
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
            hamburger.setAttribute("aria-expanded", "false");
        });
    });
}

function showError(input, message) {
    const formGroup = input.parentElement;
    const errorText = formGroup.querySelector(".error-text");

    errorText.textContent = message;
    input.style.borderColor = "rgba(255, 107, 129, 0.8)";
}

function clearError(input) {
    const formGroup = input.parentElement;
    const errorText = formGroup.querySelector(".error-text");

    errorText.textContent = "";
    input.style.borderColor = "";
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setupContactForm() {
    if (!contactForm || !formStatus) {
        return;
    }

    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const nameInput = document.getElementById("name");
        const emailInput = document.getElementById("email");
        const messageInput = document.getElementById("message");

        let isValid = true;

        [nameInput, emailInput, messageInput].forEach((input) => clearError(input));
        formStatus.textContent = "";
        formStatus.className = "form-status";

        if (nameInput.value.trim().length < 3) {
            showError(nameInput, "Please enter at least 3 characters.");
            isValid = false;
        }

        if (!validateEmail(emailInput.value.trim())) {
            showError(emailInput, "Please enter a valid email address.");
            isValid = false;
        }

        if (messageInput.value.trim().length < 10) {
            showError(messageInput, "Message should be at least 10 characters long.");
            isValid = false;
        }

        if (!isValid) {
            formStatus.textContent = "Please fix the errors before submitting.";
            formStatus.classList.add("error");
            return;
        }

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();
        const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
        const body = encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        );

        window.location.href = `mailto:sahilbelim5399@gmail.com?subject=${subject}&body=${body}`;

        formStatus.textContent = "Your email app is opening with the message details.";
        formStatus.classList.add("success");
        contactForm.reset();
    });
}

function setupPhoneReveal() {
    if (!phoneRevealBtn || !phoneNumber) {
        return;
    }

    phoneRevealBtn.addEventListener("click", () => {
        const isHidden = phoneNumber.hasAttribute("hidden");

        if (isHidden) {
            phoneNumber.removeAttribute("hidden");
            phoneRevealBtn.textContent = "Hide Number";
            return;
        }

        phoneNumber.setAttribute("hidden", "");
        phoneRevealBtn.textContent = "Show Number";
    });
}

function addChatMessage(message, type) {
    if (!chatMessages) {
        return;
    }

    const messageElement = document.createElement("div");
    messageElement.className = `message ${type}-message`;
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getBotReply(question) {
    const userQuestion = question.toLowerCase();

    if (userQuestion.includes("skill") || userQuestion.includes("technology")) {
        return "Sahil works with HTML, CSS, JavaScript, React, Node.js, Django, MongoDB and MySQL.";
    }

    if (userQuestion.includes("project")) {
        return "Sahil has built projects like Smart Workforce Resource Allocation System, Smart City Management System and Service Management System.";
    }

    if (userQuestion.includes("education") || userQuestion.includes("study") || userQuestion.includes("college")) {
        return "Sahil is a Computer Engineering student at CVM University and currently maintains a CGPA of 8.09.";
    }

    if (userQuestion.includes("contact") || userQuestion.includes("email") || userQuestion.includes("phone")) {
        return "You can contact Sahil at sahilbelim5399@gmail.com or call +91 9924447860.";
    }

    if (userQuestion.includes("internship") || userQuestion.includes("available") || userQuestion.includes("hire")) {
        return "Yes, Sahil is open to internships, freelance work and new learning opportunities.";
    }

    if (userQuestion.includes("location") || userQuestion.includes("where")) {
        return "Sahil is based in Anand, Gujarat, India.";
    }

    return "I can answer simple questions about Sahil's skills, projects, education, contact details and availability.";
}

function setupChatbot() {
    if (!chatbot || !chatbotToggle || !chatbotPanel || !chatbotClose || !chatbotForm || !chatbotInput) {
        return;
    }

    let isDragging = false;
    let hasMoved = false;
    let pointerOffsetX = 0;
    let pointerOffsetY = 0;

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function setChatbotPosition(x, y) {
        const maxX = window.innerWidth - chatbot.offsetWidth - 8;
        const maxY = window.innerHeight - chatbot.offsetHeight - 8;
        const nextX = clamp(x, 8, maxX);
        const nextY = clamp(y, 8, maxY);

        chatbot.style.left = `${nextX}px`;
        chatbot.style.top = `${nextY}px`;
    }

    function snapChatbotToSide() {
        const rect = chatbot.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const shouldSnapLeft = centerX < window.innerWidth / 2;
        const snapX = shouldSnapLeft ? 8 : window.innerWidth - rect.width - 8;

        chatbot.classList.toggle("snap-left", shouldSnapLeft);
        chatbot.classList.toggle("snap-right", !shouldSnapLeft);
        chatbot.style.left = `${snapX}px`;
        chatbot.style.top = `${clamp(rect.top, 8, window.innerHeight - rect.height - 8)}px`;
    }

    function startDrag(event) {
        isDragging = true;
        hasMoved = false;

        const rect = chatbot.getBoundingClientRect();
        pointerOffsetX = event.clientX - rect.left;
        pointerOffsetY = event.clientY - rect.top;

        chatbot.style.right = "auto";
        chatbot.style.bottom = "auto";
        chatbot.style.left = `${rect.left}px`;
        chatbot.style.top = `${rect.top}px`;

        chatbotToggle.setPointerCapture(event.pointerId);
    }

    function handleDrag(event) {
        if (!isDragging) {
            return;
        }

        const nextX = event.clientX - pointerOffsetX;
        const nextY = event.clientY - pointerOffsetY;

        if (Math.abs(nextX - parseFloat(chatbot.style.left || 0)) > 3 || Math.abs(nextY - parseFloat(chatbot.style.top || 0)) > 3) {
            hasMoved = true;
        }

        setChatbotPosition(nextX, nextY);
    }

    function stopDrag(event) {
        if (!isDragging) {
            return;
        }

        isDragging = false;
        chatbotToggle.releasePointerCapture(event.pointerId);
        snapChatbotToSide();
    }

    const initialX = window.innerWidth - chatbot.offsetWidth - 20;
    const initialY = window.innerHeight - chatbot.offsetHeight - 20;
    chatbot.classList.add("snap-right");
    chatbot.style.left = `${initialX}px`;
    chatbot.style.top = `${initialY}px`;

    chatbotToggle.addEventListener("pointerdown", startDrag);
    chatbotToggle.addEventListener("pointermove", handleDrag);
    chatbotToggle.addEventListener("pointerup", stopDrag);
    chatbotToggle.addEventListener("pointercancel", stopDrag);

    chatbotToggle.addEventListener("click", () => {
        if (hasMoved) {
            hasMoved = false;
            return;
        }

        chatbotPanel.classList.toggle("open");
    });

    chatbotClose.addEventListener("click", () => {
        chatbotPanel.classList.remove("open");
    });

    chatbotForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const question = chatbotInput.value.trim();
        if (!question) {
            return;
        }

        addChatMessage(question, "user");
        addChatMessage(getBotReply(question), "bot");
        chatbotInput.value = "";
    });

    quickQuestions.forEach((button) => {
        button.addEventListener("click", () => {
            const question = button.textContent.trim();
            addChatMessage(question, "user");
            addChatMessage(getBotReply(question), "bot");
        });
    });

    window.addEventListener("resize", () => {
        snapChatbotToSide();
    });
}

function setupPreloaderSequence() {
    const preloader = document.getElementById("preloader");

    if (!preloader) {
        return;
    }

    setTimeout(() => {
        preloader.classList.add("hidden");
        preloader.style.display = "none";
    }, 1100);
}

document.addEventListener("DOMContentLoaded", () => {
    setupThemeToggle();
    runTypingEffect();
    animateCounters();
    setupMobileMenu();
    setupContactForm();
    setupPhoneReveal();
    setupChatbot();
    setupPreloaderSequence();
});
