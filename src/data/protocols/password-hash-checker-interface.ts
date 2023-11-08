export interface PasswordHashCheckerInterface {
  validate(value: string, hashedValue: string): boolean;
}
