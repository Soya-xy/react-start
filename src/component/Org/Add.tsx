
import React, { forwardRef, useEffect, useRef } from 'react';
import { Button, Form, Input, App, Select, DatePicker } from 'antd';
import * as req from '~/class/request';

const levelList = [
    { value: 1, label: '正常' },
    { value: 2, label: '禁用' },
];

const Index = (_props: any, ref: any) => {
    console.log("🚀 ~ Index ~ _props:", _props)
    const { message } = App.useApp();
    const formRef = useRef<any>();

    useEffect(() => {
        formRef.current.setFieldsValue(_props.data)
    }, [])

    const onFinish = (data: any) => {
        let url = 'Department/addDepartment';
        if (_props.type === 'edit') {
            url = 'Department/editDepartment';
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
                label='上级部门ID'
            >
                <Input disabled placeholder={_props.data.pid == 0 ? '此部门为顶级部门' : _props.data.pid} />
            </Form.Item>

            <Form.Item
                name='name'
                label='名称'
                rules={[{ required: true, message: '请输入名称' }]}
            >
                <Input />
            </Form.Item>


            <Form.Item
                name='principal'
                label='负责人'
                rules={[{ required: true, message: '请输入负责人' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name='phone'
                label='电话'
                rules={[{ required: true, message: '请输入电话' }]}
            >
                <Input />
            </Form.Item>
            {/* 部门职能 */}
            <Form.Item
                name='task'
                label='职能'
                rules={[{ required: true, message: '请输入职能' }]}
            >
                <Input />
            </Form.Item>
            {/* 地址 */}
            <Form.Item
                name='addr'
                label='地址'
                rules={[{ required: true, message: '请输入地址' }]}
            >
                <Input />
            </Form.Item>
            {/* 备注 */}
            <Form.Item
                name='memo'
                label='备注'
            >
                <Input.TextArea />
            </Form.Item>

            <Button type='primary' htmlType='submit' className='marglauto block margt20'>确定</Button>
        </Form>
    )
};

export default forwardRef(Index);

