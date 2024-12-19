export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
          {children}
        </div>
      </div>
    );
  }
  