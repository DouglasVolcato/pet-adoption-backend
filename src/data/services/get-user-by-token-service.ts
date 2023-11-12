import { GetUserByTokenUserUseCase } from "../../domain/protocols";
import { EnvVars } from "../../main/config";
import { InvalidFieldError } from "../../presentation/helpers";
import {
  GetUserByIdRepositoryInterface,
  TokenDecrypterInterface,
} from "../protocols";

export class GetUserByTokenService
  implements GetUserByTokenUserUseCase.Service
{
  private readonly tokenDecrypter: TokenDecrypterInterface;
  private readonly getUserByIdRepository: GetUserByIdRepositoryInterface;

  public constructor(
    tokenDecrypter: TokenDecrypterInterface,
    getUserByIdRepository: GetUserByIdRepositoryInterface
  ) {
    this.tokenDecrypter = tokenDecrypter;
    this.getUserByIdRepository = getUserByIdRepository;
  }

  public async execute({
    token,
  }: GetUserByTokenUserUseCase.Input): GetUserByTokenUserUseCase.Output {
    const decryptedToken = this.tokenDecrypter.decryptToken(
      token,
      EnvVars.SECRET()
    );
    if (!decryptedToken) return new InvalidFieldError("token");
    const userId = decryptedToken.id;
    const foundUser = await this.getUserByIdRepository.getById(userId);
    if (!foundUser) return new InvalidFieldError("token");
    return foundUser;
  }
}
