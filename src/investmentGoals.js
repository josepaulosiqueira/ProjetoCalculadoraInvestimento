function convertToMountleyReturnRate(yearlyReturnRate){
    return yearlyReturnRate ** (1/12);

}

export function generateReturnsArray(
    startingAmount = 0, 
    timeHorizon = 0, 
    timePeriod ='monthly', 
    monthlyContribution = 0, 
    returnRate = 0,
    returnTimeFrame = 'monthly'
)
{
    if(!timeHorizon ||!startingAmount){


        throw new Error('Investimento inicial e prazo devem ser preenchidos com valores positivos.');
    }

const finalReturnRate= returnTimeFrame === "monthly" ? 1 + returnRate /100 : convertToMountleyReturnRate(1 + returnRate /100);

const finalTimeHorizon = timePeriod === "monthly" ? timeHorizon: timeHorizon * 12;

const referenceInvestmentObject = {
    investedAmount : startingAmount,
    interestReturns : 0,
    totalInterestReturn : 0,
    month : 0,
    totalAmount: startingAmount,

};

const returnsArray =[referenceInvestmentObject];
for(let timeReference = 1 ; timeReference <= finalTimeHorizon; timeReference ++){

    const totalAmount = returnsArray[timeReference -1].totalAmount * finalReturnRate + monthlyContribution;
    const interestReturns = returnsArray[timeReference -1].totalAmount * finalReturnRate ;
    const investedAmount = startingAmount + monthlyContribution * timeReference;
    const totalInterestReturn = totalAmount - investedAmount;
    returnsArray.push({
        investedAmount : investedAmount,
        interestReturns :interestReturns,
        totalInterestReturn : totalInterestReturn,
        month : timeReference,
        totalAmount:totalAmount,
        

    });

}   
    return returnsArray;
}