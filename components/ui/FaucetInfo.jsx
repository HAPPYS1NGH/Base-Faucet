'use client';
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

import { faucetInfo } from '@/constants';
import { reduceLink } from '@/lib/utils';

function FaucetInfo({ network }) {
    const initialFaucets = faucetInfo[network];
    const [faucetData, setFaucetData] = useState(initialFaucets);

    const getBackgroundColor = (lastActive) => {
        if (!lastActive) return "bg-blue"; // Default color when loading

        const timeUnit = lastActive.split(" ")[1];
        switch (timeUnit) {
            case "year" || "years":
                return "bg-red";
            case "month" || "months":
                return "bg-orange";
            default:
                return "bg-blue"; // Default color for unknown time units
        }
    };

    useEffect(() => {
        const getFaucetInfo = async () => {
            try {
                const response = await fetch(`/api/${network.toLowerCase()}/faucet`, {
                    next: {
                        revalidate: 600,
                    },
                    // cache: "no-cache",
                });
                const data = await response.json();
                const fetchedData = data.faucetData;

                // Combine static faucet info with fetched data
                const combinedData = initialFaucets.map((faucet) => {
                    const fetchedFaucet = fetchedData.find(data => data.address === faucet.address);
                    return {
                        ...faucet,
                        lastActive: fetchedFaucet?.lastActive || "loading...",
                        timestamp: fetchedFaucet?.timestamp || 0,
                        faucetDown: fetchedFaucet?.faucetDown || false
                    };
                });

                // Sort the combined data by timestamp in ascending order
                combinedData.sort((a, b) => b.timestamp - a.timestamp);

                setFaucetData(combinedData);

                // Store the fetched data in session storage
                sessionStorage.setItem(`faucetData_${network}`, JSON.stringify(combinedData));
            } catch (error) {
                console.error('Error fetching faucet info:', error);
            }
        };

        // Check if data is available in session storage
        const storedData = sessionStorage.getItem(`faucetData_${network}`);
        if (storedData) {
            setFaucetData(JSON.parse(storedData));
        } else {
            getFaucetInfo();
        }
    }, [network]);

    return (
        <>
            {faucetData.map((faucet) => (
                <div key={faucet.name} className={`border-3 ${faucet.faucetDown ? "border-red" : "border-white"} sm:w-100 w-96 rounded-lg text-white my-6 `}>
                    <div className="flex p-5 gap-3">
                        <div>
                            <Link href={faucet.link} target="_blank">
                                <Image src={`/${faucet.image}`} alt={faucet.name} width={60} height={60} />
                            </Link>
                        </div>
                        <div className="text-left flex flex-col leading-none gap-3">
                            <h1 className="text-2xl leading-none font-bold">{faucet.name}</h1>
                            <Link href={faucet.link} className="text-sm" target="_blank">
                                {reduceLink(faucet?.link)}
                            </Link>
                        </div>
                    </div>
                    <div className='flex justify-around pb-5'>
                        <div>
                            <p className='text-sm'>Amount</p>
                            <h1 className='font-semibold '>
                                {faucet.maxAmount === faucet.minAmount ? faucet.maxAmount : `${faucet.minAmount}-${faucet.maxAmount}`}
                            </h1>
                        </div>
                        <div>
                            <p className='text-sm'>Gas Cost</p>
                            <h1 className='font-semibold'>1 Gwei</h1>
                        </div>
                        <div>
                            <p className='text-sm'>Daily Supply</p>
                            <h1 className='font-semibold'>{faucet.dailySupply}</h1>
                        </div>
                        <div>
                            <p className='text-sm none'>Required</p>
                            <h1 className='block sm:hidden font-semibold'>{faucet.required.length > 10 ? `${faucet.required.substring(0, 10)}..` : faucet.required}</h1>
                            <h1 className='hidden sm:block font-semibold'>{faucet.required}</h1>
                        </div>
                    </div>

                    <div className={`p-2 border-t-3 ${getBackgroundColor(faucet?.lastActive)} text-xs`}>
                        {faucet.lastActive ? `active ${faucet.lastActive}` : "loading..."}
                    </div>
                </div>
            ))}
        </>
    );
}

export default FaucetInfo;
