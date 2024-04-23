# 1.API

hospital API：http://139.198.34.216:8201/swagger-ui.html

public data：http://139.198.34.216:8202/swagger-ui.html

user API：http://139.198.34.216:8203/swagger-ui.html

SMS verification：http://139.198.34.216:8204/swagger-ui.html

order API：http://139.198.34.216:8206/swagger-ui.html

file uploading API：http://139.198.34.216:8205/swagger-ui.html

backend user：http://139.198.34.216:8212/swagger-ui.html

## 2.configuration

## 2.1 automatically open in broser

package.json

```
 "scripts": {
  "dev": "vite --open",
  "build": "vue-tsc && vite build",
  "preview": "vite preview"
 },
```

## 2.2src configuration for alias

vite.config.ts

**if there are tips in red, please install @types/node , a package of TypeScript, describing Node.js core modules and commonly used third-party library type information**

```
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
 plugins: [vue()],
 resolve: {
  alias: {
   "@": path.resolve(__dirname, 'src')
  }
 }
})
```

find `tsconfig.json`, find option `compilerOptions` add configuration, to enable IDE intelligent prompts for path这一步的作用是让 IDE

```
 "baseUrl": ".",
  "paths": {
   "@/*": ["src/*"]
  }
```





### all routes:
without logging in can access:

```plaintext
/home 
/hospital/register
/hospital/detail
/hospital/notice
/hospital/close
/hospital/search
```

the rest routes require logging in

