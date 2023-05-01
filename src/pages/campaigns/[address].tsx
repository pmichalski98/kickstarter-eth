import React from 'react';
import {useRouter} from "next/router";

const Address = () => {
    const router = useRouter();
    return (
        <div>
            {router.query.address}
        </div>
    );
};

export default Address;