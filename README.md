# WEB 导航

一个基于静态网页的导航站。页面内容由当前目录下的 `links.json` 驱动，修改 JSON 文件后刷新页面即可更新分类和网站链接。

## 项目功能

- 按分类展示网站链接。
- 点击卡片后在新窗口打开目标网页。
- 支持按网站名称、说明、网址进行搜索。
- 支持左侧分类导航，点击后跳转到对应分类。
- 使用 Material Design 风格的颜色、卡片、搜索框和响应式布局。
- 不依赖后端服务，使用本地静态服务器即可运行。
- 网站内容集中维护在 `links.json`，无需修改 HTML、CSS 或 JavaScript。

## 文件说明

- `index.html`：页面结构。
- `styles.css`：页面样式。
- `app.js`：读取 `links.json` 并渲染导航内容。
- `links.json`：导航站数据源，分类和链接都在这里维护。
- `start-navigation.bat`：Windows 一键启动脚本，会启动本地服务器并打开页面。

## 启动方式

推荐方式：双击运行 `start-navigation.bat`。

脚本会打开：

```text
http://127.0.0.1:8000/
```

也可以在当前目录手动运行：

```bash
python -m http.server 8000 --bind 127.0.0.1
```

然后在浏览器访问：

```text
http://127.0.0.1:8000/
```

注意：不要直接双击 `index.html` 打开。浏览器使用 `file://` 打开页面时，通常会阻止网页读取同目录下的 `links.json`，导致页面显示“无法读取 links.json”。

## links.json 结构

`links.json` 的基本结构如下：

```json
{
  "siteTitle": "WEB 导航",
  "description": "通过编辑 links.json 更新分类与网站链接。",
  "categories": [
    {
      "name": "常用工具",
      "icon": "apps",
      "links": [
        {
          "title": "Google",
          "url": "https://www.google.com",
          "description": "搜索与信息查询"
        }
      ]
    }
  ]
}
```

## 顶层字段说明

`siteTitle`

页面标题，会显示在浏览器标题栏和页面左上角。

`description`

页面副标题，显示在标题下方。

`categories`

分类数组。每个分类都会生成一个分类区域和一个左侧分类入口。

## 分类字段说明

每个分类对象支持以下字段：

```json
{
  "name": "分类名称",
  "icon": "apps",
  "links": []
}
```

`name`

分类名称，例如“常用工具”“设计资源”“学习文档”。

`icon`

分类图标标识。当前页面会把它转换为一个字母标记显示。内置映射如下：

- `apps` 显示为 `A`
- `palette` 显示为 `P`
- `school` 显示为 `S`
- `folder` 显示为 `F`

如果填写其它值，会取第一个字符作为标记。例如 `"icon": "dev"` 会显示为 `D`。

`links`

当前分类下的网站链接数组。

## 链接字段说明

每个链接对象支持以下字段：

```json
{
  "title": "网站名称",
  "url": "https://example.com",
  "description": "网站说明"
}
```

`title`

网站名称，会显示为卡片标题。

`url`

网站地址。建议填写完整地址，例如：

```text
https://github.com
```

如果省略 `https://`，页面会自动补上 `https://`。

`description`

网站说明，会显示在卡片标题下方，也会被搜索功能匹配。

## 添加一个新网站

例如要在“常用工具”分类下添加 Bing：

```json
{
  "title": "Bing",
  "url": "https://www.bing.com",
  "description": "微软搜索引擎"
}
```

添加后，该分类可能变成：

```json
{
  "name": "常用工具",
  "icon": "apps",
  "links": [
    {
      "title": "Google",
      "url": "https://www.google.com",
      "description": "搜索与信息查询"
    },
    {
      "title": "Bing",
      "url": "https://www.bing.com",
      "description": "微软搜索引擎"
    }
  ]
}
```

保存 `links.json` 后刷新页面即可看到新网站。

## 添加一个新分类

在 `categories` 数组里新增一个分类对象：

```json
{
  "name": "办公协作",
  "icon": "work",
  "links": [
    {
      "title": "Notion",
      "url": "https://www.notion.so",
      "description": "文档、知识库与项目协作"
    },
    {
      "title": "Trello",
      "url": "https://trello.com",
      "description": "看板式任务管理"
    }
  ]
}
```

注意分类之间需要用英文逗号分隔。

## 修改注意事项

- JSON 文件必须使用英文双引号，不能使用中文引号或单引号。
- 数组和对象中的每一项之间需要英文逗号。
- 最后一项后面不要多加逗号。
- 修改后如果页面无法加载，通常是 JSON 格式错误，可以使用编辑器或在线 JSON 校验工具检查。
- 修改 `links.json` 后只需要刷新浏览器，不需要重启服务器。

## 常见错误示例

错误：最后一项后多了逗号。

```json
{
  "title": "GitHub",
  "url": "https://github.com",
  "description": "代码托管与开源项目",
}
```

正确：

```json
{
  "title": "GitHub",
  "url": "https://github.com",
  "description": "代码托管与开源项目"
}
```

错误：使用了单引号。

```json
{
  'title': 'GitHub'
}
```

正确：

```json
{
  "title": "GitHub"
}
```
