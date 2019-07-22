<template>
  <v-container >
          <!--<v-form @submit.prevent="submit">-->
    <v-layout justify-center row>
        <v-flex xs10>
          <form @submit.prevent="submitted">

          <v-text-field
            single-line
            outline
            color="secondary"
            placeholder="Search Service"
            append-icon="search"
            v-model="search"
            @click:append="submitted"
            >
          </v-text-field>
          </form>
        </v-flex>
    </v-layout>
          <!--</v-form>-->
      <v-layout class="row">
          <v-flex class="xs10 offset-xs1">
          <v-data-table
                  v-if="!loading"
                  :headers="headers"
                  :items="services"
                  loading="true"
                  class="elevation-1"
          >
              <template v-slot:items="props">
                <tr>
                  <td>{{ props.item.name }}</td>
                  <td >{{ props.item.category }}</td>
                  <td >{{ props.item.description.substring(0, 140) }} {{props.item.description.length > 140 ? "..." : ""}}</td>
                  <td>{{props.item.price != 0? toEther(props.item.price) + " ETH": "Free"}}</td>
                  <td>{{ props.item.rating }}</td>
                  <td > <router-link :to="`/service/${props.item.id}`">
                  <v-btn icon><v-icon>search</v-icon></v-btn></router-link></td>
                </tr>
              </template>
          </v-data-table>
          <v-layout row v-else>
             <v-progress-linear
              :indeterminate="true"
            ></v-progress-linear>
          </v-layout>
          </v-flex>

      </v-layout>
  </v-container>
</template>

<script>
  import {mapActions, mapState} from "vuex";

  export default {
    name: "Home",
    data: () => ({
        search: "",
        headers: [
          {
            text: 'Name',
            align: 'left',
            sortable: true,
            value: 'name'
          },
          {
            text: 'Category',
            align: 'left',
            sortable: true,
            value: 'category'
          },
          {
            text: 'Description',
            align: 'left',
            sortable: true,
            value: 'description'
          },
          {
            text: 'Price',
            align: 'left',
            sortable: true,
            value: 'price'
          },
          {
            text: 'Rating',
            align: 'left',
            sortable: true,
            value: 'rating'
          },
          {
            text: 'Explore',
            align: 'left',
            value: '__explore__'
          }
        ]
    }),
    computed: {
      ...mapState({
        loading: state => state.eth.loading,
        services: state => state.eth.services,
        booted: state => state.eth.booted,


      })
    },
    watch: {
      booted: function(val) {
        console.log("Booted: " + val);
        if(val) {
          this.fetch()
        }
      }
    },
    methods: {
      ...mapActions({
        fetch: 'getAllServices',
        find: 'findServices'
      }),
      toEther: (val) => {
        return window.web3.utils.fromWei(val+"", "ether");
      },
      submitted() {
        this.find(this.search);
      }
    },
    mounted: function() {
        this.fetch()
    }
  }
</script>

<style>

</style>
