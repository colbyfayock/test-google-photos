import Link from 'next/link';
import Container from '@/components/Container';

const Nav = () => {
  return (
    <nav>
      <Container className="grid grid-cols-2 py-16">
        <p className="flex align-center">
          <Link href="/" className="text-2xl font-bold text-slate-900 dark:text-white hover:text-slate-900 dark:hover:text-gray-100">
            My Photos
          </Link>
        </p>
      </Container>
    </nav>
  )
}

export default Nav;