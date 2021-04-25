import { useNavigation, useRoute } from '@react-navigation/core';
import React from 'react';
import { SafeAreaView, Text, View, StyleSheet } from 'react-native';
import { Button } from '../components/Button';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface Params {
  title: string;
  subTitle: string;
  buttonTitle: string;
  icon: 'smile' | 'hug';
  nextScreen: string;
}

const emojis = {
  hug: '🤩',
  smile: '😁'
}

export function Confirmation() {
  const navigation = useNavigation();
  const routes = useRoute();

  const {
    title,
    buttonTitle,
    icon,
    nextScreen,
    subTitle
  } = routes.params as Params;

  function handleMoveOn() {
    navigation.navigate(nextScreen);
  }

  return (
    <SafeAreaView style={styles.container} >
      <View style={styles.content} >
        <Text style={styles.emoji} >
          {emojis[icon]}
        </Text>

        <Text style={styles.title} >
          {title}
        </Text>

        <Text style={styles.subTitle} >
          {subTitle}
        </Text>

        <View style={styles.footer} >
          <Button
            title={buttonTitle}
            onPress={handleMoveOn}
          />
        </View>
      
      </View>       
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,   
    alignItems: 'center',
    justifyContent: 'space-around' 
  },
  content: {
    flex: 1,
    alignItems: 'center',  
    justifyContent: 'center',  
    width: '100%',
    padding: 30,
  },
  emoji: {
    fontSize: 44,
  },
  title: {
    fontSize: 22,
    fontFamily: fonts.heading,
    textAlign: 'center',
    color: colors.heading,
    lineHeight: 38,
    marginTop: 16,
  },
  subTitle: {
    fontSize: 17,
    fontFamily: fonts.text,
    textAlign: 'center',
    color: colors.heading,
    paddingVertical: 10,
  },
  footer: {
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 50,
  }
});