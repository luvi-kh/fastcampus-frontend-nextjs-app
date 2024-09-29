// Next.js의 정적 생성 함수를 가져옵니다.
import { GetStaticPaths, GetStaticProps } from 'next'

// React를 import 합니다.
 import React from 'react'

// 게시물 데이터를 가져오는 함수를 import 합니다.
import { getAllPostIds, getSortedPostsData,  getPostData} from '../../lib/posts'

// Next.js의 Head 컴포넌트를 import 합니다. 이 컴포넌트를 사용하면 HTML 문서의 <head>를 조작할 수 있습니다.
import Head from 'next/head'

import postStyle from '../../styles/post.module.css'

// Post 컴포넌트를 정의합니다. 이 컴포넌트는 각 게시물 페이지의 레이아웃을 정의합니다.
const Post = ( { postData }: {
    postData: {
        title: string
        date: string
        contentHtml: string
    }
}) => {
    // 게시물의 데이터를 받아서 UI를 렌더링합니다.
    return (
        <div className={postStyle.container}>
            <Head>
                <title>{postData.title}</title>
            </Head>
            <article>
              <h1>{postData.title}</h1>             
              <div>
                  {postData.date}
              </div>
              <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }}/>
            </article>
        </div>
    )
}

// Post 컴포넌트를 default로 export 합니다.
export default Post

// Next.js의 getStaticPaths 함수를 정의합니다. 이 함수는 빌드 시에 호출되며, 동적 라우팅을 위한 경로 목록을 제공합니다.
export const getStaticPaths: GetStaticPaths = async () => {
    // 모든 게시물 ID를 가져옵니다.
    const paths = getAllPostIds();

    // 각 ID를 params 객체로 포함하는 경로 객체로 변환합니다.
    // const paths = postIds.map((post) => ({
    //     params: { id: post.id },
    // }));

    // 경로 목록을 반환합니다.
    return {
        paths,
        fallback : false
    }
}

// Next.js의 getStaticProps 함수를 정의합니다. 이 함수는 빌드 시에 각 경로에 대해 호출되며, 페이지에 필요한 데이터를 제공합니다.
export const getStaticProps: GetStaticProps = async ({params}) => {
    // context.params가 정의되어 있는지 확인합니다.
    if (!params || !params.id) {
        return {
            notFound: true, // 이 경우 404 페이지를 반환합니다.
        }
    }

    // 선택된 게시물의 데이터를 가져옵니다.
    const postData = await getPostData(params.id as string);

    // 게시물 데이터를 Post 컴포넌트에 prop으로 전달합니다.
    return {
        props: {
            postData,
        },
    };
};