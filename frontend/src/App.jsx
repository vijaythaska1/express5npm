import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import './App.css'
import UserAdd from './page/UserAdd'
import TableListing from './page/TableListing'
import UserUpdate from './page/UserUpdate';

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<TableListing />} />
        <Route path='/UserAdd' element={<UserAdd />} />
        <Route path='/UserUpdate/:id' element={<UserUpdate />} />



      </Routes >
    </BrowserRouter >
  )
}

export default App
