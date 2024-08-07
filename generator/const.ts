import type { GeneratorVueOptions } from './'

export function templateVue(item: GeneratorVueOptions) {

  const needSearch: any[] = []

  const columns: any = item.field.map((field) => {
    if (field.search) {
      needSearch.push(field)
    }
    switch (field.type) {
      case 'switch':
        return `
        {
          title: "${field.name}",
          dataIndex: "${field.value}",
          render: (${field.value}: number) => {
            return ${field.value} == 0 ? (<Tag color="gold">否</Tag>) : (<Tag color="red-inverse">是</Tag>);
          }
        }
        `
      case 'image':
        return `
        {
          title: "${field.name}",
          dataIndex: "${field.value}",
          render({ ${field.value} }:string){
            <Image
              width={60}
              src={${field.value}}
            />
          }
        }`
      default:
        return `
        {
          title: "${field.name}",
          align: 'center',
          dataIndex: "${field.value}",
        }
        `
    }
  })
  const constName = item.filename.charAt(0).toUpperCase() + item.filename.slice(1)
  return `
  import React, { useImperativeHandle, forwardRef, useRef, useState, useEffect } from 'react';
import { Button, theme, App,  Input,Image,Tag,DatePicker,Select } from 'antd';
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
  ${needSearch.map((field) => {
    if (field.type === 'datetime') {
      return `
          const [startTime, setStartTime] = useState<string>('');
          const [endTime, setEndTime] = useState<string>('');

          const { RangePicker } = DatePicker;
      `
    }
    else {
      return `const [${field.value}, set${field.value.charAt(0).toUpperCase() + field.value.slice(1)}] = useState<any>();`
    }
  }).join('\n')}

  // 列表
  const columns = [
    {
      title: 'ID',
      align: 'center',
      dataIndex: 'id',
      width: 90,
    },
    ${columns},
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
  }, ${needSearch.map((field) => {
    if (field.type === 'datetime') {
      return `startTime,endTime`
    } else
      return `${field.value}`
  })}
  useImperativeHandle(ref, () => ({
    refresh,
  }))
  const refresh = () => {
    tableRef.current.onRefresh()
  }
  // 获取列表数据
  const getList = (info: any, callback: any) => {
    req.post('${item.listApi}', {
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
        req.post('${item.curdApi.replace(/%/, 'del')}', { id: data.id }).then(res => {
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
          
          ${needSearch.map((field) => {
    if (field.type === 'switch') {
      return `
                    <Select
                    className='pubInpt borderbai marginr12'
                    placeholder='请选择${field.name}'
                    allowClear
                    options={[
                      { value: 1, label: '是' },
                      { value: 0, label: '否' },
                    ]}
                    onChange={(value) => {
                      set${field.value.charAt(0).toUpperCase() + field.value.slice(1)}(value);
                    }
                    }>
                  </Select>
                  `

    } else if (field.type === 'datetime') {
      return `
          <RangePicker
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            className='pubInpt borderbai marginr12'
            style={{
              width: '340px'
            }}
            onChange={(e) => {
              if (Array.isArray(e) && e?.length > 0) {
                let time = e
                setStartTime(time[0]!.format('YYYY-MM-DD HH:mm:ss'));
                setEndTime(time[1]!.format('YYYY-MM-DD HH:mm:ss'));
              }else{
                setStartTime('')
                setEndTime('')
              }
            }}
          />`
    } else {
      return `
                    <Input
                    className='pubInpt borderbai marginr12'
                    prefix={(<span className='iconfont icon-sousuo marginr4'></span>)}
                    placeholder='请输入${field.name}'
                    allowClear
                    onChange={(e) => {
                      set${field.value.charAt(0).toUpperCase() + field.value.slice(1)}(e.target.value || '');
                    }}
                  />
                  `
    }
  }).join('\n')}

          <Button type="primary" onClick={() => {
            setOpen(true);
          }}>添加配置</Button>
        </div>
        <div className='bgbai margt20 flex_auto'>
          <Title title='${item.menuname}' />
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
        title={(<Title title={\`$\{type === 'edit' ? '编辑' : '添加'}${constName}\`} />)}
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

