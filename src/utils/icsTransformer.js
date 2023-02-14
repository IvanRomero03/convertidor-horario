// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { VCALENDAR, VEVENT } from "ics-js";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export function icsTransformer(data) {
  // Create calendar
  const cal = new VCALENDAR();
  // Add properties
  cal.addProp("VERSION", 2);
  cal.addProp("PRODID", "RoBorregos");
  cal.addProp("CALSCALE", "GREGORIAN");

  //cal.addProp('TZID', 'America/Mexico_City');
  //cal.addProp('TZURL', 'http://tzurl.org/zoneinfo-outlook/America/Mexico_City');
  //cal.addProp('X-LIC-LOCATION', 'America/Mexico_City');

  // Loop data from json and add events
  for (let eventData of data) {
    const event = new VEVENT();

    event.addProp("SUMMARY", eventData.attributes.TITLE);
    event.addProp(
      "DESCRIPTION",
      `Salon: ${eventData.attributes.BLDG_CODE}${eventData.attributes.ROOM_CODE}. Profesor: ${eventData.attributes.NOMBRE_PROFESOR}.`
    );
    const start = new Date(eventData.attributes.START_DATE);
    const end = new Date(eventData.attributes.END_DATE);

    event.addProp("DTSTAMP", start);
    event.addProp("DTSTART", start);
    event.addProp("DTEND", end);
    event.addProp("UID", "rbrgs.com");
    // RRULE:FREQ=WEEKLY;BYDAY=MO,WE,TH;UNTIL=20230217T180000Z
    let rrule = "RRULE:FREQ=WEEKLY;";

    if (eventData.attributes.SUN_DAY != null) rrule += "SU,";
    if (eventData.attributes.MON_DAY != null) rrule += "MO,";
    if (eventData.attributes.TUE_DAY != null) rrule += "TU,";
    if (eventData.attributes.WED_DAY != null) rrule += "WE,";
    if (eventData.attributes.THU_DAY != null) rrule += "TH,";
    if (eventData.attributes.FRI_DAY != null) rrule += "FR,";
    if (eventData.attributes.SAT_DAY != null) rrule += "SA,";

    rrule = rrule.slice(0, -1);

    let month = "" + (end.getMonth() + 1);
    if (month.length == 1) month = "0" + month;

    rrule +=
      ";UNTIL=" + end.getFullYear() + month + (end.getDate() + 1) + "T180000Z";

    event.addProp("RRULE", rrule);

    cal.addComponent(event);
  }

  const blob = cal.toString();

  //saveAs(blob, 'calendar.ics');
  return blob;
  console.log(blob);
}
