import React from 'react';
import { Link } from 'react-router-dom';

export interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  iconBgColor?: string; // Kept for backwards compatibility but ignored visually
  to?: string;
  onClick?: () => void;
  className?: string;
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  to,
  onClick,
  className = '',
}: FeatureCardProps) {
  const content = (
    <div
      className={`group flex items-start gap-5 rounded-[16px] bg-canvas p-6 border border-border-subtle shadow-[var(--shadow-soft)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)] hover:border-dark active:scale-98 active:shadow-sm ${className}`}
      onClick={onClick}
    >
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface border border-border-subtle"
      >
        <Icon className="h-6 w-6 text-dark" strokeWidth={1.5} />
      </div>
      <div className="flex flex-col gap-1.5 mt-0.5">
        <h3 className="text-h3 text-heading text-[18px]">{title}</h3>
        <p className="text-body text-muted leading-relaxed">{description}</p>
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="block w-full">
        {content}
      </Link>
    );
  }

  return <div className={onClick ? 'cursor-pointer w-full' : 'w-full'}>{content}</div>;
}
