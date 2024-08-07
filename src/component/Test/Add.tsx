
  import React, { forwardRef,useEffect,useRef } from 'react';
import type { FC } from 'react';
import { Button, Form, Input, App, Select,DatePicker } from 'antd';
import CustomSelect from '~/common/Select';
import * as req from '~/class/request';
import { CustomUpload } from '~/Set/AddBasic';

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
        let url = 'config/addConfig';
        if (_props.type === 'edit') {
            url = 'config/editConfig';
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
                                name='id'
                                label='测试ID'
                                rules={[{ required: true, message: '请输入测试ID' }]}
                            >
                                <Input />
                            </Form.Item>
                            

            <Button type='primary' htmlType='submit' className='marglauto block margt20'>确定</Button>
        </Form>
    )
};

export default forwardRef(Index);

