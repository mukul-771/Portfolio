import { useState, type FormEvent } from 'react';
import { gsap } from 'gsap';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { contactApi } from '../../services/firebaseApi';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await contactApi.submit(formData);

      // Success animation
      const formElement = e.target as HTMLFormElement;
      gsap.to(formElement, {
        y: -10,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
        onComplete: () => {
          setFormData({
            name: '',
            email: '',
            subject: '',
            message: ''
          });

          setSubmitStatus('success');

          gsap.fromTo(
            formElement,
            { y: 10, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', delay: 0.3 }
          );
        }
      });

    } catch (error) {
      console.error('Error submitting form:', error);

      // Fallback to mailto if API fails
      const mailtoLink = `mailto:mukulmee771@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      )}`;

      // Try to open email client
      window.open(mailtoLink, '_blank');

      // Show success message for mailto fallback
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitStatus === 'success' && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex items-start shadow-sm">
          <CheckCircle className="text-green-500 mr-4 mt-0.5 flex-shrink-0" size={24} />
          <div>
            <h4 className="font-semibold text-green-800 text-lg">Message sent successfully!</h4>
            <p className="text-green-700 mt-2">
              Thank you for reaching out. Your email client should open with your message pre-filled.
              If it doesn't open automatically, please email me directly at{' '}
              <a href="mailto:mukulmee771@gmail.com" className="underline font-medium">
                mukulmee771@gmail.com
              </a>
            </p>
          </div>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start shadow-sm">
          <AlertCircle className="text-red-500 mr-4 mt-0.5 flex-shrink-0" size={24} />
          <div>
            <h4 className="font-semibold text-red-800 text-lg">Failed to send message</h4>
            <p className="text-red-700 mt-2">
              {errorMessage || 'There was an error sending your message. Please try again.'}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
            Your Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-5 py-4 rounded-xl border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 shadow-sm hover:shadow-md"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-5 py-4 rounded-xl border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 shadow-sm hover:shadow-md"
            placeholder="Enter your email address"
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
          Subject
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="w-full px-5 py-4 rounded-xl border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 shadow-sm hover:shadow-md"
          placeholder="What's this about?"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
          className="w-full px-5 py-4 rounded-xl border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 shadow-sm hover:shadow-md resize-none"
          placeholder="Tell me about your project or idea..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sending Message...
          </>
        ) : (
          <>
            <Send size={20} className="mr-3" />
            Send Message
          </>
        )}
      </button>
    </form>
  );
};

export default ContactForm;
