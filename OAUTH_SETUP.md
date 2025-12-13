# Google & GitHub OAuth 登录配置指南

## 🎯 功能说明

用户可以通过以下方式登录：
- ✉️ 邮箱+密码
- 🔵 Google 账号
- 🐙 GitHub 账号

所有登录方式共享同一用户系统，数据自动同步。

---

## 🔵 Google OAuth 配置

### 1. 创建 Google OAuth 应用

1. **访问 Google Cloud Console**
   - 地址：https://console.cloud.google.com/

2. **创建或选择项目**
   - 点击顶部项目选择器
   - 点击 "新建项目"
   - 项目名称：`Navigation Portal`（或其他名称）
   - 点击 "创建"

3. **启用 Google+ API**
   - 在侧边栏选择 "API和服务" → "库"
   - 搜索 "Google+ API"
   - 点击启用

4. **创建 OAuth 凭据**
   - 侧边栏：API和服务 → 凭据
   - 点击 "创建凭据" → "OAuth 客户端 ID"
   - 应用类型：选择 "Web应用"
   - 名称：`Navigation Portal Web`

5. **配置重定向 URI**
   
   **开发环境**：
   ```
   http://localhost:5173
   http://localhost:5174
   http://localhost:5175
   ```
   
   **生产环境**：
   ```
   https://你的域名.com
   ```

6. **获取凭据**
   - 创建完成后，会显示：
     - 客户端 ID
     - 客户端密钥
   - 复制这两个值

### 2. 在 Supabase 中配置 Google

1. **进入 Supabase Dashboard**
   - 打开你的项目

2. **配置 Google Provider**
   - 侧边栏：Authentication → Providers
   - 找到 "Google"
   - 点击展开

3. **启用并填写信息**
   - 开启 "Enable Sign in with Google"
   - Client ID：粘贴 Google 的客户端 ID
   - Client Secret：粘贴 Google 的客户端密钥
   - 点击 "Save"

4. **复制回调 URL**
   - Supabase 会显示一个回调 URL，格式如：
     ```
     https://你的项目ID.supabase.co/auth/v1/callback
     ```
   - 复制这个 URL

5. **回到 Google Console 添加回调 URL**
   - 返回 Google Cloud Console
   - 凭据 → 选择你的 OAuth 客户端
   - 在 "已授权的重定向 URI" 中添加 Supabase 的回调 URL
   - 保存

---

## 🐙 GitHub OAuth 配置

### 1. 创建 GitHub OAuth 应用

1. **访问 GitHub Settings**
   - 登录 GitHub
   - 点击头像 → Settings
   - 侧边栏最底部：Developer settings
   - 选择 "OAuth Apps"
   - 点击 "New OAuth App"

2. **填写应用信息**
   
   **重要**：需要先从 Supabase 获取回调 URL！
   
   - 打开 Supabase Dashboard → Authentication → Providers → GitHub
   - 复制 **Callback URL (for OAuth)**，格式如：
     ```
     https://你的项目ID.supabase.co/auth/v1/callback
     ```
   
   然后填写 GitHub OAuth App：
   
   - **Application name**: `Navigation Portal`
   - **Homepage URL**: `https://你的域名.com`（或开发时用 `http://localhost:5173`）
   - **Application description**: `Navigation Portal with GitHub Login`（可选）
   - **Authorization callback URL**: **粘贴上面复制的 Supabase 回调 URL**

3. **创建应用**
   - 点击 "Register application"
   - 记录下：
     - Client ID
     - Client Secret（点击 "Generate a new client secret" 生成）

### 2. 在 Supabase 中配置 GitHub

1. **配置 GitHub Provider**
   - Supabase Dashboard
   - Authentication → Providers
   - 找到 "GitHub"

2. **启用并填写**
   - 开启 "Enable Sign in with GitHub"
   - Client ID：粘贴 GitHub 的 Client ID
   - Client Secret：粘贴 GitHub 的 Client Secret
   - 点击 "Save"

3. **复制回调 URL**
   - Supabase 显示的回调 URL：
     ```
     https://你的项目ID.supabase.co/auth/v1/callback
     ```

4. **回到 GitHub 添加回调 URL**
   - 返回 GitHub OAuth Apps 设置
   - 在 "Authorization callback URL" 中粘贴 Supabase 的回调 URL
   - 点击 "Update application"

---

## 🧪 测试 OAuth 登录

### 1. 重启开发服务器

```bash
npm run dev
```

### 2. 测试步骤

1. 打开浏览器：http://localhost:5175
2. 点击右上角 👤 图标
3. 看到登录弹窗，现在有三种选项：
   - 邮箱+密码登录
   - **Google 登录**（蓝色按钮）
   - **GitHub 登录**（黑色按钮）

4. 点击 Google/GitHub 按钮
5. 会跳转到相应的授权页面
6. 授权后自动返回你的网站
7. 登录成功，右上角显示 ✓

### 3. 验证功能

- ✅ 登录后可以点击网站链接，数据会同步
- ✅ 点击 ✓ → "同步数据" 可以手动同步
- ✅ 退出登录后可以重新登录
- ✅ 跨设备使用相同账号登录可以看到同步的数据

---

## 🔧 常见问题

### 1. Google 登录跳转后显示 400 错误

**原因**：重定向 URI 配置不匹配

**解决**：
- 检查 Google Console 中的 "已授权的重定向 URI"
- 确保包含当前访问的地址（如 http://localhost:5173）
- 确保包含 Supabase 的回调 URL

### 2. GitHub 登录提示 "redirect_uri_mismatch"

**原因**：GitHub 回调 URL 配置错误

**解决**：
- 检查 GitHub OAuth App 的 "Authorization callback URL"
- 必须完全匹配 Supabase 的回调 URL
- URL 末尾不要有多余的 `/`

### 3. OAuth 登录后没有返回网站

**原因**：redirectTo 配置问题

**解决**：
- 检查 `AuthModal.vue` 中的 redirectTo 设置
- 确保是你网站的完整 URL
- 开发环境：`http://localhost:5173`
- 生产环境：`https://你的域名.com`

### 4. 登录成功但数据没有同步

**原因**：数据库表或权限问题

**解决**：
- 确认已创建 `user_interactions` 表
- 确认 RLS 策略已正确配置
- 查看浏览器控制台是否有错误

---

## 📱 移动端支持

OAuth 登录在移动端同样有效：
- iOS Safari
- Android Chrome
- 微信内置浏览器（部分支持）

**注意**：移动端需要配置生产环境域名的重定向 URI。

---

## 🚀 生产环境部署

部署到生产环境时：

### 1. 更新 Google Console
- 添加生产域名到 "已授权的 JavaScript 来源"
- 添加生产域名到 "已授权的重定向 URI"

### 2. 更新 GitHub OAuth App
- 修改 Homepage URL 为生产域名
- Authorization callback URL 保持 Supabase 的回调 URL 不变

### 3. 不需要修改代码
- OAuth 配置在 Supabase 端
- 前端代码自动适配

---

## ✅ 配置完成检查清单

- [ ] Google Cloud Console 创建 OAuth 应用
- [ ] Google Console 配置重定向 URI（开发+生产）
- [ ] Supabase 启用 Google Provider
- [ ] Google Console 添加 Supabase 回调 URL
- [ ] GitHub 创建 OAuth App
- [ ] GitHub 配置回调 URL
- [ ] Supabase 启用 GitHub Provider
- [ ] 测试 Google 登录成功
- [ ] 测试 GitHub 登录成功
- [ ] 验证数据同步功能

---

## 🎉 完成！

现在你的导航站支持三种登录方式：
- 📧 邮箱密码（适合不想使用第三方账号的用户）
- 🔵 Google（最广泛使用）
- 🐙 GitHub（开发者最爱）

用户可以自由选择喜欢的登录方式，所有数据都会自动同步！

Happy Coding! 🚀
