import JSON5 from 'json5'
import type { GeneratorVueOptions } from './'

export function templateVue(item: GeneratorVueOptions) {
  let haveSwitch = false
  const columns: any = item.field.map((field) => {
    if (field.type === 'switch') {
      haveSwitch = true
    }
    return `
    {
      title: "${field.name}",
      dataIndex: "${field.value}",
      filterable:filterable('${field.name}', '${field.value}')
      ${field.type === 'switch'
        ? `render({ ${field.value} }:any){
            return h(Switch, {
                checked: ${field.value},
                disabled: true,
              })
          }`
        : ''}
    }
    `
  })
  const constName = item.filename.charAt(0).toUpperCase() + item.filename.slice(1)
  return `
  import React, { useImperativeHandle, forwardRef, useRef, useState, useEffect } from 'react';
import { Button, theme, App,  Input } from 'antd';
import Title from '~/common/Title';
import CustomTable from '~/common/Table';
import CustomModal from '~/common/Modal';
import * as req from '~/class/request';
import Add from './Add';
const Index = (_props: any, ref: any) => {
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const { message, modal } = App.useApp();
  const tableRef: any = useRef(null);
  const [open, setOpen] = useState<boolean>(false);
  const [row, setRow] = useState<any>({});
  const [type, setType] = useState<string>('');
  const [username, setUserName] = useState<string>('');
  // 列表
  const columns = [
    {
      title: 'ID',
      align: 'center',
      dataIndex: 'id',
      width: 90,
    },
    {
      title: '操作',
      dataIndex: 'id',
      align: 'center',
      render: (id: number, item: any) => (
        <div className='flexAllCenter pubbtnbox'>
          <p style={{ color: colorPrimary }} onClick={() => {
            setRow(item)
            setType('edit');
            setOpen(true)
          }}>编辑</p>
          <p style={{ color: colorPrimary }} onClick={() => del(item)}>删除</p>
        </div>
      )
    }
  ]
  useEffect(() => {
    refresh()
  }, [username])
  useImperativeHandle(ref, () => ({
    refresh,
  }))
  const refresh = () => {
    tableRef.current.onRefresh()
  }
  // 获取列表数据
  const getList = (info: any, callback: any) => {
    req.post('config/chargeConfigList', {
      page: info.page,
      size: info.size,
      orderBy: 'desc',
    }).then(res => {
      callback(res)
    })
  }
  // 首次进入页面初始化
  const onRefresh = (info: { page: number, size: number }, callback: () => void) => {
    getList(info, callback)
  }
  const onCancel = () => {
    setOpen(false);
    setRow({});
    setType('')
  }
  // 删除
  const del = (data: any) => {
    modal.confirm({
      title: '警告提示',
      content: '您要删除该项数据吗？删除后将无法恢复！',
      centered: true,
      maskClosable: true,
      onOk: () => {
        req.post('config/delChargeConfig', { id: data.id }).then(res => {
          if (res.code == 1) {
            refresh()
          } else {
            message.error(res.msg, 1.2);
          }
        })
      }
    })
  }
  return (
    <React.Fragment>
      <div className='h100 flexColumn'>
        <div className='flwp'>
          <Input
            className='pubInpt borderbai marginr12'
            prefix={(<span className='iconfont icon-sousuo marginr4'></span>)}
            placeholder='请输入姓名'
            allowClear
            onChange={(e) => {
              setUserName(e.target.value || '');
            }}
          />

          <Button type="primary" onClick={() => {
            setOpen(true);
          }}>添加配置</Button>
        </div>
        <div className='bgbai margt20 flex_auto'>
          <Title title='充值配置' />
          <CustomTable
            ref={tableRef}
            columns={columns}
            onRefresh={onRefresh}
            scroll={{ y: window.innerHeight - 368 }}
          />
        </div>
      </div>
      {/* 添加/编辑 */}
      <CustomModal
        open={open}
        width={360}
        onCancel={onCancel}
        title={(<Title title={`${type === 'edit' ? '编辑' : '添加'}支付方式`} />)}
      >
        <Add type={type} data={row} onOk={() => {
          setOpen(false);
          refresh()
        }} />
      </CustomModal>
    </React.Fragment>
  )
};

export default forwardRef(Index);
`
}

export function templateModalVue(item: GeneratorVueOptions) {
  const columns: any = item.field.map((field) => {
    return {
      label: field.name,
      field: field.value,
      type: field.type,
    }
  })
  return `
<script setup lang='ts'>
const props = defineProps<{
  type: string
  data: any
}>()
const emit = defineEmits(['ok', 'cancel'])
const { data } = toRefs(props)
const form = reactive<any>(data.value || {})
const fields = ${JSON5.stringify(columns)}

const formRef = ref<any>()

async function handleBeforeOk() {
  const isValid = await formRef.value.validate()
  if (!isValid) {
    Message.success({
      content: '操作成功',
      duration: 1500,
      onClose() {
        emit('ok', form)
      },
    })
  }
}

function cancel() {
  emit('cancel')
}
</script>

<template>
  <a-modal
    :title="type === 'edit' ? '编辑' : '新增'" unmount-on-close esc-to-close visible
    @before-ok="handleBeforeOk" @cancel="cancel"
  >
    <CommonForm ref="formRef" :data="form" :fields="fields" />
  </a-modal>
</template>

`
}

// 根据类型使用faker生成对应的mock数据
function getFakerType(type: string) {
  switch (type) {
    case 'string':
      return 'faker.commerce.product()'
    case 'number':
      return 'faker.number.float({ min: 100, max: 900, fractionDigits: 3 })'
    case 'switch':
      return 'faker.random.boolean()'
    case 'date':
      return 'dayjs(faker.date.recent()).format("YYYY-MM-DD HH:mm:ss")'
    case 'dateTime':
      return 'dayjs(faker.date.recent()).format("YYYY-MM-DD HH:mm:ss")'
    default:
      return 'faker.commerce.product()'
  }
}
