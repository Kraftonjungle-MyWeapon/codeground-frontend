# Codeground Frontend Project

이 문서는 Codeground 프론트엔드 프로젝트의 구조와 백엔드 API 연동 방법에 대해 설명합니다.

## 1. 프로젝트 개요

이 프로젝트는 React와 Vite를 기반으로 구축된 Codeground 서비스의 프론트엔드 애플리케이션입니다. UI 컴포넌트는 Shadcn UI를 활용하며, 상태 관리 및 비동기 데이터 처리는 React Query를 사용합니다.

## 2. 프로젝트 구조

```
/Users/gojaewoong/Desktop/jungle/codeground-frontend/
├───public/                 # 정적 파일 (이미지, 파비콘 등)
├───src/
│   ├───App.tsx             # 메인 애플리케이션 컴포넌트
│   ├───main.tsx            # 애플리케이션 진입점
│   ├───components/         # 재사용 가능한 UI 컴포넌트
│   │   ├───ui/             # Shadcn UI 컴포넌트
│   │   └───...
│   ├───hooks/              # 커스텀 React Hooks
│   │   └───use-mobile.tsx
│   │   └───use-toast.ts
│   ├───lib/                # 유틸리티 함수 및 라이브러리 설정
│   │   └───utils.ts        # Tailwind CSS 클래스 병합 유틸리티 등
│   ├───pages/              # 각 페이지 컴포넌트
│   │   ├───BattlePage.tsx
│   │   ├───LandingPage.tsx
│   │   ├───LoginPage.tsx
│   │   └───...
│   └───utils/              # 기타 유틸리티 함수
│       └───lpSystem.ts
├───package.json            # 프로젝트 의존성 및 스크립트
├───tailwind.config.ts      # Tailwind CSS 설정
├───vite.config.ts          # Vite 빌드 설정
├───tsconfig.json           # TypeScript 설정
└───...
```

## 3. 백엔드 API 연동

이 프로젝트는 `@tanstack/react-query` (이하 React Query)를 사용하여 백엔드 API와 통신합니다. React Query는 서버 상태를 효율적으로 관리하고, 데이터 페칭, 캐싱, 동기화, 업데이트 등을 간편하게 처리할 수 있도록 돕습니다.

### 3.1. API 호출 방식

일반적으로 API 호출 로직은 다음과 같은 방식으로 구현됩니다:

1.  **API 클라이언트 정의**: 백엔드 API의 엔드포인트와 요청/응답 형식을 정의하는 파일 (예: `src/api/` 또는 `src/services/` 디렉토리 내).
2.  **React Query Custom Hook**: 각 API 엔드포인트에 대한 `useQuery` 또는 `useMutation` 커스텀 훅을 정의합니다. 이 훅들은 API 클라이언트를 사용하여 데이터를 가져오거나 변경합니다.
3.  **컴포넌트에서 사용**: 페이지 또는 컴포넌트에서 정의된 React Query 커스텀 훅을 호출하여 데이터를 사용합니다.

**예시 (가상의 `src/api/auth.ts` 및 `src/hooks/useAuth.ts`):**

```typescript
// src/api/auth.ts (가상)
import axios from 'axios'; // 또는 fetch API 사용

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const authApi = {
  login: async (credentials: { username: string; password: string }) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    return response.data;
  },
  // ... 다른 인증 관련 API
};

// src/hooks/useAuth.ts (가상)
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth';

export const useLogin = () => {
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // 로그인 성공 시 처리 (예: 토큰 저장, 리다이렉트)
      console.log('Login successful:', data);
    },
    onError: (error) => {
      // 로그인 실패 시 처리
      console.error('Login failed:', error);
    },
  });
};

// src/pages/LoginPage.tsx (가상)
import React, { useState } from 'react';
import { useLogin } from '../hooks/useAuth';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { mutate: login, isLoading, isError, error } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ username, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
      {isError && <p>Error: {error?.message}</p>}
    </form>
  );
}

export default LoginPage;
```

### 3.2. API 엔드포인트 확인

백엔드 API의 실제 엔드포인트는 백엔드 개발자와 협의하거나, 백엔드 프로젝트의 문서를 참조해야 합니다. 프론트엔드 코드에서는 `VITE_API_BASE_URL` 환경 변수를 통해 API 기본 URL을 설정할 수 있습니다. 이 변수는 `.env` 파일에 정의될 수 있습니다.

### 3.3. 데이터 모델

API 요청 및 응답에 사용되는 데이터 모델 (인터페이스 또는 타입)은 TypeScript 파일 (예: `src/types/` 또는 각 API 클라이언트 파일 내)에 정의되어 있을 수 있습니다.

## 4. 개발 환경 설정

1.  **의존성 설치**:
    ```bash
    npm install # 또는 yarn install, bun install
    ```
2.  **개발 서버 실행**:
    ```bash
    npm run dev # 또는 yarn dev, bun dev
    ```
    (기본적으로 `http://localhost:5173`에서 실행됩니다.)

## 5. 빌드 및 배포

프로젝트 빌드는 다음 명령어를 사용합니다:

```bash
npm run build # 또는 yarn build, bun build
```

빌드된 파일은 `dist/` 디렉토리에 생성됩니다.

---