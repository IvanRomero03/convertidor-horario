// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { VCALENDAR, VEVENT } from "ics-js";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export function icsTransformer(data) {
  // Create calendar
  const cal = new VCALENDAR();

  const classData = data.data; // Contains data about dates.

  const includedData = data.included; // Contains additional info (teacher, name, etc.)

  // Add properties
  cal.addProp("VERSION", 2);
  cal.addProp("PRODID", "RoBorregos");
  cal.addProp("CALSCALE", "GREGORIAN");

  //cal.addProp('TZID', 'America/Mexico_City');
  //cal.addProp('TZURL', 'http://tzurl.org/zoneinfo-outlook/America/Mexico_City');
  //cal.addProp('X-LIC-LOCATION', 'America/Mexico_City');

  let dateCreated = new Date(Date.now());
  let counter = 0;

  for (let course of classData) {
    // Get Teacher name and course name
    const teacherId = course.relationships["profesor-titular"]?.data?.id;
    const courseId = course.relationships["materia-impartida"]?.data?.id;

    const teacherName = findTeacher(teacherId, includedData);
    let courseName = findCourse(courseId, includedData);

    let horarios = course.attributes.horario; // Classes of 3 blocks will have 3 entries in this array.

    // @ts-ignore
    const processed = []; // Use to discard classes (if the start and end dates are duplicated)

    // Add each specific block as a separate event
    for (let block of horarios) {
      const times = [
        block.fechaInicioClase,
        block.fechaFinClase,
        block.horaInicioClase,
        block.horaFinClase,
      ];
      const timesStr = times.join();

      // @ts-ignore
      if (processed.includes(timesStr)) continue;
      processed.push(timesStr);

      // If class has no schedule, then it may be asynchronous (skip event).
      if ("dias" in block) {
        const event = new VEVENT();
        let sDate =
          block.fechaInicioClase + " " + block.horaInicioClase + ":00";
        const start = new Date(sDate);
        let fDate = block.fechaInicioClase + " " + block.horaFinClase + ":00";
        const finishClass = new Date(fDate);
        const end = new Date(
          block.fechaFinClase + " " + block.horaFinClase + ":00"
        );

        event.addProp("DTSTAMP", dateCreated);
        event.addProp("UID", "rbrgs.com" + counter);
        counter++;
        event.addProp("DTSTART", start);

        // RRULE:FREQ=WEEKLY;BYDAY=MO,WE,TH;UNTIL=20230217T180000Z
        let rrule = "FREQ=WEEKLY;BYDAY=";

        const dates = block.dias;

        if (dates.includes("S")) rrule += "SU,";
        if (dates.includes("M")) rrule += "MO,";
        if (dates.includes("T")) rrule += "TU,";
        if (dates.includes("W")) rrule += "WE,";
        if (dates.includes("R")) rrule += "TH,";
        if (dates.includes("F")) rrule += "FR,";
        if (dates.includes("Sa")) rrule += "SA,";

        rrule = rrule.slice(0, -1);

        rrule += ";UNTIL=" + formatDateToISO8601(end);

        event.addProp("RRULE", rrule);
        event.addProp("DTEND", finishClass);
        if (!courseName || courseName == "") {
          console.log("Error finding course name.");
          courseName = "-";
        }
        event.addProp("SUMMARY", courseName);
        event.addProp(
          "DESCRIPTION",
          `Salon: ${block.claveEdificio}${block.claveSalon}. Profesor: ${teacherName}. Grupo: ${block.grupo}. ID: ${courseId}.`
        );

        cal.addComponent(event);
      }
    }
  }

  const blob = cal.toString();
  console.log(blob);
  return blob;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
function findTeacher(teacherId, includedData) {
  for (let teacher of includedData) {
    if (teacher.id == teacherId) {
      return teacher.attributes.nombreCompleto;
    }
  }
  return "";
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
function findCourse(courseId, includedData) {
  for (let course of includedData) {
    if (course.id == courseId) {
      return course.attributes.descripcionMateria;
    }
  }
  return "";
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
function formatDateToISO8601(date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");

  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}
