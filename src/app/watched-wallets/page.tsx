'use client'

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

import { truncateAddress, toDefinedLink, toTxLink, toAddressLink, hashToColor, timeAgo, displayAmount } from '../../utils';
import { REMOTE_WS, LOCAL_WS } from '../../../config';

type Pair = {
  swapCount: number,
  uniqueCount: number,
  flipTokens: number,
  pairAddress: string,
  pairName: string,
  tokenBoughtSymbol: string,
  tokenSoldSymbol: string
};

type Swap = {
  timestamp: number,
  block: number,
  txIndex: number,
  logIndex: number,
  maker: string,
  ensName: string,
  amountBought: string,
  amountSold: string,
  tokenBoughtSymbol: string,
  tokenSoldSymbol: string
  txHash: string
};

const WatchedWallets = () => {
  const [recentPairs, setRecentPairs] = useState<Pair[]>([]);
  const [recentSwaps, setRecentSwaps] = useState([]);

  useEffect(() => {
    const client = new W3CWebSocket(REMOTE_WS);

    client.onopen = () => {
      console.log('WebSocket client connected');
    };

    client.onmessage = (message) => {
      const watchedWalletActivity = JSON.parse(message.data.toString());
      console.log('Received:', watchedWalletActivity);
      setRecentPairs(watchedWalletActivity.recentPairs);
      setRecentSwaps(watchedWalletActivity.recentSwaps);
    };


    client.onclose = () => {
      console.log('WebSocket client disconnected');
    };
  }, []);

  let lastTimeAgo: string = '0 min ago';

  return (
    <main className="flex min-h-screen flex-col justify-between p-24">
      <div className='max-h-96 overflow-y-scroll pb-5'>
      <table className='w-full'>
        <thead>
          <tr>
            <th>Pair</th>
            <th className='text-right'>Swaps</th>
            <th className='text-right'>Unique</th>
          </tr>
        </thead>
        <tbody>
          {recentPairs.map((pair: Pair) => {
            const { pairName, pairAddress, swapCount, uniqueCount } = pair;
            // const pairDisplayName = `${token0Symbol} / ${token1Symbol}`;

            return (
              <tr key={pairAddress} className={`text-right`}>
                <td className='text-right'>{pairName}</td>
                <td className='text-right'>{swapCount}</td>
                <td className='text-right'>{uniqueCount}</td>
                <td className='text-right'>{toDefinedLink(pairAddress)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      </div>
      <table>
        <thead>
          <tr>
            <th className='text-right'></th>
            <th className='text-right w-5'>Maker</th>
            <th></th>
            <th></th>
            <th className='pl-5 text-left'>Swap</th>
          </tr>
        </thead>
        <tbody>
          {recentSwaps.map((swap: Swap) => {
            const { timestamp, txHash, txIndex, logIndex,  maker, ensName, amountBought, amountSold, tokenBoughtSymbol, tokenSoldSymbol } = swap;
            let timeAgoString = '';
            if (timeAgo(timestamp) !== lastTimeAgo) {
              timeAgoString = timeAgo(timestamp);
              lastTimeAgo = timeAgoString;
            }

            const makerColor = hashToColor(maker);
            const displayMaker = ensName ? ensName : truncateAddress(maker);

            // @TODO: will need to add chainId + chain icon
            // @TODO: ad and tx icons
            // @TODO: pull ens name
            return (
              <tr key={`${txHash}-${txIndex}-${logIndex}`}>
                <td className='text-right'>{timeAgoString}</td>
                <td className='pl-3 text-right truncate' style={{ color: makerColor, maxWidth: 180 }}>{displayMaker}</td>
                <td className='pl-3'><a href={toAddressLink(maker)} target='_blank'>ad</a></td>
                <td className='pl-3'><a href={toTxLink(txHash)} target='_blank'>tx</a></td>
                <td className='pl-5 text-right'>{displayAmount(amountSold)}</td>
                <td className='text-right'>{tokenSoldSymbol}</td>
                <td className='pl-5 text-left'>{`->`}</td>
                <td className='text-right'>{displayAmount(amountBought)}</td>
                <td className='text-right'>{tokenBoughtSymbol}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </main>
  )
}

export default WatchedWallets;