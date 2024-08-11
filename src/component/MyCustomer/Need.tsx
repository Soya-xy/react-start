import { App, Button, Cascader, DatePicker, Form, Input, Radio, Select } from "antd"
import dayjs from "dayjs";
import { forwardRef, useContext, useEffect, useRef, useState } from "react"
import * as req from '~/class/request';
import { areaOption } from "~/utils/area";
import { UserContent } from "~/utils/content";

const Index = () => {
  const { message } = App.useApp();

  const userId = useContext(UserContent);
  const formRef = useRef<any>();


  useEffect(() => {
    req.post('MyCustomer/editInfo', { id: userId, type: 'need' }).then(res => {
      if (res.code === 1) {
        formRef.current.setFieldsValue({
          ...res.data,
          usetime: res.data.usetime ? dayjs(res.data.usetime) : null,
        })
      }
    })
  }, [])

  function save(data: any) {
    if (data.usetime) {
      data.usetime = data.usetime.format('YYYY-MM-DD')
    }
    req.post('MyCustomer/editOther', { id: userId, type: 'need', ...data }).then(res => {
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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}
        className="w-50vw"
      >

        <Form.Item name="repayment" label="还款方式">
          <Select placeholder="请选择" options={[
            { label: '无', value: 0 },
            { label: '现金还款', value: 1 },
            { label: '银行还款', value: 2 },
          ]}></Select>
        </Form.Item>


        <Form.Item name="purpose" label="贷款用途">
          <Input placeholder="请输入"></Input>
        </Form.Item>


        <Form.Item name="usetime" label="用款时间">
          <DatePicker
            format='YYYY-MM-DD'
            placeholder="请选择"
            className="w-full"
          ></DatePicker>
        </Form.Item>
        <Form.Item name="term" label="期限">
          <Input placeholder="请输入" addonAfter="月"></Input>
        </Form.Item>

        <Form.Item className="text-right">
          <Button type="primary" htmlType="submit">保存</Button>
        </Form.Item>

      </div>
    </Form>
  </>
}
export default forwardRef(Index)
