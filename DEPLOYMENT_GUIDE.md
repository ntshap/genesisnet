# GenesisNet Deployment Guide

## 🚀 Production Deployment Checklist

### Pre-deployment Requirements

#### Environment Setup
- [ ] **Node.js** version 18+ installed
- [ ] **NPM** atau **Yarn** package manager
- [ ] **DFX** (Dfinity SDK) for ICP deployment
- [ ] **Git** untuk version control

#### Configuration Files
- [ ] **Environment Variables** configured
- [ ] **Canister IDs** updated untuk production
- [ ] **Build Scripts** optimized
- [ ] **Dependencies** audited untuk security

### 🔧 Environment Configuration

#### Development Environment
```bash
# .env.development
VITE_ENVIRONMENT=development
VITE_ICP_HOST=http://localhost:8000
VITE_ENABLE_MOCK_FALLBACK=true
VITE_LOG_LEVEL=debug
```

#### Production Environment
```bash
# .env.production
VITE_ENVIRONMENT=production
VITE_ICP_HOST=https://ic0.app
VITE_ENABLE_MOCK_FALLBACK=false
VITE_LOG_LEVEL=error
```

### 📦 Build Process

#### 1. Install Dependencies
```bash
npm install --production
```

#### 2. Run Security Audit
```bash
npm audit fix
```

#### 3. Build for Production
```bash
npm run build
```

#### 4. Verify Build
```bash
npm run preview
```

### 🌐 ICP Canister Deployment

#### 1. Prepare Canister Configuration
```bash
# dfx.json configuration
{
  "canisters": {
    "genesisnet_frontend": {
      "type": "assets",
      "source": ["dist/"]
    }
  },
  "networks": {
    "local": {
      "bind": "127.0.0.1:8000",
      "type": "ephemeral"
    },
    "ic": {
      "providers": ["https://ic0.app"],
      "type": "persistent"
    }
  }
}
```

#### 2. Deploy to IC Network
```bash
# Login to IC network
dfx identity use default

# Deploy to IC mainnet
dfx deploy --network ic

# Verify deployment
dfx canister --network ic status genesisnet_frontend
```

### 📊 Performance Optimization

#### Bundle Analysis
```bash
# Analyze bundle size
npm run build -- --analyze

# Check for large dependencies
npm run bundle-analyzer
```

#### Optimization Checklist
- [ ] **Code Splitting** implemented
- [ ] **Lazy Loading** for heavy components
- [ ] **Image Optimization** untuk assets
- [ ] **Gzip Compression** enabled
- [ ] **CDN Configuration** untuk static assets

### 🔒 Security Configuration

#### Security Headers
```nginx
# nginx.conf
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

#### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               connect-src 'self' https://ic0.app;">
```

### 📱 PWA Configuration

#### Service Worker Setup
```javascript
// sw.js
const CACHE_NAME = 'genesisnet-v1.0.0';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});
```

#### Manifest Configuration
```json
{
  "name": "GenesisNet",
  "short_name": "GenesisNet",
  "description": "Autonomous Network for AI Data Economy",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#00ffff",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

### 🔍 Monitoring & Analytics

#### Error Tracking Setup
```javascript
// Sentry configuration
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: process.env.VITE_ENVIRONMENT,
  integrations: [
    new Sentry.BrowserTracing(),
  ],
  tracesSampleRate: 1.0,
});
```

#### Performance Monitoring
```javascript
// Web Vitals tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to your analytics service
  console.log(metric);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### 🚀 Deployment Automation

#### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to IC

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm test
      
    - name: Build
      run: npm run build
      
    - name: Deploy to IC
      run: |
        dfx identity import github-actions ${{ secrets.DFX_IDENTITY }}
        dfx deploy --network ic
```

### 📋 Post-Deployment Verification

#### Health Checks
- [ ] **Frontend Loads** successfully
- [ ] **ICP Connection** established
- [ ] **Real-time Updates** working
- [ ] **Error Handling** functioning
- [ ] **Performance Metrics** acceptable

#### Functional Testing
```javascript
// Basic functionality test
describe('GenesisNet Production Tests', () => {
  test('Dashboard loads successfully', async () => {
    const response = await fetch('https://your-domain.com');
    expect(response.status).toBe(200);
  });
  
  test('ICP connection works', async () => {
    // Test canister connectivity
  });
  
  test('Real-time updates function', async () => {
    // Test polling mechanism
  });
});
```

### 🔄 Maintenance & Updates

#### Regular Maintenance Tasks
- [ ] **Security Updates** monthly
- [ ] **Dependency Updates** quarterly
- [ ] **Performance Audits** bi-annually
- [ ] **Backup Verification** weekly

#### Update Deployment Process
```bash
# 1. Backup current version
dfx canister --network ic stop genesisnet_frontend

# 2. Deploy new version
dfx deploy --network ic

# 3. Verify deployment
dfx canister --network ic status genesisnet_frontend

# 4. Monitor for issues
tail -f /var/log/frontend.log
```

### 📈 Scaling Considerations

#### Performance Scaling
- **CDN Integration**: CloudFlare atau AWS CloudFront
- **Load Balancing**: Multiple canister instances
- **Caching Strategy**: Redis untuk frequently accessed data
- **Database Optimization**: Query optimization dan indexing

#### Infrastructure Scaling
- **Horizontal Scaling**: Multiple frontend instances
- **Vertical Scaling**: Canister cycle management
- **Geographic Distribution**: Multi-region deployment
- **Disaster Recovery**: Backup dan restore procedures

### 💰 Cost Optimization

#### ICP Cost Management
- **Cycle Monitoring**: Track canister cycle consumption
- **Efficient Queries**: Optimize canister calls
- **Batch Operations**: Reduce individual transaction costs
- **Cache Strategy**: Minimize redundant canister calls

#### Resource Optimization
```javascript
// Efficient data fetching
const optimizedFetch = useMemo(() => {
  return debounce(fetchFunction, 1000);
}, []);

// Memory management
useEffect(() => {
  return () => {
    // Cleanup subscriptions
    clearInterval(intervalRef.current);
  };
}, []);
```

---

## ⚡ Quick Deployment Commands

```bash
# Complete deployment pipeline
npm install
npm run test
npm run build
dfx deploy --network ic
npm run verify-deployment
```

## 🎯 Success Metrics

### Performance Targets
- **Page Load Time**: < 3 seconds
- **Time to Interactive**: < 5 seconds
- **Largest Contentful Paint**: < 2.5 seconds
- **Cumulative Layout Shift**: < 0.1

### Availability Targets
- **Uptime**: 99.9%
- **Error Rate**: < 0.1%
- **Response Time**: < 200ms average
- **Concurrent Users**: 1000+ supported

This deployment guide ensures a robust, scalable, and maintainable production environment for GenesisNet.
