# QueryVault

> 누구나 자신만의 지식 기반 챗봇을 만들고 공유할 수 있는 RAG 기반 Q&A 시스템

**이 시스템이 이용된 사례**
- [www.kkk.me.kr](https://github.com/kkk-me-kr/kkk-frontend)

## 🔍 소개

인간의 뇌는 1m³당 1페타바이트의 정보를 담을 수 있다고 알려져있습니다.
그럼에도 우리는 방금 전에 놓았던 스마트폰의 위치도 종종 까먹곤 하죠.

그런 이유로 만들어진 **QueryVault**는 사용자가 업로드한 문서를 바탕으로 대화를 나눌 수 있는 **RAG(Retrieval-Augmented Generation)** 기반의 챗봇 시스템입니다.
새로 얻은 지식만 문서화하여 남겨둔다면, 언제든 LLM이 사용자의 실제 문서 데이터를 기반으로 하여 **정확도 높고 신뢰 가능한 답변**을 제공할 수 있습니다.

문뜩 떠오른 질문들을 던져봤더니, 아차! 싶었던 정보들이 술술 나오길 바라며 이 프로젝트를 기획하게 되었습니다.

---

## 🧠 기술 스택

| 구성 요소       | 기술 |
|----------------|------|
| Framework         | Nest.js |
| Vector DB        | Chroma |
| RDB            | MySQL |
| LLM            | OpenAI GPT-4.1 |
| Embedding    | [BAAI/bge-m3](https://huggingface.co/Xenova/bge-m3) |
| document examples | 이력서, 블로그, 기술 문서, 회사 소개, 사규 등 |

---

## 🛠 주요 기능

- 문서 업로드 및 자동 청크 분할
- Pretained 모델을 통한 임베딩 생성
- 문서 기반 검색 및 GPT를 통한 답변 생성
- 사용자 세션별 대화 저장
- 프로젝트/문서 단위 RAG 답변 제한 기능

---

## 📁 폴더 구조

```bash
.
├── db/migrations/      # DB 마이그레이션
├── docker/
│   ├── chroma          # Vector DB docker-compose
│   └── mysql           # RDB docker-compose
├── src/
│   ├── conversation/
│   └── document/
│                  ├── application/    # 비즈니스 로직이 담긴 유스케이스
│                  ├── domain/         # 도메인 로직 및 모델
│                  ├── infrastructure/ # 외부 서비스 및 도메인 레포지토리의 구현체
│                  └── interface/      # 접근 가능한 인터페이스 (http, graphql ...)
├── shared/
│   └── embeddings/     # 벡터 생성기 (BGE-M3)
│   └── llm/            # LLM (openai)
│   └── prompts/        # LLM에게 입력될 프롬프트 템플릿
│
└── main.ts
```

---

## 🗺️ 향후 계획

- [ ] **PDF 등 TXT, MD외 파일 문서화 지원**
- [ ] **파일 업로드 → 자동 문서화 파이프라인**
- [ ] **프롬프트 커스터마이징 (질문 톤, 스타일 등)**
- [ ] **RAG 검색 결과 하이라이트 및 인용 표시**
- [ ] **외부 웹페이지 / 블로그 자동|수동 크롤링 기능**
- [ ] **메타데이터 구조화**

## 👤 만든 이

**김광권 (Kwangkwon Kim)**  
- GitHub: [@KKK](https://github.com/KIMKWANGKWON)
- Email: rlarhkdrnjs02@gmail.com


