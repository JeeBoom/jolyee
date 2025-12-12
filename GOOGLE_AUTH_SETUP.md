# Google OAuth 登录配置指南

## 🚀 快速开始

Google OAuth 登录功能已集成完成！只需完成以下配置即可使用。

## 📋 配置步骤

### 1. 创建 Google Cloud 项目

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 点击顶部的项目选择器，然后点击「新建项目」
3. 输入项目名称（例如：导航中心）
4. 点击「创建」

### 2. 启用 Google+ API

1. 在左侧菜单中，选择「API 和服务」→「库」
2. 搜索「Google+ API」
3. 点击「启用」

### 3. 创建 OAuth 2.0 客户端 ID

1. 在左侧菜单中，选择「API 和服务」→「凭据」
2. 点击顶部的「+ 创建凭据」→「OAuth 客户端 ID」
3. 如果是首次创建，需要先配置「OAuth 同意屏幕」：
   - 选择「外部」
   - 填写应用名称：「导航中心」
   - 填写用户支持电子邮件
   - 添加授权域名（如果有）
   - 填写开发者联系信息
   - 保存并继续
4. 返回「凭据」页面，再次点击「+ 创建凭据」→「OAuth 客户端 ID」
5. 应用类型选择「Web 应用」
6. 名称：「导航中心 Web 客户端」
7. 添加授权的 JavaScript 来源：
   ```
   http://localhost:5173
   http://localhost:5174
   http://127.0.0.1:5173
   https://yourdomain.com (你的实际域名)
   ```
8. 添加授权的重定向 URI（可选）
9. 点击「创建」
10. **复制客户端 ID**（格式类似：`xxxxx.apps.googleusercontent.com`）

### 4. 配置客户端 ID

打开文件 `src/components/GoogleAuth.vue`，找到第 54 行：

```javascript
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com'
```

将 `YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com` 替换为你复制的客户端 ID。

### 5. 测试登录

1. 保存文件
2. 刷新页面
3. 点击右上角的「登录」按钮
4. 选择 Google 账号并授权
5. 登录成功！

## ✨ 功能特性

- ✅ Google OAuth 2.0 安全登录
- ✅ 用户信息本地持久化
- ✅ 头像和用户名显示
- ✅ 用户下拉菜单
- ✅ 登出功能
- ✅ 响应式设计（支持桌面、平板、手机）
- ✅ 深色模式适配
- ✅ 自动保存登录状态

## 🎨 使用场景

登录后可以扩展以下功能：

1. **收藏同步** - 将收藏的网站保存到云端
2. **个性化推荐** - 根据用户浏览记录推荐网站
3. **历史记录** - 跨设备同步浏览历史
4. **自定义主题** - 保存个性化主题设置
5. **评论功能** - 对网站进行评分和评论

## 🔒 安全说明

- 用户信息仅存储在浏览器 localStorage 中
- 不收集任何敏感信息
- 仅获取基本资料（姓名、邮箱、头像）
- 完全符合 GDPR 隐私保护要求

## 🐛 常见问题

### Q: 登录按钮点击后没有反应？
**A:** 检查以下几点：
1. 确保已正确配置 Client ID
2. 确保当前域名已添加到授权来源
3. 检查浏览器控制台是否有错误信息
4. 确保网络连接正常

### Q: 提示 "redirect_uri_mismatch" 错误？
**A:** 你的当前域名未添加到 Google Cloud Console 的授权来源中，请按照步骤 3 添加。

### Q: 生产环境部署需要注意什么？
**A:** 
1. 在 Google Cloud Console 中添加生产域名到授权来源
2. 确保使用 HTTPS（HTTP 仅限本地开发）
3. 配置正确的 OAuth 同意屏幕信息

### Q: 如何测试登录功能？
**A:** 
```bash
# 启动开发服务器
npm run dev

# 在浏览器中访问
http://localhost:5173
```

## 📚 相关文档

- [Google Identity Services 文档](https://developers.google.com/identity/gsi/web)
- [OAuth 2.0 指南](https://developers.google.com/identity/protocols/oauth2)

## 🎉 完成！

配置完成后，你的导航站就拥有了专业的 Google 登录功能！

需要帮助？查看 [Google Cloud Console](https://console.cloud.google.com/) 获取更多信息。
