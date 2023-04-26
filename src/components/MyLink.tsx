import React, {type ReactNode} from 'react';
import Link from "next/link";
interface Props {
    href: string,
    children: ReactNode
    className:string,
}
const MyLink = (props:Props) => {
    const classes = `tranisition hover:text-slate-400 ${props.className}`;
    return (
        <Link href={props.href} className={classes}>{props.children}</Link>
    );
};

export default MyLink;