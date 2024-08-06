import React, { forwardRef } from 'react';
import type { FC } from 'react';
import { Button, Form, Input, App } from 'antd';
import CustomSelect from '../../common/Select';
import * as req from '../../class/request';

const Index = (_props: any, ref: any) => {
    const { message } = App.useApp();
    const onFinish = (data: any) => {
        let url = 'order/orderFh';
        data.order_id=_props.data.order_id
       
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
            
        >
            <Form.Item label='物流信息' name='shipping_sn' rules={[{ required: true, message: '请设置物流信息' }]}>
                <Input placeholder='请设置物流信息' />
            </Form.Item>
            
            <Button type='primary' htmlType='submit' className='marglauto block margt20'>确定</Button>
        </Form>
    )
};

export default forwardRef(Index);