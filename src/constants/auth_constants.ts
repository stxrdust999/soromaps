/**
 * Valida o formato básico de um e-mail (ex: nome@dominio.com).
 * @type {RegExp}
 * @example
 * EMAIL_REGEX.test('dev@provedor.com'); // true
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Valida uma senha com pelo menos 8 caracteres, incluindo pelo menos uma letra maiúscula, uma letra minúscula e um número.
 * @type {RegExp}
 * @example
 * PASSWORD_REGEX.test('Senha@123'); // true
 */
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export { EMAIL_REGEX, PASSWORD_REGEX };
