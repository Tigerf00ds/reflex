import minutisation from "./minutisation";

/**
 * takes two integer representing time and returns the number of minutes between them
 * ie : 25, 100 (meaning 00:25am and 01:00am) will return 35
 * @param startTime integer
 * @param endTime integer
 * @returns integer
 */
const durationBetween = (startTime :number, endTime :number) :number => {
    const startMinutes = minutisation(startTime);
    let endMinutes = minutisation(endTime);
    if (endMinutes < startMinutes) {
        endMinutes += 1440;
    }
    return endMinutes - startMinutes;
}

export default durationBetween;