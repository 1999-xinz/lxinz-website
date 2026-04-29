import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '../layouts/root-layout'
import { AboutPage } from '../pages/about-page'
import { BlogPage } from '../pages/blog-page'
import { HomePage } from '../pages/home-page'
import { PostPage } from '../pages/post-page'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'blog',
        element: <BlogPage />,
      },
      {
        path: 'posts/:slug',
        element: <PostPage />,
      },
    ],
  },
])
