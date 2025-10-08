export default function About() {
  return (
    <section 
      id="about" 
      className="section-padding bg-background"
      data-testid="section-about"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4"
            data-testid="text-about-title"
          >
            About Me
          </h2>
          <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
        </div>
        
        <div 
          className="prose prose-lg max-w-none text-muted-foreground leading-relaxed space-y-4"
          data-testid="text-about-content"
        >
          <p>
            Hello! I'm Alex Chan, a motivated and detail-oriented recent graduate from Lingnan University's Business School with a Bachelor of Business Administration in Marketing and a minor in Business Analytics. My time at Lingnan University equipped me with a strong foundation in business strategy, market analysis, and quantitative reasoning.
          </p>
          <p>
            I am passionate about leveraging data to drive business growth and create impactful brand stories. Through a challenging internship at Prudential Hong Kong and leading my team to the finals of the KPMG x HKUST Case Competition, I have honed my skills in teamwork, strategic planning, and presenting complex ideas clearly.
          </p>
          <p>
            Through a challenging internship at Prudential Hong Kong Limited, I sharpened my digital marketing skills and contributed to a 20% increase in follower engagement on social media. I also led my team to the First Runner-up position in the prestigious KPMG x HKUST International Case Competition, where I developed a comprehensive market entry strategy for a global electric vehicle brand.
          </p>
          <p>
            I am eager to apply my academic knowledge and practical experience to a challenging entry-level role in a dynamic organization where I can make a meaningful impact while continuing to grow professionally.
          </p>
        </div>
      </div>
    </section>
  );
}
