import About from "@/components/about";
import Chatbot from "@/components/chatbot";
import Contact from "@/components/contact";
import EducationSkills from "@/components/education-skills";
import Experience from "@/components/experience";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Hero from "@/components/hero";

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
      <Chatbot />
    </div>
  );
}
