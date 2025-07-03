# 어데메 🔍 - _"어데가 있나 찾엉 봅써!"_

사진과 설명을 통해 제주도내 다양한 장소를 알아보는 미니게임 입니다.

- '어데메' ➡️ 위치를 찾아가는 재미를 직관적으로 전달하고자 지은 이름
- 제주어 특유의 친근함과 구수한 느낌을 살리면서, _"어디에 있지"_ 를 제주어 느낌으로 표현
  > ℹ️ 제주어는 말끝에 '엉'이나 '와' 등 어미를 줄이는 표현을 사용합니다.

[게임 기획 소개서](https://slides.com/muhun/where-is-this-locate-in-jeju) | [결과 보고서](https://slides.com/muhun/where-is-this-locate-in-jeju-result) | [데모 보기](https://eodeme.github.io/eodeme/)

## 개발 서버 실행하기

`pnpm install`을 사용하여 종속성을 설치했으면 개발 서버를 실행 가능합니다.

```bash
pnpm run dev

# or start the server and open the app in a new browser tab
pnpm run dev --open
```

## 개발 환경 참고 학습서

- Svelte: [스벨트 공식 튜토리얼](https://svelte.dev/tutorial/)을 한번씩 직접 따라 하시는 것을 참고 바랍니다.
  - [Rich Harris' Definitive Svelte Course | Learn Svelte](https://frontendmasters.com/courses/svelte-v2/) Frontend Masters 에 Svelte 창시자가 직접 강의하는 영상이 있는데요, 이전 버전의 튜토리얼이라 현재 튜토리얼과는 문법 상 차이가 약간 있습니다.
- Tailwind CSS: 여러 스타일이 사전에 정의된 클래스 네임으로 제공하는 유틸리티 CSS 라이브러리
  - https://tailwindcss.com/
  - https://unocss.dev/interactive/: Tailwind CSS 스타일의 클래스 네임을 입력하면 CSS 규칙 결과물을 보여줍니다.
