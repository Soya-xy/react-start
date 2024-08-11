import { App, Button, Card, Descriptions, Form, Select } from "antd"
import { forwardRef, useContext, useEffect, useState } from "react"
import * as req from '~/class/request';
import Title from "~/common/Title";
import { loanType, microLoan } from "~/utils/const";
import { UserContent } from "~/utils/content";

const Index = () => {
  const { message } = App.useApp();

  const userId = useContext(UserContent);
  const [info, setInfo] = useState<any>({});

  useEffect(() => {
    req.post('MyCustomer/editInfo', { id: userId, type: 'all' }).then(res => {
      if (res.code === 1) {
        setInfo(res.data)
      }
    })
  },[])

  return <>
     <div>
      <Card title={<Title title="基本信息" />} style={{ marginBottom: 16 }}>
        <Descriptions column={2}>
          <Descriptions.Item label="姓名">{info.name}</Descriptions.Item>
          <Descriptions.Item label="手机号码">{info.phone}</Descriptions.Item>
          <Descriptions.Item label="年龄">{info.age}岁</Descriptions.Item>
          <Descriptions.Item label="婚姻">{info.marriage === 'y' ? '已婚' : '未婚/离异'}</Descriptions.Item>
          <Descriptions.Item label="申请额度">{info.apply_limit || 0}万元</Descriptions.Item>
          <Descriptions.Item label="来源渠道">{['后台录入','表格导入'][info.source]}</Descriptions.Item>
          <Descriptions.Item label="申请城市">{info.city || ''}</Descriptions.Item>
          <Descriptions.Item label="性别">{info.gender === 'man' ? '先生' : '女士'}</Descriptions.Item>
          <Descriptions.Item label="来源类型">{loanType.find(item => item.value === info.loan_type)?.label}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title={<Title title="车产信息" />} style={{ marginBottom: 16 }}>
        <Descriptions>
          <Descriptions.Item label="名下车产情况">{info.car === 'n' ? '无' : '有'}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title={<Title title="信用信息" />}>
        <Descriptions>
          <Descriptions.Item label="微粒贷额度">{microLoan.find(item => item.value === info.micro_loan)?.label}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  </>
}
export default forwardRef(Index)
