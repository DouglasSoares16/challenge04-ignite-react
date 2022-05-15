import { FiCalendar, FiUser } from 'react-icons/fi';
import Link from 'next/link';

import { GetStaticProps } from 'next';

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

export default function Home(): JSX.Element {
  return (
    <main className={styles.container}>
      <Link href="#">
        <a className={styles.post}>
          <strong>Como utilizar Hooks</strong>
          <p>Pensando em sincronização em vez de ciclos de vida.</p>
          <div className={styles.postInfo}>
            <div>
              <FiCalendar fontSize={20} />
              <span>15 Mar 2022</span>
            </div>

            <div>
              <FiUser fontSize={20} />
              <span>Joseph Oliveira</span>
            </div>
          </div>
        </a>
      </Link>

      <Link href="#">
        <a className={styles.post}>
          <strong>Como utilizar Hooks</strong>
          <p>Pensando em sincronização em vez de ciclos de vida.</p>
          <div className={styles.postInfo}>
            <div>
              <FiCalendar fontSize={20} />
              <span>15 Mar 2022</span>
            </div>

            <div>
              <FiUser fontSize={20} />
              <span>Joseph Oliveira</span>
            </div>
          </div>
        </a>
      </Link>

      <Link href="#">
        <a className={styles.post}>
          <strong>Como utilizar Hooks</strong>
          <p>Pensando em sincronização em vez de ciclos de vida.</p>
          <div className={styles.postInfo}>
            <div>
              <FiCalendar fontSize={20} />
              <span>15 Mar 2022</span>
            </div>

            <div>
              <FiUser fontSize={20} />
              <span>Joseph Oliveira</span>
            </div>
          </div>
        </a>
      </Link>

      <Link href="#">
        <a className={styles.post}>
          <strong>Como utilizar Hooks</strong>
          <p>Pensando em sincronização em vez de ciclos de vida.</p>
          <div className={styles.postInfo}>
            <div>
              <FiCalendar fontSize={20} />
              <span>15 Mar 2022</span>
            </div>

            <div>
              <FiUser fontSize={20} />
              <span>Joseph Oliveira</span>
            </div>
          </div>
        </a>
      </Link>

      <button type="button">Carregar mais posts</button>
    </main>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient({});
//   // const postsResponse = await prismic.getByType(TODO);

//   // TODO
// };
