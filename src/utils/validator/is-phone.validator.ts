import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isFlexiblePhone', async: false })
export class IsFlexiblePhoneConstraint implements ValidatorConstraintInterface {
  validate(phone: string) {
    if (!phone) return false;

    const cleanedPhone = phone.replace(/[^0-9]/g, '');

    return cleanedPhone.length === 10 || cleanedPhone.length === 11;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Número de telefone inválido. Deve conter 10 ou 11 dígitos (DDD + número).';
  }
}

export function IsFlexiblePhone(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsFlexiblePhoneConstraint,
    });
  };
}
