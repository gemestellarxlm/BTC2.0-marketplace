"use client";

import React, { useState, useEffect, useContext } from "react";
import { usePathname } from "next/navigation";
import {
  Image,
  Card,
  CardBody,
  Button,
  ButtonGroup,
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
import toast, { Toaster } from "react-hot-toast";

import { getInscriptionById } from "@/api/inscription";
import { getOffersByInscriptionId, requestOffer } from "@/api/offer";
import { IInscription } from "@/types/inscription";
import { IOffer, IOfferForTable, IOfferForTableMe } from "@/types/offer";
import { offerTableColumns, offerTableColumnsMe } from "@/config/table";
import { getOfferDataForTable } from "@/utils/offer";
import { ConnectionContext } from "@/contexts/connectioncontext";
import { getTokenBalanceByAddressTicker } from "@/api/unisat";
import { Notification } from "@/components/notification";
import { unlistInscription, listInscription } from "@/api/list";
// import { toaster } from "@/utils/toast";

const page = () => {
  const pathname = usePathname();
  const { currentAccount, pubkey } = useContext(ConnectionContext);
  const [inscription, setInscription] = useState<IInscription>({
    address: "",
    pubkey: "",
    inscriptionId: "",
    inscriptionNumber: 0,
    content: "",
    price: 0,
    tokenTicker: "",
  });
  const [offers, setOffers] = useState<IOfferForTable[]>([]);
  const [bestOffer, setBestOffer] = useState<IOfferForTable>({
    key: "",
    price: 0,
    token: "",
    from: "",
  });
  const [isListed, setIsListed] = useState(true);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [offerValue, setOfferValue] = useState(0);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    getInscription();
    getTokenBalance();
    getOffers();
  }, []);

  useEffect(() => {
    getInscription();
    getTokenBalance();
    getOffers();
  }, [currentAccount]);

  const getTokenBalance = async () => {
    if (!currentAccount) return;
    const res = await getTokenBalanceByAddressTicker(currentAccount, "TSNT");
    setTokenBalance(res);
  };

  const getInscription = async () => {
    const inscriptionId = pathname.split("/").pop();
    const res = await getInscriptionById(inscriptionId as string, currentAccount);

    if (res.price !== 0) setIsListed(true);
    else setIsListed(false);
    
    setInscription({
      address: currentAccount,
  pubkey: pubkey,
  inscriptionId: res.inscriptionId,
  inscriptionNumber: res.inscriptionNumber,
  content: res.content,
  price: res.price,
  tokenTicker: res.token
    });
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
  };

  const makeOffer = async () => {
    if (offerValue > tokenBalance) {
      toast.error(
        "You don't have enough funds to complete the purchase. Please deposit or convert your funds."
      );
      return;
    }
    const res = await requestOffer(
      inscription.inscriptionId,
      currentAccount,
      offerValue,
      inscription.tokenTicker
    );
  };

  const requestList = async () => {
    // console.log("xxxxx => ", inscription);
    // const accounts = await window.unisat.getAccounts();
    // console.log("xxxxx => ", accounts[0]);
    // const pubkey = await window.unisat.getPublicKey(accounts[0]);
    // console.log("xxxxx => ", pubkey);
    const res = await listInscription(inscription);
    
  };

  const handleOfferOrList = () => {
    if (isListed) makeOffer();
    else requestList();
  };

  const handleUnlist = async () => {};

  // const handleList = async () => {};

  const handleAccept = (offId: string) => {};

  const handleReject = (offId: string) => {};

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
            {}
            <div className="flex flex-col justify-start h-full pt-6 col-span-12 md:col-span-7 gap-4">
              <h1>{"inscriptionID : " + inscription.inscriptionId.substring(0, 10)+"..."}</h1>
              {(currentAccount != inscription.address || isListed) && (
                <h2>
                  {"Price : " +
                    inscription.price +
                    " " +
                    inscription.tokenTicker}
                </h2>
              )}

              {currentAccount != inscription.address && (
                <Button color="primary" onPress={onOpen}>
                  Make Offer
                </Button>
              )}

              {currentAccount === inscription.address && isListed && (
                <ButtonGroup className="w-full">
                  <Button color="primary" className="w-full" onPress={onOpen}>
                    Update Price
                  </Button>
                  <Button className="w-full" onPress={handleUnlist}>
                    Unlist
                  </Button>
                </ButtonGroup>
              )}

              {currentAccount === inscription.address && !isListed && (
                <ButtonGroup className="w-full mt-[250px] sm:mt-4">
                  <Button color="primary" className="w-full" onPress={onOpen}>
                    List
                  </Button>
                </ButtonGroup>
              )}
              {currentAccount != inscription.address && (
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
                          <TableCell>
                            {columnKey === "from"
                              ? getKeyValue(offer, columnKey).substring(0, 9)
                              : getKeyValue(offer, columnKey)}
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              {currentAccount === inscription.address && isListed && (
                <Table aria-label="Offers">
                  <TableHeader>
                    {offerTableColumnsMe.map((column) => (
                      <TableColumn key={column.key}>{column.label}</TableColumn>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {offers.map((offer) => (
                      <TableRow key={offer.key}>
                        {(columnKey) => (
                          <TableCell>
                            {columnKey === "action" && (
                              <ButtonGroup className="w-full">
                                <Button
                                  color="primary"
                                  className="w-full"
                                  size="sm"
                                  onPress={(e) => handleAccept(offer.key)}
                                >
                                  Accept
                                </Button>
                                <Button
                                  className="w-full"
                                  size="sm"
                                  onPress={(e) => handleReject(offer.key)}
                                >
                                  Reject
                                </Button>
                              </ButtonGroup>
                            )}
                            {columnKey === "from" &&
                              getKeyValue(offer, columnKey).substring(0, 9) +
                                "..."}
                            {(columnKey === "price" || columnKey === "token") &&
                              getKeyValue(offer, columnKey)}
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
      <div>
        <Toaster
          position="top-right"
          reverseOrder={true}
          toastOptions={{
            success: {
              style: {
                background: "black",
                color: "white",
              },
            },
            error: {
              style: {
                background: "black",
                color: "white",
              },
            },
          }}
        />
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {inscription.address !== currentAccount && "Make Offer"} 
                {(inscription.address === currentAccount && isListed) && "Update Price"}
                {(inscription.address === currentAccount && !isListed) && "List Inscription"}
              </ModalHeader>
              <Divider />
              <ModalBody>
                <h1>{"inscriptionID : " + inscription.inscriptionId.substring(0, 10) + "..."}</h1>
                {inscription.address !== currentAccount && (
                  <h2>
                    {"Price : " +
                      inscription.price +
                      " " +
                      inscription.tokenTicker}
                  </h2>
                )}
                {bestOffer.price !== 0 && (
                  <>
                    <Divider />
                    <h2>Best Offer</h2>
                    <h3>{bestOffer.price + " TSNT"}</h3>
                  </>
                )}
                <Divider orientation="horizontal" />
                {isListed ? <h2>Your Offer</h2> : <h2>Price</h2>}
                <Input
                  type="number"
                  placeholder="Input your offer value."
                  onChange={(e) => setOfferValue(parseInt(e.target.value))}
                  endContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">tsnt</span>
                    </div>
                  }
                />
                {
                  (currentAccount !== inscription.inscriptionId && bestOffer) && <>
                  <Divider orientation="horizontal" />
                  <h2>Your Balance</h2>
                  <h3>{tokenBalance}&nbsp;TSNT</h3>
                </>
                }
              </ModalBody>
              <Divider orientation="horizontal" />
              <ModalFooter>
                <Button color="primary" onPress={handleOfferOrList}>
                  {isListed ? "Offer" : "List"}
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
