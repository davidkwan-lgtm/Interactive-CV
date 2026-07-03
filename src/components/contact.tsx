"use client";

import { Mail, Linkedin, FileText, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactMessageSchema } from "@shared/schema";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

type ContactFormData = z.infer<typeof insertContactMessageSchema>;

export default function Contact() {
  const { toast } = useToast();
  
  const form = useForm<ContactFormData>({
    resolver: zodResolver(insertContactMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Message Sent!",
        description: data.message,
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    contactMutation.mutate(data);
  };

  return (
    <section 
      id="contact" 
      className="section-padding bg-gradient-to-br from-secondary to-background"
      data-testid="section-contact"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4"
            data-testid="text-contact-title"
          >
            Let's Connect
          </h2>
          <div className="w-24 h-1 bg-accent mx-auto rounded-full mb-6"></div>
          <p 
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            data-testid="text-contact-subtitle"
          >
            I am actively seeking full-time opportunities in marketing and business analysis and would love to connect.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          {/* Contact Information */}
          <div className="space-y-6">
            <div 
              className="bg-background rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
              data-testid="card-email"
            >
              <div className="flex items-start">
                <div className="w-12 h-12 bg-accent text-accent-foreground rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 
                    className="font-semibold text-foreground mb-1"
                    data-testid="text-email-label"
                  >
                    Email
                  </h3>
                  <a 
                    href="mailto:alex.chan.profile@email.com" 
                    className="text-accent hover:underline"
                    data-testid="link-email"
                  >
                    alex.chan.profile@email.com
                  </a>
                </div>
              </div>
            </div>
            
            <div 
              className="bg-background rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
              data-testid="card-linkedin"
            >
              <div className="flex items-start">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <Linkedin className="h-6 w-6" />
                </div>
                <div>
                  <h3 
                    className="font-semibold text-foreground mb-1"
                    data-testid="text-linkedin-label"
                  >
                    LinkedIn
                  </h3>
                  <a 
                    href="https://linkedin.com/in/alex-chan-lingnan" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-accent hover:underline"
                    data-testid="link-linkedin"
                  >
                    linkedin.com/in/alex-chan-lingnan
                  </a>
                </div>
              </div>
            </div>
            
            <div 
              className="bg-background rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
              data-testid="card-resume"
            >
              <div className="flex items-start">
                <div className="w-12 h-12 bg-accent text-accent-foreground rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h3 
                    className="font-semibold text-foreground mb-1"
                    data-testid="text-resume-label"
                  >
                    Resume
                  </h3>
                  <a 
                    href="/Alex_Chan_Resume.pdf" 
                    download
                    className="text-accent hover:underline"
                    data-testid="link-resume-download"
                  >
                    Download Resume (PDF)
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div 
            className="bg-background rounded-xl p-8 shadow-md"
            data-testid="card-contact-form"
          >
            <h3 
              className="text-xl font-bold text-foreground mb-6"
              data-testid="text-form-title"
            >
              Send a Message
            </h3>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel data-testid="label-name">Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your Name" 
                          {...field}
                          data-testid="input-name"
                        />
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
                      <FormLabel data-testid="label-email">Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email"
                          placeholder="your.email@example.com" 
                          {...field}
                          data-testid="input-email"
                        />
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
                      <FormLabel data-testid="label-message">Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          rows={4}
                          placeholder="Your message here..." 
                          className="resize-none"
                          {...field}
                          data-testid="textarea-message"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-accent text-accent-foreground font-semibold hover:bg-accent/90"
                  disabled={contactMutation.isPending}
                  data-testid="button-submit"
                >
                  {contactMutation.isPending ? (
                    <>Sending...</>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}
