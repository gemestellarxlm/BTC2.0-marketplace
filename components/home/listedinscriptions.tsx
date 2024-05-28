"use client"

import React, {useState, useEffect, useContext} from "react";
import { getListedInscriptions } from "@/api/inscription";
import InscriptionCard from "../incriptioncard";
import { IInscription } from "@/types/inscription";

const ListedInscriptions = () => {
    const [inscriptions, setInscriptions] = useState<IInscription[]>([]);
    
    useEffect(() => {
        getInscriptions();
    }, []);

    const getInscriptions = async () => {
        const inscriptions = await getListedInscriptions();
        console.log("listed inscriptions =>", inscriptions);
        setInscriptions(inscriptions);
    }

    return (
        <div className="w-full">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {
                inscriptions.map(inscription => <InscriptionCard inscription={inscription} />)
            }
        </div>
        </div>
    )
}

export default ListedInscriptions;