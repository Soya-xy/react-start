
import React, { useImperativeHandle, forwardRef, useRef, useState, useEffect } from 'react';
import { Button, theme, App, Input, Image, Tag, DatePicker, Select } from 'antd';
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
  const [departmentName, setDepartmentName] = useState<any>();
  const [status, setStatus] = useState<any>();

  // 列表
  const columns = [
    {
      title: 'ID',
      align: 'center',
      dataIndex: 'id',
      width: 90,
    },

    {
      title: "部门",
      align: 'center',
      dataIndex: "departmentName",
    }
    ,
    {
      title: "状态",
      align: 'center',
      dataIndex: "status",
    }
    ,
    {
      title: "绩效计划",
      align: 'center',
      dataIndex: "content",
    }
    ,
    {
      title: "完成情况",
      align: 'center',
      dataIndex: "complete_info",
    }
    ,
    {
      title: "任务进度",
      align: 'center',
      dataIndex: "complete_progress",
    }
    ,
    {
      title: "最后期限",
      align: 'center',
      dataIndex: "end_date",
    }
    ,
    {
      title: "审核意见",
      align: 'center',
      dataIndex: "remarks",
    }
    ,
    {
      title: "提交时间",
      align: 'center',
      dataIndex: "sub_time",
    }
    ,
    {
      title: "审核时间",
      align: 'center',
      dataIndex: "audit_time",
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



  useEffect(() => {
    refresh()
  }, [departmentName, status])





  useImperativeHandle(ref, () => ({
    refresh,
  }))
  const refresh = () => {
    tableRef.current.onRefresh()
  }
  // 获取列表数据
  const getList = (info: any, callback: any) => {
    req.post('myPerformance/taskList', {
      page: info.page,
      size: info.size,
      orderBy: 'desc',
      departmentName,
      status,
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
        req.post('myPerformance/deltask', { id: data.id }).then(res => {
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
            placeholder='请输入部门'
            allowClear
            onChange={(e) => {
              setDepartmentName(e.target.value || '');
            }}
          />


          <Input
            className='pubInpt borderbai marginr12'
            prefix={(<span className='iconfont icon-sousuo marginr4'></span>)}
            placeholder='请输入状态'
            allowClear
            onChange={(e) => {
              setStatus(e.target.value || '');
            }}
          />


          <Button type="primary" onClick={() => {
            setOpen(true);
          }}>添加配置</Button>
        </div>
        <div className='bgbai margt20 flex_auto'>
          <Title title='绩效任务' />
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
        title={(<Title title={`${type === 'edit' ? '编辑' : '添加'}绩效任务`} />)}
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
