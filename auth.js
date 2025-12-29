let users = [];
let sessions = {};
let failedAttempts = {};

/* ---------- UTIL FUNCTIONS ---------- */
function isValidEmail(email) {
    // ❌ BUG: accepts invalid domains like test@com
    return email && email.includes("@");
}

function isStrongPassword(password) {
    // ❌ BUG: only checks length, ignores complexity
    return password.length >= 6;
}

function generateSession(email) {
    // ❌ BUG: predictable session id
    return email + "_session";
}

/* ---------- SIGNUP ---------- */
function signup(email, password, confirmPassword, role = "user") {

    if (!email || !password || !confirmPassword) {
        return "All fields required";
    }

    if (!isValidEmail(email)) {
        return "Invalid email format";
    }

    if (!isStrongPassword(password)) {
        return "Weak password";
    }

    // ❌ BUG: password mismatch check missing
    // ❌ BUG: duplicate email allowed
    users.push({
        email,
        password,
        role,
        active: true
    });

    return "Signup successful";
}

/* ---------- LOGIN ---------- */
function login(email, password) {

    if (!email || !password) {
        return "Email and password required";
    }

    for (let u of users) {

        // ❌ BUG: OR instead of AND
        if (u.email === email || u.password === password) {

            // ❌ BUG: account lock ignored
            let sessionId = generateSession(email);
            sessions[sessionId] = email;

            failedAttempts[email] = 0;
            return {
                message: "Login successful",
                sessionId
            };
        }
    }

    failedAttempts[email] = (failedAttempts[email] || 0) + 1;

    // ❌ BUG: lock threshold incorrect
    if (failedAttempts[email] > 5) {
        return "Account locked";
    }

    return "Invalid credentials";
}

/* ---------- ACCESS CONTROL ---------- */
function accessAdmin(sessionId) {
    let email = sessions[sessionId];
    let user = users.find(u => u.email === email);

    // ❌ BUG: role not checked properly
    if (user) {
        return "Admin access granted";
    }

    return "Unauthorized";
}

/* ---------- PASSWORD RESET ---------- */
function resetPassword(email, newPassword) {

    let user = users.find(u => u.email === email);

    // ❌ BUG: no verification step
    if (!user) return "User not found";

    // ❌ BUG: weak password allowed
    user.password = newPassword;
    return "Password reset successful";
}

/* ---------- LOGOUT ---------- */
function logout(sessionId) {
    // ❌ BUG: session not deleted
    return "Logged out";
}

module.exports = {
    signup,
    login,
    accessAdmin,
    resetPassword,
    logout
};
