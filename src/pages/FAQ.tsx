import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "Who is eligible to use NuVisa?",
    answer: "NuVisa is specifically designed for Indian citizens who are currently resident in the UK (holding a BRP, skilled worker visa, student visa, or ILR).",
  },
  {
    question: "How long does the process take?",
    answer: "Our internal review takes 24 hours. Embassy processing typically takes 10-15 days depending on the country. If you need an urgent appointment, we can usually secure one within 4-5 days.",
  },
  {
    question: "What happens if my visa is rejected?",
    answer: "With a 99.3% approval rate, rejections are incredibly rare. However, if your visa is rejected due to a documentation error on our part, we will process your resubmission completely free of charge.",
  },
  {
    question: "Which countries do you support?",
    answer: "We support applications for all 20 major Schengen area countries, including France, Germany, Italy, Spain, Switzerland, and the Netherlands.",
  },
  {
    question: "How does payment work?",
    answer: "We charge a flat fee of £200. This covers our entire service including AI review, human expert review, and appointment booking. Please note that embassy visa fees (typically €80) are paid separately at the embassy.",
  },
  {
    question: "What documents do I need?",
    answer: "The standard requirements include: valid Indian passport, UK BRP, recent bank statements, employment/student letter, and travel itinerary. Once you start the application, our portal will provide a dynamic, tailored checklist.",
  },
  {
    question: "Do you guarantee an appointment slot?",
    answer: "Yes. Our automated systems monitor embassy calendars 24/7. We guarantee we will find you an appointment slot.",
  }
];

export default function FAQ() {
  return (
    <div className="flex flex-col min-h-screen pt-16 bg-[#0d0d0d] text-white">
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop" 
            alt="FAQ background" 
            className="w-full h-full object-cover opacity-20 grayscale blur-sm scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-[#0d0d0d]"></div>
        </div>
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl relative z-10">
          <h1 className="font-heading text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter">Common Questions</h1>
          <p className="text-xl text-white/60 font-medium uppercase tracking-widest">
            Everything you need to know about your application.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-white/10 py-2">
                <AccordionTrigger className="text-left text-lg font-medium text-white hover:text-[#7c5cfc] transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-white/60 text-base leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}
