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
      <t-table row-key="index" :columns="propertyColumns" :data="propertyData" hover bordered>
        <template #op="{ row }">
          <t-space>
            <t-link theme="primary" hover="color">查看</t-link>
            <t-link theme="primary" hover="color">编辑</t-link>
            <t-link theme="primary" hover="color">删除</t-link>
          </t-space>
        </template>
      </t-table>

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
              <t-range-input v-model="itemFormData.range" :inputProps="rangeInputProps"  placeholder=" "/>
            </t-form-item>
            <t-form-item label="数据精度">
              <t-input v-model="itemFormData.step" placeholder="请输入数据精度" />
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
              <t-range-input v-model="itemFormData.binary" :inputProps="binaryInputProps" placeholder=" "/>
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
                    <t-button shape="square" variant="text" theme="danger" @click="handleRemoveItemEnum(i)">
                      <remove-icon slot="icon" />
                    </t-button>
                  </t-col>
                </t-row>
                <t-row>
                  <t-col :span="12">
                    <t-link theme="primary" hover="color" @click="handleCreateItemEnum">
                      <add-icon slot="prefix-icon" size="large"></add-icon>
                      添加枚举项
                    </t-link>
                  </t-col>
                </t-row>
              </div>
            </t-form-item>
          </div>

          <!-- struct特有 -->
          <div v-else-if="itemFormData.dataType == 'struct'">
            <t-form-item label="结构体对象" name="struct">
              <div class="w-full mt-2">
                <t-row v-for="(item, i) in itemFormData.struct" :key="i" class="bg-light-300 text-gray-400 px-3 py-1 font-xs mb-2">
                  <t-col :span="3">{{ item.name }}</t-col>
                  <t-col :span="3">{{ item.code }}</t-col>
                  <t-col :span="3">{{ item.type }}</t-col>
                  <t-col :span="3" class="flex justify-end">
                    <t-link theme="primary" hover="color" @click="handleEditJson(i)">编辑</t-link>
                    <p class="px-2">/</p> 
                    <t-link theme="primary" hover="color" @click="handleRemoveJson(i)">删除</t-link>
                  </t-col>
                </t-row>
                <t-row class="mt-1">
                  <t-col :span="12">
                    <t-link theme="primary" hover="color" @click="handleCreateItemStruct">
                      <add-icon slot="prefix-icon" size="large"></add-icon>
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

            <t-form-item label="元素个数" name="arraySize">
              <t-input v-model="itemFormData.arraySize" placeholder="请输入元素个数" />
            </t-form-item>

            <!-- int/float特有 -->
            <div v-if="itemFormData.arrayType == 'int' || itemFormData.arrayType == 'float'">
              <t-form-item label="取值范围" name="range">
                <t-range-input v-model="itemFormData.range" :inputProps="rangeInputProps" placeholder=" "/>
              </t-form-item>
              <t-form-item label="数据精度">
                <t-input v-model="itemFormData.step" placeholder="请输入数据精度" />
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
                <t-range-input :inputProps="binaryInputProps" placeholder=" "/>
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
                      <t-button shape="square" variant="text" theme="danger" @click="handleRemoveItemEnum(i)">
                        <remove-icon slot="icon" />
                      </t-button>
                    </t-col>
                  </t-row>
                  <t-row>
                    <t-col :span="12">
                      <t-link theme="primary" hover="color" @click="handleCreateItemEnum">
                        <add-icon slot="prefix-icon" size="large"></add-icon>
                        添加枚举项
                      </t-link>
                    </t-col>
                  </t-row>
                </div>
              </t-form-item>
            </div>

            <!-- struct特有 -->
            <div v-else-if="itemFormData.arrayType == 'struct'">
              <t-form-item label="结构体对象" name="json">
                <div class="w-full mt-2">
                  <t-row v-for="(item, i) in itemFormData.struct" :key="i" class="bg-light-300 text-gray-400 px-3 py-1 font-xs mb-2">
                    <t-col :span="3">{{ item.name }}</t-col>
                    <t-col :span="3">{{ item.code }}</t-col>
                    <t-col :span="3">{{ item.type }}</t-col>
                    <t-col :span="3" class="flex justify-end">
                      <t-link theme="primary" hover="color" @click="handleEditJson(i)">编辑</t-link>
                      <p class="px-2">/</p> 
                      <t-link theme="primary" hover="color" @click="handleRemoveJson(i)">删除</t-link>
                    </t-col>
                  </t-row>
                  <t-row class="mt-1">
                    <t-col :span="12">
                      <t-link theme="primary" hover="color" @click="handleCreateItemStruct">
                        <add-icon slot="prefix-icon" size="large"></add-icon>
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
          </div>
        </div>

        <!-- 事件项 -->
        <div v-else-if="itemFormData.action == 'event'">
          <t-form-item label="事件类型" name="eventType">
            <t-select v-model="itemFormData.eventType" :options="eventTypeOptions"></t-select>
          </t-form-item>

          <t-form-item label="输出参数" name="eventOutput">
            <div class="w-full mt-2">
              <t-row class="mt-1">
                <t-col :span="12">
                  <t-link theme="primary" hover="color">
                    <add-icon slot="prefix-icon" size="large"></add-icon>
                    添加参数
                  </t-link>
                </t-col>
              </t-row>
            </div>
          </t-form-item>
        </div>

        <!-- 服务项 -->
        <div v-else-if="itemFormData.action == 'service'">
        服务项
        </div>
        
        <!-- 共有的 -->
        <div class="mt-6">
          <t-form-item label="描述信息">
            <t-textarea v-model="itemFormData.description" placeholder="请输入描述信息" :autosize="{ minRows: 4 }" />
          </t-form-item>
        </div>
      </t-form>

      <template #footer>
        <div class="flex justify-end">
          <t-button @click="handleItemConfirm">确定</t-button>
          <t-button variant="outline" @click="showItemDrawer = false"> 取消 </t-button>
        </div>
      </template>
      
    </t-drawer>

    <!-- 添加结构体参数 -->
    <t-drawer v-model:visible="showStructDrawer" size="450">
      <template #header>
        <p class="text-sm font-bold">添加结构体参数</p>
      </template>

      <!-- 结构体表单 -->
      <t-form :rules="STRUCT_FORM_RULES" :data="structFormData" label-align="top">
        <!-- 结构体共有属性 -->
        <t-form-item label="功能名称" name="name">
          <t-input v-model="structFormData.name" placeholder="1-32位，中文、英文、数字及特殊字符_-，必须以中文或英文字符开头" />
        </t-form-item>
        
        <t-form-item label="标识符" name="code">
          <t-input v-model="structFormData.code" placeholder="1-32位，支持英文、数字及特殊字符_-，必须以英文字符开头" />
        </t-form-item>
        
        <t-form-item label="数据类型" name="dataType">
          <t-select v-model="structFormData.type" :options="structTypeOptions"></t-select>
        </t-form-item>

        <!-- int float 特有 -->
        <div v-if="structFormData.type == 'int' || structFormData.type == 'float'">
          <t-form-item label="取值范围" name="range">
            <t-range-input v-model="structFormData.range" :inputProps="rangeInputProps" placeholder=" "/>
          </t-form-item>
          <t-form-item label="数据精度">
            <t-input v-model="structFormData.step" placeholder="请输入数据精度" />
          </t-form-item>
          <t-form-item label="数据单位">
            <t-select v-model="structFormData.uint" :options="uintOptions"></t-select>
          </t-form-item>
        </div>

        <!-- string特有 -->
        <div v-else-if="structFormData.type == 'string'">
          <t-form-item label="数据长度" name="length">
            <t-input v-model="structFormData.length" placeholder="请输入数据长度" /> <p class="min-w-[30px] ml-2">字符</p>
          </t-form-item>
        </div>
        
        <!-- bool特有 -->
        <div v-else-if="structFormData.type == 'bool'">
          <t-form-item label="布尔值" name="binary">
            <t-range-input v-model="structFormData.binary" :inputProps="binaryInputProps"/>
          </t-form-item>
        </div>

        <!-- enum特有 -->
        <div v-else-if="structFormData.type == 'enum'">
          <t-form-item label="枚举项" name="enums">
            <div class="w-full mt-2">
              <t-row class="mb-4 font-bold">
                <t-col :span="4">参数值</t-col>
                <t-col :span="8">参数描述</t-col>
              </t-row>
              <t-row v-for="(item, i) in structFormData.enums" :key="i" :gutter="[0]" class="mb-4">
                <t-col :span="3">
                  <t-input v-model="item.k" placeholder="整数"/>
                </t-col>
                <t-col :span="7" :offset="1">
                  <t-input v-model="item.v" placeholder="1-20位，中文、英文、数字及特殊字符"/>
                </t-col>
                <t-col :span="1">
                  <t-button shape="square" variant="text" theme="danger" @click="handleRemoveStructEnum(i)">
                    <remove-icon slot="icon" />
                  </t-button>
                </t-col>
              </t-row>
              <t-row>
                <t-col :span="12">
                  <t-link theme="primary" hover="color" @click="handleCreateStructEnum">
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
          <t-button @click="handleStructConfirm">确定</t-button>
          <t-button variant="outline" @click="showStructDrawer = false"> 取消 </t-button>
        </div>
      </template>
    </t-drawer>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeftIcon, AddIcon, RemoveIcon } from 'tdesign-icons-vue-next'

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

const structTypeOptions = [
  { label: 'int(整数型)', value: 'int'},
  { label: 'float(浮点型)', value: 'float' },
  { label: 'string(字符串)', value: 'string' },
  { label: 'bool(布尔)', value: 'bool' },
  { label: 'enum(枚举)', value: 'enum' },
]

const rangeInputProps = [{ label: '最小值:', name: 'min' }, { label: '最大值:', name: 'max' }]
const binaryInputProps = [{ label: 'true:', name: 'min' }, { label: 'false:', name: 'max' }]

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

const eventTypeOptions = [
  { label: '信息', value: 'info'},
  { label: '告警', value: 'warn' },
  { label: '故障', value: 'error' },
]

const propertyColumns = [
  {colKey: 'name', title: '名称'},
  {colKey: 'code', title: '标识符'},
  {colKey: 'dataType', title: '数据类型'},
  {colKey: 'accessMode', title: '读写类型'},
  {colKey: 'op', title: '操作', align: 'center'},
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

// 功能项校验
const ITEM_FORM_RULES = {
  action: [{ required: true, message: '请选择功能项' }],
  code: [{ required: true, message: '请输入功能代码' }],
  name: [{ required: true, message: '请输入功能项目名称' }],

  range: [{ required: true, message: '请输入数据范围' }],
  length: [{ required: true, message: '请输入数据长度' }],
  binary: [{ required: true, message: '请输入布尔值的含义' }],
  enums: [{ required: true, message: '请设置枚举项' }],
  struct: [{ required: true, message: '请添加结构体参数' }],
  arrayType: [{ required: true, message: '请选择元素类型' }],
  arraySize: [{ required: true, message: '元素个数不能为空' }],

  accessMode: [{ required: true, message: '请选择读写方式' }],
  dataType: [{ required: true, message: '请选择数据类型' }],

  // 事件
  eventType: [{ required: true, message: '请选择事件类型' }],
  eventOutput: [{ required: true, message: '请填写事件输出参数' }],
}

// 功能项表单
const itemFormData = reactive({
  action: 'property',
  name: '',
  code: '',
  dataType: 'int',

  // 整数 or 浮点数
  range: [],
  step: '',
  uint: '',

  // 字符串长度 
  length: '',
  
  // 布尔
  binary: [],

  // 枚举
  enums: [],

  // 数组
  arrayType: 'int',
  arraySize: '',

  // 结构体
  struct: [],

  // 事件
  eventType: 'info',

  accessMode: 'rw',
  description: '',
})

// 功能项添加枚举类型
const handleCreateItemEnum = () => {
  itemFormData.enums.push({})
}

// 功能项删除枚举类型
const handleRemoveItemEnum = (i) => {
  itemFormData.enums.splice(i, 1)
}

// 显示结构体抽屉柜
const showStructDrawer = ref(false)

// 添加结构体参数
const handleCreateItemStruct = () => {
  const keys = Object.keys(structFormData)
  let obj = {}
  keys.forEach(item => {
    obj[item] = ' '
  })
  
  obj['type'] = 'int'
  obj['range'] = [,]
  obj['binary'] = []
  obj['enums'] = []

  Object.assign(structFormData, obj)

  showStructDrawer.value = true
}

// 结构体表单校验
const STRUCT_FORM_RULES = {
  name: [{ required: true, message: '请输入功能名称' }],
  code: [{ required: true, message: '请输入功能代码' }],
  dataType: [{ required: true, message: '请选择数据类型' }],
  range: [{ required: true, message: '请输入数据范围' }],
  length: [{ required: true, message: '请输入数据长度' }],
  binary: [{ required: true, message: '请输入布尔值的含义' }],
  enums: [{ required: true, message: '请设置枚举项' }],
  struct: [{ required: true, message: '请添加结构体参数' }],
  accessMode: [{ required: true, message: '请选择读写方式' }],
}

// 结构体表单数据
const structFormData = reactive({
  name: '',
  code: '',
  type: 'int',
  length: '',
  range: [],
  step: '',
  binary: [],
  uint: '',
  enums: []
})

// 添加结构体表单中的枚举
const handleCreateStructEnum = () => {
  structFormData.enums.push({})
}

// 删除结构体表单中的枚举
const handleRemoveStructEnum = (i) => {
  structFormData.enums.splice(i, 1)
}

// 结构体编辑状态及索引
let structEditStatus = false
let structEditIdx = 0

// 编辑结构体回显
const handleEditJson = (i) => {
  Object.assign(structFormData, itemFormData.struct[i])
  showStructDrawer.value = true
  
  structEditStatus = true
  structEditIdx = i
}

// 删除结构体
const handleRemoveJson = (i) => {
  itemFormData.struct.splice(i, 1)
}

// 结构体编辑
const parseStructForm = () => {
  if(structFormData.type == 'int' || structFormData.type == 'float') {
    return {
      min: structFormData.range[0],
      max: structFormData.range[1],
      step: structFormData.step,
      unit: structFormData.unit ? structFormData.unit : '',
    }
  } else if(structFormData.type == 'string') {
    return {
      length: structFormData.length
    }
  } else if(structFormData.type == 'bool') {
    return {
      truer: structFormData.binary[0],
      falser: structFormData.binary[1]
    }
  } else if(structFormData.type == 'enum') {
    return {
      item: {...structFormData.enums}
    }
  }
}
const handleStructConfirm = () => {
  // 解析结构体字段
  const s = {
      name: structFormData.name,
      code: structFormData.code,
      type: structFormData.type,
      ...parseStructForm()
  }

  if(structEditStatus == true) {
    // 如果是编辑状态
    Object.assign(itemFormData.struct[structEditIdx], {...s})

    structEditStatus = false
    structEditIdx = 0
  } else {
    itemFormData.struct.push({...s})
  }

  const keys = Object.keys(structFormData)
  let obj = {}
  keys.forEach(item => {
    obj[item] = ''
  })

  obj['type'] = 'int'
  obj['range'] = [,]
  obj['binary'] = []
  obj['enums'] = []

  Object.assign(structFormData, obj)

  showStructDrawer.value = false
}

// 解析数组类型
const parseArray = () => {
  if(itemFormData.arrayType == 'int' || itemFormData.arrayType == 'float') {
    return {
      min: itemFormData.range[0],
      max: itemFormData.range[1],
      step: itemFormData.step,
      unit: itemFormData.unit ? itemFormData.unit : '',
    }
  } else if(itemFormData.arrayType == 'string') {
    return {
      length: itemFormData.length
    }
  } else if(itemFormData.arrayType == 'bool') {
    return {
      truer: itemFormData.binary[0],
      falser: itemFormData.binary[1]
    }
  } else if(itemFormData.arrayType == 'enum') {
    return {
      item: {...itemFormData.enums}
    }
  } else if(itemFormData.arrayType == 'struct') {
    return {
      item: {...itemFormData.struct}
    }
  }
}

// 解析属性项
const parsePropertyForm = () => {
  if(itemFormData.dataType == 'int' || itemFormData.dataType == 'float') {
    return {
      min: itemFormData.range[0],
      max: itemFormData.range[1],
      step: itemFormData.step,
      unit: itemFormData.unit ? itemFormData.unit : '',
    }
  } else if(itemFormData.dataType == 'string') {
    return {
      length: itemFormData.length
    }
  } else if(itemFormData.dataType == 'bool') {
    return {
      truer: itemFormData.binary[0],
      falser: itemFormData.binary[1]
    }
  } else if(itemFormData.dataType == 'enum') {
    return {
      item: {...itemFormData.enums}
    }
  } else if(itemFormData.dataType == 'struct') {
    return {
      item: {...itemFormData.struct}
    }
  } else if(itemFormData.dataType == 'array') {
    return {
      type: itemFormData.arrayType,
      size: itemFormData.arraySize,
      ...parseArray()
    }
  }
}

const propertyData = reactive([])

// 添加功能项事件
const handleItemConfirm = () => {
  const property = {
    name: itemFormData.name,
    code: itemFormData.code,
    accessMode: itemFormData.accessMode,
    dataType: {
      type: itemFormData.dataType,
      specs: {
        ...parsePropertyForm()
      }
    },
    description: itemFormData.description
  }

  console.log(JSON.stringify(property))

  propertyData.push({
    name: property.name,
    code: property.code,
    dataType: property.dataType.type,
    accessMode: property.accessMode == 'r' ? '只读' : '读写'
  })

  // 清空功能项
  {
    const keys = Object.keys(itemFormData)
    let obj = {}
    keys.forEach(item => {
      obj[item] = ' '
    })
    
    obj['action'] = 'property'
    obj['dataType'] = 'int'
    obj['range'] = [,]
    obj['binary'] = []
    obj['enums'] = []
    obj['struct'] = []
    obj['arrayType'] = 'int'
    obj['accessMode'] = 'rw'

    Object.assign(itemFormData, obj)
  }
  
  // 清空字符串结构体
  {
    const keys = Object.keys(structFormData)
    let obj = {}
    keys.forEach(item => {
      obj[item] = ''
    })
    
    obj['type'] = 'int'
    obj['range'] = [,]
    obj['binary'] = []
    obj['enums'] = []

    Object.assign(structFormData, obj)
  }

  showItemDrawer.value = false
}

</script>

<style>

</style>