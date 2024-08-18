import React, { forwardRef } from 'react';
import type { FC } from 'react';
import { Button, Form, Input, App } from 'antd';
import CustomSelect from '../../common/Select';
import * as req from '../../class/request';

const Index = (_props: any, ref: any) => {
    const { message } = App.useApp();
    const onFinish = (data: any) => {
        let url = 'admin/addAdmin';
        if (_props.type === 'edit') {
            url = 'admin/editAdmin';
            data.admin_id = _props.data.admin_id;
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
                username: _props.data.username,
                role_id: _props.data.role_id,
                number: _props.data.number,
                name: _props.data.name,
                password: _props.data.password,
                phone: _props.data.phone,
                email: _props.data.email,
                remark: _props.data.remark,
            }}
        >
            <Form.Item label='角色' name='pid' rules={[{ required: true, message: '请选择角色' }]}>
                <CustomSelect type='allrole' />
            </Form.Item>
            <Form.Item label='部门' name='pid' rules={[{ required: true, message: '请选择角色' }]}>
                <CustomSelect type='allrole' />
            </Form.Item>
            <Form.Item label='用户名' name='account' rules={[{ required: true, message: '请设置5-12位用户名' }]}>
                <Input placeholder='请设置5-12位用户名' />
            </Form.Item>
            {/* 编号 */}
            <Form.Item label='编号' name='number' rules={[{ required: true, message: '请设置编号' }]}>
                <Input placeholder='请设置编号' />
            </Form.Item>
            <Form.Item label='用户昵称' name='name' rules={[{ required: true, message: '请设置用户昵称' }]}>
                <Input placeholder='请设置用户昵称' />
            </Form.Item>
            <Form.Item label='登录密码' name='password'>
                <Input.Password placeholder='留空默认密码为123456' />
            </Form.Item>
            {/* 确认密码 */}
            <Form.Item label='确认密码' name='password2'>
                <Input.Password placeholder='请设置确认密码' />
            </Form.Item>
            {/* 手机号 */}
            <Form.Item label='手机号' name='phone' rules={[{ required: true, message: '请设置手机号' }]}>
                <Input placeholder='请设置手机号' />
            </Form.Item>
            {/* 邮箱 */}
            <Form.Item label='邮箱' name='email'>
                <Input placeholder='请设置邮箱' />
            </Form.Item>
            {/* 备注 */}
            <Form.Item label='备注' name='remark'>
                <Input placeholder='请设置备注' />
            </Form.Item>
            <Button type='primary' htmlType='submit' className='marglauto block margt20'>确定</Button>
        </Form>
    )
};

export default forwardRef(Index);
