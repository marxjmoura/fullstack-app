'use strict'

const fs = require('fs')
const glob = require('glob')
const path = require('path')
const jsdom = require("jsdom")
const jquery = require('jquery')
const through = require('through2')
const handlebars = require('handlebars')
const PluginError = require('plugin-error')

const ROOTDIR = process.cwd()
const PLUGIN_NAME = 'gulp-blog-engine'

handlebars.registerHelper('recent_posts', function (prefix) {
  const pattern = path.join(ROOTDIR, 'blog', prefix, 'posts/**/*.hbs')
  const files = glob.sync(pattern).reverse().slice(0, 10)

  let posts = ''

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const html = fs.readFileSync(file, 'utf8')
    const dom = new jsdom.JSDOM(html)
    const $ = jquery(dom.window)

    const rootfiledir = path.join(ROOTDIR, 'blog')
    const url = file.replace(rootfiledir, '').replace('hbs', 'html')
    const link = $('<a/>').attr('href', url).html($('h1').text())

    const date = $('small').wrap('<small/>').parent().html()
    const title = $('<h1/>').html(link).wrap('<h1/>').parent().html()
    const summary = $('p').wrap('<p/>').parent().html()

    posts += `${date} ${title} ${summary}`
  }

  return new handlebars.SafeString(posts)
})

handlebars.registerHelper('include', function (file) {
  try {
    const content = fs.readFileSync(file, 'utf8')
    return new handlebars.SafeString(content)
  } catch (error) {
    console.error(PLUGIN_NAME, error.message)
    return new handlebars.SafeString('')
  }
})

function transform(file, encoding, callback) {
  if (file.isNull()) {
    // nothing to do
    return callback(null, file)
  }

  if (file.isStream()) {
    this.emit('error', new PluginError(PLUGIN_NAME, 'Streams not supported!'))
  }

  const filedir = path.parse(file.path).dir
  const filename = path.parse(file.path).name
  const isPartial = filename.startsWith('_')
  const source = file.contents.toString()

  if (isPartial) {
    const partialPrefix = filedir.replace(ROOTDIR + '/', '')
    const partialSuffix = filename.replace('_', '')
    const partialName = path.join(partialPrefix, partialSuffix)

    handlebars.registerPartial(partialName, source)
  } else {
    try {
      const template = handlebars.compile(source)
      const compiledHTML = template({})

      file.contents = Buffer.from(compiledHTML)
    } catch (err) {
      this.emit('error', new PluginError(PLUGIN_NAME, err))
    }

    this.push(file)
  }

  return callback()
}

module.exports = function () {
  return through.obj(transform)
}
