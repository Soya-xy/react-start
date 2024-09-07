import React, { useState, useEffect, forwardRef } from 'react';
import { DatePicker, Spin, Table, Empty } from 'antd';
import { Chart } from '@antv/g2';
import dayjs from 'dayjs';
import * as req from '~/class/request';
import { useMount } from 'ahooks';

const Index = () => {
    const [date, setDate] = useState(dayjs());
    const [chartData, setChartData] = useState<any>([]);
    const [tableData, setTableData] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [year, setYear] = useState(dayjs().format('YYYY'));

    useEffect(() => {
        // 在这里获取数据并更新chartData和tableData
        fetchData(date);
    }, [date]);

    const fetchData = (selectedDate: any) => {
        // 模拟数据获取
        req.post('AdminInfo/Data', {
            year: dayjs(selectedDate).format('YYYY'),
            month: dayjs(selectedDate).format('MM'),
        }).then(res => {
            if (res.data?.length > 0) {
                setChartData(res.data.map((item: any) => ({
                    date: item[0],
                    value: item[1],
                })));
            } else {
                setChartData([])
            }
        })

    };

    useEffect(() => {
        const chart = new Chart({
            container: 'chart-container',
            autoFit: true,
            height: 400,
        });


        chart
            .data(chartData)
            .encode('x', 'date')
            .encode('y', 'value')

            .scale('y', {
                domainMin: 0,
                nice: true,
            })
            .axis('x', {
                title: '日期',
                labelFill: '#000',
                labelFontSize: 14,
                // labelFontWeight: 'bold',
                labelFillOpacity: 1,
                labelOpacity: 1,
                titlePosition: 'br',
                titleTransform: 'translate(-70, 0)',
                titleFontWeight: 'bold',
                titleFontSize: 16
            })
            .axis('y', {
                title: false,
            })

        chart.line()
        chart.title({ title: '数量' });

        chart.point().style('fill', 'white').tooltip(false);

        chart.render();

        return () => chart.destroy();
    }, [chartData]);

    const columns = [
        { title: '月份', dataIndex: 'date', key: 'date' },
        { title: '进件笔数', dataIndex: 'count', key: 'count' },
        { title: '进件金额', dataIndex: 'money', key: 'money' },
    ];

    useMount(() => {

        req.post('AdminInfo/Outstanding', {}).then(res => {
            if (res.code === 1) {
                setTableData(res.data)
            }
        })

        // const newTableData = [
        //     { key: 1, month: '总计', count: 1223, amount: 23 },
        //     { key: 2, month: '2024-06', count: 133, amount: 33 },
        //     { key: 3, month: '2024-05', count: 113, amount: 3 },
        // ];

    })

    // eslint-disable-next-line arrow-body-style
    const disabledDate: any = (current: any) => {
        return current && current >= dayjs().startOf('month').add(1, 'month');
    };


    return (
        <div>
            <div className='flex justify-end'>
                <DatePicker.MonthPicker
                    value={date}
                    onChange={(newDate) => {
                        console.log("🚀 ~ newDate:", newDate)
                        setDate(newDate)
                    }}
                    disabledDate={disabledDate}
                />
            </div>
            <Spin spinning={loading}>
                <div className='flex items-center flex-col'>
                    <h1 className='text-center my2'>进件数量走势图</h1>
                    {/* 判断为空 */}
                    <div id="chart-container" style={{
                        width: '100%', height:
                            chartData.length > 0 ? 400 : 0
                    }} />
                    {chartData.length <= 0 && <Empty className='my-10' />}
                </div>
            </Spin>
            <Table columns={columns} dataSource={tableData} />
        </div>
    );
};

export default forwardRef(Index);
