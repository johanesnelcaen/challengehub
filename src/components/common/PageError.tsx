import { ErrorBox } from "./ErrorBox"; // ✅ import ajouté

export function PageError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <ErrorBox message={message} onRetry={onRetry} />
    </div>
  );
}