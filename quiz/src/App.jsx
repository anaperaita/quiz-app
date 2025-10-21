import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QuizProvider } from './context/QuizContext';
import HomeScreen from './screens/HomeScreen';
import QuizScreen from './screens/QuizScreen';
import ReviewScreen from './screens/ReviewScreen';
import StatisticsScreen from './screens/StatisticsScreen';
import './App.css';

function App() {
  return (
    <QuizProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/quiz" element={<QuizScreen />} />
          <Route path="/review/:mode/:blockName" element={<ReviewScreen />} />
          <Route path="/review/:mode" element={<ReviewScreen />} />
          <Route path="/review" element={<ReviewScreen />} />
          <Route path="/statistics" element={<StatisticsScreen />} />
        </Routes>
      </BrowserRouter>
    </QuizProvider>
  );
}

export default App;
