import Web3 from 'web3'
export default {
    state: {
        w3: {},
        account: "0x000",
        balance: 0,
    },
    mutations: {
        setContext(state, ctx) {
            state.w3 = ctx;
        },
        setBalance(state, balance) {
            state.balance = balance;
        },
        setAccount(state, account) {
            state.account = account;
        }
    },
    actions: {
        async boot({commit}) {
            if (window.ethereum) {
                window.web3 = new Web3(ethereum);
                try {
                    await ethereum.enable();
                } catch (error) {

                }
            }
            else if (window.web3) {
                window.web3 = new Web3(web3.currentProvider);
            }
            else {
                console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
            }
            // window.web3 = new Web3(window.web3.currentProvider)
            const accounts = await window.web3.eth.getAccounts();
            const account = accounts[0];
            commit('setAccount', account);
            try {
                const balance = await window.web3.eth.getBalance(account);
                const balanceInEth = window.web3.utils.fromWei(balance, 'ether');
                commit('setBalance', balanceInEth)
            } catch (e) {
                console.log(e)
            }
        }

    }
}
