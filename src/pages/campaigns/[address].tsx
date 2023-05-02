import React from 'react';
import {useRouter} from "next/router";
import web3 from "~/ethereum/web3";
import Campaign from '~/ethereum/build/Campaign.json'
import factory from "~/ethereum/factory";
import {type NextPage} from "next";
import InfoCard from "~/components/InfoCard";
import {ClipLoader} from "react-spinners";
import MyLink from "~/components/MyLink";
import Link from "next/link";

type Summary = {
    0: number,
        1: number,
        2: number,
        3: number,
        4: string,
}
interface Props {
    summary: Summary
}
const Address: NextPage = ({summary}: Props ) => {
    const router = useRouter();
    const campaignAddress = router.query.address as string

    const {0: minContribution, 1: balance, 2: requests, 3: contributors, 4: manager} = summary;
    return (
        <section className="w-11/12 mx-auto">
            <div className="container lg:w-2/3 gap-4 grid ">
                <h1 className="text-4xl mb-10 text-rose-300 col-span-2">Campaign Details</h1>
                <InfoCard value={balance} description={"Campaign Balance"}/>
                <InfoCard value={minContribution} description={"Minimum Contribution"}/>
                <InfoCard value={requests} description={"Pending Requests"}/>
                <InfoCard value={contributors} description={"Contributors"}/>
                <Link className="hover:text-slate-700 bg-blue-400 rounded px-3 py-1.5 w-fit text-xl text-slate-900" href={`/campaigns/${campaignAddress}/requests`}>View Requests</Link>
            </div>
        </section>
    );
};

Address.getInitialProps = async (ctx) => {
    const campaign = await new web3.eth.Contract(
        JSON.parse(Campaign.interface), ctx.query.address
    );
    const summary: string[] = await campaign.methods
        .getSummary()
        .call();
    return {summary};
};

export default Address;
