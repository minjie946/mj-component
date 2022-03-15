/**
 * @description 可以改变高度的容器
 * @author minjie
 * @Date 2021-09-30 15:32
 * @LastEditTime 2022-03-10 17:26
 * @LastEditors minjie
 * @copyright Copyright © 2021 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import React, { useEffect, useState, useRef } from 'react'
import classNames from 'classnames'
import { ContentProps, FooterProps, HeaderItemProps } from './index.inter'
import './index.less'

/**
 * 自定义事件
 * @param type  事件类型
 * @param name  事件名
 * @param obj   绑定对象
 */
const throttle = (type: any, name: any, obj: any = window) => {
  let running = false
  let func = function () {
    if (running) { return }
    running = true
    requestAnimationFrame(() => {
      obj.dispatchEvent(new CustomEvent(name))
      running = false
    })
  }
  obj.addEventListener(type, func)
}

/** 详情的标题 */
export const HeaderItem = ({ isline, margin = '20px 0', style = {}, className, children, ...props }: HeaderItemProps) => {
  return React.createElement('div', {
    className: classNames('self-adaption-header', className, {
      'self-adaption-header-inline': isline
    }),
    style: { margin: margin, ...style },
    ...props
  }, children)
}

let contentTimeObj: any = null

const ContentBase = ({ reduceHeight = 16, padding = '16px', minHeight, maxHeight,
  backgroundColor = '#fff', isscroll = false, isfooter = false, className, style = {}, children, onHeight, ...props }: ContentProps) => {
  // 容器的高度
  const [height, onSetHeight]: [string | number, any] = useState('95%')
  // 当前容器的对象
  const domref: any = useRef()

  useEffect(() => {
    throttle('resize', 'optimizedResize')
    onInitHeight()
    window.addEventListener('optimizedResize', onInitHeight)
    return () => {
      onSetHeight(200)
      window.removeEventListener('optimizedResize', onInitHeight)
      if (contentTimeObj) {
        clearTimeout(contentTimeObj)
        contentTimeObj = null
      }
    }
  }, [])

  /** 高度的初始化 */
  const onInitHeight = () => {
    if (contentTimeObj) {
      clearTimeout(contentTimeObj)
      contentTimeObj = null
    }
    contentTimeObj = setTimeout(() => {
      // 兼容IE: 非IE为0，IE为2
      const clientTop: number = document.documentElement.clientTop
      // 可视区域的高度
      const clientHeight = document.body.clientHeight
      // 实际的可用的高度
      let height = clientHeight - clientTop
      // 减去顶部的距离
      if (domref && domref.current) {
        height -= domref.current.getBoundingClientRect().top
      }
      height -= reduceHeight
      if (onHeight) onHeight(height)
      onSetHeight(height)
    }, 300)
  }

  return React.createElement('div', {
    ref: domref,
    className: classNames('self-adaption-content', className, {
      'self-adaption-scroll-content': isscroll,
      'self-adaption-content-footer': isfooter
    }),
    style: {
      padding,
      minHeight: minHeight || height,
      maxHeight: isscroll ? height : maxHeight,
      backgroundColor,
      ...style
    },
    ...props
  }, children)
}

/** 搜索的包裹层 */
export const SearchContent = React.forwardRef((props: ContentProps, ref: any) => {
  const { backgroundColor = '#fff', padding = '16px', className, style = {}, children, ...lastProps }: ContentProps = props
  return React.createElement('div', {
    ref,
    className: classNames('self-adaption-content', className),
    style: {
      padding,
      backgroundColor,
      ...style
    },
    ...lastProps
  }, children)
})

export const Footer = ({ className, style = {}, reduceWidth = '200px', reduceDom, children, ...props }: FooterProps) => {
  // 底部存在的时候减去的侧边栏宽度
  const [rdidth, onSetRdWidth]: [string, (reduceWidth: string) => void] = useState(typeof reduceWidth === 'number' ? reduceWidth + 'px' : reduceWidth)

  useEffect(() => {
    // 存在底部的时候，监听聚合的项目然后设置宽度
    if (reduceDom) {
      const heraSiderDom: any = document.getElementById(reduceDom)
      if (heraSiderDom) {
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation: any, index: number) => {
            if (mutations.length - 1 === index) {
              onSetRdWidth(mutation.target.style.width)
            }
          })
        })
        const config = { style: true, attributeOldValue: true, attributeFilter: ['style'] }
        observer.observe(heraSiderDom, config)
      }
    }
  }, [])

  return React.createElement('div', {
    className: classNames('self-adaption-content-footer-bar', className),
    style: { width: `calc(100% - ${rdidth})`, ...style },
    ...props
  }, children)
}

ContentBase.Footer = Footer
ContentBase.HeaderItem = HeaderItem
ContentBase.SearchContent = SearchContent

/**
 * 可以自动适应高度
 * ```tsx
 * <Content backgroundColor='transparent' padding='0'>
    <SearchItem savesearchparam='dome_table' onFinishData={this.onFinishData} searchParam={searchParam}/>
    <TableItem
      action={this.api.userQuery}
      loading={loading}
      columns={columns}
      onLoading={this.onLoading}
    />
  </Content>
 * ```
 */
export default ContentBase
