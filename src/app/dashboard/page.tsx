'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiDollarSign, FiPackage, FiShoppingCart, FiAlertCircle } from 'react-icons/fi';
import UserHeader from '../components/UserHeader';

export default function DashboardPage() {
    const router = useRouter();
    const [metrics, setMetrics] = useState({
        earnings: 12540.50,
        lowStock: 3,
        totalSales: 48
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) router.push('/'); // Si no hay token, al login (raíz)
    }, [router]);

    return (
        <div className="min-h-screen bg-[#121212] text-white p-6 md:p-10">
            <UserHeader bussines="Panel de Control">
            </UserHeader>

            {/* Metricas Rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-[#191919] p-6 rounded-2xl border border-gray-800">
                    <FiDollarSign className="text-green-500 text-3xl mb-4" />
                    <p className="text-gray-500 text-xs uppercase font-bold">Ganancia Mensual</p>
                    <h2 className="text-3xl font-bold">${metrics.earnings.toLocaleString()}</h2>
                </div>
                <div className="bg-[#191919] p-6 rounded-2xl border border-gray-800">
                    <FiAlertCircle className="text-amber-500 text-3xl mb-4" />
                    <p className="text-gray-500 text-xs uppercase font-bold">Productos Bajo Stock</p>
                    <h2 className="text-3xl font-bold text-amber-500">{metrics.lowStock} Items</h2>
                </div>
                <div className="bg-[#191919] p-6 rounded-2xl border border-gray-800">
                    <FiShoppingCart className="text-blue-500 text-3xl mb-4" />
                    <p className="text-gray-500 text-xs uppercase font-bold">Ventas Totales</p>
                    <h2 className="text-3xl font-bold">{metrics.totalSales}</h2>
                </div>
            </div>

            {/* Accesos Directos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Link href="/inventario" className="bg-[#191919] p-10 rounded-3xl border border-gray-800 hover:border-blue-600 transition-all flex flex-col items-center group">
                    <FiPackage className="text-5xl text-gray-600 group-hover:text-blue-500 mb-4 transition-colors" />
                    <h3 className="text-xl font-bold">Gestionar Inventario</h3>
                    <p className="text-gray-500 text-sm mt-2">Ver, editar y agregar productos</p>
                </Link>

                <div className="bg-blue-600/10 p-10 rounded-3xl border border-blue-600/30 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-600/20 transition-all">
                    <FiShoppingCart className="text-5xl text-blue-500 mb-4" />
                    <h3 className="text-xl font-bold text-blue-400">Venta Rápida</h3>
                    <p className="text-blue-200/50 text-sm mt-2">Registrar transacción ahora</p>
                </div>
            </div>
        </div>
    );
}