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
}

export default function Dashboard() {
    const [products, setProducts] = useState<Product[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [newProd, setNewProd] = useState({ name: '', model: '', flavor: '', cost: 0, price: 0 });

    const loadData = async () => {
        try {
            const res = await api.get('/products/all');
            setProducts(res.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { loadData(); }, []);

    const saveProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/products/create', newProd);
            setShowModal(false);
            loadData();
        } catch (err) { alert("Error al guardar"); }
    };

    return (
        <div className="min-h-screen bg-[#121212] text-white p-8">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between mb-8">
                    <h1 className="text-2xl font-bold border-l-4 border-blue-600 pl-4">INVENTARIO</h1>
                    <button onClick={() => setShowModal(true)} className="bg-blue-600 px-6 py-2 rounded-lg font-bold hover:bg-blue-700">+ Nuevo</button>
                </header>

                <div className="bg-[#191919] rounded-xl border border-gray-800 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-[#252525] text-gray-400 text-xs uppercase">
                            <tr>
                                <th className="p-4">Producto</th>
                                <th className="p-4">Modelo/Sabor</th>
                                <th className="p-4">Costo</th>
                                <th className="p-4">Precio</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {products.map(p => (
                                <tr key={p.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-bold">{p.name}</td>
                                    <td className="p-4 text-blue-400">{p.model} | {p.flavor}</td>
                                    <td className="p-4 text-gray-400">${p.cost}</td>
                                    <td className="p-4 text-green-400 font-bold">${p.price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4">
                    <form onSubmit={saveProduct} className="bg-[#191919] p-8 rounded-2xl border border-gray-800 w-full max-w-md space-y-4">
                        <h2 className="text-xl font-bold mb-4">Nuevo Producto</h2>
                        <InputForm label="Nombre" onChange={e => setNewProd({...newProd, name: e.target.value})} />
                        <InputForm label="Modelo" onChange={e => setNewProd({...newProd, model: e.target.value})} />
                        <InputForm label="Sabor" onChange={e => setNewProd({...newProd, flavor: e.target.value})} />
                        <InputForm label="Costo" type="number" onChange={e => setNewProd({...newProd, cost: Number(e.target.value)})} />
                        <InputForm label="Precio" type="number" onChange={e => setNewProd({...newProd, price: Number(e.target.value)})} />
                        <div className="flex gap-4 pt-4">
                            <button type="button" onClick={() => setShowModal(false)} className="flex-1 text-gray-400 hover:text-white">Cancelar</button>
                            <button type="submit" className="flex-1 bg-blue-600 py-2 rounded-lg font-bold">Guardar</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}