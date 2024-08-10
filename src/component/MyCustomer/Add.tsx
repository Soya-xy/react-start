
import React, { forwardRef, useEffect, useRef } from 'react';
import type { FC } from 'react';
import { Button, Form, Input, App, Select, DatePicker } from 'antd';
import CustomSelect from '~/common/Select';
import * as req from '~/class/request';
import { useSetAtom } from 'jotai';
import { pathAtom } from '~/store/path';

const levelList = [
    { value: 1, label: '正常' },
    { value: 2, label: '禁用' },
];

const Index = (_props: any, ref: any) => {
    const { message } = App.useApp();
    const formRef = useRef<any>();
    const setPath = useSetAtom(pathAtom)

    // useEffect(() => {
    //     formRef.current.setFieldsValue(_props.data)
    // }, [])

    const onFinish = (data: any) => {
        let url = 'MyCustomer/addCustomer';
        if (_props.type === 'edit') {
            url = 'MyCustomer/editCustomer';
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
        <div>
            <Button
                onClick={() => {
                    setPath('MenuSet')
                }}
            >button</Button>
        </div>
    )
};

export default forwardRef(Index);

