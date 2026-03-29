'use client';
import { useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import api from "../../lib/api";
import InputForm from "../components/InputForm";

export default function FormLoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Estados para el Modal
    const [showExistModal, setShowExistModal] = useState(false);
    const [modalConfig, setModalConfig] = useState({ title: '', message: '', type: 'info' });

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);

        try {
            const response = await api.post('/users/login', { username, password });
            const token = response.data.token || response.data;
            localStorage.setItem('token', token);
            router.push('/dashboard');
        } catch (err: any) {
            const status = err.response?.status; // Capturamos el código (404, 401, etc)
            const serverMessage = err.response?.data?.message || "";
            const lowerMessage = serverMessage.toLowerCase();

            // Prioridad 1: Por Código de Estado (Más seguro)
            // Prioridad 2: Por texto del mensaje

            if (status === 404 || lowerMessage.includes("no encontrado")) {
                setModalConfig({
                    title: "Usuario no encontrado",
                    message: "El nombre de usuario no existe. ¿Quieres crear una cuenta nueva?",
                    type: 'not_found'
                });
            } else if (status === 401 || lowerMessage.includes("contraseña")) {
                setModalConfig({
                    title: "Contraseña incorrecta",
                    message: "La contraseña es inválida. Revisa tus datos.",
                    type: 'wrong_password'
                });
            } else if (status === 409 || lowerMessage.includes("existe")) {
                setModalConfig({
                    title: "¡Cuenta detectada!",
                    message: "Este usuario ya está registrado. Intenta iniciar sesión.",
                    type: 'exist'
                });
            } else {
                setModalConfig({
                    title: "Hubo un problema",
                    message: serverMessage || "Error interno del servidor.",
                    type: 'error'
                });
            }
            setShowExistModal(true);
        } finally {
        setLoading(false);
    }
}

return (
    <div className="min-h-screen flex items-center justify-center flex-col bg-[#121212] p-4 font-sans">
        <form
            className="w-full max-w-md p-6 bg-[#191919] rounded-xl shadow-2xl space-y-4 border border-gray-800"
            onSubmit={handleLogin}
        >
            <h2 className="text-white text-2xl font-bold text-center mb-6 tracking-tight">Stocker</h2>

            <InputForm
                label="Username"
                onChange={(e) => setUsername(e.target.value)}
            />
            <InputForm
                label="Password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
            />

            <button
                disabled={loading}
                className={`w-full ${loading ? 'bg-gray-700' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold py-3 rounded-lg mt-4 shadow-lg transition-all active:scale-95`}
            >
                {loading ? "Verificando..." : "Entrar"}
            </button>
        </form>

        <div className="mt-6 text-center text-gray-400 text-sm">
            {"Don't have an account?"} <br />
            <Link href="/register" className="text-blue-500 hover:text-blue-400 font-semibold transition-colors underline">
                Register here
            </Link>
        </div>

        {/* --- MODAL POPUP --- */}
        {showExistModal && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                <div className="bg-[#191919] border border-gray-800 p-8 rounded-2xl max-w-sm w-full shadow-2xl text-center transform animate-in zoom-in duration-300">

                    {/* Icono Dinámico */}
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${modalConfig.type === 'exist' || modalConfig.type === 'not_found'
                        ? 'bg-blue-600/20'
                        : 'bg-red-600/20'
                        }`}>
                        <span className="text-2xl">
                            {modalConfig.type === 'exist' && '👤'}
                            {modalConfig.type === 'not_found' && '🔍'}
                            {modalConfig.type === 'wrong_password' && '🔑'}
                            {modalConfig.type === 'error' && '⚠️'}
                        </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">{modalConfig.title}</h3>
                    <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                        {modalConfig.message}
                    </p>

                    <div className="space-y-3">
                        {/* Botón Principal Dinámico */}
                        {modalConfig.type === 'not_found' ? (
                            <button
                                onClick={() => router.push('/register')}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all active:scale-95 shadow-lg"
                            >
                                Registrarme ahora
                            </button>
                        ) : (
                            <button
                                onClick={() => setShowExistModal(false)}
                                className={`w-full text-white font-bold py-3 rounded-xl transition-all active:scale-95 shadow-lg ${modalConfig.type === 'exist' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'
                                    }`}
                            >
                                {modalConfig.type === 'exist' ? 'Entendido' : 'Reintentar'}
                            </button>
                        )}

                        <button
                            onClick={() => setShowExistModal(false)}
                            className="w-full bg-transparent text-gray-500 hover:text-gray-300 text-xs py-2 transition-colors font-medium"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
);
}