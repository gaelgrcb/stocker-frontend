import React from "react";

interface Props{
    bussines: string,
    subtitle?: string,
    subtext?: string
}

const loadCompany = async () => {

}

export default function UserHeader({bussines, subtitle, subtext}: Props) {
   return(
     <header className="mb-10">
                <h1 className="text-3xl font-black text-blue-500 tracking-tighter uppercase">{bussines}</h1>
                <h3>{subtitle}</h3>
                <p className="text-gray-500 text-sm">{subtext}</p>
    </header>
   );
}