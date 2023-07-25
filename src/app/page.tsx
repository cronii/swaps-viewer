'use client'

import { useState, useEffect } from 'react';
import { displayToken, shortenAddress, toAddressLink, toTxLink } from '../utils';

type Swap = {
  tx_id: number
  block: string,
  tx_hash: string,
  sender_address: string,
  to_address: string,
  token0_in: string,
  token1_in: string,
  token0_out: string,
  token1_out: string
};

type Pair = {
  token0_decimals: number,
  token1_decimals: number
};

const Home = () => {
  // const [nametags, setNametags] = useState({});
  const [pairsData, setPairsData] = useState<Pair>({token0_decimals: 18, token1_decimals: 18});
  const [swapsData, setSwapsData] = useState([]);

  const queryParams = new URLSearchParams(window.location.search);
  const quote = queryParams.get('quote')?.toUpperCase()  || 'MARBLE';
  const base = queryParams.get('base')?.toUpperCase() || 'WETH';
  const pool = queryParams.get('pool')?.toUpperCase() || 'v2';

  useEffect(() => {
    fetch(`http://localhost:5001/api/pairs?quote=${quote}&base=${base}&pool=${pool}`)
      .then((response) => response.json())
      .then((data) => setPairsData(data[0]))
      .catch((error) => console.error('Error fetching data:', error));

    fetch(`http://localhost:5001/api/swaps?quote=${quote}&base=${base}&pool=${pool}`)
      .then((response) => response.json())
      .then((data) => setSwapsData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, [quote, base, pool]);

  type NameTags = Record<string, string>;

  // @TODO externalize to a table
  const nametags: NameTags = {
    '0x66D0b8f1C539a395Fb402CC25adE893b109e187f': 'Banana Bot Sniper',
    '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D': 'Uniswap V2 Router',
    '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD': 'Uniswap Universal Router',
    '0x3999D2c5207C06BBC5cf8A6bEa52966cabB76d41': 'Unibot',
    '0x00000000003b3cc22aF3aE1EAc0440BcEe416B40': 'MEV Bot',
    '0x92F3f71CeF740ED5784874B8C70Ff87ECdF33588': '1inch'
  };

  function parseAddress(address: string) {
    return nametags[address] || shortenAddress(address);
  }

  let prevTxHash: string = '';

  return (
    <main className="flex min-h-screen flex-col justify-between p-24">
      <table>
        <thead>
          <tr className='text-right'>
            <th>Block</th>
            <th>TX Hash</th>
            <th>Caller</th>
            <th>To</th>
            <th>{quote}</th>
            <th>{base}</th>
          </tr>
        </thead>
        <tbody>
          {swapsData.map((swap: Swap) => {
            const { tx_id, block, sender_address, to_address, tx_hash, token0_in, token0_out, token1_in, token1_out } = swap;
            const { token0_decimals, token1_decimals } = pairsData;
            const isBuy = (BigInt(swap.token0_out) > 0 && BigInt(swap.token1_in) > 0);
            const isSameTx = prevTxHash === tx_hash;
            prevTxHash = tx_hash;
            return (
              <tr key={tx_id} className={`text-right ${isSameTx && 'text-red-200'}`}>
                <td>{block}</td>
                <td><a href={toTxLink(tx_hash)} target='_blank'>{shortenAddress(tx_hash)}</a></td>
                <td><a href={toAddressLink(sender_address)} target='_blank'>{parseAddress(sender_address)}</a></td>
                <td><a href={toAddressLink(to_address)} target='_blank'>{parseAddress(to_address)}</a></td>
                {isBuy && (<td className='text-green-500'>{displayToken(token0_out, token0_decimals)}</td>)}
                {isBuy && (<td className='text-green-500'>{displayToken(token1_in, token1_decimals)}</td>)}
                {!isBuy && (<td className='text-red-500'>{displayToken(token0_in, token0_decimals)}</td>)}
                {!isBuy && (<td className='text-red-500'>{displayToken(token1_out, token1_decimals)}</td>)}
              </tr>
            )
          })}
        </tbody>
      </table>
    </main>
  )
}

export default Home;