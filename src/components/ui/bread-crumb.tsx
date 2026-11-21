import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Fragment } from 'react';

interface BreadcrumbItem {
  label: string;
  to?: string; // if omitted, it renders as the current crumb (non-clickable)
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label='Ruta de navegación' className='mb-2 flex shrink-0 flex-wrap items-center gap-x-1.5 gap-y-0.5 text-sm sm:mb-4'>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <Fragment key={index}>
            {item.to && !isLast ? (
              <Link
                to={item.to}
                className='text-text-secondary hover:text-foreground hover:underline'
              >
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'font-medium text-foreground' : 'text-text-secondary'}>
                {item.label}
              </span>
            )}
            {!isLast && <ChevronRight className='size-3.5 shrink-0 text-text-secondary' aria-hidden='true' />}
          </Fragment>
        );
      })}
    </nav>
  );
}
