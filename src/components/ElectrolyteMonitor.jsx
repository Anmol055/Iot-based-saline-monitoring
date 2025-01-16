import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue } from 'firebase/database';

const ElectrolyteMonitor = () => {
  const [patientData, setPatientData] = useState({
    name: '',
    age: '',
    room: '',
    bed: '',
    electro_details: '',
    bottles: ''
  });

  const [measurements, setMeasurements] = useState({
    electrolyteRemaining: 0,
    rateOfConsumption: 0,
    timeToEmpty: 0
  });

  const [showAlert, setShowAlert] = useState(false);
  const [lastAlertTime, setLastAlertTime] = useState(new Date());

  useEffect(() => {
    // Firebase configuration
    const firebaseConfig = {
      apiKey: process.env.APIKEY,
      authDomain: "iot-electrolyte.firebaseapp.com",
      databaseURL: "https://iot-electrolyte-default-rtdb.firebaseio.com",
      projectId: "iot-electrolyte",
      storageBucket: "iot-electrolyte.appspot.com",
      messagingSenderId: "871818439814",
      appId: "1:871818439814:web:749e4aab57c36e08e7f507",
      measurementId: "G-KGL4LX9T2G"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    // Set up database references
    const ageRef = ref(db, 'patients/age');
    const nameRef = ref(db, 'patients/name');
    const bedRef = ref(db, 'patients/bed');
    const roomRef = ref(db, 'patients/room');
    const bottlesRef = ref(db, 'patients/bottles');
    const electroDetailsRef = ref(db, 'var_parameters/electro');
    const electroRef = ref(db, 'var_parameters/electrolyte_remaining(mL)');
    const rateRef = ref(db, 'var_parameters/rate_of_consumption(mL_per_min)');
    const timeRef = ref(db, 'var_parameters/time_to_empty(min)');

    // Set up real-time listeners
    onValue(ageRef, (snapshot) => {
      setPatientData(prev => ({ ...prev, age: snapshot.val() }));
    });

    onValue(nameRef, (snapshot) => {
      setPatientData(prev => ({ ...prev, name: snapshot.val() }));
    });

    onValue(bedRef, (snapshot) => {
      setPatientData(prev => ({ ...prev, bed: snapshot.val() }));
    });

    onValue(roomRef, (snapshot) => {
      setPatientData(prev => ({ ...prev, room: snapshot.val() }));
    });

    onValue(bottlesRef, (snapshot) => {
      setPatientData(prev => ({ ...prev, bottles: snapshot.val() }));
    });

    onValue(electroDetailsRef, (snapshot) => {
      setPatientData(prev => ({ ...prev, electro_details: snapshot.val() }));
    });

    onValue(electroRef, (snapshot) => {
      const electroValue = snapshot.val();
      setMeasurements(prev => ({ ...prev, electrolyteRemaining: electroValue }));
      
      // Check battery percentage and update alert
      const batteryPercentage = (electroValue / 500) * 100;
      if (batteryPercentage <= 20 && batteryPercentage > 0) {
        setShowAlert(true);
        setLastAlertTime(new Date());
      } else {
        setShowAlert(false);
      }
    });

    onValue(rateRef, (snapshot) => {
      setMeasurements(prev => ({ ...prev, rateOfConsumption: snapshot.val() }));
    });

    onValue(timeRef, (snapshot) => {
      setMeasurements(prev => ({ ...prev, timeToEmpty: snapshot.val() }));
    });
  }, []);

  const handleReset = () => {
    const db = getDatabase();
    set(ref(db, 'patients/resetButton'), true)
      .then(() => {
        setShowAlert(false);
      })
      .catch((error) => {
        console.error("Error resetting:", error);
      });
  };

  const getBatteryLevel = () => {
    let percentage = (measurements.electrolyteRemaining / 500) * 100;
    return percentage < 0 ? 0 : percentage;
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-xl p-8">
        <div className="flex flex-col items-center space-y-6 pt-11">
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Nurse Dashboard</h2>
            <p className="text-gray-500 font-medium">+91 9907416211</p>
          </div>
          <Link to="/add" >
          <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full py-3 px-4 hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-md">
            Add New Patient
          </button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Alert */}
        {showAlert && (
          <div className="mb-8 bg-gradient-to-r from-red-500 to-pink-500 text-white p-6 rounded-xl shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
            <div className="flex items-center space-x-3 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="font-bold text-xl">Critical Electrolyte Level</h3>
            </div>
            <p className="ml-11 text-white/90">
              Low Saline Level Alert: The saline bottle in <span className="font-semibold">{patientData.name}'s</span> room is below 20% capacity. 
              Alert triggered at {lastAlertTime.toLocaleTimeString()}. 
              Please replace the bottle immediately.
            </p>
          </div>
        )}

        {/* Patient Details Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
              Patient's Details
            </h2>
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-12">
            <div className="space-y-6">
              {/* Patient Info Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-xl">
                  <p className="text-sm text-blue-600 font-medium mb-1">Patient Name</p>
                  <p className="text-lg font-semibold text-gray-800">{patientData.name}</p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-xl">
                  <p className="text-sm text-indigo-600 font-medium mb-1">Age</p>
                  <p className="text-lg font-semibold text-gray-800">{patientData.age} years</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl">
                  <p className="text-sm text-purple-600 font-medium mb-1">Room No</p>
                  <p className="text-lg font-semibold text-gray-800">{patientData.room}</p>
                </div>
                <div className="bg-pink-50 p-4 rounded-xl">
                  <p className="text-sm text-pink-600 font-medium mb-1">Bed No</p>
                  <p className="text-lg font-semibold text-gray-800">{patientData.bed}</p>
                </div>
              </div>

              {/* Measurements */}
              <div className="space-y-4 bg-gray-50 p-6 rounded-xl">
                <p className="text-gray-700">
                  <span className="text-sm text-gray-500">Electrolyte Detail:</span>
                  <span className="ml-2 font-semibold">{patientData.electro_details}</span>
                </p>
                <p className="text-gray-700">
                  <span className="text-sm text-gray-500">Bottles Used:</span>
                  <span className="ml-2 font-semibold">{patientData.bottles}</span>
                </p>
                <p className="text-gray-700">
                  <span className="text-sm text-gray-500">Rate of Consumption:</span>
                  <span className="ml-2 font-semibold">{measurements.rateOfConsumption} mL/min</span>
                </p>
                <p className="text-gray-700">
                  <span className="text-sm text-gray-500">Time to Empty:</span>
                  <span className="ml-2 font-semibold">{measurements.timeToEmpty} min</span>
                </p>
              </div>

              <button 
                onClick={handleReset}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl py-3 px-4 hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-md font-medium"
              >
                Reset Electrolyte Level
              </button>
            </div>

            {/* Battery Indicator */}
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-40 h-80 border-8 border-gray-200 rounded-3xl relative overflow-hidden bg-white shadow-inner">
                <div 
                  className={`absolute bottom-0 w-full transition-all duration-1000 ${
                    getBatteryLevel() <= 20 
                      ? 'bg-gradient-to-t from-red-500 to-red-400' 
                      : 'bg-gradient-to-t from-green-500 to-green-400'
                  }`}
                  style={{ height: `${getBatteryLevel()}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white mix-blend-difference">
                    {measurements.electrolyteRemaining?.toFixed(1)} mL
                  </span>
                </div>
              </div>
              <p className="text-gray-500 font-medium">
                Electrolyte Level
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ElectrolyteMonitor;
