export const LoanCalculator = (
  propertyValue,
  downPayment,
  years,
  interestRate,
  homeType
) => {
  // Calcular o valor do empréstimo
  const loanAmount = propertyValue - downPayment;

  // Calcular a taxa de juro mensal
  const monthlyInterestRate = interestRate / 12;

  // Número total de prestações (em meses)
  const numberOfPayments = years * 12;

  // Calcular a prestação mensal
  const monthlyPayment =
    (loanAmount * monthlyInterestRate) /
    (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));

  // Calcular IMT com base no tipo de habitação (primária ou secundária)
  const imt = calculateIMT(propertyValue, homeType);

  // Calcular imposto de selo
  const stampDuty = calculateStampDuty(propertyValue);

  // Calcular o total de impostos
  const taxes = stampDuty + imt;

  // Taxa de registo fixa
  const registrationFee = 350;

  // Calcular o pagamento total (impostos + registo + valor total das prestações)
  const totalPayment =
    taxes + registrationFee + monthlyPayment * numberOfPayments;

  // Calcular o total de crédito à habitação (empréstimo + impostos)
  const totalMortgage = loanAmount + taxes;

  // Calcular a percentagem de financiamento
  const financing = (loanAmount / propertyValue) * 100;

  // Retornar os valores calculados
  return {
    loanAmount: loanAmount.toFixed(2),
    monthlyInterestRate: (monthlyInterestRate * 100).toFixed(2),
    numberOfPayments,
    monthlyPayment: monthlyPayment.toFixed(2),
    imt: imt.toFixed(2),
    stampDuty: stampDuty.toFixed(2),
    taxes: taxes.toFixed(2),
    registrationFee,
    totalPayment: totalPayment.toFixed(2),
    totalMortgage: totalMortgage.toFixed(2),
    financing: financing.toFixed(2),
  };
};

// Função para calcular o IMT com base no valor do imóvel e no tipo de habitação
export const calculateIMT = (propertyValue, homeType) => {
  let rate, deduction;

  if (homeType === "habitacaoPrimaria") {
    // Tabela de IMT para habitação própria permanente
    if (propertyValue <= 97064) {
      rate = 0;
      deduction = 0;
    } else if (propertyValue <= 132774) {
      rate = 2;
      deduction = 1941.28;
    } else if (propertyValue <= 181034) {
      rate = 5;
      deduction = 5840.23;
    } else if (propertyValue <= 301688) {
      rate = 7;
      deduction = 9287.21;
    } else if (propertyValue <= 603576) {
      rate = 8;
      deduction = 11959.32;
    } else {
      rate = 6; // Taxa fixa para valores acima de 603.576
      deduction = 0;
    }
  } else if (homeType === "habitacaoSecundaria") {
    // Tabela de IMT para segunda habitação
    if (propertyValue <= 97064) {
      rate = 1;
      deduction = 0;
    } else if (propertyValue <= 132774) {
      rate = 2;
      deduction = 970.64;
    } else if (propertyValue <= 181034) {
      rate = 5;
      deduction = 4850.61;
    } else if (propertyValue <= 301688) {
      rate = 7;
      deduction = 8297.59;
    } else if (propertyValue <= 603576) {
      rate = 8;
      deduction = 11287.28;
    } else {
      rate = 6; // Taxa fixa para valores acima de 603.576
      deduction = 0;
    }
  }

  // Calcular o IMT
  let imt = propertyValue * (rate / 100) - deduction;
  return imt > 0 ? imt : 0;
};

// Função para calcular o imposto de selo
export const calculateStampDuty = (propertyValue) => {
  const stampDutyRate = 0.008; // 0,8%
  let stampDuty = propertyValue * stampDutyRate;
  return stampDuty;
};
