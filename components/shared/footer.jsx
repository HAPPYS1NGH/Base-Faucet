import Link from "next/link"

function Footer() {
    return (
        <footer className="text-white m-20">

            <p>Made with 💙 By   <Link href={`https://twitter.com/HAPPYS1NGH/`} target="_blank" className=" underline">
                HappyS1ngh
            </Link>

            </p>
        </footer>
    )
}

export default Footer