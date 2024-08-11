
import React, { forwardRef, useState } from 'react';
import { Button, Input, Divider, Menu, Radio, Flex } from 'antd';
import * as req from '~/class/request';
import Base from './Base';
import Identity from './Identity';
import { UserContent } from '~/utils/content';
import Room from './Room';
import Car from './Car';
import Policy from './Policy';
import Credit from './Credit';
import Liabilities from './Liabilities';
import Need from './Need';
import All from './All';
import Note from './Note';

const Index = (_props: any, ref: any) => {
    console.log("🚀 ~ Index ~ _props:", _props)
    const items = _props.type == 'edit' ? [
        { label: '基本信息', key: '1' },
        { label: '身份信息', key: '2' },
        { label: '房产信息', key: '3' },
        { label: '车产信息', key: '4' },
        { label: '保单信息', key: '5' },
        { label: '信用信息', key: '6' },
        { label: '负债信息', key: '7' },
        { label: '需求信息', key: '8' },
        { label: '全部信息', key: '9' },
    ] : [
        { label: '基本信息', key: '1' },
    ]
    const [selected, setSelected] = useState<{ label: string, key: string }>(items[0]);
    const [item, setItem] = useState<number>(1);
    return (
        <UserContent.Provider value={_props.data.id}>
            <div>
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
                        {/* 基础信息 */}
                        {selected.key === '1' && <Base type={_props.type} onOk={_props.onOk} />}
                        {/* 身份信息 */}
                        {selected.key === '2' && <Identity />}
                        {/* 房产信息 */}
                        {selected.key === '3' && <Room />}
                        {/* 车产信息 */}
                        {selected.key === '4' && <Car />}
                        {/* 保单信息 */}
                        {selected.key === '5' && <Policy />}
                        {/* 信用信息 */}
                        {selected.key === '6' && <Credit />}
                        {/* 负债信息 */}
                        {selected.key === '7' && <Liabilities />}
                        {/* 需求信息 */}
                        {selected.key === '8' && <Need />}
                        {selected.key === '9' && <All />}
                    </div>
                </div>
                {selected.key === '1' && <>
                    <Divider />
                    <div>
                        <Radio.Group defaultValue={item} style={{ marginBottom: 16 }} onChange={(e) => {
                            setItem(e.target.value)
                        }}>
                            <Radio.Button value={1}>客户跟踪</Radio.Button>
                            <Radio.Button value={2}>分配记录</Radio.Button>
                        </Radio.Group>
                        {item == 1 && <Note type={_props.type} data={_props.data} />}
                        {item == 2 && <div>
                            <h3>分配记录</h3>
                        </div>}
                    </div>
                </>}
            </div>
        </UserContent.Provider>
    )
};

export default forwardRef(Index);

