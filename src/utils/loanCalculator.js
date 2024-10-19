export const LoanCalculator = (
  propertyValue,
  downPayment,
  years,
  interestRate,
  homeType
) => {
  // Calculate the loan amount
  const loanAmount = propertyValue - downPayment;

  // Calculate the monthly interest rate
  const monthlyInterestRate = interestRate / 12;

  // Total number of payments (in months)
  const numberOfPayments = years * 12;

  // Calculate the monthly payment
  const monthlyPayment =
    (loanAmount * monthlyInterestRate) /
    (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));

  // Calculate IMT based on the home type (primary or secondary)
  const imt = calculateIMT(propertyValue, homeType);

  // Calculate stamp duty
  const stampDuty = calculateStampDuty(propertyValue);

  // Calculate the total taxes
  const taxes = stampDuty + imt;

  // Fixed registration fee
  const registrationFee = 350;

  // Calculate the total payment (taxes + registration + total loan payments)
  const totalPayment =
    taxes + registrationFee + monthlyPayment * numberOfPayments;

  // Calculate the total mortgage (loan amount + taxes)
  const totalMortgage = loanAmount + taxes;

  // Calculate the financing percentage
  const financing = (loanAmount / propertyValue) * 100;

  // Return the calculated values
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

// Function to calculate IMT based on property value and home type
export const calculateIMT = (propertyValue, homeType) => {
  let rate, deduction;

  if (homeType === "primaryResidence") {
    // IMT table for primary residence
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
  } else if (homeType === "secondaryResidence") {
    // IMT table for secondary residence
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
      rate = 6; // Fixed rate for values above 603,576
      deduction = 0;
    }
  }

  // IMT calculation
  let imt = propertyValue * (rate / 100) - deduction;
  return imt > 0 ? imt : 0;
};

// Function to calculate stamp duty
export const calculateStampDuty = (propertyValue) => {
  const stampDutyRate = 0.008; // 0.8% rate
  let stampDuty = propertyValue * stampDutyRate;
  return stampDuty;
};
