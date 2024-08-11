import { App, Button, Form, Select } from "antd"
import { forwardRef, useContext, useEffect, useState } from "react"
import * as req from '~/class/request';
import { UserContent } from "~/utils/content";

const Index = () => {
  const { message } = App.useApp();

  const userId = useContext(UserContent);
  const [identity, setIdentity] = useState();

  useEffect(() => {
    req.post('MyCustomer/editInfo', { id: userId, type: 'policy' }).then(res => {
      if (res.code === 1) {
        setIdentity(res.data)
      }
    })
  },[])

  function save() {
    req.post('MyCustomer/editOther', { id: userId, type: 'policy', policy: identity }).then(res => {
      if (res.code === 1) {
        message.success('保存成功')
      } else {
        message.error('保存失败')
      }
    }).catch(err => {
      message.error('保存失败')
    })
  }

  return <>
    <div className="flex items-center">
      <p>有误保单:</p>
      <Select placeholder="请选择" defaultValue={identity} key={identity} className="w-200px !ml-2" options={[
        { label: '有保单', value: 'y' },
        { label: '无保单', value: 'n' },
      ]} onChange={e => {
        setIdentity(e)
      }}></Select>
    </div>
    <div className="w-full text-end">
      <Button type="primary" htmlType='button' onClick={save} className='block margt20 '>确定</Button>

    </div>
  </>
}
export default forwardRef(Index)
