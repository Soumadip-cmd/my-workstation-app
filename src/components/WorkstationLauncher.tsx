"use client";  

import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Monitor, Command, Terminal } from 'lucide-react';

const WorkstationLauncher = () => {
  const [loading, setLoading] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const [error, setError] = useState(null);

  const osConfigs = {
    windows: {
      icon: <Monitor className="w-8 h-8" />,
      name: 'Windows',
      specs: [
        'NVIDIA GPU',
        'Windows 11 Pro',
        'Adobe Creative Suite',
        '16GB RAM',
        '100GB SSD'
      ],
      apps: [
        'Adobe Photoshop',
        'Adobe Premiere Pro',
        'Visual Studio',
        'Blender',
        'AutoCAD'
      ]
    },
    mac: {
      icon: <Command className="w-8 h-8" />,
      name: 'MacOS',
      specs: [
        'Mac1 Metal Instance',
        'MacOS Monterey',
        'Final Cut Pro',
        '16GB RAM',
        '200GB SSD'
      ],
      apps: [
        'Final Cut Pro',
        'Logic Pro X',
        'Xcode',
        'Sketch',
        'Motion'
      ]
    },
    linux: {
      icon: <Terminal className="w-8 h-8" />,
      name: 'Linux',
      specs: [
        'NVIDIA GPU',
        'Ubuntu 22.04',
        'Development Tools',
        '16GB RAM',
        '100GB SSD'
      ],
      apps: [
        'Blender',
        'GIMP',
        'VSCode',
        'Docker',
        'Unity'
      ]
    }
  };

  const launchWorkstation = async (osType) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/workstation/launch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ osType })
      });

      if (!response.ok) {
        throw new Error('Failed to launch workstation');
      }

      const data = await response.json();
      setActiveSession(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Cloud Workstations</h1>
          <p className="text-xl text-gray-400">
            Launch high-performance workstations in seconds
          </p>
        </div>

        {!activeSession ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(osConfigs).map(([key, os]) => (
              <Card key={key} className="bg-gray-800 border-gray-700">
                <CardHeader className="border-b border-gray-700">
                  <div className="flex items-center gap-4">
                    {os.icon}
                    <h2 className="text-2xl font-bold">{os.name}</h2>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Specifications</h3>
                    <ul className="space-y-2">
                      {os.specs.map((spec, index) => (
                        <li key={index} className="flex items-center text-gray-300">
                          <div className="w-4 h-4 mr-2 text-green-500">✓</div>
                          {spec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Pre-installed Apps</h3>
                    <ul className="space-y-2">
                      {os.apps.map((app, index) => (
                        <li key={index} className="text-gray-300">
                          • {app}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    onClick={() => launchWorkstation(key)}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {loading ? 'Launching...' : `Launch ${os.name} Workstation`}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Your Workstation is Ready</h2>
              <p className="text-gray-400">
                Connection details for your {activeSession.osType} workstation:
              </p>
            </div>

            <div className="bg-gray-900 rounded p-4 mb-6">
              <code className="text-green-500">
                {activeSession.connectionUrl}
              </code>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Session Details</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Instance ID: {activeSession.instanceId}</li>
                  <li>Region: {activeSession.region}</li>
                  <li>Status: {activeSession.status}</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Connection Instructions</h3>
                <ol className="space-y-2 text-gray-400">
                  <li>1. Download remote client</li>
                  <li>2. Copy connection URL</li>
                  <li>3. Connect using provided credentials</li>
                </ol>
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <Button
                onClick={() => window.location.href = activeSession.connectionUrl}
                className="bg-green-600 hover:bg-green-700"
              >
                Connect Now
              </Button>
              <Button
                onClick={() => setActiveSession(null)}
                variant="outline"
                className="border-gray-600 text-gray-400 hover:bg-gray-700"
              >
                Launch Another
              </Button>
            </div>
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mt-6">
            {error}
          </Alert>
        )}
      </div>
    </div>
  );
};

export default WorkstationLauncher;