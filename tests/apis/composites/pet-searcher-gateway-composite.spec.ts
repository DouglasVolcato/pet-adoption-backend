import { makeRandonData, makePetEntity } from "../../test-helpers/mocks";
import { PetSearchGatewayComposite } from "../../../src/apis/composites";
import { GatewayInterface } from "../../../src/apis/protocols";
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
  it("Request should call gateways", async () => {
    const { sut, gatewayStub1, gatewayStub2 } = makeSut();
    const gatewayStubSpy1 = jest.spyOn(gatewayStub1, "request");
    const gatewayStubSpy2 = jest.spyOn(gatewayStub2, "request");
    await sut.request();

    expect(gatewayStubSpy1).toHaveBeenCalledTimes(1);
    expect(gatewayStubSpy2).toHaveBeenCalledTimes(1);
  });

  it("Request throw an error if a gateway throws", async () => {
    const { sut, gatewayStub1 } = makeSut();
    jest.spyOn(gatewayStub1, "request").mockImplementationOnce(() => {
      throw new Error();
    });

    expect(async () => await sut.request()).rejects.toThrow();
  });

  it("Request should return the returned data from the gateways", async () => {
    const { sut, gatewayStub1, gatewayStub2 } = makeSut();
    const data1 = [makeRandonData(), makeRandonData()];
    const data2 = [makeRandonData(), makeRandonData()];
    jest
      .spyOn(gatewayStub1, "request")
      .mockReturnValueOnce(Promise.resolve(data1));
    jest
      .spyOn(gatewayStub2, "request")
      .mockReturnValueOnce(Promise.resolve(data2));
    const output = await sut.request();

    expect(output).toEqual([...data1, ...data2]);
  });

  it("SearchPets method should call request method", async () => {
    const { sut } = makeSut();
    const requestSpy = jest.spyOn(sut, "request");
    await sut.searchPets();

    expect(requestSpy).toHaveBeenCalledTimes(1);
  });

  it("SearchPets should return what request returns", async () => {
    const { sut } = makeSut();
    const foundPets = [makePetEntity(), makePetEntity()];
    jest.spyOn(sut, "request").mockReturnValueOnce(Promise.resolve(foundPets));
    const output = await sut.searchPets();

    expect(output).toEqual(foundPets);
  });

  it("SearchPets should throw if request throws", async () => {
    const { sut } = makeSut();
    jest.spyOn(sut, "request").mockImplementationOnce(() => {
      throw new Error();
    });

    expect(async () => await sut.request()).rejects.toThrow();
  });

  it("Constructor should set the gateways property", async () => {
    const { sut, gatewayStub1, gatewayStub2 } = makeSut();

    expect((sut as any).gateways).toEqual([gatewayStub1, gatewayStub2]);
  });
});
