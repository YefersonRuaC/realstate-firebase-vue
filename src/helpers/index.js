
export const propertyPrice = (price) => 
    //Giving a price format to price of the property
    Number(price).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
    })