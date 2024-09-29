// 파일시스템 모듈을 가져옵니다. 이를 통해 Node.js에서 파일시스템과 상호 작용할 수 있습니다.
import fs from 'fs'
// 경로 관련 유틸리티를 제공하는 모듈을 가져옵니다.
import path from 'path'
// Markdown 파일의 frontmatter를 파싱하는 라이브러리를 가져옵니다.
import matter from 'gray-matter'
import { remark } from 'remark';
import remarkHtml from 'remark-html';

// 현재 작업 디렉토리 (즉, 프로젝트 루트)에 있는 'posts' 디렉토리를 가리키는 경로를 생성합니다.
const postsDirectory = path.join(process.cwd(), 'posts')

// 현재 작업 디렉토리를 콘솔에 출력합니다.
console.log('process.cwd()', process.cwd());
// 'posts' 디렉토리 경로를 콘솔에 출력합니다.
console.log('postDirectory', postsDirectory);

// 모든 post 데이터를 가져오고, 날짜 순으로 정렬하는 함수를 정의합니다.
export function getSortedPostsData() {
    // 'posts' 디렉토리에 있는 모든 파일의 이름을 가져옵니다.
    const fileNames = fs.readdirSync(postsDirectory)
    // 각 파일을 파싱하여 필요한 데이터를 가져옵니다.
    const allPostsData = fileNames.map(fileName => {
        // 파일의 확장자를 제거하여 post의 ID를 생성합니다.
        const id = fileName.replace(/\.md$/, '')
        
        // post 파일의 전체 경로를 생성합니다.
        const fullPath = path.join(postsDirectory, fileName)
        // post 파일의 내용을 읽어옵니다.
        const fileContents = fs.readFileSync(fullPath, 'utf-8')

        // 파일 내용에서 frontmatter를 파싱합니다.
        const matterResult = matter(fileContents)

        // 각 post의 데이터를 객체로 반환합니다.
        return {
            id,
            // 각 post의 frontmatter에서 date와 title을 가져옵니다.
            ...(matterResult.data as { date: string; title: string })

        }
    })

    // 모든 post 데이터를 날짜 순으로 정렬합니다. (Sorting)
    return allPostsData.sort((a, b) => {
        if(a.date < b.date) {
            return 1
        } else {
            return -1
        }
    })
}

// 모든 게시물 ID를 가져오는 함수를 정의합니다.
export function getAllPostIds() {
    // 'posts' 디렉토리에 있는 모든 파일 이름을 가져옵니다.
    const fileNames = fs.readdirSync(postsDirectory);

    // 파일 이름 목록을 반복하며, 각 파일 이름에서 확장자를 제거한 후 반환합니다.
    // 이렇게 해서 모든 게시물 ID의 배열을 만듭니다.
    return fileNames.map(fileName => {
        return {
          params: {
            id: fileName.replace(/\.md$/, '')
          }
        }
    })
}

// 특정 ID의 게시물 데이터를 가져오는 비동기 함수를 정의합니다.
export async function getPostData(id: string) {
    // 게시물 파일의 전체 경로를 생성합니다.
    const fullPath = path.join(postsDirectory, `${id}.md`)

    // 게시물 파일의 내용을 가져옵니다.
    const fileContents = fs.readFileSync(fullPath, 'utf-8')

    // 파일 내용에서 front matter를 파싱합니다.
    const matterResult = matter(fileContents);

    // remark()와 remark-html 플러그인을 사용하여 Markdown 내용을 HTML로 변환합니다.
    const processedContent = await remark().use(remarkHtml).process(matterResult.content);

    // 변환된 HTML을 문자열로 변환합니다.
    const contentHtml = processedContent.toString();

    // id, 변환된 HTML, 그리고 front matter 데이터를 반환합니다.
    return {
        id,
        contentHtml,
        ...(matterResult.data as {date: string; title: string; })
    }
}