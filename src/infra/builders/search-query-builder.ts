export class SearchQueryBuilder {
  private searchParams: any = {};
  private queryCallback: (obj: any) => any = () => {};

  public ofParams(searchParams: any): this {
    this.searchParams = searchParams;
    return this;
  }

  public withCallback(callback: typeof this.queryCallback): this {
    this.queryCallback = callback;
    return this;
  }

  public build(): any {
    return this.queryCallback(this.searchParams);
  }
}
