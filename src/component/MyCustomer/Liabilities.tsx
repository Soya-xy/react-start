import { App, Button, Cascader, Form, Input, Radio, Select } from "antd"
import { forwardRef, useContext, useEffect, useRef, useState } from "react"
import * as req from '~/class/request';
import { areaOption } from "~/utils/area";
import { UserContent } from "~/utils/content";

const Index = () => {
  const { message } = App.useApp();

  const userId = useContext(UserContent);
  const formRef = useRef<any>();


  useEffect(() => {
    req.post('MyCustomer/editInfo', { id: userId, type: 'liabilities' }).then(res => {
      if (res.code === 1) {
        formRef.current.setFieldsValue({
          ...res.data,
        })
      }
    })
  }, [])

  function save(data: any) {
    req.post('MyCustomer/editOther', { id: userId, type: 'liabilities', ...data }).then(res => {
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
      labelCol={{ span: 14 }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }} className="w-50vw">

        <Form.Item name="debt_credit" label="信用卡情况">
          <Radio.Group options={[
            { label: '有', value: 'y' },
            { label: '无', value: 'n' },
          ]}></Radio.Group>
        </Form.Item>


        <Form.Item name="is_credit_loan" label="有无信用卡贷款">
          <Radio.Group options={[
            { label: '有', value: 'y' },
            { label: '无', value: 'n' },
          ]}></Radio.Group>
        </Form.Item>


        <Form.Item name="is_hose_loan" label="有无房抵贷贷款">
          <Radio.Group options={[
            { label: '有', value: 'y' },
            { label: '无', value: 'n' },
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
