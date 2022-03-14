import Head from "next/head";
import Nav from "../components/Nav";
import type { NextPage } from "next";
import { useMoralis } from "react-moralis";
import Project from "../components/Project";

const ProjectMan: NextPage = () => {
  const { user } = useMoralis();
  return (
    <>
      <Head>
        <title>FLYT.V.</title>
        <meta name="Project Checklist" content="Home for hackathon" />
      </Head>
      <main>
        <Nav />
        {user && <Project />}
        {/* <Footer /> */}
      </main>
    </>
  );
};
export default ProjectMan;
