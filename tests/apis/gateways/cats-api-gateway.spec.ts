import { PetCategoryEnum, PetStatusEnum } from "../../../src/domain/protocols";
import { ClientGetRequestSenderInterface } from "../../../src/infra/protocols";
import { ClientGetRequestSenderStub } from "../../test-helpers/stubs";
import { makeRandonData } from "../../test-helpers/mocks";
import { FakeData } from "../../test-helpers/fake-data";
import {
  CatsApiGateway,
  CatsApiResponseType,
} from "../../../src/apis/gateways";

const makePetApi = (): CatsApiResponseType => ({
  breeds: [
    {
      name: FakeData.word(),
      description: FakeData.phrase(),
    },
  ],
  url: FakeData.url(),
});

type SutTypes = {
  sut: CatsApiGateway;
  clientGetRequestSender: ClientGetRequestSenderInterface;
};

const makesut = (
  url: string = FakeData.url(),
  headers: any = makeRandonData()
): SutTypes => {
  const clientGetRequestSender = new ClientGetRequestSenderStub();
  const sut = new CatsApiGateway(clientGetRequestSender);
  (sut as any).url = url;
  (sut as any).headers = headers;
  return { sut, clientGetRequestSender };
};

describe("CatsApiGateway", () => {
  test("Should call ClientGetRequestSender with correct values", async () => {
    const headers = makeRandonData();
    const url = FakeData.url();
    const { sut, clientGetRequestSender } = makesut(url, headers);
    jest
      .spyOn(clientGetRequestSender, "get")
      .mockReturnValueOnce(Promise.resolve([makePetApi()]));
    const requestSenderSpy = jest.spyOn(clientGetRequestSender, "get");
    await sut.request();

    expect(requestSenderSpy).toHaveBeenCalledTimes(1);
    expect(requestSenderSpy).toHaveBeenCalledWith(
      `${url}?limit=80&order=Asc&page=0`,
      headers
    );
  });

  test("Should return the ClientGetRequestSender data formated", async () => {
    const { sut, clientGetRequestSender } = makesut();
    const apiResponse = [makePetApi(), makePetApi()];
    jest
      .spyOn(clientGetRequestSender, "get")
      .mockReturnValueOnce(Promise.resolve(apiResponse));
    const output = await sut.request();

    expect(output).toEqual(
      apiResponse.map((pet) => {
        return {
          id: "",
          createdAt: "",
          image: pet.url,
          name: pet.breeds.length > 0 ? pet.breeds[0].name : "Cat",
          description: pet.breeds.length > 0 ? pet.breeds[0].description : "",
          category: PetCategoryEnum.CATS,
          status: PetStatusEnum.FREE,
        };
      })
    );
  });

  test("Should increment page counter", async () => {
    const { sut, clientGetRequestSender } = makesut();
    jest
      .spyOn(clientGetRequestSender, "get")
      .mockReturnValueOnce(Promise.resolve([makePetApi()]));
    await sut.request();

    expect((sut as any).page).toBe(1);
  });

  test("Should return true if page counter is 2", async () => {
    const { sut } = makesut();
    (sut as any).page = 2;

    expect(sut.requestFinished()).toBeTruthy();
  });

  test("Should throw if ClientGetRequestSender throws", async () => {
    const { sut, clientGetRequestSender } = makesut();
    jest.spyOn(clientGetRequestSender, "get").mockImplementationOnce(() => {
      throw new Error();
    });

    expect(async () => await sut.request()).rejects.toThrow();
  });
});
