import React, {type FormEvent, useState} from 'react';
import {useRouter} from "next/router";
import web3 from "~/ethereum/web3";
import Campaign from '~/ethereum/build/Campaign.json'
import factory from "~/ethereum/factory";
import {type NextPage} from "next";
import InfoCard from "~/components/InfoCard";
import {ClipLoader} from "react-spinners";
import MyLink from "~/components/MyLink";
import Link from "next/link";
import campaign from "~/ethereum/campaign"
import Contribute from "~/components/Contribute";

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

const Address: NextPage = ({summary}: Props) => {
    const router = useRouter();
    const campaignAddress = router.query.address as string

    const {0: minContribution, 1: balance, 2: requests, 3: contributors, 4: manager} = summary;


    return (
        <div className="flex flex-col md:flex-row gap-16">
            <section className="self-center grid gap-4 w-2/3 mr-0">
                <h1 className="text-4xl mb-10 text-rose-300 col-span-2">Campaign Details</h1>
                <InfoCard value={Number(web3.utils.fromWei(balance,'ether')).toFixed(3).toString().concat(' eth')} description={"Campaign Balance"}/>
                <InfoCard value={minContribution} description={"Minimum Contribution"}/>
                <InfoCard value={requests} description={"Pending Requests"}/>
                <InfoCard value={contributors} description={"Contributors"}/>
                <Link className="mt-10 hover:text-slate-700 bg-blue-400 rounded px-3 py-1.5 w-fit text-xl text-slate-900"
                      href={`/campaigns/${campaignAddress}/requests`}>View Requests</Link>
            </section>
            <section className="self-center">
                <Contribute/>
            </section>
        </div>
    );
};

Address.getInitialProps = async (ctx) => {
    const cam = campaign(ctx.query.address);
    const summary: Summary = await cam.methods
        .getSummary()
        .call();
    return {summary};
};

export default Address;
