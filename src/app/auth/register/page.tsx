import { Metadata } from 'next';
import { RegisterForm } from '@/components/auth/register-form';

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create your LearnHub account and start learning today.',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-purple-500/5 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold mb-2">Get started</h1>
          <p className="text-muted-foreground">Create your account for free</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
