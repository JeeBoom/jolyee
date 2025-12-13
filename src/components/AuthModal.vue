<template>
  <div v-if="showModal" class="auth-modal-overlay" @click.self="closeModal">
    <div class="auth-modal">
      <button class="close-btn" @click="closeModal">
        <span>✕</span>
      </button>
      
      <div class="auth-header">
        <h2>{{ isLogin ? '登录' : '注册' }}</h2>
        <p class="auth-subtitle">{{ isLogin ? '登录以同步你的浏览记录' : '创建账户开始同步' }}</p>
      </div>

      <div class="auth-content">
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="email">邮箱</label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="your@email.com"
              required
              autocomplete="email"
            />
          </div>

          <div class="form-group">
            <label for="password">密码</label>
            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="••••••••"
              required
              autocomplete="current-password"
              minlength="6"
            />
          </div>

          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

          <div v-if="successMessage" class="success-message">
            {{ successMessage }}
          </div>

          <button 
            type="submit" 
            class="submit-btn"
            :disabled="loading"
          >
            {{ loading ? '处理中...' : (isLogin ? '登录' : '注册') }}
          </button>
        </form>

        <!-- 分隔线 -->
        <div class="divider">
          <span>或使用第三方账号</span>
        </div>

        <!-- 第三方登录按钮 -->
        <div class="oauth-buttons">
          <button 
            @click="handleOAuthLogin('google')"
            class="oauth-btn google-btn"
            :disabled="loading"
          >
            <svg class="oauth-icon" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google 登录
          </button>

          <button 
            @click="handleOAuthLogin('github')"
            class="oauth-btn github-btn"
            :disabled="loading"
          >
            <svg class="oauth-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub 登录
          </button>
        </div>

        <div class="auth-switch">
          <span>{{ isLogin ? '还没有账户？' : '已有账户？' }}</span>
          <button @click="toggleMode" class="switch-btn">
            {{ isLogin ? '立即注册' : '去登录' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase, isSupabaseConfigured } from '../config/supabase'

const showModal = ref(false)
const isLogin = ref(true)
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const emit = defineEmits(['auth-success'])

const openModal = (loginMode = true) => {
  if (!isSupabaseConfigured()) {
    alert('Supabase 未配置，请先在 .env 文件中配置 Supabase 连接信息')
    return
  }
  isLogin.value = loginMode
  showModal.value = true
  resetForm()
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}

const resetForm = () => {
  email.value = ''
  password.value = ''
  errorMessage.value = ''
  successMessage.value = ''
  loading.value = false
}

const toggleMode = () => {
  isLogin.value = !isLogin.value
  errorMessage.value = ''
  successMessage.value = ''
}

const handleSubmit = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  loading.value = true

  try {
    if (isLogin.value) {
      // 登录
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      })

      if (error) throw error

      successMessage.value = '登录成功！'
      emit('auth-success', data.user)
      
      setTimeout(() => {
        closeModal()
      }, 1000)
    } else {
      // 注册
      const { data, error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
      })

      if (error) throw error

      successMessage.value = '注册成功！请检查邮箱完成验证。'
      
      setTimeout(() => {
        isLogin.value = true
        successMessage.value = ''
      }, 3000)
    }
  } catch (error) {
    console.error('认证错误:', error)
    errorMessage.value = error.message || '操作失败，请重试'
  } finally {
    loading.value = false
  }
}

// 第三方 OAuth 登录
const handleOAuthLogin = async (provider) => {
  console.log('🔵 开始 OAuth 登录:', provider)
  console.log('🔵 Supabase 客户端状态:', supabase)
  console.log('🔵 当前 URL:', window.location.origin)
  
  errorMessage.value = ''
  loading.value = true

  try {
    console.log('🔵 调用 signInWithOAuth...')
    const result = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${window.location.origin}/`
      }
    })

    console.log('🔵 OAuth 完整响应:', result)
    console.log('🔵 Data:', result.data)
    console.log('🔵 Error:', result.error)

    if (result.error) {
      throw result.error
    }
    
    if (result.data?.url) {
      console.log('✅ OAuth URL 生成成功，即将跳转:', result.data.url)
      // 手动跳转到 OAuth 授权页面
      window.location.href = result.data.url
    } else {
      console.warn('⚠️ 没有返回 OAuth URL')
      throw new Error('未能生成 OAuth URL')
    }
  } catch (error) {
    console.error('❌ OAuth 登录错误:', error)
    console.error('❌ 错误详情:', JSON.stringify(error, null, 2))
    errorMessage.value = error.message || 'OAuth 登录失败，请重试'
    loading.value = false
  }
}

defineExpose({
  openModal,
  closeModal
})
</script>

<style scoped>
.auth-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
}

.auth-modal {
  background: var(--bg-primary);
  border-radius: 16px;
  width: 100%;
  max-width: 420px;
  padding: 32px;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 24px;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.auth-header {
  margin-bottom: 32px;
  text-align: center;
}

.auth-header h2 {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 8px 0;
}

.auth-subtitle {
  color: var(--text-secondary);
  font-size: 14px;
  margin: 0;
}

.auth-content {
  width: 100%;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  font-size: 14px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  transition: all 0.2s;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-color);
  background: var(--bg-primary);
}

.error-message {
  padding: 12px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  color: #ef4444;
  font-size: 14px;
  margin-bottom: 16px;
}

.success-message {
  padding: 12px;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 8px;
  color: #22c55e;
  font-size: 14px;
  margin-bottom: 16px;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 分隔线 */
.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 24px 0 20px;
  color: var(--text-secondary);
  font-size: 13px;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid var(--border-color);
}

.divider span {
  padding: 0 12px;
}

/* OAuth 按钮 */
.oauth-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.oauth-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  padding: 12px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.oauth-btn:hover:not(:disabled) {
  background: var(--bg-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.oauth-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.oauth-icon {
  width: 20px;
  height: 20px;
}

.google-btn {
  border-color: #4285F4;
}

.google-btn:hover:not(:disabled) {
  border-color: #4285F4;
  background: rgba(66, 133, 244, 0.05);
}

.github-btn {
  border-color: #333;
}

.github-btn:hover:not(:disabled) {
  border-color: #333;
  background: rgba(0, 0, 0, 0.05);
}

html[data-theme="dark"] .github-btn {
  border-color: #fff;
}

html[data-theme="dark"] .github-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
}

.auth-switch {
  margin-top: 24px;
  text-align: center;
  font-size: 14px;
  color: var(--text-secondary);
}

.switch-btn {
  background: none;
  border: none;
  color: var(--primary-color);
  font-weight: 600;
  cursor: pointer;
  margin-left: 4px;
  transition: all 0.2s;
}

.switch-btn:hover {
  text-decoration: underline;
}

/* 移动端适配 */
@media (max-width: 480px) {
  .auth-modal {
    padding: 24px;
  }

  .auth-header h2 {
    font-size: 24px;
  }
}
</style>
