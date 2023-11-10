import { makeRandonData } from "../../test-helpers/mocks";
import { AxiosAdapter } from "../../../src/infra/adapters";
import { FakeData } from "../../test-helpers/fake-data";
import axios from "axios";

const makeApiResponse = () => ({
  statusCode: FakeData.numberInteger(),
  data: makeRandonData(),
});

jest.mock("axios", () => ({
  get: jest.fn().mockImplementation(async () => {
    return await Promise.resolve(makeApiResponse());
  }),
}));

type SutTypes = {
  sut: AxiosAdapter;
};

const makeSut = (): SutTypes => {
  const sut = new AxiosAdapter();
  return { sut };
};

describe("AxiosAdapter", () => {
  describe("get", () => {
    test("Should call axios get with correct values", async () => {
      const { sut } = makeSut();
      const headersData = makeRandonData();
      const requestUrl = FakeData.url();
      await sut.get(requestUrl, headersData);
      const axiosGetCalls = jest.spyOn(axios, "get").mock.calls;

      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axiosGetCalls[0][0]).toBe(requestUrl);
      expect(axiosGetCalls[0][1]?.headers).toEqual(headersData);
    });

    test("Should return the correct data from axios post", async () => {
      const { sut } = makeSut();
      const apiResponse = makeApiResponse();
      jest
        .spyOn(axios, "get")
        .mockReturnValueOnce(Promise.resolve(apiResponse));
      const data = await sut.get(FakeData.url(), {});

      expect(data).toEqual(apiResponse.data);
    });

    test("Should throw if axios get throws", async () => {
      const { sut } = makeSut();
      jest.spyOn(axios, "get").mockImplementationOnce(() => {
        throw new Error();
      });

      expect(
        async () => await sut.get(FakeData.url(), makeRandonData())
      ).rejects.toThrow();
    });
  });
});
