import React from 'react';
import MyLink from "~/components/MyLink";

const NavBar = () => {
    return (
        <nav className="py-4 px-4 border-b-2 mb-20 text-xl">
            <ul className=" container mx-auto flex justify-between">
                <li><MyLink href="/">CrowdCoin</MyLink></li>
                <li className="flex gap-6">
                    <MyLink href="/">Campaigns</MyLink>
                    <MyLink href="/campaigns/add">+</MyLink>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;