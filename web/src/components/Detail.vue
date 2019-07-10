<template>
    <v-container>
        <div v-if="service">
            <v-layout class="row">
                <v-flex class="xs8">
                <h1>
                    {{service.generalInfo._name}}
                </h1>
                </v-flex>
                <v-flex class="xs4" style="text-align:right" v-if="service.isOwner">
                    <v-btn color="secondary">
                        Update
                    </v-btn>
                </v-flex>

            </v-layout>
            <v-layout class="row">
                <v-flex class="xs10 offset-xs1">
                <h3>General Information</h3>
                <div style="border: 1px solid black; padding: 10px; width: 100%;">
                    <v-layout mb-2 row v-for="item in generalInfo" :key="item[0]">
                        <v-flex xs2 align="left"> <b>{{item[0]}}</b></v-flex>
                        <v-flex xs9>{{service.generalInfo[item[1]]}}</v-flex>
                    </v-layout>
                </div>
                </v-flex>
            </v-layout>
            <br>
            <v-layout class="row" v-if="service.additionalInfo.length != 0">
                <v-flex class="xs10 offset-xs1">
                <h3>Additional Information</h3>
                <div style="border: 1px solid black; padding: 10px; width: 100%;">
                   <v-layout row v-for="item in service.additionalInfo" :key="item.title">
                        <v-flex xs2 align="left"> <b>{{item.title}}</b></v-flex>
                        <v-flex xs9>
                            <a :href="item.value" v-if="item.type === 'Link'">{{item.value}}</a>
                            <span v-else>{{item.value}}</span>
                        </v-flex>
                    </v-layout>
                </div>
                </v-flex>
            </v-layout>
            <br>
            <v-layout row>
                <v-flex offset-xs1 xs10>
                <h3>Service Description</h3>
                  <div style="border: 1px solid black; padding: 10px; width: 100%;">
                    <div v-if="service.allowed">
                        <v-layout row>
                        <v-flex xs2 align="left"> <b>File Name</b></v-flex>
                        <v-flex xs6><a @click="saveFile">{{description.fileName}}</a></v-flex>
                        </v-layout>
                        <v-layout row>
                        <v-flex xs2 align="left"> <b>Timestamp</b></v-flex>
                        <v-flex xs6>{{new Date(description.timestamp * 1000).toLocaleString('id-ID')}}</v-flex>
                        </v-layout>
                    </div>
                    <div v-else>
                        <v-btn color="secondary" @click="pay">Buy Access for {{toEther(service.generalInfo.price)}} ETH</v-btn>
                    </div>
                  </div>
                </v-flex>
            </v-layout>

        </div>
        <div v-else>
            <v-layout row justify-center><v-progress-circular indeterminate/></v-layout>
        </div>

    </v-container>
</template>

<script>
import {mapState, mapActions} from 'vuex'
export default {
    data: () =>({
        id: 0,
        generalInfo: [
            ["Name", "name"],
            ["Owner", "owner"],
            ["Category", "category"],
            ["Description", "description"],

        ],
        download: ""
    }),
    computed: {
        ...mapState({
            booted: state => state.eth.booted,
            service: state => state.eth.serviceDetail,
            description: state => state.eth.serviceDescription
        })
    },
    methods: {
        ...mapActions({
            fetch: 'getServiceDetail',
            payService: 'payService'
        }),
        saveFile: function() {
            const data = this.description.fileContent;
            const blob = new Blob([data], {type: 'text/plain'})
            const e = document.createEvent('MouseEvents'),
            a = document.createElement('a');
            a.download = this.description.fileName;
            a.href = window.URL.createObjectURL(blob);
            a.target ="_blank";
            a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':');
            e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            a.dispatchEvent(e);
        },
        toEther: (val) => {
            return window.web3.utils.fromWei(val+"", "ether");
        },
        pay: function(){
            this.payService([this.service.generalInfo.id, this.service.generalInfo.price])
        }

    },
    watch: {
        booted: function() {
            this.fetch(this.$route.params.id)
        }
    },
    mounted: function(){
        this.fetch(this.$route.params.id);
    }
}
</script>

<style>

</style>
