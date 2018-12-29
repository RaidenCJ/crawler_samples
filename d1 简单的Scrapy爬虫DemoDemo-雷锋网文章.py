# 爬虫源码：爬取雷锋网的文章
# 开发语言：原生Python
# 开发教程：https://docs.shenjian.io/develop/scrapy/doc/concept.html
# 请在神箭手云上运行代码：http://docs.shenjian.io/overview/guide/develop/scrapy.html

import scrapy


class ArticleItem(scrapy.item.Item):
    article_title = scrapy.Field(alias='文章标题', required=True)
    article_content = scrapy.Field(alias='文章内容')
    article_publish_time = scrapy.Field(alias='文章发布时间')
    article_author = scrapy.Field(alias='文章作者')


class LeifengSpider(scrapy.Spider):
    name = "leifeng"

    def start_requests(self):
        for i in range(1, 5):
            page_url = 'https://www.leiphone.com/search?s=vr&site=article&page=%d' %(i)
            yield scrapy.Request(url=page_url, callback=self.parse_list)

    def parse_list(self, response):
        selector = scrapy.Selector(response)
        urls = selector.xpath("//ul[@class='articleList']/li/div/a/@href").extract()
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse_article)
        
    def parse_article(self, response):
        selector = scrapy.Selector(response)
        article = ArticleItem()
        article['article_title'] = selector.xpath("//h1[contains(@class,'headTit')]/text()").extract_first().strip()
        article['article_content'] = selector.xpath("//div[contains(@class,'lph-article-comView')]").extract_first()
        article['article_publish_time'] = selector.xpath("//td[contains(@class,'time')]/text()").extract_first().strip()
        article['article_author'] = selector.xpath("//td[contains(@class,'aut')]/a/text()").extract_first().strip()
        yield article
