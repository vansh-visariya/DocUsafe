import Link from "next/link";
import { FileText, Shield, Users, CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">DocuSafe</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-primary">
              Login
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
            >
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="flex flex-col justify-center text-center lg:text-left">
              <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Student Document Management{" "}
                <span className="text-primary">Made Simple</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0">
                DocuSafe is a secure and user-friendly document management system designed for
                educational institutions. Store, verify, and manage student documents with ease.
              </p>
              <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-primary/90"
                >
                  Get Started
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-8 py-3 text-base font-semibold transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  Sign In
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:gap-6">
              <div className="rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 dark:bg-gray-800">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 font-semibold text-lg">Secure Storage</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Your documents are encrypted and stored securely
                </p>
              </div>
              <div className="rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 dark:bg-gray-800">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 font-semibold text-lg">Easy Management</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Upload and organize documents effortlessly
                </p>
              </div>
              <div className="rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 dark:bg-gray-800">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 font-semibold text-lg">Quick Verification</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Fast document verification process
                </p>
              </div>
              <div className="rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 dark:bg-gray-800">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 font-semibold text-lg">Role-Based Access</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Separate interfaces for admins and students
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section className="mt-24 sm:mt-32">
          <div className="mx-auto max-w-7xl">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold">Why Choose DocuSafe?</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Everything you need for efficient document management
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
              <div className="text-center p-8 rounded-xl bg-white/50 dark:bg-gray-800/50 transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mt-6 text-xl font-semibold">Security First</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  Bank-level encryption and secure authentication to protect your sensitive documents
                </p>
              </div>

              <div className="text-center p-8 rounded-xl bg-white/50 dark:bg-gray-800/50 transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mt-6 text-xl font-semibold">Document Tracking</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  Real-time status updates and tracking for all your submitted documents
                </p>
              </div>

              <div className="text-center p-8 rounded-xl bg-white/50 dark:bg-gray-800/50 transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mt-6 text-xl font-semibold">User-Friendly</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  Intuitive interface designed for both administrators and students
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-32 border-t bg-white/50 py-8 dark:bg-gray-900/50">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 DocuSafe. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
