import React, { Component } from "react"
import PropTypes from "prop-types"

const FG_SIZE = 8
const BG_SIZE = 9

export default class Card extends Component {
  static propTypes = {
    active: PropTypes.bool,
    position: PropTypes.oneOf([
      'top',
      'right',
      'bottom',
      'left'
    ]),
    arrow: PropTypes.oneOf([
      null,
      'center',
      'top',
      'right',
      'bottom',
      'left'
    ]),
    align: PropTypes.oneOf([
      null,
      'center',
      'right',
      'left'
    ]),
    style: PropTypes.object,
    useHover: PropTypes.bool
  }

  static defaultProps = {
    active: false,
    position: 'right',
    arrow: null,
    align: null,
    style: {style: {}, arrowStyle: {}},
    useHover: true
  }

  state = {
    hover: false,
    transition: 'opacity',
    width: 0,
    height: 0,
  }

  margin = 15

  defaultArrowStyle = {
    color: '#fff',
    borderColor: 'rgba(0,0,0,.4)'
  }

  rootRef = React.createRef()

  getGlobalStyle() {
    if (!this.props.parentEl) {
      return {display: 'none'}
    }

    const style = {
      position: 'absolute',
      padding: '5px',
      background: '#fff',
      boxShadow: '0 0 8px rgba(0,0,0,.3)',
      borderRadius: '3px',
      transition: `${this.state.transition} .3s ease-in-out, visibility .3s ease-in-out`,
      opacity: this.state.hover || this.props.active ? 1 : 0,
      visibility: this.state.hover || this.props.active ? 'visible' : 'hidden',
      zIndex: 50,
      ...this.getStyle(this.props.position, this.props.arrow),
    }

    return this.mergeStyle(style, this.props.style.style)
  }

  getBaseArrowStyle() {
    return {
      position: 'absolute',
      content: '""',
      transition: 'all .3s ease-in-out'
    }
  }

  getArrowStyle() {
    let fgStyle = this.getBaseArrowStyle()
    let bgStyle = this.getBaseArrowStyle()
    fgStyle.zIndex = 60
    bgStyle.zIndex = 55

    let arrowStyle = { ...this.defaultArrowStyle, ...this.props.style.arrowStyle }
    let bgBorderColor = arrowStyle.borderColor ? arrowStyle.borderColor : 'transparent'

    let fgColorBorder = `10px solid ${arrowStyle.color}`
    let fgTransBorder = `${FG_SIZE}px solid transparent`
    let bgColorBorder = `11px solid ${bgBorderColor}`
    let bgTransBorder = `${BG_SIZE}px solid transparent`

    let {position, arrow} = this.props

    if (position === 'left' || position === 'right') {
      fgStyle.top = '50%'
      fgStyle.borderTop = fgTransBorder
      fgStyle.borderBottom = fgTransBorder
      fgStyle.marginTop = -7

      bgStyle.borderTop = bgTransBorder
      bgStyle.borderBottom = bgTransBorder
      bgStyle.top = '50%'
      bgStyle.marginTop = -8

      if (position === 'left') {
        fgStyle.right = -10
        fgStyle.borderLeft = fgColorBorder
        bgStyle.right = -11
        bgStyle.borderLeft = bgColorBorder
      }
      else {
        fgStyle.left = -10
        fgStyle.borderRight = fgColorBorder
        bgStyle.left = -11
        bgStyle.borderRight = bgColorBorder
      }

      if (arrow === 'top') {
        fgStyle.top = this.margin
        bgStyle.top = this.margin
      }
      if (arrow === 'bottom') {
        fgStyle.top = null
        fgStyle.bottom = this.margin - 7
        bgStyle.top = null
        bgStyle.bottom = this.margin - 8
      }
    }
    else {
      fgStyle.left = Math.round((this.state.width / 2) - FG_SIZE)
      fgStyle.borderLeft = fgTransBorder
      fgStyle.borderRight = fgTransBorder
      fgStyle.marginLeft = 0
      bgStyle.left = fgStyle.left - 1
      bgStyle.borderLeft = bgTransBorder
      bgStyle.borderRight = bgTransBorder
      bgStyle.marginLeft = 0

      if (position === 'top') {
        fgStyle.bottom = -10
        fgStyle.borderTop = fgColorBorder
        bgStyle.bottom = -11
        bgStyle.borderTop = bgColorBorder
      }
      else {
        fgStyle.top = -10
        fgStyle.borderBottom = fgColorBorder
        bgStyle.top = -11
        bgStyle.borderBottom = bgColorBorder
      }

      if (arrow === 'right') {
        fgStyle.left = null
        fgStyle.right = this.margin + 1 - FG_SIZE
        bgStyle.left = null
        bgStyle.right = this.margin - FG_SIZE
      }
      if (arrow === 'left') {
        fgStyle.left = this.margin + 1 - FG_SIZE
        bgStyle.left = this.margin - FG_SIZE
      }
    }

    let {color, borderColor, ...propsArrowStyle} = this.props.style.arrowStyle

    return {
      fgStyle: this.mergeStyle(fgStyle, propsArrowStyle),
      bgStyle: this.mergeStyle(bgStyle, propsArrowStyle)
    }
  }

  mergeStyle(style, theme) {
    if (theme) {
      let { position, top, left, right, bottom, marginLeft, marginRight, ...validTheme } = theme

      return {
        ...style,
        ...validTheme,
      }
    }

    return style
  }

  getStyle(position, arrow) {
    let alignOffset = 0
    let parent = this.props.parentEl
    let align = this.props.align
    let tooltipPosition = parent.getBoundingClientRect()
    let scrollY = (window.scrollY !== undefined) ? window.scrollY : window.pageYOffset
    let scrollX = (window.scrollX !== undefined) ? window.scrollX : window.pageXOffset
    let top = scrollY + tooltipPosition.top
    let left = scrollX + tooltipPosition.left
    let style = {}

    const parentSize = {
      width: parent.offsetWidth,
      height: parent.offsetHeight,
    }

    // fix for svg
    if (!parent.offsetHeight && parent.getBoundingClientRect) {
      parentSize.width = parent.getBoundingClientRect().width
      parentSize.height = parent.getBoundingClientRect().height
    }

    if (align === 'left') {
      alignOffset = - parentSize.width / 2 + FG_SIZE
    }
    else if (align === 'right') {
      alignOffset = parentSize.width / 2 - FG_SIZE
    }

    const stylesFromPosition = {
      left: () => {
        style.top = top + parentSize.height / 2 - this.state.height / 2
        style.left = left - this.state.width - this.margin
      },
      right: () => {
        style.top = top + parentSize.height / 2 - this.state.height / 2
        style.left = left + parentSize.width + this.margin
      },
      top: () => {
        style.left = left - this.state.width / 2 + parentSize.width / 2 + alignOffset
        style.top = top - this.state.height - this.margin
      },
      bottom: () => {
        style.left = left - this.state.width / 2 + parentSize.width / 2 + alignOffset
        style.top = top + parentSize.height + this.margin
      },
    }

    const stylesFromArrow = {
      left: () => {
        style.left = left + parentSize.width / 2 - this.margin + alignOffset
      },
      right: () => {
        style.left = left - this.state.width + parentSize.width / 2 + this.margin + alignOffset
      },
      top: () => {
        style.top = top + parentSize.height / 2 - this.margin
      },
      bottom: () => {
        style.top = top + parentSize.height / 2 - this.state.height + this.margin
      },
    }

    executeFunctionIfExist(stylesFromPosition, position)
    executeFunctionIfExist(stylesFromArrow, arrow)

    return style
  }

  checkWindowPosition(style, arrowStyle) {
    if (this.props.position === 'top' || this.props.position === 'bottom') {
      if (style.left < 0) {
        const parent = this.props.parentEl
        if (parent) {
          const tooltipWidth = this.state.width
          let bgStyleRight = arrowStyle.bgStyle.right
          // For arrow = center
          if (!bgStyleRight) {
            bgStyleRight = (tooltipWidth / 2) - BG_SIZE
          }
          const newBgRight = Math.round(bgStyleRight - style.left + this.margin)
          arrowStyle = {
            ...arrowStyle,
            bgStyle: {
              ...arrowStyle.bgStyle,
              right: newBgRight,
              left: null,
            },
            fgStyle: {
              ...arrowStyle.fgStyle,
              right: newBgRight + 1,
              left: null,
            },
          }
        }
        style.left = this.margin
      }
      else {
        let rightOffset = style.left + this.state.width - window.innerWidth
        if (rightOffset > 0) {
          let originalLeft = style.left
          style.left = window.innerWidth - this.state.width - this.margin
          arrowStyle.fgStyle.marginLeft += originalLeft - style.left
          arrowStyle.bgStyle.marginLeft += originalLeft - style.left
        }
      }
    }

    return {style, arrowStyle}
  }

  handleMouseEnter = () => {
    this.props.active && this.props.useHover && this.setState({hover: true})
  }

  handleMouseLeave = () => {
    this.setState({hover: false})
  }

  static getDerivedStateFromProps(props, state) {
    return {
      transition: state.hover || props.active ? 'all' : 'opacity',
    }
  }

  componentDidMount() {
    this.updateSize()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props !== prevProps){
      this.updateSize()
    }
  }

  updateSize() {
    const newWidth = this.rootRef.current.offsetWidth
    const newHeight = this.rootRef.current.offsetHeight

    if (newWidth !== this.state.width || newHeight !== this.state.height) {
      this.setState({
        width: newWidth,
        height: newHeight,
      })
    }
  }

  render() {
    let {style, arrowStyle} = this.checkWindowPosition(this.getGlobalStyle(), this.getArrowStyle())

    return (
      <div style={style} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} ref={ this.rootRef }>
        {this.props.arrow ? (
          <div>
            <span style={arrowStyle.fgStyle}/>
            <span style={arrowStyle.bgStyle}/>
          </div>)
          : null
        }
        {this.props.children}
      </div>
    )
  }
}

const executeFunctionIfExist = (object, key) => {
  if (Object.prototype.hasOwnProperty.call(object, key)){
    object[key]()
  }
}
