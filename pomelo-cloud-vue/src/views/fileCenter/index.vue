<template>
  <el-container class="file-container">
    <header class="file-header">
      <el-button size="medium" @click="backPath">
        <i class="el-icon-back"></i>
      </el-button>
      <div class="file-path">
        <ul>
          <li v-for="item in fileDirpath">
            <a @click="getFileList(item.url)">
              {{ item.name }}
              <span> > </span>
            </a>
          </li>
        </ul>
      </div>
      <el-button size="medium" @click="refreshPath">
        <i class="el-icon-refresh"></i>
      </el-button>
      <el-input class="header-search" ize="50" v-model="condition.options.keywords">
        <el-button slot="append" icon="el-icon-search" @click="getFileList()"></el-button>
      </el-input>
    </header>

    <el-container>
      <el-aside class="context-aside" width="200px">
        <tr v-for="item in sidebar">
          <hr v-if="item.hasHr">
          <td>
            <a v-if="typeof item.link === 'string'" @click="getFileList(item.link)">
              <i :class="item.icon"></i>
              {{ item.title }}
            </a>
            <a v-if="typeof item.link === 'object'">
              <i :class="item.icon"></i>
              {{ item.title }}
            </a>
            <ul v-if="typeof item.link === 'object'">
              <li v-for="el in item.link">
                <a @click="getFileList(el.path)">
                  <i class="el-icon-receiving"></i>
                  {{ el.name }} ({{ el.size }})
                </a>
              </li>
            </ul>
          </td>
        </tr>
      </el-aside>
      <el-table
        ref="fileDataTable"
        tooltip-effect="dark"
        element-loading-text="Loading"
        max-height="500"
        v-loading="listLoading"
        :data="list"
        :default-sort="{order: 'name, updateTime, size'}"
        fit
        stripe
        highlight-current-row
        @row-contextmenu="currentRow"
        @selection-change="handleSelectionChange"
        @contextmenu.native.prevent="openRightClickMenu($event)"
        @mouseup.native="clearCurrentRow"
      >
        <el-table-column
          align="center"
          type="selection"
          width="60">
        </el-table-column>
        <el-table-column sortable show-overflow-tooltip prop="name" align="left" label="文件名" width="320">
          <template slot-scope="scope">
            <a v-if="scope.row.isFolder"
               @click="getFileList(condition.path + scope.row.name)">
              <svg-icon icon-class="folder" class-name="folder-icon"/>
              {{ scope.row.name }}
            </a>
            <a v-if="scope.row.isFile"
               @click="">
              <svg-icon icon-class="fileIcon" class-name="file-icon"/>
              {{ scope.row.name }}
            </a>
          </template>
        </el-table-column>
        <el-table-column sortable prop="updateTime" label="最后修改日期" width="160" align="left">
          <template slot-scope="scope">
            <span>{{ scope.row.lastUpdateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column sortable prop="size" label="大小" width="80" align="left">
          <template slot-scope="scope">
            <span v-if="scope.row.isFile">
              {{ scope.row.size }}
            </span>
            <span v-if="scope.row.isFolder">
              {{ scope.row.size }} 项
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="right">
          <template slot-scope="scope">

          </template>
        </el-table-column>
      </el-table>
    </el-container>
    <el-footer>
      <div class="func-button-group">
        <el-row>
          <el-button size="medium" @click="">上传</el-button>
          <el-button size="medium">下载</el-button>
          <el-button size="medium" @click="openCreateDialog = true">新建</el-button>
          <el-button size="medium" @click="goRootPath" icon="el-icon-receiving">
            根目录( / )
          </el-button>
          <el-button size="medium" icon="el-icon-connection">
            终端
          </el-button>
        </el-row>
      </div>
      <div class="block" id="pomelo-page-footer">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[50, 100, 200, 500, 1000]"
          :current-page.sync="condition.page.pageNo"
          :page-size.sync="condition.page.pageSize"
          :total="condition.page.total"
          layout="slot, prev, pager, next, sizes, jumper"
          page-count.sync="5"
          background
        >
          <span>目录: {{ folderCount }} 个</span>
          <span>文件: {{ fileCount }} 个</span>
        </el-pagination>
      </div>
    </el-footer>

    <div>
      <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
        <div v-if="!rightClickItem">
          <li @click="refreshPath">
            <i class="el-icon-refresh"></i>
            <span>刷<span v-html="'\u00a0'"></span>新</span>
          </li>
          <hr>
          <li @click="openUploadDialog = true">
            <i class="el-icon-upload"></i>
            <span>上<span v-html="'\u00a0'"></span>传</span>
          </li>
          <li @click="openCreateDialog = true">
            <i class="el-icon-folder-add"></i>
            <span>新<span v-html="'\u00a0'"></span>建</span>
          </li>
          <li @click="openSshDialog = true">
            <i class="el-icon-connection"></i>
            <span>终<span v-html="'\u00a0'"></span>端</span>
          </li>
          <hr>
          <li @click="pasteFile">
            <i class="el-icon-tickets"></i>
            <span>粘<span v-html="'\u00a0'"></span>贴</span>
          </li>
        </div>

        <div v-if="rightClickItem">
          <li @click="openDirectory" v-if="rightClickItem && rightClickItem.isFolder">
            <i class="el-icon-view"></i>
            <span>打<span v-html="'\u00a0'"></span>开</span>
          </li>
          <li @click="" v-if="rightClickItem && rightClickItem.isFile">
            <i class="el-icon-view"></i>
            <span>编<span v-html="'\u00a0'"></span>辑</span>
          </li>
          <hr>
        </div>

        <div v-if="rightClickItem">
          <li @click="openShareDialog = true">
            <i class="el-icon-share"></i>
            <span>分<span v-html="'\u00a0'"></span>享</span>
          </li>
          <li @click="openStarDialog = true">
            <i class="el-icon-star-off"></i>
            <span>收<span v-html="'\u00a0'"></span>藏</span>
          </li>
          <li @click="openAuthorityDialog = true">
            <i class="el-icon-folder-checked"></i>
            <span>权<span v-html="'\u00a0'"></span>限</span>
          </li>
          <hr>
        </div>

        <div v-if="rightClickItem">
          <li @click="copyFile">
            <i class="el-icon-document-copy"></i>
            <span>复<span v-html="'\u00a0'"></span>制</span>
          </li>
          <li @click="cutFile">
            <i class="el-icon-scissors"></i>
            <span>剪<span v-html="'\u00a0'"></span>切</span>
          </li>
          <li @click="openRenameDialog = true">
            <i class="el-icon-edit-outline"></i>
            <span>重<span v-html="'\u00a0'"></span>命<span v-html="'\u00a0'"></span>名</span>
          </li>
          <li @click="removeFile">
            <i class="el-icon-document-remove"></i>
            <span>删<span v-html="'\u00a0'"></span>除</span>
          </li>
          <hr>
        </div>

        <div v-if="rightClickItem">
          <li @click="openCompressDialog = true">
            <i class="el-icon-film"></i>
            <span>压<span v-html="'\u00a0'"></span>缩</span>
          </li>
          <hr>
          <li @click="openCompressDialog = true">
            <i class="el-icon-c-scale-to-original"></i>
            <span>属<span v-html="'\u00a0'"></span>性</span>
          </li>
        </div>

      </ul>
    </div>

    <!-- Table start -->
    <el-dialog title="新建文件/文件夹"
               :visible.sync="openCreateDialog"
               width="25%">
      <el-form :model="createModel">
        <el-form-item label="文件名称: " label-width="100px">
          <el-input v-model="createModel.name" autocomplete="off" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="创建类型: " label-width="100px">
          <el-select v-model="createModel.type" placeholder="请选择类型" default-first-option>
            <el-option v-for="item in createModelType"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openCreateDialog = false">取 消</el-button>
        <el-button type="primary" @click="createFile">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="重命名"
               :visible.sync="openRenameDialog"
               width="25%">
      <el-form>
        <el-form-item label="当前名称: " label-width="100px">
          <el-input v-model="rightClickItem && rightClickItem.name" autocomplete="off" style="width: 200px;"
                    disabled></el-input>
        </el-form-item>
        <el-form-item label="新的名称: " label-width="100px">
          <el-input v-model="newFileName" autocomplete="off" style="width: 200px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openRenameDialog = false">取 消</el-button>
        <el-button type="primary" @click="renameFile">确 定</el-button>
      </div>
    </el-dialog>
    <!-- Table end -->
  </el-container>
</template>

<script>
import {list, sidebar, create, remove, rename, copy, cut, paste} from '@/api/file';
import {parseFileSize} from '@/utils';
import {notice} from '@/utils/notice';

export default {
  name: 'FileCenter',
  data() {
    return {
      list: [],
      listLoading: true,
      condition: {
        path: 'D:/IDE_Spances/Webstorm_Spance',
        page: {
          pageNo: 1,
          pageSize: 50,
          total: 0,
        },
        options: {
          keywords: '',
          sort: '',
        },
      },
      fileCount: 0,
      folderCount: 0,
      sidebar: [],
      multipleSelection: [],
      fileDirpath: [],

      openCreateDialog: false,
      createModel: {
        name: '',
        type: 'file',
      },
      createModelType: [
        {
          label: '文件',
          value: 'file',
        },
        {
          label: '文件夹',
          value: 'folder',
        },
      ],

      rightClickItem: null,
      visible: false,
      top: 0,
      left: 0,

      openRenameDialog: false,
      newFileName: '',

      pasteToken: null,
    };
  },
  watch: {
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu);
      } else {
        document.body.removeEventListener('click', this.closeMenu);
      }
    },
  },
  created() {
    this.getFileSidebar();
    this.getFileList();
  },
  methods: {
    handleSizeChange(val) {
      this.condition.page.pageSize = val;
      this.getFileList();
    },
    handleCurrentChange(val) {
      this.condition.page.pageNo = val;
      this.getFileList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    assemblyPath(dirLink = [], index) {
      let path = '';
      for (let i = 0; i < index; i++) {
        const p = dirLink[i];
        path += p + '/';
      }
      return path;
    },
    getFileSidebar() {
      sidebar().then(response => {
        const {data} = response;
        this.sidebar = data;
      });
    },
    backPath() {
      const path = this.fileDirpath.length < 2 ?
        this.fileDirpath[this.fileDirpath.length - 1].url :
        this.fileDirpath[this.fileDirpath.length - 2].url;
      this.getFileList(path);
    },
    refreshPath() {
      this.getFileList();
      notice({message: '刷新成功'});
    },
    goRootPath() {
      this.getFileList('/');
    },
    getFileList(path) {
      this.listLoading = true;
      if (path) {
        this.condition.path = path;
        this.condition.page = {
          pageNo: 1,
          pageSize: this.condition.page.pageSize,
        };
      }
      list({...this.condition}).then(response => {
        const {data} = response;
        this.condition.page = data.condition.page;

        this.condition.path = data.path;
        const paths = data.path.split('/');
        this.fileDirpath = [];
        for (let i = 0; i < paths.length; i++) {
          const name = paths[i];
          if (name) {
            const url = this.assemblyPath(paths, i + 1);
            this.fileDirpath.push({url, name});
          }
        }
        this.fileCount = data.fileCount;
        this.folderCount = data.folderCount;
        data.fileList.map(file => file.size = file.isFile ? parseFileSize(file.size) : file.size);
        this.list = data.fileList;
        this.listLoading = false;
      });
    },
    currentRow(row) {
      this.rightClickItem = row ? row : null;
    },
    clearCurrentRow() {
      this.rightClickItem = null;
    },
    openRightClickMenu(ev) {
      const x = ev.pageX - 200;
      const y = ev.pageY - 40;
      this.top = y;
      this.left = x;
      this.visible = true;
    },
    closeMenu() {
      this.visible = false;
    },
    openDirectory() {
      this.getFileList(this.condition.path + '/' + this.rightClickItem.name);
    },
    createFile() {
      const data = {name: this.createModel.name, path: this.condition.path};
      create(this.createModel.type, data).then(res => {
        notice({message: '创建成功'});
        this.openCreateDialog = false;
        this.createModel.name = '';
        this.getFileList();
      }).catch(e => {
        console.log(e);
        notice({message: '创建失败', type: 'error'});
      });
    },
    removeFile() {
      const data = {name: this.rightClickItem.name, path: this.condition.path};
      remove(data).then(res => {
        notice({message: '删除成功'});
        this.getFileList();
      }).catch(e => {
        console.log(e);
        notice({message: '删除失败', type: 'error'});
      });
    },
    renameFile() {
      const data = {
        newName: this.newFileName,
        oldName: this.rightClickItem.name,
        path: this.condition.path,
      };
      rename(data).then(res => {
        notice({message: '修改成功'});
      }).catch(e => {
        console.log(e);
        notice({message: '修改失败', type: 'error'});
      });
      this.getFileList();
      this.openRenameDialog = false;
      this.newFileName = '';
    },
    copyFile() {
      copy({name: this.rightClickItem.name, path: this.condition.path})
        .then(res => {
          this.pasteToken = res.data;
          notice({message: '复制成功'});
        })
        .catch(e => notice({message: '复制异常', type: 'error'}));
    },
    cutFile() {
      cut({name: this.rightClickItem.name, path: this.condition.path})
        .then(res => {
          this.pasteToken = res.data;
          notice({message: '剪切成功'});
        })
        .catch(e => notice({message: '剪切异常', type: 'error'}));
      this.getFileList();
    },

    pasteFile() {
      paste({token: this.pasteToken, path: this.condition.path})
        .then(res => {
          if (res.data) {
            notice({message: '粘贴成功'});
          }
          this.pasteToken = '';
        })
        .catch(e => notice({message: '粘贴异常', type: 'error'}));
      this.getFileList();
    },
  },
};
</script>

<style lang="scss">
.file-container {
  margin: 0.5% 0.5%;

  a:hover {
    color: #00A0C6;
    //font-size: 20px;
    text-decoration: none;
  }

  .file-header {
    float: left;
    height: 40px;
    width: 100%;
    //border: 1px #cacdce solid;
    font-size: 13px;
    margin-bottom: 0.5%;

    .el-button {
      margin: 0.1% auto;
      float: left;
    }

    .file-path {
      float: left;
      height: 38px;
      width: 58%;
      background-color: #f8f7f7;

      li {
        padding-left: 0.5%;
        list-style: none;
        float: left;
      }

      span {
        margin: 0 auto;
      }
    }

    .header-search {
      height: 38px;
      float: right;
      width: 30%;
    }
  }

  .el-container {
    margin-bottom: 0.5%;
  }

  .context-aside {
    background-color: #f1f3f3;
    padding-left: 2%;
    height: 500px;

    td {
      float: left;
      padding-top: 16%;
    }

    hr {
      margin-top: 20%;
    }

    ul {
      list-style: none;
      left: 1%;
      position: absolute;

      li {
        line-height: 25px;
      }
    }
  }

  .folder-icon {
    width: 20px;
    height: 20px;
  }

  .file-icon {
    width: 20px;
    height: 20px;
  }

  .el-footer {
    span {
      margin-right: 10px;
      font-weight: 400;
      color: #606266;
    }

    .func-button-group {
      line-height: 40px;
      text-align: left;
      bottom: 7%;
      position: absolute;
      z-index: 99;
    }
  }

  .contextmenu {
    margin: 0;
    width: 14%;
    background: #fff;
    z-index: 5000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 400;
    color: #333;
    border: 1px rgba(0, 0, 0, 0.3) solid;
    box-shadow: 4px 4px 12px rgb(0 0 0 / 15%);

    li {
      list-style-type: none;
      margin: 0;
      padding: 5% 26%;
      height: 30px;
      font-size: 15px;
      color: #555;
      box-sizing: border-box;
      position: relative;
      font-weight: 400;
      border-radius: 2px;

      li:hover {
        background-color: #00A0C6;
        z-index: 7000;
      }

      i {
        position: absolute;
        left: 10%;
      }
    }
  }
}
</style>
