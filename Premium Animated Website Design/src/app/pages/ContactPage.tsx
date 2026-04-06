import { useState } from "react";
import { motion } from "motion/react";
import { MapPin, Phone, Mail, Clock, Check } from "lucide-react";
import { FloatingLabelInput } from "../components/FloatingLabelInput";

const contactInfo = [
  {
    icon: MapPin,
    title: "Visit Our Showroom",
    content: "123 Masonry Lane, Building City, ST 12345",
  },
  {
    icon: Phone,
    title: "Call Us",
    content: "(555) 123-4567",
  },
  {
    icon: Mail,
    title: "Email Us",
    content: "info@modernmasonry.com",
  },
  {
    icon: Clock,
    title: "Business Hours",
    content: "Mon-Fri: 8am-6pm\nSat: 9am-4pm\nSun: Closed",
  },
];

export function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 3000);
  };

  return (
    <div className="pt-32 pb-24 px-6 bg-[var(--off-white)] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-6xl mb-6">Get In Touch</h1>
          <p className="text-[var(--slate)] text-2xl">
            We're here to answer your questions and discuss your project
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-6">
            {contactInfo.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  className="bg-white rounded-2xl p-6 flex items-start gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 4 }}
                >
                  <div className="w-12 h-12 bg-[var(--accent)] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl mb-2">{item.title}</h3>
                    <p className="text-[var(--slate)] whitespace-pre-line">{item.content}</p>
                  </div>
                </motion.div>
              );
            })}

            {/* Map */}
            <motion.div
              className="bg-white rounded-2xl overflow-hidden h-80"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="w-full h-full bg-gradient-to-br from-[var(--beige)] to-[var(--sand)] flex items-center justify-center">
                <div className="text-center text-[var(--slate)]">
                  <MapPin className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-xl">Interactive Map</p>
                  <p className="text-sm mt-2">123 Masonry Lane, Building City</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div
            className="bg-white rounded-3xl p-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl mb-8">Send Us a Message</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FloatingLabelInput label="First Name" type="text" required />
                <FloatingLabelInput label="Last Name" type="text" required />
              </div>

              <FloatingLabelInput label="Email" type="email" required />
              <FloatingLabelInput label="Phone" type="tel" />
              <FloatingLabelInput label="Subject" type="text" required />
              <FloatingLabelInput label="Message" type="textarea" required />

              <motion.button
                type="submit"
                className="w-full py-4 bg-[var(--accent)] text-white rounded-full hover:shadow-lg transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {formSubmitted ? (
                  <motion.span
                    className="flex items-center justify-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Check className="w-5 h-5" />
                    Message Sent!
                  </motion.span>
                ) : (
                  "Send Message"
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
