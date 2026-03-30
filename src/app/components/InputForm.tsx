import React from "react";

interface Props {
    label: string;
    type?: string;
    placeholder?: string;
    value?: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputForm({ label, type = "text", placeholder, value, onChange }: Props) {
    return (
        <div className="flex flex-col">
            <label className="text-gray-400 mb-1 text-sm font-medium">{label}</label>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="bg-transparent border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
        </div>
    );
}