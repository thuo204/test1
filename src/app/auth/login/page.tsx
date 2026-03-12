import { Metadata } from 'next';
import { LoginForm } from '@/components/auth/login-form';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your LearnHub account.',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-purple-500/5 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold mb-2">Welcome back</h1>
          <p className="text-muted-foreground">Sign in to continue learning</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
