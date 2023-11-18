import { PetSearchGatewayComposite } from "../../../src/apis/composites";
import { GatewayInterface } from "../../../src/apis/protocols";
import { makeRandonData } from "../../test-helpers/mocks";
import { GatewayStub } from "../../test-helpers/stubs";

type SutTypes = {
  sut: PetSearchGatewayComposite;
  gatewayStub1: GatewayInterface;
  gatewayStub2: GatewayInterface;
};

const makeSut = (): SutTypes => {
  const gatewayStub1 = new GatewayStub();
  const gatewayStub2 = new GatewayStub();
  const gatewayStubs = [gatewayStub1, gatewayStub2];
  const sut = new PetSearchGatewayComposite(gatewayStubs);
  return { gatewayStub1, gatewayStub2, sut };
};

describe("GatewayComposite", () => {
  test("Should call both gateways", async () => {
    const { sut, gatewayStub1, gatewayStub2 } = makeSut();
    const gatewayStubSpy1 = jest.spyOn(gatewayStub1, "request");
    const gatewayStubSpy2 = jest.spyOn(gatewayStub2, "request");
    for await (const data of sut.request()) {
    }

    expect(gatewayStubSpy1).toHaveBeenCalledTimes(1);
    expect(gatewayStubSpy2).toHaveBeenCalledTimes(1);
  });

  test("Should the data returned by the gateways", async () => {
    const { sut, gatewayStub1, gatewayStub2 } = makeSut();
    const data = [makeRandonData()];
    async function* gatewayReturn(data: any) {
      return Promise.resolve(data);
    }
    jest
      .spyOn(gatewayStub1, "request")
      .mockReturnValueOnce(gatewayReturn(data));
    jest
      .spyOn(gatewayStub2, "request")
      .mockReturnValueOnce(gatewayReturn(data));

    for await (const output of sut.request()) {
      expect(output).toEqual(data);
    }
  });

  test("Should throw if gateway throws", async () => {
    const { sut, gatewayStub1 } = makeSut();
    jest.spyOn(gatewayStub1, "request").mockImplementationOnce(() => {
      throw new Error();
    });

    expect(async () => {
      for await (const data of sut.request()) {
      }
    }).rejects.toThrow();
  });

  test("Constructor should set the gateways property", async () => {
    const { sut, gatewayStub1, gatewayStub2 } = makeSut();

    expect((sut as any).gateways).toEqual([gatewayStub1, gatewayStub2]);
  });
});
