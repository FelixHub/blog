import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

import { POSTS } from './posts/posts-content';


// Define components before using them
const Layout = ({ children }) => (
  <div className="max-w-6xl mx-auto px-4 py-8">
    <header className="mb-12">
      <h1 className="text-3xl font-bold mb-4">
        <a 
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigateTo('/');
          }}
          className="hover:opacity-80"
        >
          a comfy markov blanket
        </a>
      </h1>
    </header>
    <div className="flex gap-12">
      <Sidebar />
      <main className="flex-1 prose lg:prose-lg">
        {children}
      </main>
    </div>
    <footer className="mt-16 pt-8 border-t border-gray-200 text-gray-600">
      <p>© {new Date().getFullYear()}</p>
    </footer>
  </div>
);

const Post = ({ post }) => (
  <article>
    <button
      onClick={() => navigateTo('/')}
      className="mb-4 text-blue-600 hover:underline"
    >
      ← Back to posts
    </button>
    <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
    <time className="text-gray-600 block mb-8">
      {new Date(post.date).toLocaleDateString()}
    </time>
    <div className="prose lg:prose-lg">
      <ReactMarkdown>
        {post.content}
      </ReactMarkdown>
    </div>
  </article>
);

const PostList = ({ posts }) => (
  <div className="space-y-12">
    {posts.map(post => (
      <article key={post.slug} className="mb-8">
        <h2 className="text-2xl font-bold mb-2">
          <a
            href={`/post/${post.slug}`}
            onClick={(e) => {
              e.preventDefault();
              navigateTo(`/post/${post.slug}`);
            }}
            className="hover:underline cursor-pointer"
          >
            {post.title}
          </a>
        </h2>
        <time className="text-gray-600">
          {new Date(post.date).toLocaleDateString()}
        </time>
        <div className="mt-4">
          <ReactMarkdown>
            {post.content.slice(0, 150) + '...'}
          </ReactMarkdown>
        </div>
        <a
          href={`/post/${post.slug}`}
          onClick={(e) => {
            e.preventDefault();
            navigateTo(`/post/${post.slug}`);
          }}
          className="text-blue-600 hover:underline mt-2 inline-block"
        >
          Read more →
        </a>
      </article>
    ))}
  </div>
);

const Sidebar = () => (
  <aside className="w-64 shrink-0">
    <div className="sticky top-8">
      <div className="mb-8">
        <img 
          src="/profile.png"
          alt="Profile" 
          className="rounded-full w-32 h-32 mb-4"
        />
        <h2 className="text-xl font-bold mb-2">Félix Hubert</h2>
        <p className="text-gray-600 mb-4">
        To write well you have to think clearly, and thinking clearly is hard.
        </p>
        <div className="flex space-x-3">
          <a href="https://twitter.com" className="text-blue-600 hover:underline">Twitter</a>
          <a href="https://www.instagram.com/" className="text-blue-600 hover:underline">Instagram</a>
        </div>
      </div>
    </div>
  </aside>
);

// Helper function for navigation
const navigateTo = (path) => {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
};

// Blog post utilities
const BlogPost = {
  async getAll() {
    return POSTS.sort((a, b) => new Date(b.date) - new Date(a.date));
  }
};

// Main App component
const App = () => {
  const [posts, setPosts] = useState([]);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      const allPosts = await BlogPost.getAll();
      setPosts(allPosts);
      setLoading(false);
    };

    loadPosts();
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const getPostFromPath = () => {
    const match = currentPath.match(/^\/post\/(.+)$/);
    if (match) {
      return posts.find(post => post.slug === match[1]);
    }
    return null;
  };

  const selectedPost = getPostFromPath();

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  return (
    <Layout>
      {selectedPost ? (
        <Post post={selectedPost} />
      ) : (
        <PostList posts={posts} />
      )}
    </Layout>
  );
};

export default App;