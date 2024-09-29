// Next.js에서 페이지를 타입으로 정의하고 임포트합니다.
import type { GetStaticProps, NextPage } from "next";

// Next.js의 내장 Head 컴포넌트를 임포트합니다. 이를 사용하면 개별 페이지의 <head> 태그를 커스터마이즈 할 수 있습니다.
import Head from 'next/head'

// Next.js의 내장 Image 컴포넌트를 임포트합니다. 이를 사용하면 이미지를 최적화하거나 레이지 로딩(lazy loading)을 할 수 있습니다.
import Image from 'next/image'

// CSS 모듈을 임포트합니다. CSS 모듈은 각 클래스를 고유한 이름으로 컴파일하여, CSS 클래스가 전역 범위로 충돌하는 것을 방지합니다.
import homeStyles from '../styles/Home.module.css'
import { getSortedPostsData } from "../lib/posts";
import Link from "next/link";

// Home 컴포넌트를 정의합니다. 이 컴포넌트는 NextPage 타입을 가집니다, 이는 Next.js의 페이지 컴포넌트임을 나타냅니다.
const Home = ({allPostsData}:{

  allPostsData: {
    date: string
    title: string
    id:string
  }[]
}) => {
    return (
        <div className={homeStyles.container}>
            <Head>
                <title>H Kim</title>
            </Head>
            <section className={homeStyles.headingMd}>
              <p>[H Kim Introduction]</p>
              <p>
                (this is a website)
              </p>
            </section>
            <section className={`${homeStyles.headingMd} ${homeStyles.padding1px}`}>
              <h2 className={homeStyles.headingLg}>Blog</h2>
              <ul className={homeStyles.list}>
                {allPostsData.map(({id, title, date}) =>
                  <li className={homeStyles.listItem} key={id}>
                    <Link href={`/posts/${id}`}>
                      {title}
                    </Link>
                    <br />
                    <small className={homeStyles.lightText}>
                      {date}
                    </small>
                  </li>
                )}
              </ul>
            </section>
        </div>
    )
}
// Home 컴포넌트를 기본 내보내기로 설정합니다. 이를 통해 다른 파일에서 이 컴포넌트를 임포트할 수 있습니다.
export default Home

export const getStaticProps: GetStaticProps = async () => {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}