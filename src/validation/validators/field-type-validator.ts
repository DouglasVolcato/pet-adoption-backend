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
    if (!this.isFieldAvailable(data)) {
      return new RequiredFieldError(this.fieldName);
    }

    if (this.fieldType === FieldTypeEnum.ARRAY) {
      return this.handleArrayValidation(data);
    } else {
      return this.handleFieldTypeValidation(data);
    }
  }

  private isFieldAvailable(data: any): boolean {
    return this.fieldName in data;
  }

  private handleArrayValidation(data: any): Error | undefined {
    if (!Array.isArray(data[this.fieldName])) {
      return new InvalidFieldError(this.fieldName);
    }
    return undefined;
  }

  private handleFieldTypeValidation(data: any): Error | undefined {
    if (typeof data[this.fieldName] !== this.fieldType) {
      return new InvalidFieldError(this.fieldName);
    }
    return undefined;
  }
}
