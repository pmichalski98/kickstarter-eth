import React, {useState} from 'react';
import MyLink from "~/components/MyLink";
import {useRouter} from "next/router";
import {type NextPage} from "next";
import campaign from "~/ethereum/campaign";
import {ClipLoader} from "react-spinners";
import web3 from "~/ethereum/web3";
import ReqTable from "~/components/ReqTable";
import type Contract from "web3-eth-contract";

interface Req {
    description: string,
    vender: string,
    approvalCount: string,
    value: string,
}

interface Props {
    requests: Req[],
    approversCount: string,
}

const Requests: NextPage = ({requests, approversCount}: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter()

    async function handleApprove(index:number) {
        const cam: Contract = campaign(router.query.address);
        const accounts = await web3.eth.getAccounts();
        await cam.methods.approveRequest(index).send({
                from: accounts[0],
            }
        )
        await router.replace(`/campaigns/${router.query.address}/requests`)
    }
    async function handleFinalize() {
    }

    const config = [
        {
            label: 'Id',
            render: (request: Req, index: number) => index + 1
        },
        {
            label: 'Description',
            render: (request: Req) => request.description
        },
        {
            label: 'Vender',
            render: (request: Req) => request.vender.toString().slice(0, 8).concat('...')
        },
        {
            label: 'Approvals',
            render: (request: Req) => request.approvalCount.concat('/').concat(approversCount)
        },
        {
            label: 'Value',
            render: (request: Req) => request.value.concat(' eth')
        },
        {
            label: 'Approve',
            render: (request, index:number) => <button
                onClick={() => handleApprove(index)}
                className="bg-green-500 hover:bg-green-300 rounded px-3 py-1.5 text-xl text-white">
                {!isLoading ? 'Approve' : <ClipLoader color="white"/>}</button>
        },
        {
            label: 'Finalize',
            render: () => <button
                onClick={handleFinalize}
                className="bg-rose-600 hover:bg-rose-400 rounded px-3 py-1.5 text-xl text-white">
                {!isLoading ? 'Finalize' : <ClipLoader color="white"/>}</button>
        },
    ]

    return (
        <section className="flex flex-wrap justify-between">
            <h1 className="text-4xl mb-10 text-rose-300 ">Pending Requests</h1>
            <MyLink
                className=" self-center bg-pink-600 rounded px-3 py-1.5 w-fit text-xl text-slate-200 hover:text-slate-700 hover:bg-rose-400"
                href={`/campaigns/${router.query.address}/requests/new`}>
                Add request
            </MyLink>
            <div
                className=" text-center text-lg grid lg:grid-cols-7 items-center gap-4 mt-10 rounded p-4 bg-slate-500/60 font-bold text-gray-900">
                <ReqTable config={config} data={requests}/>
            </div>
        </section>
    );
};

Requests.getInitialProps = async (ctx) => {
    const cam: Contract = campaign(ctx.query.address);
    const reqCount = await cam.methods.getRequestCount().call();
    const approversCount = await cam.methods.approversCount().call();

    const requests: Req[] = await Promise.all(
        Array(parseInt(reqCount))
            .fill(reqCount)
            .map((element, index) => {
                return cam.methods.requests(index).call();
            })
    )
    return {requests, approversCount, cam};
}
export default Requests;
