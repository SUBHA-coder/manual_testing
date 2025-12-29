const {
  signup,
  login,
  accessAdmin,
  resetPassword,
  logout
} = require("./auth");

test("Signup fails when password is empty", () => {
  expect(signup("a@test.com", "", "")).toBe("All fields required");
});

test("Signup allows mismatched passwords (BUG)", () => {
  expect(signup("b@test.com", "123456", "000000"))
    .toBe("Signup successful");
});

test("Login succeeds with wrong password (BUG)", () => {
  signup("c@test.com", "123456", "123456");
  const result = login("c@test.com", "wrong");
  expect(result.message).toBe("Login successful");
});

test("Admin access granted to normal user (BUG)", () => {
  const res = login("c@test.com", "123456");
  expect(accessAdmin(res.sessionId))
    .toBe("Admin access granted");
});

test("Logout does not invalidate session (BUG)", () => {
  const res = login("c@test.com", "123456");
  logout(res.sessionId);
  expect(accessAdmin(res.sessionId))
    .toBe("Admin access granted");
});
