// ===== Dashboard Management =====

let currentStudent = null;
let currentUser = null;

// Initialize Dashboard
async function initDashboard() {
    try {
        const { auth } = window.firebaseApp;
        
        // Check if user is logged in
        if (!auth.currentUser) {
            showLoginPage();
            return;
        }

        currentUser = auth.currentUser;
        await loadStudentData();
        showDashboard();
    } catch (error) {
        console.error("Dashboard initialization error:", error);
        showLoginPage();
    }
}

// Load Student Data from Firestore
async function loadStudentData() {
    try {
        const { db } = window.firebaseApp;
        const { collection, query, where, getDocs } = await import(
            "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
        );

        const studentsRef = collection(db, "students");
        const q = query(studentsRef, where("email", "==", currentUser.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            currentStudent = querySnapshot.docs[0].data();
            currentStudent.id = querySnapshot.docs[0].id;
            updateDashboardUI();
        }
    } catch (error) {
        console.error("Error loading student data:", error);
    }
}

// Update Dashboard UI with Student Data
function updateDashboardUI() {
    if (!currentStudent) return;

    // Welcome message
    const studentName = currentStudent.studentName || "الطالب";
    document.getElementById('userGreeting').textContent = `مرحباً، ${studentName}`;
    document.getElementById('studentWelcome').textContent = 
        `أهلاً وسهلاً ${studentName}! نحن سعداء برؤيتك. استمتع برحلتك التعليمية معنا.`;

    // Profile Tab
    document.getElementById('profileName').textContent = studentName;
    document.getElementById('profileGrade').textContent = getGradeLabel(currentStudent.grade);
    document.getElementById('profileUsername').textContent = currentStudent.username || '-';
    document.getElementById('profileEmail').textContent = currentStudent.email || '-';
    document.getElementById('profilePhone').textContent = currentStudent.mobileNumber || '-';
    document.getElementById('profileWhatsapp').textContent = currentStudent.whatsappNumber || '-';
    document.getElementById('profileGuardian').textContent = currentStudent.guardian || 'غير محدد';

    // Format join date
    if (currentStudent.createdAt) {
        const date = new Date(currentStudent.createdAt.seconds * 1000);
        const formattedDate = date.toLocaleDateString('ar-EG');
        document.getElementById('profileJoinDate').textContent = formattedDate;
    }

    // Set stats (Mock data - will be replaced with real data)
    updateStats();
}

// Get Arabic label for grade
function getGradeLabel(grade) {
    const gradeLabels = {
        'primary1': 'الصف الأول الابتدائي',
        'primary2': 'الصف الثاني الابتدائي',
        'primary3': 'الصف الثالث الابتدائي',
        'primary4': 'الصف الرابع الابتدائي',
        'primary5': 'الصف الخامس الابتدائي',
        'primary6': 'الصف السادس الابتدائي',
        'prep1': 'الصف الأول الإعدادي',
        'prep2': 'الصف الثاني الإعدادي',
        'prep3': 'الصف الثالث الإعدادي'
    };
    return gradeLabels[grade] || 'غير محدد';
}

// Update Statistics
function updateStats() {
    // Mock data - replace with real data from Firestore
    const stats = {
        completedLessons: 0,
        learningHours: 0,
        completedLevels: 0,
        dailyStreak: 0,
        overallProgress: 0
    };

    document.getElementById('completedLessons').textContent = stats.completedLessons;
    document.getElementById('learningHours').textContent = stats.learningHours;
    document.getElementById('completedLevels').textContent = stats.completedLevels;
    document.getElementById('dailyStreak').textContent = stats.dailyStreak;
    document.getElementById('overallProgress').style.width = stats.overallProgress + '%';
    document.getElementById('progressPercentage').textContent = stats.overallProgress + '%';
}

// Show Dashboard Tab
function showDashboardTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.dashboard-tab').forEach(tab => {
        tab.style.display = 'none';
    });

    // Remove active class from all buttons
    document.querySelectorAll('.sidebar-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    const tabElement = document.getElementById(tabName + '-tab');
    if (tabElement) {
        tabElement.style.display = 'block';
    }

    // Add active class to button
    event.target.classList.add('active');
}

// Show Dashboard Section
function showDashboard() {
    // Hide all main sections
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'none';
    });

    // Show dashboard
    const dashboard = document.getElementById('dashboard');
    if (dashboard) {
        dashboard.style.display = 'block';
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Show Login Page
function showLoginPage() {
    document.querySelectorAll('section').forEach(section => {
        section.style.display = '';
    });
    const dashboard = document.getElementById('dashboard');
    if (dashboard) {
        dashboard.style.display = 'none';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Logout Function
async function logout() {
    try {
        const { auth } = window.firebaseApp;
        await auth.signOut();
        
        currentStudent = null;
        currentUser = null;
        
        alert('تم تسجيل الخروج بنجاح');
        showLoginPage();
        
        // Reset to login section
        document.querySelectorAll('section').forEach(section => {
            section.style.display = '';
        });
        document.getElementById('dashboard').style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        console.error("Logout error:", error);
        alert('حدث خطأ في تسجيل الخروج');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Wait for Firebase to be ready
    setTimeout(() => {
        if (window.firebaseApp) {
            initDashboard();
        }
    }, 1000);
});

// Check auth state on every page load
window.addEventListener('load', function() {
    if (window.firebaseApp && window.firebaseApp.auth.currentUser) {
        initDashboard();
    }
});
