import { useMount } from "ahooks";
import { App, Button, Descriptions, Flex, Form, Input, Popconfirm, Tag } from "antd"
import { useAtom, useAtomValue } from "jotai";
import { forwardRef, useContext, useState } from "react"
import { userInfoAtom } from "~/store/path";
import * as req from '~/class/request';
import CustomModal from '~/common/Modal';
import Title from "~/common/Title";
import { SearchContent } from "~/utils/content";
import { userAtom } from "~/store/atom";
import Add from "../Memo/Add";

const Index = (_props: any, _ref: any) => {
  const { message } = App.useApp()
  const userInfo = useAtomValue(userInfoAtom);
  const [info, setInfo] = useState<any>({})
  const [msg, setMsg] = useState<string>('')
  const [open, setOpen] = useState<boolean>(false);
  const { params } = useContext(SearchContent)
  const [base, setBase] = useState<any>({})
  const [user, setUser] = useAtom(userAtom)
  const [tags, setTags] = useState<any>([])
  const [noteOpen, setNoteOpen] = useState<boolean>(false)

  function refresh() {
    req.post('Label/LabelList', {
      page: 1,
      size: 9999,
      orderBy: 'desc',
    }).then(res => {
      if (res.code === 1) {
        setTags(res.data.datas)
      }
    })

    req.post('MyCustomer/editInfo', { id: _props.data.id, type: 'base' }).then((res: any) => {
      if (res.code === 1) {
        setBase(res.data)
      }
    })

    req.post('MyCustomer/comment', { id: _props.data.id }).then((res: any) => {
      setInfo(res.data)
      console.log("🚀 ~ refresh ~ res.data:", info)
    })
  }

  function addRecord() {
    if (!msg) {
      message.error('请输入内容')
      return
    }
    req.post('MyCustomer/addComment', { id: _props.data.id, msg }).then((res: any) => {
      message.success('新增成功')
      setMsg('')
      refresh()
    })
  }


  function next(type: string) {
    req.post('MyCustomer/exchange', {
      ...params(),
      id: _props.data.id,
      type
    }).then((res: any) => {
      if (res.code === 1) {
        if (res.data !== 0) {
          setUser(res.data)
        } else {
          message.error('没有客户了')
        }
      }
    })
  }



  useMount(() => {
    refresh()
  })

  return (
    <div>
      <div className='flex items-center gap-2'>
        <h3>ID:{_props.data.id}</h3>

        <p>当前跟进人：{userInfo.name}</p>
        {_props.type == 'edit' && <Flex gap="small" wrap>
          <Button type="primary" onClick={() => {
            setNoteOpen(true)
          }}>备忘新增</Button>

          <Popconfirm title={base.important === 'y' ? '确定取消为重要客户吗？' : '确定标记为重要客户吗？'} onConfirm={() => {
            req.post('MyCustomer/important', { id: _props.data.id }).then((res: any) => {
              if (res.code === 1) {
                message.success('标记成功')
                refresh()

              }
            })
          }}>
            <Button type="primary" className={base.important === 'y' ? '!bg-yellow-500' : ''}>{base.important === 'y' ? '取消为重要客户' : '标记为重要客户'}</Button>
          </Popconfirm>

          <Popconfirm title={base.cooperation === 'y' ? '确定取消加入合作单吗？' : '确定加入合作单吗？'} onConfirm={() => {
            // req.post('MyCustomer/AddPubPool', { id: _props.data.id }).then((res: any) => {
            //   if (res.code === 1) {
            //     message.success('加入成功')
            //     refresh()
            //   }
            // })
          }}>
            <Button type="primary" className={base.cooperation === 'y' ? '!bg-yellow-500' : ''}>{base.cooperation === 'y' ? '取消加入合作单' : '加入合作单'}</Button>
          </Popconfirm>

          <Popconfirm title={base.is_lock === 'y' ? '确定解锁客户吗？' : '确定锁定客户吗？'} onConfirm={() => {
            req.post('MyCustomer/lock', { id: _props.data.id }).then((res: any) => {
              if (res.code === 1) {
                message.success('标记成功')
                refresh()
              }
            })
          }}>
            <Button type="primary" className={base.is_lock === 'y' ? '!bg-yellow-500' : ''}>{base.is_lock ? '解锁客户' : '锁定客户'}</Button>
          </Popconfirm>

          <Button type="primary" onClick={() => {
            next('last')
          }}>上一个客户</Button>
          <Button type="primary" onClick={() => {
            next('next')
          }}>下一个客户</Button>
          <Popconfirm title={base.pubpool === 'y' ? '确定取消加入公共池吗？' : '确定加入公共池吗？'} onConfirm={() => {
            req.post('MyCustomer/AddPubPool', { id: _props.data.id }).then((res: any) => {
              if (res.code === 1) {
                message.success('加入成功')
                refresh()
              }
            })
          }}>
            <Button type="primary" className={base.pubpool === 'y' ? '!bg-yellow-500' : ''}>{base.pubpool === 'y' ? '取消加入公共池' : '加入公共池'}</Button>
          </Popconfirm>
          <Popconfirm title="确定发送邀约短信吗？" onConfirm={() => {
            // req.post('MyCustomer/AddPubPool', { id: _props.data.id }).then((res: any) => {
            //   if (res.code === 1) {
            //     message.success('发送成功')
            //   }
            // })
          }}>
            <Button type="primary" disabled className='!bg-gray-500 !text-white'>发送邀约短信</Button>
          </Popconfirm>
        </Flex>}
      </div>
      <Descriptions
        className='!mt-3'
        bordered
        layout="vertical"
        column={24}
        items={[
          {
            key: '1',
            span: 24,
            label: '新增记录', //TODO: 这里到时候改个名字就行
            children: (
              <>
                {tags.length > 0 && tags.map((item: any) => {
                  return <Tag color='geekblue' className="cursor-pointer select-none" key={item.id}
                    onClick={() => {
                      setMsg(msg + ' ' + item.msg)
                    }}
                  >{item.msg}</Tag>
                })}
                <div className='flex items-center gap-2 mt-2'>
                  <Input.TextArea placeholder='请输入' defaultValue={msg} key={msg} className='flex-1' autoSize={{ minRows: 2, maxRows: 4 }}
                    onChange={(e) => {
                      setMsg(e.target.value)
                    }}
                  />
                  <Button type="primary" onClick={addRecord}>确定</Button>
                </div>
              </>
            ),
          },
          {
            key: '2',
            span: 24,
            label: '顾问记录',
            children:
              <Input.TextArea defaultValue={info?.Adviser?.join('\n')} key={info?.Adviser?.length} disabled className='flex-1 !text-black' autoSize={{ minRows: 2, maxRows: 4 }} />
            ,
          },
          {
            key: '3',
            span: 24,
            label: '备忘记录',
            children:
              <Input.TextArea defaultValue={info?.Memo?.join('\n')} key={info?.Memo?.length} disabled className='flex-1 !text-black' autoSize={{ minRows: 2, maxRows: 4 }} />
            ,
          },
          {
            key: '4',
            span: 24,
            label: '主管点评',
            children: (
              <div className='flex items-center gap-2'>
                <div className="flex-1">
                  <Input.TextArea defaultValue={info?.Director?.join('\n')} key={info?.Director?.length} disabled className='flex-1 !text-black' autoSize={{ minRows: 3, maxRows: 6 }} />
                </div>
                {_props.type === 'edit' && <Button type="primary" onClick={() => {
                  setOpen(true)
                }}>回复</Button>}
              </div>
            ),
          },
        ]}
      />
      {/* 添加/编辑 */}
      <CustomModal
        open={open}
        width={500}
        onCancel={() => {
          setOpen(false)
        }}
        title={(<Title title="回复内容" />)}
      >
        <Form
          onFinish={(values: any) => {
            req.post('MyCustomer/directorComment', { id: _props.data.id, msg: values.msg }).then((res: any) => {
              message.success('新增成功')
              setOpen(false)
              refresh()
            })
          }}
          autoComplete='off'
        >
          <Form.Item label='内容' name='msg' rules={[{ required: true, message: '请输入内容' }]}>
            <Input.TextArea placeholder='请输入...' autoSize={{ minRows: 3, maxRows: 6 }} />
          </Form.Item>
          <Button type='primary' htmlType='submit' className='marglauto block margt20'>确定</Button>
        </Form>
      </CustomModal>


      {/* 添加/编辑备忘 */}
      <CustomModal
        open={noteOpen}
        width={560}
        onCancel={() => {
          setNoteOpen(false)
        }}
        title={(<Title title={`添加备忘`} />)}
      >
        <Add type={'add'} data={{
          id: _props.data.id,
          name: _props.data.name,
        }} onOk={() => {
          setNoteOpen(false);
        }} />
      </CustomModal>

    </div>
  )
}
export default forwardRef(Index)
