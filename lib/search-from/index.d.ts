/**
 * @description 搜索的组件
 * @author minjie
 * @Date 2021-01-29 15:08
 * @LastEditTime 2022-03-14 17:26
 * @LastEditors minjie
 * @copyright Copyright © 2021 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import React from 'react';
import { FormProps, FormInstance } from 'antd';
import { ItemProps, FinishType, FieldDataFromatProps } from './index.inter';
import './index.less';
/** 表单项 */
export declare const Item: ({ label, labelminwidth, children, ...props }: ItemProps) => JSX.Element;
/**
 * 当保存的时候获取值
 * @param key 保存的session的key
 * @param obj 额外的值 可以不传默认 {}
 * @param fristValue 默认的初始值重置的时候使用
 */
export declare const getSearchSaveParam: (key: string, obj?: any, fristValue?: any) => any;
export interface SearchFromProps extends FormProps {
    /** 是否收起：默认是收起的(false) */
    collapsed?: boolean;
    /** 是否去除label: 默认false 不去除 */
    nolabel?: boolean;
    /** 每行显示多少个: 默认4个 */
    collapsedlen?: number;
    /** 隐藏重置按钮 */
    hiddenReset?: boolean;
    /** 字段的格式化 */
    fielddatafromat?: FieldDataFromatProps[];
    /** 搜索按钮的文案：默认查询 */
    searchText?: string;
    /** 重置按钮的文案：默认重置 */
    resetText?: string;
    /** 保存搜索的值: 传递唯一sessionkey */
    savesearchparam?: string;
    /** 请直接使用: ref */
    forwardRef?: React.RefObject<FormInstance>;
    /**
     * 当前的父容器的： 用来计算宽度的
     * * 默认 document.documentElement.clientWidth - 200： - 200 减去的是侧边栏的宽度
     */
    containerDom?: HTMLElement;
    /**
    * 查询按钮和重置按钮的时候触发
    * @param {*}          value 表单值
    * @param {FinishType} type  提交的类型（'submit'|'reset'）
    */
    onFinishData?: (value: any, type?: FinishType) => void;
    /**
    * 表单值改变的时候
    */
    onValuesChange?: (changeValue: any, allvalue: any) => void;
}
/**
 * antd 表单进行的二次的封装， 使用的方式和From类似
 * ```tsx
 * <SearchFrom
 *  initialValues={searchParam}
 *  onFinishData={this.onFinish}
 * >
 *   <Item label="账户姓名" name='userName'>
 *   <Input allowClear placeholder='请输入' autoComplete='off'/>
 * </Item>
 * ```
 */
declare const SearchFrom: any;
export default SearchFrom;
