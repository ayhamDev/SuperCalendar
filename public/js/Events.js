export default function CheckForEvents(event, Year, Month, date, index) {
  let Value = false;
  const checkForDays =
    event.date.days.find((day) => day == index) == 0
      ? 1
      : event.date.days.find((day) => day == index);

  if (
    Year >= event.date.from.year &&
    Year <= event.date.to.year &&
    checkForDays
  ) {
    if (event.date.from.year == event.date.to.year) {
      if (event.date.from.month == event.date.to.month) {
        if (
          Month == event.date.from.month &&
          date >= event.date.from.day &&
          date <= event.date.to.day
        ) {
          console.log("same month same year", date);
          Value = true;
        }
      }
      if (event.date.from.month != event.date.to.month) {
        if (Month == event.date.from.month && date >= event.date.from.day) {
          console.log("first Month in the same year");
          Value = true;
        }
        if (Month > event.date.from.month && Month < event.date.to.month) {
          console.log("inner Month in the same year");
          Value = true;
        }
        if (Month == event.date.to.month && date <= event.date.to.day) {
          console.log("last Month in the same year");
          Value = true;
        }
      }
    }
    if (event.date.from.year != event.date.to.year) {
      // check for first , inner and last year

      // check for first year should have check for the month
      // check if the month is first , inner , last

      // check for day on the first month
      // dont check for day on the inner month
      // check for last day on the last month

      if (Year == event.date.from.year) {
        console.log("first year");
        if (Month == event.date.from.month && date >= event.date.from.day) {
          console.log("first Month");
          Value = true;
        }
        if (Month > event.date.from.month && Month < event.date.to.month) {
          console.log("inner Month in the same year");
          Value = true;
        }
        if (Month == event.date.to.month && date <= event.date.to.day) {
          console.log("last Month in the same year");
          Value = true;
        }
      }
      if (Year > event.date.from.year && Year < event.date.to.year) {
      }
      if (Year == event.date.to.year) {
        // fix pls :)
        if (Month == event.date.to.month && date <= event.date.to.day) {
          console.log("last Month in the same year");
          Value = true;
        }
        if (Month < event.date.to.month) {
          console.log("inner Month in the same year", Month);
          Value = true;
        }
      }
    }
  }
  return Value;
}
