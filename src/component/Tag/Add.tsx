
import React, { forwardRef, useEffect, useRef } from 'react';
import { Button, Form, Input, App, } from 'antd';
import * as req from '~/class/request';

const levelList = [
    { value: 1, label: '正常' },
    { value: 2, label: '禁用' },
];

const Index = (_props: any, ref: any) => {
    const { message } = App.useApp();
    const formRef = useRef<any>();

    useEffect(() => {
        formRef.current.setFieldsValue(_props.data)
    }, [])

    const onFinish = (data: any) => {
        let url = 'Label/addLabel';
        if (_props.type === 'edit') {
            url = 'Label/editLabel';
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
                name='msg'
                label='内容'
                rules={[{ required: true, message: '请输入内容' }]}
            >
                <Input />
            </Form.Item>


            <Button type='primary' htmlType='submit' className='marglauto block margt20'>确定</Button>
        </Form>
    )
};

export default forwardRef(Index);

