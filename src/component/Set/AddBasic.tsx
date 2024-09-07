import React, { useImperativeHandle, forwardRef, useRef, useEffect, useState } from 'react';
import { App, Button, Form, Input, Select, Switch } from 'antd';
import FileList from '../../common/FileList';
import Helper from '../../class/Helper';
import Editor from '../../common/Editor';
import * as req from '../../class/request';

const typeList = [
    { value: 1, label: '文本' },
    { value: 6, label: '二维码' },
    { value: 2, label: '数字' },
    { value: 3, label: '图片' },
    { value: 4, label: '图文' },
    { value: 5, label: '开/关' },
]

interface types {
    value?: string;
    onChange?: (value: string) => void;
}
// 上传图片组件
const CustomUpload: React.FC<types> = ({ value = '', onChange }) => {
    const fileRef: any = useRef(null);
    const triggerChange = (url: string) => {
        onChange?.(url);
    };
    return (
        <React.Fragment>
            <div className='upbox' style={{ border: value != '' ? 0 : '' }} onClick={() => {
                fileRef.current.refresh();
            }}>
                {value == '' && <React.Fragment>
                    <span className='iconfont icon-xiangji'></span>
                    <span className='zi'>选择图片</span>
                </React.Fragment>}
                {value != '' && <img alt='' src={value} style={{ width: '100%', height: '100%' }} />}
            </div>

            {/* 文件库 */}
            <FileList ref={fileRef} type={1} onOk={(data: any) => {
                // console.log(data);
                triggerChange(data[0])
            }} />
        </React.Fragment>
    )
}

const Index = (_props: any, ref: any) => {
    const formRef: any = useRef(null);
    const editRef: any = useRef(null);
    const { message } = App.useApp();
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(() => {
        if (_props.type == 'edit') {
            let value = _props.data.value;
            if (_props.data.type == 5) {
                value = value == 1 ? true : false;
            }
            formRef.current.setFieldsValue({
                type: _props.data.type,
                title: _props.data.title,
                value,
                canDel: _props.data.canDel == 1 ? true : false
            })
            if (_props.data.type == 4) {
                setTimeout(() => {
                    editRef.current.setContent(value)
                }, 100);
            }
        } else {
            formRef.current.setFieldsValue({
                type: 1,
            })
        }
    }, [])
    // 监听数据改变
    const onValuesChange = (res: any, values: any) => {
        let key = Object.keys(res)[0];
        if (key == 'type') {
            let value = undefined;
            if (values.type == 5) {
                value = false;
            }
            formRef.current.setFieldsValue({
                value,
            })
        } else if (key == 'value') {
            if (values.type == 2) {  // 只能输入数字
                let value = Helper.getNums(res[key]);
                formRef.current.setFieldsValue({
                    value,
                })
            }
        }
    }
    // 提交
    const onFinish = (data: any) => {
      
        setLoading(true)
        if (data.type == 4) {
            data.value = data.value.toHTML();
        } else if (data.type == 5) {
            data.value = data.value ? 1 : 0;
        }
        var url = 'setting/addSetting';
        if (_props.type == 'edit') {
            url = 'setting/editSetting';
            data.id = _props.data.id;
        }
        data.canDel = data.canDel ? 1 : 0;

        req.post(url, data).then(res => {
            if (res.code == 1) {
                message.success(res.msg, 1.2)
                _props.onOk()
            } else {
                message.error(res.msg, 1.2);
            }
            setLoading(false);
        })
    }
    return (
        <React.Fragment>
            <Form
                ref={formRef}
                initialValues={{
                    // type: 1,
                }}
                onFinish={onFinish}
                onValuesChange={onValuesChange}
            >
                <div className='flwp'>
                    <Form.Item className='item49' label='配置名称' name='title' rules={[{ required: true, message: '请输入配置名称' }]}>
                        <Input autoComplete='off' placeholder='请输入配置名称' />
                    </Form.Item>
                    <Form.Item className='item49' label='值类型' name='type' required>
                        <Select
                            placeholder='请选择'
                            options={typeList}
                        />
                    </Form.Item>
                    <Form.Item className='item49' label='允许删除' name='canDel' valuePropName='checked'>
                        <Switch disabled={_props.type == 'edit' ? true : false} checkedChildren='是' unCheckedChildren='否' />
                    </Form.Item>
                    <Form.Item noStyle shouldUpdate={(prev, cur) => prev.type != cur.type}>
                        {({ getFieldValue }) => (
                            <React.Fragment>
                                {/* 文本 */}
                                {(getFieldValue('type') == 1 || getFieldValue('type') == 6) && <Form.Item className='row10' label='配置值' name='value' rules={[{ required: true, message: '请输入内容' }]}>
                                    <Input.TextArea rows={8} placeholder='请输入' />
                                </Form.Item>}
                                {/* 数字 */}
                                {getFieldValue('type') == 2 && <Form.Item className='row10' label='配置值' name='value' rules={[{ required: true, message: '请输入内容' }]}>
                                    <Input autoComplete='off' placeholder='请输入' />
                                </Form.Item>}
                                {/* 图片 */}
                                {getFieldValue('type') == 3 && <Form.Item className='row10' label='配置值' name='value' rules={[{ required: true, message: '请输入内容' }]}>
                                    <CustomUpload />
                                </Form.Item>}
                                {/* 图文 */}
                                {getFieldValue('type') == 4 && <Form.Item className='row10' label='配置值' name='value' rules={[{ required: true, message: '请输入内容' }]}>
                                    <Editor ref={editRef} />
                                </Form.Item>}
                                {/* 开关 */}
                                {getFieldValue('type') == 5 && <Form.Item className='row10' label='配置值' name='value' required valuePropName='checked'>
                                    <Switch checkedChildren='开' unCheckedChildren='关' />
                                </Form.Item>}
                            </React.Fragment>
                        )}
                    </Form.Item>
                </div>
                <Button loading={loading} type="primary" htmlType='submit' className='marglauto block margt20'>确定</Button>
            </Form>
        </React.Fragment>
    )
};

export default forwardRef(Index);
