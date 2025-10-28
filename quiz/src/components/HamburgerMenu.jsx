import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuiz } from '../hooks/useQuiz';
import './HamburgerMenu.css';

/**
 * HamburgerMenu Component
 * Provides a hamburger menu for module selection
 * Hidden on question/quiz screens to avoid distractions
 */
export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { availableModules, selectedModule, setSelectedModule } = useQuiz();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.hamburger-menu')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleModuleSelect = (moduleId) => {
    setSelectedModule(moduleId);
    setIsOpen(false);
  };

  // Hide menu on question/quiz screens
  const isQuestionScreen = ['/quiz', '/sequential-mode', '/review'].some(
    path => location.pathname.startsWith(path)
  );

  // Don't render on question screens
  if (isQuestionScreen) {
    return null;
  }

  return (
    <div className="hamburger-menu">
      {/* Hamburger Button */}
      <button
        className={`hamburger-button ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle module menu"
        aria-expanded={isOpen}
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      {/* Overlay */}
      {isOpen && <div className="hamburger-overlay" onClick={() => setIsOpen(false)}></div>}

      {/* Menu Panel */}
      <div className={`hamburger-panel ${isOpen ? 'open' : ''}`}>
        <div className="hamburger-header">
          <h2 className="hamburger-title">Módulos</h2>
          <button
            className="hamburger-close"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <div className="hamburger-modules">
          {availableModules.map((module) => (
            <button
              key={module.id}
              className={`hamburger-module-item ${
                selectedModule === module.id ? 'active' : ''
              }`}
              onClick={() => handleModuleSelect(module.id)}
            >
              <span className="module-icon">📚</span>
              <span className="module-name">{module.name}</span>
              {selectedModule === module.id && (
                <span className="module-check">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
