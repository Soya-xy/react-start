import React, { forwardRef, } from 'react';
import { Button, Input, Form, Space, Divider, Select } from 'antd';
import Title from '~/common/Title';
import { PlusOutlined } from '@ant-design/icons';

const CodeGenerate = (_props: any, ref: any) => {

  function onFinish(values: any) {
    console.log('Received values:', values);

    if (import.meta.hot) {
      import.meta.hot.send('generator:react', values)
    }
  }

  return (
    <React.Fragment>
      <div className='h100 flexColumn'>
        <div className='bgbai margt20 flex_auto'>
          <Title title='代码生成' />
          <div className='mx-10 overflow-y-scroll h-80vh'>
            <Form
              onFinish={onFinish}
              name="dynamic_form_complex"
              style={{ maxWidth: 600 }}
              autoComplete="off"
            >
              <Form.Item
                name="menuname"
                label="菜单名称"
                rules={[{ required: true, }]}
              >
                <Input placeholder="菜单名称" />
              </Form.Item>
              <Form.Item
                name="filename"
                label="文件名称"
                rules={[{ required: true, }]}
              >
                <Input placeholder="文件名称" />
              </Form.Item>
              <Title title='字段配置' />
              <Form.List name="field">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }: any) => (
                      <div key={key} className="flex-col">
                        <Form.Item
                          {...restField}
                          name={[key, 'name']}
                          label="字段名称"
                        >
                          <Input placeholder="字段名称" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[key, 'value']}
                          label="字段值"
                        >
                          <Input placeholder="字段值" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[key, 'search']}
                          label="是否搜索"
                        >
                          <Select defaultValue={0} options={[
                            { value: 1, label: '是' },
                            { value: 0, label: '否' },
                          ]} />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[key, 'type']}
                          label="文件名称"
                        >
                          <Select defaultValue="text" options={[
                            { value: 'text', label: '文字' },
                            { value: 'number', label: '数字' },
                            { value: 'datetime', label: '日期时间' },
                            { value: 'switch', label: '开关' },
                            { value: 'image', label: '图片' },
                            { value: 'tag', label: '标签' }
                          ]} />
                        </Form.Item>
                        <Divider />
                      </div>
                    ))}
                    <Form.Item>
                      <Button type="dashed" onClick={() => add()} block >
                        添加字段
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>

    </React.Fragment>
  )
};

export default forwardRef(CodeGenerate);
