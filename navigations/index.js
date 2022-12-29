import React from 'react';
import Routes from '../navigations/Routes';
import { AuthProvider } from '../navigations/AuthProvider';
import {View, Text} from 'react-native';

const Providers = () => {
  return (
    <AuthProvider>
    <Routes />
    </AuthProvider>
    

   
  );
};

export default Providers;
