import { Briefcase, Trophy, CheckCircle } from "lucide-react";

export default function Experience() {
  const experiences = [
    {
      id: "internship",
      icon: Briefcase,
      iconBg: "bg-accent text-accent-foreground",
      title: "Digital Marketing Intern",
      company: "Prudential Hong Kong Limited",
      companyColor: "text-accent",
      period: "June 2024 - August 2024",
      achievements: [
        "Managed the social media content calendar for the 'PRUHealth' campaign, resulting in a 20% increase in follower engagement on Instagram and Facebook.",
        "Conducted competitive analysis on emerging InsurTech platforms, presenting a report whose findings were incorporated into the marketing team's Q4 strategic planning.",
        "Assisted in creating and A/B testing copy for an email marketing campaign to 50,000+ subscribers, contributing to a 25% open rate, which was 5% above the industry average.",
        "Utilized Google Analytics and SEMrush to track website traffic and paid ad performance, helping to compile weekly performance dashboards for management."
      ]
    },
    {
      id: "competition",
      icon: Trophy,
      iconBg: "bg-primary text-primary-foreground",
      title: "Team Captain",
      company: "KPMG x HKUST International Case Competition 2025",
      companyColor: "text-primary",
      period: "February 2025 - March 2025",
      achievements: [
        "Led a team of four to achieve the First Runner-up position among 50+ participating teams from universities across Asia.",
        "Developed a comprehensive and financially viable market entry strategy for a global electric vehicle (EV) brand targeting the Southeast Asian market.",
        "Personally responsible for financial modeling, market sizing, and risk assessment components of the proposal.",
        "Pitched our final strategy to a panel of KPMG senior partners and industry executives, receiving commendation for our in-depth analysis and innovative approach."
      ]
    }
  ];

  return (
    <section 
      id="experience" 
      className="section-padding bg-secondary"
      data-testid="section-experience"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4"
            data-testid="text-experience-title"
          >
            Experience
          </h2>
          <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
        </div>
        
        {/* Timeline Container */}
        <div className="space-y-12">
          {experiences.map((exp, index) => {
            const IconComponent = exp.icon;
            
            return (
              <div 
                key={exp.id}
                className="relative pl-16"
                data-testid={`experience-${exp.id}`}
              >
                {/* Timeline Icon */}
                <div className={`absolute left-0 top-0 w-10 h-10 ${exp.iconBg} rounded-full flex items-center justify-center shadow-md`}>
                  <IconComponent className="h-5 w-5" />
                </div>
                
                {/* Timeline Line */}
                {index < experiences.length - 1 && <div className="timeline-line"></div>}
                
                {/* Content */}
                <div className="bg-background rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
                    <div>
                      <h3 
                        className="text-xl sm:text-2xl font-bold text-foreground mb-1"
                        data-testid={`text-${exp.id}-title`}
                      >
                        {exp.title}
                      </h3>
                      <p 
                        className={`text-lg font-semibold ${exp.companyColor}`}
                        data-testid={`text-${exp.id}-company`}
                      >
                        {exp.company}
                      </p>
                    </div>
                    <span 
                      className="text-sm text-muted-foreground mt-2 sm:mt-0"
                      data-testid={`text-${exp.id}-period`}
                    >
                      {exp.period}
                    </span>
                  </div>
                  
                  <ul 
                    className="space-y-2 text-muted-foreground"
                    data-testid={`list-${exp.id}-achievements`}
                  >
                    {exp.achievements.map((achievement, achievementIndex) => (
                      <li 
                        key={achievementIndex}
                        className="flex items-start"
                        data-testid={`achievement-${exp.id}-${achievementIndex}`}
                      >
                        <CheckCircle className="text-accent mt-1 mr-3 flex-shrink-0 h-4 w-4" />
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
