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

function App(): JSX.Element {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <BottomTabNav />
      </NavigationContainer>
    </Provider>
  );
}

export default App;
