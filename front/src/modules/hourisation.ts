/**
 * Change an integer into a string like 100 > 01h00
 * @param time integer
 * @returns string
 */
const hourisation = (time :number) :string =>  {
    let timeString = time.toString();
    for(let i=0; timeString.length<4;i++)timeString='0'+timeString;
    timeString = timeString.slice(0,2)+'h'+timeString.slice(2);
    return timeString;
}

export default hourisation;