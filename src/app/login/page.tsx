'use client';
import { useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import api from "../../lib/api";
import InputForm from "../components/InputForm";
import InfoModal from "../components/InfoModal";

export default function FormLoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [dynamicMessage, setDynamicMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalConfig, setModalConfig] = useState<{
        title: string;
        message: string;
        type: 'info' | 'not_found' | 'wrong_password' | 'exist' | 'error' | 'success' | 'loading';
    }>({ title: '', message: '', type: 'info' });

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);

        // 1. Mostramos el modal de CARGA
        setModalConfig({
            title: "Verificando cuenta",
            message: "Por favor, espera un momento...",
            type: 'loading'
        });
        setShowModal(true);

        // Creamos una promesa que dura 1 segundo
        const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        try {
            // Ejecutamos la API y el tiempo de espera mínimo en paralelo
            // Promise.all espera a que AMBAS terminen
            const [response] = await Promise.all([
                api.post('/users/login', { username, password }),
                wait(800) // Forzamos a que el spinner dure al menos 1s
            ]);

            const token = response.data.token || response.data;
            localStorage.setItem('token', token);

            // 2. Transición a ÉXITO (La palomita)
            setModalConfig({
                title: "¡Bienvenido!",
                message: "Acceso concedido correctamente.",
                type: 'success'
            });

            // 3. Esperamos otro segundo con la palomita antes de redirigir
            setTimeout(() => {
                router.push('/dashboard');
            }, 800);

        } catch (err: any) {
            // Si hay error, el modal cambia inmediatamente (no hace falta esperar el segundo)
            const status = err.response?.status;
            const serverMessage = err.response?.data?.message || "";
            const lowerMessage = serverMessage.toLowerCase();

            let config: any = {
                title: "Error de acceso",
                message: "No se pudo conectar con el servidor.",
                type: 'error'
            };

            if (status === 404 || lowerMessage.includes("no encontrado")) {
                config = { title: "Usuario inexistente", message: "¿Aún no tienes cuenta? Regístrate en Stocker.", type: 'not_found' };
            } else if (status === 401 || lowerMessage.includes("contraseña")) {
                config = { title: "Contraseña incorrecta", message: "Credenciales inválidas. Inténtalo de nuevo.", type: 'wrong_password' };
            }

            setModalConfig(config);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center flex-col bg-[#121212] p-4 font-sans text-white">
            <form
                className="w-full max-w-md p-8 bg-[#191919] rounded-2xl shadow-2xl space-y-6 border border-gray-800"
                onSubmit={handleLogin}
            >
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold tracking-tight mb-2">Stocker</h2>
                    <p className="text-gray-500 text-sm">Gestiona tu negocio inteligentemente.</p>
                </div>

                <div className="space-y-4">
                    <InputForm label="Nombre de usuario" onChange={(e) => setUsername(e.target.value)} />
                    <InputForm label="Contraseña" type="password" onChange={(e) => setPassword(e.target.value)} />
                </div>

                <button
                    disabled={loading}
                    className={`w-full py-4 rounded-xl font-bold transition-all transform active:scale-95 shadow-xl ${loading ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                            Verificando...
                        </span>
                    ) : "Iniciar Sesión"}
                </button>
            </form>

            <div className="mt-8 text-center text-gray-500 text-sm">
                ¿Nuevo en Stocker?{" "}
                <Link href="/register" className="text-blue-500 hover:text-blue-400 font-bold underline transition-colors">
                    Crea una cuenta aquí
                </Link>
            </div>

            <InfoModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={modalConfig.title}
                message={modalConfig.type === 'success' ? dynamicMessage : modalConfig.message}
                type={modalConfig.type}
                autoClose={modalConfig.type === 'success'} // Solo oculta botones si es éxito en el login
                primaryAction={modalConfig.type === 'not_found' ? () => router.push('/register') : undefined}
            />
        </div>
    );
}