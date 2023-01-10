import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite } from "wagmi";
import { SALE_ADDRESS, TOKEN_ADDRESS } from "../Constants";
import TokenABI from "../abi/TokenABI.json";
import SaleABI from "../abi/TokenSaleABI.json";
import { useState } from "react";
import { BigNumber } from "ethers";

const Sale = () => {

    const {address} = useAccount();

    const [amount, setAmount] = useState('0');

    const tokenData = useContractRead({
        address: TOKEN_ADDRESS,
        abi: TokenABI,
        functionName: "whiteList",
        args: [address]
    });

    const tokenSaleData = useContractRead({
        address: SALE_ADDRESS,
        abi: SaleABI,
        functionName: "rate"
    });

    const finalVal = (purchaseAmountValid(amount) ? BigNumber.from(amount) : BigNumber.from(0)).mul(BigNumber.from(tokenSaleData.data));
    const {config} = usePrepareContractWrite({
        address: SALE_ADDRESS,
        abi: SaleABI,
        functionName: "buyToken",
        args: [amount],
        overrides: {
            from: address,
            value: finalVal
        }
    });

    const buyTokenResult = useContractWrite(config);

    const disabled = tokenData.isLoading || 
                        tokenData.isError ||
                        tokenSaleData.isLoading ||
                        tokenSaleData.isError ||
                        !buyTokenResult.isIdle ||
                        !purchaseAmountValid(amount);

    return (
        <div className="App">
            <h1>Token Sale</h1>
            <div className="connect-container">
                <ConnectButton accountStatus={"address"}/>
            </div>
            <br />
            <div>
                {
                    address ? 
                    <div>
                        {
                            tokenData.isLoading ?
                            "Loading ..." :
                            tokenData.isError ?
                            "Error" :
                            tokenData.data ?
                            <div>
                                Rate: {
                                    tokenSaleData.isLoading ?
                                    "Loading ..." :
                                    tokenSaleData.isError ?
                                    "Error" :
                                    tokenSaleData.data?.toString()
                                }
                                <br />
                                <input type={"number"} step={1} onChange={
                                    (e) => {
                                        (e.currentTarget.value.length > 0) ?
                                        setAmount(e.currentTarget.value) :
                                        setAmount('0')
                                    }}
                                    placeholder={"Amount in lowest units"}
                                />
                                <br />
                                <button 
                                    disabled={disabled}
                                    onClick={() => buyTokenResult.write?.()}>
                                    Purchase
                                </button>
                            </div> :
                            "BlackListed"
                        }
                    </div> : 
                    "Please connect"
                }
            </div>
        </div>
    )
}

const purchaseAmountValid = (amount: string) => {
    try {
        return BigNumber.from(amount).gt(BigNumber.from(0))
    } catch (e) {
        return false;
    }
}

export default Sale;