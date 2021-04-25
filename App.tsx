import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import {StatusBar} from 'react-native';
import AppLoading from 'expo-app-loading';
import  Routes  from './src/routes';
import * as Notifications from 'expo-notifications';

import {
  useFonts,
  Jost_400Regular,
  Jost_600SemiBold
} from '@expo-google-fonts/jost';
import { PlantsProps } from './src/libs/storage';

export default function App() {
  const [fontsLoaded] = useFonts({
    Jost_400Regular,
    Jost_600SemiBold
  });

  useEffect(() => {
    // const subScription = Notifications.addNotificationReceivedListener(
    //   async notification => {
    //     const data = notification.request.content.data.plant as PlantsProps;
    //     console.log(data);
    //   });
    //   return () => subScription.remove();

    // async function notifications() {
    //   await Notifications.cancelAllScheduledNotificationsAsync();

    //   const data = await Notifications.getAllScheduledNotificationsAsync();
    //   console.log(data);      
    // }
    // notifications();
  }, []);

  if(!fontsLoaded)
    return <AppLoading/>    

  return (
    <>      
      <Routes />
      <StatusBar barStyle='dark-content' backgroundColor='#fff'  />
    </>
  );
}
