import { ClientGetRequestSenderInterface } from "../../../src/infra/protocols";
import { ClientGetRequestSenderStub } from "../../test-helpers/stubs";
import { makeRandonData } from "../../test-helpers/mocks";
import { DogsApiGateway } from "../../../src/apis/gateways";
import { FakeData } from "../../test-helpers/fake-data";

type SutTypes = {
  sut: DogsApiGateway;
  clientGetRequestSender: ClientGetRequestSenderInterface;
};

const makesut = (
  url: string = FakeData.url(),
  headers: any = makeRandonData()
): SutTypes => {
  const clientGetRequestSender = new ClientGetRequestSenderStub();
  const sut = new DogsApiGateway(clientGetRequestSender);
  (sut as any).url = url;
  (sut as any).headers = headers;
  return { sut, clientGetRequestSender };
};

describe("DogsApiGateway", () => {
  test("Should call ClientGetRequestSender with correct values", async () => {
    const headers = makeRandonData();
    const url = FakeData.url();
    const { sut, clientGetRequestSender } = makesut(url, headers);
    const requestSenderSpy = jest.spyOn(clientGetRequestSender, "get");
    await sut.request();

    expect(requestSenderSpy).toHaveBeenCalledTimes(1);
    expect(requestSenderSpy).toHaveBeenCalledWith(url, headers);
  });

  test("Should return what ClientGetRequestSender returns", async () => {
    const { sut, clientGetRequestSender } = makesut();
    const data = makeRandonData();
    jest
      .spyOn(clientGetRequestSender, "get")
      .mockReturnValueOnce(Promise.resolve(data));
    const output = await sut.request();

    expect(output).toEqual(data);
  });

  test("Should throw if ClientGetRequestSender throws", async () => {
    const { sut, clientGetRequestSender } = makesut();
    jest.spyOn(clientGetRequestSender, "get").mockImplementationOnce(() => {
      throw new Error();
    });

    expect(async () => await sut.request()).rejects.toThrow();
  });
});
