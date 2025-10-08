import { GraduationCap, Languages, Code, Users, Award } from "lucide-react";

export default function EducationSkills() {
  const coursework = [
    "Digital Marketing Strategy",
    "Data Visualization",
    "Strategic Management", 
    "Consumer Behavior",
    "International Finance"
  ];

  const skillCategories = [
    {
      id: "languages",
      title: "Languages",
      icon: Languages,
      iconBg: "bg-primary text-primary-foreground",
      skills: ["English (Fluent)", "Cantonese (Native)", "Mandarin (Proficient)"]
    },
    {
      id: "technical",
      title: "Technical Skills", 
      icon: Code,
      iconBg: "bg-accent text-accent-foreground",
      skills: [
        "Microsoft Office Suite",
        "Advanced Excel",
        "Google Analytics (GA4)",
        "Tableau", 
        "Salesforce",
        "Canva",
        "Python"
      ]
    },
    {
      id: "soft",
      title: "Soft Skills",
      icon: Users,
      iconBg: "bg-primary text-primary-foreground", 
      skills: [
        "Strategic Planning",
        "Leadership",
        "Public Speaking",
        "Analytical Thinking",
        "Team Collaboration",
        "Adaptability"
      ]
    }
  ];

  return (
    <section 
      id="skills" 
      className="section-padding bg-background"
      data-testid="section-skills"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4"
            data-testid="text-skills-title"
          >
            Education & Skills
          </h2>
          <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left Column: Education */}
          <div 
            className="bg-secondary rounded-xl p-8 shadow-md"
            data-testid="card-education"
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-accent text-accent-foreground rounded-full flex items-center justify-center mr-4">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h3 
                className="text-2xl font-bold text-foreground"
                data-testid="text-education-title"
              >
                Education
              </h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 
                  className="text-xl font-bold text-foreground mb-1"
                  data-testid="text-university"
                >
                  Lingnan University
                </h4>
                <p 
                  className="text-muted-foreground"
                  data-testid="text-location"
                >
                  Hong Kong
                </p>
              </div>
              
              <div>
                <p 
                  className="font-semibold text-foreground"
                  data-testid="text-degree"
                >
                  Bachelor of Business Administration (Honours)
                </p>
                <p 
                  className="text-muted-foreground"
                  data-testid="text-major"
                >
                  Major in Marketing, Minor in Business Analytics
                </p>
              </div>
              
              <div>
                <p 
                  className="text-muted-foreground"
                  data-testid="text-dates"
                >
                  September 2021 - June 2025
                </p>
              </div>
              
              <div className="pt-4 border-t border-border">
                <p 
                  className="font-semibold text-foreground mb-2"
                  data-testid="text-academic-excellence"
                >
                  Academic Excellence
                </p>
                <p 
                  className="text-muted-foreground"
                  data-testid="text-gpa"
                >
                  GPA: 3.6 / 4.0
                </p>
                <div className="mt-3 space-y-1">
                  <p 
                    className="text-sm text-muted-foreground flex items-center"
                    data-testid="text-deans-list"
                  >
                    <Award className="text-accent mr-2 h-4 w-4" />
                    Dean's List (2023, 2024)
                  </p>
                  <p 
                    className="text-sm text-muted-foreground flex items-center"
                    data-testid="text-scholarship"
                  >
                    <Award className="text-accent mr-2 h-4 w-4" />
                    HSBC Hong Kong Scholarship for Business Students (2023)
                  </p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border">
                <p 
                  className="font-semibold text-foreground mb-2"
                  data-testid="text-coursework-title"
                >
                  Key Coursework
                </p>
                <div 
                  className="flex flex-wrap gap-2"
                  data-testid="list-coursework"
                >
                  {coursework.map((course, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-background text-foreground text-sm rounded-full border border-border"
                      data-testid={`course-${index}`}
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column: Skills */}
          <div className="space-y-8">
            {skillCategories.map((category) => {
              const IconComponent = category.icon;
              
              return (
                <div 
                  key={category.id}
                  className="bg-secondary rounded-xl p-8 shadow-md"
                  data-testid={`card-${category.id}-skills`}
                >
                  <div className="flex items-center mb-4">
                    <div className={`w-10 h-10 ${category.iconBg} rounded-full flex items-center justify-center mr-3`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <h3 
                      className="text-xl font-bold text-foreground"
                      data-testid={`text-${category.id}-title`}
                    >
                      {category.title}
                    </h3>
                  </div>
                  <div 
                    className="flex flex-wrap gap-2"
                    data-testid={`list-${category.id}-skills`}
                  >
                    {category.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="skill-tag px-4 py-2 bg-background text-foreground rounded-lg border border-border transition-all cursor-default hover:shadow-md"
                        data-testid={`skill-${category.id}-${index}`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
