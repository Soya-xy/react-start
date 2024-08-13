import { App, Button, Cascader, DatePicker, Form, Input, Radio, Select } from "antd";
import { forwardRef, useContext, useEffect, useRef, useState } from "react";
import { areaOption, cityOptions } from "~/utils/area";
import { UserContent } from "~/utils/content";
import * as req from '~/class/request';
import { customerStatus, loanType, starType } from "~/utils/const";
import dayjs from "dayjs";

const Index = (_props: any) => {
  const { message } = App.useApp();
  const formRef = useRef<any>();
  const userId = useContext(UserContent);

  useEffect(() => {
    req.post('MyCustomer/editInfo', { id: userId, type: 'base' }).then(res => {
      if (res.code === 1) {
        formRef.current.setFieldsValue({
          ...res.data,
          stime: res.data.stime ? dayjs(res.data.stime) : null,
        })
      }
    })
  }, [])

  function onFinish(data: any) {
    let url = 'MyCustomer/addMyCustomer';
    let params = {}
    if (_props.type == 'edit') {
      url = 'MyCustomer/editMyCustomer';
      params = { id: userId }
    }

    if (data.city && Array.isArray(data.city)) {
      data.city = data.city.join('-');
    }
    if (data.age) {
      data.age = Number(data.age)
    }

    params = { ...params, ...data }

    req.post(url, params).then(res => {
      if (res.code === 1) {
        message.success(res.msg, 1.2);
        _props.onOk && _props.onOk();
      } else {
        message.error(res.msg)
      }
    }).catch(err => {
      message.error('保存失败')
    })
  }

  return (
    <Form
      name='base'
      layout="horizontal"
      ref={formRef}
      onFinish={onFinish}
      labelCol={{ span: 8 }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
        <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
          <Input placeholder="请输入姓名" />
        </Form.Item>
        <Form.Item name="phone" label="手机号" rules={[{ required: true }]}>
          <Input placeholder="请输入手机号" />
        </Form.Item>
        <Form.Item name="idcard" label="身份证号" rules={[
          { required: true, message: '请输入身份证号' },
          { pattern: /^\d{18}$/, message: '请输入正确的身份证号' }]}>
          <Input placeholder="请输入身份证号" />
        </Form.Item>
        {/* 来源 */}
        <Form.Item name="source" label="来源" rules={[{ required: true }]}>
          <Select placeholder="请选择" options={[
            { label: '后台录入', value: 1 },
            { label: '表格导入', value: 2 },
          ]}></Select>
        </Form.Item>
        <Form.Item name="city" label="申请城市" rules={[{ required: true }]}>
          <Cascader options={areaOption}
            fieldNames={{ label: 'label', value: 'label' }}
            placeholder='请选择城市'
          />
        </Form.Item>
        <Form.Item name="age" label="年龄" rules={[
          { required: true, message: '请输入年龄' },
          () => ({
            validator(_, value) {
              if (!value || Number(value) >= 18) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('年龄不能小于18岁'));
            },
          }),
        ]}>
          <Input type="number" placeholder="请输入年龄" addonAfter="岁" />
        </Form.Item>
        <Form.Item name="gender" label="性别" rules={[{ required: true }]}>
          <Radio.Group>
            <Radio value="man">男</Radio>
            <Radio value="woman">女</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="marriage" label="婚姻" rules={[{ required: true }]}>
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
        <Form.Item name="schoolType" label="入学类型">
          <Select placeholder="请选择" options={[
            { label: '普通入学', value: 1 },
            { label: '国外留学', value: 2 },
          ]}></Select>
        </Form.Item>
        <Form.Item name="graduatedSchool" label="毕业院校">
          <Input placeholder="请输入毕业院校" />
        </Form.Item>
        <Form.Item name="company" label="客户公司">
          <Input placeholder="请输入客户公司" />
        </Form.Item>

        {/* 申请额度 */}
        <Form.Item name="applyLimit" label="申请额度">
          <Input placeholder="请输入申请额度" addonAfter="万元" />
        </Form.Item>
        <Form.Item name="loanType" label="贷款类型">
          <Select placeholder="请选择" options={loanType}></Select>
        </Form.Item>
        {/* 星级 */}
        <Form.Item name="star" label="星级" rules={[{ required: true }]}>
          <Select
            allowClear
            placeholder='请选择星级'
            className='w-full'
            options={starType}
          />
        </Form.Item>
        <Form.Item name="status" label="状态" rules={[{ required: true }]}>
          <Select
            allowClear
            placeholder='请选择状态'
            className='w-full'
            options={customerStatus}
          />
        </Form.Item>
        {/* 录入时间 */}
        <Form.Item name="stime" label="申请时间">
          <DatePicker placeholder="请选择"
            format='YYYY-MM-DD'
            className="w-full" />
        </Form.Item>

        <Form.Item className="text-right">
          <Button type="primary" htmlType="submit">保存</Button>
        </Form.Item>

      </div>
    </Form>
  )
}

export default forwardRef(Index);
