
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
  

  // 列表
  const columns = [
    {
      title: 'ID',
      align: 'center',
      dataIndex: 'id',
      width: 90,
    },
    
        {
          title: "cc",
          align: 'center',
          dataIndex: "cc",
        }
        ,
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

  
  




  useImperativeHandle(ref, () => ({
    refresh,
  }))
  const refresh = () => {
    tableRef.current.onRefresh()
  }
  // 获取列表数据
  const getList = (info: any, callback: any) => {
    req.post('cc', {
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
        req.post('cc', { id: data.id }).then(res => {
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
          
          

          <Button type="primary" onClick={() => {
            setOpen(true);
          }}>添加配置</Button>
        </div>
        <div className='bgbai margt20 flex_auto'>
          <Title title='ce' />
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
        title={(<Title title={`${type === 'edit' ? '编辑' : '添加'}ce`} />)}
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
