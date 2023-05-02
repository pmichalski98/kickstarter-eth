import React from 'react';
import {useRouter} from "next/router";
import web3 from "~/ethereum/web3";
import Campaign from '~/ethereum/build/Campaign.json'
const Address = () => {
    const router = useRouter();
    const campaignAddress = router.query.address

    const campaign = await new web3.eth.Contract(
        JSON.parse(Campaign.interface), campaignAddress
    );
    return (
        <div>
            <h1>Campaign Details</h1>
            <h2>Campaign balance</h2>
            <p></p>
            <span></span>
        </div>
    );
};

export default Address;