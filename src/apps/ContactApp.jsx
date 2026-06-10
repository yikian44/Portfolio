import { Mail } from 'lucide-react';

const GithubIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const FacebookIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3.81l.39-4h-4.2V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const BlogIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

export default function ContactApp() {
  const contactLinks = [
    {
      id: 'email',
      label: 'Email',
      value: 'kianyigan@gmail.com',
      url: 'mailto:kianyigan@gmail.com',
      icon: Mail,
    },
    {
      id: 'facebook',
      label: 'Facebook',
      value: 'yk.gan.1',
      url: 'https://www.facebook.com/yk.gan.1',
      icon: FacebookIcon,
    },
    {
      id: 'instagram',
      label: 'Instagram',
      value: 'yi.kian',
      url: 'https://www.instagram.com/yi.kian/',
      icon: InstagramIcon,
    },
    {
      id: 'blog',
      label: 'Blogspot',
      value: 'gandesignblog',
      url: 'https://gandesignblog.blogspot.com/',
      icon: BlogIcon,
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      value: 'gan-yi-kian-6b1816365',
      url: 'https://www.linkedin.com/in/gan-yi-kian-6b1816365/',
      icon: LinkedinIcon,
    },
    {
      id: 'github',
      label: 'GitHub',
      value: 'github.com/yikian44',
      url: 'https://github.com/yikian44',
      icon: GithubIcon,
    },
  ];

  return (
    <div style={{ color: 'var(--text-color)' }}>
      <h2 style={{ fontSize: '28px', marginBottom: '20px', fontWeight: '600' }}>Let's Connect</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {contactLinks.map((link, index) => {
          const IconComp = link.icon;
          return (
            <a
              key={link.id}
              href={link.url}
              target={link.id !== 'email' ? '_blank' : undefined}
              rel={link.id !== 'email' ? 'noopener noreferrer' : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                padding: '12px 18px',
                borderRadius: '4px', // Sharp blueprint feel
                background: 'var(--block-bg)',
                border: '1px solid var(--block-border)',
                color: 'var(--text-color)',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--block-hover-bg)';
                e.currentTarget.style.borderColor = 'var(--blueprint-color)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--block-bg)';
                e.currentTarget.style.borderColor = 'var(--block-border)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '2px',
                background: 'var(--block-hover-bg)',
                color: 'var(--text-color)',
                border: '1px solid var(--block-border)',
              }}>
                <span style={{
                  position: 'absolute',
                  top: '2px',
                  right: '3px',
                  fontSize: '7px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--blueprint-color)',
                  opacity: 0.8,
                  fontWeight: '700',
                }}>0{index + 1}</span>
                <IconComp size={20} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{link.label}</span>
                <span style={{ fontSize: '14px', fontWeight: '500', fontFamily: 'var(--font-mono)' }}>{link.value}</span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
