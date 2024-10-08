"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePasswordConfirmation, useWallet } from "@/components/Providers";
import Image from "next/image";

interface Item {
  id: number;
  title: string;
  price: number;
  imageUrl: string;
  description: string;
  location: string;
  time: string;
  vendorDomainName: string;
  ticketId: string;
  isSold: boolean;
  isRedeemed: boolean;
  currentOwner: string;
}

function TicketInterface() {
  const { isConnected, address } = useWallet();
  const router = useRouter();
  const [hasSetPassword, setHasSetPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { isPasswordConfirmed, setIsPasswordConfirmed } =
    usePasswordConfirmation();

  useEffect(() => {
    console.log(
      "TicketInterface - IsConnected:",
      isConnected,
      "Address:",
      address
    );
    if (isConnected && address) {
      const storedPassword = localStorage.getItem(`password_${address}`);
      setHasSetPassword(!!storedPassword);
      setIsPasswordConfirmed(false);
      console.log("Stored password found:", !!storedPassword);
    } else {
      setHasSetPassword(false);
      setIsPasswordConfirmed(false);
    }
  }, [isConnected, address, setIsPasswordConfirmed]);

  const items: Item[] = [
    {
      id: 1,
      title: "Concert Ticket",
      price: 50,
      imageUrl: "/api/placeholder/200/200",
      description: "An amazing concert experience",
      location: "City Arena",
      time: "2024-09-15 20:00",
      vendorDomainName: "concertorganizer.com",
      ticketId: "CT001",
      isSold: false,
      isRedeemed: false,
      currentOwner: "0x0000000000000000000000000000000000000000",
    },
  ];

  const generateSlug = (str: string) => {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleTicketClick = (item: Item) => {
    const slug = generateSlug(item.title);
    console.log("Redirecting to:", `/event/${slug}`);
    router.push(`/event/${slug}`);
  };

  const handleSetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(
      "Setting password. Password:",
      password,
      "Confirm Password:",
      confirmPassword
    );
    if (password === confirmPassword) {
      localStorage.setItem(`password_${address}`, password);
      setHasSetPassword(true);
      setIsPasswordConfirmed(true);
      setErrorMessage("");
      console.log("Password set successfully");
    } else {
      setErrorMessage("Passwords do not match!");
      console.log("Password mismatch");
    }
  };

  const handleEnterPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPassword = localStorage.getItem(`password_${address}`);
    if (enteredPassword === storedPassword) {
      setErrorMessage("");
      setIsPasswordConfirmed(true);
      console.log("Password correct, authenticated");
    } else {
      setErrorMessage("Incorrect password!");
      console.log("Incorrect password");
    }
  };

  if (!isConnected || !address) {
    return (
      <div className="mt-8 text-center">
        <p>Please connect your wallet to continue.</p>
      </div>
    );
  }
  if (!hasSetPassword) {
    return (
      <div className="mt-8 max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">Set Password</h2>
        <form onSubmit={handleSetPassword} className="space-y-4">
          <div>
            <label htmlFor="password" className="block mb-1">
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block mb-1">
              Confirm Password:
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Set Password
          </button>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </form>
      </div>
    );
  }

  if (!isPasswordConfirmed) {
    return (
      <div className="mt-8 max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">Enter Password</h2>
        <form onSubmit={handleEnterPassword} className="space-y-4">
          <div>
            <label htmlFor="enteredPassword" className="block mb-1">
              Password:
            </label>
            <input
              type="password"
              id="enteredPassword"
              value={enteredPassword}
              onChange={(e) => setEnteredPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Enter
          </button>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {items.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg p-4 flex flex-col items-center cursor-pointer"
            onClick={() => handleTicketClick(item)}
          >
            <Image
              src={item.imageUrl}
              alt={item.title}
              width={100}
              height={100}
              className="w-full h-40 object-cover mb-2 rounded"
            />
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="text-gray-600">${item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TicketInterface;
