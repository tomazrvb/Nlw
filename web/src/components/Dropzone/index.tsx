import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import './style.css'
import {FiUpload} from 'react-icons/fi'


interface Props{
  onFileup:(file: File) => void;
}

const  Dropzone: React.FC<Props> =  ({onFileup}) => {



  const [slectedFileUrl,setslectedFileUrl] = useState('')
  
  const onDrop = useCallback(acceptedFiles => {
      const file = acceptedFiles[0]

      const fileUrl = URL.createObjectURL(file)
      setslectedFileUrl(fileUrl)
      onFileup(file)
  }, [onFileup])
  const {getRootProps, getInputProps} = useDropzone({onDrop, accept:'image/*'})
  return (
    <div className='dropzone' {...getRootProps()}>
      <input {...getInputProps()} accept='image/*'/>
      { slectedFileUrl
        ? <img src={slectedFileUrl} alt='point tubnail' />
        : (
          <p>
            <FiUpload />
            Imagem do Estabelecimento
          </p>
        )
      }
      
    </div>
  )
}

export default Dropzone;