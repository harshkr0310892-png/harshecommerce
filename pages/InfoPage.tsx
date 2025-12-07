import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface InfoPageProps {
  type: 'privacy' | 'terms' | 'returns' | 'cookies';
}

export const InfoPage: React.FC<InfoPageProps> = ({ type }) => {
  const { siteContent, faqs } = useShop();
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  const getPageData = () => {
    switch (type) {
      case 'privacy':
        return { title: 'Privacy Policy', content: siteContent.privacyPolicy };
      case 'terms':
        return { title: 'Terms & Conditions', content: siteContent.termsConditions };
      case 'returns':
        return { title: 'Return Policy', content: siteContent.returnPolicy };
      case 'cookies':
        return { title: 'Cookie Policy', content: siteContent.cookiePolicy };
      default:
        return { title: 'Information', content: '' };
    }
  };

  const { title, content } = getPageData();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 py-12 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Content Card */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-sm border border-slate-100 dark:border-neutral-800 p-8 sm:p-12 mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-8 border-b border-slate-100 dark:border-neutral-800 pb-6">
            {title}
          </h1>
          <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
            {content || "No content available."}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <HelpCircle className="w-6 h-6 text-indigo-600 dark:text-gold-500" />
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {faqs.length > 0 ? (
              faqs.map(faq => (
                <div key={faq.id} className="bg-white dark:bg-neutral-900 rounded-2xl border border-slate-100 dark:border-neutral-800 overflow-hidden transition-all hover:shadow-md">
                  <button
                    onClick={() => setOpenFaqId(openFaqId === faq.id ? null : faq.id)}
                    className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                  >
                    <span className="font-semibold text-slate-800 dark:text-white">{faq.question}</span>
                    {openFaqId === faq.id ? (
                      <ChevronUp className="w-5 h-5 text-indigo-500 dark:text-gold-500 flex-shrink-0 ml-4" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0 ml-4" />
                    )}
                  </button>
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      openFaqId === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="p-5 pt-0 text-slate-600 dark:text-gray-400 text-sm border-t border-slate-50 dark:border-neutral-800">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500 dark:text-gray-400">No FAQs available at the moment.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
