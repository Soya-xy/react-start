import { App, Button, Cascader, Form, Input, Select } from "antd"
import { forwardRef, useContext, useEffect, useRef, useState } from "react"
import * as req from '~/class/request';
import { areaOption } from "~/utils/area";
import { UserContent } from "~/utils/content";

const Index = () => {
  const { message } = App.useApp();

  const userId = useContext(UserContent);
  const [identity, setIdentity] = useState();
  const formRef = useRef<any>();

  useEffect(() => {
    req.post('MyCustomer/editInfo', { id: userId, type: 'house' }).then(res => {
      if (res.code === 1) {
        formRef.current.setFieldsValue({
          ...res.data,
          house_addr: res.data.house_addr.split(' '),
        })
      }
    })
  }, [])

  function save(data: any) {
    if (data.house_addr) {
      data.house_addr = data.house_addr.join(' ');
    }
    req.post('MyCustomer/editOther', { id: userId, type: 'house', ...data }).then(res => {
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
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0 20px' }}>
        <Form.Item name="house" label="名下房产情况" >
          <Select placeholder="请选择" options={[
            { label: '有房产', value: 'y' },
            { label: '无房产', value: 'n' },
          ]}></Select>
        </Form.Item>
        <Form.Item name="house_type" label="房产类型">
          <Select placeholder="请选择" options={[
            { label: '未设置', value: 0 },
            { label: '商品房', value: 1 },
            { label: '居民住房', value: 2 },
            { label: '商住两用', value: 3 },
            { label: '商铺', value: 4 },
            { label: '公寓', value: 5 },
            { label: '写字楼', value: 6 },
            { label: '别墅', value: 7 },
            { label: '宅基地', value: 8 },
            { label: '安置房', value: 9 },
            { label: '自建房', value: 10 },
            { label: '资房集', value: 11 },
          ]}></Select>
        </Form.Item>
        <Form.Item name="house_addr" label="房产所在地" >
          <Cascader options={areaOption}
            fieldNames={{ label: 'label', value: 'label' }}></Cascader>
        </Form.Item>
        <Form.Item name="house_price" label="房产现价" >
          <Input placeholder="请输入" addonAfter="万元"></Input>
        </Form.Item>
        <Form.Item name="house_status" label="房产状态">
          <Select placeholder="请选择" options={[
            { label: "未设置", value: 0 },
            { label: "抵押给私人", value: 1 },
            { label: "抵押给银行", value: 2 },
            { label: "购房按揭中", value: 3 },
            { label: "全款红本在手", value: 4 }
          ]}></Select>
        </Form.Item>
        <Form.Item name="house_area" label="房产面积" >
          <Input placeholder="请输入" addonAfter="平方米"></Input>
        </Form.Item>
        <Form.Item name="house_card" label="房产证持有时间" >
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
