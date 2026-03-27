"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "../../lib/api";

export default function FormRegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // Estado para los datos del formulario
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        password: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await api.post("/users/register", formData);
            
            // devuelve el token
            localStorage.setItem("token", response.data.token);
            
            alert("¡Account created successfully!");
            router.push("/dashboard"); // Redirigimos al inventario
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || "Error during registration");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center flex-col bg-[#121212] p-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md p-6 bg-[#191919] rounded-xl shadow-2xl space-y-4 border border-gray-800"
            >
                <h2 className="text-white text-2xl font-bold text-center mb-6">Create Account</h2>

                {/* Name */}
                <div className="flex flex-col">
                    <label className="text-gray-400 mb-1 text-sm font-medium">Name</label>
                    <input
                        name="name"
                        type="text"
                        required
                        onChange={handleChange}
                        className="bg-transparent border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>

                {/* Username */}
                <div className="flex flex-col">
                    <label className="text-gray-400 mb-1 text-sm font-medium">Username</label>
                    <input
                        name="username"
                        type="text"
                        required
                        onChange={handleChange}
                        className="bg-transparent border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>

                {/* Email */}
                <div className="flex flex-col">
                    <label className="text-gray-400 mb-1 text-sm font-medium">Email</label>
                    <input
                        name="email"
                        type="email"
                        required
                        onChange={handleChange}
                        className="bg-transparent border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>

                {/* Password */}
                <div className="flex flex-col">
                    <label className="text-gray-400 mb-1 text-sm font-medium">Password</label>
                    <input
                        name="password"
                        type="password"
                        required
                        onChange={handleChange}
                        className="bg-transparent border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>

                <button
                    disabled={isLoading}
                    className={`w-full font-bold py-2.5 rounded-lg mt-4 shadow-lg transition-all flex items-center justify-center
                        ${isLoading
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-900/20"
                    }`}
                >
                    {isLoading ? (
                        <>
                            <span className="animate-spin mr-2 text-lg">◌</span>
                            Registering...
                        </>
                    ) : (
                        "Register"
                    )}
                </button>
            </form>

            <div className="mt-6 text-center text-gray-400 text-sm">
                Do you already have an account? <br/>
                Please <Link href="/login" className="text-blue-500 hover:text-blue-400 font-semibold ml-1 transition-colors underline">Login here</Link>
            </div>
        </div>
    );
}