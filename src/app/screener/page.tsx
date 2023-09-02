'use client'

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { toDefinedLink, toTwitterSearch, toEtherscanContractLink, toEtherscanHolders } from '../../utils';
import { REMOTE } from '../../../config';

type Pair = {
  chainId: number,
  pairAddress: string,
  token0: string,
  token0Symbol: string,
  token1Symbol: string,
  eventCount: number
  buyTax: number,
  sellTax: number
};

const Home = () => {
  const [pairsData, setPairsData] = useState([]);

  useEffect(() => {
    fetch(`${REMOTE}/api/watched-pairs`)
      .then((response) => response.json())
      .then((data) => setPairsData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <main className="flex min-h-screen flex-col justify-between p-24">
      <table>
        <thead>
          <tr>
            <th>Pair</th>
            <th className='text-right'>Events</th>
            <th className='text-right'>Buy / Sell Tax</th>
            <th className='text-right'></th>
            <th className='text-right'></th>
            <th className='text-right'></th>
          </tr>
        </thead>
        <tbody>
          {pairsData.map((pair: Pair) => {
            const { chainId, pairAddress, token0, token0Symbol, token1Symbol, eventCount, buyTax, sellTax } = pair;
            const pairDisplayName = `${token0Symbol} / ${token1Symbol}`;
            const pairLink = `/screener/pair?chain=${chainId}&pair=${pairAddress}`;

            return (
              <tr key={pairAddress}>
                <td><Link href={pairLink}>{pairDisplayName}</Link></td>
                <td className='text-right'>{eventCount}</td>
                <td className='text-right'>{buyTax.toFixed(0)} {sellTax.toFixed(0)}</td>
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