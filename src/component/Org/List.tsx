
import React, { useImperativeHandle, forwardRef, useRef, useState, useEffect } from 'react';
import { Button, theme, App, Input, Image, Tag, DatePicker, Select, Table, Empty } from 'antd';
import Title from '~/common/Title';
import CustomTable from '~/common/Table';
import CustomModal from '~/common/Modal';
import * as req from '~/class/request';
import Add from './Add';
import { orgTreeAtom } from '~/store/atom';
import { useAtomValue } from 'jotai';
const Index = (_props: any, ref: any) => {
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const { message, modal } = App.useApp();
  const tableRef: any = useRef(null);
  const [open, setOpen] = useState<boolean>(false);
  const [row, setRow] = useState<any>({});
  const [type, setType] = useState<string>('');
  const [name, setName] = useState<any>();
  const org = useAtomValue(orgTreeAtom)
  const [data, setData] = useState<any>([])
  // 列表
  const columns: any = [
    {
      title: 'ID',
      align: 'center',
      dataIndex: 'id',
      width: 150,
    },
    {
      title: "名称",
      align: 'center',
      dataIndex: "name",
    }
    ,
    {
      title: "负责人",
      align: 'center',
      dataIndex: "principal",
    }
    ,
    {
      title: '操作',
      dataIndex: 'id',
      align: 'center',
      render: (id: number, item: any) => {
        if (item.pid !== 0) {
          return <div className='flexAllCenter pubbtnbox'>
            <p style={{ color: colorPrimary }} onClick={() => {
              setRow(item)
              setType('edit');
              setOpen(true)
            }}>编辑</p>
            <p style={{ color: colorPrimary }} onClick={() => del(item)}>删除</p>
          </div>
        }
      }
    }
  ]


  useEffect(() => {
    console.log("🚀 ~ useEffect ~ org:", org)
    if (org?.id) {
      console.log("🚀 ~ useEffect ~ org:", org)
      setData([org])
    } else {
      setData([])
    }
  }, [org])

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
        req.post('Department/delDepartment', { id: data.id }).then(res => {
          if (res.code == 1) {
            // refresh()
          } else {
            message.error(res.msg, 1.2);
          }
        })
      }
    })
  }
  const [loading, setLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  return (
    <React.Fragment>
      <div className='h100 flexColumn'>
        <div className='flwp'>

          <Input
            className='pubInpt borderbai marginr12 !w-50'
            prefix={(<span className='iconfont icon-sousuo marginr4'></span>)}
            placeholder='请输入名称'
            allowClear
            onChange={(e) => {
              setName(e.target.value || '');
            }}
          />
          {org.id && <Button type="primary" onClick={() => {
            setOpen(true);
            setRow({
              pid: org.id
            })
            setType('add')
          }}>添加部门</Button>}
        </div>
        <div className='bgbai margt20 ' style={_props.style}>
          <Title title='组织架构' />
          <Table
            ref={tableRef}
            className={` margl24 margr24  `}
            loading={loading}
            columns={columns}
            // indentSize={10}
            pagination={{
              position: ["bottomLeft"],
              pageSize: 10,
              current: page,
              total: data.length,
              hideOnSinglePage: true,
              showSizeChanger: false,
              showTotal: (total, range) => {
                let num: any = range[0]
                let num1: any = range[1]
                num = num < 10 ? ('0' + num) : num;
                num1 = num1 < 10 ? ('0' + num1) : num1;
                return `共${total}条记录，本页展示${num}-${num1}条记录`
              }
            }}
            dataSource={data}
            onChange={(page, filters, sorter: any) => {
              var orderBy = "";
              if (sorter.order) {
                if (sorter.order == "ascend") {
                  orderBy = "asc";
                } else if (sorter.order == "descend") {
                  orderBy = "desc";
                }
              }
              setPage(page.current || 1)
              // getList()
            }}
            scroll={{ y: window.innerHeight - 368 }}
          />
        </div>
      </div>
      {/* 添加/编辑 */}
      <CustomModal
        open={open}
        width={360}
        onCancel={onCancel}
        title={(<Title title={`${type === 'edit' ? '编辑' : '添加'}组织架构`} />)}
      >
        <Add type={type} data={row} onOk={() => {
          setOpen(false);
          // refresh()
          if (_props.getList) {
            _props.getList(org)
          }
        }} />
      </CustomModal>
    </React.Fragment>
  )
};

export default forwardRef(Index);
