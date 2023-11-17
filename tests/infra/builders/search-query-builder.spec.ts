import { SearchQueryBuilder } from "../../../src/infra/builders";
import { makeRandonData } from "../../test-helpers/mocks";

type SutTypes = {
  sut: SearchQueryBuilder;
};

const makeSut = (): SutTypes => {
  const sut = new SearchQueryBuilder();
  return { sut };
};

describe("SearchQueryBuilder", () => {
  test("OfParams method should return the class instance", () => {
    const { sut } = makeSut();
    const params = makeRandonData();
    const output = sut.ofParams(params);

    expect(output).toBeInstanceOf(SearchQueryBuilder);
    expect((output as any).searchParams).toEqual(params);
  });

  test("WithCallback method should return the class instance", () => {
    const { sut } = makeSut();
    const params = makeRandonData();
    const callback = (data: any) => data;
    const output = sut.ofParams(params).withCallback(callback);

    expect(output).toBeInstanceOf(SearchQueryBuilder);
    expect((output as any).queryCallback).toEqual(callback);
  });

  test("Build method should return a callback with the params", () => {
    const { sut } = makeSut();
    const params = makeRandonData();
    const callback = jest.fn().mockReturnValue(params.word);
    const output = sut.ofParams(params).withCallback(callback).build();

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(params);
    expect(output).toEqual(callback(params));
  });

  test("Should throw if callback throws", () => {
    const { sut } = makeSut();
    const params = makeRandonData();
    const callback = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });

    expect(() => sut.ofParams(params).withCallback(callback).build()).toThrow();
  });
});
