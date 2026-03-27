interface Props {
    label: string;
    type?: string;
    placeholder?: string;
}

export default function InputForm({ label, type = "text", placeholder }: Props) {
    return (
        <div className="flex flex-col">
            <label className="text-gray-400 mb-1 text-sm font-medium">{label}</label>
            <input
                type={type}
                placeholder={placeholder}
                className="bg-transparent border border-gray-700 rounded-lg p-2 text-white
                           focus:outline-none focus:border-blue-500 transition-colors
                           placeholder:text-gray-600"
            />
        </div>
    );
}