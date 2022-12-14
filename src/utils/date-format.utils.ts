export const getNowTimeStamp = () => {
  const today = new Date();

  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // Months start at 0!
  let dd = today.getDate();
  let HH = today.getHours();
  let MM = today.getMinutes();
  let SS = today.getSeconds();

  let day: string = dd.toString();
  let month: string = mm.toString();

  if (dd < 10) day = '0' + dd;
  if (mm < 10) month = '0' + mm;

  return {
    noHour: `${yyyy.toString()}-${month}-${day}`,
    full: `${yyyy.toString()}-${month}-${day} ${HH}:${MM}:${SS}`,
    firstOfDay: `${yyyy.toString()}-${month}-${day} 00:00:00`,
    standard: `${
      getDayName(`${day}-${month}-${yyyy.toString()} ${HH}:${MM}`).dayShort
    } ${day} ${
      getDayName(`${day}-${month}-${yyyy.toString()} ${HH}:${MM}`).monthShort
    } ${yyyy.toString()} GMT+0100`, //`Sat Nov 12 2022 GMT+0100`,
  };
};
// ================================================================================================
export const getDayName = (dateStr: string) => {
  let dateParts = dateStr.slice(0, 11).split('-'); // Date format: dd-mm-yyyy HH:MM

  // month is 0-based, that's why we need dataParts[1] - 1
  let dateObject = new Date(
    +dateParts[2],
    Number(dateParts[1]) - 1,
    +dateParts[0]
  );

  return {
    dayShort: dateObject.toLocaleDateString('en-US', { weekday: 'short' }),
    dayLong: dateObject.toLocaleDateString('en-US', { weekday: 'long' }),
    monthShort: dateObject.toLocaleDateString('en-US', { month: 'short' }),
    monthLong: dateObject.toLocaleDateString('en-US', { month: 'long' }),
  };
};
// ================================================================================================

export const getLastTimeStamp = () => {
  const today = new Date();
  const min = today.getMinutes();
  let adjustedMinutes;

  if (min >= 0 && min < 15) {
    adjustedMinutes = 0;
  } else if (min >= 15 && min < 30) {
    adjustedMinutes = 15;
  } else if (min >= 30 && min < 45) {
    adjustedMinutes = 30;
  } else if (min >= 45) {
    adjustedMinutes = 45;
  }

  let d = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDay(),
    today.getHours(),
    adjustedMinutes,
    today.getSeconds()
  );

  let hr = new Intl.DateTimeFormat('es', { hour: '2-digit' }).format(d);

  return `${getNowTimeStamp().noHour} ${hr}:${
    adjustedMinutes == 0 ? '00' : adjustedMinutes
  }:00`;

  //this.getNowTimeStamp().full.slice(0, 13)
};
// ================================================================================================

export const getPreviousDay = (dateString: string, dayBack: number) => {
  const date = new Date(dateString.split(' ')[0]);
  const previous = new Date(date.getTime());
  previous.setDate(date.getDate() - dayBack);

  const yyyy = previous.getFullYear();
  let mm = previous.getMonth() + 1; // Months start at 0!
  let dd = previous.getDate();

  let day: string = dd.toString();
  let month: string = mm.toString();

  if (dd < 10) day = '0' + dd;
  if (mm < 10) month = '0' + mm;

  return {
    objFormated: `${yyyy}-${month}-${day} 00:00:00`,
    last: `${yyyy}-${month}-${day} 23:45:00`,
    title: prepareDateForTitle(previous.toString().split('(')[0].split(' '), 4),
  };
};
// ================================================================================================

export const prepareDateForTitle = (arr: string[], index: number) => {
  arr.splice(index, 1);
  arr.splice(arr.length - 1, 1);

  return arr.join(' ');
};
// ================================================================================================

// TODO Crea las funciones para filtrar el grafico principal 1D 7D 15D 1M 3M 6M 1Y
