"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "../../lib/api";
import InfoModal from "../components/InfoModal";

export default function FormRegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // Estado del Modal
    const [showModal, setShowModal] = useState(false);
    const [modalConfig, setModalConfig] = useState<{
        title: string;
        message: string;
        type: 'info' | 'not_found' | 'wrong_password' | 'exist' | 'error' | 'success' | 'loading';
    }>({ title: '', message: '', type: 'info' });

    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        business: "",
        password: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading) return;
        setIsLoading(true);

        // 1. Mostrar Modal de Carga inmediatamente
        setModalConfig({
            title: "Creando tu cuenta",
            message: "Estamos configurando tu espacio en Stocker...",
            type: 'loading'
        });
        setShowModal(true);

        const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        try {
            // 2. Ejecutar API y tiempo mínimo de 1s en paralelo
            const [response] = await Promise.all([
                api.post("/users/register", formData),
                wait(1000)
            ]);

            localStorage.setItem("token", response.data.token || response.data);

            // 3. Transición a ÉXITO
            setModalConfig({
                title: "¡Registro exitoso!",
                message: "Tu cuenta ha sido creada. Preparando el dashboard...",
                type: 'success'
            });

            // 4. Redirección tras un breve momento
            setTimeout(() => {
                router.push("/dashboard");
            }, 1500);

        } catch (err: any) {
            const status = err.response?.status;
            const serverMessage = err.response?.data?.message || "";
            const lowerMessage = serverMessage.toLowerCase();

            let config: typeof modalConfig = {
                title: "Error en el registro",
                message: serverMessage || "No pudimos completar el registro.",
                type: 'error'
            };

            // Si el backend devuelve 409 o el mensaje indica que ya existe
            if (status === 409 || lowerMessage.includes("existe")) {
                config = {
                    title: "Usuario ya registrado",
                    message: "Este nombre de usuario ya está en uso. Intenta con otro.",
                    type: 'exist'
                };
            }

            setModalConfig(config);
            // El modal ya está abierto, así que solo se actualiza el contenido
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center flex-col bg-[#121212] p-4 font-sans text-white">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md p-8 bg-[#191919] rounded-2xl shadow-2xl space-y-4 border border-gray-800"
            >
                <h2 className="text-3xl font-extrabold text-center mb-6 tracking-tight">Únete a Stocker</h2>

                <div className="space-y-4">
                    <div className="flex flex-col">
                        <label className="text-gray-400 mb-1 text-xs font-semibold uppercase tracking-wider">Nombre Completo</label>
                        <input name="name" type="text" required onChange={handleChange} className="bg-transparent border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 transition-all" />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-400 mb-1 text-xs font-semibold uppercase tracking-wider">Nombre de Usuario</label>
                        <input name="username" type="text" required onChange={handleChange} className="bg-transparent border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 transition-all" />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-400 mb-1 text-xs font-semibold uppercase tracking-wider">Nombre del Negocio</label>
                        <input name="business" type="text" required onChange={handleChange} className="bg-transparent border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 transition-all" />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-400 mb-1 text-xs font-semibold uppercase tracking-wider">Email</label>
                        <input name="email" type="email" required onChange={handleChange} className="bg-transparent border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 transition-all" />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-400 mb-1 text-xs font-semibold uppercase tracking-wider">Contraseña</label>
                        <input name="password" type="password" required onChange={handleChange} className="bg-transparent border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 transition-all" />
                    </div>
                </div>

                <button
                    disabled={isLoading}
                    className={`w-full font-bold py-4 rounded-xl mt-6 shadow-lg transition-all transform active:scale-95 flex items-center justify-center
                        ${isLoading ? "bg-gray-800 text-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-900/20"}`}
                >
                    {isLoading ? "Procesando..." : "Crear Cuenta"}
                </button>
            </form>

            <div className="mt-6 text-center text-gray-400 text-sm">
                ¿Ya tienes cuenta? <Link href="/login" className="text-blue-500 hover:text-blue-400 font-bold ml-1 transition-colors underline">Inicia sesión</Link>
            </div>

            <InfoModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={modalConfig.title}
                message={modalConfig.message}
                type={modalConfig.type}
                autoClose={modalConfig.type === 'success' || modalConfig.type === 'loading'}
            />
        </div>
    );
}