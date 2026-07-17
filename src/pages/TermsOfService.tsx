import React from 'react';
import { FileText } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-100 p-8 sm:p-12">
        <div className="flex items-center space-x-4 mb-8 border-b border-slate-100 pb-8">
          <div className="w-12 h-12 bg-slate-100 text-slate-800 rounded-full flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Terms of Service</h1>
            <p className="text-sm font-medium text-slate-500 mt-1">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="prose prose-slate max-w-none text-slate-600">
          <p className="font-medium text-slate-900 mb-6">Welcome to BizNxt. By accessing or using our platform, you agree to be bound by these terms of service.</p>
          
          <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>By registering for an account, accessing our website, or using our services, you confirm that you accept these Terms of Service and agree to comply with them. If you do not agree, you must not use our services.</p>

          <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">2. Description of Services</h2>
          <p>BizNxt provides a digital operating system for businesses, including project management, market intelligence, compliance tracking, and direct consultation with Business Success Managers (BSMs). We reserve the right to modify, suspend, or discontinue any part of the service at any time.</p>

          <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">3. User Responsibilities</h2>
          <p>You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate and complete information during registration and keep it updated. You must not use our platform for any illegal or unauthorized purpose.</p>

          <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">4. Intellectual Property</h2>
          <p>The platform, its original content, features, and functionality are owned by BizNxt and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws. Your uploaded business data remains your property.</p>

          <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">5. Payments and Fees</h2>
          <p>Certain services require payment. All fees are stated transparently upfront. You agree to pay all applicable fees in connection with your use of the services. We reserve the right to change our pricing structure with prior notice.</p>

          <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">6. Limitation of Liability</h2>
          <p>BizNxt shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service. Our maximum liability shall not exceed the amount paid by you for the specific service in question.</p>
        </div>
      </div>
    </div>
  );
}
