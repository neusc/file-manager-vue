import Vue from 'vue'
import { Form, FormItem, Input, Button, Upload, Table, TableColumn, Notification } from 'element-ui'

Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.use(Upload)
Vue.use(Table)
Vue.use(TableColumn)
Vue.prototype.$notify = Notification
