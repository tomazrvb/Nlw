import React,{useEffect, useState, ChangeEvent, FormEvent} from 'react';
import './style.css'
import logo from '../../assets/logo.svg'
import {Link,useHistory} from 'react-router-dom'
import {FiArrowLeft} from 'react-icons/fi'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import api from '../../services/api'
import axios from 'axios'
import { LeafletMouseEvent } from 'leaflet';
import Dropzone from '../../components/Dropzone';


interface Item{
    id: number;
    title: string;
    image_url:string;
}
interface  IBGEUFResponse{
    sigla:string;
}

interface IBGECityResponse{
    nome:string;
}

const CreatePoints = () =>{

    const [items, setItems] = useState<Item[]>([])
    const [ufs, setUF] = useState<string[]>([])
    const [selectedUF, setSelectedUF] = useState<string>("0")
    const [citys, setCity] = useState<string[]>([])
    const [selectedCity, setSelectedCity] = useState<string>("0")

    const [initialPosit, setinitialPosit] = useState<[number,number]>([0,0])
    
    const [selectedPosit, setSelectedPosit] = useState<[number,number]>([0,0])

    const [selectedItens, setSelectedItens] = useState<number[]>([])

    const [inputData, setinputData] = useState({
        name: '',
        email:'',
        whatsapp:'',
    })

    const [selectedFile,setSelectedFile] = useState<File>()

    const history = useHistory()

    useEffect(()=>{
        api.get('items').then(response => {
            setItems(response.data)
        })
    },[]);

    useEffect(()=>{
        axios.get<IBGEUFResponse[]>("https://servicodados.ibge.gov.br/api/v1/localidades/estados").then(
            response => {
                const ufInitials = response.data.map(uf=>uf.sigla);
                setUF(ufInitials)
            }
        )
    },[]);


    useEffect(()=>{
        navigator.geolocation.getCurrentPosition(
            position =>{
                const {latitude,longitude} = position.coords
                setinitialPosit([latitude,longitude])
            }
        )
    },[]);


    useEffect(()=>{
        if (selectedUF === '0'){
            return;
        }
        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`).then(
            response => {
                const cityNames = response.data.map(city => city.nome)
                setCity(cityNames)
            }
        )

    },[selectedUF]);

    function handleSelectUF(event: ChangeEvent<HTMLSelectElement>){
        const uf= event.target.value
        setSelectedUF(uf)
    }
    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>){
        const City= event.target.value
        setSelectedCity(City)
    }

    function handleMapClick(event: LeafletMouseEvent){
        setSelectedPosit([event.latlng.lat,event.latlng.lng])
    }
    
    function handleImputChange(event: ChangeEvent<HTMLInputElement>){
        const {name,value} = event.target
        setinputData({...inputData,[name]:value});
    }

    function handleSelectClick(id: number){
        const alreadySelect = selectedItens.findIndex(item => item === id);
        if(alreadySelect>-1){
            const filtered = selectedItens.filter(item => item!==id)
            setSelectedItens(filtered)
        }else{
            setSelectedItens([...selectedItens,id])
        }
        
    }

    async function handleSubmit(event: FormEvent){
        event.preventDefault();

        const {name,email,whatsapp} = inputData;
        const uf = selectedUF;
        const city = selectedCity;
        const [latitude,longetude] = selectedPosit;
        const items = selectedItens;
        
        const data = new FormData()

       
            data.append('name',name)
            data.append('email',email)
            data.append('whatsapp',whatsapp)
            data.append('latitude',String(latitude))
            data.append('longetude',String(longetude))
            data.append('city',city)
            data.append('uf',uf)
            data.append('items',items.join(','))
            if(selectedFile){
                data.append('image',selectedFile)   
            }
        
        await api.post('/points', data)
        alert("Ponto de coleta cadastrado")
        history.push("/")
    }

    return(
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta" />
                <Link to="/">
                    <FiArrowLeft />
                    Volar a para Home
                </Link>
            </header>    
            <form onSubmit={handleSubmit}>
                <h1>
                    Cadastro do Ponto de Coleta
                </h1>

                <Dropzone onFileup={setSelectedFile} />

                <fieldset>
                   
                    <legend>
                        <h2> Dados </h2>
            
                    </legend>
  
                    <div className="field">
                        <label htmlFor="name"> Nome Da Entidade</label>
                        <input type="text" name="name" id="name" onChange={handleImputChange}></input>
                    </div>
  
                    <div className="field-group">

                        <div className="field">
                            <label htmlFor="email"> Email</label>
                            <input type="email" name="email" id="email" onChange={handleImputChange}></input>
                        </div>

                        <div className="field">
                            <label htmlFor="whatsapp"> WhatsApp</label>
                            < input type="text" name="whatsapp" id="whatsapp" onChange={handleImputChange}></input>
                        </div>
                    
                    </div>
  
                </fieldset>

                <fieldset>
                
                    <legend>
                        <h2> Endereço </h2>
                        <span> Selecione um endereço no mapa</span>
                    </legend>

                    <Map center={initialPosit} zoom={15} onClick={handleMapClick} >
                        <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={selectedPosit} />
                    </Map>

                    <div className="field-group">

                        <div className="field">
                            <label htmlFor="uf"> Estado(UF)</label>
                            <select name="uf" id="uf" onChange={handleSelectUF}>
                                <option value="0"> Selecione uma UF</option>
                                {ufs.map( uf =>(
                                         <option key={uf} value={uf}>{uf}</option>
                                    )
                                )}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city"> Cidade</label>
                            <select name="city" id="city" onChange={handleSelectCity}>
                                <option value="0"> Selecione uma Cidade</option>
                                {citys.map( city =>(
                                         <option key={city} value={city}>{city}</option>
                                    )
                                )}
                            </select>
                        </div>
                    </div>

                </fieldset>
                
                <fieldset>
                
                    <legend>
                        <h2> Itens de Coleta </h2>
                        <span> Selecione um ou mais itens abaixo</span>
                    </legend>


                    <ul className="items-grid">
                        {items.map(item => (
                            <li key={item.id} onClick={() =>handleSelectClick(item.id)}
                                className={selectedItens.includes(item.id)? 'selected' :''}
                            >
                            <img src={item.image_url} alt={item.title}></img>
                        <span>{item.title}</span>
                        </li>
                        ))}     
                    </ul>

                </fieldset>
                <button type="submit">Cadastrar ponto de coleta</button>
            </form>
           

        </div>
    );
      
}

export default CreatePoints;