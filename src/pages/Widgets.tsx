
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TrackingScript from '@/components/TrackingScript';
import BadgePreview from '@/components/BadgePreview';
import CompanyProtectedRoute from '@/components/CompanyProtectedRoute';
import { Palette, Code, Eye } from 'lucide-react';

const Widgets = () => {
  return (
    <CompanyProtectedRoute requireApproval={true}>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Widgets & Tracking</h1>
          <p className="text-gray-600 mt-1">Customize your badge and install tracking</p>
        </div>

        {/* Tracking Script Section */}
        <TrackingScript />

        {/* Badge Customization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Palette className="h-5 w-5" />
              <span>Badge Customization</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Badge Style</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                    <option>Modern</option>
                    <option>Classic</option>
                    <option>Minimal</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Color Theme</label>
                  <div className="flex space-x-2">
                    <div className="w-8 h-8 rounded bg-blue-500 border-2 border-blue-600 cursor-pointer"></div>
                    <div className="w-8 h-8 rounded bg-green-500 border cursor-pointer"></div>
                    <div className="w-8 h-8 rounded bg-purple-500 border cursor-pointer"></div>
                    <div className="w-8 h-8 rounded bg-gray-800 border cursor-pointer"></div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Badge Text</label>
                  <input 
                    type="text" 
                    defaultValue="Verified by Welo"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              <div className="flex items-center justify-center">
                <BadgePreview />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Integration Code */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Code className="h-5 w-5" />
              <span>Badge Integration</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 border rounded-lg p-4">
              <code className="text-sm text-gray-800">
                {`<!-- Add this where you want the badge to appear -->
<div id="welo-badge"></div>

<!-- The tracking script will automatically render the badge -->`}
              </code>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              The badge will automatically appear on pages where the tracking script is installed.
            </p>
          </CardContent>
        </Card>
      </div>
    </CompanyProtectedRoute>
  );
};

export default Widgets;
