import { useMount } from "ahooks";
import { App, Button, Descriptions, Flex, Form, Input, Popconfirm, Tag } from "antd"
import { useAtom, useAtomValue } from "jotai";
import { forwardRef, useContext, useState } from "react"
import { userInfoAtom } from "~/store/path";
import * as req from '~/class/request';
import CustomModal from '~/common/Modal';
import Title from "~/common/Title";
import { SearchContent } from "~/utils/content";
import { userAtom } from "~/store/atom";
import Add from "../Memo/Add";

const Index = (_props: any, _ref: any) => {
  const { message } = App.useApp()
  const [info, setInfo] = useState<any>([])

  function refresh() {
    req.post('MyCustomer/distribution', { id: _props.data.id }).then((res: any) => {
      setInfo(res.data)
    })
  }



  useMount(() => {
    refresh()
  })

  return (
    <div>
      <Descriptions
        className='!mt-3'
        bordered
        layout="vertical"
        column={24}
        items={[
          {
            key: '1',
            span: 24,
            label: '分配记录',
            children:
              <Input.TextArea defaultValue={info?.join('\n')} key={info?.length} disabled className='flex-1 !text-black' autoSize={{ minRows: 2, maxRows: 4 }} />
            ,
          },
        ]}
      />
    </div>
  )
}
export default forwardRef(Index)
