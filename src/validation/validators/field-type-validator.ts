import { ValidatorInterface } from "../../presentation/protocols";
import { InvalidFieldError, RequiredFieldError } from "../errors";
import { FieldTypeEnum } from "../protocols";

export class FieldTypeValidator implements ValidatorInterface {
  private readonly fieldName: string;
  private readonly fieldType: FieldTypeEnum;

  public constructor(fieldName: string, fieldType: FieldTypeEnum) {
    this.fieldName = fieldName;
    this.fieldType = fieldType;
  }

  public validate(data: any): Error | undefined {
    if (!(this.fieldName in data)) {
      return new RequiredFieldError(this.fieldName);
    }
    if (this.fieldType === FieldTypeEnum.ARRAY) {
      if (!Array.isArray(data[this.fieldName])) {
        return new InvalidFieldError(this.fieldName);
      }
    } else if (!(typeof data[this.fieldName] === this.fieldType)) {
      return new InvalidFieldError(this.fieldName);
    }
  }
}
