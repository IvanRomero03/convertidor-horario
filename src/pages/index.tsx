import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { useState } from "react";
import axios from "axios";
import { icsTransformer } from "../utils/icsTransformer";

const Home: NextPage = () => {
  const [matricula, setMatricula] = useState("");
  const [jsonHorario, setJsonHorario] = useState("");
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const handleSubmit = async () => {
    try {
      const dataResponse = await axios.get(
        "https://alsvdes01.itesm.mx:8282/tmty/alumnos/" +
          matricula +
          "/horario/tec21?cveTerm=" +
          "202313",
        {
          headers: {
            Authorization: "Basic c1NJU1RFTUEtUE9SVEFMOmMwNTExQnA0Nlo=",
            "Content-Type": "application/vnd.api+json",
            Accept: "application/vnd.api+json",
          },
        }
      );
      if (dataResponse?.status !== 200) {
        alert("No se encontró el horario");
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const icsText = String(icsTransformer(dataResponse?.data?.data));
      window.open("data:text/calendar;charset=utf8," + escape(icsText));
      alert("Se descargó el horario, si no se descargó, activa los popups");
    } catch (error) {
      alert("No se encontró el horario");
    }
  };

  const handleSubmitJson = async () => {
    try {
      const calendarData = JSON.parse(jsonHorario);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const icsText = String(icsTransformer(calendarData));

      const fileName = "horario.ics";
      const blob = new Blob([icsText], {type: 'text/calendar'});

      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      link.click();

      window.URL.revokeObjectURL(link.href);

      alert("Se descargó el horario, si no se descargó, activa los popups");
    } catch (error) {
      alert("Hubo un error al generar el horario.");
    }
  };

  return (
    <>
      <Head>
        <title>Convertidor Horario</title>
        <meta name="description" content="By" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="absolute inset-0 h-full">
        <main className="flex min-h-full min-w-max  flex-col items-center justify-center bg-gradient-to-r from-gray-800 via-purple-500 to-blue-900 duration-700">
          <div className="flex animate-none flex-col items-center justify-center rounded-lg bg-gray-300 text-opacity-100">
            <h1 className="m-12 animate-none text-4xl font-bold text-gray-600">
              Convertidor Horario
            </h1>
            {/* <p className="m-5 animate-none text-2xl font-bold text-gray-600">
              Introduce tu matrícula
            </p>
            <div className="flex items-center justify-center">
              <input
                type="text"
                className="m-5 h-10 w-64"
                onChange={(e) => {
                  setMatricula(e.target.value);
                }}
              />
              <button
                className="m-5 h-10 w-20 rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onClick={handleSubmit}
              >
                Buscar
              </button>
            </div> */}
            <p className="m-5 animate-none text-2xl font-bold text-gray-600">
              Introduce el JSON de tu horario
            </p>
            <div className="flex items-center justify-center">
              <input
                type="text"
                className="m-5 h-10 w-64"
                onChange={(e) => {
                  setJsonHorario(e.target.value);
                }}
              />
              <button
                className="m-5 h-10 w-20 rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onClick={handleSubmitJson}
              >
                Crear
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Home;
