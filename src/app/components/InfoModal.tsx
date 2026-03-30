'use client';
import { CheckCircle2, UserCircle2, Search, KeyRound, AlertTriangle, Info, Loader2 } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    type: 'info' | 'not_found' | 'wrong_password' | 'exist' | 'error' | 'success' | 'loading'; // Añadimos 'loading'
    primaryAction?: () => void;
    autoClose?: boolean;
}

export default function InfoModal({ isOpen, onClose, title, message, type, primaryAction, autoClose = false }: ModalProps) {
    if (!isOpen) return null;

    const getIcon = () => {
        const iconSize = 40;
        switch (type) {
            case 'loading':
                return <Loader2 size={iconSize} className="text-blue-500 animate-spin" />;
            case 'success':
                return <CheckCircle2 size={iconSize} className="text-green-500 animate-in zoom-in duration-300" />;
            case 'exist': return <UserCircle2 size={iconSize} className="text-blue-500" />;
            case 'not_found': return <Search size={iconSize} className="text-blue-500" />;
            case 'wrong_password': return <KeyRound size={iconSize} className="text-red-500" />;
            case 'error': return <AlertTriangle size={iconSize} className="text-red-500" />;
            default: return <Info size={iconSize} className="text-blue-500" />;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
            <div className="bg-[#191919] border border-gray-800 p-10 rounded-3xl max-w-sm w-full shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] text-center transform animate-in zoom-in duration-300 text-white">

                {/* Contenedor del Icono con efecto de pulso si es carga */}
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${type === 'success' ? 'bg-green-600/10' : 'bg-blue-600/10'
                    }`}>
                    {getIcon()}
                </div>

                <h3 className="text-2xl font-bold mb-3 tracking-tight">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{message}</p>

                {!autoClose && type !== 'loading' && (
                    <div className="space-y-3 mt-8">
                        <button
                            onClick={primaryAction || onClose}
                            className={`w-full text-white font-bold py-3.5 rounded-2xl transition-all active:scale-95 shadow-lg ${type === 'success' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                        >
                            {type === 'not_found' ? 'Registrarme ahora' : 'Entendido'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}