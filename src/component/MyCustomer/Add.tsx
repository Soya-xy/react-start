
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import type { FC } from 'react';
import { Button, Form, Input, App, Select, DatePicker, Divider, Menu, Radio, Cascader } from 'antd';
import CustomSelect from '~/common/Select';
import * as req from '~/class/request';
import { useSetAtom } from 'jotai';
import { pathAtom } from '~/store/path';
import { cityOptions } from '~/utils/area';
import { starType } from '~/utils/const';

const levelList = [
    { value: 1, label: '正常' },
    { value: 2, label: '禁用' },
];

const Index = (_props: any, ref: any) => {
    const { message } = App.useApp();
    const formRef = useRef<any>();
    const setPath = useSetAtom(pathAtom)
    const [star, setStar] = useState<any>();


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
    const items = [
        { label: '基本信息', key: '1' },
        { label: '身份信息', key: '2' },
        { label: '房产信息', key: '3' },
        { label: '保单信息', key: '4' },
        { label: '信用信息', key: '5' },
        { label: '负债信息', key: '6' },
        { label: '需求信息', key: '7' },
    ]
    const [selected, setSelected] = useState<{ label: string, key: string }>(items[0]);
    const [item, setItem] = useState<number>(1);
    return (
        <div>
            <Form
                layout="horizontal"
                ref={formRef}
                onFinish={onFinish}
                labelCol={{ span: 8 }}
            >
                <div className='flex'>
                    <Menu
                        style={{ width: 156 }}
                        defaultSelectedKeys={['1']}
                        className='text-center'
                        items={items}
                        onClick={e => {
                            setSelected(items.find(item => item.key == e.key)!)
                        }}
                    />
                    <div className='ml-3'>
                        <h2 className='mb-3 ml-2'>{selected.label}</h2>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>

                            <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
                                <Input placeholder="请输入姓名" />
                            </Form.Item>
                            <Form.Item name="phone" label="手机号" rules={[{ required: true }]}>
                                <Input placeholder="请输入手机号" />
                            </Form.Item>
                            {/* 来源 */}
                            <Form.Item name="source" label="来源">
                                <Select placeholder="请选择" options={[
                                    { label: '后台录入', value: 1 },
                                    { label: '表格导入', value: 2 },
                                ]}></Select>
                            </Form.Item>
                            <Form.Item name="city" label="申请城市" rules={[{ required: true }]}>
                                <Cascader options={cityOptions}
                                    fieldNames={{ label: 'label', value: 'label' }}
                                    placeholder='请选择城市'
                                />
                            </Form.Item>
                            <Form.Item name="age" label="年龄" rules={[{ required: true }]}>
                                <Input placeholder="请输入年龄" addonAfter="岁" />
                            </Form.Item>
                            <Form.Item name="gender" label="性别">
                                <Radio.Group>
                                    <Radio value="man">男</Radio>
                                    <Radio value="woman">女</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item name="marriage" label="婚姻">
                                <Radio.Group>
                                    <Radio value="y">已婚</Radio>
                                    <Radio value="n">未婚/离异</Radio>
                                </Radio.Group>
                            </Form.Item>

                            <Form.Item name="residence" label="户籍">
                                <Input placeholder="请输入户籍" />
                            </Form.Item>
                            <Form.Item name="education" label="学历">
                                <Select placeholder="请选择" options={[
                                    { label: '未上学', value: 1 },
                                    { label: '小学文凭', value: 2 },
                                    { label: '初中文凭', value: 3 },
                                    { label: '高中文凭', value: 4 },
                                    { label: '大学及以上文凭', value: 5 },
                                ]}></Select>
                            </Form.Item>
                            <Form.Item name="school_type" label="入学类型">
                                <Select placeholder="请选择" options={[
                                    { label: '普通入学', value: 1 },
                                    { label: '国外留学', value: 2 },
                                ]}></Select>
                            </Form.Item>
                            <Form.Item name="graduated_school" label="毕业院校">
                                <Input placeholder="请输入毕业院校" />
                            </Form.Item>
                            <Form.Item name="company" label="客户公司">
                                <Input placeholder="请输入客户公司" />
                            </Form.Item>
                            <Form.Item name="idcard" label="身份证号">
                                <Input placeholder="请输入身份证号" />
                            </Form.Item>
                            {/* 申请额度 */}
                            <Form.Item name="apply_limit" label="申请额度">
                                <Input placeholder="请输入申请额度" addonAfter="万元" />
                            </Form.Item>
                            <Form.Item name="loan_type" label="贷款类型">
                                <Select placeholder="请选择" options={[
                                    { label: '车', value: 1 },
                                    { label: '代发', value: 2 },
                                    { label: '保单', value: 3 },
                                    { label: '公积金', value: 4 },
                                    { label: '房', value: 5 },
                                ]}></Select>
                            </Form.Item>
                            {/* 录入时间 */}
                            <Form.Item name="stime" label="申请时间">
                                <DatePicker placeholder="请选择录入时间" />
                            </Form.Item>
                        </div>
                    </div>
                </div>
                <Divider />
                <div>
                    <Radio.Group defaultValue={item} style={{ marginBottom: 16 }} onChange={(e) => {
                        setItem(e.target.value)
                    }}>
                        <Radio.Button value={1}>客户跟踪</Radio.Button>
                        <Radio.Button value={2}>分配记录</Radio.Button>
                    </Radio.Group>
                    {item == 1 &&
                        <div>
                            <div className='flex items-center gap-2'>
                                <h3>ID:123</h3>
                                <div className='flex items-center'>
                                    <div className='mr-2'>星级</div>
                                    <Select
                                        allowClear
                                        placeholder='请选择星级'
                                        className='w-150px marginr12'
                                        options={starType}
                                        onChange={(value) => {
                                            setStar(value);
                                        }}
                                    />
                                </div>
                                <div className='flex items-center'>
                                    <div className='mr-2'>状态</div>
                                    <Select
                                        allowClear
                                        placeholder='请选择状态'
                                        className='w-150px marginr12'
                                    />
                                </div>
                                <p>当前跟进人：络金</p>
                            </div>
                            
                        </div>}
                    {item == 2 && <div>
                        <h3>分配记录</h3>
                    </div>}
                </div>
            </Form>

        </div>
    )
};

export default forwardRef(Index);

