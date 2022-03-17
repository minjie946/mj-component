/**
 * @description 表格的展示的
 * @author minjie
 * @Date 2021-10-13 15:07
 * @LastEditTime 2022-03-17 16:41
 * @LastEditors minjie
 * @copyright Copyright © 2021 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import React from 'react';
import './index.less';
export declare type SpanTextType = 'warning' | 'info' | 'success' | 'error' | 'gay' | 'default';
export interface SpanTextConfigProps {
    /** 功能的权限原子 */
    power: string[];
    /** 数据的权限原子 */
    powerData: string[];
    /** 开发环境是否默认通过验证: 默认 true */
    passDev?: boolean;
}
export interface BaseAuthenticatedProps {
    /** 权限code */
    code: string | Array<string>;
    /**  验证的类型 'contain' (包含的关系)| 'must' (必须都有) 默认： contain */
    type?: 'contain' | 'must';
    /** 权限的集合 */
    auth?: string[];
    /** 开发环境是否默认通过验证: 默认 true */
    passDev?: boolean;
}
export interface SpanTextProps<T = any> extends React.HTMLAttributes<T> {
    /** 只是在antd form 表格中使用 */
    value?: any;
    /** 只是在antd form表格中使用 */
    onChange?: () => void;
    /** 是否禁用 */
    disabled?: boolean;
    /** 功能权限的code */
    powerCode?: string | string[];
    /** 数据权限的code */
    powerCodeData?: string | string[];
    /** 对应的类型: 或者颜色 */
    type?: SpanTextType | string;
    /** 进行路由跳转的 */
    to?: any;
    /** 路由跳转是否进行替换 */
    replace?: boolean;
    /** 是否需要鼠标变成手指的样式 */
    cursor?: 'pointer' | 'not-allowed';
    /** 没有值的替代 */
    notValueText?: string;
    /** 显示为背景颜色 */
    isbackground?: boolean;
}
/**
 * 权限的判断
 * @param code  权限code
 * @param type  验证的类型 'contain' (包含的关系)| 'must' (必须都有) 默认： contain
 * @param auth  权限的集合
 * @returns true | false
 */
export declare const baseAuthenticated: ({ code, type, auth, passDev }: BaseAuthenticatedProps) => boolean;
export declare const setSpanConfig: (config: SpanTextConfigProps) => void;
declare const SpanText: any;
export default SpanText;
