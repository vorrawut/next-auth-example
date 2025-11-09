interface ErrorStateProps {
  message: string;
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-lg text-red-600">{message}</div>
    </div>
  );
}

