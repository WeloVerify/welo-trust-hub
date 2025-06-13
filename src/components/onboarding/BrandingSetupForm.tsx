
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, X, Palette } from 'lucide-react';

interface BrandingSetupFormProps {
  onComplete: () => void;
}

const BrandingSetupForm = ({ onComplete }: BrandingSetupFormProps) => {
  const [formData, setFormData] = useState({
    logoFile: null as File | null,
    coverFile: null as File | null,
    primaryColor: '#3b82f6',
    displayText: ''
  });
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [coverPreview, setCoverPreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = (type: 'logo' | 'cover', file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (type === 'logo') {
        setLogoPreview(e.target?.result as string);
        setFormData(prev => ({ ...prev, logoFile: file }));
      } else {
        setCoverPreview(e.target?.result as string);
        setFormData(prev => ({ ...prev, coverFile: file }));
      }
    };
    reader.readAsDataURL(file);
  };

  const removeFile = (type: 'logo' | 'cover') => {
    if (type === 'logo') {
      setLogoPreview('');
      setFormData(prev => ({ ...prev, logoFile: null }));
    } else {
      setCoverPreview('');
      setFormData(prev => ({ ...prev, coverFile: null }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Branding setup data:', formData);
    
    setIsSubmitting(false);
    onComplete();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Branding Setup</CardTitle>
        <p className="text-gray-600">Customize how your Welo page will look</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo Upload */}
            <div>
              <Label>Company Logo</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  id="logoUpload"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload('logo', file);
                  }}
                  className="hidden"
                />
                {logoPreview ? (
                  <div className="relative">
                    <img src={logoPreview} alt="Logo preview" className="max-h-32 mx-auto" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile('logo')}
                      className="absolute top-0 right-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label htmlFor="logoUpload" className="cursor-pointer">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Upload your logo</p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                  </label>
                )}
              </div>
            </div>

            {/* Cover Image Upload */}
            <div>
              <Label>Cover Image</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  id="coverUpload"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload('cover', file);
                  }}
                  className="hidden"
                />
                {coverPreview ? (
                  <div className="relative">
                    <img src={coverPreview} alt="Cover preview" className="max-h-32 mx-auto" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile('cover')}
                      className="absolute top-0 right-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label htmlFor="coverUpload" className="cursor-pointer">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Upload cover image</p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Primary Color */}
          <div>
            <Label htmlFor="primaryColor">Primary Color (Optional)</Label>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <input
                  type="color"
                  id="primaryColor"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                  className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <Palette className="absolute top-2 left-2 h-6 w-6 text-white pointer-events-none" />
              </div>
              <Input
                type="text"
                value={formData.primaryColor}
                onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                placeholder="#3b82f6"
                className="flex-1"
              />
            </div>
          </div>

          {/* Display Text */}
          <div>
            <Label htmlFor="displayText">Display Text</Label>
            <Textarea
              id="displayText"
              value={formData.displayText}
              onChange={(e) => setFormData(prev => ({ ...prev, displayText: e.target.value }))}
              placeholder="Short text to display on your Welo page (optional)"
              rows={3}
              maxLength={200}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.displayText.length}/200 characters
            </p>
          </div>

          {/* Preview */}
          <div>
            <Label>Preview</Label>
            <Card className="p-6">
              <div className="text-center space-y-4">
                {logoPreview && (
                  <img src={logoPreview} alt="Logo" className="h-16 mx-auto" />
                )}
                <div 
                  className="h-32 rounded-lg flex items-center justify-center text-white"
                  style={{ backgroundColor: formData.primaryColor }}
                >
                  {coverPreview ? (
                    <img src={coverPreview} alt="Cover" className="h-full w-full object-cover rounded-lg" />
                  ) : (
                    <span>Cover Image Preview</span>
                  )}
                </div>
                {formData.displayText && (
                  <p className="text-gray-700">{formData.displayText}</p>
                )}
              </div>
            </Card>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Complete Setup'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BrandingSetupForm;
