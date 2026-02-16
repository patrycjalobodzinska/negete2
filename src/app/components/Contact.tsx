"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, User, Building, MessageSquare } from "lucide-react";
import Image from "next/image";
import { fetchContactSection, type ContactSection } from "@/sanity/contact";
import { languages, type Language } from "@/i18n/config";
import { usePathname } from "next/navigation";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FALLBACK: ContactSection = {
  heading: "Kontakt",
  subtitle: "Skontaktuj się z nami i zbudujmy coś razem",
  personName: "Bartłomiej Zachara",
  personRole: "Founder & Lead Engineer",
  personImage: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=800",
  email: "b.zachara@negete.pl",
  bio: "Z pasją projektuję i tworzę zaawansowane urządzenia elektroniczne. Specjalizuję się w kompleksowym rozwoju produktów - od koncepcji, przez projekt PCB, oprogramowanie embedded, aż po druk 3D obudów. Jeśli masz pomysł na innowacyjny produkt elektroniczny, chętnie pomogę Ci go zrealizować.",
  nameLabel: "Imię",
  companyLabel: "Nazwa firmy",
  messageLabel: "Opisz krótko jaki produkt chcesz z nami zbudować?",
  submitButton: "Wyślij wiadomość",
  successMessage: "Dziękujemy! Twoja wiadomość została wysłana. Skontaktujemy się z Tobą wkrótce.",
  errorMessage: "Wystąpił błąd. Spróbuj ponownie lub skontaktuj się bezpośrednio przez email.",
  requiredError: "To pole jest wymagane",
  invalidEmail: "Podaj prawidłowy adres email",
};

interface ContactProps {
  lang?: Language;
  initialData?: ContactSection | null;
  /** Na stronie /kontakt użyj H1 zamiast H2 */
  headingLevel?: "h1" | "h2";
}

export default function Contact({
  lang: langProp,
  initialData: initialDataProp,
  headingLevel = "h2",
}: ContactProps) {
  const pathname = usePathname();
  const [contactData, setContactData] = useState<ContactSection | null>(
    initialDataProp ?? null
  );
  const [formData, setFormData] = useState({
    firstName: "",
    companyName: "",
    email: "",
    productDescription: "",
  });
  const [fieldErrors, setFieldErrors] = useState<{
    firstName?: string;
    email?: string;
    productDescription?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const clearFieldError = (field: keyof typeof fieldErrors) => {
    setFieldErrors((p) => {
      const next = { ...p };
      delete next[field];
      return next;
    });
  };

  const getLang = (): Language => {
    if (langProp) return langProp;
    const segments = pathname?.split("/").filter(Boolean);
    if (segments.length > 0 && languages.includes(segments[0] as Language)) {
      return segments[0] as Language;
    }
    return "pl";
  };

  const lang = getLang();

  useEffect(() => {
    if (initialDataProp) return;
    fetchContactSection(lang)
      .then((data) => data && setContactData(data))
      .catch((err) => console.error("Błąd pobierania sekcji kontakt:", err));
  }, [lang, initialDataProp]);

  const data = contactData || FALLBACK;

  return (
    <section
      data-section="contact"
      className="relative py-24 px-6 bg-gradient-to-b from-transparent via-white/5 to-transparent"
      style={{
        borderTop: "1px solid rgba(0, 240, 255, 0.5)",
        boxShadow: "0 0 20px rgba(0, 240, 255, 0.15)",
      }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16">
          {headingLevel === "h1" ? (
            <h1 className="text-3xl sm:text-4xl font-medium text-white mb-4">
              {data.heading}
            </h1>
          ) : (
            <h2 className="text-3xl sm:text-4xl font-medium text-white mb-4">
              {data.heading}
            </h2>
          )}
          {data.subtitle && (
            <p className="text-gray-400 text-lg">{data.subtitle}</p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8">
            {data.personImage && (
              <div className="relative aspect-square max-w-md mx-auto lg:mx-0 rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_25px_rgba(59,130,246,0.15)]">
                <Image
                  src={data.personImage}
                  alt={data.personName}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {data.personName}
                  </h3>
                  {data.personRole && (
                    <p className="text-cyan-400 text-lg">{data.personRole}</p>
                  )}
                </div>
              </div>
            )}

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
              {data.email && (
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 rounded-lg bg-cyan-500/20 border border-cyan-400/30">
                    <Mail className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-1">Email</h4>
                    <a
                      href={`mailto:${data.email}`}
                      className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300">
                      {data.email}
                    </a>
                  </div>
                </div>
              )}
              {data.bio && (
                <div className={data.email ? "border-t border-white/10 pt-6" : ""}>
                  <p className="text-gray-300 leading-relaxed">{data.bio}</p>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}>
            <form
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitStatus("idle");
                const errors: typeof fieldErrors = {};
                if (!formData.firstName.trim()) {
                  errors.firstName = data.requiredError;
                }
                if (!formData.email.trim()) {
                  errors.email = data.requiredError;
                } else if (!EMAIL_REGEX.test(formData.email)) {
                  errors.email = data.invalidEmail;
                }
                if (!formData.productDescription.trim()) {
                  errors.productDescription = data.requiredError;
                }
                setFieldErrors(errors);
                if (Object.keys(errors).length > 0) return;
                setIsSubmitting(true);
                setTimeout(() => {
                  setIsSubmitting(false);
                  setSubmitStatus("success");
                  setFormData({ firstName: "", companyName: "", email: "", productDescription: "" });
                  setFieldErrors({});
                }, 1000);
              }}>
              <div>
                <label
                  htmlFor="firstName"
                  className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <User className="w-4 h-4" />
                  {data.nameLabel} <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={(e) => {
                    setFormData((p) => ({ ...p, firstName: e.target.value }));
                    clearFieldError("firstName");
                  }}
                  className={`w-full px-4 py-3 bg-black/30 border rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 ${
                    fieldErrors.firstName ? "border-red-400/50" : "border-white/10 focus:border-cyan-400/50"
                  }`}
                  placeholder="Jan"
                />
                {fieldErrors.firstName && (
                  <p className="mt-2 text-sm text-red-400">{fieldErrors.firstName}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="companyName"
                  className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <Building className="w-4 h-4" />
                  {data.companyLabel}
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData((p) => ({ ...p, companyName: e.target.value }))}
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                  placeholder="Twoja firma"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <Mail className="w-4 h-4" />
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData((p) => ({ ...p, email: e.target.value }));
                    clearFieldError("email");
                  }}
                  className={`w-full px-4 py-3 bg-black/30 border rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 ${
                    fieldErrors.email ? "border-red-400/50" : "border-white/10 focus:border-cyan-400/50"
                  }`}
                  placeholder="jan@example.com"
                />
                {fieldErrors.email && (
                  <p className="mt-2 text-sm text-red-400">{fieldErrors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="productDescription"
                  className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <MessageSquare className="w-4 h-4" />
                  {data.messageLabel} <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="productDescription"
                  name="productDescription"
                  value={formData.productDescription}
                  onChange={(e) => {
                    setFormData((p) => ({ ...p, productDescription: e.target.value }));
                    clearFieldError("productDescription");
                  }}
                  rows={6}
                  className={`w-full px-4 py-3 bg-black/30 border rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 resize-none ${
                    fieldErrors.productDescription ? "border-red-400/50" : "border-white/10 focus:border-cyan-400/50"
                  }`}
                  placeholder="Opisz swoją wizję produktu..."
                />
                {fieldErrors.productDescription && (
                  <p className="mt-2 text-sm text-red-400">{fieldErrors.productDescription}</p>
                )}
              </div>

              {submitStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-500/20 border border-green-400/50 rounded-lg text-green-400 text-sm">
                  {data.successMessage}
                </motion.div>
              )}

              {submitStatus === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-500/20 border border-red-400/50 rounded-lg text-red-400 text-sm">
                  {data.errorMessage}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-4 rounded-lg font-medium text-cyan-400 border border-cyan-500/50 bg-cyan-500/10 hover:bg-cyan-500/20 hover:border-cyan-400/70 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group">
                {isSubmitting ? (
                  lang === "pl" ? "Wysyłanie..." : "Sending..."
                ) : (
                  <>
                    {data.submitButton}
                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
