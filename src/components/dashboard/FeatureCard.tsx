interface FeatureCardProps {
  title: string;
  description: string;
  note?: string;
}

export function FeatureCard({ title, description, note }: FeatureCardProps) {
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
      <h4 className="font-medium text-black dark:text-white mb-2">{title}</h4>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      {note && (
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 italic">{note}</p>
      )}
    </div>
  );
}

