import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { NextApiRequest, NextApiResponse } from 'next';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

export default async function getNextPosts(
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> {
  const { next_page } = request.query;

  const result = await fetch(`${next_page}`);

  const data = await result.json();

  const posts = data.results.map((post): Post => {
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
    next_page: data.next_page,
    results: posts,
  };

  response.json(postsPagination);
}
