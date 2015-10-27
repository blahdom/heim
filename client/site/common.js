var _ = require('lodash')
var React = require('react')
var classNames = require('classnames')
var sectionRe = /^section (\w+)$/
var MarkdownIt = require('markdown-it')

var MessageText = require('../lib/ui/message-text')
var hueHash = require('../lib/hue-hash')
var heimURL = require('../lib/heim-url')


var md = MarkdownIt()
  .use(require('markdown-it-anchor'), {
    permalink: true,
    permalinkBefore: true,
    permalinkSymbol: '#',
  })
  .use(require('markdown-it-container'), 'section', {
    validate: function(params) {
      return params.trim().match(sectionRe)
    },

    render: function (tokens, idx) {
      var m = tokens[idx].info.trim().match(sectionRe)
      if (tokens[idx].nesting === 1) {
        return '<section class="' + m[1] + '">\n'
      } else {
        return '</section>\n'
      }
    }
  })

var Page = module.exports.Page = React.createClass({
  render: function() {
    return (
      <html>
      <head>
        <meta charSet="utf-8" />
        <title>{this.props.title}</title>
        <link rel="icon" id="favicon" href={heimURL('/static/favicon.png')} sizes="32x32" />
        <link rel="icon" href={heimURL('/static/favicon-192.png')} sizes="192x192" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="stylesheet" type="text/css" id="css" href={heimURL('/static/site.css')} />
      </head>
      <body className={this.props.className}>
        {this.props.children}
      </body>
      </html>
    )
  },
})

var Header = module.exports.Header = React.createClass({
  render: function() {
    return (
      <header>
        <div className="container">
          <a className="logo" href={heimURL('/')}>euphoria</a>
          <a className="whats-euphoria" href={heimURL('/about')}><span className="long">what's euphoria</span>?</a>
          <a className="start-chatting" href={heimURL('/room/welcome/')} target="_blank">start chatting &raquo;</a>
        </div>
      </header>
    )
  },
})

var Footer = module.exports.Footer = React.createClass({
  render: function() {
    return (
      <footer>
        <div className="container">
          <a href={heimURL('/about')}>about</a>
          <a href={heimURL('/about/values')}>values</a>
          <a href={heimURL('/about/conduct')}><span className="long">code of </span>conduct</a>
          <a href="https://github.com/euphoria-io/heim"><span className="long">source </span>code</a>
          <a href="http://andeuphoria.tumblr.com/">blog</a>
          <a href="mailto:hi@euphoria.io">contact</a>
        </div>
      </footer>
    )
  },
})

module.exports.MainPage = React.createClass({
  render: function() {
    return (
      <Page className={classNames('page', this.props.className)} title={this.props.title}>
        <Header />
        {this.props.nav}
        <div className="container main">
          {this.props.children}
        </div>
        <Footer />
      </Page>
    )
  },
})

module.exports.Markdown = React.createClass({
  render: function() {
    return (
      <div className={this.props.className} dangerouslySetInnerHTML={{__html: md.render(this.props.content)}} />
    )
  },
})

module.exports.FancyLogo = React.createClass({
  render: function() {
    return (
      <div className="fancy-logo">
        <a className="logo" href={heimURL('/room/welcome/')} tabIndex={1}>welcome</a>
        <div className="colors">
          <div className="a"></div>
          <div className="b"></div>
          <div className="c"></div>
          <div className="d"></div>
          <div className="e"></div>
        </div>
      </div>
    )
  },
})

module.exports.PolicyNav = React.createClass({
  render: function() {
    var items = [
      {name: 'values', caption: <span>Values</span>},
      {name: 'conduct', caption: <span><span className="long">Code of </span>Conduct</span>},
      {name: 'hosts', caption: <span><span className="long">Hosting </span>Rooms</span>},
    ]

    return (
      <nav>
        <div className="container">
          <span className="label">Platform Policies:</span>
          <ul>
            {_.map(items, item =>
              <li key={item.name} className={classNames(this.props.selected == item.name && 'selected')}>
                <a href={heimURL('/about/' + item.name)}>{item.caption}</a>
              </li>
            )}
          </ul>
        </div>
      </nav>
    )
  },
})

var FauxNick = module.exports.FauxNick = React.createClass({
  render: function() {
    return <MessageText className="nick" onlyEmoji={true} style={{background: 'hsl(' + hueHash.hue(this.props.nick) + ', 65%, 85%)'}} content={this.props.nick} />
  },
})

module.exports.FauxMessage = React.createClass({
  render: function() {
    return (
      <div className="faux-message">
        <div className="line">
          <FauxNick nick={this.props.sender} />
          <div className="content">
            <MessageText className="message" content={this.props.message} />
            {this.props.embed && <div className="embed">
              <div className="wrapper">
                <img className="embed" src={this.props.embed} alt="" />
              </div>
            </div>}
          </div>
        </div>
        {this.props.children}
      </div>
    )
  },
})