import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import React from 'react';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Carregando...</div>;
  }

  const timeToRead = `${Math.ceil(
    post.data.content.reduce((totalWords, { heading, body }) => {
      const headingWords = heading.split(' ').length;
      const bodyWords = RichText.asText(body).split(' ').length;
      return totalWords + headingWords + bodyWords;
    }, 0) / 200
  )} min`;

  return (
    <>
      <div className={styles.banner}>
        <img src={post.data.banner.url} alt="banner" />
      </div>

      <main
        className={`${commonStyles.containerWidth} ${styles.postContainer}`}
      >
        <div>
          <h1>{post.data.title}</h1>

          <div className={commonStyles.postInfo}>
            <div>
              <FiCalendar fontSize={20} />
              <span>
                {format(parseISO(post.first_publication_date), 'dd MMM yyyy', {
                  locale: ptBR,
                }).toString()}
              </span>
            </div>

            <div>
              <FiUser fontSize={20} />
              <span>{post.data.author}</span>
            </div>

            <div>
              <FiClock fontSize={20} />
              <span>{timeToRead}</span>
            </div>
          </div>
        </div>

        <div className={styles.postContent}>
          {post.data.content.map(({ heading, body }) => (
            <div key={`${heading}-${Math.random()}`}>
              <h2>{heading}</h2>
              {body.map(({ text }) => (
                <React.Fragment key={text}>
                  <p>{text}</p>
                  <br />
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('posts', {
    lang: 'pt-BR',
  });

  const paths = posts.results.map(post => {
    return {
      params: {
        slug: post.uid,
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient({});
  const response = await prismic.getByUID(
    'publication',
    String(params.slug),
    {}
  );

  const post: Post = {
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content,
    },
  };

  return {
    props: {
      post,
    },
  };
};
