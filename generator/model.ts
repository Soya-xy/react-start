import type { GeneratorVueOptions } from './'

export function templateAdd(item: GeneratorVueOptions) {
    return `
  import React, { forwardRef,useEffect,useRef } from 'react';
import type { FC } from 'react';
import { Button, Form, Input, App, Select,DatePicker } from 'antd';
import CustomSelect from '~/common/Select';
import * as req from '~/class/request';
import CustomUpload from '~/common/UploadImg';

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
        let url = '${item.curdApi.replace(/%/g, 'add')}';
        if (_props.type === 'edit') {
            url = '${item.curdApi.replace(/%/g, 'edit')}';
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
            ${item.field.map((field) => {
        switch (field.type) {
            case 'select':
            case 'switch':
                return `
                            <Form.Item
                                name='${field.value}'
                                label='${field.name}'
                                options={levelList}
                            >
                            </Form.Item>
                            `
            case 'image':
                return `
                            <Form.Item
                                name='${field.value}'
                                label='${field.name}'
                                rules={[{ required: true, message: '请上传${field.name}' }]}
                            >
                                <CustomUpload />
                            </Form.Item>
                            `

            case 'datetime':
                return `
                            <Form.Item
                                name='${field.value}'
                                label='${field.name}'
                                rules={[{ required: true, message: '请选择${field.name}' }]}
                            >
                                <DatePicker showTime />
                            </Form.Item>
                            `
            default:
                return `
                            <Form.Item
                                name='${field.value}'
                                label='${field.name}'
                                rules={[{ required: true, message: '请输入${field.name}' }]}
                            >
                                <Input />
                            </Form.Item>
                            `
        }
    }).join('\n')
        }

            <Button type='primary' htmlType='submit' className='marglauto block margt20'>确定</Button>
        </Form>
    )
};

export default forwardRef(Index);

`
}

