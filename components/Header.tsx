import { Dancing_Script } from "next/font/google";

const headerFont = Dancing_Script({ weight: "700", subsets: ["latin"] });

export default function Header() {
    return (
        <div className="w-full flex justify-center mt-4 px-3 sm:px-4">
            <div className="w-full max-w-xl bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl px-3 sm:px-4 py-3 sm:py-2 text-center shadow-2xl">
                <h1 className={`text-2xl sm:text-4xl text-white text-center leading-tight ${headerFont.className}`}>
                    My ToDo APP Final
                </h1>
                <p className={`text-green-400/50 text- sm:text-lg mt-1 tracking-wider ${headerFont.className}`}>STAY ORGANIZED, STAY PRODUCTIVE</p>
            </div>
        </div>
    );
}