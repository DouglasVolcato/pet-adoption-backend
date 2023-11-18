import { DbTransactionControllerDecorator } from "../../../src/presentation/decorators";
import { DatabaseConnectorInterface } from "../../../src/presentation/protocols";
import { ControllerInterface } from "../../../src/main/protocols";
import { makeRandonData } from "../../test-helpers/mocks";
import { ok, serverError } from "../../../src/presentation/helpers";
import {
  ControllerStub,
  DatabaseConnectorStub,
} from "../../test-helpers/stubs";

type SutTypes = {
  sut: DbTransactionControllerDecorator;
  controller: ControllerInterface;
  databaseConnector: DatabaseConnectorInterface;
};

const makeSut = (): SutTypes => {
  const controller = new ControllerStub();
  const databaseConnector = new DatabaseConnectorStub();
  const sut = new DbTransactionControllerDecorator(
    controller,
    databaseConnector
  );
  return { sut, controller, databaseConnector };
};

describe("DbTransactionControllerDecorator", () => {
  test("Should call Controller with correct value", async () => {
    const { sut, controller } = makeSut();
    const requestData = makeRandonData();
    const controllerSpy = jest.spyOn(controller, "execute");
    await sut.execute(requestData);

    expect(controllerSpy).toHaveBeenCalledTimes(1);
    expect(controllerSpy).toHaveBeenCalledWith(requestData);
  });

  test("Should return what the Controller returns", async () => {
    const { sut, controller } = makeSut();
    const responseData = ok(makeRandonData());
    jest
      .spyOn(controller, "execute")
      .mockReturnValueOnce(Promise.resolve(responseData));
    const output = await sut.execute(makeRandonData());

    expect(output).toEqual(responseData);
  });

  test("Should initiate transaction", async () => {
    const { sut, databaseConnector } = makeSut();
    const databaseConnectorSpy = jest.spyOn(
      databaseConnector,
      "startTransaction"
    );
    await sut.execute(makeRandonData());

    expect(databaseConnectorSpy).toHaveBeenCalledTimes(1);
  });

  test("Should commit transaction on success", async () => {
    const { sut, databaseConnector, controller } = makeSut();
    const commitTransactionSpy = jest.spyOn(
      databaseConnector,
      "commitTransaction"
    );
    const rollbackTransactionSpy = jest.spyOn(
      databaseConnector,
      "rollbackTransaction"
    );
    jest
      .spyOn(controller, "execute")
      .mockReturnValueOnce(Promise.resolve(ok(makeRandonData())));
    await sut.execute(makeRandonData());

    expect(commitTransactionSpy).toHaveBeenCalledTimes(1);
    expect(rollbackTransactionSpy).toHaveBeenCalledTimes(0);
  });

  test("Should rollback transaction on server error", async () => {
    const { sut, databaseConnector, controller } = makeSut();
    const commitTransactionSpy = jest.spyOn(
      databaseConnector,
      "commitTransaction"
    );
    const rollbackTransactionSpy = jest.spyOn(
      databaseConnector,
      "rollbackTransaction"
    );
    jest
      .spyOn(controller, "execute")
      .mockReturnValueOnce(Promise.resolve(serverError()));
    await sut.execute(makeRandonData());

    expect(rollbackTransactionSpy).toHaveBeenCalledTimes(1);
    expect(commitTransactionSpy).toHaveBeenCalledTimes(0);
  });
});
