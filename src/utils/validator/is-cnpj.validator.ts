import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import { validationCnpj } from '../helper/validator'

@ValidatorConstraint({ name: 'isCnpj', async: false })
export class IsCnpjConstraint implements ValidatorConstraintInterface {
	validate(cnpj: string): boolean {
		return validationCnpj(cnpj)
	}

	defaultMessage(): string {
		return 'CNPJ inválido! CNPJ deve conter 14 dígitos numéricos e ser válido.'
	}
}
