<template>
    <v-container>
        <div v-if="service">
            <v-layout class="row">
                <v-flex class="xs8">
                <h1>
                    {{service.generalInfo.name}}
                </h1>
                </v-flex>
                <!-- <v-flex class="xs4" style="text-align:right" v-if="service.isOwner">
                    <v-btn color="secondary">
                        Update
                    </v-btn>
                </v-flex> -->

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
                        <template v-if="!loading">
                        <v-layout row>
                            <v-flex xs2 align="left"> <b>Version</b></v-flex>
                            <v-flex class="xs1">
                                <v-text-field class="number-in" type="number" :max="latestVersion" min="1" step="1" v-model="selectedVersion" @change="changeVersion">

                                </v-text-field>

                            </v-flex>
                        </v-layout>
                            <v-layout row>
                                <v-flex xs2 align="left"> <b>File Name</b></v-flex>
                                <v-flex xs6><a @click="saveFile">{{description.fileName}}</a></v-flex>
                            </v-layout>
                            <v-layout row>
                                <v-flex xs2 align="left"> <b>Timestamp</b></v-flex>
                                <v-flex xs6>{{new Date(description.timestamp * 1000).toLocaleString('id-ID')}}</v-flex>
                            </v-layout>
                        </template>
                        <v-layout row justify-center v-else><v-progress-circular indeterminate/></v-layout>
                    </div>
                    <div v-else>
                        <v-btn color="secondary" @click="pay">Buy Access for {{toEther(service.generalInfo.price)}} ETH</v-btn>
                    </div>
                  </div>
                </v-flex>
            </v-layout>
            <v-layout class="row" v-if="service.isOwner" mt-4>
                <v-flex offset-xs1>
                    <v-layout class="row">
                        <v-flex class="xs6">
                            <h3>Update Service Description</h3>
                            <v-layout class="row">
                                <v-flex xs6>
                                    <v-btn color="secondary" @click="$refs.inputUpload.click()">Upload</v-btn>
                                    <input v-show="false" ref="inputUpload" type="file" @change="uploadFile">
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex>
                            <h3>Delete Service</h3>
                                <v-layout class="row">
                                    <v-btn @click="confirmDelete" color="error" ml0>
                                        Delete
                                    </v-btn>
                                </v-layout>
                        </v-flex>
                    </v-layout>
                    <v-flex xs12 v-if="fileName !== ''">
                        <v-layout class="row">
                            <v-flex class="xs2">
                                <b>File Name</b>
                            </v-flex>
                            <v-flex class="xs8">
                                {{fileName}}
                            </v-flex>
                        </v-layout>
                        <v-layout class="row">
                            <v-flex xs12>
                                <b>File Content:</b>
                            </v-flex>
                        </v-layout>
                        <v-layout class="row">
                            <v-flex class="xs12 pa-2" style="border: 1px solid black; width:100%;max-height: 250px; overflow-y: scroll">
                                {{fileContent}}
                            </v-flex>
                        </v-layout>
                          <v-layout class="row">
                            <v-btn @click="submit" color="primary" ml0>
                                Submit
                            </v-btn>
                        </v-layout>
                    </v-flex>
                </v-flex>
            </v-layout>
            <v-layout v-else-if="!service.isOwner && service.allowed">
                <v-flex class="offset-xs1 mt-4 xs10">
                    <h3>
                        Rating
                    </h3>
                    <div style="border: 1px solid black; padding: 10px; width: 100%;">
                            <v-layout class="row">
                                <v-flex xs2>
                                    <b>Total Rating</b>
                                </v-flex>
                                <v-flex>
                                    {{service.rating}}
                                </v-flex>
                            </v-layout>
                              <v-layout class="row">
                                <v-flex xs2 align-center d-flex>
                                    <b>Your Rate</b>
                                </v-flex>
                                <template v-if="userRate == 0" >
                                <v-flex xs5 >
                                     <v-slider
                                        v-model="rate"
                                        :thumb-size="24"
                                        thumb-label="always"
                                        max=10
                                        min=1
                                        ></v-slider>
                                </v-flex>
                                <v-flex xs3>
                                    <v-btn color="primary" @click="submitRate">
                                        Submit
                                    </v-btn>
                                </v-flex>
                                </template>
                                <template v-else>
                                    <v-flex class="xs5">
                                        {{userRate/100}}
                                    </v-flex>
                                </template>
                            </v-layout>

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
        latestVersion: 0,
        generalInfo: [
            ["Name", "name"],
            ["Owner", "owner"],
            ["Category", "category"],
            ["Description", "description"],
        ],
        versions: [],
        selectedVersion: 0,
        download: "",
        fileName: "",
        fileContent: "",
        rate: 1,
    }),
    computed: {
        ...mapState({
            booted: state => state.eth.booted,
            service: state => state.eth.serviceDetail,
            description: state => state.eth.serviceDescription,
            loading: state => state.eth.loading,
            serviceDescriptionMethods: state => state.eth.serviceDescriptionMethods,
            userRate: state => state.eth.userRate
        })
    },
    methods: {
        ...mapActions({
            fetch: 'getServiceDetail',
            payService: 'payService',
            updateDescription: 'updateDescription',
            getDescription: 'getServiceDescription',
            deleteService: 'deleteService',
            getUserRate: 'getUserRate',
            rateService: 'rateService'
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
        },
        submit:function() {
            this.updateDescription([this.service.generalInfo.id, this.fileName, this.fileContent, this.$router]);
        },
        uploadFile() {
            let file = this.$refs.inputUpload.files[0]
            this.uploaded = true;
            this.fileName = file.name;
            this.fileSize = file.size
            if (file) {
                var reader = new FileReader();
                reader.readAsText(file, "UTF-8");
                reader.onload = (evt) => {
                    this.fileContent = evt.target.result;
                }
                reader.onerror = function (evt) {
                    console.log("error reading file");
                }
            }

        },
        submitRate() {
            this.rateService([this.$route.params.id, this.rate])
        },
        changeVersion: function(val) {
            this.getDescription({serviceId: this.$route.params.id, version: val})
        },
        confirmDelete: function() {
            var res = confirm("Are you sure?")
            if(!res) {
                return;
            } else {
                this.deleteService(this.$route.params.id);
            }
        }

    },
    watch: {
        booted: function() {
            this.fetch(this.$route.params.id)
            this.getUserRate(this.$route.params.id)
        },
        description: function(val) {
            if (this.latestVersion == 0) {
                this.latestVersion = val.version;
                this.selectedVersion = this.latestVersion;
                this.selectVersion += 1;
            }
        }
    },
    mounted: function(){
        this.fetch(this.$route.params.id);
    }
}
</script>

<style>
    .number-in, .number-in * {
        padding:0 !important;
        margin: 0 !important;
    }
</style>
