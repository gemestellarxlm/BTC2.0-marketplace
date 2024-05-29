"use client";

import React, { useState, useEffect, useContext } from "react";
import { usePathname, redirect } from "next/navigation";
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
import {
  getOffersByInscriptionId,
  requestOffer,
  requestPsbt,
  rejectOffer,
  acceptOffer,
} from "@/api/offer";
import { IInscription } from "@/types/inscription";
import { IOffer, IOfferForTable, IOfferForTableMe } from "@/types/offer";
import { offerTableColumns, offerTableColumnsMe } from "@/config/table";
import { getOfferDataForTable } from "@/utils/offer";
import { ConnectionContext } from "@/contexts/connectioncontext";
import { getTokenBalanceByAddressTicker } from "@/api/unisat";
import { unlistInscription, listInscription } from "@/api/list";
import { marketplace_fee } from "@/config/site";

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
  const [offerList, setOfferList] = useState<IOffer[]>([]);
  const [bestOffer, setBestOffer] = useState<IOfferForTable>({
    key: "",
    price: 0,
    token: "",
    from: "",
    status: 0,
  });
  const [isListed, setIsListed] = useState(true);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [offerValue, setOfferValue] = useState(0);
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  useEffect(() => {
    initData();
  }, []);

  useEffect(() => {
    initData();
  }, [currentAccount]);

  const initData = async () => {
    await getInscription();
    await getTokenBalance();
    await getOffers();
  };

  const getTokenBalance = async () => {
    if (!currentAccount) return;
    const res = await getTokenBalanceByAddressTicker(currentAccount, "TSNT");
    setTokenBalance(res * 1);
  };

  const getInscription = async () => {
    const inscriptionId = pathname.split("/").pop();
    const res = await getInscriptionById(
      inscriptionId as string,
      currentAccount
    );

    if (res.price !== 0) setIsListed(true);
    else setIsListed(false);

    setInscription({
      address: res.address,
      pubkey: res.pubkey,
      inscriptionId: res.inscriptionId,
      inscriptionNumber: res.inscriptionNumber,
      content: res.content,
      price: res.price,
      tokenTicker: res.tokenTicker,
    });
  };

  const getOffers = async () => {
    let res = await getOffersByInscriptionId(pathname);
    setOfferList(res);

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

  const makeOffer = async () => {
    if (offerValue > tokenBalance) {
      toast.error(
        "You don't have enough funds to complete the purchase. Please deposit or convert your funds."
      );
      return;
    }
    let fee_brcInscription: any = {},
      brcInscription: any = {};
    try {
      fee_brcInscription = await window.unisat.inscribeTransfer(
        "tsnt",
        Math.round((offerValue * marketplace_fee) / 100).toString()
      );

      brcInscription = await window.unisat.inscribeTransfer(
        "tsnt",
        Math.round((offerValue * (100 - marketplace_fee)) / 100).toString()
      );
    } catch (error) {
      toast.error("Error occured while inscribing your brc20 tokens!");
      return;
    }

    const psbtStr: any = await requestPsbt(
      inscription.inscriptionId,
      brcInscription.inscriptionId,
      fee_brcInscription.inscriptionId,
      pubkey,
      currentAccount,
      inscription.pubkey,
      inscription.address
    );

    if (psbtStr == "") {
      toast.error("Error occured while request psbt.");
      return;
    }
    // const psbt = Bitcoin.Psbt.fromHex(psbtStr);
    // console.log("psbt => ", psbt);
    let signedPsbt: any;
    try {
      signedPsbt = await window.unisat.signPsbt(psbtStr);
    } catch (error) {
      toast.error("Error occured while sign transaction.");
      return;
    }

    let offerFlag: any;
    try {
      offerFlag = await requestOffer({
        _id: "",
        inscriptionId: inscription.inscriptionId,
        sellerAddress: inscription.address,
        buyerAddress: currentAccount,
        price: offerValue,
        tokenTicker: "tsnt",
        psbt: psbtStr,
        status: 1,
        buyerSignedPsbt: signedPsbt,
      });
      if (offerFlag) {
        toast.success("Successfully offered.");
        onClose();
        initData();
      }
    } catch (error) {
      toast.error("Error occured while request offer.");
    }
  };

  const requestList = async () => {
    const res = await listInscription({
      address: currentAccount,
      pubkey: pubkey,
      inscriptionId: inscription.inscriptionId,
      inscriptionNumber: inscription.inscriptionNumber,
      content: inscription.content,
      price: offerValue,
      tokenTicker: inscription.tokenTicker,
    });

    setInscription({
      address: inscription.address,
      pubkey: inscription.pubkey,
      inscriptionId: inscription.inscriptionId,
      inscriptionNumber: inscription.inscriptionNumber,
      content: inscription.content,
      price: offerValue,
      tokenTicker: inscription.tokenTicker,
    });

    if (res) {
      toast.success("Successfully listed");
      onClose();
      setIsListed(true);
    }
  };

  const handleUnlist = async () => {
    const res = await unlistInscription(inscription.inscriptionId);
    if (res) {
      toast.success("Successfully unlisted!");
      setIsListed(false);
      setInscription({
        address: inscription.address,
        pubkey: inscription.pubkey,
        inscriptionId: inscription.inscriptionId,
        inscriptionNumber: inscription.inscriptionNumber,
        content: inscription.content,
        price: 0,
        tokenTicker: inscription.tokenTicker,
      });
    } else {
      toast.success("Error occured while unlisting!");
    }
    onClose();
  };

  const handleOfferOrList = () => {
    if (isListed) {
      makeOffer();
    } else requestList();
  };

  const handleAccept = async (offerId: string) => {
    let inscriptionId = "",
      psbt = "",
      buyerSignedPsbt = "";
    offerList.forEach((offer) => {
      if (offer._id == offerId) {
        inscriptionId = offer.inscriptionId;
        psbt = offer.psbt;
        buyerSignedPsbt = offer.buyerSignedPsbt;
      }
    });

    let signedPsbt = "";
    try {
      signedPsbt = await window.unisat.signPsbt(buyerSignedPsbt);

      await acceptOffer(inscriptionId, psbt, buyerSignedPsbt, signedPsbt);
      toast.success(
        "Congratelation. Your ordinal was sold out. Please wait a minute and check your wallet."
      );
      redirect("/");
    } catch (error) {
    }
  };

  const handleReject = async (offerId: string) => {
    const res = await rejectOffer(offerId);
    if (!res) {
      toast.error("Error occured while reject the offer.");
      return;
    }
    initData();
  };

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
              <h1>
                {"inscriptionID : " +
                  inscription.inscriptionId.substring(0, 9) +
                  "..."}
              </h1>
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
                  <Button
                    className="w-full"
                    color="primary"
                    onPress={handleUnlist}
                  >
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
                              ? getKeyValue(offer, columnKey).substring(0, 9) +
                                "..."
                              : columnKey === "status"
                                ? getKeyValue(offer, columnKey) == 1
                                  ? "Requested"
                                  : "Rejected"
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
                            {columnKey === "action" &&
                              (getKeyValue("status", columnKey) === 2 ? (
                                ""
                              ) : (
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
                              ))}
                            {/* {(columnKey === "action" && getKeyValue("status", columnKey) == 2) && ""} */}
                            {columnKey === "from" &&
                              getKeyValue(offer, columnKey).substring(0, 9) +
                                "..."}
                            {columnKey === "status" &&
                              (getKeyValue(offer, columnKey) == 1
                                ? "Requested"
                                : "Rejected")}
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
                {inscription.address === currentAccount &&
                  !isListed &&
                  "List Inscription"}
              </ModalHeader>
              <Divider />
              <ModalBody>
                <h1>
                  {"inscriptionID : " +
                    inscription.inscriptionId.substring(0, 10) +
                    "..."}
                </h1>
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

                {currentAccount !== inscription.address && <h2>Your Offer</h2>}
                <Input
                  type="number"
                  placeholder="Input value."
                  onChange={(e) => setOfferValue(parseInt(e.target.value))}
                  endContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-2xl">TSNT</span>
                    </div>
                  }
                />
                {currentAccount !== inscription.address && (
                  <>
                    <Divider orientation="horizontal" />
                    <h2>Your Balance</h2>
                    <h3>{tokenBalance}&nbsp;TSNT</h3>
                  </>
                )}
              </ModalBody>
              <Divider orientation="horizontal" />
              <ModalFooter>
                <Button color="primary" onPress={handleOfferOrList}>
                  {currentAccount != inscription.address ? "Offer" : "List"}
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
