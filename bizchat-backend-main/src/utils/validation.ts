import { UserRole } from '../constants/roles';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phoneNumber: string): boolean => {
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return phoneRegex.test(phoneNumber);
};

export const validatePassword = (password: string): string | null => {
  if (password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  if (password.length > 100) {
    return 'Password must not exceed 100 characters';
  }
  return null;
};

export const validateName = (name: string, fieldName: string): string | null => {
  if (!name || name.trim().length === 0) {
    return `${fieldName} is required`;
  }
  if (name.trim().length < 2) {
    return `${fieldName} must be at least 2 characters long`;
  }
  if (name.trim().length > 50) {
    return `${fieldName} must not exceed 50 characters`;
  }
  return null;
};

export const validateSignUpData = (data: {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  password: string;
}): string[] => {
  const errors: string[] = [];

  const firstNameError = validateName(data.firstName, 'First name');
  if (firstNameError) errors.push(firstNameError);

  const lastNameError = validateName(data.lastName, 'Last name');
  if (lastNameError) errors.push(lastNameError);

  if (!data.email || !validateEmail(data.email)) {
    errors.push('Please provide a valid email address');
  }

  if (data.phoneNumber && !validatePhoneNumber(data.phoneNumber)) {
    errors.push('Please provide a valid phone number');
  }

  const passwordError = validatePassword(data.password);
  if (passwordError) errors.push(passwordError);

  return errors;
};

export const validateSignInData = (data: {
  email: string;
  password: string;
}): string[] => {
  const errors: string[] = [];

  if (!data.email || !validateEmail(data.email)) {
    errors.push('Please provide a valid email address');
  }

  if (!data.password || data.password.trim().length === 0) {
    errors.push('Password is required');
  }

  return errors;
};

export const validateRole = (role: string): boolean => {
  return Object.values(UserRole).includes(role as UserRole);
};

export const validateUpdateUserData = (data: {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role?: string;
}): string[] => {
  const errors: string[] = [];

  if (data.firstName !== undefined) {
    const firstNameError = validateName(data.firstName, 'First name');
    if (firstNameError) errors.push(firstNameError);
  }

  if (data.lastName !== undefined) {
    const lastNameError = validateName(data.lastName, 'Last name');
    if (lastNameError) errors.push(lastNameError);
  }

  if (data.phoneNumber !== undefined && !validatePhoneNumber(data.phoneNumber)) {
    errors.push('Please provide a valid phone number');
  }

  if (data.role !== undefined && !validateRole(data.role)) {
    errors.push('Invalid role. Must be user, manager, or admin');
  }

  return errors;
};
