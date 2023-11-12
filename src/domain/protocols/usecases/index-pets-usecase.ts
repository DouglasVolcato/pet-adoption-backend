export namespace IndexPetsUseCase {
  export interface Service {
    execute(): Output;
  }
  export type Output = Promise<void>;
}
