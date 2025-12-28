import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-50/95 text-foreground border-t border-gray-200 dark:bg-background dark:text-foreground dark:border-foreground/10 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Logo & About */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img
                src="/logo-black.png"
                alt="TEDx ITech School Youth logo (white)"
                className="block dark:hidden h-9"
              />
              <img
                src="/logo-white.png"
                alt="TEDx ITech School Youth logo (black)"
                className="hidden dark:block h-9"
              />
            </div>
            <p className="text-foreground/70 dark:text-foreground/70 max-w-md leading-relaxed">
              TEDxITechSchoolYouth brings together young minds to share ideas
              worth spreading. TURING 2026 explores the intersection of
              artificial intelligence, logic, and human creativity.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider mb-6 text-primary">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-foreground/70 dark:text-foreground/70 hover:text-primary transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/tickets"
                  className="text-foreground/70 hover:text-primary transition-colors"
                >
                  Tickets
                </Link>
              </li>
              {/* <li>
                <Link
                  to="/sponsors"
                  className="text-background/70 hover:text-primary transition-colors"
                >
                  Sponsors
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider mb-6 text-primary">
              Contact
            </h4>
            <div className="space-y-4">
              <a
                href="mailto:tedxitech@gmail.com"
                className="flex items-center gap-3 text-foreground/70 dark:text-foreground/70 hover:text-primary transition-colors"
              >
                <Mail className="w-5 h-5" />
                tedxitech@gmail.com
              </a>
              <div className="flex gap-4 pt-2">
                <a
                  href="https://www.facebook.com/profile.php?id=61578381831367"
                  target="_blank"
                  className="w-10 h-10 rounded-lg bg-foreground/10 flex items-center justify-center hover:bg-primary hover:text-background transition-all duration-300"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://www.instagram.com/tedx.itech/"
                  target="_blank"
                  className="w-10 h-10 rounded-lg bg-foreground/10 flex items-center justify-center hover:bg-primary hover:text-background transition-all duration-300"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://www.linkedin.com/company/%E2%80%8Ftedxitech%E2%80%8F/"
                  target="_blank"
                  className="w-10 h-10 rounded-lg bg-foreground/10 flex items-center justify-center hover:bg-primary hover:text-background transition-all duration-300"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-background/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-foreground/50 dark:text-foreground/50 text-sm text-center md:text-left">
              © 2026 TEDxITechSchoolYouth. All rights reserved.
            </p>
            <p className="text-foreground/50 dark:text-foreground/50 text-xs text-center md:text-right max-w-xl">
              This independent TEDx event is operated under license from TED.
              TEDx, x = independently organized TED event.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
