import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

export const LanguageSwitcher = () => {
  const router = useRouter();
  const { t } = useTranslation('common');

  const switchToLanguage = (locale: string) => {
    const { pathname, asPath, query } = router;
    // Change locale while keeping the current page
    router.push({ pathname, query }, asPath, { locale });
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => switchToLanguage('ru')}
        className={`px-2 py-1 rounded text-sm ${
          router.locale === 'ru'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        РУ
      </button>
      <button
        onClick={() => switchToLanguage('en')}
        className={`px-2 py-1 rounded text-sm ${
          router.locale === 'en'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        EN
      </button>
    </div>
  );
};
