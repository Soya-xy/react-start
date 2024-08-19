
import React, { forwardRef, useEffect, useRef } from 'react';
import type { FC } from 'react';
import { Button, Form, Input, App, Select, DatePicker } from 'antd';
import CustomSelect from '~/common/Select';
import * as req from '~/class/request';
import Editor from '~/common/Editor';
import dayjs from 'dayjs';

const levelList = [
    { value: 'y', label: '正常' },
    { value: 'n', label: '禁用' },
];

const Index = (_props: any, ref: any) => {
    const { message } = App.useApp();
    const formRef = useRef<any>();
    const editRef: any = useRef(null);

    useEffect(() => {
        if (_props.data.stime) {
            _props.data.stime = dayjs(_props.data.stime)
        }
        formRef.current.setFieldsValue(_props.data)

        if (_props.type === 'edit') {
            setTimeout(() => {
                editRef.current.setContent(_props.data.msg)
            }, 100);
        }
    }, [])

    const onFinish = (data: any) => {
        let url = 'Notice/addNotice';
        if (_props.type === 'edit') {
            url = 'Notice/editNotice';
            data.id = _props.data.id
        }
        if(data.msg){
            data.msg = data.msg.toHTML()
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
                name='title'
                label='名称'
                rules={[{ required: true, message: '请输入名称' }]}
            >
                <Input />
            </Form.Item>


            <Form.Item
                name='msg'
                label='内容'
                rules={[{ required: true, message: '请输入内容' }]}
            >
                <Editor ref={editRef} />

            </Form.Item>


            <Form.Item
                name='stime'
                label='发布时间'
                rules={[{ required: true, message: '请输入发布时间' }]}
            >
                <DatePicker showTime />
            </Form.Item>


            <Button type='primary' htmlType='submit' className='marglauto block margt20'>确定</Button>
        </Form>
    )
};

export default forwardRef(Index);

