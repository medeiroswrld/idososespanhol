import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const VocalesGame = () => {
  const { t } = useUser();
  const navigate = useNavigate();
  return <div className="p-6"><h1>Vocales Game</h1><button onClick={() => navigate(-1)} className="btn-outline mt-4">Back</button></div>;
};

export default VocalesGame;
