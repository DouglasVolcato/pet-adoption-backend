import { CreateUserUseCase } from "../../domain/protocols";
import { InvalidFieldError } from "../../presentation/helpers";
import {
  CreateUserRepositoryInterface,
  GetUserByEmailRepositoryInterface,
  IdGeneratorInterface,
  PasswordHasherInterface,
} from "../protocols";

export class CreateUserService implements CreateUserUseCase.Service {
  private readonly createUserRepository: CreateUserRepositoryInterface;
  private readonly getUserByEmailRepository: GetUserByEmailRepositoryInterface;
  private readonly idGenerator: IdGeneratorInterface;
  private readonly passwordHasher: PasswordHasherInterface;

  public constructor(
    createUserRepository: CreateUserRepositoryInterface,
    getUserByEmailRepository: GetUserByEmailRepositoryInterface,
    idGenerator: IdGeneratorInterface,
    passwordHasher: PasswordHasherInterface
  ) {
    this.createUserRepository = createUserRepository;
    this.getUserByEmailRepository = getUserByEmailRepository;
    this.idGenerator = idGenerator;
    this.passwordHasher = passwordHasher;
  }

  public async execute(
    input: CreateUserUseCase.Input
  ): CreateUserUseCase.Output {
    const foundUser = await this.getUserByEmailRepository.getByEmail(
      input.email
    );
    if (foundUser) return new InvalidFieldError("email");
    const id = this.idGenerator.generateId();
    const hashedPassword = this.passwordHasher.hash(input.password);
    return await this.createUserRepository.create({
      ...input,
      id: id,
      password: hashedPassword,
      admin: false,
    });
  }
}
