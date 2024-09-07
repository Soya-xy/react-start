import React from 'react';
import { Table, message } from 'antd'
import Helper from '../class/Helper';

export default class Index extends React.Component {

    static defaultProps = {
        auto: true,  // 是否加载组件就发起请求
    }

    constructor(props) {
        super(props)
        this.state = {
            data: props.data || [],
            total: props.total || 0,
            page: props.page || 1,
            size: props.pageSize || 10,
            dataIndex: props.dataIndex || 'data',
            loading: false,
            orderBy: ""
        }
    }
    componentDidMount() {
        if (this.props.auto) {
            this.getList()
        }
    }
    //重载当前页数据
    getList() {
        this.setState({
            loading: true
        }, () => {
            this.props.onRefresh({
                page: this.state.page,
                size: this.state.size,
                orderBy: this.state.orderBy
            }, (res) => {
                if (res?.code == 1) {
                    if (this.state.dataIndex) {
                        const data = this.state.dataIndex.split('.').reduce((prev, curr) => {
                            return prev[curr]
                        }, res)
                        this.setState({
                            total: data?.all || res.data.all,
                            data: this.initData(data.datas || data, data.all) || [],
                            loading: false,
                        })
                    }

                } else {
                    message.error(res?.msg || '数据异常')
                    this.setState({
                        requestLoadingShow: false,
                    })
                }
            })
        })
    }
    initData(arry, total) {
        if (arry.length == 0) {
            return []
        }

        let arryNew = []
        arry.map((item, index) => {
            let key = Helper.getNum(index, total, this.state.size, this.state.page, this.state.orderBy)
            arryNew.push(Object.assign({}, item, { key: key }))
        })
        return arryNew
    }
    // 刷新 从第一页开始
    onRefresh(page = this.state.page) {
        this.setState({
            page
        }, () => {
            this.getList()
        })
    }
    render() {
        return (
            <Table
                className={`pubList margl24 margr24 ${this.props.customClass ? this.props.customClass : ''} `}
                loading={this.state.loading}
                pagination={{
                    position: ["bottomLeft"],
                    pageSize: this.state.size,
                    current: this.state.page,
                    total: this.state.total,
                    hideOnSinglePage: true,
                    showSizeChanger: false,
                    showTotal: (total, range) => {
                        var num = range[0],
                            num1 = range[1]
                        num = num < 10 ? ('0' + num) : num;
                        num1 = num1 < 10 ? ('0' + num1) : num1;
                        return `共${total}条记录，本页展示${num}-${num1}条记录`
                    }
                }}
                dataSource={this.state.data}
                onChange={(page, filters, sorter) => {
                    var orderBy = "";
                    if (sorter.order) {
                        if (sorter.order == "ascend") {
                            orderBy = "asc";
                        } else if (sorter.order == "descend") {
                            orderBy = "desc";
                        }
                    }

                    this.setState({
                        page: page.current || 1,
                        orderBy
                    }, () => {
                        this.getList();
                    })
                }}
                {...this.props}
            />
        );
    }
}
