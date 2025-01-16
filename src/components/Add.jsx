import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';
import { useNavigate } from 'react-router-dom';

const AddPatient = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    age: '',
    room: '',
    bed: '',
    electro: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const firebaseConfig = {
      apiKey: "AIzaSyCiYzzFyiVdvEyR7fhoZ4J2ULAcqYMSrLc",
      authDomain: "iot-electrolyte.firebaseapp.com",
      databaseURL: "https://iot-electrolyte-default-rtdb.firebaseio.com",
      projectId: "iot-electrolyte",
      storageBucket: "iot-electrolyte.appspot.com",
      messagingSenderId: "871818439814",
      appId: "1:871818439814:web:749e4aab57c36e08e7f507",
      measurementId: "G-KGL4LX9T2G"
    };

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    try {
      // Update patient data
      await set(ref(db, 'patients'), {
        name: formData.name,
        age: formData.age,
        room: formData.room,
        bed: formData.bed,
        bottles: 0
      });

      // Update electrolyte details
      await set(ref(db, 'var_parameters'), {
        electro: formData.electro,
        'electrolyte_remaining(mL)': 500,
        'rate_of_consumption(mL_per_min)': 0,
        'time_to_empty(min)': 0
      });

      alert('Patient added successfully!');
      navigate('/'); // Redirect to home page after successful submission

    } catch (error) {
      console.error('Error adding patient:', error);
      alert('Error adding patient. Please try again.');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Image Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-cover bg-center items-center justify-center p-12">
        <div className="w-full h-full bg-blue-600 rounded-3xl overflow-hidden shadow-2xl">
          <img 
            src="/src/assets/notebook.jpeg" 
            alt="Medical Notebook" 
            className="w-full h-full object-cover opacity-75 mix-blend-overlay"
          />
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                Add Patient
              </h1>
              <button
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <input
                    id="id"
                    type="text"
                    value={formData.id}
                    onChange={handleChange}
                    placeholder="Aadhar ID"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Name"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Age"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <input
                    id="room"
                    type="text"
                    value={formData.room}
                    onChange={handleChange}
                    placeholder="Room"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <input
                    id="bed"
                    type="text"
                    value={formData.bed}
                    onChange={handleChange}
                    placeholder="Bed"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <input
                    id="electro"
                    type="text"
                    value={formData.electro}
                    onChange={handleChange}
                    placeholder="Electrolyte"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl py-3 px-4 hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-md font-medium"
              >
                Add Patient
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPatient;