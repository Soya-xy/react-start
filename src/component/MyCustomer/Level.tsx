
import React, { useImperativeHandle, forwardRef, useRef, useState, useEffect } from 'react';
import { Button, theme, App, Input, Image, Tag, DatePicker, Select, Popover, Popconfirm } from 'antd';
import Title from '~/common/Title';
import CustomTable from '~/common/Table';
import CustomModal from '~/common/Modal';
import * as req from '~/class/request';
import Add from './Add';
import { customerStatus, loanCondition, starType } from '~/utils/const';
import { SearchContent } from '~/utils/content';
import { useAtomValue } from 'jotai';
import { userAtom } from '~/store/atom';
import AdminSelect from '../AdminSelect';
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
  const [gender, setGender] = useState<any>();
  const [star, setStar] = useState<any>();
  const [status, setStatus] = useState<any>();
  const [remark, setRemark] = useState<any>();
  const [no_remark, setNoRemark] = useState<any>();
  const { RangePicker } = DatePicker;

  const [longType, setLongtype] = useState<number>(0);
  const [longStatus, setLongStatus] = useState<number>(0);
  const [date, setDate] = useState<number>(0);
  const [date_section, setDateSection] = useState<string>('');
  const [is_lock, setLock] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [house, setHouse] = useState<string>('');
  const [quota, setQuota] = useState<number>(0);
  const [loan, setLoan] = useState<number>(0);
  const userId = useAtomValue(userAtom)

  const [phone, setPhone] = useState<string>('')
  const [id, setId] = useState<string>('')

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const hasSelected = selectedRowKeys.length > 0;

  function statusNode(value: string) {
    return value == 'o' ? (<Tag color="gold">未设置</Tag>) : (value == 'n' ? (<Tag color="gold">无</Tag>) : (<Tag color="blue">有</Tag>));
  }
  // 列表
  const columns = [
    {
      title: 'ID',
      align: 'center',
      dataIndex: 'id',
      width: 90,
    },

    {
      title: "姓名",
      align: 'center',
      dataIndex: "name",
    }
    ,
    {
      title: "性别",
      align: 'center',
      dataIndex: "gender",
      render: (gender: string) => {
        return gender == 'women' ? '女' : '男';
      }
    }

    ,
    {
      title: "状态",
      align: 'center',
      dataIndex: "status",
      render: (status: string) => {
        return customerStatus.find((item: any) => item.value == status)?.label || '';
      }
    },
    {
      title: "星级",
      align: 'center',
      dataIndex: "star",
      render: (star: string) => {
        return star + '星'
      }
    }
    ,
    {
      title: "年龄",
      align: 'center',
      dataIndex: "age",
    }
    ,
    {
      title: "备注",
      align: 'center',
      dataIndex: "remark",
      render: (remark: string) => {
        return <Popover content={remark} trigger="hover">
          <Button type='link'>查看</Button>
        </Popover>
      }
    }
    ,
    {
      title: "顾问",
      align: 'center',
      dataIndex: "aname",
    }
    ,
    {
      title: "房",
      dataIndex: "is_house",
      render: (is_house: string) => {
        return statusNode(is_house)
      }
    }
    ,
    {
      title: "车",
      dataIndex: "is_car",
      render: (is_car: string) => {
        return statusNode(is_car)
      }
    }
    ,
    {
      title: "保单",
      dataIndex: "is_policy",
      render: (is_policy: string) => {
        return statusNode(is_policy)
      }
    }
    ,
    {
      title: "公积金",
      dataIndex: "is_fund",
      render: (is_fund: string) => {
        return statusNode(is_fund)
      }
    }
    ,
    {
      title: "代发",
      dataIndex: "replace",
      render: (replace: string) => {
        return statusNode(replace)
      }
    }
    ,
    {
      title: "申请额度",
      align: 'center',
      dataIndex: "apply_limit",
    },

    {
      title: "实际申请时间",
      align: 'center',
      dataIndex: "stime",
      width: 200,
    }
    , {
      title: "进系统时间",
      align: 'center',
      dataIndex: "atime",
      width: 200,
    },
    {
      title: "来源媒体",
      align: 'center',
      dataIndex: "source_media",
      render: (source_media: string) => {
        return source_media == '1' ? '后台申请' : '线下申请';
      }
    }
    ,
    {
      title: '操作',
      dataIndex: 'id',
      align: 'center',
      fixed: 'right',
      width: 150,
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
  }, [name, gender, star, status, remark, no_remark, longType, longStatus, date, date_section, is_lock, city, house, quota, loan])

  useEffect(() => {
    if (userId) {
      console.log("🚀 ~ useEffect ~ userId:", userId)
      setOpen(false);

      setTimeout(() => {
        setOpen(true);
        setRow({ id: userId })
      }, 500);
    }
  }, [userId])




  useImperativeHandle(ref, () => ({
    refresh,
  }))

  const refresh = () => {
    tableRef.current.onRefresh()
  }

  const params = () => {
    return {
      name: name,
      star: star,
      status: status,
      phone: phone,
      id: id,
      date_section: date_section,
      date: date,
    }
  }

  // 获取列表数据
  const getList = (info: any, callback: any) => {
    req.post('Leave/LeaveList', {
      page: info.page,
      size: info.size,
      orderBy: 'desc',
      ...params()
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
        req.post('MyCustomer/delMyCustomer', { id: data.id }).then(res => {
          if (res.code == 1) {
            message.success('删除成功', 1.2);
            refresh()
          } else {
            message.error(res.msg, 1.2);
          }
        })
      }
    })
  }


  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: any = {
    type: 'checkbox',
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const [unit, setUnit] = useState<number>(0)

  return (
    <React.Fragment>
      <SearchContent.Provider value={{ params: params }}>
        <div className='h100 flexColumn'>
          <div>
            <div className='grid grid-cols-5 mb-2'>
              <div className='flex items-center  w-full'>
                <div className='mr-2'>姓名</div>
                <Input
                  className='pubInpt borderbai marginr12 !w-full flex-1'
                  placeholder='请输入姓名'
                  allowClear
                  onChange={(e) => {
                    setName(e.target.value || '');
                  }}
                />
              </div>
              <div className='flex items-center  w-full'>
                <div className='mr-2'>手机</div>
                <Input
                  className='pubInpt borderbai marginr12 !w-full flex-1'
                  placeholder='请输入手机'
                  allowClear
                  onChange={(e) => {
                    setPhone(e.target.value || '');
                  }}
                />
              </div>
              <div className='flex items-center  w-full'>
                <div className='mr-2'>归属顾问</div>
                <Input
                  className='pubInpt borderbai marginr12 !w-full flex-1'
                  placeholder='请输入归属顾问'
                  allowClear
                  onChange={(e) => {
                    setName(e.target.value || '');
                  }}
                />
              </div>

              <div className="flex items-center w-full  col-span-2">
                <div className='mr-2'>时间类型</div>
                <Select
                  allowClear
                  options={[
                    { label: '进系统时间', value: 1 },
                    { label: '备注时间', value: 2 },
                    { label: '实际申请时间', value: 3 },
                  ]}
                  placeholder='请选择时间类型'
                  className=' !w-full flex-1 marginr12'
                  onChange={(value) => {
                    setDate(value);
                  }}
                />
                <RangePicker
                  className=' !w-full flex-1 marginr12'
                  onChange={(value) => {
                    setDateSection(value!.map((item: any) => item.format('YYYY-MM-DD'))!.join(','));
                  }}
                />
              </div>


            </div>

            <div className='flex items-center w-full mb-2'>

              <div className='flex items-center w-full'>
                <div className='mr-2'>状态</div>
                <Select
                  allowClear
                  options={customerStatus}
                  placeholder='请选择状态'
                  className=' !w-full flex-1 marginr12'
                  onChange={(value) => {
                    setStatus(value);
                  }}
                />
              </div>

              <div className='flex items-center  w-full'>
                <div className='mr-2'>ID</div>
                <Input
                  className='pubInpt borderbai marginr12 !w-full flex-1'
                  placeholder='请输入ID'
                  allowClear
                  onChange={(e) => {
                    setId(e.target.value || '');
                  }}
                />
              </div>

              <div className="flex items-center  w-full">
                <div className='mr-2'>星级</div>
                <Select
                  allowClear
                  options={starType}
                  placeholder='请选择星级'
                  className=' !w-full flex-1 marginr12'
                  onChange={(value) => {
                    setStar(value);
                  }}
                />
              </div>

              <div className='flex items-center w-full'>
                <div className='mr-2'>分配类型</div>
                <Select
                  allowClear
                  options={customerStatus}
                  placeholder='请选择状态'
                  className=' !w-full flex-1 marginr12'
                  onChange={(value) => {
                    setStatus(value);
                  }}
                />
              </div>

            </div>
          </div>
          <div className='bgbai margt20 flex_auto'>
            <div className='flex items-center ml2 mt2'>
              <AdminSelect onChange={(value: any) => {
                setUnit(value)
              }} />

              <Popconfirm
                title="确定要分配给当前选择员工吗？"
                onConfirm={() => {
                  req.post('Pubpool/Distribute', {
                    ids: selectedRowKeys.map(Number),
                    aid: unit
                  }).then(res => {
                    if (res.code == 1) {
                      message.success('分配成功', 1.2);
                      refresh()
                    } else {
                      message.error(res.msg, 1.2);
                    }
                  })
                }}
              >
                <Button type="primary" onClick={() => {
                }} disabled={!hasSelected || unit == 0}>分配</Button>
              </Popconfirm>

              <Button type="primary" className='ml-2' onClick={() => {
                setOpen(true);
              }} disabled={!hasSelected}>导入</Button>
            </div>
            <Title title='公共池' />
            <CustomTable
              ref={tableRef}
              rowSelection={rowSelection}
              columns={columns}
              onRefresh={onRefresh}
              scroll={{ y: window.innerHeight - 368, x: window.innerWidth + 200 }}
            />
          </div>
        </div>

        {/* 添加/编辑 */}
        <CustomModal
          open={open}
          width='100%'
          onCancel={onCancel}
          title={(<Title title={`${type === 'edit' ? '编辑' : '添加'}客户`} />)}
        >
          <Add type={type} data={row} onOk={() => {
            setOpen(false);
            refresh()
          }} />
        </CustomModal>
      </SearchContent.Provider>

    </React.Fragment>
  )
};

export default forwardRef(Index);
