'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

// CRS Mock Logic Calculator
const calculateScore = (answers: { age: string; education: string; language: string; experience: string }) => {
  let score = 0;
  if (answers.age === '18-29') score += 110;
  else if (answers.age === '30-39') score += 70;
  else if (answers.age === '40-44') score += 40;
  else if (answers.age === '45+') score += 0;

  if (answers.education === 'masters_phd') score += 135;
  else if (answers.education === 'bachelors') score += 120;
  else if (answers.education === 'high_school') score += 30;

  if (answers.language === 'excellent') score += 136;
  else if (answers.language === 'good') score += 90;
  else if (answers.language === 'basic') score += 40;

  if (answers.experience === '3_plus') score += 50;
  else if (answers.experience === '1_2') score += 25;
  else if (answers.experience === 'none') score += 0;

  return score;
};

export default function EligibilityTest() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    age: '', education: '', language: '', experience: ''
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
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardTitle className="text-3xl font-bold mb-2">What is your age?</CardTitle>
            <CardDescription className="mb-6 text-base">Age plays a major role in CRS scoring.</CardDescription>
            <div className="space-y-3">
              {['18-29', '30-39', '40-44', '45+'].map((val) => (
                <button 
                  key={val} 
                  onClick={() => handleSelect('age', val)} 
                  className={`w-full text-left p-4 border rounded-xl font-medium transition-all ${answers.age === val ? 'border-primary bg-primary/5 text-primary shadow-sm' : 'border-border hover:bg-secondary/50 text-foreground hover:border-primary/30'}`}
                >
                  {val === '18-29' ? '18 - 29 years old (Max Points)' : `${val} years old`}
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardTitle className="text-3xl font-bold mb-2">Highest level of education?</CardTitle>
            <CardDescription className="mb-6 text-base">Select your highest completed degree.</CardDescription>
            <div className="space-y-3">
              <button onClick={() => handleSelect('education', 'masters_phd')} className={`w-full text-left p-4 border rounded-xl font-medium transition-all ${answers.education === 'masters_phd' ? 'border-primary bg-primary/5 text-primary shadow-sm' : 'border-border hover:bg-secondary/50 text-foreground hover:border-primary/30'}`}>Master's or Ph.D.</button>
              <button onClick={() => handleSelect('education', 'bachelors')} className={`w-full text-left p-4 border rounded-xl font-medium transition-all ${answers.education === 'bachelors' ? 'border-primary bg-primary/5 text-primary shadow-sm' : 'border-border hover:bg-secondary/50 text-foreground hover:border-primary/30'}`}>Bachelor's Degree</button>
              <button onClick={() => handleSelect('education', 'high_school')} className={`w-full text-left p-4 border rounded-xl font-medium transition-all ${answers.education === 'high_school' ? 'border-primary bg-primary/5 text-primary shadow-sm' : 'border-border hover:bg-secondary/50 text-foreground hover:border-primary/30'}`}>High School Diploma</button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardTitle className="text-3xl font-bold mb-2">English Proficiency (IELTS)?</CardTitle>
            <CardDescription className="mb-6 text-base">Estimate your language test scores.</CardDescription>
            <div className="space-y-3">
              <button onClick={() => handleSelect('language', 'excellent')} className={`w-full text-left p-4 border rounded-xl font-medium transition-all ${answers.language === 'excellent' ? 'border-primary bg-primary/5 text-primary shadow-sm' : 'border-border hover:bg-secondary/50 text-foreground hover:border-primary/30'}`}>Excellent (CLB 9+)</button>
              <button onClick={() => handleSelect('language', 'good')} className={`w-full text-left p-4 border rounded-xl font-medium transition-all ${answers.language === 'good' ? 'border-primary bg-primary/5 text-primary shadow-sm' : 'border-border hover:bg-secondary/50 text-foreground hover:border-primary/30'}`}>Good (CLB 7-8)</button>
              <button onClick={() => handleSelect('language', 'basic')} className={`w-full text-left p-4 border rounded-xl font-medium transition-all ${answers.language === 'basic' ? 'border-primary bg-primary/5 text-primary shadow-sm' : 'border-border hover:bg-secondary/50 text-foreground hover:border-primary/30'}`}>Basic (CLB 4-6)</button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardTitle className="text-3xl font-bold mb-2">Skilled Work Experience?</CardTitle>
            <CardDescription className="mb-6 text-base">Years of full-time skilled work experience.</CardDescription>
            <div className="space-y-3">
              <button onClick={() => handleSelect('experience', '3_plus')} className={`w-full text-left p-4 border rounded-xl font-medium transition-all ${answers.experience === '3_plus' ? 'border-primary bg-primary/5 text-primary shadow-sm' : 'border-border hover:bg-secondary/50 text-foreground hover:border-primary/30'}`}>3 or more years</button>
              <button onClick={() => handleSelect('experience', '1_2')} className={`w-full text-left p-4 border rounded-xl font-medium transition-all ${answers.experience === '1_2' ? 'border-primary bg-primary/5 text-primary shadow-sm' : 'border-border hover:bg-secondary/50 text-foreground hover:border-primary/30'}`}>1 to 2 years</button>
              <button onClick={() => handleSelect('experience', 'none')} className={`w-full text-left p-4 border rounded-xl font-medium transition-all ${answers.experience === 'none' ? 'border-primary bg-primary/5 text-primary shadow-sm' : 'border-border hover:bg-secondary/50 text-foreground hover:border-primary/30'}`}>Less than 1 year</button>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="text-center animate-in zoom-in-95 duration-500">
            <div className="mx-auto w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <CardTitle className="text-3xl font-bold mb-2">Test Complete!</CardTitle>
            <CardDescription className="mb-8 text-base">We have calculated your exact CRS score based on the latest IRCC draw.</CardDescription>
            
            <Card className="p-6 mb-8 text-left bg-secondary/20 border-border/50">
                <h3 className="font-semibold mb-4">Unlock your results to get:</h3>
                <ul className="space-y-4 text-sm text-muted-foreground">
                    <li className="flex items-center gap-3">
                        <span className="bg-primary/10 text-primary p-1 rounded-full"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></span>
                        Your exact CRS Score vs current cutoff
                    </li>
                    <li className="flex items-center gap-3">
                        <span className="bg-primary/10 text-primary p-1 rounded-full"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></span>
                        Roadmap to boost your score by up to 50 points
                    </li>
                    <li className="flex items-center gap-3">
                        <span className="bg-primary/10 text-primary p-1 rounded-full"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></span>
                        PDF Document checklist for your profile
                    </li>
                </ul>
            </Card>
            <Button size="lg" className="w-full h-14 text-lg font-bold shadow-lg">
                Unlock Results for $19.00
            </Button>
            <p className="mt-4 text-xs text-muted-foreground">Secure payment processed by Stripe</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-xl w-full shadow-2xl border-border/40">
        {step < 5 && (
          <Progress value={(step / 4) * 100} className="h-1.5 rounded-none rounded-t-xl" />
        )}
        <CardContent className="p-8 sm:p-12">
          {step < 5 && <div className="text-sm font-bold text-primary uppercase tracking-wider mb-4">Step {step} of 4</div>}
          
          {renderStep()}

        </CardContent>
        {step < 5 && (
            <CardFooter className="px-8 sm:px-12 pb-8 sm:pb-12 pt-0 flex justify-end">
              <Button onClick={nextStep} size="lg" className="px-8 font-semibold shadow-md active:scale-95 transition-transform">
                Continue
              </Button>
            </CardFooter>
          )}
      </Card>
    </div>
  );
}