import { useRef } from "react";
import { Award, Users, Clock, Heart } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const timeline = [
  { year: "1985", event: "Company Founded", description: "Started as a small family-owned masonry business" },
  { year: "1995", event: "First Major Project", description: "Completed our first commercial development" },
  { year: "2005", event: "Expansion", description: "Opened second location and grew team to 50+" },
  { year: "2015", event: "Innovation Award", description: "Recognized for sustainable masonry practices" },
  { year: "2020", event: "Digital Transformation", description: "Launched 3D design consultation services" },
  { year: "2025", event: "Industry Leader", description: "Now serving 1000+ projects annually" },
];

const stats = [
  { icon: Award, value: "40+", label: "Years of Excellence" },
  { icon: Users, value: "100+", label: "Expert Craftsmen" },
  { icon: Clock, value: "5,000+", label: "Projects Completed" },
  { icon: Heart, value: "98%", label: "Customer Satisfaction" },
];

export function AboutPage() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Header Hero Entrance
    gsap.fromTo(".header-content", 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );
    gsap.fromTo(".hero-img", 
      { opacity: 0, scale: 0.95 }, 
      { opacity: 1, scale: 1, duration: 1, delay: 0.2, ease: "power3.out" }
    );

    // Stats Animations
    const statCards = gsap.utils.toArray(".stat-card");
    gsap.fromTo(statCards, 
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6, 
        stagger: 0.1, 
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".stats-container",
          start: "top 85%",
          toggleActions: "play reverse play reverse"
        }
      }
    );

    // Our Story Fade
    gsap.fromTo(".our-story", 
      { opacity: 0, y: 30 },
      { 
        opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
        scrollTrigger: {
          trigger: ".our-story",
          start: "top 80%",
          toggleActions: "play reverse play reverse"
        }
      }
    );

    // Timeline Title Fade
    gsap.fromTo(".timeline-title", 
      { opacity: 0, y: 20 },
      { 
        opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
        scrollTrigger: {
          trigger: ".timeline-title",
          start: "top 85%",
          toggleActions: "play reverse play reverse"
        }
      }
    );

    // Timeline Scrub Animation line
    gsap.fromTo(".timeline-line", 
      { scaleY: 0 }, 
      { 
        scaleY: 1, 
        ease: "none",
        transformOrigin: "top center",
        scrollTrigger: {
          trigger: ".timeline-container",
          start: "top 60%",
          end: "bottom 80%",
          scrub: 1,
        }
      }
    );

    // Timeline Items
    const timelineItems = gsap.utils.toArray(".timeline-item");
    timelineItems.forEach((item: any, i) => {
      const direction = i % 2 === 0 ? -50 : 50;
      gsap.fromTo(item, 
        { opacity: 0, x: direction, scale: 0.95 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.7,
          ease: "back.out(1)",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            end: "top 15%",
            toggleActions: "play reverse play reverse" // plays entering down, reverses leaving up, plays entering up, reverses leaving down
          }
        }
      );
    });

    // Values Fade
    gsap.fromTo(".our-values", 
      { opacity: 0, y: 30 },
      { 
        opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
        scrollTrigger: {
          trigger: ".our-values",
          start: "top 80%",
          toggleActions: "play reverse play reverse"
        }
      }
    );

  }, { scope: container });

  return (
    <div ref={container} className="pt-32 pb-24 px-6 bg-[var(--off-white)] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="header-content text-center mb-20 opacity-0 relative z-10">
          <h1 className="text-6xl mb-6">About Modern Masonry</h1>
          <p className="text-[var(--slate)] text-2xl max-w-3xl mx-auto">
            Building beautiful, lasting outdoor spaces since 1985
          </p>
        </div>

        {/* Hero Image */}
        <div className="hero-img relative h-96 rounded-3xl overflow-hidden mb-20 opacity-0 shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80"
            alt="Modern Masonry Team"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        {/* Stats */}
        <div className="stats-container grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="stat-card bg-white rounded-2xl p-8 text-center opacity-0 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] transition-all duration-300"
              >
                <Icon className="w-12 h-12 mx-auto mb-4 text-[var(--accent)]" />
                <div className="text-4xl mb-2 font-bold">{stat.value}</div>
                <div className="text-[var(--slate)] font-medium">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Our Story */}
        <div className="our-story bg-white rounded-3xl p-12 mb-20 opacity-0 shadow-sm border border-black/5">
          <h2 className="text-4xl mb-8 font-bold">Our Story</h2>
          <div className="prose prose-lg max-w-none text-[var(--slate)] space-y-6">
            <p>
              Founded in 1985, Modern Masonry began with a simple mission: to bring exceptional craftsmanship
              and premium materials to outdoor living spaces. What started as a small family-owned business
              has grown into one of the region's most trusted masonry contractors.
            </p>
            <p>
              Our commitment to quality and customer satisfaction has remained unchanged over four decades.
              We believe that every project, whether a modest patio or an elaborate outdoor living space,
              deserves the same attention to detail and expert craftsmanship.
            </p>
            <p>
              Today, we combine traditional masonry techniques with modern technology and sustainable
              practices. Our team of over 100 skilled craftsmen brings together centuries of combined
              experience, ensuring every project meets our exacting standards.
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="timeline-container mb-20">
          <h2 className="timeline-title text-4xl mb-16 text-center font-bold opacity-0">
            Our Journey
          </h2>

          <div className="relative">
            {/* Timeline Line Base */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-[var(--accent)]/10 hidden md:block" />
            
            {/* Timeline Active Scrubber */}
            <div className="timeline-line absolute left-1/2 top-0 bottom-0 w-1 bg-[var(--accent)] hidden md:block" />

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div
                  key={index}
                  className="timeline-item relative opacity-0"
                >
                  <div className={`md:flex items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                    <div className="md:w-1/2" />
                    
                    {/* Circle on line */}
                    <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-[var(--accent)] rounded-full hidden md:block shadow-[0_0_0_4px_white]" />
                    
                    <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                      <div className="bg-white rounded-2xl p-6 shadow-xl border border-black/5 hover:scale-[1.02] transition-transform duration-300">
                        <div className="text-[var(--accent)] text-xl mb-2 font-black tracking-tight">{item.year}</div>
                        <h3 className="text-2xl mb-2 font-bold">{item.event}</h3>
                        <p className="text-[var(--slate)] leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="our-values bg-[var(--charcoal)] rounded-3xl p-12 text-white text-center opacity-0 shadow-2xl">
          <h2 className="text-4xl mb-12 font-bold">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-2xl mb-4 font-semibold text-[var(--accent)]">Craftsmanship</h3>
              <p className="text-white/80 leading-relaxed">
                Every project receives meticulous attention to detail and expert execution
              </p>
            </div>
            <div>
              <h3 className="text-2xl mb-4 font-semibold text-[var(--accent)]">Integrity</h3>
              <p className="text-white/80 leading-relaxed">
                Honest communication, transparent pricing, and reliable service
              </p>
            </div>
            <div>
              <h3 className="text-2xl mb-4 font-semibold text-[var(--accent)]">Innovation</h3>
              <p className="text-white/80 leading-relaxed">
                Embracing new techniques and sustainable practices while honoring tradition
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
