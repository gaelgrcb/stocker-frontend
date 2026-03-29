'use client';
import { useEffect, useState } from 'react';
import api from "../../lib/api";
import InputForm from "../components/InputForm";

interface Product {
    id: number;
    name: string;
    model: string;
    flavor: string;
    cost: number;
    price: number;
    stock?: number;
}

const initialFormState = { id: 0, name: '', model: '', flavor: '', cost: 0, price: 0, stock: 0 };

export default function InventoryPage() {
    const [products, setProducts] = useState<Product[]>([]);
    
    const [showModal, setShowModal] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(initialFormState);
    const [originalData, setOriginalData] = useState(initialFormState);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(amount);
    };

    const loadData = async () => {
        try {
            const res = await api.get('/products/all');
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            loadData();
        } else {
            window.location.href = '/login';
        }
    }, []);

    const handleNewClick = () => {
        setFormData(initialFormState);
        setIsEditing(false);
        setShowModal(true);
    };

    const handleEditClick = (product: Product) => {
        const productData = { ...product, stock: product.stock || 0 };
        setFormData(productData);
        setOriginalData(productData);
        setIsEditing(true);
        setShowModal(true);
    };

    const handlePreSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowModal(false);
        setShowConfirm(true);
    };

    const executeSave = async () => {
        try {
            if (isEditing) {
                await api.put(`/products/edit/${formData.id}`, formData); 
            } else {
                await api.post('/products/create', formData);
            }
            setShowConfirm(false);
            loadData();
        } catch (err) {
            alert("Error al guardar en el servidor");
        }
    };

    const getChangesList = () => {
        if (!isEditing) return [<li key="new" className="text-green-400">Se creará un nuevo producto.</li>];
        
        const changes = [];
        if (formData.name !== originalData.name) changes.push(`Nombre: ${originalData.name} ➔ ${formData.name}`);
        if (formData.model !== originalData.model) changes.push(`Modelo: ${originalData.model} ➔ ${formData.model}`);
        if (formData.flavor !== originalData.flavor) changes.push(`Sabor: ${originalData.flavor} ➔ ${formData.flavor}`);
        if (formData.cost !== originalData.cost) changes.push(`Costo: ${formatCurrency(originalData.cost)} ➔ ${formatCurrency(formData.cost)}`);
        if (formData.price !== originalData.price) changes.push(`Precio: ${formatCurrency(originalData.price)} ➔ ${formatCurrency(formData.price)}`);
        if (formData.stock !== originalData.stock) changes.push(`Stock: ${originalData.stock} pz ➔ ${formData.stock} pz`);
        
        if (changes.length === 0) return [<li key="none" className="text-gray-400">No se detectaron cambios.</li>];
        return changes.map((c, i) => <li key={i} className="text-yellow-400 text-sm border-b border-gray-800 pb-2">{c}</li>);
    };

    return (
        <div className="min-h-screen bg-[#121212] text-white p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-6 md:mb-8">
                    <h1 className="text-xl md:text-2xl font-bold border-l-4 border-blue-600 pl-4">INVENTARIO</h1>
                    <button
                        onClick={handleNewClick}
                        className="bg-blue-600 px-4 py-2 md:px-6 md:py-2 rounded-lg font-bold hover:bg-blue-700 text-sm md:text-base transition-colors shadow-lg shadow-blue-900/20"
                    >
                        + Nuevo
                    </button>
                </header>

                {/* --- VISTA MÓVIL --- */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                    {products.length === 0 ? (
                        <div className="text-center p-8 bg-[#191919] rounded-xl border border-gray-800 text-gray-500">
                            No hay productos registrados.
                        </div>
                    ) : (
                        products.map(p => (
                            <div 
                                key={p.id} 
                                onClick={() => handleEditClick(p)}
                                className="bg-[#191919] rounded-xl border border-gray-800 p-5 shadow-lg space-y-3 cursor-pointer hover:border-blue-500/50 transition-colors active:scale-95"
                            >
                                <div className="flex justify-between items-center border-b border-gray-800 pb-3 pointer-events-none">
                                    <h3 className="font-bold text-lg text-white">{p.name}</h3>
                                    <span className="text-green-400 font-bold text-lg">{formatCurrency(p.price)}</span>
                                </div>
                                <div className="flex justify-between text-sm pointer-events-none">
                                    <span className="text-gray-500">Modelo/Sabor:</span>
                                    <span className="text-gray-300 text-right">{p.model} <span className="text-gray-600 mx-1">|</span> {p.flavor}</span>
                                </div>
                                <div className="flex justify-between text-sm pointer-events-none">
                                    <span className="text-gray-500">Costo:</span>
                                    <span className="text-gray-400">{formatCurrency(p.cost)}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 pointer-events-none">
                                    <span className="text-gray-500 text-sm">Stock disponible:</span>
                                    <span className={`px-3 py-1 rounded-md text-xs font-bold ${p.stock && p.stock > 0 ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                        {p.stock !== undefined ? p.stock : '0'} unidades
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* --- VISTA DESKTOP --- */}
                <div className="hidden md:block bg-[#191919] rounded-xl border border-gray-800 overflow-hidden shadow-xl">
                    <table className="w-full text-left">
                        <thead className="bg-[#212121] text-gray-400 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="p-4 border-b border-gray-800">Producto</th>
                                <th className="p-4 border-b border-gray-800">Modelo/Sabor</th>
                                <th className="p-4 border-b border-gray-800 text-center">Cantidad</th>
                                <th className="p-4 border-b border-gray-800 text-right">Costo</th>
                                <th className="p-4 border-b border-gray-800 text-right">Precio</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800 text-sm">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-10 text-center text-gray-500">No hay productos registrados.</td>
                                </tr>
                            ) : (
                                products.map(p => (
                                    <tr 
                                        key={p.id} 
                                        onClick={() => handleEditClick(p)}
                                        className="hover:bg-white/5 transition-colors cursor-pointer"
                                    >
                                        <td className="p-4 font-bold text-gray-200">{p.name}</td>
                                        <td className="p-4 text-blue-400">
                                            <span className="text-gray-400">{p.model}</span> <span className="text-gray-600 mx-1">|</span> {p.flavor}
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-2 py-1 rounded-md text-xs font-bold ${p.stock && p.stock > 0 ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                                {p.stock !== undefined ? p.stock : '0'} pz
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-400 text-right">{formatCurrency(p.cost)}</td>
                                        <td className="p-4 text-green-400 font-bold text-right">{formatCurrency(p.price)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- MODAL DE FORMULARIO (Crear/Editar) --- */}
            {showModal && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <form onSubmit={handlePreSubmit} className="bg-[#191919] p-6 md:p-8 rounded-2xl border border-gray-800 w-full max-w-md space-y-4 shadow-2xl">
                        <h2 className="text-xl font-bold mb-4 text-white">
                            {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
                        </h2>
                        
                        <InputForm label="Nombre" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />

                        <div className="grid grid-cols-2 gap-4">
                            <InputForm label="Modelo" value={formData.model} onChange={e => setFormData({ ...formData, model: e.target.value })} />
                            <InputForm label="Sabor" value={formData.flavor} onChange={e => setFormData({ ...formData, flavor: e.target.value })} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <InputForm label="Costo" type="number" value={formData.cost} onChange={e => setFormData({ ...formData, cost: Number(e.target.value) })} />
                            <InputForm label="Precio" type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} />
                        </div>

                        {/* Nuevo campo de Stock */}
                        <InputForm label="Cantidad Inicial (Pz)" type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })} />

                        <div className="flex gap-4 pt-4">
                            <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-800 text-gray-300 hover:text-white py-2.5 rounded-lg font-semibold transition-colors">Cancelar</button>
                            <button type="submit" className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-900/20 transition-all">Siguiente</button>
                        </div>
                    </form>
                </div>
            )}

            {/* --- MODAL DE CONFIRMACIÓN --- */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 z-50">
                    <div className="bg-[#191919] p-6 md:p-8 rounded-2xl border border-gray-700 w-full max-w-sm shadow-2xl">
                        <h2 className="text-xl font-bold mb-2 text-white">Confirmar Cambios</h2>
                        <p className="text-sm text-gray-400 mb-4">Revisa las modificaciones antes de aplicarlas a la base de datos.</p>
                        
                        <ul className="bg-[#121212] p-4 rounded-lg space-y-3 mb-6 max-h-48 overflow-y-auto">
                            {getChangesList()}
                        </ul>

                        <div className="flex gap-4">
                            <button 
                                onClick={() => { setShowConfirm(false); setShowModal(true); }} 
                                className="flex-1 bg-gray-800 text-gray-300 hover:text-white py-2.5 rounded-lg font-semibold transition-colors"
                            >
                                Volver
                            </button>
                            <button 
                                onClick={executeSave} 
                                className="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-bold hover:bg-green-500 shadow-lg shadow-green-900/20 transition-all"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}