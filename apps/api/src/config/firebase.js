const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const fs = require('fs');
const path = require('path');

/**
 * Resolve Firebase Admin credentials in a way that works both
 * locally and in production.
 *
 * 1. FIREBASE_SERVICE_ACCOUNT env var  -> production / CI.
 *    AWS Secrets Manager injects this as the whole JSON document.
 *    Note: Secrets Manager often stores newlines as a literal
 *    "\n" two-character sequence, so we unescape before parsing.
 *
 * 2. A key file on disk -> local development only.
 */
function resolveCredentials() {
  const fromEnv = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (fromEnv && fromEnv.trim() !== '') {
    try {
      // Do NOT manually unescape "\n" here. JSON.parse already
      // handles escape sequences natively, and pre-replacing them
      // with raw newlines produces invalid JSON (a literal newline
      // inside a string is a control character, not valid JSON).
      // This matters for the PEM private_key, which contains \n.
      return JSON.parse(fromEnv);
    } catch (error) {
      throw new Error(
        'FIREBASE_SERVICE_ACCOUNT is set but is not valid JSON. ' +
          'Check the secret value in AWS Secrets Manager. Original error: ' +
          error.message
      );
    }
  }

  const candidates = [
    path.join(__dirname, '..', '..', 'serviceAccountKey.json'),
    path.join(__dirname, '..', '..', 'serviceAccountKey.json.json'),
  ];

  for (const file of candidates) {
    if (fs.existsSync(file)) {
      return JSON.parse(fs.readFileSync(file, 'utf8'));
    }
  }

  throw new Error(
    'No Firebase Admin credentials found.\n' +
      '  Production: set the FIREBASE_SERVICE_ACCOUNT environment variable.\n' +
      '  Development: place serviceAccountKey.json in the backend project root.'
  );
}

initializeApp({
  credential: cert(resolveCredentials()),
});

module.exports = { getAuth };
