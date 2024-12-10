/**
 * Change an integer into a string like 100 > 01h00
 * @param arg integer
 * @returns string
 */
const hourisation = (arg :number) :string =>  {
    let time = arg.toString();
    for(let i=0; time.length<4;i++)time='0'+time;
    time = time.slice(0,2)+'h'+time.slice(2);
    return time;
}

export default hourisation;