
import React, { forwardRef, useEffect, useRef } from 'react';
import type { FC } from 'react';
import { Button, Form, Input, App, Select, DatePicker } from 'antd';
import * as req from '~/class/request';

const levelList = [
    { value: 'y', label: '正常' },
    { value: 'n', label: '禁用' },
];

const Index = (_props: any, ref: any) => {
    const { message } = App.useApp();
    const formRef = useRef<any>();

    useEffect(() => {
        formRef.current.setFieldsValue(_props.data)
    }, [])

    const onFinish = (data: any) => {
        let url = 'Channel/addChannel';
        if (_props.type === 'edit') {
            url = 'Channel/editChannel';
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
            ref={formRef}
            onFinish={onFinish}
            autoComplete='off'
            labelCol={{ flex: '82px' }}
        >

            <Form.Item
                name='name'
                label='名称'
                rules={[{ required: true, message: '请输入名称' }]}
            >
                <Input />
            </Form.Item>


            <Form.Item
                name='company'
                label='公司'
                rules={[{ required: true, message: '请输入公司' }]}
            >
                <Input />
            </Form.Item>


            <Form.Item
                name='key'
                label='秘钥'
                rules={[{ required: true, message: '请输入秘钥' }]}
            >
                <Input />
            </Form.Item>


            <Form.Item
                name='is_enable'
                label='是否启用'
                rules={[{ required: true, message: '请输入是否启用' }]}
            >
                <Select options={levelList} />
            </Form.Item>




            <Button type='primary' htmlType='submit' className='marglauto block margt20'>确定</Button>
        </Form>
    )
};

export default forwardRef(Index);

