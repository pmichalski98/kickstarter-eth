import React from 'react';
import Layout from "~/components/Layout";

const Add = () => {
    return (
        <Layout>
            <h1>Create a Campaign</h1>
            <form>
                <input type="text"/>
                <button type="submit">Create</button>
            </form>
        </Layout>
    );
};

export default Add;