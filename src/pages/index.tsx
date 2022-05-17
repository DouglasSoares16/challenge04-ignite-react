import { FiCalendar, FiUser } from 'react-icons/fi';
import Link from 'next/link';
import { GetStaticProps } from 'next';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { useState } from 'react';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [posts, setPosts] = useState<Post[]>(postsPagination.results);
  const [nextPage, setNextPage] = useState<string | null>(
    postsPagination.next_page
  );

  async function handleGetNextPage(): Promise<void> {
    const results = await fetch(`/api/next-posts?next_page=${nextPage}`);

    const data = await results.json();

    setNextPage(data.next_page);
    setPosts(data.results);
  }

  return (
    <main className={`${styles.container} ${commonStyles.containerWidth}`}>
      {posts.map(post => {
        return (
          <Link key={post.uid} href={`/post/${post.uid}`}>
            <a className={styles.post}>
              <strong>{post.data.title}</strong>
              <p>{post.data.subtitle}</p>
              <div className={styles.postInfo}>
                <div>
                  <FiCalendar fontSize={20} />
                  <span>{post.first_publication_date}</span>
                </div>

                <div>
                  <FiUser fontSize={20} />
                  <span>{post.data.author}</span>
                </div>
              </div>
            </a>
          </Link>
        );
      })}

      {nextPage && (
        <button onClick={handleGetNextPage} type="button">
          Carregar mais posts
        </button>
      )}
    </main>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const response = await prismic.getByType('publication', {
    fetch: [
      'publication.title',
      'publication.subtitle',
      'publication.author',
      'publication.content',
    ],
    pageSize: 1,
  });

  const posts = response.results.map((post): Post => {
    return {
      uid: post.uid,
      first_publication_date: format(
        new Date(post.first_publication_date),
        'dd LLL yyyy',
        {
          locale: ptBR,
        }
      ),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  const postsPagination = {
    next_page: response.next_page,
    results: posts,
  };

  return {
    props: {
      postsPagination,
    },
  };
};
