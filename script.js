$(document).ready(function () {
    $("#connect").click(async function () {
        const signer = await connectWallet();
        console.log(signer.address);
    });
});

const provider = new ethers.BrowserProvider(window.ethereum);

async function connectWallet() {
    if (window.ethereum) {
        await provider.send("eth_requestAccounts", []);
        return provider.getSigner();
    } else {
        console.error("Please Install Metamask!!!");
    }
}