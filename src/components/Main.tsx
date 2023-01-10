import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite } from "wagmi";
import { TOKEN_ADDRESS } from "../Constants";
import TokenABI from "../abi/TokenABI.json"
import { useState } from "react";

const Main = () => {

    const {address} = useAccount();

    const [whiteListAddr, setWhiteListAddr] = useState('');
    const [blackListAddr, setBlackListAddr] = useState('');
    
    const ownerData = useContractRead({
        address: TOKEN_ADDRESS,
        abi: TokenABI,
        functionName: "owner",
    });

    const whiteListConfig = usePrepareContractWrite({
        address: TOKEN_ADDRESS,
        abi: TokenABI,
        functionName: "whiteListAddress",
        args: [whiteListAddr],
        overrides: {
            from: address
        }
    });

    const blackListConfig = usePrepareContractWrite({
        address: TOKEN_ADDRESS,
        abi: TokenABI,
        functionName: "blackListAddress",
        args: [blackListAddr],
        overrides: {
            from: address
        }
    });

    const whiteListResult = useContractWrite(whiteListConfig.config);

    const blackListResult = useContractWrite(blackListConfig.config);

    const blackListValid = blackListAddr.trim().length > 0 && !blackListResult.isError && !blackListResult.isLoading;

    const whiteListValid = whiteListAddr.trim().length > 0 && !whiteListResult.isError && !whiteListResult.isLoading;

    return (
        <div className="App">
            <h1>Token Admin</h1>
            <div className="connect-container">
                <ConnectButton accountStatus={"address"}/>
            </div>
            <br />
            <div>
                {
                    ownerData.isLoading ?
                    "Loading..." :
                    ownerData.isError ?
                    "Error" :
                    ownerData.data === address ?
                    <div>
                        <input type="text" placeholder="whitelist address" onChange={(e) => {
                            setWhiteListAddr(e.currentTarget.value);
                        }} />
                        <br />
                        <button 
                            disabled={!whiteListValid}
                            onClick={() => {
                                whiteListResult.write?.();
                            }}>
                            Whitelist
                        </button>
                        <br />
                        <br />
                        <input type="text" placeholder="blacklist address" onChange={(e) => {
                            setBlackListAddr(e.currentTarget.value);
                        }} />
                        <br />
                        <button disabled={!blackListValid}
                                onClick={() => {
                                    blackListResult.write?.();
                                }}>
                            Blacklist
                        </button>
                    </div> :
                    "You are not an owner of this contract"
                }
            </div>
            
        </div>
    );
}

export default Main;