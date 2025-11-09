interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-lg">{message}</div>
    </div>
  );
}

