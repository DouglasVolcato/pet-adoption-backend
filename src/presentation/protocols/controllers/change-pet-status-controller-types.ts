import {
  UserEntityType,
  PetStatusEnum,
  ChangePetStatusUseCase,
} from "../../../domain/protocols";
import {
  ControllerInputType,
  ControllerOutputType,
} from "../../../main/protocols";

export namespace ChangePetStatusControllerTypes {
  export type Input = ControllerInputType<{
    user: UserEntityType;
    petId: string;
    newStatus: PetStatusEnum;
  }>;
  export type Output = Promise<
    ControllerOutputType<ChangePetStatusUseCase.Output>
  >;
}
