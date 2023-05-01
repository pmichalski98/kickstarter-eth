import React, {type FormEvent, useState} from 'react';
import factory from "~/ethereum/factory";
import web3 from "~/ethereum/web3";
import {router} from "next/client";
import {ClipLoader} from "react-spinners";


const Add = () => {
    const [contribution, setContribution] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    async function handleSubmit(e:FormEvent) {
        e.preventDefault();
        const accounts = await web3.eth.getAccounts();
        try {
            setIsLoading(true);
            setErrorMsg('');
            await factory.methods.createCampaign(contribution).send({
                from: accounts[0],
            });
            setIsLoading(false);
            await router.push('/');
        } catch (e) {
            setIsLoading(false)
            console.log(e.code)
            if (e.code === 'INVALID_ARGUMENT') {
                setErrorMsg('You have to set minimum contribution !')
            }
        }
    }

    return (
        <section className="flex flex-col justify-center items-center">
            <h1 className="text-4xl mb-4">Create a Campaign</h1>
            {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
            <form onSubmit={handleSubmit} className="flex flex-col w-1/2 gap-4">
                <label>Minimum contribution (wei)</label>
                <input className="text-slate-900 pl-4 py-1 rounded"
                       type="number"
                       value={contribution}
                       onChange={(e) => setContribution(e.target.value)}
                />
                {errorMsg && <span className="border-2 p-4 rounded border-slate-500 text-rose-400">{errorMsg}</span>}
                <button className="bg-rose-500 hover:bg-rose-400 rounded px-3 py-1.5 text-2xl text-white" type="submit">
                    {!isLoading ? 'Create' : <ClipLoader color="white"/>}</button>
            </form>
        </section>
    );
};


export default Add;