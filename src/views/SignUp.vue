<template>
  <v-app id="inspire">
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Hello, Spider Man!</v-toolbar-title>
                <v-spacer />
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    label="Name"
                    name="name"
                    prepend-icon="person"
                    type="text"
                    v-model="formData.name"
                    clearable
                    required
                    :rules="[() => !!formData.name || 'This field is required']"
                  />
                  <v-text-field
                    id="password"
                    label="Password"
                    name="password"
                    v-model="formData.password"
                    prepend-icon="lock"
                    type="password"
                    clearable
                    required
                    :rules="[() => !!formData.password || 'This field is required']"
                  />
                  <v-text-field
                    id="repassword"
                    label="Repassword"
                    name="repassword"
                    v-model="formData.repassword"
                    prepend-icon="lock"
                    type="password"
                    clearable
                    required
                    :rules="[() => !!formData.repassword || 'This field is required']"
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn color="primary" @click="signUp">Sign Up</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { timestampToDate } from "@/utils/timeFormat";
import { host } from "@/config";

@Component
export default class List extends Vue {
  formData = {
    name: "",
    password: "",
    repassword: ""
  };
  signUp() {
    this.$axios.post(`${host}/api/user/signup`, this.formData).then(res => {
      if (res.data.statusCode === 0) {
      } else if (res.data.statusCode === 1) {
        this.$notify({
          title: "tips",
          message: res.data.msg
        });
      } else if (res.data.statusCode === 2) {
        this.$router.push({ name: res.data.data });
      }
    });
  }
}
</script>