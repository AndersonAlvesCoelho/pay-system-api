import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { validationCnpj, validationCpf } from '../helper/validator';

@ValidatorConstraint({ name: 'isDocument', async: false })
export class IsDocumentConstraint implements ValidatorConstraintInterface {
  validate(document: string, args: ValidationArguments) {
    if (!document) return false;

    const cleanedDocument = document.replace(/\D/g, '');

    // Verifica CPF
    if (cleanedDocument.length === 11) {
      const isValid = validationCpf(cleanedDocument);
      if (!isValid) {
        (args.object as any).documentType = 'CPF';
      }
      return isValid;
    }

    // Verifica CNPJ
    if (cleanedDocument.length === 14) {
      const isValid = validationCnpj(cleanedDocument);
      if (!isValid) {
        (args.object as any).documentType = 'CNPJ';
      }
      return isValid;
    }

    (args.object as any).documentType = 'SIZE_ERROR';
    return false;
  }

  defaultMessage(args: ValidationArguments) {
    const documentType = (args.object as any).documentType;

    if (documentType === 'CPF') {
      return 'CPF inválido. O número não corresponde ao cálculo do dígito verificador.';
    }
    if (documentType === 'CNPJ') {
      return 'CNPJ inválido. O número não corresponde ao cálculo do dígito verificador.';
    }

    return 'O documento deve ser um CPF (11 dígitos) ou CNPJ (14 dígitos) válido.';
  }
}

// DTO Decorator
export function IsDocument(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsDocumentConstraint,
    });
  };
}
