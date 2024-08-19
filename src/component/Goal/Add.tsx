
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import type { FC } from 'react';
import { Button, Form, Input, App, Select, DatePicker } from 'antd';
import CustomSelect from '~/common/Select';
import * as req from '~/class/request';

const levelList = [
    { value: 'y', label: '正常' },
    { value: 'n', label: '禁用' },
];


const Index = (_props: any, ref: any) => {
    const { message } = App.useApp();
    const formRef = useRef<any>();
    const [staffList, setStaffList] = useState([]);

    useEffect(() => {
        req.post('Goal/Staff', {}).then(res => {
            if (res.code == 1) {
                setStaffList(res.data.map((item: any) => {
                    return { value: item.id, label: item.name }
                }))
            }
        })

    }, [])
    const onFinish = (data: any) => {
        let url = 'Goal/addGoal';
        if (_props.type === 'edit') {
            url = 'Goal/editGoal';
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
            initialValues={{
                // aid: _props.data.aid,
                assessment: _props.data.assessment,
            }}
        >

            <Form.Item
                name='aid'
                label='员工'
                rules={[{ required: true, message: '请输入业绩' }]}
            >
                <Select options={staffList} />
            </Form.Item>


            <Form.Item
                name='assessment'
                label='考核'
                rules={[{ required: true, message: '请输入部门' }]}
            >
                <Input addonAfter="元" />
            </Form.Item>


            <Button type='primary' htmlType='submit' className='marglauto block margt20'>确定</Button>
        </Form>
    )
};

export default forwardRef(Index);

