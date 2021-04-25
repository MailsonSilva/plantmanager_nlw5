import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, ActivityIndicator} from 'react-native';
import { EnviromentButton } from '../components/EnviromentButton';
import { Header } from '../components/Header';
import { PlantCardPrimary } from '../components/PLantCardPrimary';
import { Load } from '../components/Load';
import { useNavigation } from '@react-navigation/core';
import api from '../services/api';
import colors from '../styles/colors';
import fonts from '../styles/fonts';
import { PlantsProps } from '../libs/storage';

interface EnviromentProps {
  key: string;
  title: string;
}

export function PlantSelect() {
  const navigation = useNavigation();
  const [enviroment, setEnviroment] = useState<EnviromentProps[]>([]);
  const [plants, setPlants] = useState<PlantsProps[]>([]);
  const [filteredPlants, setFilteredPlants] = useState<PlantsProps[]>([]);
  const [enviromentSelected, setEnviromentSelected] = useState('all');
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1); //pagina atual
  const [loadingMore, setLoadingMore ] = useState(true); //se tem mais pra carregar  

  function handleEnviromentSelected(enviroment: string) {
    setEnviromentSelected(enviroment);

    if(enviroment == 'all')
      return setFilteredPlants(plants);

    const filtered = plants.filter(plant =>
      plant.environments.includes(enviroment)
    );

    setFilteredPlants(filtered);
  }

  async function fetchPlant() {
    const { data } = await api
    .get(`plants?_sort=name&_order=asc&_page=${page}&_limit=8`);

    if(!data)
      return setLoading(true);
    
    if(page > 1){
      setPlants(oldValue => [...oldValue, ...data])
      setFilteredPlants(oldValue => [...oldValue, ...data])
    } else {
      setPlants(data);
      setFilteredPlants(data);
    }      
    setLoading(false);
    setLoadingMore(false);
  }

  function handleFechMore(distance: number) {
    if(distance < 1)
      return;

    setLoadingMore(true);
    setPage(oldValue => oldValue + 1);
    fetchPlant();
  }

  function handlePlantSelect(plant: PlantsProps) {
    navigation.navigate('PlantSave', { plant } );
  }

  useEffect(()=>{
    async function fetchEnviroment(){
      const { data } = await api
      .get('plants_environments?_sort=title&_order=asc');

      setEnviroment([
        {
          key: 'all',
          title: 'Todos',
        },
        ...data
      ]);
    }

    fetchEnviroment();
  }, []);

  useEffect(()=>{
    fetchPlant();
  }, []);

  if(loading)
    return <Load />

  return (
    <View style={styles.container} >
      <View style={styles.header} >
        <Header />

        <Text style={styles.title} >Em qual ambiente</Text>
        <Text style={styles.subTitle} >você quer colocar sua planta?</Text>
      </View>

      <View>
        <FlatList
          data={enviroment}
          keyExtractor={(item) => String(item.key)}
          renderItem={({ item }) => (
            <EnviromentButton 
              title={item.title}
              active={item.key === enviromentSelected}
              onPress={() => handleEnviromentSelected(item.key)}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.enviromentList}
        />
      </View>  

      <View style={styles.plants} >
        <FlatList 
          data={filteredPlants}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item })=>(
            <PlantCardPrimary 
              data={item}
              onPress={() => handlePlantSelect(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
          numColumns={2}   
          onEndReachedThreshold={0.1}       
          onEndReached={({ distanceFromEnd }) => handleFechMore(distanceFromEnd)} 
          ListFooterComponent={
            loadingMore 
            ? <ActivityIndicator color={colors.green} />
            : <></>
          }
        />
      </View>   

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 17,
    color: colors.heading,
    fontFamily: fonts.heading,
    lineHeight: 20,
    marginTop: 15
  },
  subTitle: {
    fontFamily: fonts.text,
    fontSize: 17,
    lineHeight: 20,
    color: colors.heading
  },
  enviromentList: {
    height: 40,
    justifyContent: 'center',
    paddingBottom: 10,
    marginLeft: 10,
    paddingHorizontal: 12,
    marginVertical: 32,
  },
  plants: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center'
  }
});