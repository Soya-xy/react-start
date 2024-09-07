import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Card, Row, Col, Table, Button, Empty, DatePicker } from 'antd';
import { Chart } from '@antv/g2';
import CustomTable from '~/common/Table';
import * as req from '~/class/request';
import dayjs from 'dayjs';


// 渲染任务统计卡片
const renderTaskStats = () => {
    // 任务统计数据
    const [taskStats, setTaskStats] = useState<any[]>([])

    useEffect(() => {
        req.post('home/taskReport', {
            "status": 0,
            "type": 0
        }).then(res => {
            if (res.code === 1) {
                setTaskStats([
                    { title: '待提交任务', count: res.data.waitSubmit },
                    { title: '待审核任务', count: res.data.waitProcess },
                    { title: '审核退回任务', count: res.data.outProcess },
                    { title: '审核通过任务', count: res.data.adoptProcess },
                ])
            }
        })
    }, [])

    return (
        <Row gutter={16}>
            {taskStats.map((stat, key) => (
                <Col span={6} key={key}>
                    <Card className="!flex !items-center" styles={{
                        body: {
                            width: '100%',
                        }
                    }}>
                        <h3 className='text-center text-xl'>{stat.title}</h3>
                        <p className='text-center text-3xl mt2'>{stat.count}条</p>
                    </Card>
                </Col>
            ))}
        </Row>
    )
};


// 渲染公告通知
const renderNotifications = () => {
    const [notifications, setNotifications] = useState<any[]>([])

    useEffect(() => {
        req.post('home/noticeList', {
            page: 1,
            size: 10,
        }).then(res => {
            setNotifications(res.data.datas)
        })
    }, [])

    return (
        <Card title="公告通知" className="overflow-scroll">
            {notifications.length ? notifications.map((notice, index) => (
                <Card.Grid key={index} style={{ width: '100%' }}>
                    <div className='flex justify-between items-center'>
                        <div>
                            <h4>{notice.title}</h4>
                            <p>{notice.content}</p>
                        </div>
                        <div className='flex justify-end'>
                            <Button type='link'>查看更多</Button>
                        </div>
                    </div>
                </Card.Grid>
            )) : <Empty description="暂无公告通知" />}
        </Card>
    )
}

const Index = (_props: any, ref: any) => {
    const tableRef: any = useRef(null);

    useImperativeHandle(ref, () => ({
        refresh,
    }))
    const refresh = () => {
        tableRef.current.onRefresh()
    }
    // 获取列表数据
    const getList = (info: any, callback: any) => {
        req.post('home/phoneList', {
            page: info.page,
            size: info.size,
            orderBy: 'desc',
        }).then(res => {
            callback(res)
        })
    }
    // 首次进入页面初始化
    const onRefresh = (info: { page: number, size: number }, callback: () => void) => {
        getList(info, callback)
    }
    const [year, setYear] = useState<string>(dayjs().format('YYYY'))

    const onChange = (date: any, dateString: string) => {
        setYear(dateString)
    }

    useEffect(() => {

        const chart = new Chart({
            container: 'task-trend',
            autoFit: true,
            height: 200,
        });

        req.post('home/taskImg', {
            year,
        }).then(res => {
            const data = res.data.time.map((item: any, key: number) => ({
                time: item,
                data: res.data.data[key]
            }))

            chart.interval()
                .data(data)
                .encode('x', 'time')
                .encode('y', 'data');

            chart.render();
        })

        return () => {
            chart.destroy();
        };
    }, [year]);

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: '姓名', dataIndex: 'name', key: 'name' },
        { title: '职务名称', dataIndex: 'position', key: 'position' },
        { title: '性别', dataIndex: 'gender', key: 'gender' },
        { title: '手机号', dataIndex: 'phone', key: 'phone' },
        { title: '虚拟号', dataIndex: 'virtualNumber', key: 'virtualNumber' },
    ]

    // 渲染通讯录
    const renderContacts = () => (
        <CustomTable
            ref={tableRef}
            columns={columns}
            onRefresh={onRefresh}
            scroll={{ y: window.innerHeight - 368 }}
        />
    );

    return (
        <div className='h-full overflow-hidden'>
            {renderTaskStats()}
            <Row gutter={16} className="h-full overflow-hidden mt2">
                <Col span={6} className="h-full overflow-scroll">
                    {renderNotifications()}
                </Col>
                <Col span={18}>
                    <Card title={<div className='flex justify-between items-center'>
                        <span>任务趋势图</span>
                        <DatePicker.YearPicker 
                            onChange={(newDate) => {
                                setYear(dayjs(newDate).format('YYYY'))
                            }}
                        />
                    </div>}>

                        <div id="task-trend" style={{ height: 200 }}></div>
                    </Card>
                    <Card title="通讯录" className="!mt-2" styles={{
                        body: {
                            padding: 0,
                        }
                    }}>
                        {renderContacts()}
                    </Card>
                </Col>
            </Row>

        </div>
    );
};

export default forwardRef(Index);
