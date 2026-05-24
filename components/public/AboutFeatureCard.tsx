type AboutFeatureCardProps = Readonly<{
  title: string;
  description: string;
}>;

export function AboutFeatureCard({ title, description }: AboutFeatureCardProps) {
  return (
    <div className="min-w-0 rounded-[1.25rem] border border-stone-200/70 bg-white/90 p-6 shadow-[0_1px_2px_rgba(28,25,23,0.04)] dark:border-stone-800 dark:bg-stone-900/50 sm:p-7">
      <h3 className="font-serif text-lg font-medium tracking-tight text-stone-900 [overflow-wrap:anywhere] dark:text-stone-50">
        {title}
      </h3>
      <p className="mt-3 text-pretty text-sm leading-relaxed text-stone-600 [overflow-wrap:anywhere] dark:text-stone-400">
        {description}
      </p>
    </div>
  );
}
