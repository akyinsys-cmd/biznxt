import React from 'react';

export const EmptyFolderIllustration = ({ className = "w-48 h-48" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="200" rx="40" fill="#F8FAFC"/>
    <path d="M50 85C50 73.9543 58.9543 65 70 65H95.5858C98.238 65 100.781 66.0536 102.657 67.9289L112.343 77.6142C114.219 79.4896 116.762 80.5431 119.414 80.5431H130C141.046 80.5431 150 89.4975 150 100.543V135C150 146.046 141.046 155 130 155H70C58.9543 155 50 146.046 50 135V85Z" fill="#E2E8F0"/>
    <path d="M55 95C55 83.9543 63.9543 75 75 75H135C146.046 75 155 83.9543 155 95V135C155 146.046 146.046 155 135 155H75C63.9543 155 55 146.046 55 135V95Z" fill="#F1F5F9"/>
    <rect x="85" y="105" width="30" height="4" rx="2" fill="#CBD5E1"/>
    <rect x="85" y="117" width="20" height="4" rx="2" fill="#CBD5E1"/>
  </svg>
);

export const EmptySearchIllustration = ({ className = "w-48 h-48" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="200" rx="40" fill="#F8FAFC"/>
    <circle cx="90" cy="90" r="30" stroke="#E2E8F0" strokeWidth="12"/>
    <path d="M112 112L135 135" stroke="#E2E8F0" strokeWidth="12" strokeLinecap="round"/>
    <circle cx="120" cy="70" r="4" fill="#CBD5E1"/>
    <circle cx="70" cy="110" r="6" fill="#CBD5E1"/>
    <circle cx="65" cy="75" r="3" fill="#CBD5E1"/>
  </svg>
);

export const EmptyUsersIllustration = ({ className = "w-48 h-48" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="200" rx="40" fill="#F8FAFC"/>
    <circle cx="100" cy="80" r="24" fill="#E2E8F0"/>
    <path d="M50 140C50 123.431 63.4315 110 80 110H120C136.569 110 150 123.431 150 140V145C150 150.523 145.523 155 140 155H60C54.4772 155 50 150.523 50 145V140Z" fill="#F1F5F9"/>
    <path d="M60 140C60 128.954 68.9543 120 80 120H120C131.046 120 140 128.954 140 140V145H60V140Z" fill="#E2E8F0"/>
    <circle cx="60" cy="90" r="14" fill="#F1F5F9"/>
    <circle cx="140" cy="90" r="14" fill="#F1F5F9"/>
  </svg>
);
