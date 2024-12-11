/**
 * Turns an integer representing a time like 600 (for 6am) and turns it into minutes 360
 * @param time int  time
 * @returns int total minutes in this time
 */
const minutisation = (time :number) :number => {
    const hours = Math.floor(time / 100);
    const minutes = time % 100;
    return hours * 60 + minutes;
}

export default minutisation;