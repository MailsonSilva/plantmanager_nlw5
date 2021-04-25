import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform
} from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import userImg from '../assets/deku.png';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

export function Header() {
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    async function loadStorageUserName() {
       const user = await AsyncStorage.getItem('@plantmanager:user');
       setUserName(user || '');
    }

    loadStorageUserName();
  },[]);

  return (
    <View style={Platform.OS === 'ios' ? [styles.container, styles.container1] : styles.container} >
      <View>
        <Text style={styles.greeting} >Olá,</Text>
        <Text style={styles.userName} >{userName}</Text>
      </View>

      <Image source={userImg} style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',       
  },
  container1: {
    marginTop: getStatusBarHeight(),
  },
  greeting: {
    fontSize: 32,
    color: colors.heading,
    fontFamily: fonts.text
  },
  userName: {
    fontSize: 32,
    color: colors.heading,
    fontFamily: fonts.heading,
    lineHeight: 40
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 50,
  }
})