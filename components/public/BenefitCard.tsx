type Props = {
  title: string;
  description: string;
  index: number;
};

export function BenefitCard({ title, description, index }: Props) {
  return (
    <div className="flex h-full min-h-0 min-w-0 flex-col rounded-[1.25rem] border border-stone-200/70 bg-white/90 p-6 shadow-[0_1px_2px_rgba(28,25,23,0.04)] backdrop-blur-sm transition duration-300 hover:border-stone-300/90 hover:shadow-[0_8px_24px_rgba(28,25,23,0.06)] dark:border-stone-800 dark:bg-stone-900/80 dark:hover:border-stone-700 sm:p-7">
      <span className="font-serif text-3xl font-light tabular-nums text-stone-300 dark:text-stone-600">
        {String(index + 1).padStart(2, "0")}
      </span>
      <h3 className="mt-4 font-serif text-lg font-medium text-stone-900 dark:text-stone-50">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-400">{description}</p>
    </div>
  );
}
