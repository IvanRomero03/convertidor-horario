// Past version (data changed shape)

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { VCALENDAR, VEVENT } from "ics-js";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export function icsTransformer(data) {
    // Create calendar
    const cal = new VCALENDAR();

    // Add properties
    cal.addProp('VERSION', 2)
    cal.addProp('PRODID', 'RoBorregos');
    cal.addProp('CALSCALE', 'GREGORIAN');

    //cal.addProp('TZID', 'America/Mexico_City');
    //cal.addProp('TZURL', 'http://tzurl.org/zoneinfo-outlook/America/Mexico_City');
    //cal.addProp('X-LIC-LOCATION', 'America/Mexico_City');

    let dateCreated = new Date(Date.now());

    // Loop data from json and add events
    let counter = 0;
    for (let eventData of data) {
        const event = new VEVENT();

        let sDate = eventData.attributes.START_DATE.substring(0, 10) + " " + eventData.attributes.BEGIN_TIME.substring(0, 2) + ":" + eventData.attributes.BEGIN_TIME.substring(2) + ":00";
        const start = new Date(sDate);

        let fDate = eventData.attributes.START_DATE.substring(0, 10) + " " + eventData.attributes.END_TIME.substring(0, 2) + ":" + eventData.attributes.END_TIME.substring(2) + ":00";
        const finishClass = new Date(fDate);
        const end = new Date(eventData.attributes.END_DATE);

        event.addProp('DTSTAMP', dateCreated);
        event.addProp('UID', 'rbrgs.com' + counter);
        counter++;
        event.addProp('DTSTART', start);

        // RRULE:FREQ=WEEKLY;BYDAY=MO,WE,TH;UNTIL=20230217T180000Z
        let rrule = "FREQ=WEEKLY;BYDAY=";

        if (eventData.attributes.SUN_DAY != null)
            rrule += "SU,";
        if (eventData.attributes.MON_DAY != null)
            rrule += "MO,";
        if (eventData.attributes.TUE_DAY != null)
            rrule += "TU,";
        if (eventData.attributes.WED_DAY != null)
            rrule += "WE,";
        if (eventData.attributes.THU_DAY != null)
            rrule += "TH,";
        if (eventData.attributes.FRI_DAY != null)
            rrule += "FR,";
        if (eventData.attributes.SAT_DAY != null)
            rrule += "SA,";

        rrule = rrule.slice(0, -1);

        let month = "" + (end.getMonth() + 1);
        if (month.length == 1)
            month = "0" + month;

        let date = "" + (end.getDate() + 1);
        if (date.length == 1)
            date = "0" + date;

        rrule += ";UNTIL=" + end.getFullYear() + (month) + (date) + "T000000Z";

        event.addProp('RRULE', rrule);
        event.addProp('DTEND', finishClass);

        event.addProp("SUMMARY", eventData.attributes.TITLE);
        event.addProp("DESCRIPTION", `Salon: ${eventData.attributes.BLDG_CODE}${eventData.attributes.ROOM_CODE}. Profesor: ${eventData.attributes.NOMBRE_PROFESOR}.`);

        cal.addComponent(event);
    }

    const blob = cal.toString();

    //saveAs(blob, 'calendar.ics');
    return blob;
    console.log(blob);
}
