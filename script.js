$(document).ready(function () {
    let signer;
    $("#connect").click(async function () {
        signer = await connectWallet();
        console.log(`Connected with ${signer.address}`);
    });
    $("#balance").click(async function () {
        const usdcContract = getUsdcContractInstance(signer);
        const balance = await usdcContract.balanceOf(signer.address);
        const decimals = await usdcContract.decimals();
        const balanceParsed = ethers.formatUnits(balance, decimals);
        console.log(`USDC balance of connected wallet: ${balanceParsed}`);
    });
});

const provider = new ethers.BrowserProvider(window.ethereum);
const usdcAddress = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";

async function connectWallet() {
    if (window.ethereum) {
        await provider.send("eth_requestAccounts", []);
        return provider.getSigner();
    } else {
        console.error("Please Install Metamask!!!");
    }
}

function getUsdcContractInstance(signer) {
    return new ethers.Contract(usdcAddress, usdcABI, signer);
}