import React from 'react'
import ElectrolyteMonitor from './components/ElectrolyteMonitor'
import AddPatient from './components/Add'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<ElectrolyteMonitor />} />
          <Route path="/add" element={<AddPatient />} />
        </Routes>
    </div>
    </Router>
  )
}

export default App
