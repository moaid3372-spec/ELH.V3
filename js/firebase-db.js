"use strict";

import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

/* ============ STUDENTS ============ */

/**
 * حفظ بيانات الطالب في Firestore
 */
export async function saveStudent(db, studentData) {
    try {
        const studentsCollection = collection(db, "students");

        const docRef = await addDoc(studentsCollection, {
            studentName: studentData.studentName,
            username: studentData.username,
            grade: studentData.grade,
            guardian: studentData.guardian,
            whatsappNumber: studentData.whatsappNumber,
            mobileNumber: studentData.mobileNumber,
            email: studentData.email || null,
            createdAt: serverTimestamp(),
            status: "active"
        });

        console.log("Student saved with ID:", docRef.id);
        return { success: true, id: docRef.id };

    } catch (error) {
        console.error("Error saving student:", error);
        return { success: false, error: error.message };
    }
}

/**
 * التحقق من أن اسم المستخدم غير مستخدم مسبقاً
 */
export async function checkUsernameAvailability(db, username) {
    try {
        const studentsCollection = collection(db, "students");

        const usernameQuery = query(
            studentsCollection,
            where("username", "==", username.trim().toLowerCase())
        );

        const querySnapshot = await getDocs(usernameQuery);
        return querySnapshot.empty;

    } catch (error) {
        console.error("Error checking username:", error);
        return true;
    }
}

/* ============ CONTACTS ============ */

/**
 * حفظ رسالة التواصل في Firestore
 */
export async function saveContactMessage(db, contactData) {
    try {
        const contactsCollection = collection(db, "contacts");

        await addDoc(contactsCollection, {
            name: contactData.name,
            phone: contactData.phone,
            message: contactData.message,
            sentAt: serverTimestamp(),
            status: "unread"
        });

        return { success: true };

    } catch (error) {
        console.error("Error saving contact:", error);
        return { success: false, error: error.message };
    }
}

/* ============ PLACEMENT TEST ============ */

/**
 * حفظ نتيجة اختبار تحديد المستوى
 */
export async function savePlacementResult(db, resultData) {
    try {
        const resultsCollection = collection(db, "placement_results");

        await addDoc(resultsCollection, {
            studentId: resultData.studentId,
            studentName: resultData.studentName,
            grade: resultData.grade,
            answer: resultData.answer,
            isCorrect: resultData.isCorrect,
            completedAt: serverTimestamp()
        });

        return { success: true };

    } catch (error) {
        console.error("Error saving placement result:", error);
        return { success: false, error: error.message };
    }
}

/* ============ AUTHENTICATION ============ */

/**
 * إنشاء حساب جديد في Firebase Auth
 */
export async function createAccount(auth, email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        return { success: true, user: userCredential.user };

    } catch (error) {
        const errorMessages = {
            "auth/email-already-in-use": "This email address is already registered.",
            "auth/weak-password": "Password must be at least 8 characters.",
            "auth/invalid-email": "Please enter a valid email address."
        };

        return {
            success: false,
            error: errorMessages[error.code] || "Registration failed. Please try again."
        };
    }
}

/**
 * تسجيل الدخول
 */
export async function loginUser(auth, email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        return { success: true, user: userCredential.user };

    } catch (error) {
        return {
            success: false,
            error: "Incorrect email or password. Please try again."
        };
    }
}

/**
 * إعادة تعيين كلمة المرور
 */
export async function resetPassword(auth, email) {
    try {
        await sendPasswordResetEmail(auth, email);
        return { success: true };

    } catch (error) {
        return {
            success: false,
            error: "Could not send reset email. Please check the address."
        };
    }
}