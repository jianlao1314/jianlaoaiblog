export interface SiteConfig {
  // 网站标题
  Title: string;
  // 网站地址
  Site: string;
  // 网站副标题
  Subtitle: string;
  // 网站描述
  Description: string;
  // 网站作者
  Author: string;
  // 作者头像
  Avatar: string;
  // 网站座右铭
  Motto: string;
  // Cover 网站缩略图
  Cover: string;
  // 网站侧边栏公告 (不填写即不开启)
  Tips: string;
  // 首页打字机文案列表
  TypeWriteList: string[];
  // 网站创建时间
  CreateTime: string;
  // 顶部 Banner 配置
  HomeBanner: {
    enable: boolean;
    // 首页高度
    HomeHeight: string;
    // 其他页面高度
    PageHeight: string;
    // 背景
    background: string;
  };
  // 博客主题配置
  Theme: {
    // 颜色请用 16 进制颜色码
    // 主题颜色
    "--vh-main-color": string;
    // 字体颜色
    "--vh-font-color": string;
    // 侧边栏宽度
    "--vh-aside-width": string;
    // 全局圆角
    "--vh-main-radius": string;
    // 主体内容宽度
    "--vh-main-max-width": string;
  };
  // 导航栏 (新窗口打开 newWindow: true)
  Navs: { text: string; link: string; icon: string }[];
  // 侧边栏个人网站
  WebSites: { text: string; link: string; icon: string }[];
  // 侧边栏展示
  AsideShow: {
    // 是否展示个人网站
    WebSitesShow: boolean;
    // 是否展示分类
    CategoriesShow: boolean;
    // 是否展示标签
    TagsShow: boolean;
    // 是否展示推荐文章
    recommendArticleShow: boolean;
  };
  // DNS预解析地址
  DNSOptimization: string[];
  // 博客音乐组件解析接口
  vhMusicApi: string;
  // 评论组件（只允许同时开启一个）
  Comment: {
    // Twikoo 评论
    Twikoo: {
      enable: boolean;
      envId: string;
    };
    // Waline 评论
    Waline: {
      enable: boolean;
      serverURL: string;
    };
  };
  // Han Analytics 统计（https://github.com/uxiaohan/HanAnalytics）
  HanAnalytics: { enable: boolean; server: string; siteId: string };
  // Google 广告
  GoogleAds: {
    ad_Client: string; //ca-pub-xxxxxx
    // 侧边栏广告(不填不开启)
    asideAD_Slot: string;
    // 文章页广告(不填不开启)
    articleAD_Slot: string;
  };
  // 文章内赞赏码
  Reward: {
    // 支付宝收款码
    AliPay: string;
    // 微信收款码
    WeChat: string;
  };
  // 访问网页 自动推送到搜索引擎
  SeoPush: {
    enable: boolean;
    // 搜索引擎配置
    engines: {
      // 百度推送配置
      baidu: {
        enable: boolean;
        token?: string;  // 百度推送token
      };
      // Google推送配置
      google: {
        enable: boolean;
      };
      // Bing推送配置
      bing: {
        enable: boolean;
      };
      // 360搜索推送配置
      so360: {
        enable: boolean;
        token: string;  // 360搜索token
      };
      // 搜狗推送配置
      sogou: {
        enable: boolean;
        token: string;  // 搜狗token
      };
    };
  };
  // 页面阻尼滚动速度
  ScrollSpeed: number;
  // 验证码配置
  Verification: {
    code: string;
  };
}

interface EngineConfig {
  enable: boolean;
  token?: string;
}

interface SeoPushConfig {
  enable: boolean;
  engines: {
    [key: string]: EngineConfig;
  };
}

const config = {
  // 网站标题
  Title: '建佬AI博客',
  // 网站地址
  Site: 'https://ai.5334427.xyz',
  // 网站副标题
  Subtitle: '学习AI，使用AI，分享AI.',
  // 网站描述
  Description: '建佬AI 专注于AI与相关技术的实战分享，涵盖AI、Java、Python、架构、全栈等，并涉及学习资源、游戏资源、破解软件等领域。同时，博客也分享作者的生活、音乐和旅行的热爱。',
  // 网站作者
  Author: '建佬',
  // 作者头像
  Avatar: 'https://img.5334427.xyz/v2/9g5tIu4.jpeg',
  // 网站座右铭
  Motto: '想太多不如干一点.',
  // Cover 网站缩略图
  Cover: '/assets/images/banner/072c12ec85d2d3b5.webp',
  // 网站侧边栏公告 (不填写即不开启)
  Tips: '<p>欢迎光临我的博客 🎉</p><p>这里会分享我的日常和学习中的收集、整理及总结，希望能对你有所帮助:) 💖</p>',
  // 首页打字机文案列表
  TypeWriteList: [
    '不曾与你分享的时间,我在用AI赚钱.',
    "学习AI，理解未来；使用AI，创造价值。",
    "让AI为你打工，而不是你为AI打工。",
    "别羡慕别人靠AI赚钱，你也可以开始行动。",
    "代码改变世界，AI改变生活。",
    "用AI赋能自己，不做信息时代的局外人。",
    "抓住AI的风口，普通人也能逆风翻盘。",
    "不分享AI，就像发现金矿却埋起来。",
    "从学习AI开始，走上自动赚钱之路。",
    "不是AI太难，是你还没开始。",
  ],
  // 网站创建时间
  CreateTime: '2025-05-27',
  // 顶部 Banner 配置
  HomeBanner: {
    enable: true,
    // 首页高度
    HomeHeight: '38.88rem',
    // 其他页面高度
    PageHeight: '28.88rem',
    // 背景
    background: "url('/assets/images/home-banner.webp') no-repeat center 60%/cover",
  },
  // 博客主题配置
  Theme: {
    // 颜色请用 16 进制颜色码
    // 主题颜色
    "--vh-main-color": "#01C4B6",
    // 字体颜色
    "--vh-font-color": "#34495e",
    // 侧边栏宽度
    "--vh-aside-width": "318px",
    // 全局圆角
    "--vh-main-radius": "0.88rem",
    // 主体内容宽度
    "--vh-main-max-width": "1458px",
  },
  // 导航栏 (新窗口打开 newWindow: true)
  Navs: [
    // 仅支持 SVG 且 SVG 需放在 public/assets/images/svg/ 目录下，填入文件名即可 <不需要文件后缀名>（封装了 SVG 组件 为了极致压缩 SVG）
    // 建议使用 https://tabler.io/icons 直接下载 SVG
    { text: '朋友', link: '/links', icon: 'Nav_friends' },
    { text: '圈子', link: '/friends', icon: 'Nav_rss' },
    { text: '动态', link: '/talking', icon: 'Nav_talking' },
    { text: '文章', link: '/archives', icon: 'Nav_archives' },
    { text: '留言', link: '/message', icon: 'Nav_message' },
    { text: '关于', link: '/about', icon: 'Nav_about' },
  ],
  // 侧边栏个人网站
  WebSites: [
    // 仅支持 SVG 且 SVG 需放在 public/assets/images/svg/ 目录下，填入文件名即可 <不需要文件后缀名>（封装了 SVG 组件 为了极致压缩 SVG）
    // 建议使用 https://tabler.io/icons 直接下载 SVG
    { text: 'Github', link: 'https://github.com/jianlao1314', icon: 'WebSite_github' },
    // { text: '建佬AIAPI', link: 'https://api.5334427.xyz', icon: 'WebSite_api' },
    // { text: '每日热榜', link: 'https://hot.5334427.xyz', icon: 'WebSite_hot' },
    // { text: '骤雨重山图床', link: 'https://wp-cdn.4ce.cn', icon: 'WebSite_img' },
    { text: 'AiAnalytics', link: 'https://analytics.5334427.xyz', icon: 'WebSite_analytics' },
  ],
  // 侧边栏展示
  AsideShow: {
    // 是否展示个人网站
    WebSitesShow: true,
    // 是否展示分类
    CategoriesShow: true,
    // 是否展示标签
    TagsShow: true,
    // 是否展示推荐文章
    recommendArticleShow: true
  },
  // DNS预解析地址
  DNSOptimization: [
    'https://img.5334427.xyz',
    'https://cn.cravatar.com',
    'https://analytics.5334427.xyz',
    'https://ai.5334427.xyz',
    'https://registry.npmmirror.com',
    'https://pagead2.googlesyndication.com'
  ],
  // 博客音乐组件解析接口
  vhMusicApi: 'https://vh-api.4ce.cn/blog/meting',
  // 评论组件（只允许同时开启一个）
  Comment: {
    // Twikoo 评论
    Twikoo: {
      enable: true,
      envId: 'https://comment.5334427.xyz/.netlify/functions/twikoo'
    },
    // Waline 评论
    Waline: {
      enable: false,
      serverURL: ''
    }
  },
  // Han Analytics 统计（https://github.com/uxiaohan/HanAnalytics）
  HanAnalytics: { enable: true, server: 'https://jianlaoaibloganalytics.pages.dev/', siteId: 'Hello-JianLaoAIBlog' },
  // Google 广告
  GoogleAds: {
    ad_Client: '', //ca-pub-xxxxxx
    // 侧边栏广告(不填不开启)
    asideAD_Slot: `<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-xxxxxx" data-ad-slot="xxxxxx" data-ad-format="auto" data-full-width-responsive="true"></ins>`,
    // 文章页广告(不填不开启)
    articleAD_Slot: `<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-xxxxxx" data-ad-slot="xxxxxx" data-ad-format="auto" data-full-width-responsive="true"></ins>`
  },
  // 文章内赞赏码
  Reward: {
    // 支付宝收款码
    AliPay: '/assets/images/alipay.webp',
    // 微信收款码
    WeChat: '/assets/images/wechat.webp'
  },
  // 访问网页 自动推送到搜索引擎
  SeoPush: {
    enable: true,
    // 搜索引擎配置
    engines: {
      // 百度推送配置
      baidu: {
        enable: true,
        token: 'r8yEgZ0WpYoP70Av'
      },
      // Google推送配置
      google: {
        enable: false,
      },
      // Bing推送配置
      bing: {
        enable: false,
      },
      // 360搜索推送配置
      so360: {
        enable: false,
        token: 'YOUR_360_TOKEN'  // 360搜索token
      },
      // 搜狗推送配置
      sogou: {
        enable: false,
        token: 'YOUR_SOGOU_TOKEN'  // 搜狗token
      }
    },
  },
  // 页面阻尼滚动速度
  ScrollSpeed: 666,
  // 验证码配置
  Verification: {
    // 优先使用环境变量中的验证码，如果没有则使用默认值
    code: import.meta.env.PUBLIC_VERIFICATION_CODE || "3368"
  },
} as const;

export default config;