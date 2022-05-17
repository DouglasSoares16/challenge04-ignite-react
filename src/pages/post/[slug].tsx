import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { GetStaticPaths, GetStaticProps } from 'next';

import { RichText } from 'prismic-dom';
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
  console.log(post);
  return <h1>Page Post</h1>;
}

export const getStaticPaths = async () => {
  //   // const prismic = getPrismicClient({});
  //   // const posts = await prismic.getByType(TODO);

  //   // TODO
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps = async ({ params }) => {
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
          body: {
            text: item.body.map(content => content.text),
          },
        };
      }),
    },
  };

  return {
    props: {
      post,
    },
  };
};
