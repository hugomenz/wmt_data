import { Injectable } from '@angular/core';
import { stringLength } from '@firebase/util';

@Injectable({
  providedIn: 'root',
})
export class DateCalculationService {
  constructor() {}

  getNowTimeStamp() {
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
      noHour: `${day}-${month}-${yyyy.toString()}`,
      full: `${day}-${month}-${yyyy.toString()} ${HH}:${MM}:${SS}`,
      firstOfDay: `${day}-${month}-${yyyy.toString()} 00:00:00`,
      standard: `${
        this.getDayName(`${day}-${month}-${yyyy.toString()} ${HH}:${MM}`)
          .dayShort
      } ${day} ${
        this.getDayName(`${day}-${month}-${yyyy.toString()} ${HH}:${MM}`)
          .monthShort
      } ${yyyy.toString()} GMT+0100`, //`Sat Nov 12 2022 GMT+0100`,
    };
  }

  getDayName(dateStr: string) {
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
  }

  getLastTimeStamp() {
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

    return `${this.getNowTimeStamp().noHour} ${hr}:${adjustedMinutes}:00`;

    //this.getNowTimeStamp().full.slice(0, 13)
  }

  getPreviousDay(dateString: string, dayBack: number) {
    const formatedDateString = this.changeToStandardFormat(dateString);
    const date = new Date(formatedDateString);
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
      objFormated: `${day}-${month}-${yyyy} 00:00:00`,
      last: `${day}-${month}-${yyyy} 23:45:00`,
      title: this.prepareDateForTitle(
        previous.toString().split('(')[0].split(' '),
        4
      ),
    };
  }

  prepareDateForTitle(arr: string[], index: number) {
    arr.splice(index, 1);
    arr.splice(arr.length - 1, 1);

    return arr.join(' ');
  }

  changeToStandardFormat(stringDate: string) {
    // 31-12-2022 00:00:00 --> 2022-12-31
    const splitText = stringDate.slice(0, 10).split('-');
    const day = splitText[0];
    const month = splitText[1];
    const year = splitText[2];

    return `${year}-${month}-${day}`;
  }

  // TODO Crea las funciones para filtrar el grafico principal 1D 7D 15D 1M 3M 6M 1Y
}
