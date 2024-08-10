import React, { forwardRef, useRef, useState, useEffect } from 'react';
import { Button, Form, Input, App, Select, Cascader, DatePicker } from 'antd';
import FileList from '../common/FileList';
import * as req from '../class/request';
import { cityOptions } from '~/utils/area';
import dayjs from 'dayjs';

interface types {
    value?: string;
    className?: string;
    onChange?: (value: string) => void;
}
// 上传图片组件
const CustomUpload: React.FC<types> = ({ value = '', className = '', onChange }) => {
    const fileRef: any = useRef(null);
    const triggerChange = (url: string) => {
        onChange?.(url);
    };
    return (
        <React.Fragment>
            <div className={`${className} editavatar cursor`} style={{ border: value !== '' ? 0 : '' }} onClick={() => {
                fileRef.current.refresh();
            }}>
                {value === '' && <img alt='' src={new URL('../imgs/default.png', import.meta.url).href} />}
                {value !== '' && <img alt='' src={value} style={{ width: '60px', height: '60px' }} />}
                <span className='zi'>修改头像</span>
            </div>

            {/* 文件库 */}
            <FileList ref={fileRef} type={1} onOk={(data: any) => {
                triggerChange(data[0])
            }} />
        </React.Fragment>
    )
}

const Index = (_props: any, ref: any) => {
    const [form] = Form.useForm();
    const { message } = App.useApp();
    const [loading, setLoading] = useState(false);
    const info = _props.data;
    const [userInfo, setUserInfo] = useState<any>({});


    useEffect(() => {
        req.post('AdminInfo/info').then(res => {
            console.log(res);
            if (res.code == 1) {
                setUserInfo(res.data);

                form.setFieldsValue({
                    ...res.data,
                    entry_time: dayjs(res.data.entry_time),
                    birth: dayjs(res.data.birth),
                    employment_time: dayjs(res.data.employment_time),
                    city: res.data.city.split(' '),
                });
            }
        })
    }, [])
    const onFinish = (data: any) => {
        setLoading(true)
        console.log(data);
        if (data.entry_time) {
            data.entry_time = dayjs(data.entry_time).format('YYYY-MM-DD');
        }
        if (data.birth) {
            data.birth = dayjs(data.birth).format('YYYY-MM-DD');
        }
        if (data.employment_time) {
            data.employment_time = dayjs(data.employment_time).format('YYYY-MM-DD');
        }
        if (data.city) {
            data.city = data.city.join(' ');
        }
        req.post('AdminInfo/edit', data).then(res => {
            if (res.code == 1) {
                message.success('修改成功', 1.2)
                _props.onOk()
            } else {
                message.error(res.msg, 1.2)
            }
            setLoading(false)
        })
    }
    return (
        <div className='w-full'>
            <Form className='w-full'
                form={form}
                onFinish={onFinish}
                // labelCol={{ span: 3 }}
                wrapperCol={{ span: 24 }}
            >
                <div className='w-full'>

                    <div className='flex w-full'>
                        <div className='min-w-[200px]'>
                            <CustomUpload value={userInfo.avatar} onChange={(url) => {
                                form.setFieldsValue({ avatar: url })
                            }} />
                        </div>
                        <div className='ml-4 flex-1'>
                            <span>{info.name}</span>
                            <div className='flex flex-wrap'>
                                <Form.Item className='item32' name="native" label="籍贯">
                                    <Input placeholder='请输入籍贯' />
                                </Form.Item>
                                <Form.Item className='item32' name="employment_time" label="贷款行业从业时间">
                                    <DatePicker
                                        format='YYYY-MM-DD'
                                        placeholder='请选择入职时间'
                                        style={{ width: '100%' }}
                                    />
                                </Form.Item>
                                <Form.Item className='item32' name="education" label="学历">
                                    <Input placeholder='请输入学历' />
                                </Form.Item>
                            </div>
                            <div className='flex'>
                                <Form.Item className='item32' name="graduated_school" label="毕业院校">
                                    <Input placeholder='请输入毕业院校' />
                                </Form.Item>
                                <Form.Item className='item32' name="city" label="城市">
                                    <Cascader options={cityOptions}
                                        fieldNames={{ label: 'label', value: 'label' }}
                                        placeholder='请选择城市'
                                    />
                                </Form.Item>
                                <Form.Item className='item32' name="position" label="岗位">
                                    <Input placeholder='请输入岗位' />
                                </Form.Item>
                            </div>
                            <div className='flex'>
                                <Form.Item className='item32' name="entry_time" label="入职时间">
                                    <DatePicker
                                        format='YYYY-MM-DD'
                                        placeholder='请选择入职时间'
                                        style={{ width: '100%' }}
                                    />
                                </Form.Item>
                                {/* 手机号 */}
                                <Form.Item className='item32' name="phone" label="手机号">
                                    <Input placeholder='请输入手机号' />
                                </Form.Item>
                                {/* 公司 */}
                                <Form.Item className='item32' name="company" label="公司">
                                    <Input placeholder='请输入公司' disabled />
                                </Form.Item>
                            </div>
                            <div className='flex'>
                                <Form.Item className='item32' name="birth" label="出生日期">
                                    <DatePicker
                                        format='YYYY-MM-DD'
                                        placeholder='请选择出生日期'
                                        style={{ width: '100%' }}
                                    />
                                </Form.Item>
                                {/* 上一家公司名称 */}
                                <Form.Item className='item32' name="previous_company" label="上一家公司名称">
                                    <Input placeholder='请输入上一家公司名称' />
                                </Form.Item>
                                {/* 一级部门 */}
                                <Form.Item className='item32' name="department_1" label="一级部门">
                                    <Input placeholder='请输入一级部门' disabled />
                                </Form.Item>
                            </div>
                            <div className="flex">
                                {/* 身份证 */}
                                <Form.Item className='item32' name="idcard" label="身份证">
                                    <Input placeholder='请输入身份证' />
                                </Form.Item>
                                {/* 上一家公司职务 */}
                                <Form.Item className='item32' name="previous_position" label="上一家公司职务">
                                    <Input placeholder='请输入上一家公司职务' />
                                </Form.Item>
                                {/* 二级部门 */}
                                <Form.Item className='item32' name="department_2" label="二级部门">
                                    <Input placeholder='请输入二级部门' disabled />
                                </Form.Item>
                            </div>
                        </div>
                    </div>
                    {/* 上传毕业证、报告 */}
                    <div className='flex'>
                        <Form.Item name="diploma" className='item23 userInfoItem' label="上传毕业证">
                            <CustomUpload value={userInfo.diploma} onChange={(url) => {
                                form.setFieldsValue({ diploma: url })
                            }} />
                        </Form.Item>
                        <Form.Item name="report" className='item23 userInfoItem' label="提交报告">
                            <CustomUpload value={userInfo.report} onChange={(url) => {
                                form.setFieldsValue({ report: url })
                            }} />
                        </Form.Item>
                        <Form.Item name="credit" className='item23 userInfoItem' label="征信报告">
                            <CustomUpload value={userInfo.credit} onChange={(url) => {
                                form.setFieldsValue({ credit: url })
                            }} />
                        </Form.Item>
                    </div>
                    <div>
                        <span className='mb-3'>个人简介</span>
                        <Form.Item name="profile" className='mt-3'>
                            <Input.TextArea autoSize={{ minRows: 4, maxRows: 7 }} placeholder='请输入个人简介' />
                        </Form.Item>
                    </div>

                </div>

                <div className='flex justify-end'>
                    <Button loading={loading} className='mr-2' htmlType="button" onClick={() => _props.onCancel()}>取消</Button>
                    <Button loading={loading} type="primary" htmlType='submit' >确定</Button>
                </div>
            </Form>

        </div>
    )
};

export default forwardRef(Index);
