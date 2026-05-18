'use client';

import { networks } from '@/constants';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';
import { spaceAfterCapital } from '@/lib/utils';
import { chainConfigs } from '@/lib/client';

export default function NetworkInfo({ network }) {
    const [blockNumber, setBlockNumber] = useState('Loading...');
    const [gasPrice, setGasPrice] = useState('Loading...');

    useEffect(() => {
        const fetchNetworkData = async () => {
            try {
                const config = chainConfigs[network];
                if (!config) {
                    console.error('Unknown network:', network);
                    return;
                }

                const client = config.client;

                // Fetch block number and gas price in parallel
                const [blockNum, gasPriceWei] = await Promise.all([
                    client.getBlockNumber(),
                    client.getGasPrice(),
                ]);

                setBlockNumber(blockNum.toString());

                // Format gas price
                const gasPriceNum = Number(gasPriceWei);
                let formattedGasPrice;

                if (gasPriceNum > 1e9) {
                    formattedGasPrice = (gasPriceNum / 1e9).toFixed(2) + ' Gwei';
                } else if (gasPriceNum >= 1e6) {
                    formattedGasPrice = (gasPriceNum / 1e6).toFixed(2) + ' M Wei';
                } else if (gasPriceNum >= 1e3) {
                    formattedGasPrice = (gasPriceNum / 1e3).toFixed(2) + ' K Wei';
                } else {
                    formattedGasPrice = gasPriceNum.toFixed(2) + ' Wei';
                }

                setGasPrice(formattedGasPrice);
            } catch (error) {
                console.error('Error fetching network data:', error);
                setBlockNumber('Error');
                setGasPrice('Error');
            }
        };

        fetchNetworkData();

        // Optionally refresh every 30 seconds
        const interval = setInterval(fetchNetworkData, 30000);
        return () => clearInterval(interval);
    }, [network]);

    const leftNetwork = networks[(networks.indexOf(network) - 1) === -1 ? networks.length - 1 : networks.indexOf(network) - 1];
    const rightNetwork = networks[(networks.indexOf(network) + 1) === networks.length ? 0 : networks.indexOf(network) + 1];

    return (
        <div className='text-white text-center mb-6 sm:w-100 w-96 border-white rounded-lg border-3'>
            <div className='flex bg-blue p-5 items-center justify-between'>
                <Link href={`/${leftNetwork}/`}>
                    <AiOutlineArrowLeft className="text-white text-2xl transition duration-300 hover:text-navy" />
                </Link>
                <h1 className='mx-3 font-bold text-xl'>{spaceAfterCapital(network)}</h1>
                <Link href={`/${rightNetwork}/`}>
                    <AiOutlineArrowRight className="text-2xl hover:text-navy transition duration-300" />
                </Link>
            </div>
            <div className='flex justify-around py-5 border-t-3'>
                <div>
                    <p className='text-sm'>Latest Block</p>
                    <h1 className='text-lg font-semibold'>{blockNumber}</h1>
                </div>
                <div>
                    <p className='text-sm'>Gas Price</p>
                    <h1 className='text-lg font-semibold'>{gasPrice}</h1>
                </div>
            </div>
            <div className='bg-white  text-[#000] text-xs py-2 tracking-wider'>
                Goerli is deprecated so move on to Sepolia.
            </div>
        </div>
    );
}
