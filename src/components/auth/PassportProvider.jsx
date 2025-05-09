import React, { useState, useEffect } from 'react';
import { BedrockPassportProvider } from "@bedrock_org/passport";

// Use a global variable to track if WalletConnect has been initialized
let walletConnectInitialized = false;

// Suppress WalletConnect initialization warnings in console
const originalConsoleWarn = console.warn;
console.warn = function(msg, ...args) {
  if (typeof msg === 'string' && msg.includes('WalletConnect Core is already initialized')) {
    // Suppress this specific warning
    return;
  }
  originalConsoleWarn(msg, ...args);
};

const PassportProvider = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    // Set ready state to true to prevent multiple initializations
    if (!isReady) {
      setIsReady(true);
    }
    
    return () => {
      // Cleanup if needed
    };
  }, []);
  
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
        }
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