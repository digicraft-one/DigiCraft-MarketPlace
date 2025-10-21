"use client";

import { useState } from 'react';

export default function TestOGPage() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testOG = async () => {
    if (!url) return;
    
    setLoading(true);
    try {
      // Test with Facebook's debugger API
      const response = await fetch(`https://graph.facebook.com/v18.0/?scrape=true&id=${encodeURIComponent(url)}`);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Failed to fetch OG data' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Open Graph Image Tester</h1>
        
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Your Product URLs</h2>
          <div className="flex gap-4">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter product URL (e.g., https://marketplace.digicraft.one/products/college-management-software)"
              className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-teal-500"
            />
            <button
              onClick={testOG}
              disabled={loading || !url}
              className="px-6 py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-600 rounded-lg transition-colors"
            >
              {loading ? 'Testing...' : 'Test OG'}
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Open Graph Data:</h3>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-8 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Quick Test Links</h2>
          <div className="space-y-2">
            <button
              onClick={() => setUrl('https://marketplace.digicraft.one/products/college-management-software')}
              className="block w-full text-left px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              College Management Software
            </button>
            <button
              onClick={() => setUrl('https://marketplace.digicraft.one/products/agency-cms-modern-animated-template')}
              className="block w-full text-left px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              Agency CMS Template
            </button>
            <button
              onClick={() => setUrl('https://marketplace.digicraft.one/products/standard-ecommerce-application')}
              className="block w-full text-left px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              Standard E-commerce Application
            </button>
          </div>
        </div>

        <div className="mt-8 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Testing Tools</h2>
          <div className="space-y-2">
            <a
              href="https://developers.facebook.com/tools/debug/"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Facebook Debugger
            </a>
            <a
              href="https://cards-dev.twitter.com/validator"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2 bg-blue-400 hover:bg-blue-500 rounded-lg transition-colors"
            >
              Twitter Card Validator
            </a>
            <a
              href="https://www.linkedin.com/post-inspector/"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors"
            >
              LinkedIn Post Inspector
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
