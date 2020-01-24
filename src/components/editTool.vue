<template>
  <div class="text-center ma-2">
    <v-snackbar top :timeout="timeout" v-model="snackbar">
      {{ count }} {{count > 1 ?`files`:'file'}} selected!
      <v-btn color="pink" text @click="deleteFile">Delete</v-btn>
      <v-btn color="pink" text @click="cancel">Cancel</v-btn>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { host } from "@/config";

@Component
export default class Upload extends Vue {
  @Prop() count!: number;
  snackbar = false;
  timeout = 0;

  open() {
    this.snackbar = true;
  }

  close() {
    this.snackbar = false;
  }

  cancel() {
    this.snackbar = false;
    this.$emit("cancel");
  }

  deleteFile() {
    this.$emit("delete");
  }
}
</script>


<style lang="stylus" scoped></style>