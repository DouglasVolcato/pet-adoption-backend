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
  describe("Request", () => {
    test("Should call the first gateway", async () => {
      const { sut, gatewayStub1, gatewayStub2 } = makeSut();
      const gatewayStubSpy1 = jest.spyOn(gatewayStub1, "request");
      const gatewayStubSpy2 = jest.spyOn(gatewayStub2, "request");
      await sut.request();

      expect(gatewayStubSpy1).toHaveBeenCalledTimes(1);
      expect(gatewayStubSpy2).toHaveBeenCalledTimes(0);
    });

    test("Should return the first gateway data", async () => {
      const { sut, gatewayStub1, gatewayStub2 } = makeSut();
      const outputGateway1 = makeRandonData();
      const outputGateway2 = makeRandonData();
      jest
        .spyOn(gatewayStub1, "request")
        .mockReturnValueOnce(Promise.resolve(outputGateway1));
      jest
        .spyOn(gatewayStub2, "request")
        .mockReturnValueOnce(Promise.resolve(outputGateway2));
      const output = await sut.request();

      expect(output).toEqual(outputGateway1);
    });

    test("Should return the second gateway if the first gateway request has finished", async () => {
      const { sut, gatewayStub1, gatewayStub2 } = makeSut();
      const outputGateway1 = makeRandonData();
      const outputGateway2 = makeRandonData();
      jest
        .spyOn(gatewayStub1, "request")
        .mockReturnValueOnce(Promise.resolve(outputGateway1));
      jest.spyOn(gatewayStub1, "requestFinished").mockReturnValueOnce(true);
      jest
        .spyOn(gatewayStub2, "request")
        .mockReturnValueOnce(Promise.resolve(outputGateway2));
      const output = await sut.request();

      expect(output).toEqual(outputGateway2);
    });

    test("Should return an empty array if all requests have been finished", async () => {
      const { sut, gatewayStub1, gatewayStub2 } = makeSut();
      const outputGateway1 = makeRandonData();
      const outputGateway2 = makeRandonData();
      jest
        .spyOn(gatewayStub1, "request")
        .mockReturnValueOnce(Promise.resolve(outputGateway1));
      jest.spyOn(gatewayStub1, "requestFinished").mockReturnValueOnce(true);
      jest
        .spyOn(gatewayStub2, "request")
        .mockReturnValueOnce(Promise.resolve(outputGateway2));
      jest.spyOn(gatewayStub2, "requestFinished").mockReturnValueOnce(true);
      const output = await sut.request();

      expect(output).toEqual([]);
    });

    test("Should throw if gateway throws", async () => {
      const { sut, gatewayStub1 } = makeSut();
      jest.spyOn(gatewayStub1, "request").mockImplementationOnce(() => {
        throw new Error();
      });

      expect(async () => await sut.request()).rejects.toThrow();
    });

    test("Constructor should set the gateways property", async () => {
      const { sut, gatewayStub1, gatewayStub2 } = makeSut();

      expect((sut as any).gateways).toEqual([gatewayStub1, gatewayStub2]);
    });
  });

  describe("RequestFinished", () => {
    test("Should return false", async () => {
      const { sut } = makeSut();

      expect(sut.requestFinished()).toBeFalsy();
    });

    test("Should return true if all requests from all gateways have been finishes", async () => {
      const { sut, gatewayStub1, gatewayStub2 } = makeSut();
      jest.spyOn(gatewayStub1, "requestFinished").mockReturnValueOnce(true);
      jest.spyOn(gatewayStub2, "requestFinished").mockReturnValueOnce(true);

      expect(sut.requestFinished()).toBeTruthy();
    });

    test("Should throw if a gateway throws", async () => {
      const { sut, gatewayStub1 } = makeSut();
      jest.spyOn(gatewayStub1, "requestFinished").mockImplementationOnce(() => {
        throw new Error();
      });

      expect(() => sut.requestFinished()).toThrow();
    });
  });
});
