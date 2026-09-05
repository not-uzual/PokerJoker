import Link from "next/link";

export default function NavBar() {
  return (
    <>
      <div className=" absolute left-10 top-10 h-dvh z-10 flex">
        <div className="bg-black dark:invert flex flex-col justify-evenly items-center gap-1.5 h-[20dvh]">
          <Link href={"/"}>Home</Link>
          <Link href={"/profile"}>Profile</Link>
          <Link href={"/game"}>Game</Link>
        </div>
      </div>
    </>
  );
}
