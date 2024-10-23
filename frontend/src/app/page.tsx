import Image from "next/image";
import Nav from "./components/Nav/Nav";
import Presentation from "./components/Presentation/Presentation";
import Push from "./components/Push/Push";

export default function Home() {
  return (
    <>
      <Nav/>
      <Push></Push>
      <Presentation/>
    </>
  );
}
