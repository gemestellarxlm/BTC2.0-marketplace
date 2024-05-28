"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Image,
  Card,
  CardBody,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  useDisclosure,
  Divider,
} from "@nextui-org/react";

import { getInscriptionById } from "@/api/inscription";
import getOffersByInscriptionId from "@/api/offer";
import { IInscription } from "@/types/inscription";
import { IOffer, IOfferForTable } from "@/types/offer";
import { offerTableColumns } from "@/config/table";
import { getOfferDataForTable } from "@/utils/offer";

const page = () => {
  const pathname = usePathname();
  const [inscription, setInscription] = useState<IInscription>({
    address: "string",
    inscriptionId: "string",
    inscriptionNumber: 0,
    output: "string",
    outputValue: 0,
    content: "string",
    price: 1234124,
    tokenTicker: "tvnt",
  });
  const [offers, setOffers] = useState<IOfferForTable[]>([]);
  const [bestOffer, setBestOffer] = useState<IOfferForTable>({
    key: "",
    price: 0,
    token: "",
    from: "",
  });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    getInscription();
    getOffers();
  }, []);

  const getInscription = async () => {
    const res = await getInscriptionById(pathname);
    setInscription(res);
  };

  const getOffers = async () => {
    const res = await getOffersByInscriptionId(pathname);
    const resForTable: IOfferForTable[] = getOfferDataForTable(res);
    if (resForTable.length != 0) {
      let tempBestOffer = resForTable.at(0);
      resForTable.forEach((offer) => {
        if (tempBestOffer?.price && tempBestOffer?.price < offer.price)
          tempBestOffer = offer;
      });
      if (tempBestOffer) {
        setBestOffer(tempBestOffer);
      }
    }

    setOffers(resForTable);
  };

  const handleMakeOffer = () => {};

  return (
    <div className="flex justify-center">
      <Card
        isBlurred
        className="border-none bg-background/60 dark:bg-default-100/50 w-[900px]"
        shadow="sm"
      >
        <CardBody>
          <div className="grid grid-cols-12 items-center justify-center gap-3">
            <div className="relative col-span-12 md:col-span-5">
              <Image
                alt="Inscription Content"
                className="object-cover"
                shadow="md"
                src={inscription.content}
                width="100%"
              />
            </div>

            <div className="flex flex-col justify-start h-full pt-6 col-span-12 md:col-span-7 gap-4">
              <h1>{"inscriptionID : " + inscription.inscriptionId}</h1>
              <h2>
                {"Price : " + inscription.price + " " + inscription.tokenTicker}
              </h2>
              <Button color="primary" onPress={onOpen}>
                Make Offer
              </Button>
              <Table aria-label="Offers">
                <TableHeader>
                  {offerTableColumns.map((column) => (
                    <TableColumn key={column.key}>{column.label}</TableColumn>
                  ))}
                </TableHeader>
                <TableBody>
                  {offers.map((offer) => (
                    <TableRow key={offer.key}>
                      {(columnKey) => (
                        <TableCell>{getKeyValue(offer, columnKey)}</TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardBody>
      </Card>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Make Offer
              </ModalHeader>
              <Divider />
              <ModalBody>
                <h1>{"inscriptionID : " + inscription.inscriptionId}</h1>
                <h2>
                  {"Price : " +
                    inscription.price +
                    " " +
                    inscription.tokenTicker}
                </h2>
                {bestOffer && (
                  <>
                    <Divider />
                    <h2>Best Offer</h2>
                    <h3>{bestOffer.price + " TVNT"}</h3>
                  </>
                )}
                <Divider orientation="horizontal" />
                <h2>Your Offer</h2>
                <Input
                  type="number"
                  placeholder="Input your offer value."
                  endContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">TVNT</span>
                    </div>
                  }
                />
                <Divider orientation="horizontal" />
                <h2>Your Balance</h2>
              </ModalBody>
              <Divider orientation="horizontal" />
              <ModalFooter>
                <Button color="primary" onPress={handleMakeOffer}>
                  Offer
                </Button>
                <Button onPress={onClose}>Cancel</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default page;
