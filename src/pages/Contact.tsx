import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  subject: z.string().min(5, "Subject is required"),
  message: z.string().min(10, "Message is required"),
});

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof contactSchema>) {
    console.log("Contact form submitted:", values);
    setSubmitted(true);
  }

  return (
    <div className="flex flex-col min-h-screen pt-16 bg-[#0d0d0d] text-white">
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1534536281715-e28d76689b4d?q=80&w=2070&auto=format&fit=crop" 
            alt="Contact background" 
            className="w-full h-full object-cover opacity-20 grayscale blur-sm scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-[#0d0d0d]"></div>
        </div>
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl relative z-10">
          <h1 className="font-heading text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter">Get in Touch</h1>
          <p className="text-xl text-white/60 font-medium uppercase tracking-widest">
            Expert support, just a message away.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            
            <div className="flex flex-col gap-8">
              <div>
                <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Contact Information</h3>
                <p className="text-white/50 mb-6 font-medium">
                  We aim to respond to all inquiries within 2 hours during business hours.
                </p>
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-[#7c5cfc]/10 p-3 rounded-xl border border-[#7c5cfc]/20">
                    <Mail className="h-6 w-6 text-[#7c5cfc]" />
                  </div>
                  <div>
                    <p className="font-bold text-white uppercase text-xs tracking-widest">Email</p>
                    <a href="mailto:support@nuvisa.co.uk" className="text-white/60 hover:text-white transition-colors">support@nuvisa.co.uk</a>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="h-6 w-6 text-[#7c5cfc]" />
                  <h4 className="font-black text-white text-lg uppercase tracking-tighter">Urgent Request?</h4>
                </div>
                <p className="text-white/50 text-sm font-medium">
                  If you need a visa appointment within the next 4-5 days, please write "URGENT" in your subject line. Our priority team will expedite your request.
                </p>
              </div>
            </div>

            <div className="bg-white/5 p-8 rounded-3xl shadow-sm border border-white/10">
              {submitted ? (
                <div className="flex flex-col items-center justify-center text-center h-full py-12">
                  <CheckCircle2 className="h-16 w-16 text-[#2db87e] mb-4" />
                  <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">Message Sent!</h3>
                  <p className="text-white/50">
                    Thank you for reaching out. A member of our team will get back to you shortly.
                  </p>
                  <Button variant="outline" className="mt-8 border-white/20 rounded-full hover:bg-white hover:text-black" onClick={() => setSubmitted(false)}>
                    Send another message
                  </Button>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="uppercase text-[10px] font-black tracking-widest text-white/40">Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" className="bg-white/5 border-white/10 h-12 rounded-xl focus:border-[#7c5cfc] transition-all" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="uppercase text-[10px] font-black tracking-widest text-white/40">Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" className="bg-white/5 border-white/10 h-12 rounded-xl focus:border-[#7c5cfc] transition-all" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="uppercase text-[10px] font-black tracking-widest text-white/40">Subject</FormLabel>
                          <FormControl>
                            <Input placeholder="How can we help?" className="bg-white/5 border-white/10 h-12 rounded-xl focus:border-[#7c5cfc] transition-all" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="uppercase text-[10px] font-black tracking-widest text-white/40">Message</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Type your message here..." className="bg-white/5 border-white/10 min-h-[120px] rounded-xl focus:border-[#7c5cfc] transition-all" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full bg-[#7c5cfc] hover:bg-[#6b4ae0] text-white h-14 rounded-full font-black uppercase tracking-widest shadow-lg shadow-[#7c5cfc]/20 transition-all active:scale-95" data-testid="btn-contact-submit">
                      Send Message
                    </Button>
                  </form>
                </Form>
              )}
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
