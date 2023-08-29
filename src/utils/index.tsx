import { formatUnits } from 'viem';

export function shortenAddress(address: string) {
  const shortAddress = address.slice(0, 4) + '...' + address.slice(-5)
  return shortAddress
}

export function displayToken(tokenBalance: string, decimals?: number) {
  const numberString = formatUnits(BigInt(tokenBalance), decimals || 18);

  if (numberString.indexOf('.') > -1 && numberString.indexOf('.') + 5 < numberString.length) {
    return numberString.slice(0, numberString.indexOf('.') + 5);
  }

  return numberString;
}

export function toTxLink(txHash: string) {
  return `https://etherscan.io/tx/${txHash}`;
}

export function toAddressLink(address: string) {
  return `https://etherscan.io/address/${address}`;
}

export function generateTwitterSearch(address: string) {
  return `https://twitter.com/search?q=${address}&src=typed_query&f=live`;
}

// @TODO ETH CHAIN HARDCODED
export function toDefinedLink(pairAddress: string) {
  return <a href={`https://defined.fi/eth/${pairAddress}`} target='_blank'>{shortenAddress(pairAddress)}</a>
}