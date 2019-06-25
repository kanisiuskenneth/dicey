<template>
  <v-container d-flex align-center>
          <v-form @submit.prevent="submit">
    <v-layout justify-center row>
        <v-flex xs8>
          <v-text-field
            single-line
            outline
            color="secondary"
            placeholder="Search Service"
            append-outer-icon="search"
            v-model="param"
            >
          </v-text-field>
        </v-flex>
    </v-layout>
          </v-form>

  </v-container>
</template>

<script>
  export default {
    name: "Home",
    data: () => ({
      param: "",
    }),
    methods: {
      submit: function() {
        this.$router.push("/search?"+this.param);
      }
    }
  }
</script>

<style>

</style>
