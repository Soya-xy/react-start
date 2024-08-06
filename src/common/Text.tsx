import React, { useImperativeHandle, forwardRef } from 'react';
import { Button, theme } from 'antd';


const Index = (_props: any, ref: any) => {
    const {
        token: { colorPrimary, colorSuccess, colorWarning, colorError }
    } = theme.useToken();
    const type = _props.type || 'primary';
    const center = _props.center || false;
    return (
        <p
            style={{
                color: type === 'primary' ? colorPrimary : (
                    type === 'success' ? colorSuccess : (
                        type === 'warning' ? colorWarning : (
                            type === 'error' ? colorError : '#333'
                        )
                    )
                ),
                textAlign: center ? 'center' : '',
            }}
            // className={_props.className || ''}
            {..._props}
        >{_props.children}</p>
    )
};

export default forwardRef(Index);