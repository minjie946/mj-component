/**
 * @description 搜索组件的接口值等定义
 * @author minjie
 * @Date 2021-06-04 14:06
 * @LastEditTime 2021-10-15 12:03
 * @LastEditors minjie
 * @copyright Copyright © 2021 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import { FormItemProps } from 'antd';
export interface ItemProps extends FormItemProps {
    /** 标题的最小的宽度 */
    labelminwidth?: number;
}
/** 表单的样式的 */
export declare const inlineformlabelCol: {
    labelCol: {
        span: number;
        sm: number;
        lg: number;
        xl: number;
        xxl: number;
    };
    wrapperCol: {
        span: number;
        sm: number;
        lg: number;
        xl: number;
        xxl: number;
    };
};
export declare const horizontalformlabelCol: {
    labelCol: {
        span: number;
        sm: number;
        lg: number;
        xl: number;
        xxl: number;
    };
    wrapperCol: {
        span: number;
        sm: number;
        lg: number;
        xl: number;
        xxl: number;
    };
};
/** 表单的样式的 */
export declare const formnolabelCol: {
    wrapperCol: {
        span: number;
        sm: number;
        lg: number;
        xl: number;
        xxl: number;
    };
};
export declare type FinishType = 'submit' | 'reset';
export interface FieldDataFromatProps {
    /** 字段名称 */
    name: string;
    /** 类型 */
    type?: 'time' | 'string' | 'number';
}
