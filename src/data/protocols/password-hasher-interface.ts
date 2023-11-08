export interface PasswordHasherInterface {
  hash(value: string): string;
}
