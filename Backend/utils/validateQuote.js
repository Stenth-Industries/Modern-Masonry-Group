const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateQuote({ fullName, email, company, details }) {
  const errors = [];

  if (!fullName?.trim())                          errors.push('Full name is required.');
  else if (fullName.trim().length > 100)          errors.push('Name must be 100 characters or fewer.');

  if (!email?.trim())                             errors.push('Email is required.');
  else if (!EMAIL_RE.test(email.trim()))          errors.push('Invalid email address.');
  else if (email.trim().length > 254)             errors.push('Email must be 254 characters or fewer.');

  if (company  && company.length  > 200)          errors.push('Company must be 200 characters or fewer.');
  if (details  && details.length  > 5000)         errors.push('Details must be 5000 characters or fewer.');

  return errors;
}

export function sanitizeQuote({ fullName, email, company, quantity, details, productId, isGeneral }) {
  return {
    fullName:  fullName.trim().slice(0, 100),
    email:     email.trim().toLowerCase().slice(0, 254),
    company:   company?.trim().slice(0, 200)  || null,
    quantity:  Number.isFinite(Number(quantity)) ? Math.max(0, Math.floor(Number(quantity))) : null,
    details:   details?.trim().slice(0, 5000) || null,
    productId: productId || null,
    isGeneral: Boolean(isGeneral),
  };
}
