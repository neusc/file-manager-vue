<template>
  <md-dialog :md-active.sync="showDialog" @md-closed="onDialogClosed">
    <md-dialog-title>Please select your files to upload~</md-dialog-title>
    <md-field>
      <label>Upload Files</label>
      <md-file name="files" multiple @md-change="onFileSelected" />
    </md-field>
    <md-dialog-actions>
      <md-button class="md-primary" @click="upload">Upload</md-button>
      <md-button class="md-primary" @click="showDialog = false">Close</md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { host } from "@/config";

@Component
export default class Upload extends Vue {
  fileList!: File[];
  showDialog = false;

  mounted() {
    this.showDialog = true;
  }

  onDialogClosed() {
    this.$emit("close");
  }

  onFileSelected(files: File[]) {
    this.fileList = files;
  }

  upload() {
    let formData = new FormData();
    Array.prototype.forEach.call(this.fileList, (file: File) => {
      formData.append("files", file);
    });
    this.$axios
      .post(`${host}/api/file/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then(res => {
        this.showDialog = false
        this.$emit("close");
        this.$emit('upload-finish')
      });
  }
}
</script>


<style lang="stylus" scoped>
.md-dialog {
  padding: 20px;
}
</style>