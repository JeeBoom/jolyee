# Supabase 跨设备同步功能 - 使用说明

## 📋 功能介绍

本项目已集成 Supabase，实现用户浏览记录的跨设备同步功能。用户登录后，访问记录会自动同步到云端，可在任何设备登录查看。

## 🚀 快速开始

### 1. 创建 Supabase 项目

1. 访问 [Supabase 官网](https://supabase.com/)
2. 注册/登录账号
3. 点击 "New Project" 创建新项目
4. 填写项目信息：
   - Project Name: `navigation-portal`（或其他名称）
   - Database Password: 设置一个安全的密码
   - Region: 选择离你最近的区域（如 Singapore）

### 2. 获取 API 密钥

1. 项目创建完成后，进入项目设置
2. 左侧菜单选择 `Settings` → `API`
3. 复制以下两个值：
   - `Project URL`（如：https://xxxxx.supabase.co）
   - `anon/public` key（公开密钥）

### 3. 配置本地环境

1. 在项目根目录创建 `.env` 文件：
```bash
cp .env.example .env
```

2. 编辑 `.env` 文件，填入你的 Supabase 信息：
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. 创建数据库表

在 Supabase 控制台中执行以下 SQL：

```sql
-- 创建用户交互记录表
CREATE TABLE user_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  type VARCHAR(50) NOT NULL,
  target VARCHAR(255) NOT NULL,
  url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX idx_user_interactions_user_id ON user_interactions(user_id);
CREATE INDEX idx_user_interactions_created_at ON user_interactions(created_at DESC);

-- 启用行级安全策略（RLS）
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;

-- 创建策略：用户只能访问自己的数据
CREATE POLICY "Users can view their own interactions"
  ON user_interactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own interactions"
  ON user_interactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own interactions"
  ON user_interactions FOR DELETE
  USING (auth.uid() = user_id);
```

### 5. 配置邮件服务（可选）

Supabase 默认使用邮件验证注册。你可以：

1. **使用默认配置**：Supabase 提供测试邮件服务
2. **配置自定义 SMTP**：
   - 进入 `Settings` → `Auth`
   - 配置 SMTP 设置（推荐使用 SendGrid、Mailgun 等）

3. **关闭邮件验证**（仅开发环境）：
   - 进入 `Settings` → `Auth`
   - 关闭 "Enable email confirmations"

## 💡 使用方法

### 用户注册/登录

1. 点击页面右上角的 👤 图标
2. 在弹窗中输入邮箱和密码
3. 选择"注册"或"登录"
4. 注册需验证邮箱（如果启用了邮件验证）

### 数据同步

- **自动同步**：登录后，每次点击网站链接时自动同步到云端
- **手动同步**：点击用户头像 → "同步数据"
- **跨设备**：在其他设备登录相同账号，即可看到同步的数据

### 退出登录

点击用户头像 → "退出登录"

## 📊 数据说明

### 记录内容

每次点击网站时记录：
- `type`：分类类型（如 community、news 等）
- `target`：网站名称
- `url`：网站链接
- `timestamp`：访问时间

### 数据存储

- **本地**：localStorage 保存最近 100 条记录
- **云端**：Supabase 保存所有历史记录
- **安全**：使用 RLS 策略，用户只能访问自己的数据

## 🔧 开发相关

### API 函数

```javascript
import { 
  logUserInteraction,  // 记录用户交互
  syncFromCloud,       // 从云端同步
  getUserStats,        // 获取统计数据
  clearAllData,        // 清除所有数据
  signOut             // 退出登录
} from '@/utils/syncService'

// 记录访问
await logUserInteraction('community', 'V2EX', 'https://v2ex.com')

// 同步数据
const result = await syncFromCloud()
console.log(result.message)

// 获取统计
const stats = await getUserStats()
console.log('前10常访问网站:', stats)
```

### 组件集成

在任何组件中集成用户交互记录：

```javascript
import { logUserInteraction } from '@/utils/syncService'

const handleClick = async (site) => {
  await logUserInteraction('community', site.name, site.url)
  window.open(site.url, '_blank')
}
```

## 🛡️ 安全说明

1. **环境变量**：`.env` 文件不会提交到 Git
2. **RLS 策略**：确保用户只能访问自己的数据
3. **公开密钥**：`anon key` 可以公开，Supabase 通过 RLS 保护数据
4. **密码安全**：使用 Supabase Auth，密码经过加密存储

## 🐛 故障排除

### 1. 登录失败

- 检查 `.env` 文件配置是否正确
- 确认 Supabase 项目是否正常运行
- 查看浏览器控制台错误信息

### 2. 同步失败

- 检查数据库表是否正确创建
- 确认 RLS 策略是否正确配置
- 查看网络连接

### 3. 邮件未收到

- 检查垃圾邮件文件夹
- 配置自定义 SMTP 服务
- 暂时关闭邮件验证（仅开发环境）

## 📞 支持

如有问题，请：
1. 查看 [Supabase 文档](https://supabase.com/docs)
2. 查看项目 Issues
3. 联系开发者

## 🎉 完成！

现在你的导航站已经支持跨设备同步了！用户可以：
- ✅ 在手机和电脑之间同步浏览记录
- ✅ 查看访问统计
- ✅ 安全地管理个人数据

Happy Coding! 🚀
