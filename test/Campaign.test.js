const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../src/ethereum/build/CampaignFactory.json')
const compiledCampaign = require('../src/ethereum/build/Campaign.json')

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({data: compiledFactory.bytecode})
        .send({from: accounts[0], gas: '1000000'});

    await factory.methods.createCampaign('100').send({
        from: accounts[0],
        gas: '1000000'
    });

    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
    campaign = await new web3.eth.Contract(JSON.parse(compiledCampaign.interface), campaignAddress);
});

describe('Campaigns', () => {
    it('deploys factory and campaign', () => {
        assert.ok(factory.options.address)
        assert.ok(campaign.options.address)
    });
    it('address that created campaign is the manager', async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0], manager);
    })
    it('allows people to contribute to campaign', async () => {
        await campaign.methods.contribute().send({
            from: accounts[1],
            value: '111',
        })
        const isApprover = await campaign.methods.approvers(accounts[1]).call();
        assert(isApprover);
    })
    it('requires a minimum contribution', async () => {
        try {
            await campaign.methods.contribute().send({
                from: accounts[1],
                value: '80',
            })
            assert.fail();
        } catch (err) {
            assert(err)
        }
    })
    it('allows manager to make a request ', async () => {
        await campaign.methods.createRequest('rent an office', '1000000', accounts[2]).send({
                from: accounts[0],
                gas: '1000000'
            }
        )
        const request = await campaign.methods.requests(0).call();
        assert.equal(accounts[2], request.vender);
    })
    it('processes whole request e2e test', async () => {
        await campaign.methods.contribute().send({
            from: accounts[1],
            value: web3.utils.toWei('10', 'ether')
        })
        await campaign.methods.createRequest('rent an office',
            web3.utils.toWei('5', 'ether'), accounts[2]).send({
                from: accounts[0],
                gas: '1000000'
            }
        )
        await campaign.methods.approveRequest(0).send({
            from: accounts[1],
            gas: 1000000,
        })
        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: 1000000,
        })
        const balance = await web3.eth.getBalance(accounts[2]);
        const etherBalance = parseFloat(web3.utils.fromWei(balance,'ether'));
        assert(etherBalance > 104)
    })
})