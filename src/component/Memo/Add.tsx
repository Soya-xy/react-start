
import React, { forwardRef, useEffect, useRef } from 'react';
import type { FC } from 'react';
import { Button, Form, Input, App, Select, DatePicker } from 'antd';
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
        let url = 'Memo/addMemo';
        if (_props.type === 'edit') {
            url = 'Memo/editMemo';
        }
        data.id = _props.data.id
        if (data.remind)
            data.remind = data.remind.format('YYYY-MM-DD HH:mm:ss')
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
                label='客户名称'
                rules={[{ required: true, message: '请输入客户名称' }]}
            >
                <Input />
            </Form.Item>


            <Form.Item
                name='memo'
                label='备忘内容'
                rules={[{ required: true, message: '请输入备忘内容' }]}
            >
                <Input.TextArea />
            </Form.Item>

            <Form.Item
                name='remind'
                label='提醒时间'
                rules={[{ required: true, message: '请输入提醒时间' }]}
            >
                <DatePicker
                    format='YYYY-MM-DD HH:mm:ss'
                    showTime
                    placeholder='请选择提醒时间'
                    style={{ width: '100%' }}
                />
            </Form.Item>


            <Button type='primary' htmlType='submit' className='marglauto block margt20'>确定</Button>
        </Form>
    )
};

export default forwardRef(Index);

