"use client";

import { useState, useEffect } from "react";

interface Article {
  id: number;
  title: string;
  description: string;
  date: string;
  image?: string; // ✅ Add image field
}

export default function Blog() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch Articles from Redis
  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await fetch("/api/blog");
        const data = await response.json();

        if (data.articles && Array.isArray(data.articles)) {
          setArticles(data.articles);
        } else {
          setArticles([]);
        }
      } catch (error) {
        console.error("Error fetching blog articles:", error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, []);

  // ✅ Sort Articles (newest first)
  const sortedArticles = [...articles].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // ✅ Set Featured Post (Latest Article)
  const featuredPost = sortedArticles.length > 0
    ? {
        title: sortedArticles[0].title,
        description: sortedArticles[0].description,
        id: sortedArticles[0].id,
      }
    : {
        title: "Sin artículos aún",
        description: "Pronto se publicarán artículos aquí",
        id: "#",
      };

  // ✅ Filter Recent Posts (Exclude Featured)
  const recentPosts = sortedArticles.slice(1, 5);

  return (
    <div className="container mx-auto p-6">
      {loading ? (
        <p className="text-center text-gray-500">Cargando artículos...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured Post */}
          <div className="lg:col-span-2">
          <a href={`/blog/${featuredPost.id}`} className="block group">
  <h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition text-black">
    {featuredPost.title}
  </h2>
  {/* ✅ Add Image Below the Title */}
  {sortedArticles[0]?.image && (
    <img
      src={sortedArticles[0].image}
      alt={sortedArticles[0].title}
      className="w-full h-64 object-cover rounded-md mb-2"
    />
  )}
  <p className="text-gray-700">{featuredPost.description}</p>
</a>

          </div>

          {/* Recent Posts */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-black">Nuevos posts</h3>
            <ul className="space-y-4">
              {recentPosts.map((post) => (
                <li key={post.id}>
                  <a href={`/blog/${post.id}`} className="block group">
                    <p className="text-sm text-gray-500 mb-1">
                      {new Date(post.date).toLocaleDateString("es-MX", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <h4 className="text-lg font-medium group-hover:text-primary transition text-black">
                      {post.title}
                    </h4>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
