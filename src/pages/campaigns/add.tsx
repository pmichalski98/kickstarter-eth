import React, {type FormEvent, useState} from 'react';
import factory from "~/ethereum/factory";
import web3 from "~/ethereum/web3";


const Add = () => {
    const [contribution, setContribution] = useState(0);

    console.log(web3.eth);
    async function handleSubmit(e:FormEvent) {
        e.preventDefault();
        const accounts = await web3.eth.getAccounts();
        await factory.methods.createCampaign(contribution.toString()).send({
            from: accounts[0],
            gas: '1000000',
        });
    }
    return (
        <>
            <h1 className="text-3xl mb-4">Create a Campaign</h1>
            <form onSubmit={handleSubmit} className="flex flex-col ml-10 w-fit gap-4">
                <label>Minimum contribution (wei)</label>
                <input className="text-slate-900 pl-4 py-1 rounded"
                       type="number"
                       value={contribution}
                       onChange={(e) => setContribution(Number(e.target.value))}
                />
                <button className="bg-rose-500 hover:bg-rose-400 rounded px-3 py-1.5 text-xl text-white " type="submit">Create</button>
            </form>
        </>
    );
};


export default Add;