<template>
  <div>
    <t-card>
      <p class="text-xl font-bold leading-loose pb-2">物模型</p>

      <t-alert class="mb-4" message="模板库提供已发布的标准物模版查看功能，开发者可在页面查看各行业/场景下的品类物模版功能定义信息，同时可提交新品类物模版申请，通过审核的物模版将会在平台上正式发布。" />
      
      <t-row class="mb-4">
        <t-col :span="11">
          <t-form ref="form" :data="formData" layout="inline" labelWidth="0" @submit="onSubmit">
            <t-form-item>
              <t-select v-model="formData.category" :options="options1"></t-select>
            </t-form-item>
            <t-form-item>
              <t-select v-model="formData.scene" :options="options2"></t-select>
            </t-form-item>
            <t-form-item>
              <t-input v-model="formData.name" placeholder="请输入名称搜索">
                <template #suffix-icon>
                  <t-button type="submit" theme="primary" shape="square" variant="text" class="-mx-2"><search-icon slot="icon" /></t-button>
                </template>
              </t-input>
            </t-form-item>
          </t-form>
        </t-col>
        <t-col :span="1" class="flex justify-end">
          <t-button theme="primary" @click="handleCreateModel">
            新建模型
          </t-button>
        </t-col>
      </t-row>

      <t-table row-key="index" :columns="columns" :data="data" :pagination="pagination" hover>
        <template #op="{ row }">
          <t-space>
            <t-link theme="primary" hover="color" @click="handleClickDetail(row)">详情</t-link>
            <t-link theme="primary" hover="color" @click="handleClickDelete(row)">删除</t-link>
          </t-space>
        </template>
      </t-table>
    </t-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { SearchIcon } from 'tdesign-icons-vue-next'
import { useRouter } from 'vue-router'


const columns = ref([
  {colKey: 'name', title: '名称'},
  {colKey: 'category', title: '行业类型'},
  {colKey: 'scene', title: '应用场景'},
  {colKey: 'op', title: '操作'},
])

const data = []
const total = 100

const pagination = {
  defaultCurrent: 1,
  defaultPageSize: 10,
  total,
}

for (let i = 0; i < total; i++) {
  data.push({
    index: i,
    name: ['智能井盖', 'WiFi探针采集器', '智能仪表', '环境监测设备'][i % 4],
    category: ['智慧工业', '智慧城市', '能源电力', '其它行业'][i % 4],
    scene: ['气表制造', '智慧工业', '健康管理', '环境感知'][i % 4], 
  })
}

const handleClickDetail = (row) => {
  console.log(row)
}

const handleClickDelete = (row) => {
  console.log(row)
}

const formData = ref({
  category: '1',
  scene: '1',
  name: '',
})

const options1 = [
  { label: '行业类型(全部)', value: '1'},
  { label: '大数据', value: '2' },
  { label: '区块链', value: '3' },
  { label: '物联网', value: '4'},
  { label: '人工智能', value: '5'},
];

const options2 = [
  { label: '应用场景(全部)', value: '1' },
  { label: '云数据库', value: '2' },
  { label: '域名注册', value: '3' },
  { label: '网站备案', value: '4' },
  { label: '对象存储', value: '5' },
  { label: '低代码平台', value: '6' },
];

const onSubmit = () => {

}

const router = useRouter()

const handleCreateModel = () => {
  router.push({name: 'CreateModel'})
}

</script>

<style scoped>

</style>