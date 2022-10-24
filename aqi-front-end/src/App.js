/* eslint-disable react-hooks/exhaustive-deps */
import './App.css';
import React,{useEffect, useState} from 'react';
import DatePicker from 'react-date-picker';
import { MultiSelect } from "react-multi-select-component";
import * as d3 from 'd3';
import Select from 'react-select';
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule
} from "react-simple-maps";

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Visualize from './VisualizeAQI';
import Predict from './PredictAQI';



const geoUrl = "/features.json";




function App() { 

  return (
    <BrowserRouter>
    <div className='app'>
      <Routes>
        <Route path="/" element={<Visualize/>}/>
        <Route path="/visualize" element={<Visualize/>}/>
        <Route path="/predict" element={<Predict/>}/>
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
