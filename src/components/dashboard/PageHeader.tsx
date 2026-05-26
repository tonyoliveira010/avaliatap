interface PageHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}

export function PageHeader({ title, subtitle, right }: PageHeaderProps) {
  return (
    <header className="px-5 pt-7 pb-4 flex items-end justify-between gap-3">
      <div>
        <h1 className="text-[26px] font-semibold tracking-tight text-foreground leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-[13px] text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {right}
    </header>
  );
}
