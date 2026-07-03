"use client";

import { Download, Mail } from "lucide-react";

export default function Hero() {
  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <section 
      id="home" 
      className="section-padding pt-32 bg-gradient-to-br from-background to-secondary"
      data-testid="section-hero"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Professional Headshot */}
          <div className="flex justify-center md:justify-end order-2 md:order-1">
            <div className="relative">
              <img 
                src="/alex-chan-headshot.png" 
                alt="Alex Chan - Professional Headshot" 
                className="rounded-2xl shadow-2xl w-full max-w-md h-auto object-cover"
                data-testid="img-headshot"
              />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent rounded-full opacity-20 blur-2xl"></div>
            </div>
          </div>
          
          {/* Right Column - Introduction */}
          <div className="order-1 md:order-2 text-center md:text-left">
            <h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4"
              data-testid="text-name"
            >
              Alex Chan
            </h1>
            <p 
              className="text-lg sm:text-xl text-muted-foreground mb-4 font-medium"
              data-testid="text-title"
            >
              Recent Business Graduate | Aspiring Marketing Strategist | Data-Driven Analyst
            </p>
            <p 
              className="text-base sm:text-lg text-muted-foreground mb-8 max-w-xl"
              data-testid="text-headline"
            >
              Recent Business Graduate from Lingnan University, passionate about leveraging data to drive marketing success.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a 
                href="/Alex_Chan_Resume.pdf" 
                download
                className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg"
                data-testid="button-resume"
              >
                <Download className="mr-2 h-4 w-4" />
                View My Resume
              </a>
              <button
                onClick={scrollToContact}
                className="inline-flex items-center justify-center px-8 py-3 bg-accent text-accent-foreground font-semibold rounded-lg hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg"
                data-testid="button-contact"
              >
                <Mail className="mr-2 h-4 w-4" />
                Contact Me
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
