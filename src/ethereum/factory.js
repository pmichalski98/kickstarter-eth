import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";
import {env} from "~/env.mjs";

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface), env.NEXT_PUBLIC_DEPLOYED_AT
);
export default instance;
