<template>
  <v-app id="inspire">
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Welcome Back!</v-toolbar-title>
                <v-spacer />
                <router-link to="/signup">
                  <v-icon>mdi-account-plus</v-icon>
                </router-link>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    label="Login"
                    name="login"
                    prepend-icon="mdi-account"
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
                    prepend-icon="mdi-lock"
                    type="password"
                    clearable
                    required
                    :rules="[() => !!formData.password || 'This field is required']"
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn color="primary" @click="signIn">Login</v-btn>
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
import { AxiosResponse } from "axios";

@Component
export default class List extends Vue {
  formData = {
    name: "",
    password: ""
  };
  signIn() {
    if (!this.formData.name || !this.formData.password) {
      return;
    }
    this.$axios
      .post(`${host}/api/user/signin`, this.formData)
      .then((res: AxiosResponse) => {
        if (res.data.statusCode === 1) {
          this.$toasted.error(res.data.msg);
        } else if (res.data.statusCode === 2) {
          this.$router.push({ name: res.data.data });
        }
      });
  }
}
</script>
