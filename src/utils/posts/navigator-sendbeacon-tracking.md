---
title: navigator.sendBeacon 埋点实战：页面离开时数据也不丢失
slug: navigator-sendbeacon-tracking
author: ssuperjee
date: 2026-01-12
category: 前端技术
blogCategory: frontend
tags:
  - JavaScript
  - 埋点
  - 性能优化
  - Web API
excerpt: 深入探讨 navigator.sendBeacon API 在埋点场景中的应用，解决页面卸载时数据丢失问题，包含完整的实战代码和最佳实践。
readTime: 8 分钟
published: true
---

## 前言

在前端埋点场景中，我们经常遇到一个棘手的问题：**用户关闭页面时，数据上报可能会失败**。传统的 `fetch` 或 `XMLHttpRequest` 在页面卸载（unload）时会被浏览器中断，导致数据丢失。

`navigator.sendBeacon` 就是为了解决这个问题而生的 Web API。它可以在页面卸载时异步发送数据，且不会被中断。

## 什么是 sendBeacon？

`navigator.sendBeacon()` 是一个用于向服务器发送少量数据的方法，特别适用于以下场景：

- 页面关闭/刷新时的数据上报
- 用户离开时的行为统计
- 会话结束时的数据同步

### 核心特点

✅ **异步非阻塞**：不影响页面卸载速度  
✅ **数据可靠**：浏览器保证在后台完成发送  
✅ **简单高效**：API 简洁，无需复杂的错误处理  
✅ **HTTP POST**：默认使用 POST 方法发送

## 基础用法

```javascript
// 最简单的用法
navigator.sendBeacon('/api/log', JSON.stringify({
  action: 'page_leave',
  timestamp: Date.now()
}));

// 返回值：true 表示数据已加入发送队列，false 表示失败
const success = navigator.sendBeacon('/api/track', data);
if (!success) {
  console.error('数据加入队列失败');
}
```

## 实战案例 1：页面停留时长统计

这是最常见的埋点需求，统计用户在页面停留的时间。

```javascript
class PageTimeTracker {
  constructor(reportUrl) {
    this.reportUrl = reportUrl;
    this.startTime = Date.now();
    this.setupListeners();
  }

  setupListeners() {
    // 监听页面可见性变化
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.sendData();
      }
    });

    // 兜底：页面卸载时发送
    window.addEventListener('beforeunload', () => {
      this.sendData();
    });

    // 处理单页应用路由切换
    window.addEventListener('pagehide', () => {
      this.sendData();
    });
  }

  sendData() {
    const duration = Date.now() - this.startTime;
    const data = {
      page: window.location.pathname,
      duration: duration,
      timestamp: Date.now(),
      userAgent: navigator.userAgent
    };

    // 使用 Blob 设置正确的 Content-Type
    const blob = new Blob([JSON.stringify(data)], {
      type: 'application/json'
    });

    navigator.sendBeacon(this.reportUrl, blob);
    
    // 重置计时器（用于 SPA 场景）
    this.startTime = Date.now();
  }
}

// 使用方式
const tracker = new PageTimeTracker('/api/analytics/page-time');
```

## 实战案例 2：用户行为轨迹收集

收集用户的点击、滚动等行为，在离开时统一上报。

```javascript
class BehaviorTracker {
  constructor(options = {}) {
    this.endpoint = options.endpoint || '/api/analytics/behavior';
    this.events = [];
    this.maxEvents = options.maxEvents || 50; // 最多缓存事件数
    this.flushInterval = options.flushInterval || 30000; // 30秒自动上报
    
    this.init();
  }

  init() {
    // 监听各种用户行为
    this.trackClicks();
    this.trackScroll();
    
    // 定时上报
    this.startAutoFlush();
    
    // 页面离开时上报
    this.setupUnloadHandler();
  }

  trackClicks() {
    document.addEventListener('click', (e) => {
      const target = e.target;
      this.addEvent({
        type: 'click',
        element: target.tagName,
        className: target.className,
        id: target.id,
        text: target.innerText?.slice(0, 50),
        timestamp: Date.now()
      });
    }, true);
  }

  trackScroll() {
    let scrollTimer;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        this.addEvent({
          type: 'scroll',
          scrollY: window.scrollY,
          scrollPercent: Math.round(
            (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
          ),
          timestamp: Date.now()
        });
      }, 200);
    }, { passive: true });
  }

  addEvent(event) {
    this.events.push(event);
    
    // 达到最大缓存数时自动上报
    if (this.events.length >= this.maxEvents) {
      this.flush();
    }
  }

  startAutoFlush() {
    this.flushTimer = setInterval(() => {
      if (this.events.length > 0) {
        this.flush();
      }
    }, this.flushInterval);
  }

  flush() {
    if (this.events.length === 0) return;

    const data = {
      sessionId: this.getSessionId(),
      events: this.events,
      page: window.location.href,
      timestamp: Date.now()
    };

    const blob = new Blob([JSON.stringify(data)], {
      type: 'application/json'
    });

    if (navigator.sendBeacon(this.endpoint, blob)) {
      this.events = []; // 清空已发送的事件
    }
  }

  setupUnloadHandler() {
    const sendFinalData = () => {
      this.flush();
      clearInterval(this.flushTimer);
    };

    // 优先使用 visibilitychange
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        sendFinalData();
      }
    });

    // 兜底方案
    window.addEventListener('beforeunload', sendFinalData);
    window.addEventListener('pagehide', sendFinalData);
  }

  getSessionId() {
    // 简单的 session ID 生成（实际项目中应使用更健壮的方案）
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  destroy() {
    clearInterval(this.flushTimer);
    this.flush(); // 销毁前最后一次上报
  }
}

// 使用方式
const behaviorTracker = new BehaviorTracker({
  endpoint: '/api/analytics/behavior',
  maxEvents: 100,
  flushInterval: 20000 // 20秒
});
```

## 实战案例 3：错误监控上报

捕获 JavaScript 错误和资源加载失败，在离开页面时上报。

```javascript
class ErrorTracker {
  constructor(reportUrl) {
    this.reportUrl = reportUrl;
    this.errors = [];
    this.setupErrorHandlers();
    this.setupUnloadHandler();
  }

  setupErrorHandlers() {
    // 捕获 JavaScript 运行时错误
    window.addEventListener('error', (event) => {
      this.addError({
        type: 'js_error',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        timestamp: Date.now()
      });
    });

    // 捕获未处理的 Promise 错误
    window.addEventListener('unhandledrejection', (event) => {
      this.addError({
        type: 'promise_rejection',
        reason: event.reason?.toString(),
        stack: event.reason?.stack,
        timestamp: Date.now()
      });
    });

    // 捕获资源加载错误
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.addError({
          type: 'resource_error',
          tagName: event.target.tagName,
          src: event.target.src || event.target.href,
          timestamp: Date.now()
        });
      }
    }, true);
  }

  addError(error) {
    this.errors.push({
      ...error,
      page: window.location.href,
      userAgent: navigator.userAgent
    });

    // 立即上报严重错误
    if (this.errors.length >= 10) {
      this.report();
    }
  }

  setupUnloadHandler() {
    const reportOnLeave = () => {
      this.report();
    };

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        reportOnLeave();
      }
    });

    window.addEventListener('beforeunload', reportOnLeave);
  }

  report() {
    if (this.errors.length === 0) return;

    const payload = {
      errors: this.errors,
      sessionId: sessionStorage.getItem('analytics_session_id') || 'unknown',
      timestamp: Date.now()
    };

    const blob = new Blob([JSON.stringify(payload)], {
      type: 'application/json'
    });

    if (navigator.sendBeacon(this.reportUrl, blob)) {
      this.errors = [];
    }
  }
}

// 使用方式
const errorTracker = new ErrorTracker('/api/analytics/errors');
```

## 兼容性处理

虽然 `sendBeacon` 支持度很好（Chrome 39+, Firefox 31+），但仍需兜底方案：

```javascript
function sendTracking(url, data) {
  const payload = JSON.stringify(data);

  // 优先使用 sendBeacon
  if (navigator.sendBeacon) {
    const blob = new Blob([payload], { type: 'application/json' });
    const success = navigator.sendBeacon(url, blob);
    if (success) return;
  }

  // 降级方案：同步 XMLHttpRequest（最后手段）
  try {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, false); // 注意：false 表示同步
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(payload);
  } catch (e) {
    console.error('数据上报失败', e);
  }
}
```

## 后端接收示例（Node.js + Express）

```javascript
const express = require('express');
const app = express();

// 使用中间件解析 JSON
app.use(express.json());

// 页面停留时长接口
app.post('/api/analytics/page-time', (req, res) => {
  const { page, duration, timestamp } = req.body;
  
  console.log('页面访问记录:', {
    page,
    duration: `${(duration / 1000).toFixed(2)}秒`,
    time: new Date(timestamp).toISOString()
  });

  // 存储到数据库...
  // await db.pageViews.create({ page, duration, timestamp });

  res.status(204).send(); // 204 No Content
});

// 行为轨迹接口
app.post('/api/analytics/behavior', (req, res) => {
  const { sessionId, events, page } = req.body;
  
  console.log(`收到 ${events.length} 条行为事件，Session: ${sessionId}`);
  
  // 批量存储事件...
  // await db.events.insertMany(events.map(e => ({ ...e, sessionId, page })));

  res.status(204).send();
});

// 错误上报接口
app.post('/api/analytics/errors', (req, res) => {
  const { errors, sessionId } = req.body;
  
  console.error(`收到 ${errors.length} 个错误，Session: ${sessionId}`);
  errors.forEach(err => {
    console.error(`[${err.type}] ${err.message || err.reason}`);
  });

  // 存储错误日志...
  // await db.errorLogs.insertMany(errors);

  res.status(204).send();
});

app.listen(3000, () => {
  console.log('Analytics server running on port 3000');
});
```

## 最佳实践

### 1. 优先使用 visibilitychange

`visibilitychange` 比 `beforeunload` 更可靠，尤其在移动端：

```javascript
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    // 发送数据
    navigator.sendBeacon(url, data);
  }
});
```

### 2. 使用 Blob 设置正确的 Content-Type

```javascript
const blob = new Blob([JSON.stringify(data)], {
  type: 'application/json' // 告诉服务器这是 JSON
});
navigator.sendBeacon(url, blob);
```

### 3. 控制数据大小

sendBeacon 有大小限制（通常 64KB），避免发送过大数据：

```javascript
const MAX_SIZE = 60 * 1024; // 60KB

function sendIfFits(url, data) {
  const payload = JSON.stringify(data);
  if (payload.length > MAX_SIZE) {
    console.warn('数据过大，需要分批发送');
    // 分批处理...
    return;
  }
  
  const blob = new Blob([payload], { type: 'application/json' });
  navigator.sendBeacon(url, blob);
}
```

### 4. 合理设置上报频率

避免频繁上报影响性能：

```javascript
class ThrottledTracker {
  constructor(url, interval = 5000) {
    this.url = url;
    this.interval = interval;
    this.buffer = [];
    this.timer = null;
  }

  track(event) {
    this.buffer.push(event);
    
    if (!this.timer) {
      this.timer = setTimeout(() => {
        this.flush();
        this.timer = null;
      }, this.interval);
    }
  }

  flush() {
    if (this.buffer.length === 0) return;
    
    const data = { events: this.buffer };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    navigator.sendBeacon(this.url, blob);
    
    this.buffer = [];
  }
}
```

## 注意事项

⚠️ **只能使用 POST 方法**：sendBeacon 固定使用 POST，无法自定义请求方法  
⚠️ **无法自定义请求头**：除了 Content-Type（通过 Blob），其他请求头无法设置  
⚠️ **无响应处理**：无法获取服务器响应，只知道是否成功加入队列  
⚠️ **跨域需要 CORS**：跨域请求需要服务器配置正确的 CORS 头

## 完整的生产级埋点 SDK

综合上述实践，这里是一个完整的埋点 SDK：

```javascript
class AnalyticsSDK {
  constructor(config = {}) {
    this.config = {
      endpoint: config.endpoint || '/api/analytics',
      autoTrack: config.autoTrack ?? true,
      maxEvents: config.maxEvents || 50,
      flushInterval: config.flushInterval || 30000,
      enableErrorTracking: config.enableErrorTracking ?? true,
      ...config
    };

    this.events = [];
    this.startTime = Date.now();
    this.sessionId = this.getOrCreateSessionId();

    if (this.config.autoTrack) {
      this.init();
    }
  }

  init() {
    this.setupPageTracking();
    this.setupAutoFlush();
    this.setupUnloadHandler();
    
    if (this.config.enableErrorTracking) {
      this.setupErrorTracking();
    }
  }

  // 生成或获取 Session ID
  getOrCreateSessionId() {
    const key = 'analytics_session_id';
    let sessionId = sessionStorage.getItem(key);
    
    if (!sessionId) {
      sessionId = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
      sessionStorage.setItem(key, sessionId);
    }
    
    return sessionId;
  }

  // 页面访问追踪
  setupPageTracking() {
    this.track('page_view', {
      page: window.location.pathname,
      referrer: document.referrer,
      title: document.title
    });
  }

  // 自定义事件追踪
  track(eventName, properties = {}) {
    this.events.push({
      event: eventName,
      properties: {
        ...properties,
        timestamp: Date.now(),
        page: window.location.href
      }
    });

    if (this.events.length >= this.config.maxEvents) {
      this.flush();
    }
  }

  // 定时自动上报
  setupAutoFlush() {
    this.flushTimer = setInterval(() => {
      if (this.events.length > 0) {
        this.flush();
      }
    }, this.config.flushInterval);
  }

  // 错误追踪
  setupErrorTracking() {
    window.addEventListener('error', (event) => {
      this.track('js_error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.track('promise_rejection', {
        reason: event.reason?.toString()
      });
    });
  }

  // 页面卸载处理
  setupUnloadHandler() {
    const handleUnload = () => {
      // 发送页面停留时长
      const duration = Date.now() - this.startTime;
      this.track('page_leave', { duration });
      
      // 上报所有事件
      this.flush();
      
      // 清理定时器
      if (this.flushTimer) {
        clearInterval(this.flushTimer);
      }
    };

    // 优先使用 visibilitychange
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        handleUnload();
      }
    });

    // 兜底方案
    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('pagehide', handleUnload);
  }

  // 上报数据
  flush() {
    if (this.events.length === 0) return;

    const payload = {
      sessionId: this.sessionId,
      events: this.events,
      userAgent: navigator.userAgent,
      timestamp: Date.now()
    };

    const blob = new Blob([JSON.stringify(payload)], {
      type: 'application/json'
    });

    const success = navigator.sendBeacon(this.config.endpoint, blob);
    
    if (success) {
      this.events = [];
    } else {
      console.warn('sendBeacon failed, trying fallback');
      this.fallbackSend(payload);
    }
  }

  // 降级方案
  fallbackSend(payload) {
    try {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', this.config.endpoint, false);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(payload));
      this.events = [];
    } catch (e) {
      console.error('Analytics send failed:', e);
    }
  }

  // 手动销毁
  destroy() {
    this.flush();
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
  }
}

// 使用示例
const analytics = new AnalyticsSDK({
  endpoint: '/api/analytics',
  maxEvents: 100,
  flushInterval: 20000
});

// 追踪自定义事件
analytics.track('button_click', {
  buttonId: 'submit-btn',
  buttonText: '提交'
});

// 追踪商品浏览
analytics.track('product_view', {
  productId: '12345',
  productName: 'iPhone 15',
  price: 5999
});
```

## 总结

`navigator.sendBeacon` 是前端埋点的理想选择，特别适合：

✅ 页面关闭/刷新时的数据上报  
✅ 不需要服务器响应的场景  
✅ 移动端网页的数据采集  
✅ 性能敏感的应用

通过本文的实战案例，你可以快速构建一个可靠的埋点系统。记住核心要点：

1. 优先使用 `visibilitychange` 事件
2. 使用 Blob 设置正确的 Content-Type
3. 控制数据大小和上报频率
4. 提供降级方案保证兼容性

现在就去试试吧，让你的数据不再丢失！🚀

## 参考资料

- [MDN - Navigator.sendBeacon()](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon)
- [W3C - Beacon Specification](https://www.w3.org/TR/beacon/)
- [Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API)
