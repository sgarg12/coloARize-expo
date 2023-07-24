/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import store from './src/redux/store';
import BottomTabNav from './src/navigation/bottomTabNavigation';
import Constants from 'expo-constants';

function App(): JSX.Element {
  console.log(Constants.systemFonts);
  return (
    <Provider store={store}>
      <NavigationContainer>
        <BottomTabNav />
      </NavigationContainer>
    </Provider>
  );
}

export default App;
