
import React, { useImperativeHandle, forwardRef, useRef, useState, useEffect } from 'react';
import { Button, theme, App, Input, Image, Tag, DatePicker, Select, Tree } from 'antd';
import {
  DownOutlined,
  FrownFilled,
  FrownOutlined,
  MehOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import * as req from '~/class/request';
import Add from './Add';
import List from './List';
import { useMount } from 'ahooks';
import { useSetAtom } from 'jotai';
import { orgTreeAtom } from '~/store/atom';
import { deepClone, getTreeData } from '~/utils';
const Index = (_props: any, ref: any) => {
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const { message, modal } = App.useApp();
  const tableRef: any = useRef(null);
  const [open, setOpen] = useState<boolean>(false);
  const [row, setRow] = useState<any>({});
  const [type, setType] = useState<string>('');
  const [name, setName] = useState<any>();
  const [treeData, setTreeData] = useState<any>([])
  const [height, setHeight] = useState<number>(0)
  const setOrg = useSetAtom(orgTreeAtom)

  useMount(() => {

    getList({ page: 1, size: 1000 }, (res: any) => {
      console.log(res)
    })
    // 获取.mainContent的高度
    setHeight(document.querySelector('.mainContent')?.clientHeight || 0)
    console.log("🚀 ~ useMount ~ height:", height)
  })

  function getTree(data: any) {
    if (data?.length > 0) {
      return data.map((item: any) => {
        return {
          ...item,
          title: item.name,
          key: item.id,
          icon: item.child?.length > 0 ? <p className='iconfont i-mdi:account-multiple'></p> : <p className='iconfont i-carbon:document-blank'></p>,
          children: getTree(item.child)
        }
      })
    }
  }

  // 获取列表数据
  const getList = (info: any, callback: any) => {
    req.post('Department/DepartmentList', {
      page: info.page,
      size: info.size,
      orderBy: 'desc',
      name,
    }).then(res => {
      const data = deepClone(res.data)
      delete data.child
      const tree = [{
        ...data,
        title: res.data.name,
        key: res.data.id,
        icon: res.data.child?.length > 0 ? <p className='iconfont i-mdi:account-multiple'></p> : <p className='iconfont i-carbon:document-blank'></p>,
        children: getTree(res.data.child)
      }]
      setTreeData(tree)
      callback(tree)
    })
  }

  function onSelect(_selectedKeys: any, e: any) {
    setOrg(e.node)
  }


  function refresh(node: any) {
    getList({ page: 1, size: 1000 }, (res: any) => {
      const org = getTreeData(res, node.id)
      setOrg(org)
    })
  }
  return (
    <React.Fragment>
      <div>
        <div className="flex">
          <div className='min-w-[300px] w-full mr-2' style={{ minHeight: height - 100 }}>
            <Tree
              showIcon
              checkable={false}
              defaultExpandAll
              onSelect={onSelect}
              className='!py-2 !pl-2 h-full w-full '
              defaultSelectedKeys={['0-0-0']}
              switcherIcon={<DownOutlined />}
              treeData={treeData}
            />
          </div>
          <List getList={refresh} />
        </div>
      </div>
    </React.Fragment>
  )
};

export default forwardRef(Index);
