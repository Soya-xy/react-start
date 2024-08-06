import React, { useImperativeHandle, forwardRef, useRef, useState, useEffect } from 'react';
import { Button, Input, theme, App, Select, Switch, Image } from 'antd';
import Title from '../../common/Title';
import CustomTable from '../../common/Table';
import CustomModal from '../../common/Modal';
import CustomSelect from '../../common/Select';
import * as req from '../../class/request';
import OrderFh from './OrderFh';

const Index = (_props: any, ref: any) => {
	const {
		token: { colorPrimary, colorError },
	} = theme.useToken();
	const { message, modal } = App.useApp();
	const tableRef: any = useRef(null);
	const [open, setOpen] = useState<boolean>(false);
	const [row, setRow] = useState<{ id?: number, role_name?: string, describe?: string, ids?: [] }>({});
	const [type, setType] = useState<string>('');
	const [display, setDisplay] = useState<number>(-1);
	const [name, setWords] = useState<string>('');
	const [total, setTotal] = useState<string>("0")
	const [todaynum, setTodaynum] = useState<string>("0")
	// 列表
	const columns = [
		{
			title: 'ID',
			align: 'center',
			dataIndex: 'order_id',
			width: 80,
		}, {
			title: '商品名称',
			align: 'center',
			dataIndex: 'goods_name'
		}, {
			title: '商品数量',
			align: 'center',
			dataIndex: 'goods_num'
		}, {
			title: '订单金额',
			align: 'center',
			dataIndex: 'order_price',
			render: (order_price: string) => `￥${order_price || '-'}`
		}, {
			title: '收货人',
			align: 'center',
			dataIndex: 'name'
		}, {
			title: '手机号',
			align: 'center',
			dataIndex: 'mobile'
		}, {
			title: '收件地址',
			align: 'center',
			dataIndex: 'address'
		},{
			title: '订单备注',
			align: 'center',
			dataIndex: 'qk'
		},{
			title: '支付方式',
			align: 'center',
			dataIndex: 'pay_type',
			render: (pay_type: number) => {
				return (
					<p style={{ color: colorPrimary }}>{pay_type == 1 ? "微信支付" : "支付宝"}</p>
				);
			}
		}, {
			title: '发货状态',
			align: 'center',
			dataIndex: 'shipping_status',
			render: (shipping_status: number, item: any) => {
				if (shipping_status == 0) {
					return (
						<p style={{ color: colorError }}>待发货</p>
					);
				} else {
					return item.shipping_sn
				}

			}
		}, {
			title: '下单时间',
			align: 'center',
			dataIndex: 'atime'
		}, {
			title: '操作',
			dataIndex: 'shipping_status',
			align: 'center',
			width: 100,
			render: (shipping_status: number, item: any) => (
				<div className='flexAllCenter pubbtnbox'>
					{shipping_status == 0 ?
						<p style={{ color: colorPrimary }} onClick={() => {
							setRow(item)
							setOpen(true)
						}}>发货</p>
						:
						"-"
					}

				</div>
			)
		}
	]
	useEffect(() => {
		refresh()
	}, [display, name])
	useImperativeHandle(ref, () => ({
		refresh,
	}))
	const refresh = () => {
		tableRef.current.onRefresh()
	}
	// 获取列表数据
	const getList = (info: any, callback: any) => {
		req.post('order/orderList', {
			page: info.page,
			size: info.size,
			orderBy: '',
			mobile: name,
			shipping_status: display,
		}).then(res => {
			if (info.page == 1) {
				setTotal(res.data.count)
				setTodaynum(res.data.todaynum)
			}
			callback(res)
		})
	}
	// 首次进入页面初始化
	const onRefresh = (info: { page: number, size: number }, callback: () => void) => {
		getList(info, callback)
	}
	const onCancel = () => {
		setOpen(false);
		setRow({});
		setType('')
	}
	// 删除
	const del = (data: any) => {
		modal.confirm({
			title: '警告提示',
			content: '您要删除该项数据吗？删除后将无法恢复！',
			centered: true,
			maskClosable: true,
			onOk: () => {
				req.post('goods/delGoods', { id: data.id }).then(res => {
					if (res.code == 1) {
						refresh()
					} else {
						message.error(res.msg, 1.2);
					}
				})
			}
		})
	}
	return (
		<React.Fragment>
			<div className='h100 flexColumn'>
				<div className='flwp'>
					<div className='row25 bgbai marginr12'>
						<div className='flexCenter paddh12 borderbf6' style={{ height: 42 }}>
							<p className='rowFlex'>订单总金额</p>
						</div>
						<h1 className='paddv12 paddh12 font30'>￥{total}</h1>
					</div>
					<div className='row25 bgbai marginr12'>
						<div className='flexCenter paddh12 borderbf6' style={{ height: 42 }}>
							<p className='rowFlex'>今日订单</p>
						</div>
						<h1 className='paddv12 paddh12 font30'>{todaynum}</h1>
					</div>
				</div>
				<div className='flwp margt20'>
					<Input
						className='pubInpt borderbai marginr12'
						prefix={(<span className='iconfont icon-sousuo marginr4'></span>)}
						placeholder='请输入手机号查询'
						allowClear
						onChange={(e) => {
							setWords(e.target.value || '');
						}}
					/>

					<Select
						placeholder='请选择发货状态'
						style={{ width: 150 }}
						className='borderbai marginr12'
						allowClear
						onChange={(display: number) => {
							console.log(display)
							if (display === undefined) {
								display = -1;
							}
							setDisplay(display)
						}}
						options={[
							{
								value: 1,
								label: '已发货',
							},
							{
								value: 0,
								label: '未发货',
							}
						]}
					/>
					
				</div>
				<div className='bgbai margt20 flex_auto'>
					<Title title='商品列表' />
					<CustomTable
						ref={tableRef}
						columns={columns}
						onRefresh={onRefresh}
						scroll={{ y: window.innerHeight - 500 }}
					/>
				</div>
			</div>
			{/* 添加/编辑 */}
			<CustomModal
				open={open}
				width={360}
				onCancel={onCancel}
				title={(<Title title={"订单发货"} />)}
			>
				<OrderFh type={type} data={row} onOk={() => {
					setOpen(false);
					refresh()
				}} />
			</CustomModal>
		</React.Fragment>
	)
};

export default forwardRef(Index);