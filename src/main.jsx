import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// Add global error handler for debugging
window.addEventListener('error', (e) => {
  console.error('=== GLOBAL ERROR ===');
  console.error('Global error caught:', e.error);
  console.error('Message:', e.message);
  console.error('Filename:', e.filename);
  console.error('Line:', e.lineno);
  console.error('Column:', e.colno);
  console.error('=== END GLOBAL ERROR ===');
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('=== UNHANDLED PROMISE REJECTION ===');
  console.error('Unhandled promise rejection:', e.reason);
  console.error('Promise:', e.promise);
  console.error('=== END UNHANDLED REJECTION ===');
});

// Add test function for debugging search
window.debugSearch = async (testCriteria = { dataType: 'weather', location: 'Global', maxPrice: '100' }) => {
  console.log('=== MANUAL SEARCH TEST ===');
  console.log('Testing search with criteria:', testCriteria);
  
  try {
    // Test API service directly
    const apiService = (await import('./services/apiService')).default;
    console.log('API Service loaded:', typeof apiService);
    console.log('dataRequest:', typeof apiService.dataRequest);
    console.log('search function:', typeof apiService.dataRequest.search);
    
    const backendCriteria = {
      data_type: testCriteria.dataType,
      location: testCriteria.location,
      max_price: parseFloat(testCriteria.maxPrice) || 100,
      min_reputation: 0
    };
    
    console.log('Calling API with:', backendCriteria);
    const result = await apiService.dataRequest.search(backendCriteria);
    console.log('Direct API call result:', result);
    return result;
  } catch (error) {
    console.error('Manual search test failed:', error);
    throw error;
  }
};

console.log('=== APPLICATION STARTUP ===');
console.log('React app starting up...');
console.log('Debug function available: window.debugSearch()');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)

console.log('=== APPLICATION STARTUP COMPLETE ===');
