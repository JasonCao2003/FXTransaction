import React, { useState, useEffect } from "react";
import {getRecommendList} from '@/api'
import { Card, Avatar, Row, Col, Typography, Modal, Form, Input, message } from "antd";
import MyIcon from "@/components/icon";
import "./index.less";
import * as echarts from 'echarts'

const list = [
    {
        recommendition_id: '1010101',
        recommendition_name: '组合A',
        recommendition_items:
        {
            'JiJin': [
                { product_name: '基金A', amount: 0.03 },
                { product_name: '基金B', amount: 0.12 },
                { product_name: '基金C', amount: 0.41 }
            ],
            'GuPiao': [
                { product_name: '股票A', amount: 0.16 },
                { product_name: '股票B', amount: 0.5 },
                { product_name: '股票C', amount: 0.32 }
            ],
            'LiCai': [
                { product_name: '理财A', amount: 0.12 },
                { product_name: '理财B', amount: 0.2 },
                { product_name: '理财C', amount: 0.32 }
            ]
        },
        ShouYiLv: 0.69,
        FengXianLv: 0.23
    },
    {
        recommendition_id: '010101',
        recommendition_name: '组合B',
        recommendition_items:
        {
            'JiJin': [
                { product_name: '基金A', amount: 0.03 },
                { product_name: '基金B', amount: 0.06 },
                { product_name: '基金C', amount: 0.01 }
            ],
            'GuPiao': [
                { product_name: '股票A', amount: 0.06 },
                { product_name: '股票B', amount: 0.12 },
                { product_name: '股票C', amount: 0.02 }
            ],
            'LiCai': [
                { product_name: '理财A', amount: 0.06 },
                { product_name: '理财B', amount: 0.12 },
                { product_name: '理财C', amount: 0.02 }
            ]
        },
        ShouYiLv: 0.85,
        FengXianLv: 0.52
    },
];
function useCardPage() {
    getRecommendList(JSON.parse(localStorage.getItem('USER_INFO')).clintId).then(res => {
        console.log(res)
    })
    const [dataList, setList] = useState(list);
    console.log(list)
    const [showModal, setShow] = useState(false);
    const [form] = Form.useForm();

    const show = () => {
        setShow(true);
    };
    const hide = () => {
        setShow(false);
    };
    const addList = () => {
        form.validateFields().then((values) => {
            setList([...dataList, values]);
            form.resetFields();
            hide();
        });
    };
    return { show, dataList, showModal, hide, addList, form };
}

// 定义不同类型资产的颜色
const assetColors = {
    'JiJin': '#FF6A6A',
    'GuPiao': '#87CEFF',
    'LiCai': '#32CD32'
};

function echartsShow(dataList) {
    const contentList = [];
    dataList.forEach((item) => {
        contentList.push({
            'tab1':
                <div>
                    <div className="echartsPie" id={item.recommendition_id}></div>
                    <div className="percentShow">
                        <p>收益率：{item.ShouYiLv} {getReturnRateIcon(item.ShouYiLv)}</p>
                        <p>风险率：{item.FengXianLv} {getRiskRateIcon(item.FengXianLv)}</p>
                    </div>
                </div>
        });
    });

    setTimeout(() => {
        dataList.forEach((item, index) => {
            const dataArr = [];
            Object.entries(item.recommendition_items).forEach(([assetType, category]) => {
                category.forEach((subItem) => {
                    dataArr.push({
                        value: subItem.amount,
                        name: subItem.product_name,
                        itemStyle: {
                            color: assetColors[assetType]
                        }
                    });
                });
            });
            if (document.getElementById(item.recommendition_id)) {
                const myPie = echarts.init(document.getElementById(item.recommendition_id));
                myPie.setOption({
                    series: [
                        {
                            type: 'pie',
                            data: dataArr
                        }
                    ]
                });
            }
        });
    }, 500);

    return contentList;
}

function getReturnRateIcon(rate) {
    if (rate > 0.7) {
        return <span className="high-return" style={{ backgroundColor: 'green', color: 'white', padding: '2px 4px', borderRadius: '2px' }}>高收益</span>;
    }
    return null;
}

function getRiskRateIcon(rate) {
    if (rate > 0.7) {
        return <span className="high-risk" style={{ backgroundColor:'red', color: 'white', padding: '2px 4px', borderRadius: '2px' }}>高风险</span>;
    }
    return null;
}

export default function CardPage() {
    const { show, showModal, addList, dataList, hide, form } = useCardPage();
    const [activeTabKey1, setActiveTabKey1] = useState('tab1');
    const [contentList, setContentList] = useState([]);

    useEffect(() => {
        const newContentList = echartsShow(dataList);
        setContentList(newContentList);
    }, [dataList]);

    const onTab1Change = key => {
        setActiveTabKey1(key);
    };

    const handleBuyConfirm = (item) => {
        Modal.confirm({
            title: '确认购买',
            content: `是否确认购买 ${item.recommendition_name}？`,
            onOk() {
                message.success('购买成功');
            },
            onCancel() {
                message.info('已取消购买');
            },
        });
    };

    return (
        <div className="card-container">
            <Row gutter={[16, 16]}>
                {dataList.map((item, index) => (
                    <Col span={6} key={item.recommendition_id}>
                        <Card
                            hoverable
                            actions={[
                                <MyIcon type="icon_cancel" className="icon" />,
                                <MyIcon type="icon_selection" className="icon" onClick={() => handleBuyConfirm(item)} />,
                            ]}
                            title={item.recommendition_name}
                            style={{ width: '100%' }}
                            tabList={
                                [
                                    {
                                        key: 'tab1',
                                        tab: '详情',
                                    }
                                ]
                            }
                            activeTabKey={activeTabKey1}
                            onTabChange={onTab1Change}
                        >
                            {contentList[index] && contentList[index][activeTabKey1]}
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
}
CardPage.route = { path: "/card" }
