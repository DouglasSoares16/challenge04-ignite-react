import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { GetStaticPaths, GetStaticProps } from 'next';
import { RichText } from 'prismic-dom';
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
  timeToRead: string;
}

export default function Post({ post, timeToRead }: PostProps): JSX.Element {
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
              <span>{post.first_publication_date}</span>
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
                <>
                  <p key={text}>{text}</p>
                  <br />
                </>
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
  const posts = await prismic.getByType('publication', {
    fetch: [
      'publication.title',
      'publication.subtitle',
      'publication.author',
      'publication.content',
    ],
    pageSize: 1,
  });

  return {
    paths: posts.results.map(post => ({ params: { slug: post.uid } })),
    fallback: 'blocking',
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
    first_publication_date: format(
      new Date(response.first_publication_date),
      'dd LLL yyyy',
      {
        locale: ptBR,
      }
    ),
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content.map(item => {
        return {
          heading: item.heading,
          body: item.body.map(element => ({ text: element.text })),
        };
      }),
    },
  };

  const timeToRead = `${Math.ceil(
    post.data.content.reduce((totalWords, { heading, body }) => {
      const headingWords = heading.split(' ').length;
      const bodyWords = RichText.asText(body).split(' ').length;
      return totalWords + headingWords + bodyWords;
    }, 0) / 200
  )} min`;

  return {
    props: {
      post,
      timeToRead,
    },
  };
};
