import requests
import os
import time
from xml.etree import ElementTree as ET
from urllib.parse import urljoin

# 配置部分
BASE_URL = "https://ai.5334427.xyz"
SITEMAP_INDEX = f"{BASE_URL}/sitemap-index.xml"
BAIDU_PUSH_API = "http://data.zz.baidu.com/urls?site=https://ai.5334427.xyz&token=r8yEgZ0WpYoP70Av"
URLS_FILE = "urls.txt"
BACKUP_FILE = "urls.txt.1"
MAX_FILE_SIZE = 100 * 1024  # 100KB

def fetch_sitemap_index():
    """获取站点地图索引文件"""
    print("📥 正在抓取站点地图索引:", SITEMAP_INDEX)
    try:
        resp = requests.get(SITEMAP_INDEX)
        resp.raise_for_status()
        root = ET.fromstring(resp.content)
        # 获取所有 sitemap 文件的 URL
        sitemap_urls = [el.text for el in root.findall(".//{*}loc")]
        print(f"📋 找到 {len(sitemap_urls)} 个站点地图文件")
        return sitemap_urls
    except Exception as e:
        print("❌ 获取站点地图索引失败:", e)
        return []

def extract_urls_from_sitemap(sitemap_url):
    """从单个站点地图文件中提取 URL"""
    print("🔍 分析站点地图：", sitemap_url)
    urls = []
    try:
        resp = requests.get(sitemap_url)
        resp.raise_for_status()
        root = ET.fromstring(resp.content)
        # 获取所有 URL
        for loc in root.findall(".//{*}loc"):
            url = loc.text.strip()
            if "/article/" in url:  # 只处理文章页面
                urls.append(url)
        print(f"✅ 从 {sitemap_url} 中提取了 {len(urls)} 个文章 URL")
    except Exception as e:
        print("❌ 处理站点地图失败:", sitemap_url, e)
    return urls

def load_processed_urls():
    """加载已处理过的 URL"""
    if not os.path.exists(BACKUP_FILE):
        return set()
    try:
        with open(BACKUP_FILE, "r", encoding="utf-8") as f:
            return set(line.strip() for line in f)
    except Exception as e:
        print("❌ 读取历史记录失败:", e)
        return set()

def push_to_baidu(urls):
    """推送 URL 到百度"""
    if not urls:
        print("✅ 没有新的 URL 需要提交")
        return

    # 保存到临时文件，确保每行结尾是 \n
    with open(URLS_FILE, "w", encoding="utf-8", newline='\n') as f:
        f.write("\n".join(urls) + "\n")  # 确保最后一行也有换行符

    print(f"🚀 正在提交 {len(urls)} 个 URL 到百度")
    try:
        # 完全模拟 curl 命令
        headers = {
            'Content-Type': 'text/plain',
            'User-Agent': 'curl/7.64.1'  # 模拟 curl
        }
        
        # 读取文件内容
        with open(URLS_FILE, 'rb') as f:
            content = f.read()
            
        # 发送请求
        resp = requests.post(
            BAIDU_PUSH_API,
            headers=headers,
            data=content,
            timeout=30
        )
        
        print("📨 百度响应：", resp.text)
        
        # 检查响应
        if resp.status_code == 200:
            print("✅ 推送成功")
            # 更新历史记录
            if os.path.getsize(URLS_FILE) > MAX_FILE_SIZE:
                print("📦 文件过大，备份为:", BACKUP_FILE)
                os.replace(URLS_FILE, BACKUP_FILE)
            else:
                with open(BACKUP_FILE, "a", encoding="utf-8", newline='\n') as f:
                    for url in urls:
                        f.write(url + "\n")
        else:
            print(f"❌ 推送失败，状态码：{resp.status_code}")
            print(f"错误信息：{resp.text}")
            
            # 打印调试信息
            print("\n调试信息:")
            print(f"URL 数量: {len(urls)}")
            print(f"文件大小: {len(content)} 字节")
            print(f"第一个 URL: {urls[0] if urls else 'None'}")
            
    except Exception as e:
        print("❌ 推送失败:", e)

def main():
    try:
        # 1. 获取站点地图索引
        sitemap_urls = fetch_sitemap_index()
        if not sitemap_urls:
            print("❗未找到站点地图文件")
            return

        # 2. 从所有站点地图中提取 URL
        all_urls = set()
        for sitemap_url in sitemap_urls:
            urls = extract_urls_from_sitemap(sitemap_url)
            all_urls.update(urls)

        print(f"📊 总共发现 {len(all_urls)} 个文章页面")

        # 3. 获取已处理的 URL
        processed_urls = load_processed_urls()
        print(f"📚 历史记录中有 {len(processed_urls)} 个已处理的 URL")

        # 4. 找出新的 URL
        new_urls = sorted(all_urls - processed_urls)
        print(f"🆕 发现 {len(new_urls)} 个新的 URL")

        # 5. 推送到百度
        push_to_baidu(new_urls)

    except Exception as e:
        print("❗程序运行失败：", e)

if __name__ == "__main__":
    main()
