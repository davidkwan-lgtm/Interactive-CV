import Header from "@/components/header";
import Hero from "@/components/hero";
import About from "@/components/about";
import Experience from "@/components/experience";
import EducationSkills from "@/components/education-skills";
import Contact from "@/components/contact";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <About />
        <Experience />
        <EducationSkills />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
