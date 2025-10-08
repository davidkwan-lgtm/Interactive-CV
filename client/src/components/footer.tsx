import { Mail, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer 
      className="bg-primary text-primary-foreground py-8"
      data-testid="footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p 
              className="font-semibold text-lg"
              data-testid="text-footer-name"
            >
              Alex Chan
            </p>
            <p 
              className="text-sm opacity-80"
              data-testid="text-footer-tagline"
            >
              Recent Business Graduate | Marketing Strategist
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end space-y-2">
            <a 
              href="mailto:alex.chan.profile@email.com" 
              className="text-sm hover:text-accent transition-colors opacity-80 hover:opacity-100 flex items-center"
              data-testid="link-footer-email"
            >
              <Mail className="mr-2 h-4 w-4" />
              alex.chan.profile@email.com
            </a>
            <a 
              href="https://linkedin.com/in/alex-chan-lingnan" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm hover:text-accent transition-colors opacity-80 hover:opacity-100 flex items-center"
              data-testid="link-footer-linkedin"
            >
              <Linkedin className="mr-2 h-4 w-4" />
              linkedin.com/in/alex-chan-lingnan
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-primary-foreground border-opacity-20 text-center">
          <p 
            className="text-sm opacity-60"
            data-testid="text-copyright"
          >
            &copy; 2025 Alex Chan. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
