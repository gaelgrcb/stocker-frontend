'use client';
import React, { useState, useRef, useEffect } from "react";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// Agregamos más iconos para el menú
import { FiLogOut, FiUser, FiSettings, FiChevronDown } from 'react-icons/fi';
import api from "../../lib/api";

interface Props {
    subtitle?: string;
    subtext?: string;
    showGreeting?: boolean;
}

interface UserProfile {
    name: string;
    username: string;
    business: string;
}

const fetchProfile = async () => {
    const res = await api.get('/users/me');
    return res.data;
};

export default function UserHeader({ subtitle, subtext, showGreeting = false }: Props) {
    const router = useRouter();
    const queryClient = useQueryClient();

    // 1. Estado para controlar si el menú está abierto
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // 2. Referencia para detectar clics fuera del menú
    const menuRef = useRef<HTMLDivElement>(null);

    const { data: profile, isLoading } = useQuery<UserProfile>({
        queryKey: ['userProfile'],
        queryFn: fetchProfile,
        staleTime: 1000 * 60 * 60,
    });

    const handleLogout = () => {
        localStorage.removeItem('token');
        queryClient.clear();
        router.push('/');
    };

    // 3. Efecto para cerrar el menú si se hace clic afuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header className="mb-10 flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
            <div>
                <h1 className="text-3xl font-black text-blue-500 tracking-tighter uppercase">
                    {isLoading ? (
                        <span className="animate-pulse bg-blue-500/20 text-transparent rounded w-48 inline-block">
                            Cargando...
                        </span>
                    ) : (
                        profile?.business || "Mi Negocio"
                    )}
                </h1>

                {subtitle && <h3 className="text-lg font-medium text-gray-300 mt-1">{subtitle}</h3>}
                {subtext && <p className="text-gray-500 text-sm mt-1">{subtext}</p>}

                {showGreeting && !isLoading && profile?.name && (
                    <p className="text-gray-600 text-xs mt-1 uppercase font-semibold tracking-wider">
                        Hola, {profile.name}
                    </p>
                )}
            </div>

            {/* 4. Contenedor Relativo para el Menú Desplegable */}
            <div className="relative" ref={menuRef}>
                {/* Botón que abre/cierra el menú */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center gap-3 px-4 py-2 bg-[#191919] hover:bg-[#252525] border border-gray-800 rounded-xl transition-all active:scale-95"
                >
                    <div className="bg-blue-600/20 text-blue-500 p-2 rounded-lg">
                        <FiUser className="text-lg" />
                    </div>
                    <div className="hidden md:block text-left">
                        <p className="text-sm font-bold text-gray-200">
                            {isLoading ? "..." : profile?.username || "Usuario"}
                        </p>
                    </div>
                    <FiChevronDown className={`text-gray-500 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* 5. El Menú Desplegable en sí */}
                {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-[#191919] border border-gray-800 rounded-xl shadow-2xl overflow-hidden z-50 origin-top-right animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="p-2 space-y-1">
                            {/* Opción: Perfil */}
                            <Link
                                href="/perfil"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                            >
                                <FiUser className="text-gray-500" />
                                Mi Perfil
                            </Link>

                            {/* Opción: Configuración */}
                            <Link
                                href="/configuracion"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                            >
                                <FiSettings className="text-gray-500" />
                                Configuración
                            </Link>
                        </div>

                        <div className="h-px bg-gray-800 w-full"></div>

                        <div className="p-2">
                            {/* Opción: Cerrar Sesión */}
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 hover:bg-red-500/10 font-medium rounded-lg transition-colors text-left"
                            >
                                <FiLogOut className="text-red-500/70" />
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}