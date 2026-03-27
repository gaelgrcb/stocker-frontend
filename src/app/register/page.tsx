"use client"; // 1. ¡IMPORTANTE! Esto permite usar interactividad

import {useState} from "react"; // 2. Traemos la herramienta para manejar estados
import Link from "next/link";

export default function FormRegisterPage() {
    // Creamos el estado: isLoading empieza en false
    const [isLoading, setIsLoading] = useState(false);

    // Función que se ejecuta al darle al botón
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Evita que la página se recargue (truco de React)
        setIsLoading(true); // Empezamos a cargar

        // Simulamos un viaje al servidor de 2 segundos
        setTimeout(() => {
            setIsLoading(false); // Terminamos de cargar
            alert("¡Usuario registrado con éxito!");
        }, 1000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center flex-col bg-[#121212] p-4">
            {/* 3. Conectamos la función al formulario */}
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md p-6 bg-[#191919] rounded-xl shadow-2xl space-y-4 border border-gray-800"
            >
                <h2 className="text-white text-2xl font-bold text-center mb-6">Create Account</h2>

                {/* Grupo de Nombre */}
                <div className="flex flex-col">
                    <label className="text-gray-400 mb-1 text-sm font-medium">Name</label>
                    <input
                        type="text"
                        className="bg-transparent border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>

                {/* Grupo de Username */}
                <div className="flex flex-col">
                    <label className="text-gray-400 mb-1 text-sm font-medium">Username</label>
                    <input
                        type="text"
                        className="bg-transparent border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>

                {/* Grupo de Email */}
                <div className="flex flex-col">
                    <label className="text-gray-400 mb-1 text-sm font-medium">Email</label>
                    <input
                        type="email"
                        className="bg-transparent border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>

                {/* Grupo de Password */}
                <div className="flex flex-col">
                    <label className="text-gray-400 mb-1 text-sm font-medium">Password</label>
                    <input
                        type="password"
                        className="bg-transparent border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>

                {/* 4. BOTÓN DINÁMICO: Cambia según el estado */}
                <button
                    disabled={isLoading} // Se deshabilita mientras carga
                    className={`w-full font-bold py-2.5 rounded-lg mt-4 shadow-lg transition-all flex items-center justify-center
                        ${isLoading
                        ? "bg-gray-600 cursor-not-allowed" // Si carga: gris
                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-900/20" // Si no: azul
                    }`}
                >
                    {isLoading ? (
                        <>
                            <span className="animate-spin mr-2">◌</span>
                            Registering...
                        </>
                    ) : (
                        "Register"
                    )}
                </button>
            </form>

            <div className="mt-6 text-center text-gray-400 text-sm">
                Do you already have an account? <br/>
                Please <Link href="/login"
                             className="text-blue-500 hover:text-blue-400 font-semibold ml-1 transition-colors underline">Login
                here</Link>
            </div>
        </div>
    );
}