import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { sendContactForm } from './lib/api';

const App: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
    'bot-field': '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { scrollY } = useScroll();
  const yOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const yScale = useTransform(scrollY, [0, 300], [1, 0.95]);

  const projects = [
    {
      title: 'E-Commerce Dashboard',
      description: 'A full-stack admin dashboard with real-time analytics, inventory tracking, and order management. Built with React, Node.js, and PostgreSQL.',
    },
    {
      title: 'TaskFlow App',
      description: 'A productivity app for managing personal and team tasks with drag-and-drop interface, reminders, and collaboration features. Made with TypeScript and Firebase.',
    },
    {
      title: 'Landing Page Template',
      description: 'A responsive, high-converting landing page template for SaaS startups. Features smooth animations, A/B testing integration, and SEO optimization.',
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formState.name.trim()) newErrors.name = 'Name is required';
    if (!formState.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formState.message.trim()) newErrors.message = 'Message is required';
    if (formState['bot-field'].trim()) return { 'bot-field': 'Bot detected' }; // Honeypot
    return newErrors;
  };

  const showToast = (message: string) => {
    const toast = document.getElementById('toast');
    if (toast) {
      toast.textContent = message;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 4000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await sendContactForm(formState);
      setIsSuccess(true);
      setFormState({ name: '', email: '', message: '', 'bot-field': '' });
      showToast('Message sent successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      showToast(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="font-sans">
      {/* Hero Section */}
      <motion.section
        className="hero-section container"
        style={{ opacity: yOpacity, scale: yScale }}
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-display text-4xl sm:text-6xl font-bold mb-4">
            Alex Rivera
          </h1>
          <p className="text-xl sm:text-2xl text-dim max-width-prose">
            Full-Stack Developer & UI Designer
          </p>
        </motion.div>
      </motion.section>

      {/* About Section */}
      <section className="section container">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">About Me</h2>
          <p className="section-subtitle text-body max-width-prose">
            I'm a passionate developer who loves building clean, performant, and user-friendly web applications. With over 5 years of experience in full-stack development, I specialize in React, Node.js, and modern CSS practices. I believe in crafting digital experiences that are both beautiful and functional.
          </p>
        </motion.div>
      </section>

      {/* Projects Section */}
      <section className="section container">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, staggerChildren: 0.2 }}
        >
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-subtitle text-center max-width-prose mx-auto">
            A selection of recent work showcasing my skills in full-stack development and UI design.
          </p>
          <div className="project-grid mt-12">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                className="project-card hover-lift"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <h3>{project.title}</h3>
                <p>{project.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section className="section container">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Get In Touch</h2>
          <p className="section-subtitle text-center max-width-prose mx-auto">
            Have a project in mind or want to say hello? Fill out the form below and I'll get back to you as soon as possible.
          </p>
          <form className="contact-form" onSubmit={handleSubmit}>
            <input type="hidden" name="bot-field" value={formState['bot-field']} onChange={handleChange} />
            <div className="mb-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formState.name}
                onChange={handleChange}
                className={`w-full p-3 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'} focus-glow`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div className="mb-4">
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formState.email}
                onChange={handleChange}
                className={`w-full p-3 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'} focus-glow`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div className="mb-4">
              <textarea
                name="message"
                placeholder="Your Message"
                rows={5}
                value={formState.message}
                onChange={handleChange}
                className={`w-full p-3 border rounded ${errors.message ? 'border-red-500' : 'border-gray-300'} focus-glow`}
              />
              {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </motion.div>
      </section>
    </div>
  );
};

export default App;