const typingTexts = [
    "Web Developer",
    "Computer Engineering Student",
    "Frontend Enthusiast",
    "Problem Solver"
];

const typedTextElement = document.querySelector(".typed-text");
const statNumbers = document.querySelectorAll(".stat-number");
const revealElements = document.querySelectorAll(".reveal");
const skillBars = document.querySelectorAll(".skill-progress");
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

    let speed = isDeleting ? 60 : 120;

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

function handleRevealAnimations() {
    // GSAP ScrollTrigger animations already control opacity/transform for the same sections.
    // "GSAP only" requirement: skip this IntersectionObserver reveal logic when GSAP is present.
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
        return;
    }

    revealElements.forEach((element, index) => {
        element.classList.add("reveal-up");
        element.style.transitionDelay = `${Math.min(index * 0.04, 0.2)}s`;
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.14 });

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });
}


function handleSkillAnimation() {
    // This project currently doesn't define any .skill-progress elements in HTML.
    // Keep it safe and fast: if none exist, do nothing.
    if (!skillBars || skillBars.length === 0) {
        return;
    }

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const width = entry.target.dataset.width || 0;
                entry.target.style.setProperty("--progress-width", `${width}%`);
                entry.target.classList.add("animate");
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    skillBars.forEach((bar) => {
        skillObserver.observe(bar);
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
    const hasGsap = typeof gsap !== "undefined";

    if (!preloader) {
        return;
    }

    if (!hasGsap) {
        setTimeout(() => {
            preloader.classList.add("hidden");
            preloader.style.display = "none";
        }, 900);
        return;
    }

    const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

    timeline
        .from(".preloader-mark", { duration: 0.8, opacity: 0, scale: 0.45, rotateX: 70, filter: "blur(18px)" })
        .from(".preloader-kicker", { duration: 0.55, opacity: 0, y: 18 }, "-=0.25")
        .from(".preloader h2", { duration: 0.7, opacity: 0, y: 28, scale: 0.95, filter: "blur(14px)" }, "-=0.15")
        .to(".preloader-content", { duration: 0.8, z: 180, scale: 1.08, filter: "blur(3px)" }, "+=0.25")
        .to(preloader, {
            duration: 0.9,
            opacity: 0,
            scale: 1.08,
            ease: "power2.inOut",
            onComplete: () => {
                preloader.classList.add("hidden");
                preloader.style.display = "none";
            }
        }, "-=0.15")
        .from(".navbar", { duration: 0.8, y: -40, opacity: 0 }, "-=0.45")
        .from(".hero-label", { duration: 0.7, x: -40, opacity: 0, filter: "blur(8px)" }, "-=0.42")
        .from(".hero-content h1", { duration: 0.95, x: -84, z: -180, opacity: 0, filter: "blur(12px)" }, "-=0.28")
        .from(".typing-container, .hero-description", { duration: 0.75, y: 36, opacity: 0, stagger: 0.12 }, "-=0.45")
        .from(".stat-card", { duration: 0.75, y: 42, rotateX: 55, opacity: 0, stagger: 0.06 }, "-=0.36")
        .from(".hero-buttons .btn", { duration: 0.8, scale: 0.7, opacity: 0, stagger: 0.08, ease: "back.out(1.8)" }, "-=0.42")
        .from(".image-card", { duration: 1, rotateY: -24, rotateX: 10, scale: 0.9, opacity: 0, filter: "blur(10px)" }, "-=0.8");
}

function setupParticleScene() {
    const canvas = document.getElementById("sceneCanvas");

    if (!canvas || typeof THREE === "undefined") {
        return;
    }

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
    const particleCount = window.innerWidth < 768 ? 420 : 900;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const accent = new THREE.Color(0x66e3ff);
    const violet = new THREE.Color(0x9c7bff);

    for (let index = 0; index < particleCount; index++) {
        const offset = index * 3;
        positions[offset] = (Math.random() - 0.5) * 34;
        positions[offset + 1] = (Math.random() - 0.5) * 22;
        positions[offset + 2] = (Math.random() - 0.5) * 28;

        const color = accent.clone().lerp(violet, Math.random());
        colors[offset] = color.r;
        colors[offset + 1] = color.g;
        colors[offset + 2] = color.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.035,
        vertexColors: true,
        transparent: true,
        opacity: 0.82,
        depthWrite: false
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);
    camera.position.z = 11;

    function resize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }

    function animate() {
        points.rotation.y += 0.0009;
        points.rotation.x += 0.00035;
        camera.position.z = 11 + Math.sin(Date.now() * 0.00035) * 0.4;
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    resize();
    animate();
    window.addEventListener("resize", resize);
}

function setupCustomCursor() {
    const dot = document.querySelector(".cursor-dot");
    const ring = document.querySelector(".cursor-ring");

    if (!dot || !ring || window.matchMedia("(pointer: coarse)").matches) {
        return;
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener("mousemove", (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;
    });

    function renderCursor() {
        ringX += (mouseX - ringX) * 0.16;
        ringY += (mouseY - ringY) * 0.16;
        ring.style.left = `${ringX}px`;
        ring.style.top = `${ringY}px`;
        requestAnimationFrame(renderCursor);
    }

    document.querySelectorAll("a, button, input, textarea, .project-card, .skill-category, .image-card, .certificate-card").forEach((element) => {
        element.addEventListener("mouseenter", () => ring.classList.add("cursor-hover"));
        element.addEventListener("mouseleave", () => ring.classList.remove("cursor-hover"));
    });

    renderCursor();
}

function setupMagneticButtons() {
    if (window.matchMedia("(pointer: coarse), (max-width: 768px)").matches) {
        return;
    }

    document.querySelectorAll(".btn, .theme-toggle, .chatbot-toggle").forEach((button) => {
        button.addEventListener("mousemove", (event) => {
            const rect = button.getBoundingClientRect();
            const x = event.clientX - rect.left - rect.width / 2;
            const y = event.clientY - rect.top - rect.height / 2;
            button.style.transform = `translate(${x * 0.16}px, ${y * 0.16}px)`;
        });

        button.addEventListener("mouseleave", () => {
            button.style.transform = "";
        });
    });
}

function setupTiltInteractions() {
    if (window.matchMedia("(pointer: coarse), (max-width: 768px)").matches) {
        return;
    }

    const tiltItems = document.querySelectorAll(".image-card, .project-card, .skill-category, .about-card, .highlight-card, .certificate-card");

    tiltItems.forEach((item) => {
        item.addEventListener("mousemove", (event) => {
            const rect = item.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;
            item.style.transform = `perspective(900px) rotateX(${-y * 9}deg) rotateY(${x * 11}deg) translateY(-6px)`;
        });

        item.addEventListener("mouseleave", () => {
            item.style.transform = "";
        });
    });
}

function setupCinematicScrollAnimations() {
    // User request: scroll animation sab hata do to avoid blank/hidden content issues.
    // Keeping this function as no-op.
    return;

    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
        return;
    }

    gsap.registerPlugin(ScrollTrigger);


    gsap.to(".background-marquee", {
        yPercent: -12,
        ease: "none",
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 1.2
        }
    });

    gsap.to(".hero-content", {
        y: -120,
        z: -220,
        opacity: 0.28,
        filter: "blur(7px)",
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "55% center",
            end: "bottom top",
            scrub: true
        }
    });

    gsap.to(".image-card", {
        y: -80,
        rotateY: 16,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    gsap.from("#about .about-card", {
        y: 90,
        z: -220,
        rotateX: 18,
        opacity: 0,
        filter: "blur(14px)",
        stagger: 0.12,
        scrollTrigger: {
            trigger: "#about",
            start: "top 74%",
            end: "center center",
            scrub: 1
        }
    });

    gsap.from("#about .highlight-card", {
        x: 80,
        rotateY: -28,
        opacity: 0,
        stagger: 0.1,
        scrollTrigger: {
            trigger: "#about .about-highlights",
            start: "top 78%",
            end: "bottom 58%",
            scrub: 1
        }
    });

    gsap.from(".skill-category", {
        y: 150,
        rotateX: 62,
        transformOrigin: "50% 100%",
        opacity: 0,
        stagger: 0.12,
        scrollTrigger: {
            trigger: "#skills",
            start: "top 72%",
            end: "center center",
            scrub: 1.1
        }
    });

    gsap.from(".credential-card", {
        y: 90,
        z: -140,
        rotateY: 22,
        opacity: 0,
        filter: "blur(10px)",
        stagger: 0.06,
        scrollTrigger: {
            trigger: ".credentials-block",
            start: "top 78%",
            end: "center 55%",
            scrub: 1
        }
    });

    gsap.from(".certificate-card", {
        y: 110,
        z: -180,
        rotateX: 36,
        opacity: 0,
        filter: "blur(12px)",
        stagger: 0.09,
        scrollTrigger: {
            trigger: ".certificate-showcase",
            start: "top 78%",
            end: "center 55%",
            scrub: 1
        }
    });

    gsap.to(".skill-icon-box", {
        rotateY: 360,
        duration: 7,
        repeat: -1,
        ease: "none",
        stagger: 0.4
    });

    const projectCards = gsap.utils.toArray(".project-card");
    projectCards.forEach((card, index) => {
        gsap.from(card, {
            x: index % 2 === 0 ? -120 : 120,
            y: 80,
            z: -180,
            rotateY: index % 2 === 0 ? 26 : -26,
            opacity: 0,
            filter: "blur(10px)",
            scrollTrigger: {
                trigger: card,
                start: "top 82%",
                end: "top 48%",
                scrub: 0.9
            }
        });
    });

    if (window.innerWidth > 1024) {
        gsap.to(".projects-grid", {
            x: () => {
                const grid = document.querySelector(".projects-grid");
                if (!grid) {
                    return 0;
                }

                return Math.min(0, window.innerWidth - grid.scrollWidth - 80);
            },
            ease: "none",
            scrollTrigger: {
                trigger: "#projects",
                start: "top top",
                end: "+=900",
                scrub: 1,
                invalidateOnRefresh: true
            }
        });
    }

    gsap.to(".timeline-line", {
        scaleY: 1,
        scrollTrigger: {
            trigger: ".education-timeline",
            start: "top 80%",
            end: "bottom 55%",
            scrub: true
        }
    });

    gsap.from(".education-item", {
        x: (index) => index % 2 === 0 ? -90 : 90,
        opacity: 0,
        filter: "blur(8px)",
        stagger: 0.14,
        scrollTrigger: {
            trigger: "#education",
            start: "top 74%",
            end: "bottom 55%",
            scrub: 1
        }
    });

    gsap.from("#contact .contact-info, #contact .contact-form", {
        y: 90,
        scale: 0.96,
        opacity: 0,
        filter: "blur(12px)",
        stagger: 0.16,
        scrollTrigger: {
            trigger: "#contact",
            start: "top 76%",
            end: "center 58%",
            scrub: 1
        }
    });

    // Safety: ensure ScrollTrigger recalculates positions after all animations are created.
    try {
        ScrollTrigger.refresh();
    } catch (e) {
        // no-op
    }
}

document.addEventListener("DOMContentLoaded", () => {
    setupThemeToggle();
    runTypingEffect();
    animateCounters();
    handleRevealAnimations();
    handleSkillAnimation();
    setupMobileMenu();
    setupContactForm();
    setupPhoneReveal();
    setupChatbot();
    setupPreloaderSequence();
    setupParticleScene();
    setupCustomCursor();
    setupMagneticButtons();
    setupTiltInteractions();
    setupCinematicScrollAnimations();
});
