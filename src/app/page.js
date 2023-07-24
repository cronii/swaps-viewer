'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react';

function shortenAddress(address) {
  const shortAddress = address.slice(0, 4) + '...' + address.slice(-5)
  return shortAddress
}

const Home = () => {
  const [nametags, setNametags] = useState({});
  const [swapsData, setSwapsData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5001/api/data')
      .then((response) => response.json())
      .then((data) => setSwapsData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  function parseAddress(address) {
    return nametags[address] || shortenAddress(address);
  }

  return (
    <main className="flex min-h-screen flex-col justify-between p-24">
      {swapsData.map((item) => (
        <div className="flex p-1" key={item.id}>
          <div classname='pr-1'>{parseAddress(item.sender_address)}</div>
          <div classname='pr-1'>{parseAddress(item.to_address)}</div>
        </div>
      ))}
    </main>
  )
}

export default Home;