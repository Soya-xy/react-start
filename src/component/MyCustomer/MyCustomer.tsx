
import React, { useImperativeHandle, forwardRef, useRef, useState, useEffect } from 'react';
import { Button, theme, App, Input, Image, Tag, DatePicker, Select, Popover, Popconfirm } from 'antd';
import Title from '~/common/Title';
import CustomTable from '~/common/Table';
import CustomModal from '~/common/Modal';
import * as req from '~/class/request';
import Add from './Add';
import * as XLSX from 'xlsx';
import { customerStatus, loanCondition, loanType, starType } from '~/utils/const';
import { SearchContent } from '~/utils/content';
import { useAtomValue } from 'jotai';
import { userAtom } from '~/store/atom';
import { useMount } from 'ahooks';
import PlAdd from './PlAdd';
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
  const [count, setCount] = useState<number>(0)
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
  const [tips, setTips] = useState<any>({})
  const [quick, setQuick] = useState<number>(0)
  const [tableHeight, setTableHeight] = useState<number>(0)

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
      title: "星级",
      align: 'center',
      dataIndex: "star",
      render: (star: string) => {
        return star + '星'
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
      title: "申请额度",
      align: 'center',
      dataIndex: "apply_limit",
    }
    ,
    {
      title: "贷款类型",
      align: 'center',
      dataIndex: "loan_type",
      render: (loan_type: string) => {
        return loan_type == '1' ? '不限' : loan_type == '2' ? '信用贷' : loan_type == '3' ? '车抵贷' : loan_type == '4' ? '合作单' : loan_type == '5' ? '保单贷' : '';
      }
    }
    ,

    {
      title: "来源",
      align: 'center',
      dataIndex: "source",
      render: (source: string) => {
        return source == '1' ? '后台申请' : '表格导入';
      }
    }
    ,
    {
      title: "城市",
      align: 'center',
      dataIndex: "city",
      width: 200,
    }
    ,
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
      title: "时间",
      align: 'center',
      dataIndex: "stime",
      width: 200,
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
  }, [name, gender, star, status, remark, no_remark, longType, longStatus, date, date_section, is_lock, city, house, quota, loan, quick])

  useEffect(() => {
    if (userId) {
      setOpen(false);

      setTimeout(() => {
        setOpen(true);
        setRow({ id: userId })
      }, 500);
    }
  }, [userId])


  useMount(() => {
    req.post('MyCustomer/info', {}).then(res => {
      if (res.code == 1) {
        setTips(res.data)
      }
    })
  })

  useEffect(() => {
    if (tableRef.current) {
      const tableDom = document.querySelector('.customer-table') as HTMLElement
      if (tableDom) {
        const windowHeight = window.innerHeight;
        setTableHeight(windowHeight - tableDom.offsetTop - 150);
      }
      // const titleHeight = titleRef.current.clientHeight;
      // const windowHeight = window.innerHeight;
      console.log(tableRef.current);

    }
  }, []);
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
      quick: quick,
      house: house,
      quota: quota,
      loan: loan,
    }
  }

  // 获取列表数据
  const getList = (info: any, callback: any) => {
    req.post('MyCustomer/MyCustomerList', {
      page: info.page,
      size: info.size,
      orderBy: 'desc',
      ...params()
    }).then(res => {
      setCount(res.data.all || 0)
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
  const [importOpen, setImportOpen] = useState<boolean>(false)

  // 添加字段映射
  const fieldMapping: { [key: string]: string } = {
    id: 'ID',
    name: '姓名',
    gender: '性别',
    star: '星级',
    status: '状态',
    age: '年龄',
    remark: '备注',
    aname: '顾问',
    is_house: '房',
    is_car: '车',
    is_policy: '保单',
    is_fund: '公积金',
    apply_limit: '申请额度',
    loan_type: '贷款类型',
    source: '来源',
    city: '城市',
    source_media: '来源媒体',
    stime: '时间'
  };
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

            <Button type="primary" onClick={() => {
              setOpen(true);
            }}>添加客户</Button>
            <Button type="primary" className='ml-2' onClick={() => {
              setImportOpen(true);
            }}>导入</Button>
            <Popconfirm title='确定导出当前条件下的客户吗？' className='ml-2' onConfirm={() => {
              req.post('MyCustomer/MyCustomerList', {
                page: 1,
                size: count,
                orderBy: 'desc',
                ...params()
              }).then(res => {
                if (res.code === 1 && res.data && res.data.datas.length > 0) {
                  // 转换数据，将英文字段名替换为中文
                  const transformedData = res.data.datas.map((item: any) => {
                    const newItem: { [key: string]: any } = {};
                    Object.keys(item).forEach(key => {
                      if (fieldMapping[key]) {
                        if (item[key] === 'n') {
                          newItem[fieldMapping[key]] = '否';
                        } else if (item[key] === 'y') {
                          newItem[fieldMapping[key]] = '是';
                        } else if (item[key] === 'o') {
                          newItem[fieldMapping[key]] = '未设置';
                        } else if (item[key] === 'man') {
                          newItem[fieldMapping[key]] = '男';
                        } else if (item[key] === 'woman') {
                          newItem[fieldMapping[key]] = '女';
                        } else if (key === 'loan_type') {
                          newItem[fieldMapping[key]] = loanType.find(res => res.value === item[key])?.label;
                        } else if (key === 'status') {
                          newItem[fieldMapping[key]] = customerStatus.find(res => res.value === item[key])?.label;
                        } else if (key === 'source') {
                          newItem[fieldMapping[key]] = item[key] === '1' ? '后台申请' : '表格导入';
                        } else if (key === 'source_media') {
                          newItem[fieldMapping[key]] = '后台申请'
                        } else {
                          newItem[fieldMapping[key]] = item[key];
                        }
                      }
                    });
                    return newItem;
                  });

                  // 创建工作簿
                  const wb = XLSX.utils.book_new();
                  // 创建工作表
                  const ws = XLSX.utils.json_to_sheet(transformedData);
                  // 将工作表添加到工作簿
                  XLSX.utils.book_append_sheet(wb, ws, "客户列表");
                  // 生成xlsx文件并下载
                  XLSX.writeFile(wb, "客户列表.xlsx");
                } else {
                  message.error('导出失败，请稍后重试');
                }
              }).catch(err => {
                console.error(err);
                message.error('导出失败，请稍后重试');
              });
            }}>
              <Button type="primary">导出</Button>
            </Popconfirm>

          </div>
          <div className='bgbai margt20 flex_auto'>
            <Title title='我的客户'  />
            <CustomTable
              ref={tableRef}
              customClass='customer-table'
              columns={columns}
              onRefresh={onRefresh}
              scroll={{ y: tableHeight, x: window.screen.width + 200 }}
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

        <CustomModal
          title={(<Title title="批量导入题库" />)}
          open={importOpen}
          onCancel={() => {
            setImportOpen(false)
          }}
        >
          <PlAdd onCancel={onCancel} onOk={() => {
            setImportOpen(false);
            refresh()
          }} />
        </CustomModal>
      </SearchContent.Provider>

    </React.Fragment>
  )
};

export default forwardRef(Index);
