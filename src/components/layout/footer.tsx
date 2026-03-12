import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-primary-foreground" />
              </div>
              LearnHub
            </Link>
            <p className="text-muted-foreground text-sm">
              Master modern web development with expert-led courses and tutorials.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/courses" className="hover:text-foreground transition-colors">Courses</Link></li>
              <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Account</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/auth/login" className="hover:text-foreground transition-colors">Sign In</Link></li>
              <li><Link href="/auth/register" className="hover:text-foreground transition-colors">Register</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2026 LearnHub. All rights reserved.</p>
          <p>Built with Next.js 14 & TypeScript</p>
        </div>
      </div>
    </footer>
  );
}
