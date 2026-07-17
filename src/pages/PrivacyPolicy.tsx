import React from 'react';
import { Shield } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-100 p-8 sm:p-12">
        <div className="flex items-center space-x-4 mb-8 border-b border-slate-100 pb-8">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Privacy Policy</h1>
            <p className="text-sm font-medium text-slate-500 mt-1">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="prose prose-slate max-w-none text-slate-600">
          <p className="font-medium text-slate-900 mb-6">BizNxt values your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our platform.</p>
          
          <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">1. Information We Collect</h2>
          <p>We collect information you provide directly to us, such as when you create an account, update your profile, use the interactive features of our services, or communicate with us.</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Account information (name, email, phone number)</li>
            <li>Business details and documents you upload to our platform</li>
            <li>Communication history with our support and BSM teams</li>
          </ul>

          <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">2. How We Use Your Information</h2>
          <p>We use the information we collect to provide, maintain, and improve our services. Specifically, we use your information to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Process transactions and send related information</li>
            <li>Send technical notices, updates, and security alerts</li>
            <li>Respond to your comments, questions, and customer service requests</li>
            <li>Provide personalized project tracking and dashboard experiences</li>
          </ul>

          <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">3. Data Security</h2>
          <p>We implement appropriate technical and organizational measures to protect the personal data we process against accidental or unlawful destruction, loss, alteration, unauthorized disclosure, or access. We use industry-standard encryption for data at rest and in transit.</p>

          <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">4. Sharing of Information</h2>
          <p>We do not share your personal information with third parties except as described in this privacy policy or with your consent. We may share information with service providers who need access to such information to carry out work on our behalf.</p>

          <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">5. Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal data. You may also object to our processing of your personal data or ask us to restrict the processing of your personal data. To exercise these rights, please contact us at privacy@biznxt.online.</p>
        </div>
      </div>
    </div>
  );
}
