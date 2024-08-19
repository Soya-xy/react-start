
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
import { useMount } from 'ahooks';
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
  const [quick, setQuick] = useState<number>(0)
  const [tips, setTips] = useState<any>({})

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


  useMount(() => {
    req.post('MyCustomer/info', {}).then(res => {
      if (res.code == 1) {
        setTips(res.data)
      }
    })
  })

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
      customer: name,
      star: star,
      status: status,
      remark: remark,
      no_remark: no_remark,
      loan_type: longType,
      loan_status: longStatus,
      date: date,
      date_section: date_section,
      is_lock: is_lock,
      city: city,
      house: house,
      quota: quota,
      loan: loan,
    }
  }

  // 获取列表数据
  const getList = (info: any, callback: any) => {
    req.post('redistribute/list', {
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
            <div className='flex items-center w-full mb-2'>
              <div className='flex items-center  w-full'>
                <div className='mr-2'>客户</div>
                <Input
                  className='pubInpt borderbai marginr12 !w-full flex-1'
                  placeholder='请输入姓名'
                  allowClear
                  onChange={(e) => {
                    setName(e.target.value || '');
                  }}
                />
              </div>
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
              <div className="flex items-center  w-full">
                <div className='mr-2'>未新增备注超过</div>
                <Input
                  className='pubInpt borderbai marginr12 !w-full flex-1'
                  placeholder='请输入'
                  onChange={(e) => {
                    setNoRemark(e.target.value || '');
                  }}
                />
                <div>天</div>
              </div>
            </div>

            <div className='flex items-center w-full mb-2'>
              <div className="flex items-center w-full">
                <div className='mr-2'>贷款条件</div>
                <Select
                  allowClear
                  options={loanCondition}
                  placeholder='请选择贷款条件'
                  className=' !w-full flex-1 marginr12'
                  onChange={(value) => {
                    setLongtype(value);
                  }}
                />
                <Select
                  allowClear
                  options={[
                    { label: '不限', value: 'o' },
                    { label: '有', value: 'y' },
                    { label: '无', value: 'n' },
                  ]}
                  placeholder='请选择'
                  className=' !w-full flex-1 marginr12'
                  onChange={(value) => {
                    setLongStatus(value);
                  }}
                />
              </div>
              <div className="flex items-center w-full">
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
              <div className="flex items-center  w-full">
                <div className='mr-2'>锁定客户</div>
                <Select
                  allowClear
                  options={[

                    { label: '不锁定', value: 'n' },
                    { label: '锁定', value: 'y' },
                  ]}
                  placeholder='请选择'
                  className=' !w-full flex-1 marginr12'
                  onChange={(value) => {
                    setLock(value)
                  }}
                />
              </div>
              {/* 备忘关键词 */}
              <div className="flex items-center  w-full">
                <div className='mr-2'>备忘关键词</div>
                <Input
                  className='pubInpt borderbai marginr12 !w-full flex-1'
                  placeholder='请输入内容'
                  onChange={(e) => {
                    setRemark(e.target.value || '');
                  }}
                />
              </div>
            </div>

            <div className='flex items-center w-full mb-2'>
              <div className="flex items-center w-full">
                <div className='mr-2'>查询范围</div>
                <Input
                  className='pubInpt borderbai marginr12 !w-full flex-1'
                  placeholder='请输入内容'
                  onChange={(e) => {
                    setCity(e.target.value || '');

                  }}
                />
              </div>
              {/* 房产情况 */}
              <div className="flex items-center w-full">
                <div className='mr-2'>房产情况</div>
                <Select
                  allowClear
                  options={[
                    { label: '未设置', value: 'o' },
                    { label: '有', value: 'y' },
                    { label: '无', value: 'n' },
                  ]}
                  placeholder='请选择'
                  className=' !w-full flex-1 marginr12'
                  onChange={(value) => {
                    setHouse(value);
                  }}
                />
              </div>
              {/* 贷款额度 */}
              <div className="flex items-center w-full">
                <div className='mr-2'>贷款额度</div>
                <Select
                  allowClear
                  options={[
                    { label: '1-4万元', value: 1 },
                    { label: '4-10万元', value: 2 },
                    { label: '10-50万元', value: 3 },
                    { label: '50万元以上', value: 4 },
                  ]}
                  placeholder='请选择'
                  className=' !w-full flex-1 marginr12'
                  onChange={(value) => {
                    setQuota(value);
                  }}
                />
              </div>
              {/* 贷款类型 */}
              <div className="flex items-center w-full">
                <div className='mr-2'>贷款类型</div>
                <Select
                  allowClear
                  options={[
                    { label: '不限', value: 1 },
                    { label: '信用贷', value: 2 },
                    { label: '车抵贷', value: 3 },
                    { label: '合作单', value: 4 },
                    { label: '保单贷', value: 5 },
                  ]}
                  placeholder='请选择'
                  className='!w-full flex-1 marginr12'
                  onChange={(value) => {
                    setLoan(value)
                  }}
                />
              </div>
            </div>
            <div className='w-full mb-2'>
              <div className='flex items-center w-full'>
                <span className='text-red-600'>待抓客户提醒：</span>
                你有<span className='text-underline mx-1' onClick={() => setQuick(1)}>{tips.uncaying_customers_1}</span>条“待跟进"客户超过1天未跟进；

                有<span className='text-underline mx-1' onClick={() => setQuick(2)}>{tips.uncaying_customers_9}</span>条客户超过9天未跟进(其中2星以上的客户<span className='text-underline mx-1' onClick={() => setQuick(3)}>{tips.uncaying_customers_9_2}</span>条)；

                有<span className='text-underline mx-1' onClick={() => setQuick(4)}>{tips.uncaying_customers_28}</span>条客户超过28天未跟进(其中2星以上的客户<span className='text-underline mx-1' onClick={() => setQuick(5)}>{tips.uncaying_customers_28_2}</span>条)
                {quick ? <Button type='default' onClick={() => {
                  setQuick(0);
                }}>清除</Button> : null}
              </div>
              {tips.my_customers + tips.redistribute_customers + tips.surplus_customers >= 500 ?
                <div className='text-red-600'>数据上限500条提醒：我的客户({tips.my_customers}) 再分配喜户({tips.redistribute_customers})剩佘({tips.surplus_customers})</div> : null}
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
              }} disabled={!hasSelected}>加入公共池</Button>
            </div>
            <Title title='再分配客户' />
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
