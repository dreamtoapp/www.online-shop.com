import { iconVariants } from '@/lib/utils';
import Link from '@/components/link';
import { Icon } from '@/components/icons/Icon';

const QuickLinks = () => {
  const links = [
    {
      name: 'المتجر',
      href: '/',
      icon: <Icon name="Store" size="xs" className={iconVariants({ size: 'xs', className: 'mr-2 inline-block' })} />,
    },
    {
      name: 'من نحن',
      href: '/about',
      icon: <Icon name="Users" size="xs" className={iconVariants({ size: 'xs', className: 'mr-2 inline-block' })} />,
    },
    {
      name: 'تواصل معنا',
      href: '/contact',
      icon: <Icon name="Phone" size="xs" className={iconVariants({ size: 'xs', className: 'mr-2 inline-block' })} />,
    },
  ];

  return (
    <div className='text-center sm:text-right'>
      <h3 className='mb-4 text-lg font-semibold'>روابط</h3>
      <ul className='space-y-2 text-sm'>
        {links.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className='flex items-center gap-2 transition-colors duration-300 hover:text-primary'
              aria-label={link.name}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuickLinks;
