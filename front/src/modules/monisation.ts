const monisation = (price :number) :string => {
    let priceString = price.toString();
    for(let i=0; priceString.length<3;i++)priceString='0'+priceString;
    priceString = priceString.slice(0,priceString.length-2)+','+priceString.slice(priceString.length-2)+' €';
    return priceString;
}
export default monisation;