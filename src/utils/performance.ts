/**
 * Performance optimization utilities
 * Provides adaptive performance settings based on device capabilities
 */

// Check if the device is mobile/low-performance
export const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
    || window.innerWidth < 768;
};

// Check for low-end CPU detection
export const isLowEndDevice = (): boolean => {
  // Hardware concurrency can indicate CPU capability
  const cpuCores = navigator.hardwareConcurrency || 4;
  return cpuCores <= 4 || isMobileDevice();
};

// Detect device GPU capabilities
export const hasWeakGPU = (): boolean => {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') as WebGLRenderingContext | null;
  
  if (!gl) return true; // No WebGL support means weak GPU
  
  // Check for extensions and parameters that indicate GPU capability
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  if (!debugInfo) return true; // Cannot determine GPU

  const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
  
  // Check for integrated/mobile GPUs
  return /Intel|HD Graphics|Integrated|Mobile|Mali|Adreno/i.test(renderer as string);
};

// Performance tiers
export enum PerformanceTier {
  LOW,
  MEDIUM,
  HIGH
}

// Determine performance tier based on device capabilities
export const getPerformanceTier = (): PerformanceTier => {
  if (isLowEndDevice() && hasWeakGPU()) {
    return PerformanceTier.LOW;
  } else if (isLowEndDevice() || hasWeakGPU()) {
    return PerformanceTier.MEDIUM;
  } else {
    return PerformanceTier.HIGH;
  }
};

// Get adaptive settings based on performance tier
export const getAdaptiveSettings = () => {
  const tier = getPerformanceTier();
  
  return {
    particleCount: tier === PerformanceTier.LOW ? 800 : 
                  tier === PerformanceTier.MEDIUM ? 1500 : 2000,
    
    starsCount: tier === PerformanceTier.LOW ? 1000 : 
               tier === PerformanceTier.MEDIUM ? 1500 : 2000,
    
    enableBloom: tier !== PerformanceTier.LOW,
    
    frameloop: tier === PerformanceTier.LOW ? "demand" : "always",
    
    dpr: tier === PerformanceTier.LOW ? [0.6, 1.0] : 
        tier === PerformanceTier.MEDIUM ? [0.8, 1.5] : [1.0, 2.0],
    
    antialias: tier === PerformanceTier.HIGH
  };
};

// Cache performance results to avoid repeated detection
let cachedSettings: ReturnType<typeof getAdaptiveSettings> | null = null;

// Export a memoized version to prevent repeated calculations
export const getPerformanceSettings = () => {
  if (!cachedSettings) {
    cachedSettings = getAdaptiveSettings();
  }
  return cachedSettings;
}; 