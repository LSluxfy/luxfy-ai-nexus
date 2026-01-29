import LandingNavbar from '@/components/LandingNavbar';
import LandingFooter from '@/components/LandingFooter';
import WhatsAppButton from '@/components/WhatsAppButton';
import WhatsAppNotification from '@/components/landing/WhatsAppNotification';
import TermsGeral from '@/components/landing/TermsGeral';

export default function Terms() {  

  return (
    <div className="min-h-screen">
      <LandingNavbar />
      
      <TermsGeral />

      <div id="contact">
        <LandingFooter />
      </div>
      
      <WhatsAppButton />
      <WhatsAppNotification />
    </div>
  );
};
