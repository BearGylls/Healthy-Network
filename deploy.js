const fs = require('fs')
const ethers = require('ethers')
const output = require('./build/inscription')
const so = output.contracts['contracts/inscription.sol:Inscription']

var ipfsClient = require('ipfs-http-client')
// connect to ipfs daemon API server
var ipfs = ipfsClient('localhost', '5001', { protocol: 'http' }) // leaving out the arguments will default to these values

ipfs.addFromFs('/home/ro/Alyra/Final/src', { recursive: true})

async function deployAll() {
 var provider = new ethers.providers.JsonRpcProvider("http://localhost:8545")
 const signer = provider.getSigner(0)
 let factory = new ethers.ContractFactory(so.abi, so.bin,signer)
 let contract = await factory.deploy()
 console.log('En deploiement:',contract.address)
 fs.writeFile("src/data.js", "data="+JSON.stringify(contract), function(err) {
     if (err){
         console.log(err);
     }
 })
await contract.deployed();
console.log("deployé");
await contract.sInscrire("Jean");
let artist = await contract.getPseudo();
console.log(artist)

}
deployAll()
