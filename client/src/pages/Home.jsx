import React, { useEffect } from 'react'
import useAuthContext from '../context/UseAuthContext'
import axios from 'axios'
import { base_api_url } from '../config/config'
import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import { FaEdit, FaList, FaPlus, FaTrash } from 'react-icons/fa'
import { HiUpload } from 'react-icons/hi'
import { BiRefresh } from 'react-icons/bi'
import { AiOutlineLogout } from 'react-icons/ai'
import { IoCloseSharp, IoCopyOutline, IoGridSharp } from 'react-icons/io5'
import { TbCut } from 'react-icons/tb'
import { GoPaste } from 'react-icons/go'
import { FcOpenedFolder } from 'react-icons/fc'
import { IoIosArrowForward } from "react-icons/io";

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

  console.log(path)

  return (
    <div className='w-screen h-screen flex justify-center items-center bg-gray-200'>
      <div className='w-[70vw] bg-white shadow-lg h-[90vh] relative overflow-hidden'>
        <div className='w-full h-full'>
          <header className='h-[45px] flex justify-between items-center px-3 py-2 bg-slate-100 border border-slate-200 gap-x-5'>
            <div className='w-full'>

              {/* <div>
                <div className='flex justify-start items-center gap-x-2'>

                  <button className='flex justify-center items-center gap-x-1 cursor-pointer hover:bg-gray-700 text-gray-700 hover:text-white px-2 py-[6px] rounded-md'>
                    <FaPlus className='text-sm mt-[1px]' />
                    <span className='text-sm'>New Folder</span>
                  </button>

                  <label htmlFor='upload' className='flex justify-center items-center gap-x-1 cursor-pointer hover:bg-gray-700 text-gray-700 hover:text-white px-2 py-[6px] rounded-md'>
                    <HiUpload className='text-md mt-[1px]' />
                    <span className='text-sm'>Upload</span>
                    <input type="file" multiple id='upload' className='hidden' />
                  </label>

                  <button className='flex justify-center items-center gap-x-1 cursor-pointer hover:bg-gray-700 text-gray-700 hover:text-white px-2 py-[6px] rounded-md'>
                    <BiRefresh className='text-sm mt-[1px]' />
                    <span className='text-sm'>Refresh</span>
                  </button>

                  <button className='flex justify-center items-center gap-x-1 cursor-pointer hover:bg-gray-700 text-gray-700 hover:text-white px-2 py-[6px] rounded-md'>
                    <AiOutlineLogout className='text-sm mt-[1px]' />
                    <span className='text-sm'>Logout</span>
                  </button>
                </div>

              </div> */}

              <div className='w-full flex justify-between items-center'>
                <div className='flex justify-start items-center gap-x-1'>

                  <button className='flex justify-center items-center gap-x-1 cursor-pointer hover:bg-gray-700 text-gray-700 hover:text-white px-2 py-[6px] rounded-md'>
                    <TbCut className='text-sm mt-[1px]' />
                    <span className='text-sm'>Cut</span>
                  </button>

                  <button className='flex justify-center items-center gap-x-1 cursor-pointer hover:bg-gray-700 text-gray-700 hover:text-white px-2 py-[6px] rounded-md'>
                    <IoCopyOutline className='text-sm mt-[1px]' />
                    <span className='text-sm'>Copy</span>
                  </button>

                  <button className='flex justify-center items-center gap-x-1 cursor-pointer hover:bg-gray-700 text-gray-700 hover:text-white px-2 py-[6px] rounded-md'>
                    <GoPaste className='text-sm mt-[1px]' />
                    <span className='text-sm'>paste</span>
                  </button>

                  <button className='flex justify-center items-center gap-x-1 cursor-pointer hover:bg-gray-700 text-gray-700 hover:text-white px-2 py-[6px] rounded-md'>
                    <FaEdit className='text-sm mt-[1px]' />
                    <span className='text-sm'>Rename</span>
                  </button>


                  <button className='flex justify-center items-center gap-x-1 cursor-pointer hover:bg-gray-700 text-gray-700 hover:text-white px-2 py-[6px] rounded-md'>
                    <FaTrash className='text-sm mt-[1px]' />
                    <span className='text-sm'>Delete</span>
                  </button>



                </div>

                <button className='flex justify-center items-center gap-x-1 cursor-pointer hover:bg-gray-700 text-gray-700 hover:text-white px-2 py-[6px] rounded-md'>
                  <span>3 items selected</span>
                  <span className='text-sm'>
                    <IoCloseSharp className='pt-[3px] text-lg' />
                  </span>
                </button>

              </div>



            </div>

            <div className='flex justify-center items-center gap-x-2'>
              <div onClick={() => setViewType('grid')} className={`flex justify-center items-center w-[30px] h-[30px] ${viewType === 'grid' ? 'bg-slate-200' : ''} text-black cursor-pointer rounded `}>
                <span><IoGridSharp /></span>
              </div>
              <div onClick={() => setViewType('list')} className={`flex justify-center items-center w-[30px] h-[30px] ${viewType === 'list' ? 'bg-slate-200' : ''} text-black cursor-pointer rounded `}>
                <span><FaList /></span>
              </div>
            </div>


          </header>
          <div className='w-full h-[calc(100%-45px)] min-w-[500px] flex'>
            <div className='w-[300px] border-slate-200 border-r h-full relative'>
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

            <div className='w-[calc(100%-300px)]'>
              <div className='h-[80px] w-full grid grid-cols-1 text-black'>
                <div className='flex justify-between items-center px-3 py-1 border-b border-slate-200 h-full'>
                  <div className='breadcrumbs text-xs'>
                    <ul className='flex justify-start items-center gap-x-2'>
                      <li className='cursor-pointer flex justify-center items-center'>
                        <span className='text-xl mr-[4px]'><FcOpenedFolder /></span>
                        <span> Root</span>
                      </li>
                      {
                        path && path.split('/').length > 0 && path.split('\\').map((p, i) => {
                          if (p) {
                            return <li key={i} className='cursor-pointer flex justify-center items-center'>
                              <span className='text-md'><IoIosArrowForward /></span>
                              <span className='text-xl mr-[4px]'><FcOpenedFolder /></span>
                              <span>{p}</span>
                            </li>
                          }
                        })
                      }
                    </ul>
                  </div>
                  <input type="text" placeholder='search' className='input-field !py-[5px]' />
                </div>

                <div className='flex bg-gray-100 justify-center items-center px-3 py-1 border-b border-slate-200'>
                  <div className='w-[60px] flex justify-start items-center'>
                    <input type="checkbox" className='checkbox !w-[15px] !h-[15px]' />
                  </div>
                  <div className='w-full text-xs'>
                    <span>Name</span>
                  </div>

                  <div className='w-[300px] text-xs'>
                    <span>Modified</span>
                  </div>

                  <div className='w-[80px] text-xs'>
                    <span>Size</span>
                  </div>


                </div>


              </div>
            </div>

          </div>
        </div>
      </div>
    </div >
  )
}

export default Home