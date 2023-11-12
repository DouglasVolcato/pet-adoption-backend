import { ChangePetStatusControllerTypes } from "../../../src/presentation/protocols";
import { ChangePetStatusController } from "../../../src/presentation/controllers";
import { badRequest, ok, serverError } from "../../../src/presentation/helpers";
import { makePetEntity, makeUserEntity } from "../../test-helpers/mocks";
import { ChangePetStatusServiceStub } from "../../test-helpers/stubs";
import { FieldTypeEnum } from "../../../src/validation/protocols";
import { FakeData } from "../../test-helpers/fake-data";
import {
  ChangePetStatusUseCase,
  PetStatusEnum,
} from "../../../src/domain/protocols";
import {
  FieldTypeValidator,
  RequiredFieldValidator,
} from "../../../src/validation/validators";

const makeValidRequest = (): ChangePetStatusControllerTypes.Input => ({
  newStatus: PetStatusEnum.ADOPTED,
  petId: FakeData.id(),
  user: makeUserEntity(),
});

type SutTypes = {
  sut: ChangePetStatusController;
  changePetStatusService: ChangePetStatusUseCase.Service;
};

const makeSut = (): SutTypes => {
  const changePetStatusService = new ChangePetStatusServiceStub();
  const sut = new ChangePetStatusController(changePetStatusService);
  return { sut, changePetStatusService };
};

describe("ChangePetStatusController", () => {
  test("Should set correct validator", async () => {
    const { sut } = makeSut();
    const validatorComposite = (sut as any).validator;
    const validators = (validatorComposite as any).validators;

    expect(validators).toEqual([
      new RequiredFieldValidator("petId"),
      new FieldTypeValidator("petId", FieldTypeEnum.STRING),
      new RequiredFieldValidator("newStatus"),
      new FieldTypeValidator("newStatus", FieldTypeEnum.STRING),
    ]);
  });

  test("Should a bad request if validator return an error", async () => {
    const { sut } = makeSut();
    const error = new Error(FakeData.phrase());
    jest.spyOn((sut as any).validator, "validate").mockReturnValueOnce(error);
    const output = await sut.execute(makeValidRequest());

    expect(output).toEqual(badRequest(error));
  });

  test("Should call ChangePetStatusService with correct values", async () => {
    const { sut, changePetStatusService } = makeSut();
    const request = makeValidRequest();
    const { newStatus, petId } = request;
    const changePetStatusServiceSpy = jest.spyOn(
      changePetStatusService,
      "execute"
    );
    await sut.execute(request);

    expect(changePetStatusServiceSpy).toHaveBeenCalledTimes(1);
    expect(changePetStatusServiceSpy).toHaveBeenCalledWith({
      petId,
      newStatus,
    });
  });

  test("Should return ok", async () => {
    const { sut, changePetStatusService } = makeSut();
    const updatedPet = makePetEntity();
    jest
      .spyOn(changePetStatusService, "execute")
      .mockReturnValueOnce(Promise.resolve(updatedPet));
    const output = await sut.execute(makeValidRequest());

    expect(output).toEqual(ok(updatedPet));
  });

  test("Should return a bad request if ChangePetStatusService returns an error", async () => {
    const { sut, changePetStatusService } = makeSut();
    const error = new Error(FakeData.phrase());
    jest
      .spyOn(changePetStatusService, "execute")
      .mockReturnValueOnce(Promise.resolve(error));
    const output = await sut.execute(makeValidRequest());

    expect(output).toEqual(badRequest(error));
  });

  test("Should return a server error if ChangePetStatusService throws", async () => {
    const { sut, changePetStatusService } = makeSut();
    const error = new Error(FakeData.phrase());
    jest.spyOn(changePetStatusService, "execute").mockImplementationOnce(() => {
      throw error;
    });
    const output = await sut.execute(makeValidRequest());

    expect(output).toEqual(serverError(error));
  });
});
