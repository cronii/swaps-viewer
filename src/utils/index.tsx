import { formatUnits } from 'viem';

export function shortenAddress(address: string) {
  const shortAddress = address.slice(0, 4) + '...' + address.slice(-5)
  return shortAddress
}

export function truncateAddress(address: string, length = 6) {
  if (address.length <= 2 * length) {
    return address;
  }

  const prefix = address.slice(0, length);
  const suffix = address.slice(-length);

  return `${prefix}...${suffix}`;
}

export function displayToken(tokenBalance: string, decimals?: number) {
  const numberString = formatUnits(BigInt(tokenBalance), decimals || 18);

  if (numberString.indexOf('.') > -1 && numberString.indexOf('.') + 5 < numberString.length) {
    return numberString.slice(0, numberString.indexOf('.') + 5);
  }

  return numberString;
}

export function shortenBalance(tokenBalance: string) {
  if (tokenBalance.indexOf('.') > -1 && tokenBalance.indexOf('.') + 5 < tokenBalance.length) {
    return tokenBalance.slice(0, tokenBalance.indexOf('.') + 5);
  }

  return tokenBalance;
}

export function toTxLink(txHash: string) {
  return `https://etherscan.io/tx/${txHash}`;
}

export function toAddressLink(address: string) {
  return `https://etherscan.io/address/${address}`;
}

export function toTwitterSearch(address: string) {
  return <a href={`https://twitter.com/search?q=${address}&src=typed_query&f=live`} target='_blank'>Twitter</a>
}

// @TODO ETH CHAIN HARDCODED
export function toDefinedLink(pairAddress: string) {
  return <a href={`https://defined.fi/eth/${pairAddress}`} target='_blank'>Defined</a>
}

export function toEtherscanAddressLink(address: string) {
  return <a href={`https://etherscan.io/address/${address}`} target='_blank'>Etherscan</a>
}

export function toEtherscanContractLink(address: string) {
  return <a href={`https://etherscan.io/address/${address}#code`} target='_blank'>Contract</a>
}

export function toEtherscanHolders(address: string) {
  return <a href={`https://etherscan.io/token/${address}#balances`} target='_blank'>Holders</a>
}

export function hashToColor(hash: string) {
  const last6Characters = hash.slice(-6);
  const colorCode = `#${last6Characters}`;

  return colorCode;
}

export function timeAgo(timestamp: number) {
  const now = Math.floor(Date.now() / 1000);
  const timeDifference = now - timestamp;
  const minutes = Math.floor(timeDifference / 60);
  const roundedMinutes = Math.floor(minutes / 10) * 10; 
  
  if (roundedMinutes < 60) {
    return `${roundedMinutes} min ago`;
  }
  
  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  }

  const days = Math.floor(hours / 24);

  return `${days} day${days !== 1 ? 's' : ''} ago`;
}

export function displayAmount(amount: string) {
  let amountString = amount;
  if (amount.includes('.') && amount.split('.')[0].length > 3) {
    amountString = amount.split('.')[0];
  }

  const displayString = parseFloat(amountString);
  return displayString.toLocaleString();
}
