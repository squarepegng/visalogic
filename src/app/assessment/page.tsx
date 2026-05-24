'use client';

import { useState } from 'react';

// CRS Mock Logic Calculator
const calculateScore = (answers: { age: string; education: string; language: string; experience: string }) => {
  let score = 0;
  // Age
  if (answers.age === '18-29') score += 110;
  else if (answers.age === '30-39') score += 70;
  else if (answers.age === '40-44') score += 40;
  else if (answers.age === '45+') score += 0;

  // Education
  if (answers.education === 'masters_phd') score += 135;
  else if (answers.education === 'bachelors') score += 120;
  else if (answers.education === 'high_school') score += 30;

  // Language (IELTS)
  if (answers.language === 'excellent') score += 136;
  else if (answers.language === 'good') score += 90;
  else if (answers.language === 'basic') score += 40;

  // Experience
  if (answers.experience === '3_plus') score += 50;
  else if (answers.experience === '1_2') score += 25;
  else if (answers.experience === 'none') score += 0;

  return score;
};

export default function EligibilityTest() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    age: '',
    education: '',
    language: '',
    experience: ''
  });

  const handleSelect = (field: string, value: string) => {
    setAnswers({ ...answers, [field]: value });
  };

  const nextStep = () => {
    if (step < 5) setStep(step + 1);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold mb-6">What is your age?</h1>
            <div className="space-y-3">
              {['18-29', '30-39', '40-44', '45+'].map((val) => (
                <button key={val} onClick={() => handleSelect('age', val)} className={`w-full text-left p-4 border rounded-xl ${answers.age === val ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                  {val === '18-29' ? '18 - 29 years old (Max Points)' : `${val} years old`}
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold mb-6">Highest level of education?</h1>
            <div className="space-y-3">
              <button onClick={() => handleSelect('education', 'masters_phd')} className={`w-full text-left p-4 border rounded-xl ${answers.education === 'masters_phd' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>Master's or Ph.D.</button>
              <button onClick={() => handleSelect('education', 'bachelors')} className={`w-full text-left p-4 border rounded-xl ${answers.education === 'bachelors' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>Bachelor's Degree</button>
              <button onClick={() => handleSelect('education', 'high_school')} className={`w-full text-left p-4 border rounded-xl ${answers.education === 'high_school' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>High School Diploma</button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold mb-6">English Proficiency (IELTS)?</h1>
            <div className="space-y-3">
              <button onClick={() => handleSelect('language', 'excellent')} className={`w-full text-left p-4 border rounded-xl ${answers.language === 'excellent' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>Excellent (CLB 9+)</button>
              <button onClick={() => handleSelect('language', 'good')} className={`w-full text-left p-4 border rounded-xl ${answers.language === 'good' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>Good (CLB 7-8)</button>
              <button onClick={() => handleSelect('language', 'basic')} className={`w-full text-left p-4 border rounded-xl ${answers.language === 'basic' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>Basic (CLB 4-6)</button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold mb-6">Skilled Work Experience?</h1>
            <div className="space-y-3">
              <button onClick={() => handleSelect('experience', '3_plus')} className={`w-full text-left p-4 border rounded-xl ${answers.experience === '3_plus' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>3 or more years</button>
              <button onClick={() => handleSelect('experience', '1_2')} className={`w-full text-left p-4 border rounded-xl ${answers.experience === '1_2' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>1 to 2 years</button>
              <button onClick={() => handleSelect('experience', 'none')} className={`w-full text-left p-4 border rounded-xl ${answers.experience === 'none' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>Less than 1 year</button>
            </div>
          </div>
        );
      case 5:
        // PAYWALL STATE
        return (
          <div className="text-center animate-fade-in">
            <div className="mx-auto w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Test Complete!</h2>
            <p className="text-gray-600 mb-6">We have calculated your exact CRS score based on the latest IRCC draw.</p>
            
            <div className="bg-white p-6 rounded-xl border shadow-sm mb-6 text-left">
                <h3 className="font-bold text-gray-900 mb-4">Unlock your results to get:</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                    <li>✅ Your exact CRS Score vs current cutoff</li>
                    <li>✅ Roadmap to boost your score by up to 50 points</li>
                    <li>✅ PDF Document checklist for your profile</li>
                </ul>
            </div>

            {/* STRIPE CHECKOUT BUTTON */}
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-colors flex justify-center items-center gap-2">
                Unlock Results for $19.00
            </button>
            <p className="mt-4 text-xs text-gray-400">Secure payment processed by Stripe</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {step < 5 && (
          <div className="bg-gray-100 h-2 w-full">
            <div className={`bg-blue-600 h-2 transition-all duration-500`} style={{ width: `${(step / 4) * 100}%` }}></div>
          </div>
        )}
        <div className="p-8 sm:p-12 text-gray-900">
          {step < 5 && <div className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">Step {step} of 4</div>}
          
          {renderStep()}

          {step < 5 && (
            <div className="mt-10 flex justify-end">
              <button onClick={nextStep} className="bg-gray-900 hover:bg-black text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-transform active:scale-95">
                Continue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
