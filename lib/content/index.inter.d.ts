/**
 * @description 接口声名
 * @author minjie
 * @Date 2021-10-12 13:29
 * @LastEditTime 2022-03-14 16:00
 * @LastEditors minjie
 * @copyright Copyright © 2021 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import React from 'react';
/** 标题 */
export interface HeaderItemProps extends React.HTMLAttributes<HTMLDivElement> {
    /** 是否存在下划线 */
    isline?: boolean;
    /** 是否进行margin: 默认 20px 0 !important */
    margin?: string;
}
/** ContentProps */
export interface ContentProps extends React.HTMLAttributes<HTMLDivElement> {
    /** 需要减去的高度: 默认减去24 */
    reduceHeight?: number;
    /** 最小高度 */
    minHeight?: number | string;
    /** 最大高度 */
    maxHeight?: number | string;
    /** 背景颜色: 默认白色（#fff） */
    backgroundColor?: string;
    /** 是否是可以滚动的 */
    isscroll?: boolean;
    /** 是否存在底部， 存在的话，边距变更 */
    isfooter?: boolean;
    /** 内边距：默认16px */
    padding?: string;
    /** 当前的高度 */
    onHeight?: (height: number) => void;
}
export interface FooterProps extends React.HTMLAttributes<HTMLDivElement> {
    /** 减去的横向的宽度： 默认200px */
    reduceWidth?: string | number;
    /** 需要减去的宽度的dom的id */
    reduceDom?: string;
}
