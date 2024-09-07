import React, { forwardRef, useRef, useState, useEffect } from 'react';
import { Button, Form, Input, App, Card } from 'antd';
import FileList from '../common/FileList';
import * as req from '../class/request';
import dayjs from 'dayjs';

interface types {
    value?: string;
    onChange?: (value: string) => void;
}


const Index = (_props: any, ref: any) => {
    const [form] = Form.useForm();
    const { message } = App.useApp();
    const [loading, setLoading] = useState(false);
    const info = _props.data;
    const [data, setData] = useState<any>([])
    console.log(info)
    useEffect(() => {
        req.post('Notice/NoticeList', {
            page: 1,
            size: 5,
            orderBy: 'desc',

        }).then(res => {
            setData(res.data.datas)
        })
    }, [])
    const onFinish = (data: any) => {
        console.log(data)
        setLoading(true)
        req.post('admin/editAvatar', data).then(res => {
            if (res.code == 1) {
                message.success(res.msg, 1.2)
                _props.onOk()
            } else {
                message.error(res.msg, 1.2)
            }
            setLoading(false)
        })
    }
    return (
        <div>
            {
                data.map((item: any) => {
                    return (
                        <Card style={{ width: 300 }} key={item.id} className='!my-2'>
                            <p>标题：{item.title}</p>
                            <p dangerouslySetInnerHTML={{ __html: item.msg }}></p>
                            <div className='flex justify-between items-center mt-2'>
                                <p>发送人：{item?.SiData?.name}</p>
                                <p>{dayjs(item.stime).format('YYYY-MM-DD HH:mm:ss')}</p>
                            </div>
                        </Card>
                    )
                })
            }
        </div>
    )
};

export default forwardRef(Index);
