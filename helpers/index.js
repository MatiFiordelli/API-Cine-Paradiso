export const getDateData = (amountDays) => {
    const oneDay = new Date().getTime() + 24 * 60 * 60 * 1000 * amountDays;
    const today = new Date(oneDay).toLocaleDateString("es-AR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    const monthNumber = new Date(oneDay).toLocaleDateString("es-AR", {
        month: "numeric",
    });
    

    const splittedDate = today.split(", ");
    const dayName = splittedDate[0];
    const dayNumber = splittedDate[1].split(" de ")[0];
    const month = splittedDate[1].split(" de ")[1];
    return {
        dayName: dayName,
        dayNumber: dayNumber,
        monthName: month,
        monthNumber: monthNumber
    };
};

export const extractHours = (obj) => {
    const result = []

    obj[0].afternoon.forEach((e)=>result.push(e))
    obj[0].evening.forEach((e)=>result.push(e))

    return result
}