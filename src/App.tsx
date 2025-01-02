import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Service {
  id: string;
  name: string;
  status: 'healthy' | 'unhealthy' | 'unknown';
  lastChecked: string;
}

const App: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('/api/services');
        setServices(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
    const interval = setInterval(fetchServices, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold">PulseCheck Dashboard</h1>
            </div>
            <div className="divide-y divide-gray-200">
              {services.map((service) => (
                <div key={service.id} className="py-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">{service.name}</h2>
                    <p className="text-sm text-gray-500">Last checked: {service.lastChecked}</p>
                  </div>
                  <div>
                    {service.status === 'healthy' && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Healthy
                      </span>
                    )}
                    {service.status === 'unhealthy' && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Unhealthy
                      </span>
                    )}
                    {service.status === 'unknown' && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Unknown
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

