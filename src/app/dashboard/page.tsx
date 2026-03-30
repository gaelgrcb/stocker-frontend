'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FiDollarSign, FiPackage, FiShoppingCart, FiAlertCircle, FiArrowRight } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import UserHeader from '../components/UserHeader';
import api from '../../lib/api';

// 1. Fetch exclusivo de métricas
const fetchMetrics = async () => {
    const res = await api.get('/products/metrics');
    return res.data;
};

export default function DashboardPage() {
    const router = useRouter();

    // 2. Seguridad básica
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/');
        }
    }, [router]);

    // 3. Caché y Petición de Métricas
    const {
        data: metrics,
        isLoading: loading,
        error
    } = useQuery({
        queryKey: ['dashboardMetrics'],
        queryFn: fetchMetrics,
        retry: 1
    });

    // 4. Manejo de caducidad de Token
    useEffect(() => {
        const err = error as any;
        if (err?.response?.status === 401 || err?.response?.status === 403) {
            localStorage.removeItem('token');
            router.push('/');
        }
    }, [error, router]);

    return (
        <div className="min-h-screen bg-[#121212] text-white p-6 md:p-10 font-sans">

            {/* 5. El Header Inteligente (él mismo busca su información) */}
            <UserHeader showGreeting = {true} />

            {/* Metricas Rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

                {/* Ganancia Mensual */}
                <Link href="/reportes/ventas" className="bg-[#191919] p-6 rounded-2xl border border-gray-800 hover:border-green-500/50 transition-all group active:scale-95 shadow-lg">
                    <div className="flex justify-between items-start mb-4">
                        <FiDollarSign className={`text-green-500 text-3xl ${loading ? 'animate-pulse' : ''}`} />
                        <FiArrowRight className="text-gray-700 group-hover:text-green-500" />
                    </div>
                    <p className="text-gray-500 text-xs uppercase font-bold tracking-widest">Ganancia Mensual</p>
                    <h2 className="text-3xl font-bold mt-1">
                        {loading ? "..." : `$${(metrics?.earnings || 0).toLocaleString()}`}
                    </h2>
                </Link>

                {/* Bajo Stock */}
                <Link href="/inventario" className="bg-[#191919] p-6 rounded-2xl border border-gray-800 hover:border-amber-500/50 transition-all group active:scale-95 shadow-lg relative overflow-hidden">
                    {(metrics?.lowStock || 0) > 0 && (
                        <div className="absolute top-0 right-0 w-2 h-full bg-amber-500 opacity-20 group-hover:opacity-40 transition-opacity" />
                    )}
                    <div className="flex justify-between items-start mb-4">
                        <FiAlertCircle className={`text-amber-500 text-3xl ${loading ? 'animate-pulse' : ''}`} />
                        <FiArrowRight className="text-gray-700 group-hover:text-amber-500" />
                    </div>
                    <p className="text-gray-500 text-xs uppercase font-bold tracking-widest">Productos Bajo Stock</p>
                    <h2 className="text-3xl font-bold text-amber-500 mt-1">
                        {loading ? "..." : `${metrics?.lowStock || 0} Items`}
                    </h2>
                </Link>

                {/* Ventas Totales */}
                <Link href="/ventas" className="bg-[#191919] p-6 rounded-2xl border border-gray-800 hover:border-blue-500/50 transition-all group active:scale-95 shadow-lg">
                    <div className="flex justify-between items-start mb-4">
                        <FiShoppingCart className={`text-blue-500 text-3xl ${loading ? 'animate-pulse' : ''}`} />
                        <FiArrowRight className="text-gray-700 group-hover:text-blue-500" />
                    </div>
                    <p className="text-gray-500 text-xs uppercase font-bold tracking-widest">Ventas Totales</p>
                    <h2 className="text-3xl font-bold mt-1">
                        {loading ? "..." : (metrics?.totalSales || 0)}
                    </h2>
                </Link>
            </div>

            {/* Accesos Directos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Link href="/inventario" className="bg-[#191919] p-10 rounded-3xl border border-gray-800 hover:border-blue-600 transition-all flex flex-col items-center group shadow-lg">
                    <FiPackage className="text-5xl text-gray-600 group-hover:text-blue-500 mb-4 transition-colors" />
                    <h3 className="text-xl font-bold">Gestionar Inventario</h3>
                    <p className="text-gray-500 text-sm mt-2 text-center">Ver, editar y agregar productos</p>
                </Link>

                {/* Este puede ser un <Link> a tu página de ventas más adelante */}
                <div className="bg-blue-600/10 p-10 rounded-3xl border border-blue-600/30 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-600/20 transition-all shadow-lg">
                    <FiShoppingCart className="text-5xl text-blue-500 mb-4" />
                    <h3 className="text-xl font-bold text-blue-400">Venta Rápida</h3>
                    <p className="text-blue-200/50 text-sm mt-2 text-center">Registrar transacción ahora</p>
                </div>
            </div>
        </div>
    );
}