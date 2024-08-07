import React, { useImperativeHandle, forwardRef, useRef, useState, useEffect } from 'react';
import { Button, Input, theme, App, Select, Switch, Image } from 'antd';
import Title from '../../common/Title';
import CustomTable from '../../common/Table';
import CustomModal from '../../common/Modal';
import CustomSelect from '../../common/Select';
import * as req from '../../class/request';

const Goods = (_props: any, ref: any) => {
	const {
		token: { colorPrimary },
	} = theme.useToken();
	const { message, modal } = App.useApp();
	const tableRef: any = useRef(null);
	const [open, setOpen] = useState<boolean>(false);
	const [row, setRow] = useState<{ id?: number, role_name?: string, describe?: string, ids?: [] }>({});
	const [type, setType] = useState<string>('');
	const [display, setDisplay] = useState<number>(-1);
	const [name, setWords] = useState<string>('');
	// 列表
	const columns = [
		{
			title: 'ID',
			align: 'center',
			dataIndex: 'id',
			width: 80,
		}, {
			title: '商品名称',
			align: 'center',
			dataIndex: 'goods_name'
		}, {
			title: '商品图',
			align: 'center',
			dataIndex: 'img',
			render: (img: any) => {
				return <Image width={30} src={img} />
			}
		}, {
			title: '售价',
			align: 'center',
			dataIndex: 'goods_price',
			render: (goods_price: string) => `￥${goods_price || '-'}`
		}, {
			title: '销量',
			align: 'center',
			dataIndex: 'sale_num',
			render: (ip: string) => `${ip || '-'}`
		}, {
			title: '状态',
			align: 'center',
			dataIndex: 'display',
			render: (display: string) => {
				return (
					<Switch checkedChildren="上架" unCheckedChildren="下架" defaultChecked={display == "1"} disabled />
				);
			}
		}, {
			title: '添加时间',
			align: 'center',
			dataIndex: 'atime'
		}, {
			title: '操作',
			dataIndex: 'id',
			align: 'center',
			render: (id: number, item: any) => (
				<div className='flexAllCenter pubbtnbox'>
					<p style={{ color: colorPrimary }} onClick={() => {
						setRow(item)
						setType('edit');
						setOpen(true)
					}}>编辑</p>
					<p style={{ color: colorPrimary }} onClick={() => del(item)}>删除</p>
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
		req.post('goods/goodsList', {
			page: info.page,
			size: info.size,
			orderBy: '',
			name,
			display,
		}).then(res => {
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
					<Input
						className='pubInpt borderbai marginr12'
						prefix={(<span className='iconfont icon-sousuo marginr4'></span>)}
						placeholder='请输入商品名称'
						allowClear
						onChange={(e) => {
							setWords(e.target.value || '');
						}}
					/>

					<Select
						placeholder='请选择上架状态'
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
								label: '上架',
							},
							{
								value: 0,
								label: '下架',
							}
						]}
					/>
					<Button type="primary" onClick={() => {
						setOpen(true);
					}}>添加商品</Button>
				</div>
				<div className='bgbai margt20 flex_auto'>
					<Title title='商品列表' />
					<CustomTable
						ref={tableRef}
						columns={columns}
						onRefresh={onRefresh}
						scroll={{ y: window.innerHeight - 368 }}
					/>
				</div>
			</div>

		</React.Fragment>
	)
};

export default forwardRef(Goods);
