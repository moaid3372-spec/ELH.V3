// ===== شاشة الترحيب =====
function enterSite() {
    const welcomeScreen = document.getElementById('welcomeScreen');
    welcomeScreen.classList.add('hidden');
    document.body.style.overflow = 'auto';
    localStorage.setItem('elh_visited', 'true');
}

// التحقق من الزيارة السابقة
document.addEventListener('DOMContentLoaded', function() {
    const visited = localStorage.getItem('elh_visited');
    if (visited) {
        const welcomeScreen = document.getElementById('welcomeScreen');
        welcomeScreen.classList.add('hidden');
    } else {
        document.body.style.overflow = 'hidden';
    }
});

// ===== تبديل الوضع =====
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('elh_theme', newTheme);
    
    const icon = document.querySelector('.theme-icon');
    icon.textContent = newTheme === 'dark' ? '🌙' : '☀️';
}

// تحميل الوضع المحفوظ
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('elh_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const icon = document.querySelector('.theme-icon');
    if (icon) icon.textContent = savedTheme === 'dark' ? '🌙' : '☀️';
});

// ===== قائمة الموبايل =====
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
}

// إغلاق القائمة عند النقر على رابط
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('navLinks').classList.remove('active');
    });
});

// ===== نموذج التسجيل =====
document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const name = document.getElementById('regName').value.trim();
    const username = document.getElementById('regUsername').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    const grade = document.getElementById('regGrade').value;
    const father = document.getElementById('regFather').value.trim();
    const mother = document.getElementById('regMother').value.trim();
    const guardian = document.getElementById('regGuardian').value.trim();
    const whatsapp = document.getElementById('regWhatsapp').value.trim();
    const mobile = document.getElementById('regMobile').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    
    // التحقق من تطابق كلمة المرور
    if (password !== confirmPassword) {
        alert('كلمتا المرور غير متطابقتين!');
        return;
    }
    
    // التحقق من طول كلمة المرور
    if (password.length < 6) {
        alert('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
        return;
    }

    // التحقق من البريد الإلكتروني
    if (!email) {
        alert('البريد الإلكتروني مطلوب!');
        return;
    }
    
    try {
        const { db, auth, firebaseDB } = window.firebaseApp;
        
        // Check username availability
        const available = await firebaseDB.checkUsernameAvailability(db, username);
        if (!available) {
            alert('اسم المستخدم موجود مسبقاً! اختر اسماً آخر');
            return;
        }
        
        // Create auth account
        const result = await firebaseDB.createAccount(auth, email, password);
        if (!result.success) {
            alert('خطأ: ' + result.error);
            return;
        }
        
        // Save student data
        const studentData = {
            studentName: name,
            username: username,
            grade: grade,
            guardian: guardian,
            whatsappNumber: whatsapp,
            mobileNumber: mobile,
            email: email,
            father: father,
            mother: mother
        };
        
        await firebaseDB.saveStudent(db, studentData);
        
        // Show success
        const successScreen = document.getElementById('successScreen');
        successScreen.style.display = 'flex';
        
        // Clear form
        document.getElementById('registerForm').reset();
        
        setTimeout(() => {
            successScreen.style.display = 'none';
            showPlacementTest();
        }, 3000);
        
    } catch (error) {
        console.error("Registration error:", error);
        alert('حدث خطأ: ' + error.message);
    }
});

// ===== إظهار اختبار تحديد المستوى =====
function showPlacementTest() {
    // إخفاء جميع الأقسام
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'none';
    });
    
    // إظهار قسم الاختبار
    const testSection = document.getElementById('placement-test');
    testSection.style.display = 'block';
    
    // التمرير لأعلى
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // إعادة تعيين حالة الاختبار
    document.getElementById('testStart').style.display = 'block';
    document.getElementById('testQuestions').style.display = 'none';
    document.getElementById('testResult').style.display = 'none';
}

// ===== أسئلة اختبار تحديد المستوى =====
const placementQuestions = [
    {
        question: "What is the correct form: 'She ___ to school every day'?",
        options: ["go", "goes", "going", "gone"],
        correct: 1
    },
    {
        question: "Choose the correct sentence:",
        options: ["He don't like apples", "He doesn't likes apples", "He doesn't like apples", "He not like apples"],
        correct: 2
    },
    {
        question: "What is the past tense of 'write'?",
        options: ["writed", "wrote", "written", "writing"],
        correct: 1
    },
    {
        question: "'I have been studying for 2 hours' - This is:",
        options: ["Present Simple", "Present Continuous", "Present Perfect", "Present Perfect Continuous"],
        correct: 3
    },
    {
        question: "Choose the correct word: 'The book is ___ the table'",
        options: ["in", "at", "on", "to"],
        correct: 2
    },
    {
        question: "What does 'enormous' mean?",
        options: ["Small", "Very big", "Fast", "Slow"],
        correct: 1
    },
    {
        question: "'If I ___ rich, I would travel the world'",
        options: ["am", "was", "were", "be"],
        correct: 2
    },
    {
        question: "The passive form of 'They built the house' is:",
        options: ["The house is built", "The house was built", "The house were built", "The house built"],
        correct: 1
    },
    {
        question: "Which sentence uses the correct conditional?",
        options: ["If it rains, I will stay home", "If it rain, I stay home", "If it rained, I will stay home", "If it rains, I would stay home"],
        correct: 0
    },
    {
        question: "'She suggested that he ___ earlier'",
        options: ["leave", "leaves", "leaving", "left"],
        correct: 0
    }
];

let currentQuestion = 0;
let score = 0;

function startTest() {
    currentQuestion = 0;
    score = 0;
    document.getElementById('testStart').style.display = 'none';
    document.getElementById('testQuestions').style.display = 'block';
    showQuestion();
}

function showQuestion() {
    const question = placementQuestions[currentQuestion];
    document.getElementById('questionText').textContent = question.question;
    document.getElementById('questionCounter').textContent = `السؤال ${currentQuestion + 1} من ${placementQuestions.length}`;
    
    const progress = ((currentQuestion) / placementQuestions.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option;
        btn.onclick = () => selectAnswer(index);
        optionsContainer.appendChild(btn);
    });
}

function selectAnswer(index) {
    const question = placementQuestions[currentQuestion];
    const buttons = document.querySelectorAll('.option-btn');
    
    buttons.forEach(btn => btn.disabled = true);
    
    if (index === question.correct) {
        buttons[index].classList.add('correct');
        score++;
    } else {
        buttons[index].classList.add('wrong');
        buttons[question.correct].classList.add('correct');
    }
    
    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < placementQuestions.length) {
            showQuestion();
        } else {
            showResult();
        }
    }, 1500);
}

function showResult() {
    document.getElementById('testQuestions').style.display = 'none';
    document.getElementById('testResult').style.display = 'block';
    document.getElementById('progressFill').style.width = '100%';
    
    const percentage = (score / placementQuestions.length) * 100;
    let level, message;
    
    if (percentage >= 80) {
        level = 'Advanced - متقدم';
        message = 'مستوى ممتاز! أنت جاهز للمحتوى المتقدم.';
    } else if (percentage >= 60) {
        level = 'Intermediate - متوسط';
        message = 'مستوى جيد! سنعمل على تطوير مهاراتك.';
    } else if (percentage >= 40) {
        level = 'Pre-Intermediate - قبل المتوسط';
        message = 'مستوى مقبول! سنساعدك في التحسن.';
    } else {
        level = 'Beginner - مبتدئ';
        message = 'لا تقلق! سنبدأ معك من الأساسيات.';
    }
    
    document.getElementById('resultLevel').textContent = level;
    document.getElementById('resultMessage').textContent = message;
}

function goToDashboard() {
    alert('مرحباً بك في لوحة التحكم! (سيتم تطويرها قريباً)');
    // إعادة عرض الصفحة الرئيسية
    document.querySelectorAll('section').forEach(section => {
        section.style.display = '';
    });
    document.getElementById('placement-test').style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== نموذج تسجيل الدخول =====
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    try {
        const { auth, firebaseDB } = window.firebaseApp;
        
        const result = await firebaseDB.loginUser(auth, email, password);
        
        if (result.success) {
            alert('تم تسجيل الدخول بنجاح! مرحباً');
            document.getElementById('loginForm').reset();
            showPlacementTest();
        } else {
            alert('خطأ: ' + result.error);
        }
    } catch (error) {
        console.error("Login error:", error);
        alert('حدث خطأ في تسجيل الدخول: ' + error.message);
    }
});

// ===== نموذج استعادة كلمة المرور =====
document.getElementById('forgotForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('forgotInput').value.trim();
    
    try {
        const { auth, firebaseDB } = window.firebaseApp;
        
        const result = await firebaseDB.resetPassword(auth, email);
        
        if (result.success) {
            alert('تم إرسال رابط استعادة كلمة المرور إلى: ' + email);
            document.getElementById('forgotForm').reset();
        } else {
            alert('خطأ: ' + result.error);
        }
    } catch (error) {
        console.error("Reset password error:", error);
        alert('حدث خطأ: ' + error.message);
    }
});

// ===== نموذج التواصل =====
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const name = this.querySelector('input[type="text"]').value.trim();
    const email = this.querySelector('input[type="email"]').value.trim();
    const message = this.querySelector('textarea').value.trim();
    
    try {
        const { db, firebaseDB } = window.firebaseApp;
        
        await firebaseDB.saveContactMessage(db, {
            name: name,
            phone: email,
            message: message
        });
        
        alert('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.');
        this.reset();
    } catch (error) {
        console.error("Contact form error:", error);
        alert('حدث خطأ: ' + error.message);
    }
});

// ===== تأثير التمرير على شريط التنقل =====
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) {
        navbar.style.padding = '10px 0';
        navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.3)';
    } else {
        navbar.style.padding = '15px 0';
        navbar.style.boxShadow = 'none';
    }
});

// ===== تأثيرات الظهور عند التمرير =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.about-card, .program-card, .feature-card, .dev-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});
