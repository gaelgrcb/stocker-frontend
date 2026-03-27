import Link from "next/link";
import InputForm from "../components/InputForm";

export default function FormLoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center flex-col bg-[#121212] p-4">
            <form className="w-full max-w-md p-6 bg-[#191919] rounded-xl shadow-2xl space-y-4 border border-gray-800">
                <h2 className="text-white text-2xl font-bold text-center mb-6">Login</h2>

                <InputForm label="Username" />
                <InputForm label="Password" type="password" />

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg mt-4 shadow-lg shadow-blue-900/20 transition-all">
                    Login
                </button>
            </form>

            <div className="mt-6 text-center text-gray-400 text-sm">
                Don&#39;t have an account? <br/>
                Please <Link href="/register" className="text-blue-500 hover:text-blue-400 font-semibold transition-colors underline">Register here</Link>
            </div>
        </div>
    );
}