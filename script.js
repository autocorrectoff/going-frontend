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
    $("#transact").click(async function () {
        const to = $("#to").val();
        let amount = $("#amount").val();
        const usdcContract = getUsdcContractInstance(signer);
        const decimals = await usdcContract.decimals();
        amount = ethers.parseUnits(amount, decimals);
        const tx = await usdcContract.transfer(to, amount);
        const receipt = await tx.wait(1);
        console.log(receipt);
    });
    $("#permit").click(async function () {
        const usdcContract = getUsdcContractInstance(signer);

        // get the network chain id
        const chainId = (await provider.getNetwork()).chainId;

        // set token value and deadline
        let amount = $("#amount").val();
        const decimals = await usdcContract.decimals();
        const value = ethers.parseUnits(amount, decimals);
        const deadline = getTimestampInSeconds() + 4200;

        // get the current nonce for signer
        const nonces = await usdcContract.nonces(signer.address);

        // set the domain parameters
        const domain = {
            name: await usdcContract.name(),
            version: "1",
            chainId: chainId,
            verifyingContract: usdcAddress
        };

        // set the Permit type parameters
        const types = {
            Permit: [{
                name: "owner",
                type: "address"
            },
            {
                name: "spender",
                type: "address"
            },
            {
                name: "value",
                type: "uint256"
            },
            {
                name: "nonce",
                type: "uint256"
            },
            {
                name: "deadline",
                type: "uint256"
            },
            ],
        };

        const to = $("#to").val();

        // set the Permit type values
        const values = {
            owner: signer.address,
            spender: to,
            value: value,
            nonce: nonces,
            deadline: deadline,
        };

        // sign the Permit type data
        const signature = await signer.signTypedData(domain, types, values);

        // split the signature into its components
        const sig = ethers.Signature.from(signature);

        // verify the Permit type data with the signature
        const recovered = ethers.verifyTypedData(
            domain,
            types,
            values,
            sig
        );
        // Should return signer address if signing went ok
        console.log(recovered);

        // this should be called inside Smart Contract
        // there should probably be something like transferWithPermit
        // await usdcContract.permit(
        //     signer.address,
        //     to,
        //     value,
        //     deadline,
        //     sig.v,
        //     sig.r,
        //     sig.s
        // );

    });
});

const provider = new ethers.BrowserProvider(window.ethereum);
const usdcAddress = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";

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

function getTimestampInSeconds() {
    // returns current timestamp in seconds
    return Math.floor(Date.now() / 1000);
}