'use client'

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { displayToken, shortenAddress, toAddressLink, toTxLink } from '../../../utils';
import { REMOTE } from '../../../../config';

type Event = {
  txId: number
  block: string,
  txHash: string,
  eventName: string,
  senderAddress: string,
  makerAddress: string,
  token0In: string,
  token0Out: string,
  token1In: string,
  token1Out: string
};

type Pair = {
  token0Symbol: string,
  token0Decimals: number,
  token1Symbol: string,
  token1Decimals: number
};

const Home = () => {
  // const [nametags, setNametags] = useState({});
  const [pairsData, setPairsData] = useState<Pair>({ token0Symbol: ' ', token0Decimals: 18, token1Symbol: ' ', token1Decimals: 18 });
  const [eventsData, setEventsData] = useState([]);

  const queryParams = useSearchParams();
  const chain = queryParams.get('chain') || 1;
  const pair = queryParams.get('pair')?.toLowerCase() || '';

  useEffect(() => {
    fetch(`${REMOTE}/api/pair?chain=${chain}&pair=${pair}`)
      .then((response) => response.json())
      .then((data) => setPairsData(data))
      .catch((error) => console.error('Error fetching data:', error));

    fetch(`${REMOTE}/api/events?chain=${chain}&pair=${pair}`)
      .then((response) => response.json())
      .then((data) => setEventsData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, [chain, pair]);

  type NameTags = Record<string, string>;

  // @TODO externalize to a table
  const nametags: NameTags = {
    '0x66d0b8f1c539a395fb402cc25ade893b109e187f': 'Banana Bot Router',
    '0xc6265979793435b496e28e61af1500c22c3ba277': 'Banana Gun Bot',
    '0x7a250d5630b4cf539739df2c5dacb4c659f2488d': 'Uniswap V2 Router',
    '0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad': 'Uniswap Universal Router',
    '0x3999d2c5207c06bbc5cf8a6bea52966cabb76d41': 'Unibot',
    '0x00000000003b3cc22af3ae1eac0440bcee416b40': 'MEV Bot',
    '0x92f3f71cef740ed5784874b8c70ff87ecdf33588': '1inch',
    '0x1111111254eeb25477b68fb85ed929f73a960582': '1inch Router',
    '0x6b75d8af000000e20b7a7ddf000ba900b4009a80': 'MEV Bot',
    '0x000000d40b595b94918a28b27d1e2c66f43a51d3': 'MEV Bot',
    '0x429cf888dae41d589d57f6dc685707bec755fe63': 'MEV Bot',
    '0xae2fc483527b8ef99eb5d9b44875f005ba1fae13': 'Jared'
  };

  function parseAddress(address: string) {
    return nametags[address] || shortenAddress(address);
  }

  let prevTxHash: string = '';
  const { token0Symbol, token0Decimals, token1Symbol, token1Decimals } = pairsData;

  return (
    <main className="flex min-h-screen flex-col justify-between p-24 pt-0">
      <div className='flex flex-col'>
        <div>Uniswap V2: {token0Symbol} / {token1Symbol}</div>
        <div>Deployed: Ago</div>
        <div>Unique Wallets</div>
        <div>Performance Link</div>
      </div>
      <div className=''>
        <table className='border-collapse	w-full'>
          <thead>
            <tr className='text-right'>
              <th>Block</th>
              <th>TX Hash</th>
              <th>Contract</th>
              <th>Maker</th>
              <th>Event</th>
              <th>{token0Symbol}</th>
              <th>{token1Symbol}</th>
            </tr>
          </thead>
          <tbody>
            {eventsData.map((event: Event) => {
              const { txId, block, txHash, eventName, senderAddress, makerAddress, token0In, token0Out, token1In, token1Out } = event;
              const isSwap = eventName === 'Swap';
              const isMint = eventName === 'Mint';
              const isBurn = eventName === 'Burn';
              const isBuy = (BigInt(event.token0Out) > 0 && BigInt(event.token1In) > 0);
              const isSameTx = prevTxHash === txHash;
              prevTxHash = txHash;

              return (
                <tr key={txId} className={`text-right ${isSameTx && 'text-red-200'}`}>
                  <td>{block}</td>
                  <td><a href={toTxLink(txHash)} target='_blank'>{shortenAddress(txHash)}</a></td>
                  <td><a href={toAddressLink(senderAddress)} target='_blank'>{parseAddress(senderAddress)}</a></td>
                  <td><a href={toAddressLink(makerAddress)} target='_blank'>{parseAddress(makerAddress)}</a></td>
                  <td>{eventName}</td>
                  {isSwap && isBuy && (<td className='text-green-500'>{displayToken(token0Out, token0Decimals)}</td>)}
                  {isSwap && isBuy && (<td className='text-green-500'>{displayToken(token1In, token1Decimals)}</td>)}
                  {isSwap && !isBuy && (<td className='text-red-500'>{displayToken(token0In, token0Decimals)}</td>)}
                  {isSwap && !isBuy && (<td className='text-red-500'>{displayToken(token1Out, token1Decimals)}</td>)}
                  {isMint && (<td className='text-teal-300'>{displayToken(token0In, token0Decimals)}</td>)}
                  {isMint && (<td className='text-teal-300'>{displayToken(token1In, token1Decimals)}</td>)}
                  {isBurn && (<td className='text-indigo-300'>{displayToken(token0Out, token0Decimals)}</td>)}
                  {isBurn && (<td className='text-indigo-300'>{displayToken(token1Out, token1Decimals)}</td>)}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </main>
  )
}

export default Home;