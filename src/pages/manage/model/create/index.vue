<template>
  <div>
    <t-card :bordered="false">
      <!-- 新建物模型返回按钮 -->
      <div class="flex content-center mb-5 -mx-5 -my-2">
        <t-button shape="square" variant="text" @click="handleClickBack" size="large">
          <arrow-left-icon slot="icon" />
        </t-button>
        <p class="text-xl font-bold leading-loose">新建物模型</p>
      </div>

      <!-- 基本信息表单 -->
      <p class="text-size-[18px] font-bold mt-2 mb-6">基本信息</p>
      <t-form :data="basicFormData" :rules="BASIC_FORM_RULES">
        <!-- 行业类型 -->
        <t-form-item label="行业类型" name="typeOfIndustry">
          <t-select v-model="basicFormData.typeOfIndustry" :options="typeOfIndustryOptions"></t-select>
        </t-form-item>
        
        <!-- 应用场景 -->
        <t-form-item label="应用场景" name="scenarios">
          <t-select v-model="basicFormData.scenarios" :options="scenariosOptions"></t-select>
        </t-form-item>

        <!-- 模型名称 -->
        <t-form-item label="模型名称" name="modelName">
          <t-input v-model="basicFormData.modelName" placeholder="请输入模型名称" />
        </t-form-item>

        <!-- 模型描述 -->
        <t-form-item label="模型描述">
          <t-textarea v-model="basicFormData.modelDesc" placeholder="请输入模型描述信息" :autosize="{ minRows: 4 }" />
        </t-form-item>
      </t-form>
      
      <!-- 创建功能项按钮 -->
      <t-row class="mt-8 mb-2">
        <t-col :span="6">
          <p class="text-size-[18px] font-bold leading-loose">功能项</p>
        </t-col>
        <t-col :span="6" class="flex justify-end">
          <t-button theme="primary" @click="handleCreateItem">添加功能项</t-button>
        </t-col>
      </t-row>

      <!-- 属性列表 -->
      <p class="font-bold mt-8 mb-4">属性列表</p>
      <t-table row-key="index" :columns="propertyColumns" hover bordered></t-table>

      <!-- 事件列表 -->
      <p class="font-bold mt-8 mb-4">事件列表</p>
      <t-table row-key="index" :columns="eventColumns" hover bordered></t-table>

      <!-- 服务列表 -->
      <p class="font-bold mt-8 mb-4">服务列表</p>
      <t-table row-key="index" :columns="serviceColumns" hover bordered></t-table>
    </t-card>

    <!-- 添加功能项 -->
    <t-drawer v-model:visible="showItemDrawer" size="500">
      <template #header>
        <p class="text-sm font-bold">添加功能点</p>
      </template>

      <t-form :rules="ITEM_FORM_RULES" :data="itemFormData" label-align="top">
        <!-- 三种功能项类型 -->
        <t-form-item label="功能类型" name="action">
          <t-select v-model="itemFormData.action" :options="actionOptions"></t-select>
        </t-form-item>

        <!-- 三种功能项共有 -->
        <t-form-item label="功能名称" name="name">
          <t-input v-model="itemFormData.name" placeholder="1-32位，中文、英文、数字及特殊字符_-，必须以中文或英文字符开头" />
        </t-form-item>

        <t-form-item label="标识符" name="code">
          <t-input v-model="itemFormData.code" placeholder="1-32位，支持英文、数字及特殊字符_-，必须以英文字符开头" />
        </t-form-item>

        <!-- 属性项 -->
        <div v-if="itemFormData.action == 'property'">
          <!-- 数据类型 -->
          <t-form-item label="数据类型" name="dataType">
            <t-select v-model="itemFormData.dataType" :options="dataTypeOptions"></t-select>
          </t-form-item>

          <!-- 数据类型判断 -->
          <!-- int/float特有 -->
          <div v-if="itemFormData.dataType == 'int' || itemFormData.dataType == 'float'">
            <t-form-item label="取值范围" name="range">
              <t-range-input :inputProps="rangeInputProps"  placeholder=" "/>
            </t-form-item>
            <t-form-item label="数据精度">
              <t-input v-model="itemFormData.precision" placeholder="请输入数据精度" />
            </t-form-item>
            <t-form-item label="数据单位">
              <t-select v-model="itemFormData.uint" :options="uintOptions"></t-select>
            </t-form-item>
          </div>

          <!-- string特有 -->
          <div v-else-if="itemFormData.dataType == 'string'">
            <t-form-item label="数据长度" name="length">
              <t-input v-model="itemFormData.length" placeholder="请输入数据长度" /> <p class="min-w-[30px] ml-2">字符</p>
            </t-form-item>
          </div>

          <!-- bool特有 -->
          <div v-else-if="itemFormData.dataType == 'bool'">
            <t-form-item label="布尔值" name="binary">
              <t-range-input :inputProps="binaryInputProps"/>
            </t-form-item>
          </div>

          <!-- enum特有 -->
          <div v-else-if="itemFormData.dataType == 'enum'">
            <t-form-item label="枚举项" name="enums">
              <div class="w-full mt-2">
                <t-row class="mb-4 font-bold">
                  <t-col :span="4">参数值</t-col>
                  <t-col :span="8">参数描述</t-col>
                </t-row>
                <t-row v-for="(item, i) in itemFormData.enums" :key="i" :gutter="[0]" class="mb-4">
                  <t-col :span="3">
                    <t-input v-model="item.k" placeholder="整数"/>
                  </t-col>
                  <t-col :span="7" :offset="1">
                    <t-input v-model="item.v" placeholder="1-20位，中文、英文、数字及特殊字符"/>
                  </t-col>
                  <t-col :span="1">
                    <t-button shape="square" variant="text" theme="danger" @click="handleRemoveEnum(i)">
                      <remove-icon slot="icon" />
                    </t-button>
                  </t-col>
                </t-row>
                <t-row>
                  <t-col :span="12">
                    <t-link theme="primary" hover="color" @click="handleCreateItemEnum">
                      <add-icon slot="prefix-icon"></add-icon>
                      添加枚举项
                    </t-link>
                  </t-col>
                </t-row>
              </div>
            </t-form-item>
          </div>

          <!-- struct特有 -->
          <div v-else-if="itemFormData.dataType == 'struct'">
            <t-form-item label="JSON对象" name="json">
              <div class="w-full mt-2">
                <t-row v-for="(item, i) in jsons" :key="i" class="bg-light-300 text-gray-400 px-3 py-1 font-xs mb-2">
                  <t-col :span="3">{{ item.name }}</t-col>
                  <t-col :span="3">{{ item.code }}</t-col>
                  <t-col :span="3">{{ item.type }}</t-col>
                  <t-col :span="3" class="flex justify-end">
                    <t-link theme="primary" hover="color" @click="handleEditJson(i)">编辑</t-link>
                    <p class="px-2">/</p> 
                    <t-link theme="primary" hover="color" @click="handleRemoveJson(i)">删除</t-link>
                  </t-col>
                </t-row>
                <t-row class="mt-4">
                  <t-col :span="12">
                    <t-link theme="primary" hover="color" @click="handleCreateItemJson">
                      <add-icon slot="prefix-icon"></add-icon>
                      添加参数
                    </t-link>
                  </t-col>
                </t-row>
              </div>
            </t-form-item>
          </div>

          <!-- array特有 -->
          <div v-else-if="itemFormData.dataType == 'array'">
            <t-form-item label="元素类型" name="arrayType">
              <t-select v-model="itemFormData.arrayType" :options="arrayTypeOptions"></t-select>
            </t-form-item>

            <t-form-item label="元素个数" name="arrayNum">
              <t-input v-model="itemFormData.arrayNum" placeholder="请输入元素个数" />
            </t-form-item>

            <!-- int/float特有 -->
            <div v-if="itemFormData.arrayType == 'int' || itemFormData.arrayType == 'float'">
              <t-form-item label="取值范围" name="range">
                <t-range-input :inputProps="rangeInputProps"/>
              </t-form-item>
              <t-form-item label="数据精度">
                <t-input v-model="itemFormData.precision" placeholder="请输入数据精度" />
              </t-form-item>
              <t-form-item label="数据单位">
                <t-select v-model="itemFormData.uint" :options="uintOptions"></t-select>
              </t-form-item>
            </div>

            <!-- string特有 -->
            <div v-else-if="itemFormData.arrayType == 'string'">
              <t-form-item label="数据长度" name="length">
                <t-input v-model="itemFormData.length" placeholder="请输入数据长度" /> <p class="min-w-[30px] ml-2">字符</p>
              </t-form-item>
            </div>

            <!-- bool特有 -->
            <div v-else-if="itemFormData.arrayType == 'bool'">
              <t-form-item label="布尔值" name="binary">
                <t-range-input :inputProps="binaryInputProps"/>
              </t-form-item>
            </div>

            <!-- enum特有 -->
            <div v-else-if="itemFormData.arrayType == 'enum'">
              <t-form-item label="枚举项" name="enums">
                <div class="w-full mt-2">
                  <t-row class="mb-4 font-bold">
                    <t-col :span="4">参数值</t-col>
                    <t-col :span="8">参数描述</t-col>
                  </t-row>
                  <t-row v-for="(item, i) in itemFormData.enums" :key="i" :gutter="[0]" class="mb-4">
                    <t-col :span="3">
                      <t-input v-model="item.k" placeholder="整数"/>
                    </t-col>
                    <t-col :span="7" :offset="1">
                      <t-input v-model="item.v" placeholder="1-20位，中文、英文、数字及特殊字符"/>
                    </t-col>
                    <t-col :span="1">
                      <t-button shape="square" variant="text" theme="danger" @click="handleRemoveEnum(i)">
                        <remove-icon slot="icon" />
                      </t-button>
                    </t-col>
                  </t-row>
                  <t-row>
                    <t-col :span="12">
                      <t-link theme="primary" hover="color" @click="handleCreateItemEnum">
                        <add-icon slot="prefix-icon"></add-icon>
                        添加枚举项
                      </t-link>
                    </t-col>
                  </t-row>
                </div>
              </t-form-item>
            </div>

            <!-- struct特有 -->
            <div v-else-if="itemFormData.arrayType == 'struct'">
              <t-form-item label="JSON对象" name="json">
                <div class="w-full mt-2">
                  <t-row v-for="(item, i) in jsons" :key="i" class="bg-light-300 text-gray-400 px-3 py-1 font-xs mb-2">
                    <t-col :span="3">{{ item.name }}</t-col>
                    <t-col :span="3">{{ item.code }}</t-col>
                    <t-col :span="3">{{ item.type }}</t-col>
                    <t-col :span="3" class="flex justify-end">
                      <t-link theme="primary" hover="color" @click="handleEditJson(i)">编辑</t-link>
                      <p class="px-2">/</p> 
                      <t-link theme="primary" hover="color" @click="handleRemoveJson(i)">删除</t-link>
                    </t-col>
                  </t-row>
                  <t-row class="mt-4">
                    <t-col :span="12">
                      <t-link theme="primary" hover="color" @click="handleCreateItemJson">
                        <add-icon slot="prefix-icon"></add-icon>
                        添加参数
                      </t-link>
                    </t-col>
                  </t-row>
                </div>
              </t-form-item>
            </div>
          </div>
          
          <!-- 数据项共有 -->
          <div class="mt-6">
            <t-form-item label="读写类型" name="accessMode">
              <t-select v-model="itemFormData.accessMode" :options="accessModeOptions"></t-select>
            </t-form-item>

            <t-form-item label="描述信息">
              <t-textarea v-model="basicFormData.description" placeholder="请输入描述信息" :autosize="{ minRows: 4 }" />
            </t-form-item>
          </div>
        </div>

        <!-- 事件项 -->
        <div v-else-if="itemFormData.action == 'event'">
        事件项
        </div>

        <!-- 服务项 -->
        <div v-else-if="itemFormData.action == 'service'">
        服务项
        </div>

      </t-form>

      <template #footer>
        <div class="flex justify-end">
          <t-button @click="handleFunctionConfirm">确定</t-button>
          <t-button variant="outline" @click="showItemDrawer = false"> 取消 </t-button>
        </div>
      </template>
      
    </t-drawer>

    <!-- 添加结构体参数 -->
    <t-drawer v-model:visible="showJsonDrawer" size="450">
      <template #header>
        <p class="text-sm font-bold">添加结构体参数</p>
      </template>

      <!-- 结构体表单 -->
      <t-form :rules="ITEM_FORM_RULES" :data="objectFormData" label-align="top">
        <!-- 结构体共有属性 -->
        <t-form-item label="功能名称" name="name">
          <t-input v-model="objectFormData.name" placeholder="1-32位，中文、英文、数字及特殊字符_-，必须以中文或英文字符开头" />
        </t-form-item>
        
        <t-form-item label="标识符" name="code">
          <t-input v-model="objectFormData.code" placeholder="1-32位，支持英文、数字及特殊字符_-，必须以英文字符开头" />
        </t-form-item>
        
        <t-form-item label="数据类型" name="type">
          <t-select v-model="objectFormData.type" :options="objectTypeOptions"></t-select>
        </t-form-item>

        <!-- int float 特有 -->
        <div v-if="objectFormData.type == 'int' || objectFormData.type == 'float'">
          <t-form-item label="取值范围" name="range">
            <t-range-input :inputProps="rangeInputProps"/>
          </t-form-item>
          <t-form-item label="数据精度">
            <t-input v-model="objectFormData.precision" placeholder="请输入数据精度" />
          </t-form-item>
          <t-form-item label="数据单位">
            <t-select v-model="objectFormData.uint" :options="uintOptions"></t-select>
          </t-form-item>
        </div>

        <!-- string特有 -->
        <div v-else-if="objectFormData.type == 'string'">
          <t-form-item label="数据长度" name="length">
            <t-input v-model="objectFormData.length" placeholder="请输入数据长度" /> <p class="min-w-[30px] ml-2">字符</p>
          </t-form-item>
        </div>
        
        <!-- bool特有 -->
        <div v-else-if="objectFormData.type == 'bool'">
          <t-form-item label="布尔值" name="binary">
            <t-range-input :inputProps="binaryInputProps"/>
          </t-form-item>
        </div>

        <!-- enum特有 -->
        <div v-else-if="objectFormData.type == 'enum'">
          <t-form-item label="枚举项" name="enums">
            <div class="w-full mt-2">
              <t-row class="mb-4 font-bold">
                <t-col :span="4">参数值</t-col>
                <t-col :span="8">参数描述</t-col>
              </t-row>
              <t-row v-for="(item, i) in objectFormData.enums" :key="i" :gutter="[0]" class="mb-4">
                <t-col :span="3">
                  <t-input v-model="item.k" placeholder="整数"/>
                </t-col>
                <t-col :span="7" :offset="1">
                  <t-input v-model="item.v" placeholder="1-20位，中文、英文、数字及特殊字符"/>
                </t-col>
                <t-col :span="1">
                  <t-button shape="square" variant="text" theme="danger" @click="handleRemoveJsonEnum(i)">
                    <remove-icon slot="icon" />
                  </t-button>
                </t-col>
              </t-row>
              <t-row>
                <t-col :span="12">
                  <t-link theme="primary" hover="color" @click="handleCreateItemJsonEnum">
                    <add-icon slot="prefix-icon"></add-icon>
                    添加枚举项
                  </t-link>
                </t-col>
              </t-row>
            </div>
          </t-form-item>
        </div>
      </t-form>

      <template #footer>
        <div class="flex justify-end">
          <t-button @click="handleJsonConfirm">确定</t-button>
          <t-button variant="outline" @click="showJsonDrawer = false"> 取消 </t-button>
        </div>
      </template>
    </t-drawer>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeftIcon, AddIcon, RemoveIcon } from 'tdesign-icons-vue-next'



const handleFunctionConfirm = () => {
  console.log(itemFormData)
  showItemDrawer.value = false
}

// 显示结构体抽屉柜
const showJsonDrawer = ref(false)



const ITEM_FORM_RULES = {
  action: [{ required: true, message: '请选择功能项' }],
  code: [{ required: true, message: '请输入功能代码' }],
  name: [{ required: true, message: '请输入功能项目名称' }],
  
  dataType: [{ required: true, message: '请选择数据类型' }],
  arrayType: [{ required: true, message: '请选择元素类型' }],
  length: [{ required: true, message: '请选择数据长度' }],
  binary: [{ required: true, message: '请设置布尔含义' }],
  enums: [{ required: true, message: '请设置枚举项' }],
  json: [{ required: true, message: '请添加结构体参数' }],
  range: [{ required: true, message: '请输入数据范围' }],
  accessMode: [{ required: true, message: '请选择读写方式' }],
  arrayNum: [{ required: true, message: '元素个数不能为空' }],
}

const itemFormData = reactive({
  action: 'property',
  name: '',
  code: '',
  dataType: 'int',

  // 整数 or 浮点数
  min: '',
  max: '',
  precision: '',
  uint: '',

  // 字符串长度 
  length: '',
  
  // 布尔
  truer: '',
  falser: '',

  // 枚举
  enums: [],

  // 数组
  arrayType: 'int',
  arrayNum: '',

  accessMode: 'rw',
  description: '',
})

const jsons = reactive([])



const objectFormData = reactive({
  name: '',
  code: '',
  type: 'int',
  length: '',
  min: '',
  max: '',
  precision: '',
  truer: '',
  falser: '',
  uint: '',
  enums: []
})

const handleJsonConfirm = () => {
  if(editStatus == true) {
    // 如果是编辑状态
    Object.assign(jsons[editJsonIdx], {...objectFormData})

    editStatus = false
    editJsonIdx = 0
  } else {
    jsons.push({...objectFormData})
  }

  const keys = Object.keys(objectFormData)
  let obj = {}
  keys.forEach(item => {
    obj[item] = ''
  })
  Object.assign(objectFormData, obj)

  showJsonDrawer.value = false
}

const handleCreateItemEnum = () => {
  itemFormData.enums.push({})
}

const handleRemoveEnum = (i) => {
  itemFormData.enums.splice(i, 1)
}

const handleCreateItemJsonEnum = () => {
  objectFormData.enums.push({})
}

const handleRemoveJsonEnum = (i) => {
  objectFormData.enums.splice(i, 1)
}

const handleCreateItemJson = () => {
  const keys = Object.keys(objectFormData)
  let obj = {}
  keys.forEach(item => {
    obj[item] = ''
  })
  
  obj['type'] = 'int'
  obj['enums'] = []

  Object.assign(objectFormData, obj)

  showJsonDrawer.value = true
}

let editStatus = false
let editJsonIdx = 0

const handleEditJson = (i) => {
  Object.assign(objectFormData, jsons[i])
  showJsonDrawer.value = true
  
  editStatus = true
  editJsonIdx = i
}

const handleRemoveJson = (i) => {
  jsons.splice(i, 1)
}

const actionOptions = [
  { label: '属性类型', value: 'property'},
  { label: '事件类型', value: 'event' },
  { label: '服务类型', value: 'service' },
]

const dataTypeOptions = [
  { label: 'int(整数型)', value: 'int'},
  { label: 'float(浮点型)', value: 'float' },
  { label: 'string(字符串)', value: 'string' },
  { label: 'bool(布尔)', value: 'bool' },
  { label: 'enum(枚举)', value: 'enum' },
  { label: 'struct(结构体)', value: 'struct' },
  { label: 'array(数组)', value: 'array' },
]

const arrayTypeOptions = [
  { label: 'int(整数型)', value: 'int'},
  { label: 'float(浮点型)', value: 'float' },
  { label: 'string(字符串)', value: 'string' },
  { label: 'bool(布尔)', value: 'bool' },
  { label: 'enum(枚举)', value: 'enum' },
  { label: 'struct(结构体)', value: 'struct' },
]

const objectTypeOptions = [
  { label: 'int(整数型)', value: 'int'},
  { label: 'float(浮点型)', value: 'float' },
  { label: 'string(字符串)', value: 'string' },
  { label: 'bool(布尔)', value: 'bool' },
  { label: 'enum(枚举)', value: 'enum' },
]

const rangeInputProps = [{ label: '最小值:', name: 'min' }, { label: '最大值:', name: 'max' }]
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

const accessModeOptions = [
  { label: '读写', value: 'rw'},
  { label: '只读', value: 'r' },
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

// 新建模型返回按钮
const router = useRouter()
const handleClickBack = () => {
  router.back()
}

// 基础信息表单规则校验
const BASIC_FORM_RULES = { 
  typeOfIndustry: [{ required: true, message: '行业类型必须选择' }],
  scenarios: [{ required: true, message: '应用场景必须选择' }],
  modelName: [{ required: true, message: '请输入模板类型' }],
}

// 基础信息表单
const basicFormData = ref({
  typeOfIndustry: '',
  scenarios: '',
  modelName: '',
  modelDesc: ''
})

// 基础信息表单行业类型
const typeOfIndustryOptions = [
  { label: '智慧城市', value: 'City'},
  { label: '智慧生活', value: 'Life' },
  { label: '智慧工业', value: 'Industrial' },
  { label: '智慧园区', value: 'Garden'},
  { label: '智慧商业', value: 'Business'},
  { label: '智慧农业', value: 'Agriculture'},
  { label: '智慧楼宇', value: 'Building'},
  { label: '智慧交通', value: 'Traffic'},
  { label: '智慧物流', value: 'Logistics'},
  { label: '医疗健康', value: 'Medical'},
  { label: '智慧教育', value: 'Education'},
  { label: '能源电力', value: 'Electricity'},
  { label: '智慧社区', value: 'Community'},
  { label: '其它行业', value: 'Other'},
];

// 基础信息表单应用场景
const scenariosOptions = [
  { label: '公共服务', value: 'PublicService' },
  { label: '能源感知', value: 'EnergyAwareness' },
  { label: '环境感知', value: 'EnvironmentalAwareness' },
  { label: '消防安全', value: 'FireSafety' },
  { label: '家居安防', value: 'HomeSecurity' },
  { label: '环境电器', value: 'EnvironmentalAppliances' },
  { label: '电工照明', value: 'ElectricianLighting' },
  { label: '厨房电器', value: 'KitchenAppliances' },
  { label: '个护健康', value: 'ProtectHealth' },
  { label: '生活电器', value: 'HouseholdAppliances' },
  { label: '纺织业',   value: 'TextileIndustry' },
  { label: '气表制造', value: 'GasMeterManufacturing' },
  { label: '智慧工业', value: 'IntelligentIndustry' },
  { label: '智慧园区', value: 'SmartPark' },
  { label: '零售设备', value: 'RetailEquipment' },
  { label: '共享租赁', value: 'sharedLease' },
  { label: '数字门店', value: 'DigitalStores' },
  { label: '智慧楼宇', value: 'SmartBuilding' },
  { label: '智慧交通', value: 'SmartTransportation' },
  { label: '智慧物流', value: 'SmartLogistics' },
  { label: '健康管理', value: 'HealthManagement' },
  { label: '智慧教育', value: 'IntelligentEducation' },
  { label: '能源电力', value: 'EnergyPower' },
  { label: '智慧社区', value: 'SmartCommunity' },
  { label: '其它行业', value: 'Other' },
];

// 显示功能项抽屉柜
const showItemDrawer = ref(false)

const handleCreateItem = () => {
  showItemDrawer.value = true
}

</script>

<style>

</style>