const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

// create build path .../ethereum/build
const buildPath = path.resolve(__dirname, 'build');
// delete build folder to ensure that we always have fresh contracts
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname,'contracts','Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf-8');
// get compiled contracts
const output = solc.compile(source, 1).contracts;
// create build directory
fs.ensureDirSync(buildPath);
// fill build directory with
for( let contract in output) {
    fs.outputJsonSync(
        //create file
        path.resolve(buildPath, contract.replace(':', "") + '.json'),
        //fill content to file
        output[contract]
    );
}