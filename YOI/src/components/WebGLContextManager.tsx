import React, { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import type * as THREE from 'three';
import { safeLogger } from '../utils/logger';

/**
 * Enhanced WebGL Context Loss Manager
 * Comprehensive handling of context loss/restoration, memory management,
 * and automatic resource cleanup to prevent crashes in production
 */

interface WebGLContextManagerProps {
  onContextLost?: () => void;
  onContextRestored?: () => void;
  onLowMemory?: () => void;
}

export function WebGLContextManager({
  onContextLost,
  onContextRestored,
  onLowMemory
}: WebGLContextManagerProps) {
  const { gl, scene, invalidate } = useThree();
  const contextLostCount = useRef(0);
  const lastMemoryCheck = useRef(Date.now());
  const resourceCleanupInterval = useRef<NodeJS.Timeout | null>(null);
  const textureCache = useRef(new Map<string, THREE.Texture>());
  const geometryCache = useRef(new Map<string, THREE.BufferGeometry>());

  useEffect(() => {
    const canvas = gl.domElement;

    // Aggressive resource cleanup function
    const performResourceCleanup = () => {
      try {
        // Clean up unused textures
        textureCache.current.forEach((texture, key) => {
          if (texture && typeof texture.dispose === 'function') {
            texture.dispose();
          }
        });
        textureCache.current.clear();

        // Clean up unused geometries
        geometryCache.current.forEach((geometry, key) => {
          if (geometry && typeof geometry.dispose === 'function') {
            geometry.dispose();
          }
        });
        geometryCache.current.clear();

        // Force garbage collection hint (not guaranteed but helps)
        if (gl.info) {
          gl.info.reset();
        }

        // Silent - resource cleanup completed
      } catch (error) {
        // Silent error handling
      }
    };

    // WebGL Context Lost Handler with enhanced recovery
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      contextLostCount.current++;
      
      // Silent error logging - store in sessionStorage only
      safeLogger.error(`WebGL context lost (count: ${contextLostCount.current})`);

      // Immediate resource cleanup to free memory
      performResourceCleanup();

      if (onContextLost) {
        onContextLost();
      }

      // Show user notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-[9999] animate-fade-in';
      notification.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
          <span>Graphics context lost. Restoring... (Attempt ${contextLostCount.current})</span>
        </div>
      `;
      document.body.appendChild(notification);

      // Remove notification after 5 seconds
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 5000);

      // If context loss is frequent, force page reload as last resort
      if (contextLostCount.current >= 5) {
        safeLogger.error('Multiple context losses detected - reloading');
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    };

    // WebGL Context Restored Handler with enhanced recovery
    const handleContextRestored = () => {
      // Silent - context restored successfully
      
      // Reset renderer state
      try {
        gl.resetState();
        
        // Force re-compile all shaders
        scene.traverse((object: any) => {
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((mat: any) => {
                if (mat) mat.needsUpdate = true;
              });
            } else {
              object.material.needsUpdate = true;
            }
          }
        });

        // Force scene re-render
        invalidate();
        
        // Silent - renderer state reset
      } catch (error) {
        // Silent error handling
      }

      if (onContextRestored) {
        onContextRestored();
      }

      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-[9999] animate-fade-in';
      notification.innerHTML = `
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          <span>Graphics restored successfully!</span>
        </div>
      `;
      document.body.appendChild(notification);

      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 3000);

      // If context was lost multiple times, auto-enable low graphics mode
      if (contextLostCount.current >= 3 && onLowMemory) {
        safeLogger.warn('Auto-enabling low graphics mode due to multiple context losses');
        onLowMemory();
        
        const lowGraphicsNotification = document.createElement('div');
        lowGraphicsNotification.className = 'fixed top-16 left-1/2 -translate-x-1/2 bg-yellow-600 text-white px-6 py-3 rounded-lg shadow-lg z-[9999]';
        lowGraphicsNotification.innerHTML = `
          <div class="text-center">
            <p class="mb-2">⚠️ Low Graphics Mode enabled automatically</p>
            <p class="text-xs opacity-90">Multiple context losses detected</p>
          </div>
        `;
        document.body.appendChild(lowGraphicsNotification);

        setTimeout(() => {
          if (lowGraphicsNotification.parentNode) {
            lowGraphicsNotification.remove();
          }
        }, 8000);
      }
    };

    // Enhanced memory monitoring with automatic cleanup
    const checkMemory = () => {
      const now = Date.now();
      if (now - lastMemoryCheck.current < 15000) return; // Check every 15 seconds (more frequent)
      
      lastMemoryCheck.current = now;

      // Monitor WebGL memory info
      const glInfo = gl.info;
      if (glInfo && glInfo.memory) {
        console.log('WebGL Memory:', {
          geometries: glInfo.memory.geometries,
          textures: glInfo.memory.textures
        });

        // If too many resources, trigger cleanup
        if (glInfo.memory.textures > 100 || glInfo.memory.geometries > 500) {
          console.warn('⚠️ High WebGL resource count detected, triggering cleanup...');
          performResourceCleanup();
        }
      }

      // @ts-ignore - Performance memory is not in all browsers
      if (performance.memory) {
        // @ts-ignore
        const { usedJSHeapSize, jsHeapSizeLimit, totalJSHeapSize } = performance.memory;
        const memoryUsagePercent = (usedJSHeapSize / jsHeapSizeLimit) * 100;

        console.log('Memory Status:', {
          used: `${(usedJSHeapSize / 1048576).toFixed(2)} MB`,
          total: `${(totalJSHeapSize / 1048576).toFixed(2)} MB`,
          limit: `${(jsHeapSizeLimit / 1048576).toFixed(2)} MB`,
          percentage: `${memoryUsagePercent.toFixed(1)}%`
        });

        // Aggressive cleanup at 80% (was 90%)
        if (memoryUsagePercent > 80) {
          console.warn(`⚠️ High memory usage: ${memoryUsagePercent.toFixed(1)}% - triggering cleanup`);
          performResourceCleanup();
          
          if (onLowMemory) {
            onLowMemory();
          }

          // Show warning
          const memoryNotification = document.createElement('div');
          memoryNotification.className = 'fixed bottom-4 right-4 bg-orange-600 text-white px-4 py-3 rounded-lg shadow-lg z-[9999]';
          memoryNotification.innerHTML = `
            <p class="text-sm font-bold">⚠️ High memory usage (${memoryUsagePercent.toFixed(0)}%)</p>
            <p class="text-xs mt-1">Automatic cleanup in progress...</p>
          `;
          document.body.appendChild(memoryNotification);

          setTimeout(() => {
            if (memoryNotification.parentNode) {
              memoryNotification.remove();
            }
          }, 4000);
        }

        // Emergency mode at 95%
        if (memoryUsagePercent > 95) {
          console.error('🚨 CRITICAL: Memory usage above 95%! Emergency cleanup...');
          
          // Aggressive emergency cleanup
          performResourceCleanup();
          
          // Traverse scene and dispose everything possible
          scene.traverse((object: any) => {
            if (object !== scene) {
              disposeObject(object);
            }
          });

          // Force render with minimal resources
          gl.setPixelRatio(1);
          gl.setSize(window.innerWidth, window.innerHeight);
          
          const emergencyNotification = document.createElement('div');
          emergencyNotification.className = 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-700 text-white px-8 py-6 rounded-lg shadow-2xl z-[10000] text-center';
          emergencyNotification.innerHTML = `
            <p class="text-lg font-bold mb-2">🚨 Critical Memory Warning</p>
            <p class="text-sm mb-4">Reloading page to prevent crash...</p>
            <div class="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent mx-auto"></div>
          `;
          document.body.appendChild(emergencyNotification);

          // Force reload after 2 seconds
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      }
    };

    // Attach event listeners
    canvas.addEventListener('webglcontextlost', handleContextLost, false);
    canvas.addEventListener('webglcontextrestored', handleContextRestored, false);

    // Start aggressive memory monitoring (every 15 seconds)
    const memoryInterval = setInterval(checkMemory, 15000);

    // Periodic resource cleanup (every 2 minutes)
    resourceCleanupInterval.current = setInterval(() => {
      console.log('🧹 Performing scheduled resource cleanup...');
      performResourceCleanup();
    }, 120000);

    // Initial memory check
    setTimeout(checkMemory, 5000);

    // Log renderer configuration
    console.log('WebGL Context Manager initialized:', {
      renderer: gl.constructor.name,
      capabilities: {
        maxTextures: gl.capabilities.maxTextures,
        maxVertexTextures: gl.capabilities.maxVertexTextures,
        maxTextureSize: gl.capabilities.maxTextureSize,
        maxCubemapSize: gl.capabilities.maxCubemapSize,
        maxAttributes: gl.capabilities.maxAttributes,
        maxVertexUniforms: gl.capabilities.maxVertexUniforms,
        maxFragmentUniforms: gl.capabilities.maxFragmentUniforms,
        maxSamples: gl.capabilities.maxSamples,
      },
      pixelRatio: gl.getPixelRatio(),
      drawingBufferSize: {
        width: gl.drawingBufferWidth,
        height: gl.drawingBufferHeight
      }
    });

    // Cleanup on unmount
    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
      clearInterval(memoryInterval);
      if (resourceCleanupInterval.current) {
        clearInterval(resourceCleanupInterval.current);
      }
      performResourceCleanup();
    };
  }, [gl, scene, onContextLost, onContextRestored, onLowMemory, invalidate]);

  // Component doesn't render anything
  return null;
}

/**
 * Memory cleanup utility
 * Call this to dispose of unused resources
 */
export function disposeObject(object: any) {
  if (!object) return;

  // Dispose geometry
  if (object.geometry) {
    object.geometry.dispose();
  }

  // Dispose material
  if (object.material) {
    if (Array.isArray(object.material)) {
      object.material.forEach((material: any) => {
        disposeMaterial(material);
      });
    } else {
      disposeMaterial(object.material);
    }
  }

  // Dispose children
  if (object.children) {
    object.children.forEach((child: any) => {
      disposeObject(child);
    });
  }
}

function disposeMaterial(material: any) {
  if (!material) return;

  // Dispose textures
  Object.keys(material).forEach(prop => {
    if (material[prop] && typeof material[prop].dispose === 'function') {
      material[prop].dispose();
    }
  });

  material.dispose();
}
