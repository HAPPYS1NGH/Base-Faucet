'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

import { faucetInfo } from '@/constants';
import { reduceLink } from '@/lib/utils';
import { chainConfigs } from '@/lib/client';
import { getLastTransactionTimestampForAddress } from '@/lib/utils/alchemySDK';

// Utility function to introduce a delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Function to format time elapsed
const formatTimeElapsed = (timestamp) => {
    if (!timestamp) return "Unknown";

    const timeElapsed = Date.now() / 1000 - timestamp;
    let time = "";
    let unit = "";

    if (timeElapsed < 60) {
        unit = timeElapsed === 1 ? "second" : "seconds";
        time = `${Math.floor(timeElapsed)} ${unit} ago`;
    } else if (timeElapsed < 3600) {
        unit = Math.floor(timeElapsed / 60) === 1 ? "minute" : "minutes";
        time = `${Math.floor(timeElapsed / 60)} ${unit} ago`;
    } else if (timeElapsed < 86400) {
        unit = Math.floor(timeElapsed / 3600) === 1 ? "hour" : "hours";
        time = `${Math.floor(timeElapsed / 3600)} ${unit} ago`;
    } else if (timeElapsed < 604800) {
        unit = Math.floor(timeElapsed / 86400) === 1 ? "day" : "days";
        time = `${Math.floor(timeElapsed / 86400)} ${unit} ago`;
    } else if (timeElapsed < 2628000) {
        unit = Math.floor(timeElapsed / 604800) === 1 ? "week" : "weeks";
        time = `${Math.floor(timeElapsed / 604800)} ${unit} ago`;
    } else if (timeElapsed < 31536000) {
        unit = Math.floor(timeElapsed / 2628000) === 1 ? "month" : "months";
        time = `${Math.floor(timeElapsed / 2628000)} ${unit} ago`;
    } else {
        unit = Math.floor(timeElapsed / 31536000) !== 1 ? "years" : "year";
        time = `${Math.floor(timeElapsed / 31536000)} ${unit} ago`;
    }

    return time;
};

// Function to process a single address.
// Balance and last-activity are fetched independently so that a failure
// in one does not blank out the other (a transient RPC error on the
// balance call must not turn a known activity time into "Unknown").
const processAddress = async (address, network) => {
    let balance = "0";
    let lastActive = "Unknown";
    let timestamp = 0;
    let failed = false;

    const config = chainConfigs[network];
    if (!config) {
        console.error('Unknown network:', network);
        return { balance, lastActive, timestamp, address, failed: true };
    }

    try {
        const bal = await config.client.getBalance({ address });
        const balStr = bal.toString();
        if (balStr.length <= 18) {
            balance = "0." + balStr.padStart(18, '0').slice(0, 4);
        } else {
            balance = balStr.slice(0, -18) + "." + balStr.slice(-18).slice(0, 4);
        }
    } catch (e) {
        console.error('Error fetching balance:', address, e);
        failed = true;
    }

    try {
        timestamp = await getLastTransactionTimestampForAddress(
            address,
            network.toLowerCase()
        );
        lastActive = timestamp ? formatTimeElapsed(timestamp) : "Unknown";
    } catch (e) {
        console.error('Error fetching last activity:', address, e);
        failed = true;
    }

    return { balance, lastActive, timestamp, address, failed };
};

function FaucetInfo({ network }) {
    const initialFaucets = faucetInfo[network];
    const [faucetData, setFaucetData] = useState(initialFaucets);

    const getBackgroundColor = (lastActive) => {
        if (!lastActive) return "bg-blue";

        const timeUnit = lastActive.split(" ")[1];
        switch (timeUnit) {
            case "year":
            case "years":
                return "bg-red";
            case "month":
            case "months":
                return "bg-orange";
            default:
                return "bg-blue";
        }
    };

    useEffect(() => {
        const getFaucetInfo = async () => {
            try {
                // Trust session storage only if present. The cache is
                // written exclusively after a fully successful fetch
                // (see below), so a stored entry is always good data.
                const storedData = sessionStorage.getItem(`faucetData_${network}`);
                if (storedData) {
                    setFaucetData(JSON.parse(storedData));
                    return;
                }

                const faucets = faucetInfo[network];
                if (!faucets) {
                    console.error('Unknown network:', network);
                    return;
                }

                const addresses = faucets.map((faucet) => faucet.address);
                const batchSize = 4;
                const delayMs = 1000;

                let fetchedData = [];

                for (let i = 0; i < addresses.length; i += batchSize) {
                    const batch = addresses.slice(i, i + batchSize);
                    const batchResults = await Promise.all(
                        batch.map((address) => processAddress(address, network))
                    );
                    fetchedData = fetchedData.concat(batchResults);

                    if (i + batchSize < addresses.length) {
                        await delay(delayMs);
                    }
                }

                // Combine static faucet info with fetched data
                const combinedData = initialFaucets.map((faucet) => {
                    const fetchedFaucet = fetchedData.find(data => data.address === faucet.address);
                    return {
                        ...faucet,
                        lastActive: fetchedFaucet?.lastActive || "Unknown",
                        timestamp: fetchedFaucet?.timestamp || 0,
                        faucetDown: fetchedFaucet?.faucetDown || false,
                        balance: fetchedFaucet?.balance || "0"
                    };
                });

                // Sort by timestamp (most recent first)
                combinedData.sort((a, b) => b.timestamp - a.timestamp);

                setFaucetData(combinedData);

                // Cache only when every lookup succeeded. Caching a
                // degraded result would pin "active Unknown" for the
                // whole session; instead let the next load self-heal.
                const allHealthy = fetchedData.length > 0 && fetchedData.every((f) => !f.failed);
                if (allHealthy) {
                    sessionStorage.setItem(`faucetData_${network}`, JSON.stringify(combinedData));
                }
            } catch (error) {
                console.error('Error fetching faucet info:', error);
            }
        };

        getFaucetInfo();
    }, [network, initialFaucets]);

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
                            <p className='text-sm'>Balance</p>
                            <h1 className='font-semibold'>{faucet.balance}</h1>
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
