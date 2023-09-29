'use client'

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

import { toDefinedLink, toTwitterSearch, toEtherscanContractLink, toEtherscanHolders, displayToken } from '../../utils';
import { REMOTE_WS } from '../../../config';

type Pair = {
  chainId: number,
  pairAddress: string,
  token0: string,
  token0Symbol: string,
  token1Symbol: string,
  token1Decimals: number,
  eventCount: number
  buyTax: number,
  sellTax: number,
  baseReserves: string,
};

const Home = () => {
  const [pairsData, setPairsData] = useState([]);

  useEffect(() => {
    // fetch(`${REMOTE}/api/watched-pairs`)
    //   .then((response) => response.json())
    //   .then((data) => setPairsData(data))
    //   .catch((error) => console.error('Error fetching data:', error));

    const client = new W3CWebSocket(REMOTE_WS);

    client.onopen = () => {
      console.log('WebSocket client connected');
    };

    client.onmessage = (message) => {
      const watchedPairs = JSON.parse(message.data);
      console.log('Received:', watchedPairs);
      setPairsData(watchedPairs.data);
      // setMessages((prevMessages) => [...prevMessages, message.data]);
    };

    client.onclose = () => {
      console.log('WebSocket client disconnected');
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col justify-between p-24">
      <table>
        <thead>
          <tr>
            <th>Pair</th>
            <th className='text-right'>Events</th>
            <th className='text-right'>Liquidity</th>
            <th className='text-right'></th>
            <th className='text-right'></th>
            <th className='text-right'></th>
          </tr>
        </thead>
        <tbody>
          {pairsData.map((pair: Pair) => {
            const { chainId, pairAddress, token0, token0Symbol, token1Symbol, token1Decimals, eventCount, baseReserves } = pair;
            const pairDisplayName = `${token0Symbol} / ${token1Symbol}`;
            const pairLink = `/screener/pair?chain=${chainId}&pair=${pairAddress}`;

            // check if reserves are lower than 0.01 ETH
            const isRugpulled = BigInt(baseReserves) < 10000000000000000;

            return (
              <tr key={pairAddress} className={`text-right ${isRugpulled && 'text-gray-700'}`}>
                <td className='max-w-xs truncate'><Link href={pairLink}>{pairDisplayName}</Link></td>
                <td className='text-right'>{eventCount}</td>
                <td className='text-right'>{displayToken(baseReserves, token1Decimals)}</td>
                <td className='text-right'>{toEtherscanContractLink(token0)}</td>
                <td className='text-right'>{toEtherscanHolders(token0)}</td>
                <td className='text-right'>{toDefinedLink(pairAddress)}</td>
                <td className='text-right'>{toTwitterSearch(token0)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </main>
  )
}

export default Home;