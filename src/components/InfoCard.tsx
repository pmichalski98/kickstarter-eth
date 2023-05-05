import React from 'react';

interface Props {
    value: number,
    description: string,
}
const InfoCard = ({value, description}: Props) => {
    return (
        <div className="border border-rose-400 rounded p-4">
            <h2 className="text-2xl ">{value}</h2>
            <span className="text-xl">{description}</span>
        </div>
    );
};

export default InfoCard;