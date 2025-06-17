import React, { useEffect } from 'react'
import useAuthContext from '../context/UseAuthContext'
import axios from 'axios'
import { base_api_url } from '../config/config'
import { useState } from 'react'
import Sidebar from '../components/Sidebar'

const Home = () => {

  const { store } = useAuthContext()
  const [lists, setLists] = useState([])

  const [element, setElement] = useState("")
  const [elementIds, setElementIds] = useState([])

  const [path, setPath] = useState('')
  const [viewType, setViewType] = useState('grid')

  const [selectItem, setSelectItem] = useState([])

  const [folderName, setFolderName] = useState('')

  const [copyData, setCopyData] = useState([])

  const [moveType, setMoveType] = useState('')

  const [storageSize, setStorageSize] = useState(0)

  const config = {
    headers: {
      Authorization: `Bearer ${store.token}`
    }
  }

  const getFiles = async () => {
    try {
      const { data } = await axios.get(`${base_api_url}/api/file-manager/lists`, config)
      setLists(data.folderData)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {

    if (store.token) {
      getFiles()
    }
  }, [])

  return (
    <div className='w-screen h-screen flex justify-center items-center bg-gray-200'>
      <div className='w-[70vw] bg-white shadow-lg h-[90vh] relative overflow-hidden'>
        <div className='w-full h-full'>
          <header className='h-[45px]'>

          </header>
          <div className='w-full h-[calc(100%-45px)] min-w-[500px]'>
            <div className='w-[300px] border-l border-r h-full relative'>
              {
                lists && lists.length > 0 && <Sidebar
                  folderItems={lists}
                  setElement={setElement}
                  setPath={setPath}
                  path={path}
                  element={element}
                  setElementIds={setElementIds}
                  storageSize={storageSize}
                  elementIds={elementIds}
                  setSelectItem={setSelectItem}
                />
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home