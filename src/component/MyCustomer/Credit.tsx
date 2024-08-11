import { App, Button, Cascader, Form, Input, Radio, Select } from "antd"
import { forwardRef, useContext, useEffect, useRef, useState } from "react"
import * as req from '~/class/request';
import { areaOption } from "~/utils/area";
import { UserContent } from "~/utils/content";

const Index = () => {
  const { message } = App.useApp();

  const userId = useContext(UserContent);
  const [identity, setIdentity] = useState();
  const formRef = useRef<any>();

  const yqOptions = [
    { label: '未设置', value: 0 },
    { label: 1, value: 1 },
    { label: 2, value: 2 },
    { label: 3, value: 3 },
    { label: 4, value: 4 },
    { label: '5及以上', value: 5 },
  ]

  useEffect(() => {
    req.post('MyCustomer/editInfo', { id: userId, type: 'credit' }).then(res => {
      if (res.code === 1) {
        formRef.current.setFieldsValue({
          ...res.data,
        })
      }
    })
  }, [])

  function save(data: any) {
    req.post('MyCustomer/editOther', { id: userId, type: 'credit', ...data }).then(res => {
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
    <Form
      name='base'
      layout="horizontal"
      ref={formRef}
      onFinish={save}
      labelCol={{ span: 10 }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
        <Form.Item name="inquire_2" label="2个月内查询次数" >
          <Input placeholder="请输入" addonAfter="次"></Input>
        </Form.Item>
        <Form.Item name="inquire_3" label="3个月内查询次数" >
          <Input placeholder="请输入" addonAfter="次"></Input>
        </Form.Item>
        <Form.Item name="inquire_6" label="6个月内查询次数" >
          <Input placeholder="请输入" addonAfter="次"></Input>
        </Form.Item>

        <Form.Item name="max_month" label="信用记录时长" >
          <Input placeholder="请输入" addonAfter="月"></Input>
        </Form.Item>

        <Form.Item name="serious_overdue_1y" label="一年内最严重逾期" >
          <Select placeholder="请选择" options={yqOptions}></Select>
        </Form.Item>
        <Form.Item name="serious_overdue_2y" label="两年内最严重逾期" >
          <Select placeholder="请选择" options={yqOptions}></Select>
        </Form.Item>
        <Form.Item name="serious_overdue_5m" label="半年内最严重逾期" >
          <Select placeholder="请选择" options={yqOptions}></Select>
        </Form.Item>
        <Form.Item name="is_overdue" label="当前是否有逾期">
          <Radio.Group options={[
            { label: '有', value: 'y' },
            { label: '无', value: 'n' },
          ]}></Radio.Group>
        </Form.Item>
        <Form.Item name="micro_loan" label="微粒贷" >
          <Select placeholder="请选择" options={[
            { label: '无', value: 0 },
            { label: '1万', value: 1 },
            { label: '5万', value: 2 },
            { label: '10万', value: 3 },
            { label: '30万', value: 4 },
            { label: '80万', value: 5 },
          ]}></Select>
        </Form.Item>
        <Form.Item name="credit" label="芝麻信用分" >
          <Radio.Group options={[
            { label: '350~550', value: 1 },
            { label: '550~650', value: 2 },
            { label: '650以上', value: 3 },
            { label: '其他', value: 4 },
          ]}></Radio.Group>
        </Form.Item>
        <Form.Item className="text-right">
          <Button type="primary" htmlType="submit">保存</Button>
        </Form.Item>

      </div>
    </Form>
  </>
}
export default forwardRef(Index)
