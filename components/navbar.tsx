import Link from "next/link";

export default function NavBar() {
  return (
    <>
      <div className=" absolute left-10 top-10 h-dvh z-10 flex">
        <div className="bg-white flex flex-col justify-evenly items-center gap-1.5 h-[10dvh] p-1 text-black font-semibold rounded-sm">
          <Link className="hover:text-blue-500" href={"/"}>Home</Link>
          <Link className="hover:text-blue-500" href={"/profile"}>Profile</Link>
        </div>
      </div>
    </>
  );
}
