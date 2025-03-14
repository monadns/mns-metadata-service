import { ethers } from 'ethers';
import { UnsupportedNetwork } from '../base';
import {
  NODE_PROVIDER,
  NODE_PROVIDER_URL,
  NODE_PROVIDER_URL_CF,
  NODE_PROVIDER_URL_GOERLI,
} from '../config';

const NODE_PROVIDERS = {
  INFURA    : 'INFURA',
  CLOUDFLARE: 'CLOUDFLARE',
  GOOGLE    : 'GOOGLE',
  GETH      : 'GETH'
};

export const NETWORK = {
  LOCAL  : 'local',
  RINKEBY: 'rinkeby',
  ROPSTEN: 'ropsten',
  GOERLI : 'goerli',
  SEPOLIA : 'sepolia',
  MAINNET: 'mainnet',
  MONAD_TESTNET: 'monad-testnet',
  MONAD: 'monad',
} as const;

export type NetworkName = typeof NETWORK[keyof typeof NETWORK];

function getWeb3URL(
  providerName: string,
  api: string,
  network: NetworkName
): string {
  switch (providerName.toUpperCase()) {
    case NODE_PROVIDERS.INFURA:
      return `${api.replace('https://', `https://${network}.`)}`;
    case NODE_PROVIDERS.CLOUDFLARE:
      return `${api}/${network}`;
    case NODE_PROVIDERS.GOOGLE:
      if (network === NETWORK.MAINNET) return api;
      if (network === NETWORK.GOERLI) return NODE_PROVIDER_URL_GOERLI;
      return `${NODE_PROVIDER_URL_CF}/${network}`;
    case NODE_PROVIDERS.GETH:
      return api;
    default:
      throw Error('');
  }
}

export default function getNetwork(network: NetworkName): {
  WEB3_URL: string;
  SUBGRAPH_URL: string;
  provider: ethers.providers.BaseProvider;
} {

  let SUBGRAPH_URL: any;
  
  switch (network) { 
    case NETWORK.MONAD_TESTNET:
      SUBGRAPH_URL = process.env.GRAPH_API_URL?.toString()
      break;
      case NETWORK.MONAD:
      SUBGRAPH_URL = process.env.GRAPH_API_URL?.toString()
      break;
    default:
      throw new UnsupportedNetwork(`Unknown network '${network}'`, 501);
  }

  const WEB3_URL = getWeb3URL(NODE_PROVIDER, NODE_PROVIDER_URL, network);

  SUBGRAPH_URL = SUBGRAPH_URL + '?source=mns-metadata';

  const provider = new ethers.providers.StaticJsonRpcProvider(WEB3_URL);
  return { WEB3_URL, SUBGRAPH_URL, provider };
}