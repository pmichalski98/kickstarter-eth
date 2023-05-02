pragma solidity ^0.4.17;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint minimum) public {
        address newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address vender;
        bool isComplete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function Campaign(uint minContribution, address creator) public {
        manager = creator;
        minimumContribution = minContribution;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);

        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(string description, uint value, address vender) public restricted {
        Request memory newReq = Request({
            description: description,
            value: value,
            vender: vender,
            isComplete: false,
            approvalCount: 0
        });

        requests.push(newReq);
    }

    function approveRequest(uint reqIndex) public {
        Request storage foundReq = requests[reqIndex];

        require(approvers[msg.sender]);
        require(!foundReq.approvals[msg.sender]);

        foundReq.approvals[msg.sender] = true;
        foundReq.approvalCount++;
    }

    function finalizeRequest(uint reqIndex) public restricted {
        Request storage foundReq = requests[reqIndex];

        require(!foundReq.isComplete);
        require(foundReq.approvalCount > (approversCount / 2));

        foundReq.vender.transfer(foundReq.value);
        foundReq.isComplete = true;
    }

    function getSummary() public view returns (uint, uint, uint, uint, address){
        return (
            minimumContribution,
            this.balance,
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestCount() public view returns (uint) {
        return requests.length;
    }
}