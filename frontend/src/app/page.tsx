import Image from "next/image";
import Nav from "./components/Nav/Nav";
import Connect from "./components/Connect/Connect";
import Presentation from "./components/Presentation/Presentation";

import CollabRequests from "./components/CollabRequests/CollabRequests";
export default function Home() {
  return (
    <>
      <Nav/>
      <Presentation/>
    </>
  );
}
