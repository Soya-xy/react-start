import React, { forwardRef } from 'react';
import { theme } from 'antd';

const Index = (props,_) => {
    const {
        token: { colorPrimary },
    } = theme.useToken();
    return (
        <div className={`${props.className ? props.className : ''} flexCenter`}>
            <p className='pline' style={{background: colorPrimary}}></p>
            <h2 className='pubTit'>{props.title}</h2>
        </div>
    )
}

export default forwardRef(Index);
