/*
	云爬虫源码：爬取手机网（http://m.cankaoxiaoxi.com/）的新闻内容，新闻列表是瀑布流形式
    
    开发语言：原生JavaScript
    开发教程：http://docs.shenjian.io/develop/crawler/doc/concept/crawler.html
    请在神箭手云上运行代码：http://docs.shenjian.io/overview/guide/develop/crawler.html
*/
var configs = {
  domains: ["cankaoxiaoxi.com"], //爬取的网站域名
  scanUrls: ["http://m.cankaoxiaoxi.com/"], //入口页url
  contentUrlRegexes: [/http:\/\/m\.cankaoxiaoxi\.com\/.+\/\d+\.shtml/], //内容页url正则
  helperUrlRegexes: [/http:\/\/app\.cankaoxiaoxi\.com\/\?app=shlist.+/], //列表页url正则
  userAgent : UserAgent.Mobile, // 设置请求的userAgent为手机移动设备，神箭手会自动随机主流的移动设备ua
  fields: [ // 从内容页抽取需要的数据
    {
      name: "title",
      alias: "标题",
      selector: "//article/h1", //默认使用XPath抽取
      required: true //标题是必有项
    },
    {
      name: "content",
      alias: "内容",
      selector: "//div[contains(@class,'content')]"
    },
    {
      name: "time",
      alias: "发布日期",
      selector: "//article//p[contains(@class,'time')]/span[1]"
    }
  ]
};

configs.onProcessScanPage = function (page, content, site) {
  // 下载入口页之后的回调，手动添加瀑布流列表的第一页url到待爬队列中
  var timestamp = Date.parse(new Date())/1000;
  var firstHelperUrl = "http://app.cankaoxiaoxi.com/?app=shlist&controller=mobile&action=index&page=1&update="+timestamp;
  site.addUrl(firstHelperUrl);
  return false; // 关闭自动url发现
};

configs.onProcessHelperPage = function (page, content, site) {
  // 下载列表页之后的回调
  content = content.replace("(","").replace(")",""); 
  var json = JSON.parse(content);
  if(json){
    for(var i in json){
      site.addUrl(json[i].url);// 手动添加列表页中的内容页url到待爬队列中
    }
  }
  
  var cpage = /page=(\d+)/.exec(page.url);
  if(cpage){
    cpage = parseInt(cpage[1]);
    if(cpage<100){ // 默认爬取100页列表页
      var npage = cpage+1;
      var timestamp = Date.parse(new Date())/1000;
      var nextHelperUrl = "http://app.cankaoxiaoxi.com/?app=shlist&controller=mobile&action=index&page="+npage+"&update="+timestamp;
      site.addUrl(nextHelperUrl);// 手动添加下一页列表页url到待爬队列中
    }
  }
  return false;// 关闭自动url发现
};

configs.onProcessContentPage = function (page, content, site) {
  // 下载内容页之后的回调
  return false;// 关闭自动url发现
};

// 启动爬虫
var crawler = new Crawler(configs);
crawler.start();
