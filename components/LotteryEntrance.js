import { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants/index"
// import { useNotification } from "web3uikit"
// import { ethers } from "ethers"
export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const [entranceFee, setEntranceFee] = useState("0")
    const [numberOfPlayers, setNumberOfPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")
    console.log(raffleAddress, 233)
    // const dispatch = useNotification()
    const { runContractFunction: enterRaffle } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    })
    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    })
    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })
    async function updateUIValues() {
        const entranceFeeFromCall = (await getEntranceFee()).toString()
        const numPlayersFromCall = (await getNumberOfPlayers()).toString()
        const recentWinnerFromCall = await getRecentWinner()
        setEntranceFee(entranceFeeFromCall)
        setNumberOfPlayers(numPlayersFromCall)
        setRecentWinner(recentWinnerFromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled])
    const handleSuccess = async (tx) => {
        await tx.wait(1)
        updateUIValues()
        handleNewNotification(tx)
    }
    const handleNewNotification = async () => {
        dispatch({
            type: "info",
            message: "",
            title: "",
            position: "",
            icon: "",
        })
    }
    return (
        <div>
            <button
                onClick={async () => {
                    await enterRaffle({
                        onSuccess: handleSuccess,
                    })
                }}
            >
                EnterRaffle
            </button>
            {raffleAddress ? (
                <div>
                    Entrance Fee: {entranceFee}
                    Number Of Players: {numberOfPlayers}
                    RecentWinner:{recentWinner}
                </div>
            ) : (
                <div>No raffle Address</div>
            )}
        </div>
    )
}
