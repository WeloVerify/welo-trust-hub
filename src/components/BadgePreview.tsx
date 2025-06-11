
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BadgeConfig {
  style: 'floating' | 'inline';
  color: 'light' | 'dark';
  size: 'small' | 'medium' | 'large';
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

const BadgePreview = () => {
  const [config, setConfig] = useState<BadgeConfig>({
    style: 'floating',
    color: 'light',
    size: 'medium',
    position: 'bottom-right'
  });
  const [copied, setCopied] = useState(false);

  const sizeClasses = {
    small: 'h-8 w-8 text-xs',
    medium: 'h-10 w-10 text-sm',
    large: 'h-12 w-12 text-base'
  };

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4'
  };

  const generateEmbedCode = () => {
    return `<script>
  (function() {
    var badge = document.createElement('div');
    badge.innerHTML = '<div class="welo-badge" style="position: fixed; ${positionClasses[config.position].replace(' ', ': 1rem; ').replace(' ', ': 1rem;')}; z-index: 9999;"><div style="background: ${config.color === 'light' ? '#ffffff' : '#1f2937'}; color: ${config.color === 'light' ? '#1f2937' : '#ffffff'}; padding: 8px 12px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-family: system-ui; font-size: ${config.size === 'small' ? '12px' : config.size === 'medium' ? '14px' : '16px'}; display: flex; align-items: center; gap: 6px;"><svg width="16" height="16" fill="currentColor"><path d="M8 0L10.5 5.5L16 8L10.5 10.5L8 16L5.5 10.5L0 8L5.5 5.5Z"/></svg>Verified by Welo</div></div>';
    document.body.appendChild(badge);
  })();
</script>`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateEmbedCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Configuration Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Badge Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Style */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Style</label>
              <div className="space-y-2">
                {['floating', 'inline'].map((style) => (
                  <label key={style} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="style"
                      value={style}
                      checked={config.style === style}
                      onChange={(e) => setConfig({...config, style: e.target.value as any})}
                      className="text-blue-600"
                    />
                    <span className="text-sm capitalize">{style}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Color */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Color</label>
              <div className="space-y-2">
                {['light', 'dark'].map((color) => (
                  <label key={color} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="color"
                      value={color}
                      checked={config.color === color}
                      onChange={(e) => setConfig({...config, color: e.target.value as any})}
                      className="text-blue-600"
                    />
                    <span className="text-sm capitalize">{color}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Size */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Size</label>
              <div className="space-y-2">
                {['small', 'medium', 'large'].map((size) => (
                  <label key={size} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="size"
                      value={size}
                      checked={config.size === size}
                      onChange={(e) => setConfig({...config, size: e.target.value as any})}
                      className="text-blue-600"
                    />
                    <span className="text-sm capitalize">{size}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Position (for floating only) */}
            {config.style === 'floating' && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Position</label>
                <div className="space-y-2">
                  {[
                    { value: 'bottom-right', label: 'Bottom Right' },
                    { value: 'bottom-left', label: 'Bottom Left' },
                    { value: 'top-right', label: 'Top Right' },
                    { value: 'top-left', label: 'Top Left' }
                  ].map((pos) => (
                    <label key={pos.value} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="position"
                        value={pos.value}
                        checked={config.position === pos.value}
                        onChange={(e) => setConfig({...config, position: e.target.value as any})}
                        className="text-blue-600"
                      />
                      <span className="text-xs">{pos.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Live Preview */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Desktop Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Desktop Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative bg-gray-50 rounded-xl p-4 h-64 border-2 border-gray-200">
              {/* Browser mockup */}
              <div className="absolute top-2 left-2 flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-red-400"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
              </div>
              
              {/* Badge */}
              {config.style === 'floating' ? (
                <div className={cn("absolute", positionClasses[config.position])}>
                  <div className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg shadow-lg transition-all",
                    config.color === 'light' 
                      ? "bg-white text-gray-800 border" 
                      : "bg-gray-800 text-white",
                    config.size === 'small' ? 'text-xs px-2 py-1' :
                    config.size === 'medium' ? 'text-sm px-3 py-2' :
                    'text-base px-4 py-3'
                  )}>
                    <Shield className={cn(
                      config.size === 'small' ? 'h-3 w-3' :
                      config.size === 'medium' ? 'h-4 w-4' :
                      'h-5 w-5',
                      "text-blue-600"
                    )} />
                    <span className="font-medium">Verified by Welo</span>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center items-center h-full">
                  <div className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-lg shadow-sm border",
                    config.color === 'light' 
                      ? "bg-white text-gray-800" 
                      : "bg-gray-800 text-white",
                    config.size === 'small' ? 'text-xs px-2 py-1' :
                    config.size === 'medium' ? 'text-sm px-3 py-2' :
                    'text-base px-4 py-3'
                  )}>
                    <Shield className={cn(
                      config.size === 'small' ? 'h-3 w-3' :
                      config.size === 'medium' ? 'h-4 w-4' :
                      'h-5 w-5',
                      "text-blue-600"
                    )} />
                    <span className="font-medium">Verified by Welo</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Mobile Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Mobile Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative bg-gray-50 rounded-2xl p-2 h-64 w-32 mx-auto border-4 border-gray-300">
              {/* Mobile mockup */}
              <div className="w-full h-full bg-white rounded-xl relative overflow-hidden">
                <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gray-300 rounded-full"></div>
                
                {/* Badge */}
                {config.style === 'floating' && (
                  <div className={cn("absolute", positionClasses[config.position].replace('4', '2'))}>
                    <div className={cn(
                      "flex items-center space-x-1 px-2 py-1 rounded-md shadow-lg",
                      config.color === 'light' 
                        ? "bg-white text-gray-800 border" 
                        : "bg-gray-800 text-white",
                      "text-xs"
                    )}>
                      <Shield className="h-3 w-3 text-blue-600" />
                      <span className="font-medium">Welo</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Embed Code */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Embed Code</span>
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="flex items-center space-x-2"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-50 p-4 rounded-xl text-sm overflow-x-auto border">
            <code className="text-gray-800">{generateEmbedCode()}</code>
          </pre>
        </CardContent>
      </Card>
    </div>
  );
};

export default BadgePreview;
