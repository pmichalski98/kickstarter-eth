import React from 'react';

const ReqTable = ({config, data}) => {
    const renderedLabels = config.map((column) => {
        return (
            <h2 className="text-rose-300 text-xl" key={column.label}>{column.label}</h2>
        )
    })
    const renderedRows = data.map((rowData, index) => {
        const renderedCells = config.map((column) => {
            return (
                <div key={column.label} className="text-slate-200 flex justify-center">{column.render(rowData, index)}</div>
            )
        })
        return <div className="contents" key={index}>{renderedCells}</div>
    })
    return (
        <>
            <div className="contents">{renderedLabels}</div>
            {renderedRows}
        </>
    );
};

export default ReqTable;