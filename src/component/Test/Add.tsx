import { forwardRef } from 'react';
import { Button, Form, Input, App, Select } from 'antd';
import * as req from '~/class/request';

const levelList = [
  { value: 1, label: '正常' },
  { value: 2, label: '禁用' },
];

const Index = (_props: any, ref: any) => {
  console.log("🚀 ~ Index ~ _props:", _props.data)
  const { message } = App.useApp();
  const onFinish = (data: any) => {
    let url = 'config/addChargeConfig';
    if (_props.type === 'edit') {
      url = 'config/editChargeConfig';
      data.id = _props.data.id
    }
    req.post(url, data).then(res => {
      if (res.code == 1) {
        message.success(res.msg, 1.2);
        _props.onOk && _props.onOk();
      } else {
        message.error(res.msg, 1.2)
      }
    })
  }
  return (
    <Form
      onFinish={onFinish}
      autoComplete='off'
      labelCol={{ flex: '82px' }}
      initialValues={{
        money: _props.data?.money,
        send_money: _props.data?.send_money,
        sall_num: _props.data?.sall_num,
        status: _props.data?.status,
        sort: _props.data?.sort,
      }}
    >
      <Form.Item label='充值金额' name='money' rules={[{ required: true, message: '请输入充值金额' }]}>
        <Input placeholder='请输入充值金额' />
      </Form.Item>
      <Form.Item label='赠送金额' name='send_money' rules={[{ required: true, message: '请输入赠送金额' }]}>
        <Input type="number" placeholder='请输入赠送金额' />
      </Form.Item>
      <Form.Item label='销量' name='sall_num' rules={[{ required: true, message: '请输入销量' }]}>
        <Input type="number" placeholder='请输入销量' />
      </Form.Item>
      <Form.Item label='序号' name='sort' rules={[{ required: true, message: '请输入序号' }]}>
        <Input type="number" placeholder='序号 越小越靠前' />
      </Form.Item>
      <Form.Item label='状态' name='status' rules={[{ required: true, message: '请选择状态' }]}>
        <Select
          options={levelList}
          placeholder='请选择状态'
        />
      </Form.Item>

      <Button type='primary' htmlType='submit' className='marglauto block margt20'>确定</Button>
    </Form>
  )
};

export default forwardRef(Index);
