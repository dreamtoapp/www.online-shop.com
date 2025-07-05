import { iconVariants } from '@/lib/utils';
import { Icon } from '@/components/icons/Icon';

interface SocailProps {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
}

const SocialMedia = ({ facebook, instagram, twitter, linkedin }: SocailProps) => (
  <div className='flex items-center justify-center gap-8'>
    {[
      { icon: <Icon name="Facebook" size="sm" className={iconVariants({ size: 'sm' })} />, link: facebook, label: 'Facebook' },
      { icon: <Icon name="Instagram" size="sm" className={iconVariants({ size: 'sm' })} />, link: instagram, label: 'Instagram' },
      { icon: <Icon name="Twitter" size="sm" className={iconVariants({ size: 'sm' })} />, link: twitter, label: 'Twitter' },
      { icon: <Icon name="Linkedin" size="sm" className={iconVariants({ size: 'sm' })} />, link: linkedin, label: 'LinkedIn' },
    ].map((social, index) => (
      // Only render the link if the link prop exists
      // Ensure the <a> tag and its props are INSIDE the conditional block
      social.link ? (
        <a
          key={index} // Key should be on the outermost element returned by map
          href={social.link}
          aria-label={social.label}
          className='text-muted-foreground transition-colors duration-300 hover:text-primary'
          target='_blank'
          rel='noopener noreferrer'
        >
          {social.icon}
        </a>
      ) : null // Return null if the link doesn't exist
    ))}
  </div>
);
export default SocialMedia;
