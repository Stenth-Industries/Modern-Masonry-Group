const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_RE  = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function validateQuote({ fullName, email, phone, role, company, details, productId }) {
  const errors = [];

  if (!fullName?.trim())                          errors.push('Full name is required.');
  else if (fullName.trim().length > 100)          errors.push('Name must be 100 characters or fewer.');

  if (!email?.trim())                             errors.push('Email is required.');
  else if (!EMAIL_RE.test(email.trim()))          errors.push('Invalid email address.');
  else if (email.trim().length > 254)             errors.push('Email must be 254 characters or fewer.');

  if (phone && phone.length > 50)                 errors.push('Phone must be 50 characters or fewer.');
  if (role && role.length > 100)                  errors.push('Role must be 100 characters or fewer.');
  if (company && company.length > 200)            errors.push('Company must be 200 characters or fewer.');
  if (details && details.length > 5000)           errors.push('Details must be 5000 characters or fewer.');

  if (productId != null && productId !== '' && !UUID_RE.test(String(productId))) {
    errors.push('Invalid product reference.');
  }

  return errors;
}

export function sanitizeQuote({ fullName, email, phone, role, company, quantity, details, productId, isGeneral }) {
  const qty = Number(quantity);
  return {
    fullName:  fullName.trim().slice(0, 100),
    email:     email.trim().toLowerCase().slice(0, 254),
    phone:     phone?.trim().slice(0, 50) || null,
    role:      role?.trim().slice(0, 100) || null,
    company:   company?.trim().slice(0, 200) || null,
    quantity:  Number.isFinite(qty) ? Math.min(999_999, Math.max(0, Math.floor(qty))) : null,
    details:   details?.trim().slice(0, 5000) || null,
    productId: (productId && UUID_RE.test(String(productId))) ? productId : null,
    // Explicitly check for the boolean true or the string "true" only
    isGeneral: isGeneral === true || isGeneral === 'true',
  };
}
