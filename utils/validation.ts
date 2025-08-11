export const validateEmail = (email: string): string | true => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return true;
};

export const validatePassword = (password: string): string | true => {
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
  }
  return true;
};

export const validatePhoneNumber = (phoneNumber: string): string | true => {
  const phoneRegex = /^\+?[\d\s\-$$$$]{10,}$/;
  if (!phoneRegex.test(phoneNumber)) {
    return 'Please enter a valid phone number';
  }
  return true;
};

export const validateConfirmPassword = (
  confirmPassword: string,
  password: string,
): string | true => {
  if (confirmPassword !== password) {
    return 'Passwords do not match';
  }
  return true;
};
