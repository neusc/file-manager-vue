<template>
  <div class="page-container md-layout-column">
    <md-toolbar class="md-primary">
      <md-button class="md-icon-button" @click="showNavigation = true">
        <md-icon>menu</md-icon>
      </md-button>
      <span class="md-title">File Manager</span>
      <div class="md-toolbar-section-end">
        <md-menu md-direction="bottom-start">
          <md-button md-menu-trigger>operations</md-button>
          <md-menu-content>
            <md-menu-item @click="showUpload = true">upload</md-menu-item>
            <md-menu-item @click="showSelect = true">delete</md-menu-item>
          </md-menu-content>
        </md-menu>
      </div>
    </md-toolbar>
    <md-table
      v-model="tableData"
      md-sort="size"
      md-sort-order="asc"
      md-fixed-header
      @md-selected="onSelected"
    >
      <md-table-toolbar>
        <h1 class="md-title">With auto select and alternate headers</h1>
      </md-table-toolbar>
      <md-table-toolbar slot="md-table-alternate-header" slot-scope="{ count }">
        <div class="md-toolbar-section-start">{{ getAlternateLabel(count) }}</div>
        <div class="md-toolbar-section-end">
          <md-button class="md-icon-button" @click="deleteFile">
            <md-icon>delete</md-icon>
          </md-button>
        </div>
      </md-table-toolbar>
      <md-table-row
        slot="md-table-row"
        slot-scope="{ item }"
        md-selectable="multiple"
        md-auto-select
      >
        <md-table-cell md-label="Name" md-sort-by="name">{{ item.name }}</md-table-cell>
        <md-table-cell md-label="Size" md-sort-by="size">{{ item.size | formatSize }}</md-table-cell>
        <md-table-cell md-label="Modify Time" md-sort-by="modTime">{{ item.modTime | formatTime }}</md-table-cell>
      </md-table-row>
    </md-table>
    <md-drawer :md-active.sync="showNavigation" md-swipeable>
      <md-toolbar class="md-transparent" md-elevation="0">
        <span class="md-title">Hello World!</span>
      </md-toolbar>
      <md-list>
        <md-list-item>
          <md-icon>move_to_inbox</md-icon>
          <span class="md-list-item-text">Inbox</span>
        </md-list-item>
      </md-list>
    </md-drawer>
    <Upload v-if="showUpload" @upload-finish="onUploadFinished" @close="showUpload = false" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Upload from "@/components/Upload.vue";
import { timestampToDate } from "@/utils/timeFormat";
import { host } from "@/config";

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
    Upload
  }
})
export default class List extends Vue {
  tableData = [];
  selectedFiles: CustomFile[] = [];
  showNavigation = false;
  showSelect = false;
  showUpload = false;

  mounted() {
    this.getFileList();
  }

  onSelected(items: CustomFile[]) {
    this.selectedFiles = items;
    console.log("selected==>", items);
  }

  onUploadFinished() {
    this.getFileList();
  }

  getAlternateLabel(count: number): string {
    let plural = "";
    if (count > 1) {
      plural = "s";
    }
    return `${count} file${plural} selected`;
  }

  deleteFile() {
    let names = this.selectedFiles.map(file => file.name);
    this.$axios.post(`${host}/api/file/delete`, { names }).then(res => {
      if (res.data.statusCode === 0) {
        this.getFileList();
      }
    });
  }

  getFileList() {
    this.$axios.post(`${host}/api/file/list`).then(res => {
      if (res.data.statusCode === 0) {
        this.tableData = res.data.data;
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

<style lang="stylus" scoped>
.page-container {
  height: 100%;
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(#000, 0.12);
}

.md-drawer {
  width: 230px;
  max-width: calc(100vw - 125px);
}

.md-table {
  height: 100%;
}
</style>
