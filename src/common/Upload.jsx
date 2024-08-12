import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Upload, App } from 'antd';
import * as req from '../class/request';
import COS from 'cos-js-sdk-v5';
import Global from '../class/global';

const httpUrl = Global.uploadUrl;
let key = '';

const Index = (props, _ref) => {
    const { message, modal } = App.useApp();
    const [action, setAction] = useState(httpUrl);  // 上传地址
    const [token, setToken] = useState('');  // 上传token
    const [type, setType] = useState(4);  // 上传方式  //1--七牛  2--阿里oss  3--腾讯  4--本地服务器
    const [fileList, setFileList] = useState(props.fileList || []);  // 上传文件
    const [configInfo, setConfig] = useState({});

    useEffect(() => {
        initToken()
    }, [])
    function initToken() {
        req.post('setting/getUploadToken', {}).then(res => {
            if (res.code == 1) {
                let action = httpUrl;
                if (res.data.visible === 1) {  // 七牛
                    action = 'https://up-z2.qiniup.com';
                } else if (res.data.visible === 2) {  //阿里oss
                    action = res.data.domain;
                } else if (res.data.visible === 3) {  //腾讯
                    action = res.data.path;
                } else if (res.data.visible == 4) {  // 本地服务器
                    action = httpUrl ;
                }
                console.log("🚀 ~ req.post ~ action:", action)

                setAction(action);
                setToken(res.data.token);
                setType(res.data.visible || 4);
                setConfig(res.data);
            }
        })
    }
    // 获取上传文件类型
    function getFileType(file) {
        var type = 7, houz = '';
        var nameList = file.name && file.name.split('.');
        houz = nameList[nameList.length - 1];
        if (file.type == 'application/vnd.ms-excel' || file.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || houz == 'xls' || houz == 'xlsx') {
            type = 3
        } else if (file.type == 'application/zip' || file.type == 'application/rar' || houz == 'rar' || houz == 'rar4') {
            type = 6;
        } else if (file.type == 'application/pdf') {
            type = 5;
        } else if (houz == 'doc' || houz == 'docx') {
            type = 4;
        } else if (file.type == 'video/mp4' || houz == 'avi' || houz == 'flv' || file.type == 'audio/mpeg' || houz == 'mp3') {
            type = 2;
        } else if (houz == 'jpg' || houz == 'jpeg' || houz == 'png' || houz == 'gif') {
            type = 1;
        }
        return type;
    }
    // 上传到腾讯os
    function txUpload(row) {
        var cos = new COS({
            getAuthorization: (options, callback) => {
                callback({
                    TmpSecretId: configInfo.TmpSecretId,
                    TmpSecretKey: configInfo.TmpSecretKey,
                    SecurityToken: configInfo.SecurityToken,
                    StartTime: configInfo.StartTime,
                    ExpiredTime: configInfo.ExpiredTime,
                });
            }
        });
        cos.putObject({
            Bucket: configInfo.Bucket,
            Region: configInfo.Region,
            Key: row.data.key,
            StorageClass: 'STANDARD',
            Body: row.file,
            onProgress: (progressData) => {
                props.onPercent && props.onPercent(progressData.percent * 100)
            }
        }, (err, data) => {
            if (err) {
                message.error('上传失败',1.5);
            } else {
                initToken();
                let filetype = getFileType(row.file)
                props.onOk({
                    domain: configInfo.path,
                    key: row.data.key,
                    name: row.data.name,
                    filetype,
                    type,
                    url: configInfo.path + '/' + row.data.key,
                })
            }
        });
    }
    return (
        <Upload
            showUploadList={false}  //是否展示文件列表
            action={action}
            fileList={fileList}
            headers={{
                token: configInfo.uptoken,  // 上传到本地服务器token
            }}
            data={(file) => {
                let houzui = '.' + file.name.split('.')[file.name.split('.').length - 1];
                key = "update/"+Date.now() + Math.floor(Math.random() * (999999 - 100000) + 100000) + '1' + houzui;
                let data = {};
                if (type === 1) {  // 七牛
                    data = {
                        token: token,
                        key:key,
                    }
                } else if (type === 2) {  // 阿里oss
                    data = {
                        name: file.name,
                        key,
                        policy: configInfo.policy,
                        OSSAccessKeyId: configInfo.OSSAccessKeyId,
                        signature: configInfo.signature,
                    }
                } else if (type === 3) {  // 腾讯
                    data = {
                        name: file.name,
                        key,
                    }
                }
                return data
            }}
            onChange={(e) => {
                setFileList(e.fileList);
                // 上传中
                if (e.file.status == 'uploading') {
                    props.onPercent && props.onPercent(e.file.percent)
                }
                // 上传完成
                if (e.file.status == 'done') {
                    let fileType = getFileType(e.file);
                    let name, domain, url;
                    if (type === 4) {  // 上传到本地

                        domain = 4;
                        name = e.file.response.data.name;
                        url = e.file.response.data.url;
                        console.log(e);
                    } else {  // 上传到cdn
                        domain = configInfo.domain;
                        name = e.file.name;
                        url = configInfo.domain + '/' + key;
                    }
                    props.onOk && props.onOk({
                        domain,
                        key,
                        name,
                        fileType,
                        type,
                        url,
                    })
                    initToken();
                }
                return true;
            }}
            customRequest={type == 3 ? txUpload : false}
            {...props}
        ></Upload>
    )
}
export default forwardRef(Index);
