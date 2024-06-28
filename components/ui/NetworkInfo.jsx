import { networks } from '@/constants'
import Link from 'next/link'
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai'
import { spaceAfterCapital } from '@/lib/utils'


async function fetchData(network) {
    try {
        const response = await fetch(`${process.env.DOMAIN_NAME}/api/${network.toLowerCase()}`, { next: { revalidate: 600 } });
        const data = await response.json();
        return {
            blockNumber: data.blockNumber,
            gasPrice: data.gasPrice
        };
    } catch (error) {
        console.error('Error fetching block number and gas fee:', error);
        return {
            blockNumber: 0,
            gasPrice: 0
        };
    }
}


export default async function NetworkInfo({ network }) {
    const { blockNumber, gasPrice } = await fetchData(network);
    const leftNetwork = networks[(networks.indexOf(network) - 1) == -1 ? networks.length - 1 : networks.indexOf(network) - 1];
    const rightNetwork = networks[(networks.indexOf(network) + 1) == networks.length ? 0 : networks.indexOf(network) + 1];

    return (
        <div className='text-white text-center mb-6 sm:w-100 w-96 border-white rounded-lg border-3'>
            <div className='flex bg-blue p-5 items-center justify-between'>
                <Link href={`/${leftNetwork}`}>
                    <AiOutlineArrowLeft className="text-white text-2xl transition duration-300 hover:text-navy" />
                </Link>
                <h1 className='mx-3 font-bold text-xl'>{spaceAfterCapital(network)}</h1>
                <Link href={`/${rightNetwork}`}>
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
    )
}
