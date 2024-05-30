"use client";

import React, { useState, useEffect, useContext } from "react";
import { Switch } from "@nextui-org/switch";
import { getListedInscriptions, getInscriptions } from "@/api/inscription";
import InscriptionCard from "../incriptioncard";
import { IInscription } from "@/types/inscription";
import { ConnectionContext } from "@/contexts/connectioncontext";

const ListedInscriptions = () => {
  const { currentAccount } = useContext(ConnectionContext);
  const [inscriptions, setInscriptions] = useState<IInscription[]>([]);
  const [isMine, setIsMine] = React.useState(false);

  useEffect(() => {
    getAllInscriptions();
  }, []);

  useEffect(() => {
    getAllInscriptions();
  }, [isMine]);

  const getAllInscriptions = async () => {
    let inscriptions: IInscription[] = [];
    if (isMine) inscriptions = await getInscriptions(currentAccount);
    else inscriptions = await getListedInscriptions();

    console.log("xxxxx =>", inscriptions);
    setInscriptions(inscriptions);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-2 justify-end">
        <Switch isSelected={isMine} onValueChange={setIsMine}>
          Mine
        </Switch>
      </div>
      <div className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {inscriptions.map((inscription) => (
          <InscriptionCard inscription={inscription} />
        ))}
      </div>
    </div>
  );
};

export default ListedInscriptions;
