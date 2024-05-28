"use client"

import React, { useContext } from "react";
import {
  User,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";

import { ConnectionContext } from "@/contexts/connectioncontext";


const Connect = () => {
  const {
    isConnected,
    currentAccount,
    balance,
    connectWallet,
    disconnectWallet,
    network,
  } = useContext(ConnectionContext);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      //   message.success('Address copied to clipboard');
    });
  };

  return (
    <div>
      {isConnected ? (
        <Dropdown>
          <DropdownTrigger>
            <User
              name={currentAccount.substring(0, 9)+"..."}
              description={(balance.total / 100000000).toFixed(8) + " btc"}
              avatarProps={{
                src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
              }}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Dynamic Actions">
            <DropdownItem key="account">{currentAccount}</DropdownItem>
            <DropdownItem key="disconnect" onClick={disconnectWallet}>Disconnect</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      ) : (
        <Button onClick={connectWallet}>Connect to Wallet</Button>
      )}
    </div>
  );
};

export default Connect;
