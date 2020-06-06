import React, {useState,useEffect} from 'react';
import {  View ,SafeAreaView, Image, StyleSheet,Text, TouchableOpacity, Linking} from 'react-native';
import {Feather as Icon, FontAwesome} from '@expo/vector-icons'
import {useNavigation,useRoute} from '@react-navigation/native'
import {RectButton} from 'react-native-gesture-handler'
import api from '../../services/api'
import * as MailComposer from 'expo-mail-composer'


interface Params {
  point_id: number
}

interface Data {
  point: {
    image:string,
    image_url:string;
    name:string,
    email:string,
    city: string,
    whatsapp: string,
    uf:string,
  };
  items: {
    title: string
  }[];

}

const Detail = () =>{

  const navigation = useNavigation()
  const routes = useRoute()

  const [data, setdata] = useState<Data>({} as Data)


  const routeParams = routes.params as Params

  function handlenavigationHome(){
    navigation.goBack()
  }

  function handlecomposeMails(){
    MailComposer.composeAsync({
      subject: 'Interece na coelta de residuos',
      recipients: [data.point.email],
    })
  }

  function handlecomposeWhats(){
    Linking.openURL(`whatsapp://send?phone=${data.point.whatsapp}&text=Tenho enteresse sobre coleta`);
  }

  useEffect(()=>{
    api.get(`points/${routeParams.point_id}`).then(response => {
      setdata(response.data)
      })
    },[])
  
  if(!data.point){
    return null
  }

  return (
      <SafeAreaView style={{flex:1}}>
        <View style={styles.container}>
          <TouchableOpacity>
            <Icon name='arrow-left' color='#34cb79' onPress={handlenavigationHome}/>
          </TouchableOpacity>
          <Image style={styles.pointImage} source={{uri:data.point.image_url}}/>
    <Text style={styles.pointName}>{data.point.name}</Text>
          <Text style={styles.pointItems}> {data.items.map(item=> item.title).join(',')}</Text>
          <View style={styles.address}>
            <Text style={styles.addressTitle}> Endereço</Text>
  <Text style={styles.addressContent}> {data.point.city}, {data.point.uf}</Text>    
          </View>
        </View>
        <View style={styles.footer}>
          <RectButton style={styles.button} onPress={handlecomposeWhats}>
              <FontAwesome name="whatsapp" color='#FFF' size={20} />
              <Text style={styles.buttonText}>Whatsapp</Text>
          </RectButton>
          
          <RectButton style={styles.button} onPress={handlecomposeMails}>
              <Icon name="mail" color='#FFF' size={20} />
              <Text style={styles.buttonText}>Email</Text>
          </RectButton>
        </View>
      </SafeAreaView>
  );
}

export default Detail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    paddingTop: 20,
  },

  pointImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 32,
  },

  pointName: {
    color: '#322153',
    fontSize: 28,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  pointItems: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  address: {
    marginTop: 32,
  },
  
  addressTitle: {
    color: '#322153',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },

  addressContent: {
    fontFamily: 'Roboto_400Regular',
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
    paddingVertical: 20,
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  
  button: {
    width: '48%',
    backgroundColor: '#34CB79',
    borderRadius: 10,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    marginLeft: 8,
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
  },
});