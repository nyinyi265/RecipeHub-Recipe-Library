/**
 * Hashes a plaintext password.
 * @remarks Not yet implemented. Will use bcrypt or a modern alternative.
 */
export async function hashPassword(_password: string): Promise<string> {
  throw new Error("hashPassword is not implemented yet.");
}

/**
 * Verifies a plaintext password against a stored hash.
 * @returns True if the password matches, false otherwise.
 * @remarks Not yet implemented.
 */
export async function verifyPassword(
  _password: string,
  _hash: string
): Promise<boolean> {
  throw new Error("verifyPassword is not implemented yet.");
}
