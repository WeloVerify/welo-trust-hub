
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import CompanyVerificationForm from '@/components/onboarding/CompanyVerificationForm';
import BrandingSetupForm from '@/components/onboarding/BrandingSetupForm';
import { CheckCircle } from 'lucide-react';

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = [
    { id: 1, title: 'Company Verification', description: 'Provide your company details and legal documents' },
    { id: 2, title: 'Branding Setup', description: 'Customize your Welo page appearance' },
    { id: 3, title: 'Complete', description: 'Your application is under review' }
  ];

  const handleStepComplete = (stepId: number) => {
    setCompletedSteps(prev => [...prev, stepId]);
    if (stepId < 3) {
      setCurrentStep(stepId + 1);
    }
  };

  const progress = (completedSteps.length / 2) * 100;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Welo</h1>
          <p className="text-gray-600">Complete your onboarding to get your trust badge</p>
        </div>

        {/* Progress Bar */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-500">{completedSteps.length}/2 steps completed</span>
            </div>
            <Progress value={progress} className="mb-4" />
            
            <div className="flex justify-between">
              {steps.slice(0, -1).map((step) => (
                <div key={step.id} className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    completedSteps.includes(step.id) 
                      ? 'bg-green-100 text-green-800' 
                      : currentStep === step.id 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-500'
                  }`}>
                    {completedSteps.includes(step.id) ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-gray-900">{step.title}</p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        {currentStep === 1 && (
          <CompanyVerificationForm onComplete={() => handleStepComplete(1)} />
        )}
        
        {currentStep === 2 && (
          <BrandingSetupForm onComplete={() => handleStepComplete(2)} />
        )}
        
        {currentStep === 3 && (
          <Card>
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
              <p className="text-gray-600 mb-6">
                Your application is now under review. Our team will get back to you within 2-3 business days.
              </p>
              <Button onClick={() => window.location.href = '/'}>
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
