// pages/404.tsx
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MainLayout from '../components/layouts/MainLayout';

export default function Custom404() {
  const { t } = useTranslation('common');

  return (
    <MainLayout
      title='404 Page Not Found'
      description='404 Page Not Found'
    >
      <div style={{ textAlign: 'center', padding: '50px' }}>
      </div>
    </MainLayout>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'ru', ['common'])),
    },
  };
};