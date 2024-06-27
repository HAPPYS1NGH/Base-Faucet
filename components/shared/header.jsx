import Link from "next/link";

function Header() {
    return (
        <header className="m-12 mt-16 md:m-12 lg:m-16 xl:m-20">
            <Link href="/" className=" text-center inline-block font-bold text-3xl sm:text-5xl md:text-6xl  hover:cursor-pointer text-white">
                <span className="text-blue">BASED  </span>
                <span className=""> FAUCET</span>
            </Link>
        </header>
    );
}

export default Header;
