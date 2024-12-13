const addMinutes = (baseTime :number, minutesToAdd :number) :number => {
    let hours = Math.floor(baseTime / 100);
    let minutes = baseTime % 100;
    minutes += minutesToAdd;
    hours += Math.floor(minutes / 60);
    minutes = minutes % 60;
    hours = hours % 24;
    return hours * 100 + minutes;
}

export default addMinutes;