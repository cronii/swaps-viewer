'use client'

import { useState, useEffect } from 'react';
import { toEtherscanAddressLink, displayToken } from '../../utils';
import { REMOTE, LOCAL } from '../../../config';

type Wallet = {
  address: string,
};

const WalletsForReview = () => {
  const [walletsData, setWalletsData] = useState([]);

  useEffect(() => {
    fetch(`${REMOTE}/api/wallets-for-review`)
      .then((response) => response.json())
      .then((data) => setWalletsData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <main className="flex min-h-screen flex-col justify-between p-24">
      <table>
        <thead>
          <tr>
            <th className='text-left'>Address</th>
            <th className='text-right'></th>
            <th className='text-right'></th>
            <th className='text-right'></th>
          </tr>
        </thead>
        <tbody>
          {walletsData.map((wallet: Wallet) => {
            const { address } = wallet;

            return (
              <tr key={address}>
                <td>{address}</td>
                <td>{toEtherscanAddressLink(address)}</td>
                <td>Debank</td>
                <td>Cielo</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </main>
  )
}

export default WalletsForReview;