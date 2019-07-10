<template>
    <v-toolbar dark color="" flat>
        <router-link to="/">
            <v-toolbar-title class="title white--text ">Decentralized Service Registry</v-toolbar-title>
        </router-link>
        <v-spacer></v-spacer>
        <v-toolbar-items>
        <v-btn flat to="/service/new"><v-icon>add</v-icon>Register service</v-btn>

        <v-tooltip bottom>

            <template v-slot:activator="{ on }">

                <v-btn flat>
                      <div>
                        {{Number(balance).toFixed(2)}} ETH
                    </div>
                                &nbsp;&nbsp;&nbsp;

                    <v-icon x-large>account_circle</v-icon>
                </v-btn>
            </template>
            <span>tooltip</span>
        </v-tooltip>


        </v-toolbar-items>
    </v-toolbar>
</template>

<script>
import {mapState} from 'vuex';
export default {
    name: "Toolbar",
    methods: {

    },
    computed: {
      ...mapState({
        balance: state => state.eth.balance,
      })
    }
}
</script>

<style>
    a {
        text-decoration: none!important;
    }
    .title {
        font-size: 2rem;
        text-decoration: none;
    }
</style>
