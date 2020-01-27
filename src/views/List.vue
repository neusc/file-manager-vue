<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list dense>
        <v-list-item link @click="logOut">
          <v-list-item-action>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Log Out</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Application</v-toolbar-title>
      <v-spacer />
      <div class="username">{{username}}</div>
      <v-speed-dial
        v-model="fab"
        direction="bottom"
        :open-on-hover="hover"
        :transition="transition"
      >
        <template v-slot:activator>
          <v-btn v-model="fab" color="blue darken-2" dark fab>
            <v-icon v-if="fab">mdi-close</v-icon>
            <v-icon v-else>mdi-file</v-icon>
          </v-btn>
        </template>
        <v-btn fab dark small color="indigo" @click="openUpload">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-btn fab dark small color="red" @click="openEditTool">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-speed-dial>
    </v-app-bar>

    <v-content>
      <v-container class="fill-height" fluid>
        <v-card>
          <v-card-title>
            File Manager
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-file-find"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table
            loading
            loading-text="Loading... Please wait"
            class="elevation-1"
            item-key="name"
            :headers="headers"
            :items="fileList"
            :items-per-page="10"
            :show-select="showSelect"
            :single-select="singleSelect"
            :search="search"
            v-model="selectedFiles"
            @input="onSelected"
          >
            <template v-slot:item.size="{ item }">{{ item.size | formatSize }}</template>
            <template v-slot:item.modTime="{ item }">{{ item.modTime | formatTime }}</template>
          </v-data-table>
        </v-card>
      </v-container>
    </v-content>
    <v-footer app>
      <span>&copy; 2019</span>
    </v-footer>
    <Upload ref="upload" @upload-finish="onUploadFinished" />
    <EditTool ref="tool" :count="selectedFiles.length" @delete="onDelete" @cancel="onSelectCancel" />
  </v-app>
</template>

<script lang="ts">
// @ts-ignore
import { Vue, Component, Prop, Ref } from "vue-property-decorator";
import Upload from "@/components/upload.vue";
import EditTool from "@/components/editTool.vue";
import { timestampToDate } from "@/utils/timeFormat";
import { host } from "@/config";
import { AxiosResponse } from "axios";

interface CustomFile {
  name: string;
  path: string;
  size: number;
  modTime: number;
}

@Component({
  filters: {
    formatTime(time: number): string {
      return timestampToDate(time);
    },
    formatSize(size: number): string {
      const kSize = size / 1000;
      let mSize = "";
      if (kSize > 1000) {
        mSize = (kSize / 1000).toFixed(1);
        return `${mSize}M`;
      } else {
        return `${kSize.toFixed(1)}K`;
      }
    }
  },
  components: {
    Upload,
    EditTool
  }
})
export default class List extends Vue {
  @Prop() source!: string;
  @Ref() upload!: Upload;
  @Ref() tool!: EditTool;
  username = (Object.values(this.$global.getUser()) as any[])[0].name;
  headers = [
    {
      text: "Name",
      align: "left",
      sortable: false,
      value: "name"
    },
    { text: "Size", value: "size" },
    { text: "Modified Time", value: "modTime" }
  ];
  search = "";
  fileList: CustomFile[] = [];
  selectedFiles: CustomFile[] = [];
  showSelect = false;
  showUpload = false;
  drawer = null;
  singleSelect = false;

  direction = "top";
  hover = true;
  transition = "slide-y-reverse-transition";
  fab = false;

  mounted() {
    this.getFileList();
  }

  onSelected(items: CustomFile[]) {
    this.selectedFiles = items;
  }

  onSelectCancel() {
    this.showSelect = false;
    this.selectedFiles = [];
  }

  openUpload() {
    this.upload.open();
  }

  openEditTool() {
    this.showSelect = true;
    this.tool.open();
  }

  onUploadFinished() {
    this.getFileList();
  }

  getFileList() {
    this.$axios.post(`${host}/api/file/list`).then((res: AxiosResponse) => {
      if (res.data.statusCode === 0) {
        this.fileList = res.data.data;
      } else if (res.data.statusCode === 1) {
        this.$toasted.error(res.data.msg);
      } else if (res.data.statusCode === 2) {
        this.$router.push({ name: res.data.data });
      }
    });
  }

  onDelete() {
    const names = this.selectedFiles.map((file: CustomFile) => file.name);
    this.$axios
      .post(`${host}/api/file/delete`, { names })
      .then((res: AxiosResponse) => {
        if (res.data.statusCode === 0) {
          this.$toasted.success(
            `${names.length +
              " " +
              (names.length > 1 ? "files" : "file")} delete success!`
          );
          this.getFileList();
          this.onSelectCancel();
          this.tool.close();
        }
      });
  }

  logOut() {
    this.$axios.post(`${host}/api/user/logout`).then((res: AxiosResponse) => {
      if (res.data.statusCode === 1) {
        this.$toasted.error(res.data.msg);
      } else if (res.data.statusCode === 2) {
        this.$router.push({ name: res.data.data });
        this.$global.clear();
      }
    });
  }
}
</script>

<style lang="stylus" scoped>
.container {
  padding: 0;

  &.fill-height {
    align-items: flex-start;
  }
}

.v-card {
  width: 100%;
}

.v-data-table {
  width: 100%;
  height: 100%;
}

.v-speed-dial {
  margin-left: 20px;
}
</style>
