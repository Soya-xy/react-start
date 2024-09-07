import { Button, Cascader, Divider, Form, Input, Select } from "antd";
import { Fragment, forwardRef, useEffect, useState } from "react";
import * as req from "~/class/request";
import Title from "~/common/Title";

const CodeGenerate = (_props: any, ref: any) => {
	const [list, setList] = useState([] as any[]);
	const [parent, setParent] = useState([] as any[]);
	// 递归生成菜单
	const genTree = (data: any) => {
		return data.map((item: any) => {
			if (item.child && item.child.length) {
				return {
					value: item.id,
					label: item.name,
					children: [
						{
							value: item.id,
							label: '本级菜单',
						},
						...genTree(item.child),
					],
				};
			} else {
				return {
					value: item.id,
					label: item.name,
				};
			}
		});
	};

	// 查找
	const findMenu = (data: any, path: string) => {
		let result: any = {}
		data.forEach((item: any) => {
			if (item.path === path) {
				result = item
			} else {
				result = findMenu(item.child, path)
			}
		})
		return result
	}

	useEffect(() => {
		req.post("menu/menuList", {
			page: 1,
			size: 9999,
			orderBy: '',
		}).then((res) => {
			if (res.code === 1) {
				const menu = res.data.datas.map((item: any) => {
					return {
						value: item.id,
						label: item.name,
						children: [
							{
								value: item.id,
								label: '本级菜单',
							},
							...genTree(item.child)
						],
					};
				});
				menu.unshift({ value: 0, label: "顶级菜单" });

				setList(menu);
			}
		});
	}, []);


	if (import.meta.hot) {
		import.meta.hot.on("generator:over", (e) => {
			if (e.success) {

				const parentID = parent[parent.length - 1];

				req.post("menu/menuList", {
					page: 1,
					size: 9999,
					orderBy: '',
				}).then((res) => {
					if (res.code === 1) {
						const item: any = findMenu(res.data.datas, e.data.filename)
						if (!item.id) {
							req.post("menu/addMenu", {
								level: parent.length,
								icon: "icon-jibenguanli",
								name: e.data.menuname,
								path: e.data.filename,
								route: `/admin/${e.data.listApi}`,
								sort: 1,
								display: 1,
								needLog: 0,
								pid: parentID,
							})
								.then((res) => {
									if (res.code === 1) {
										req.post("menu/menuList", {
											page: 1,
											size: 9999,
											orderBy: '',
										}).then((res) => {
											if (res.code === 1) {
												const item: any = findMenu(res.data.datas, e.data.filename)
												if (item) {
													const apiMenu = [
														`/admin/${e.data.curdApi.replace("%", "add")}`,
														`/admin/${e.data.curdApi.replace("%", "edit")}`,
														`/admin/${e.data.curdApi.replace("%", "del")}`,
													];

													apiMenu.forEach((menu) => {
														req
															.post("menu/addMenu", {
																level: parent.length,
																icon: "icon-jibenguanli",
																name: e.data.menuname,
																path: "",
																route: menu,
																sort: 1,
																display: 0,
																needLog: 1,
																pid: item.id,
															})
															.then((res) => { });
													});

												}
											}
										})
									}
								});
						}
					}
				})


			}
		});
	}

	async function onFinish(values: any) {
		if (import.meta.hot) {
			await import.meta.hot.send("generator:react", {
				...values,
				parent: parent[parent.length - 1],
			});
		}
	}

	return (
		<Fragment>
			<div className="h100 flexColumn">
				<div className="bgbai margt20 flex_auto">
					<Title title="代码生成" />
					<div className="mx-10 overflow-y-scroll h-[80vh]">
						<Form
							onFinish={onFinish}
							name="dynamic_form_complex"
							style={{ maxWidth: 600 }}
							autoComplete="off"
						>
							<Form.Item
								name="menuname"
								label="菜单名称"
								rules={[{ required: true }]}
							>
								<Input placeholder="菜单名称" />
							</Form.Item>
							<Form.Item
								name="filename"
								label="文件名称"
								rules={[{ required: true }]}
							>
								<Input placeholder="文件名称" />
							</Form.Item>
							<Form.Item
								name="pid"
								label="父级菜单"
								rules={[{ required: true }]}
							>
								<Cascader
									options={list}
									onChange={(e) => {
										setParent(e);
									}}
									placeholder="请选择父级菜单"
								/>
							</Form.Item>

							<Form.Item
								name="listApi"
								label="列表接口地址（eg: config/%Config ）"
								rules={[{ required: true }]}
							>
								<Input placeholder="接口地址" />
							</Form.Item>
							<Form.Item
								name="curdApi"
								label="CURD接口地址"
								rules={[{ required: true }]}
							>
								<Input placeholder="接口地址" />
							</Form.Item>
							<Title title="字段配置" />
							<Form.List name="field">
								{(fields, { add, remove }) => (
									<>
										{fields.map(({ key, name, ...restField }: any) => (
											<div
												key={key}
												className="flex w-full justify-between items-center gap-3"
											>
												<div className="flex-col flex-1">
													<Form.Item
														{...restField}
														name={[key, "name"]}
														label="字段名称"
													>
														<Input placeholder="字段名称" />
													</Form.Item>
													<Form.Item
														{...restField}
														name={[key, "value"]}
														label="字段值"
													>
														<Input placeholder="字段值" />
													</Form.Item>
													<Form.Item
														{...restField}
														name={[key, "search"]}
														label="是否搜索"
													>
														<Select
															defaultValue={0}
															options={[
																{ value: 1, label: "是" },
																{ value: 0, label: "否" },
															]}
														/>
													</Form.Item>
													<Form.Item
														{...restField}
														name={[key, "type"]}
														label="文件名称"
													>
														<Select
															defaultValue="text"
															options={[
																{ value: "text", label: "文字" },
																{ value: "number", label: "数字" },
																{ value: "datetime", label: "日期时间" },
																{ value: "switch", label: "开关" },
																{ value: "image", label: "图片" },
															]}
														/>
													</Form.Item>
													<Divider />
												</div>
												{fields.length > 1 ? (
													<div
														className="iconfont i-carbon:task-remove"
														onClick={() => remove(name)}
													/>
												) : null}
											</div>
										))}
										<Form.Item>
											<Button type="dashed" onClick={() => add()} block>
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
		</Fragment>
	);
};

export default forwardRef(CodeGenerate);
