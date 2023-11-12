import { ChangePetStatusUseCase } from "../../../../src/domain/protocols";
import { makePetEntity } from "../../mocks";

export class ChangePetStatusServiceStub
  implements ChangePetStatusUseCase.Service
{
  public async execute(
    input: ChangePetStatusUseCase.Input
  ): ChangePetStatusUseCase.Output {
    return Promise.resolve(makePetEntity());
  }
}
