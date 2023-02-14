import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { api } from "../utils/api";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>Convertidor Horario</title>
        <meta name="description" content="By" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <html className="h-screen">
        <body className="h-screen">
          <main className="flex min-h-screen  flex-col items-center justify-center bg-gradient-to-r from-gray-800 via-purple-500 to-blue-900 duration-700">
            <div className="flex animate-none flex-col items-center justify-center rounded-lg bg-gray-300 text-opacity-100">
              <h1 className="m-12 animate-none text-4xl font-bold text-gray-600">
                Convertidor Horario
              </h1>
              <p className="m-5 animate-none text-2xl font-bold text-gray-600">
                Introduce tu matrícula
              </p>
              <div className="flex items-center justify-center">
                <input type="text" className="m-5 h-10 w-64" />
                <button className="m-5 h-10 w-20 rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700">
                  Buscar
                </button>
              </div>
            </div>
          </main>
        </body>
      </html>
    </>
  );
};

export default Home;
