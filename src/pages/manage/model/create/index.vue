<template>
  <div>
    <div class="flex content-center mb-3">
      <t-button shape="square" variant="text" @click="handleClickBack" size="large">
      <arrow-left-icon slot="icon" />
    </t-button>
    <p class="text-xl font-bold leading-loose">新建物模型</p>
    </div>

    <t-card :bordered="false">    
      <p class="text-size-[18px] font-bold mt-2 mb-6">基本信息</p>
      <t-form ref="form" :data="basicFormData" :rules="BASIC_FORM_RULES">
        <t-form-item label="行业类型" name="category">
          <t-select v-model="basicFormData.category" :options="options1"></t-select>
        </t-form-item>
        <t-form-item label="行业类型" name="scene">
          <t-select v-model="basicFormData.scene" :options="options2"></t-select>
        </t-form-item>
        <t-form-item label="模型名称" name="name">
          <t-input v-model="basicFormData.name" placeholder="请输入模型名称" />
        </t-form-item>
        <t-form-item label="模型描述">
          <t-textarea
            v-model="basicFormData.description"
            placeholder="请输入模型描述信息"
            :autosize="{ minRows: 4 }"
          />
        </t-form-item>
      </t-form>

      <hr class="mt-4">
      
      <t-row class="mt-8 mb-2">
        <t-col :span="6">
          <p class="text-size-[18px] font-bold leading-loose">功能点</p>
        </t-col>
        <t-col :span="6" class="flex justify-end">
          <t-button theme="primary">添加功能点</t-button>
        </t-col>
      </t-row>

      <p class="font-bold mt-8 mb-4">属性列表</p>

      <t-table row-key="index" :columns="propertyColumns" hover bordered>
      </t-table>

      <p class="font-bold mt-8 mb-4">事件列表</p>
      <t-table row-key="index" :columns="eventColumns" hover bordered>
      </t-table>

      <p class="font-bold mt-8 mb-4">服务列表</p>
      <t-table row-key="index" :columns="serviceColumns" hover bordered>
      </t-table>

    </t-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeftIcon } from 'tdesign-icons-vue-next'

const propertyColumns = [
  {colKey: 'name', title: '名称'},
  {colKey: 'code', title: '标识符'},
  {colKey: 'type', title: '数据类型'},
  {colKey: 'action', title: '读写类型'},
  {colKey: 'op', title: '操作'},
]

const eventColumns = [
  {colKey: 'name', title: '名称'},
  {colKey: 'code', title: '标识符'},
  {colKey: 'type', title: '事件类型'},
  {colKey: 'op', title: '操作'},
]

const serviceColumns = [
  {colKey: 'name', title: '名称'},
  {colKey: 'code', title: '标识符'},
  {colKey: 'type', title: '调用方式'},
  {colKey: 'op', title: '操作'},
]

const router = useRouter()
const handleClickBack = () => {
  router.back()
}

const BASIC_FORM_RULES = { 
  category: [{ required: true, message: '行业类型必须选择' }],
  scene: [{ required: true, message: '应用场景必须选择' }],
  name: [{ required: true, message: '应用场景必须选择' }],
}

const basicFormData = ref({
  category: '',
  scene: '',
  name: '',
  description: ''
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

</script>

<style>

</style>