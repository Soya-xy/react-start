import { App, Button, Form, Select } from "antd"
import { forwardRef, useContext, useEffect, useState } from "react"
import * as req from '~/class/request';
import { UserContent } from "~/utils/content";

const Index = () => {
  const { message } = App.useApp();

  const userId = useContext(UserContent);
  const [identity, setIdentity] = useState();

  useEffect(() => {
    req.post('MyCustomer/editInfo', { id: userId, type: 'identity' }).then(res => {
      if (res.code === 1) {
        setIdentity(res.data)
        console.log("🚀 ~ Index ~ identity:", identity)
      }
    })
  },[])

  function save() {
    req.post('MyCustomer/editOther', { id: userId, type: 'identity', profession: identity }).then(res => {
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
      <p>职业身份:</p>
      <Select placeholder="请选择" defaultValue={identity} key={identity} className="w-200px !ml-2" options={[
        { label: '未设置', value: 0 },
        { label: '标薪', value: 1 },
        { label: '优良职业', value: 2 },
        { label: '自雇', value: 3 },
        { label: '无固定职业', value: 4 },
        { label: '企业税贷', value: 5 },
      ]} onChange={e => {
        console.log("🚀 ~ Index ~ e:", e)
        setIdentity(e)
      }}></Select>
    </div>
    <div className="w-full text-end">
      <Button type="primary" htmlType='button' onClick={save} className='block margt20 '>确定</Button>

    </div>
  </>
}
export default forwardRef(Index)
