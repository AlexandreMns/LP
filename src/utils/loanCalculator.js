const LoanCalculator = (propertyValue, downPayment, years, interestRate) => {
  const loanAmount = propertyValue - downPayment;

  const monthlyInterestRate = interestRate / 12;

  const numberOfPayments = years * 12;

  const monthlyPayment =
    (loanAmount * monthlyInterestRate) /
    ((1 - (1 + monthlyInterestRate)) ^ -numberOfPayments);

  const imt = calculateIMT(propertyValue);

  const stampDuty = calculateStampDuty(propertyValue);

  const taxes = stampDuty + imt;

  const registrationFee = 350;

  const totalPayment =
    taxes + registrationFee + monthlyPayment * numberOfPayments;

  const totalMortgage = loanAmount + taxes;

  const financing = (loanAmount / propertyValue) * 100;

  return {
    loanAmount,
    monthlyInterestRate,
    numberOfPayments,
    monthlyPayment,
    taxes,
    registrationFee,
    totalPayment,
    totalMortgage,
    financing,
  };
};

export const calculateIMT = (propertyValue) => {
  let rate, deduction;

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
    rate = 6; // Fixed rate for values above 603,576
    deduction = 0;
  }

  // IMT Calculation
  let imt = propertyValue * (rate / 100) - deduction;
  return imt > 0 ? imt : 0;
};

export const calculateStampDuty = (propertyValue) => {
  const stampDutyRate = 0.008; // 0.8% rate
  let stampDuty = propertyValue * stampDutyRate;
  return stampDuty;
};

export { LoanCalculator };
