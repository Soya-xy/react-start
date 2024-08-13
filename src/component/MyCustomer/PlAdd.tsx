import React, { forwardRef } from 'react';
import { Button, Form, Input, App, Select, Upload } from 'antd';
import * as req from '~/class/request';
import * as XLSX from 'xlsx';
import Helper from '~/common/Helper';
import { customerStatus, loanType } from '~/utils/const';
import dayjs from 'dayjs';
const Index = (_props: any, ref: any) => {

    const [items, setItems] = React.useState([])

    const { message } = App.useApp();

    const onFinish = () => {
        if (items.length === 0) {
            message.error('请导入题目！');
            return
        }

        req.post('MyCustomer/addAll', { all: items }).then((res: any) => {
            if (res.code == 1) {
                message.success(res.msg, 1.2);
                _props.onOk && _props.onOk();
            } else {
                message.error(res.msg, 1.2)
            }
        })
    }
    const [uploadHolder, setUploadHolder] = React.useState("点击选择或者拖入报表文件")

    function getFileJson(info: any) {

        let files = info;
        let name = files.name;
        // 获取文件后缀
        let reader = new FileReader();
        reader.readAsArrayBuffer(files);
        reader.onload = (event: any) => {
            const result = {
                index: 0,
                msg: '',
                subject: []
            }
            try {
                let { result } = event.target;
                // 读取文件
                let workbook = XLSX.read(result, { type: 'binary', cellDates: true });
                let keyRows = workbook.Sheets[workbook.SheetNames[0]];
                let data = XLSX.utils.sheet_to_json(keyRows, { header: 1, defval: '' });
                data.splice(0, 1)
                const subject: any = []
                const have: any = {
                    '有': 'y',
                    '无': 'n'
                }
                data.forEach((item: any, k) => {
                    const info: any = {
                        name: item[0],
                        phone: item[1],
                        gender: item[2],
                        star: item[3],
                        status: customerStatus.find((statusItem) => statusItem.value === item[4])?.value,
                        age: item[5],
                        remark: item[6],
                        aname: item[7],
                        is_house: have[item[8]],
                        is_car: have[item[9]],
                        is_policy: have[item[10]],
                        is_fund: have[item[11]],
                        apply_limit: item[12],
                        stime: dayjs(item[13]).format('YYYY-MM-DD'),
                        loan_type: loanType.find((loanTypeItem) => loanTypeItem.value === item[14])?.value,
                        source: 2,
                        city: item[15],
                        source_media: item[16],
                    }
                    console.log(item, k);


                    subject.push(info)
                })
                setUploadHolder("共" + subject.length + "行数据")
                setItems(subject)
            } catch (error) {
                console.log("🚀 ~ getFileJson ~ error:", error)
                console.log("🚀 ~ data.forEach ~ item:", result)
                message.error(`第${result.index + 1}行数据格式错误，请检查！`);
            }
        }
    }
    return (
        <Form
            onFinish={onFinish}
            autoComplete='off'
            labelCol={{ flex: '82px' }}
            initialValues={{
                id: _props.data?.id,
                title: _props.data?.title,
                cont: _props.data?.cont,
                sort: _props.data?.sort,
            }}
        >
            <Form.Item valuePropName="fileList" label="文件" rules={[{ required: true, message: '请导入模板!' }]}>
                <Upload.Dragger accept={".xlsx"} maxCount={1}

                    onRemove={() => {
                        setUploadHolder("点击选择或者拖入报表文件")
                        setItems([])
                    }} beforeUpload={(file) => {
                        getFileJson(file)
                        return false
                    }}>
                    {/* <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p> */}
                    <p className="ant-upload-text">{uploadHolder}</p>
                    <a onClick={(e) => {
                        Helper.fetchTemplete("导入模板.xlsx")
                        e.stopPropagation();
                    }}>下载模板</a>
                </Upload.Dragger>
            </Form.Item>
            <Button type='primary' htmlType='submit' className='marglauto block margt20'>确定</Button>
        </Form>
    )
};

export default forwardRef(Index);
