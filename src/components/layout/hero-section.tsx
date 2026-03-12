'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-24 md:py-36">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 text-sm font-medium mb-8">
            <Sparkles className="h-4 w-4" />
            The future of learning is here
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Master Modern{' '}
            <span className="gradient-text">Web Development</span>
          </h1>

          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Premium courses and tutorials crafted by industry experts. Learn Next.js,
            TypeScript, React, and more — at your own pace.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/courses">
              <Button size="xl">
                Browse Courses
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="outline" size="xl">
                Start for Free
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
        >
          {[
            { label: 'Students', value: '10,000+' },
            { label: 'Courses', value: '50+' },
            { label: 'Hours of Content', value: '500+' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-3xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
