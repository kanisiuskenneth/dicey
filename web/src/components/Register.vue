<template>
    <v-form @submit.prevent="submit">
        <v-container>
            <v-layout class="row">
                <v-flex xs6 offset-xs2>
                    <h2>General Information</h2>
                    <v-text-field label="Name" placeholder=" "/>
                    <v-text-field label="Category" placeholder=" "></v-text-field>
                    <v-textarea label="Description"/>
                    <v-select :items="type_choices" v-model="type">

                    </v-select>
                </v-flex>
            </v-layout>
            <v-layout class="row">
                <v-flex xs6 offset-xs2>
                <v-btn @click="submit" color="primary" ml0>
                    Submit
                </v-btn>
                </v-flex>
            </v-layout>
        </v-container>

    </v-form>
</template>

<script>
export default {
    name: "Register",
    data: () => ({
      type_choices: ["SOAP", "REST"],
      name: "",
      category: "",
      description: "",
      type: "SOAP"
    }),
    methods: {
        submit: function() {
            console.log("SUBMIT");
        }
    }
}
</script>

<style>

</style>
