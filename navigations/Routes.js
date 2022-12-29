import React, {useContext, useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import { AuthContext } from '../navigations/AuthProvider';
import {View, Text} from 'react-native';

import AuthStack from './AuthStack';
import AppStack from './AppStack';

const Routes = () => {

  const [initializing, setInitializing] = useState(true);
  const {user, setUser} = useContext(AuthContext);

  // console.log('userData : ', user)

  const onAuthStateChanged = (user) => {
    setUser(user);
    if(initializing) setInitializing(false);
   

  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return(
      subscriber
    )
  })
  

if(initializing) return null;

  return (

    // <View><Text>Hey</Text></View>
    <NavigationContainer>
     { user ? <AppStack/> : <AuthStack />}
    </NavigationContainer>
  );
};

export default Routes;