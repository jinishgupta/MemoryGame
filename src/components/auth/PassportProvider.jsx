import React, { useState, useEffect } from 'react';
import { BedrockPassportProvider } from "@bedrock_org/passport";
// Import Firebase app for initialization consistency
import firebaseApp from '../../firebase/config';

// Use a global variable to track if WalletConnect has been initialized
let walletConnectInitialized = false;

// Suppress WalletConnect initialization warnings in console
const originalConsoleWarn = console.warn;
console.warn = function(msg, ...args) {
  if (typeof msg === 'string' && (
    msg.includes('WalletConnect Core is already initialized') ||
    msg.includes('Firebase') ||
    msg.includes('CONFIGURATION_NOT_FOUND') 
  )) {
    // Suppress these specific warnings
    return;
  }
  originalConsoleWarn(msg, ...args);
};

const PassportProvider = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    // Set ready state to true to prevent multiple initializations
    if (!isReady) {
      // Ensure Firebase is initialized
      console.log('Firebase app initialized:', !!firebaseApp);
      setIsReady(true);
    }
    
    return () => {
      // Cleanup if needed
    };
  }, []);
  
  // Handle errors gracefully
  const handleError = (error) => {
    console.log('Auth provider error handled:', error.message);
    // Don't propagate Firebase-related errors
    if (error.message.includes('Firebase') || 
        error.message.includes('CONFIGURATION_NOT_FOUND')) {
      return;
    }
  };
  
  return isReady ? (
    <BedrockPassportProvider
      baseUrl="https://api.bedrockpassport.com"
      authCallbackUrl="https://memory-game-swart-rho.vercel.app/auth/callback"
      tenantId="orange-mkfy4hja2n"
      redirectionState={{}}
      passportOptions={{
        autoConnect: !walletConnectInitialized, // Only auto-connect if not initialized before
        cacheProvider: true,
        onProviderInit: () => {
          walletConnectInitialized = true; // Mark as initialized
        },
        onError: handleError
      }}
    >
      {children}
    </BedrockPassportProvider>
  ) : (
    // Return a loading placeholder or null while preparing
    null
  );
};

// Use React.memo to prevent unnecessary re-renders
export default React.memo(PassportProvider); 