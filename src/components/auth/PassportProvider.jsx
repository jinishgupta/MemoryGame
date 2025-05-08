import React from 'react';
import { BedrockPassportProvider } from "@bedrock_org/passport";

const PassportProvider = ({ children }) => {
  return (
    <BedrockPassportProvider
      baseUrl="https://api.bedrockpassport.com"
      authCallbackUrl="https://memory-game-swart-rho.vercel.app/auth/callback"
      tenantId="orange-mkfy4hja2n"
      redirectionState={{}}
      passportOptions={{
        autoConnect: true,
        cacheProvider: true
      }}
    >
      {children}
    </BedrockPassportProvider>
  );
};

export default PassportProvider; 