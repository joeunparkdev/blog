# blog

# 프로젝트 소개
- Node.js와 express를 활용한 로그인 기능이 없는 **내배캠 블로그 백엔드 서버**를 제작

# 기술 스택
1. **웹 프레임워크**: Node.js에서 가장 대표적인 웹 프레임워크인 **Express.js**를 사용합니다.
2. **패키지 매니저**: 빠른 설치 속도와 우수한 패키지 관리를 지원하는 **npm** 또는 **yarn** 패키지 매니저를 사용합니다.
3. **모듈 시스템**: 최신 JS 문법을 지원하는 **ES6** 모듈 시스템 또는 기본 **CommonJS** 모듈 시스템을 사용합니다.
4. **데이터베이스**: [**MongoDB Cloud**](https://www.mongodb.com/products/platform/cloud)에서 대여한 대표적인 NoSQL인 **MongoDB Atlas**을 사용합니다.
5. **ODM**: **MongoDB**의 데이터를 쉽게 읽고 쓰게 해주는 **[mongoose](https://mongoosejs.com/docs/guide.html) ODM**을 사용합니다.
6. **Thunder Client**: **HTTP 메서드 요청**을 시도합니다.
   
# 주요 기능
1. 전체 게시글 목록 조회 API
    - 제목, 작성자명, 작성 날짜를 조회하기
    - 작성 날짜 기준으로 내림차순 정렬하기
2. 게시글 작성 API
    - 제목, 작성자명, 비밀번호, 작성 내용을 입력하기
3. 게시글 조회 API
    - 제목, 작성자명, 작성 날짜, 작성 내용을 조회하기 
4. 게시글 수정 API
    - API를 호출할 때 입력된 비밀번호를 비교하여 동일할 때만 글이 수정되게 하기
5. 게시글 삭제 API
    - API를 호출할 때 입력된 비밀번호를 비교하여 동일할 때만 글이 삭제되게 하기
6. 전체 게시글 삭제 API
    - 모든 댓글 삭제하기
8. 댓글 목록 조회 API
    - 조회하는 게시글에 작성된 모든 댓글을 목록 형식으로 볼 수 있도록 하기
    - 작성 날짜 기준으로 내림차순 정렬하기
9. 댓글 작성 API
    - 댓글 내용을 비워둔 채 댓글 작성 API를 호출하면 "댓글 내용을 입력해주세요" 라는 메세지를 return하기
    - 댓글 내용을 입력하고 댓글 작성 API를 호출한 경우 작성한 댓글을 추가하기
10. 댓글 수정 API
    - 댓글 내용을 비워둔 채 댓글 수정 API를 호출하면 "댓글 내용을 입력해주세요" 라는 메세지를 return하기
    - 댓글 내용을 입력하고 댓글 수정 API를 호출한 경우 작성한 댓글을 수정하기
11. 댓글 삭제 API
    - 원하는 댓글을 삭제하기
12. 전체 댓글 삭제 API
    - 모든 댓글 삭제하기

# 질문 답변
1. 수정, 삭제 API에서 Resource를 구분하기 위해서 Request를 어떤 방식으로 사용하셨나요? (`param`, `query`, `body`)

게시물/댓글 수정 및 삭제 API를 구분하기 위해서 URL에서 postId/commentId를 사용하고 요청의 본문(body)에서 비밀번호(password)를 사용했다.
만약 게시물/댓글이 존재하지 않거나, body에 필요한정보가 안들어오거나, 비밀번호가 다르거나, 혹은 네트워크/코드에 문제가있을때 에러가 발생합니다.
예를들어, 게시물 수정 API는 postId를 URL의 파라미터(param)로 받아와서 특정 게시물을 식별하고 다음 요청의 본문(body)에는 수정할 내용을 담고 있다. 
이렇게 게시물 수정에 필요한 정보는 대부분 본문(body)에 있으므로 postId가 URL에 있습니다.
    
    
    router.put("/posts/:_postId", async (req, res) => {
    const postId = req.params._postId; // 게시물 ID
    const { user, password, title, content } = req.body; // 수정할 내용
    //...
    });
    
게시물 삭제 API는 postId를 URL의 파라미터로 받아와서 특정 게시물을 식별합하고 비밀번호(password)는 요청의 본문(body)에 있어서 게시물을 삭제할 때 필요한 정보로 본문(body)를 사용합니다.
    
   
    router.delete("/posts/:_postId", async (req, res) => {
    const postId = req.params._postId; // 게시물 ID
    const password = req.body.password; // 비밀번호
    // ...
    });

    
2. HTTP Method의 대표적인 4가지는 `GET`, `POST`, `PUT`, `DELETE` 가있는데 각각 어떤 상황에서 사용하셨나요?
Get은 게시물/댓글을 불러올때, Post는 새 게시물/댓글을 생성할때, Put은 수정 그리고 Delete는 삭제 할때 사용했습니다.

3. RESTful한 API를 설계했나요? 어떤 부분이 그런가요? 어떤 부분이 그렇지 않나요?
RESTful API 설계의 잘된 부분:
URI 경로 사용: 리소스를 나타내는 URI 경로가 사용되어, /posts, /comments와 같이 직관적이고 명확한 경로를 사용하고 있습니다.
URI 파라미터 사용: 리소스 식별을 위해 URI 경로의 파라미터를 사용하고 있습니다. 예를 들어, /posts/:_postId/comments와 같이 리소스 간의 관계를 표현하는 데 활용했다.
(/posts는 API의 주 경로이고 게시물 리소스를 의미하고, :_postId:는 URI 패라미터 및 변수 이며, 특정 게시물을 식별하기 위해 사용됩니다.)
HTTP 동사 활용: HTTP 메서드(GET, POST, PUT, DELETE)를 올바르게 사용하여 리소스를 읽기, 생성, 수정, 삭제하는 데 활용하고 있습니다.
오류 처리: 오류 응답에 대한 명확한 규칙과 메시지를 정의하고, 예상되는 오류 상황에 대한 적절한 HTTP 상태 코드를 사용하여 클라이언트에게 합리적인 오류 메시지를 반환하고있다.
보안: 비밀번호에 해쉬(hash)를 사용해 사용자 데이터 보호를 높였습니다.

4. 역할별로 Directory Structure를 분리하였을 경우 어떠한 이점이 있을까요?
모듈화와 가독성이 좋습니다. 예를들어 게시물, 댓글 관리는 각 모듈로 분리되어 코드의 모듈화와 유지보수에 좋고, 각 디렉터리내 연관된 파일이 같이있어 코드를 찾고 읽기 쉽습니다.
