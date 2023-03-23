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
          <t-button theme="primary" @click="handleCreate">添加功能点</t-button>
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

    <!-- 添加功能点 -->
    <t-drawer v-model:visible="visible" header="添加功能点" size="medium" :on-confirm="handleConfirm">
      <t-form ref="form" :rules="ITEM_FORM_RULES" :data="itemFormData" label-align="top" >
        <t-form-item label="功能类型" name="action">
          <t-select v-model="itemFormData.action" :options="actionOptions"></t-select>
        </t-form-item>
        <t-form-item label="功能名称" name="name">
          <t-input v-model="itemFormData.name" placeholder="1-32位，中文、英文、数字及特殊字符_-，必须以中文或英文字符开头" />
        </t-form-item>
        <t-form-item label="标识符" name="code">
          <t-input v-model="itemFormData.code" placeholder="1-32位，支持英文、数字及特殊字符_-，必须以英文字符开头" />
        </t-form-item>
        <t-form-item label="数据类型" name="type">
          <t-select v-model="itemFormData.type" :options="typeOptions"></t-select>
        </t-form-item>

        <!-- int float 特有 -->
        <t-form-item label="取值范围" name="range">
          <t-range-input :inputProps="rangeInputProps"/>
        </t-form-item>
        <t-form-item label="数据精度">
          <t-input v-model="itemFormData.precision" placeholder="请输入数据精度" />
        </t-form-item>
        <t-form-item label="数据单位">
          <t-select v-model="itemFormData.uint" :options="uintOptions"></t-select>
        </t-form-item>

        <!-- string特有 -->
        <t-form-item label="数据长度" name="length">
          <t-input v-model="itemFormData.length" placeholder="请输入数据长度" /> <p class="min-w-[30px] ml-2">字符</p>
        </t-form-item>

        <!-- bool特有 -->
        <t-form-item label="布尔值" name="binary">
          <t-range-input :inputProps="binaryInputProps"/>
        </t-form-item>


        <t-form-item label="读写类型" name="permission">
          <t-select v-model="itemFormData.permission" :options="permissionOptions"></t-select>
        </t-form-item>
        <t-form-item label="描述信息">
          <t-textarea
            v-model="basicFormData.description"
            placeholder="请输入描述信息"
            :autosize="{ minRows: 4 }"
          />
        </t-form-item>
        
      </t-form>
    </t-drawer>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeftIcon } from 'tdesign-icons-vue-next'

const visible = ref(false)

const handleCreate = () => {
  visible.value = true
}

const handleConfirm = () => {
  visible.value = false
}

const ITEM_FORM_RULES = {
  action: [{ required: true, message: '功能必须选择' }],
  name: [{ required: true, message: '请输入功能名称' }],
  code: [{ required: true, message: '请输入功能名称' }],
  type: [{ required: true, message: '请选择数据类型' }],
  length: [{ required: true, message: '请选择数据长度' }],
  binary: [{ required: true, message: '请设置布尔含义' }],
  range: [{ required: true, message: '请输入数据范围' }],
  permission: [{ required: true, message: '请选择读写方式' }],
}

const itemFormData = reactive({
  action: '1',
  name: '',
  code: '',
  type: '1',
  length: '',
  min: '',
  max: '',
  precision: '',
  truer: '',
  falser: '',
  uint: '',
  permission: '1',
})

const actionOptions = [
  { label: '属性类型', value: '1'},
  { label: '事件类型', value: '2' },
  { label: '服务类型', value: '3' },
]

const typeOptions = [
  { label: 'int(整数型)', value: '1'},
  { label: 'float(浮点型)', value: '2' },
  { label: 'string(字符串)', value: '3' },
  { label: 'bool(布尔)', value: '4' },
  { label: 'enum(枚举)', value: '5' },
  { label: 'struct(结构体)', value: '6' },
  { label: 'array(数组)', value: '7' },
]

const rangeInputProps = [{ label: '最小值', name: 'min' }, { label: '最大值', name: 'max' }]
const binaryInputProps = [{ label: 'true', name: 'min' }, { label: 'false', name: 'max' }]


const uintOptions = [
  { label: '平方厘米 / c㎡', value: '1'},
  { label: '毫米 / mm', value: '2' },
  { label: '千米 / km', value: '3' },
  { label: '毫升 / mL', value: '4' },
  { label: '帕斯卡 / Pa', value: '5' },
  { label: '秒 / ″', value: '6' },
  { label: '弧度 / rad', value: '7' },
]

const permissionOptions = [
  { label: '读写', value: '1'},
  { label: '只读', value: '2' },
]

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