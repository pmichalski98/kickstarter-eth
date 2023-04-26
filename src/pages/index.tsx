import { type NextPage } from "next";
import Head from "next/head";
import factory from "../ethereum/factory";
import Link from "next/link";
import Layout from "~/components/Layout";
interface HomeProps {
  campaigns: string[];
}
const Home: NextPage = ({ campaigns }: HomeProps) => {
  return (
    <Layout>
      <h1>Open campaigns</h1>
      <div className="flex gap-10">
        {campaigns.map((address) => (
          <div
            key={address}
            className="flex flex-1 flex-col gap-2 rounded border-2  p-4"
          >
            <h1 className="font-bold">{address}</h1>
            <Link
              className="w-fit rounded p-1 text-blue-400 outline-1 transition hover:text-rose-300 hover:shadow "
              href="/campaign"
            >
              View Campaign
            </Link>
          </div>
        ))}
        <button className="self-center rounded bg-rose-500 px-3 py-1.5 text-lg text-slate-100">
          Create Campaign
        </button>
      </div>
    </Layout>
  );
};

Home.getInitialProps = async (ctx) => {
  const campaigns: string[] = await factory.methods
    .getDeployedCampaigns()
    .call();
  return { campaigns };
};

export default Home;