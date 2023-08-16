'use client'

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { displayToken, shortenAddress, toAddressLink, toTxLink } from '../../utils';

type Pair = {
  address: string,
  token0: string,
  token1: string,
  startBlock: number,
  lastBlock: number,
};

const Home = () => {
  const [pairsData, setPairsData] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5001/api/pairs`)
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
            <th className='text-right'>Deploy Block</th>
            <th className='text-right'>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {pairsData.map((pair: Pair) => {
            const { address, token0, token1, startBlock, lastBlock } = pair;
            const pairDisplayName = `${token0} / ${token1}`;
            const pairLink = `/pair?quote=${token0}&base=${token1}&pool=V2`;

            return (
              <tr key={address}>
                <td><Link href={pairLink}>{pairDisplayName}</Link></td>
                <td className='text-right'>{startBlock}</td>
                <td className='text-right'>{lastBlock}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </main>
  )
}

export default Home;