import { LoginUseCase } from "../../domain/protocols/usecases/login-usecase";
import { EnvVars } from "../../main/config";
import { InvalidFieldError } from "../../presentation/helpers";
import {
  GetUserByEmailRepositoryInterface,
  PasswordHashCheckerInterface,
  TokenGeneratorInterface,
} from "../protocols";

export class LoginService implements LoginUseCase.Service {
  private readonly getUserByEmailRepository: GetUserByEmailRepositoryInterface;
  private readonly passwordHashChecker: PasswordHashCheckerInterface;
  private readonly tokenGenerator: TokenGeneratorInterface;

  public constructor(
    getUserByEmailRepository: GetUserByEmailRepositoryInterface,
    passwordHashChecker: PasswordHashCheckerInterface,
    tokenGenerator: TokenGeneratorInterface
  ) {
    this.getUserByEmailRepository = getUserByEmailRepository;
    this.passwordHashChecker = passwordHashChecker;
    this.tokenGenerator = tokenGenerator;
  }

  public async execute(input: LoginUseCase.Input): LoginUseCase.Output {
    const foundUser = await this.getUserByEmailRepository.getByEmail(
      input.email
    );
    if (!foundUser) return new InvalidFieldError("email");
    const passwordValid = this.passwordHashChecker.validate(
      input.password,
      foundUser.password
    );
    if (!passwordValid) return new InvalidFieldError("password");
    const token = this.tokenGenerator.generateToken(
      { id: foundUser.id },
      EnvVars.SECRET()
    );
    return { token: token, user: foundUser };
  }
}
