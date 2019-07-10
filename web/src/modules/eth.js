import Web3 from 'web3'
import ServiceRegistryContract from '../../../backend/build/contracts/ServiceRegistry'
export default {
    state: {
        account: "0x000",
        balance: 0,
        contract: {},
        booted: false,
        loading: false,
        services: [],
        serviceDetail: null,
        serviceDescriptionMethods: [
            {text: "WSDL File", value: "IDL"},
            // {text: "RESTful HTTP", value:"REST"}
        ],
        serviceDescription: {}
    },
    mutations: {
        setContext(state, ctx) {
            state.w3 = ctx;
        },
        setBooted(state, booted) {
            state.booted = booted;
        },
        setBalance(state, balance) {
            state.balance = balance;
        },
        setAccount(state, account) {
            state.account = account;
        },
        setContractInstance(state, instance) {
            state.contract = instance;
        },
        setLoading(state, loading) {
            state.loading = loading
        },
        setServices(state, services) {
            state.services = services;
        },
        setService(state, service){
            state.serviceDetail = service;
        },
        setServiceDescription(state, description) {
            state.serviceDescription = description
        }
    },
    actions: {
        async update({commit}){
            const accounts = await window.web3.eth.getAccounts();
            const account = accounts[0];
            window.web3.eth.defaultAccount = account;
            commit('setAccount', account);
            try {
                const balance = await window.web3.eth.getBalance(account);
                const balanceInEth = window.web3.utils.fromWei(balance, 'ether');
                commit('setBalance', balanceInEth)
            } catch (e) {
                console.log(e)
            }
        },
        async boot({commit}) {
            console.log("booting")
            commit('setBooted', false);
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
            this.dispatch('update');
            this.dispatch('getAllServices')
            window.web3.givenProvider.publicConfigStore.on('update', () => {
                this.dispatch('update')
            })
            const networkId = await window.web3.eth.net.getId();
            window.contract = new window.web3.eth.Contract(ServiceRegistryContract.abi,
              ServiceRegistryContract.networks[networkId].address);
            console.log("finish booting");
            commit('setBooted', true)
        },
        async getAllServices({commit}) {
            console.log("Fetching...")
            commit('setLoading', true)
            if(window.contract) {
                try {
                    let res = await window.contract.methods.getAllServices().call();
                    commit('setServices', res[1]);
                } catch (e) {
                    console.log(e);
                }finally {
                    commit('setLoading', false)
                }
            }

            console.log("Finish Fetching...")
        },
        async addService({commit}, data) {
            commit('setLoading', true)
            try {
                let res = await window.contract.methods.addService(...data).send();
                console.log(res);
            } catch (e) {
                console.log(e);
            } finally {
                commit('setLoading', false)
            }
            // console.log(id);
            // window.location/.href = "/service/"+id;
        },
        async getServiceDetail({commit}, serviceId) {
            commit('setLoading', true)
            commit('setService', null)
            if(!window.contract) return;
            try {
                let res = await window.contract.methods.getServiceDetail(serviceId).call()
                console.log(res);
                let service = {
                    generalInfo: res.generalInfo,
                    additionalInfo: JSON.parse(res.additionalInfo),
                    isOwner: window.web3.eth.defaultAccount === res._owner,
                    allowed: res.allowed,
                }
                if(res.allowed) {
                    this.dispatch('getServiceDescription', serviceId)
                }

                commit('setService', service)
            } catch (e) {
                console.log(e);
            } finally {
                commit('setLoading', false)
            }
        },
        async getServiceDescription({commit}, serviceId) {
            commit('setLoading', true)
            try {
                let desc = await window.contract.methods.getServiceDescription(serviceId).call()
                console.log(desc)
                commit('setServiceDescription', desc);
            } catch (e) {
                console.log(e)
            } finally {
                commit('setLoading', false)
            }

        },
        async payService({commit}, data) {
            commit('setLoading', true)
            console.log(data)
            try {
                let pay = await window.contract.methods.payForService(data[0]).send({value: data[1]})
                window.location.reload()
            } catch (e) {
                console.log(e)
            } finally {
                commit('setLoading', false)
            }
        }
    }
}
