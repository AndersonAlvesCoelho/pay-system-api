export function validationCnpj(cnpj: string): boolean {
  cnpj = cnpj.replace(/[^0-9]/g, '');

  if (cnpj.length !== 14) {
    return false;
  }

  if (/(.)\1{13}/.test(cnpj)) {
    return false;
  }

  let soma = 0;
  let j = 5;
  for (let i = 0; i < 12; i++) {
    soma += parseInt(cnpj[i]) * j;
    j = j === 2 ? 9 : j - 1;
  }

  const resto = soma % 11;
  const dv1 = resto < 2 ? 0 : 11 - resto;

  soma = 0;
  j = 6;
  for (let i = 0; i < 13; i++) {
    soma += parseInt(cnpj[i]) * j;
    j = j === 2 ? 9 : j - 1;
  }

  const resto2 = soma % 11;
  const dv2 = resto2 < 2 ? 0 : 11 - resto2;

  return cnpj[12] === dv1.toString() && cnpj[13] === dv2.toString();
}

export function validationCpf(cpf: string): boolean {
  cpf = cpf.replace(/\D/g, '');

  if (cpf.length !== 11) {
    return false;
  }

  if (/(.)\1{10}/.test(cpf)) {
    return false;
  }

  for (let i = 9; i < 11; i++) {
    let soma = 0;
    for (let k = 0; k < i; k++) {
      soma += parseInt(cpf[k]) * (i + 1 - k);
    }
    const d = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (parseInt(cpf[i]) !== d) {
      return false;
    }
  }

  return true;
}
