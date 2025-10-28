import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import { validationCpf } from '../helper/validator'

@ValidatorConstraint({ name: 'isCpf', async: false })
export class IsCpfConstraint implements ValidatorConstraintInterface {
	validate(cpf: string): boolean {
		return validationCpf(cpf)
	}

	defaultMessage(): string {
		return 'CPF inválido! CPF deve conter 11 dígitos numéricos e ser válido.'
	}
}
