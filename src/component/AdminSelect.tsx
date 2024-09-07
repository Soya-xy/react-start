import { useMount } from "ahooks"
import { Select } from "antd"
import { forwardRef, useState } from "react"
import * as req from '~/class/request';

const AdminSelect = (_props: any, ref: any) => {

  const [options, setOptions] = useState<any[]>([])

  useMount(() => {
    req.post('admin/AdminList', {
      page: 1,
      size: 999999
    }).then(res => {
      setOptions(res.data.datas.map((item: any) => ({
        label: item.name,
        value: item.id
      })))
    })
  })

  return <>
    <div className='flex items-center mr-2'>
      <p>分配给：</p>
      <Select
        className='w-[200px]'
        options={options}
        onChange={(value) => {
          if(_props.onChange) {
            _props.onChange(value)
          }
        }}
      />
    </div>
  </>
}

export default forwardRef(AdminSelect)
