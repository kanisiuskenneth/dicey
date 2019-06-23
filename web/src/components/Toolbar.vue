<template>
    <v-toolbar dark color="secondary">
        <v-toolbar-title class="white--text title">Dicey</v-toolbar-title>
        <vue-metamask @onComplete="onComplete"></vue-metamask>
    </v-toolbar>
</template>

<script>
import VueMetamask from 'vue-metamask'
export default {
    name: "Toolbar",
    components: {
        VueMetamask
    },
    methods: {
        onComplete(data){
            console.log('data:', data);
            console.log(data.web3.eth.accounts[0])
        }
    }
}
</script>

<style>
    .title {
        font-size: 2rem;
        color: white;
    }
</style>
