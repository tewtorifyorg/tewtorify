import { Link } from 'react-router-dom';
import { GraduationCap, Heart, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary text-white">
                <GraduationCap className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold tracking-tight">Tewtorify</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A community-driven, donation-funded platform connecting verified tutors 
              with students in Pabna, Bangladesh. 100% free for everyone.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Platform</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/browse-ads', label: 'Tuition Ads' },
                { to: '/signup', label: 'Become a Tutor' },
                { to: '/signup', label: 'Find a Tutor' },
                { to: '/donate', label: 'Donate' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/#how-it-works', label: 'How It Works' },
                { to: '/#faq', label: 'FAQ' },
                { to: '/donate', label: 'Donor Wall' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Contact</h3>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
                Pabna, Bangladesh
              </li>
              <li>
                <a
                  href="mailto:hello@tewtorify.com"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  hello@tewtorify.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+8801XXXXXXXXX"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  +880 1XXX-XXXXXX
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {currentYear} Tewtorify. 100% free, donation-funded.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Built with <Heart className="h-3 w-3 text-destructive fill-destructive" /> for Pabna
          </p>
        </div>
      </div>
    </footer>
  );
}
