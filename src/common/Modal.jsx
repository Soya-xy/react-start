import React from 'react';
import { Modal } from 'antd'

export default class Index extends React.Component {
    render() {
        return (
            <Modal
                centered={true}
                destroyOnClose={true}
                footer={null}
                keyboard={false}
                closeIcon={(<p className='iconfont icon-guanbi'></p>)}
                {...this.props}
            ></Modal>
        )
    }
}
