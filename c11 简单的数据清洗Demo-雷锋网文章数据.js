/*
  神箭手云_数据清洗开发示例代码
  该数据清洗应用主要的功能是对虎嗅网文章的爬取结果进行处理
  
  该应用依赖Demo中的<简单的文章爬虫Demo-雷锋网文章>
  1.先导入<简单的文章爬虫Demo-雷锋网文章>，运行爬虫获取爬取数据
  2.创建一个清洗应用，拷贝代码到清洗应用中
  3.在清洗应用的设置中选择输入数据为雷锋网文章爬虫的爬取数据，同时设置输出数据的位置
  4.启动清洗
  
  开发语言：原生JavaScript
  开发教程：http://docs.shenjian.io/develop/cleaner/doc/concept.html
  请在神箭手云上运行代码：http://docs.shenjian.io/overview/guide/develop/cleaner.html
*/

// 首先通过configs定义输出数据的字段（json格式）
var configs = {
  fields: [
    {
      name: "article_title",
      required: true 
    },
    {
      name: "article_content",
      required: true
    },
    {
      name: "article_publish_time",
      required: true
    },
    //和清洗前的数据字段相比，去掉了爬虫中的作者(article_author)字段
    {
      //该字段为新增字段
      name:"article_from"
    }
  ]
};

configs.onEachRow = function(row, dataFrame) {
  //去除所有标题中含有苹果的新闻
  if (row.data.article_title.indexOf("苹果") != -1) {
    return null;
  }
  //读取爬虫中的爬取链接字段，并赋值给新增的article_from
  row.data.article_from = "来源：" + row.extraData.__url;
  //将正文中的雷锋网都替换成神箭手
  row.data.article_content = row.data.article_content.replace(/雷锋网/g, "神箭手");
  
  //由于fields中没有显式申明，爬虫中的作者(article_author)字段自动被删除
  return row;
}

var cleaner = new Cleaner(configs);
cleaner.start();
