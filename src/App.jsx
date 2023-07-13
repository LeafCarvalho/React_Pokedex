import { Pokemon } from "./pages/Pokemon/Pokemon";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './Global.css'
import { ModalPok } from "./components/ModalPok/ModalPok";

export default function App() {
  return (
    <BrowserRouter>
    <Routes>
    <Route path="/" element={<Pokemon /> } />
    <Route path="/details/:id/:name" element={<ModalPok /> } />
    </Routes>
    </BrowserRouter>
  )
}