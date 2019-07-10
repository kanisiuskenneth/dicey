<template>
    <v-form @submit.prevent="submit">
        <v-container>
            <v-layout class="row">
                <v-flex xs6 offset-xs1>
                    <h2>General Information</h2>
                    <v-text-field label="Name" placeholder=" " v-model="name"/>
                    <v-text-field label="Category" placeholder="Map, Weather, Calculate" v-model="category"></v-text-field>
                    <v-textarea label="Description" v-model="description" placeholder=" " rows="1" auto-grow=""> </v-textarea>
                    <!-- <v-text-field v-model="type" label="Service Type" placeholder="[SOAP, REST, JSON RPC, GRPC]"></v-text-field> -->
                </v-flex>
            </v-layout>
            <v-layout class="row">
                <v-flex offset-xs1>
                    <h2>Additional Information <v-btn icon @click="addAdditionalInfo"><v-icon color="green">add</v-icon></v-btn></h2>
                    <v-layout class="row" v-for="(info, idx) in additionalInfo" :key="`info-${idx}`">
                        <v-flex xs3 pa-1>
                            <v-text-field label="Title" placeholder=" " v-model="info.title"></v-text-field>
                        </v-flex>
                        <v-flex class="xs1" pa-1>
                            <v-select :items="infoTypes" label="Type" value="Text" v-model="info.type"></v-select>
                        </v-flex>
                        <v-flex class="xs7" pa-1>
                            <v-text-field label="Value" placeholder=" " v-model="info.value"></v-text-field>
                        </v-flex>
                        <v-flex class="xs1">
                            <v-btn icon  style="margin-top: 15px;" @click="deleteAdditionalInfo(idx)"><v-icon color="red">cancel</v-icon></v-btn>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
            <v-layout class="row">
                <v-flex offset-xs1>
                    <h2>Service Description</h2>
                    <v-layout class="ro">
                        <v-flex xs2>
                            <v-text-field v-model="price" label="Price" type="number" step="0.01"></v-text-field>
                        </v-flex>
                        <v-flex class="xs1 d-flex align-center">
                            ETH
                        </v-flex>
                    </v-layout>
                    <v-layout class="row">
                        <v-flex xs3>
                        <v-select v-model="method" label="Method" :items="serviceDescriptionMethods" items-text="text" item-value="value"></v-select>
                        </v-flex>
                        <v-flex xs6 v-if="method === 'IDL'">
                            <v-btn color="secondary" @click="$refs.inputUpload.click()">Upload</v-btn>
                            <input v-show="false" ref="inputUpload" type="file" @change="uploadFile">
                        </v-flex>
                    </v-layout>
                    <v-flex xs12 v-if="method === 'IDL' && fileName !== ''">
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
                    </v-flex>
                </v-flex>
            </v-layout>
            <v-layout class="row">
                <v-flex xs6 offset-xs1>
                <v-btn @click="submit" color="primary" ml0>
                    Submit
                </v-btn>
                </v-flex>
            </v-layout>
        </v-container>

    </v-form>
</template>

<script>
import {mapActions, mapState} from "vuex";

export default {
    name: "Register",
    computed: {
        ...mapState({
            serviceDescriptionMethods: state => state.eth.serviceDescriptionMethods,
        })
    },
    data: () => ({
      name: "",
      category: "",
      description: "",
      type: "",
      price: 0,
      method: "IDL",
      infoTypes: ['Text', 'Link'],
      uploaded: false,
      fileName: "",
      fileSize: "",
      fileContent: "",
      additionalInfo: [],

    }),

    methods: {
        ...mapActions({
          addService: 'addService',
        }),
        submit: function() {
            let data = [this.name, this.category, this.description, web3.utils.toWei(""+this.price), JSON.stringify(this.additionalInfo), this.fileName, this.fileContent];
            // console.log(...data)
            this.addService(data)
        },
        addAdditionalInfo: function(){
            this.additionalInfo.push({type: this.infoTypes[0]})
        },
        deleteAdditionalInfo: function(idx) {
            this.additionalInfo.splice(idx,1);
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
    }
}
</script>

<style>

</style>
