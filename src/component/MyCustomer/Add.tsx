
import React, { forwardRef, useState } from 'react';
import { Button, Input, Divider, Menu, Radio, Flex } from 'antd';
import * as req from '~/class/request';
import { useAtomValue } from 'jotai';
import { userInfoAtom } from '~/store/path';
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

const Index = (_props: any, ref: any) => {
    console.log("🚀 ~ Index ~ _props:", _props)
    const userInfo = useAtomValue(userInfoAtom);
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
                        {item == 1 &&
                            <div>
                                <div className='flex items-center gap-2'>
                                    <h3>ID:{_props.data.id}</h3>

                                    <p>当前跟进人：{userInfo.name}</p>
                                    {_props.type == 'edit' && <Flex gap="small" wrap>
                                        <Button type="primary">备忘新增</Button>
                                        <Button type="primary">标记为重要客户</Button>
                                        <Button type="primary">加入合作单</Button>
                                        <Button type="primary">锁定客户</Button>
                                        <Button type="primary">上一个客户</Button>
                                        <Button type="primary">下一个客户</Button>
                                        <Button type="primary" className='!bg-red-500'>加入公共池</Button>
                                        <Button type="primary" className='!bg-gray-500'>发送邀约短信</Button>
                                    </Flex>}
                                </div>
                                <div className='flex items-center mt-3'>
                                    <div className='mr-2'>新增记录</div>
                                    <Input placeholder='请输入' className=' flex-1' />
                                    <Button type="primary" className='ml3'>确定</Button>
                                </div>
                                <div className='flex items-center mt-3'>
                                    <div className='mr-2'>顾问记录</div>
                                    <Input.TextArea placeholder='请输入' className='flex-1' autoSize={{ minRows: 3, maxRows: 6 }} />
                                </div>
                                <div className='flex items-center mt3'>
                                    <div className='mr-2'>备忘记录</div>
                                    <Input.TextArea placeholder='请输入' className='flex-1' autoSize={{ minRows: 3, maxRows: 6 }} />
                                </div>
                                <div className='flex items-center mt3'>
                                    <div className='mr-2'>主管点评</div>
                                    <Input.TextArea placeholder='请输入' className='flex-1' autoSize={{ minRows: 3, maxRows: 6 }} />
                                    <Button className='ml3'>回复</Button>
                                </div>
                            </div>}
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

