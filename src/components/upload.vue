<template>
  <v-row justify="center">
    <v-dialog v-model="showDialog" persistent max-width="800px">
      <v-card>
        <v-card-title>
          <span class="headline">Upload Files</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-file-input
                chips
                multiple
                show-size
                counter
                loading
                label="Select Files"
                @change="onFileSelected"
              ></v-file-input>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">Close</v-btn>
          <v-btn color="blue darken-1" text @click="upload">Upload</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { host } from "@/config";

@Component
export default class Upload extends Vue {
  fileList!: File[];
  showDialog = false;

  open() {
    this.showDialog = true;
  }

  close() {
    this.showDialog = false;
  }

  onFileSelected(files: File[]) {
    this.fileList = files;
  }

  upload() {
    const formData = new FormData();
    Array.prototype.forEach.call(this.fileList, (file: File) => {
      formData.append("files", file);
    });
    this.$axios
      .post(`${host}/api/file/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then((res) => {
        this.$toasted.success(res.data);
        this.showDialog = false;
        this.close();
        this.$emit("upload-finish");
      });
  }
}
</script>


<style lang="stylus" scoped>
.md-dialog {
  padding: 20px;
}
</style>