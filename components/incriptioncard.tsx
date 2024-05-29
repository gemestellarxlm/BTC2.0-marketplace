"use client";

import React, { useState, useEffect, useContext } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  Divider,
  Link,
  Chip,
} from "@nextui-org/react";
import { ConnectionContext } from "@/contexts/connectioncontext";
import { useRouter } from "next/navigation";
import { IInscription } from "@/types/inscription";

const InscriptionCard = ({ inscription }: { inscription: IInscription }) => {
  const { currentAccount } = useContext(ConnectionContext);

  const router = useRouter();
  const [data, setData] = useState();

  useEffect(() => {}, []);

  return (
    <Card
      className=""
      isPressable
      onPress={() => {
        router.push(`../inscription/${inscription.inscriptionId}`);
      }}
    >
      <CardHeader className="flex gap-3">
        <h1>#{inscription.inscriptionNumber}</h1>
      </CardHeader>
      <Divider />
      <CardBody>
        <Image
          alt="Card background"
          className="object-cover rounded-xl"
          src={inscription.content}
          width={400}
        />
      </CardBody>
      <Divider />
      <CardFooter>
        <div className="flex flex-col justify-end w-full">
          {currentAccount === inscription.address && (
            <Chip color="primary">Unlisted</Chip>
          )}
          {currentAccount !== inscription.address && (
            <>
              <p className="text-md text-right">{inscription.price}</p>
              <p className="text-small text-default-500 text-right">
                {inscription.tokenTicker}
              </p>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default InscriptionCard;
