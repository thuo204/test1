'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BlogPostCard } from './blog-post-card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface FeaturedPostsProps {
  posts: any[];
}

export function FeaturedPosts({ posts }: FeaturedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="font-display text-4xl font-bold mb-2">Latest from the Blog</h2>
            <p className="text-muted-foreground">Insights, tutorials, and updates</p>
          </div>
          <Link href="/blog">
            <Button variant="outline">
              View all <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <BlogPostCard post={post} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
