import React, { useState } from 'react';
import {
  Alert,
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  Platform,
  TouchableOpacity
} from 'react-native';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { SvgFromUri } from 'react-native-svg';
import { useNavigation, useRoute } from '@react-navigation/core';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
import waterdrop from '../assets/waterdrop.png';
import { Button } from '../components/Button';
import colors from '../styles/colors';
import fonts from '../styles/fonts';
import { format, isBefore } from 'date-fns';
import { PlantsProps, savePlant } from '../libs/storage';

interface Params {
  plant: PlantsProps
}

export function PlantSave() {
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(Platform.OS === 'ios');

  const route = useRoute();
  const { plant } = route.params as Params;

  const navigation = useNavigation();

  function handleChangeTime(event: Event, dateTime: Date | undefined) {
    if(Platform.OS === 'android'){
      setShowDatePicker(oldState => !oldState);
    }

    if(dateTime && isBefore(dateTime, new Date())){
      setSelectedDateTime(new Date());
      return Alert.alert('Escolha uma data no futuro! 🕑')
    }

    if(dateTime)
      setSelectedDateTime(dateTime);      
  }

  function handleOpenDatetimePickerForAndroid(){
    setShowDatePicker(oldState => !oldState);
  }

  async function handleSave() {
    try {
      await savePlant({
        ...plant,
        dateTimeNotification: selectedDateTime
      });

      navigation.navigate('Confirmation', {
        title: 'Tudo certo',
        subTitle: 'Fique tranquilo que sempre vamos lembrar você de cuidar de sua plantinhas com muito cuidado.',
        buttonTitle: 'Continuar',
        icon: 'hug',
        nextScreen: 'MyPlants'
      });
    } catch {
      Alert.alert('Não foi possível salvar. 😓');
    }
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <View style={styles.container}>
        <View style={styles.plantInfo} >
          <SvgFromUri 
            uri={plant.photo}
            height={150}
            width={150}
          />

          <Text style={styles.plantName}>
            {plant.name}
          </Text>
          <Text style={styles.plantAbout} >
            {plant.about}
          </Text>
        </View>

        <View style={styles.controller} >
          <View style={styles.tipContainer} >
            <Image 
              source={waterdrop}
              style={styles.tipImage}
            />
            <Text style={styles.tipText} >
              {plant.water_tips}
            </Text>
          </View>     

          <Text style={styles.alertLabel} >
            Escolha o melhor horário para ser lembrado:
          </Text>

          {
            showDatePicker && (
              <DateTimePicker 
                value={selectedDateTime}
                mode='time'
                display='spinner'
                onChange={handleChangeTime}
              />
            )
          }

          {
            Platform.OS === 'android' && (
              <TouchableOpacity
                onPress={handleOpenDatetimePickerForAndroid}
                style={styles.dateTimePickerButton}
              >
                <Text style={styles.dateTimePickerText} >
                  {`Mudar ${format(selectedDateTime, 'HH:mm')}`}
                </Text>
              </TouchableOpacity>
            )
          }

          <Button 
            title="Cadastrar planta"
            onPress={handleSave}
          />

        </View>
      </View>
    </ScrollView>  
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: colors.shape,
  },
  plantInfo: {
    flex: 1,    
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    backgroundColor: colors.shape
  },
  plantName: {
    fontFamily: fonts.heading,
    fontSize: 24,
    color: colors.heading,   
    padding: 5, 
  },
  plantAbout: {
    textAlign: 'center',
    fontSize: 17,
    fontFamily: fonts.text,
    color: colors.heading,
    marginBottom: 10,
  },
  controller: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: getBottomSpace() || 20
  },
  tipContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.blue_light,
    padding: 20,
    borderRadius: 20,
    position: 'relative',
    bottom: 50,
  },
  tipImage: {
    width: 56,
    height: 56,
  },
  tipAlert: {
    
  },
  tipText: {
    flex: 1,
    marginLeft: 15,    
    fontFamily: fonts.text,
    color: colors.blue,
    fontSize: 17,
    textAlign: 'justify'    
  },
  alertLabel: {
    textAlign: 'center',
    fontFamily: fonts.complement,
    color: colors.heading,
    fontSize: 12,
    marginBottom: 5,
  },
  dateTimePickerButton: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 40,
  },
  dateTimePickerText: {
    color: colors.heading,
    fontSize: 24,
    fontFamily: fonts.text
  }
});