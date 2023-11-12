export interface TokenDecrypterInterface {
  decryptToken(token: string, secret: string): any | undefined;
}
