import './App.css';

import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {
    Chain,
  configureChains,
  createClient,
  WagmiConfig,
} from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { polygonMumbai } from 'wagmi/chains'
import Main from './components/Main';
import Sale from './components/Sale';


const pm: Chain = {
    id: 80001,
    name: 'polygon',
    network: 'polygonMumbai',
    nativeCurrency: {
      decimals: 18,
      name: 'Polygon',
      symbol: 'MATIC',
    },
    rpcUrls: {
      default: {
        http: ['https://polygon-mumbai.infura.io/v3/f06e8ae6f48f4157a440e8a5316d4e52'],
      },
    },
    blockExplorers: {
      default: { name: 'Mumbai', url: 'https://mumbai.polygonscan.com/' },
    },
    testnet: true,
};



const { chains, provider } = configureChains(
    [pm],
    [publicProvider()]
);

const { connectors } = getDefaultWallets({
    appName: 'xalts',
    chains
});

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider
})

function App() {
    return (
        <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider chains={chains}>
                <Router>
                    <Routes>
                        <Route path={"/"} element={<Main />} />
                        <Route path={"/sale"} element={<Sale />} />
                    </Routes>
                </Router>
            </RainbowKitProvider>
        </WagmiConfig>
    )
}

export default App;
