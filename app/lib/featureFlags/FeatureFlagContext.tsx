'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getRemoteConfig, fetchAndActivate, getValue } from 'firebase/remote-config';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../firebase/config'; // adjust path as needed

interface FeatureFlags {
  enableProFeatures: boolean;
  enableEnterpriseFeatures: boolean;
  showReferralProgram: boolean;
  // add more flags as needed
}

const defaultFlags: FeatureFlags = {
  enableProFeatures: false,
  enableEnterpriseFeatures: false,
  showReferralProgram: false,
};

const FeatureFlagContext = createContext<FeatureFlags>(defaultFlags);

export const FeatureFlagProvider = ({ children }: { children: ReactNode }) => {
  const [flags, setFlags] = useState<FeatureFlags>(defaultFlags);

  useEffect(() => {
    const app = initializeApp(firebaseConfig);
    const remoteConfig = getRemoteConfig(app);
    // Optional: set minimum fetch interval for dev
    remoteConfig.settings = {
      minimumFetchIntervalMillis: 3600000,
      fetchTimeoutMillis: 60000,
    };
    fetchAndActivate(remoteConfig)
      .then(() => {
        const newFlags: FeatureFlags = {
          enableProFeatures: getValue(remoteConfig, 'enableProFeatures').asBoolean(),
          enableEnterpriseFeatures: getValue(remoteConfig, 'enableEnterpriseFeatures').asBoolean(),
          showReferralProgram: getValue(remoteConfig, 'showReferralProgram').asBoolean(),
        };
        setFlags(newFlags);
      })
      .catch((err) => {
        console.error('Failed to fetch Remote Config:', err);
      });
  }, []);

  return <FeatureFlagContext.Provider value={flags}>{children}</FeatureFlagContext.Provider>;
};

export const useFeatureFlags = () => useContext(FeatureFlagContext);
