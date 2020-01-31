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
                <router-link to="/signin">
                  <v-icon>mdi-login</v-icon>
                </router-link>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    label="Name"
                    name="name"
                    prepend-icon="mdi-account"
                    type="text"
                    v-model="formData.name"
                    clearable
                    required
                    :rules="[rules.required, rules.validName, rules.min(3), rules.max(8)]"
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
                    :rules="[rules.required, rules.min(6)]"
                  />
                  <v-text-field
                    id="repassword"
                    label="Repassword"
                    name="repassword"
                    v-model="formData.repassword"
                    prepend-icon="mdi-lock"
                    type="password"
                    clearable
                    required
                    :rules="[rules.required, rules.equal(formData.password)]"
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
import { AxiosResponse } from "axios";

interface FormData {
  name: string;
  password: string;
  repassword: string;
}

@Component
export default class List extends Vue {
  formData: FormData = {
    name: "",
    password: "",
    repassword: ""
  };
  rules = {
    required: (value: string) => !!value.trim() || "Required.",
    min: (n: number) => (v: string) =>
      v.trim().length >= n || `Min ${n} characters`,
    max: (n: number) => (v: string) =>
      v.trim().length <= n || `Max ${n} characters`,
    equal: (value: string) => (v: string) =>
      v === value || `not equal to password`,
    validName: (value: string) =>
      /^[A-Za-z0-9_]+$/.test(value) ||
      "only use letters、 numbers and underline"
  };
  signUp() {
    if (!this.validate(this.formData)) {
      return;
    }
    this.$axios
      .post(`${host}/api/user/signup`, this.formData)
      .then((res: AxiosResponse) => {
        if (res.data.statusCode === 1) {
          this.$toasted.error(res.data.msg);
        } else if (res.data.statusCode === 2) {
          this.$router.push({ name: res.data.data });
        }
      });
  }
  validate(form: FormData) {
    const { name, password, repassword } = form;
    if (!/^[A-Za-z0-9_]{3,8}$/.test(name)) {
      return false;
    } else if (
      password.trim() === "" ||
      password.length < 6 ||
      password !== repassword
    ) {
      return false;
    }
    return true;
  }
}
</script>