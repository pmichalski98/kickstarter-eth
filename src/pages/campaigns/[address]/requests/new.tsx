import React, {type FormEvent, useState} from 'react';
import {ClipLoader} from "react-spinners";
import web3 from "~/ethereum/web3";
import campaign from "~/ethereum/campaign";
import {useRouter} from "next/router";

const New = () => {
    const [formValues, setFormValues] = useState({
        description: '',
        amount: '',
        vender: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    async function handleCreateRequest(e: FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        try {
            const accounts = await web3.eth.getAccounts();
            const cam = campaign(router.query.address)
            await cam.methods.createRequest(
                formValues.description,
                web3.utils.toWei(formValues.amount,'ether'),
                formValues.vender
            ).send({from: accounts[0]})

            await router.push(`/campaigns/${router.query.address}/requests`)
        } catch (e) {
            console.error(e)
            setIsLoading(false);
        }
        setIsLoading(false);
        setFormValues({
            description: '',
            amount: '',
            vender: '',
        });
    }

    return (
        <section>
            <h1 className="text-4xl mb-10 text-rose-300">Create a Request</h1>
            <form onSubmit={handleCreateRequest} className="flex flex-col gap-4">
                <label className="text-2xl">Description</label>
                <input
                    className="bg-slate-300 rounded text-slate-900 px-4 text-lg"
                    value={formValues.description}
                    onChange={(e) => setFormValues({...formValues, description: e.target.value})}
                    type="text"
                />
                <label className="text-2xl">Amount (eth)</label>
                <input
                    className="bg-slate-300 rounded text-slate-900 px-4 text-lg"

                    value={formValues.amount}
                    onChange={(e) => setFormValues({...formValues, amount: e.target.value})}
                    type="text"
                />
                <label className="text-2xl">Receipent</label>
                <input
                    className="bg-slate-300 rounded text-slate-900 px-4 text-lg"

                    value={formValues.vender}
                    onChange={(e) => setFormValues({...formValues, vender: e.target.value})}
                    type="text"
                />
                <button className="w-1/3  bg-rose-500 hover:bg-rose-400 rounded px-3 py-1.5 text-2xl text-white"
                        type="submit">
                    {!isLoading ? 'Create' : <ClipLoader color="white"/>}</button>
            </form>
        </section>
    );
};

export default New;