
import React,{useState,useEffect} from 'react';
import Constants from 'expo-constants'
import {  View ,TouchableOpacity, Image, StyleSheet,Text,ScrollView, Alert} from 'react-native';
import {Feather as Icon} from '@expo/vector-icons'
import {useNavigation,useRoute} from '@react-navigation/native'
import MapView,{Marker} from 'react-native-maps'
import {SvgUri} from 'react-native-svg'
import api from '../../services/api'
import * as Location from  'expo-location'



interface Item{
  id: number;
  title: string;
  image_url:string;

}
interface Point {
  id:number;
  name:string;
  image:string;
  image_url:string;
  latitude: number;
  longetude: number;
}

interface Params{
  uf:string;
  city:string;
}



const Points = () =>{

  
  const navigation = useNavigation()
  const routes = useRoute()

  const routeParams = routes.params as Params

  function handlenavigationHome(){
    navigation.goBack()
  }
  function handlenavigationDeatail(id: number){

    navigation.navigate('Detail',{point_id:id})
  }

  const [items, setItems] = useState<Item[]>([])
  const [selectedItens, setSelectedItens] = useState<number[]>([])
  const [points, setPoints] = useState<Point[]>([])
  const [initialPosit, setinitialPosit] = useState<[number,number]>([0,0])

  useEffect(()=>{
    api.get('items').then(response => {
        setItems(response.data)
    })
  },[]);

  useEffect(()=>{
    async function loadPosition(){
      const { status} = await Location.requestPermissionsAsync ()
      if (status!=='granted'){
        Alert.alert('Ooooooops','Precisamos de sua permição pra obter localização')
        return;
      }
      const location = await Location.getCurrentPositionAsync();

      const {latitude,longitude} = location.coords

      setinitialPosit([latitude,longitude])
    }
    loadPosition()
  },[]);

  useEffect(()=>{
    api.get('points',{
      params:{
        city: routeParams.city,
        uf: routeParams.uf,
        items: selectedItens
      }
    
    }).then(response => {
      setPoints(response.data)
  })
  },[selectedItens])

  function handleSelectClick(id: number){
      const alreadySelect = selectedItens.findIndex(item => item === id);
      if(alreadySelect>-1){
          const filtered = selectedItens.filter(item => item!=id)
          setSelectedItens(filtered)
      }else{
          setSelectedItens([...selectedItens,id])
      }
      
  }

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity>
          <Icon name='arrow-left' color='#34cb79' onPress={handlenavigationHome}/>
        </TouchableOpacity>
        <Text style={styles.title}>Bem Vindo.</Text>
        <Text style={styles.description}>Encontre no Mapa um ponto de coleta.</Text>
        <View style={styles.mapContainer}>
            {initialPosit[0] !== 0 && (
              <MapView style={styles.map} initialRegion={{latitude:initialPosit[0],longitude:initialPosit[1], latitudeDelta:0.0141, longitudeDelta:0.014}}>
                {points.map(point => (
                      <Marker key={String(point.id)} style={styles.mapMarker} coordinate={{
                        latitude: point.latitude,
                        longitude: point.longetude, 
                      }}
                    onPress={()=>{handlenavigationDeatail(point.id)}} >
                    <View style={styles.mapMarkerContainer}>
                      <Image style={styles.mapMarkerImage} source={{uri:point.image_url}}/>
                      <Text style={styles.mapMarkerTitle} >{point.name}</Text>
                    </View>
                  </Marker>
                ))}
              </MapView>
            )}
        </View>
      </View>
      <View style= {styles.itemsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal:20}}>

          {items.map(item =>(

            <TouchableOpacity key={String(item.id)} style={[styles.item,selectedItens.includes(item.id)? styles.selectedItem : {}]} activeOpacity={0.7} onPress={() =>handleSelectClick(item.id)} >
              <SvgUri width={42} height={42} uri ={item.image_url} />
               <Text style={styles.itemTitle}>{item.title}</Text>
            </TouchableOpacity>
          
          ))}
        </ScrollView>
      </View>
    </>  
  );
}


export default Points;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20 + Constants.statusBarHeight,
  },

  title: {
    fontSize: 20,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 4,
    fontFamily: 'Roboto_400Regular',
  },

  mapContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 16,
  },

  map: {
    width: '100%',
    height: '100%',
  },

  mapMarker: {
    width: 90,
    height: 80, 
  },

  mapMarkerContainer: {
    width: 90,
    height: 70,
    backgroundColor: '#34CB79',
    flexDirection: 'column',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center'
  },

  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: 'cover',
  },

  mapMarkerTitle: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    color: '#FFF',
    fontSize: 13,
    lineHeight: 23,
  },

  itemsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 32,
  },

  item: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eee',
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'space-between',

    textAlign: 'center',
  },

  selectedItem: {
    borderColor: '#34CB79',
    borderWidth: 2,
  },

  itemTitle: {
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    fontSize: 13,
  },
});