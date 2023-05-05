import React, {useState} from 'react';
import MyLink from "~/components/MyLink";
import {useRouter} from "next/router";
import {type NextPage} from "next";
import campaign from "~/ethereum/campaign";
import {ClipLoader} from "react-spinners";
import web3 from "~/ethereum/web3";
import ReqTable from "~/components/ReqTable";
const Requests:NextPage = ({requests}) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter()

    const config = [
        {
            label: 'Id',
            render: (request, index: number) => index + 1
        },
        {
            label: 'Description',
            render: (request) => request.description
        },
        {
            label: 'Vender',
            render: (request) => request.vender.toString().slice(0,8).concat('...')
        },
        {
            label: 'Approvals',
            render: (request) => request.approvalCount
        },
        {
            label: 'Value',
            render: (request) => request.value.concat(' eth')
        },
        {
            label: 'Approve',
            render: () =>  <button className="bg-green-300 hover:bg-green-400 rounded px-3 py-1.5 text-2xl text-white" type="submit">
                {!isLoading ? 'Approve' : <ClipLoader color="white"/>}</button>
        },
        {
            label: 'Finalize',
            render: () =>  <button className="bg-rose-500 hover:bg-rose-400 rounded px-3 py-1.5 text-2xl text-white" type="submit">
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
            <div className=" text-center text-lg grid lg:grid-cols-7 items-center gap-4 mt-10 rounded p-4 bg-slate-500/60 font-bold text-gray-900">
            <ReqTable config={config} data={requests}/>
            </div>
        </section>
    );
};

Requests.getInitialProps = async (ctx) => {
    const cam = campaign(ctx.query.address);
    const reqCount = await cam.methods.getRequestCount().call();

    const requests = await Promise.all(
        Array(parseInt(reqCount))
            .fill(reqCount)
            .map((element, index) => {
                return cam.methods.requests(index).call();
        })
    )
    console.log(requests)
    return { requests }
}
export default Requests;
