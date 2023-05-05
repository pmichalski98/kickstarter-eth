import React, {type FormEvent, useState} from 'react';
import web3 from "~/ethereum/web3";
import campaign from "~/ethereum/campaign";
import {useRouter} from "next/router";
import {ClipLoader} from "react-spinners";

const Contribute = () => {
    const [contributeValue, setContributeValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    async function handleContribute(e:FormEvent) {
        e.preventDefault()
        setIsLoading(true);
        try {
            const accounts = await web3.eth.getAccounts();
            const cam = campaign(router.query.address)
            await cam.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(contributeValue, 'ether')
            })
            await router.replace(`/campaigns/${router.query.address}`);
        } catch (e) {
            console.error(e)
            setIsLoading(false);
        }
        setIsLoading(false);
        setContributeValue('');
    }

    return <form onSubmit={handleContribute} className="flex flex-col gap-4">
        <label className="text-3xl ">Contribute to this campaign!</label>
        <div className="flex items-center ">
        <input
            value={contributeValue}
            onChange={(e) => setContributeValue(e.target.value)}
            className="bg-inherit border-b pl-1 pb-1 outline-none border-rose-300 text-lg "
            type="number"/>
            <label className="text-sm">eth</label>
        </div>
        <button
            disabled={isLoading}
            className="min-w-1/2 bg-pink-600 rounded px-3 py-1.5 w-fit text-xl text-slate-200 hover:text-slate-700 hover:bg-rose-400" type="submit">
            { isLoading ? <ClipLoader color="white"/> : 'Contribute'
            }
        </button>
    </form>
};

export default Contribute;