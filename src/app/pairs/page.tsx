'use client'

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { displayToken, shortenAddress, toAddressLink, toTxLink } from '../../utils';

type Pair = {
  chainId: number,
  pairAddress: string,
  token0Symbol: string,
  token1Symbol: string,
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
          </tr>
        </thead>
        <tbody>
          {pairsData.map((pair: Pair) => {
            const { chainId, pairAddress, token0Symbol, token1Symbol } = pair;
            const pairDisplayName = `${token0Symbol} / ${token1Symbol}`;
            const pairLink = `/pair?chain=${chainId}&pair=${pairAddress}`;

            return (
              <tr key={pairAddress}>
                <td><Link href={pairLink}>{pairDisplayName}</Link></td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </main>
  )
}

export default Home;