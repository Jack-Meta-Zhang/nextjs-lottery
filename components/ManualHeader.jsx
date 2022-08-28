import { useEffect } from "react"
import {useMoralis} from "react-moralis"
export default function ManualHeader(){
    const {enableWeb3,account,isWeb3Enabled,Moralis,deactivateWeb3,isWeb3EnableLoading} = useMoralis()

    useEffect(()=>{
        console.log("Hi")
        console.log(isWeb3Enabled)

        if(typeof window !="undefined"){
            // if(!isWeb3Enabled){
            //     window.localStorage.removeItem("connect")
            // }
            if(window.localStorage.getItem("connect")){
                 enableWeb3()
            }

        }
    },[isWeb3Enabled])

    useEffect(()=>{
        Moralis.onAccountChanged((account)=>{
            console.log(`Account changed to ${account}`)
            if(account == null){
                window.localStorage.removeItem("connect")
                deactivateWeb3()
                console.log("Null account found")
            }
        },[])
    })
    return (<div>
        {account ? (<div>Conneted to {account.substring(0,6)+"..." + account.substring(account.length-4)}</div>) : (<button onClick={async()=>{
            await enableWeb3()
            if(typeof window != "undefined"){
                window.localStorage.setItem("connect","injected")
            }
        }} disabled={isWeb3EnableLoading}>Connect</button>)}
        
    </div>) 
}