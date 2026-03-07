import React from 'react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ' }
];

const LanguageSelector = ({ className = '' }) => {
  const { i18n } = useTranslation();

  const handleChange = (e) => {
    const lng = e.target.value;
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className="text-lg">🌐</span>
      <select
        value={i18n.language}
        onChange={handleChange}
        className="bg-surface-100 dark:bg-surface-800 text-sm font-medium rounded-xl px-2.5 py-2 border-0 text-surface-700 dark:text-surface-200 cursor-pointer outline-none focus:ring-2 focus:ring-primary-500 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code} className="text-surface-900 bg-white dark:text-white dark:bg-surface-800">
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
