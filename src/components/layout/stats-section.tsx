'use client';

import { motion } from 'framer-motion';
import { Code, Users, BookOpen, Award } from 'lucide-react';

const stats = [
  { icon: Users, label: 'Active Learners', value: '10,000+', color: 'text-blue-500' },
  { icon: BookOpen, label: 'Premium Courses', value: '50+', color: 'text-green-500' },
  { icon: Code, label: 'Code Exercises', value: '1,000+', color: 'text-purple-500' },
  { icon: Award, label: 'Certificates Issued', value: '5,000+', color: 'text-orange-500' },
];

export function StatsSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-6 rounded-2xl bg-background border"
            >
              <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-3`} />
              <div className="font-display text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-muted-foreground text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
