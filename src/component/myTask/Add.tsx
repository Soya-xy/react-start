
  import React, { forwardRef,useEffect,useRef } from 'react';
import type { FC } from 'react';
import { Button, Form, Input, App, Select,DatePicker } from 'antd';
import CustomSelect from '~/common/Select';
import * as req from '~/class/request';

const Index = (_props: any, ref: any) => {
    const { message } = App.useApp();
    const formRef = useRef<any>();

    useEffect(() => {
        formRef.current.setFieldsValue(_props.data)
    }, [])

    const onFinish = (data: any) => {
        let url = 'myPerformance/addtask';
        if (_props.type === 'edit') {
            url = 'myPerformance/edittask';
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
                                name='departmentName'
                                label='部门'
                                rules={[{ required: true, message: '请输入部门' }]}
                            >
                                <Input />
                            </Form.Item>
                            

                            <Form.Item
                                name='status'
                                label='状态'
                                rules={[{ required: true, message: '请输入状态' }]}
                            >
                                <Input />
                            </Form.Item>
                            

                            <Form.Item
                                name='content'
                                label='绩效计划'
                                rules={[{ required: true, message: '请输入绩效计划' }]}
                            >
                                <Input />
                            </Form.Item>
                            

                            <Form.Item
                                name='complete_info'
                                label='完成情况'
                                rules={[{ required: true, message: '请输入完成情况' }]}
                            >
                                <Input />
                            </Form.Item>
                            

                            <Form.Item
                                name='complete_progress'
                                label='任务进度'
                                rules={[{ required: true, message: '请输入任务进度' }]}
                            >
                                <Input />
                            </Form.Item>
                            

                            <Form.Item
                                name='end_date'
                                label='最后期限'
                                rules={[{ required: true, message: '请输入最后期限' }]}
                            >
                                <Input />
                            </Form.Item>
                            

                            <Form.Item
                                name='remarks'
                                label='审核意见'
                                rules={[{ required: true, message: '请输入审核意见' }]}
                            >
                                <Input />
                            </Form.Item>
                            

                            <Form.Item
                                name='sub_time'
                                label='提交时间'
                                rules={[{ required: true, message: '请选择提交时间' }]}
                            >
                                <DatePicker showTime />
                            </Form.Item>
                            

                            <Form.Item
                                name='audit_time'
                                label='审核时间'
                                rules={[{ required: true, message: '请选择审核时间' }]}
                            >
                                <DatePicker showTime />
                            </Form.Item>
                            

            <Button type='primary' htmlType='submit' className='marglauto block margt20'>确定</Button>
        </Form>
    )
};

export default forwardRef(Index);

