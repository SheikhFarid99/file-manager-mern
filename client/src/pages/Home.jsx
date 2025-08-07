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
import Loader from '../components/Loader'
import ReturnFileType from '../components/ReturnFileType'
import Modal from '../components/Modal'
import toast from 'react-hot-toast'
import UploadProgress from '../components/UploadProgress'
import { useNavigate } from 'react-router-dom'
import { CiCloudOn } from 'react-icons/ci'

const Home = () => {

  const navigate = useNavigate()

  const { store, dispatch } = useAuthContext()
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
      setStorageSize(data.storageSize)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {

    if (store.token) {
      getFiles()
    }
  }, [])

  const [loader, setLoader] = useState(true)
  const [files, setFiles] = useState([])

  const getFile = async (dist) => {
    try {
      const { data } = await axios.get(`${base_api_url}/api/file-manager/list?file_path=${dist}`, config)
      setFiles(data.folderData)
      setStorageSize(data.storageSize)
      setLoader(false)

    } catch (error) {
      console.log(error)
      setLoader(false)
    }
  }

  useEffect(() => {
    getFile(path)
  }, [path])


  const redirectFolder = (index, type) => {
    const pathArray = path.split('\\')

    if (!type) {
      let pa = ""
      for (let i = 0; i <= index; i++) {
        if (pathArray[i] !== '') {
          pa = pa + '\\' + pathArray[i]
        }
      }
      setPath(pa)
      setElement(pa)
    } else {
      setPath("")
      setElement("")
    }
    setSelectItem([])
  }

  const [isOpen, setIsOpen] = useState(false)

  const onOpen = () => setIsOpen(true)
  const onClose = () => setIsOpen(false)

  const [isOpenDeleteModel, setDeleteModel] = useState(false)

  const onDeleteOpen = () => setDeleteModel(true)
  const onDeleteClose = () => setDeleteModel(false)


  const [createResLoader, setCreateResLoader] = useState(false)

  const createFolder = async (e) => {
    e.preventDefault()
    try {
      setCreateResLoader(true)
      const { data } = await axios.post(`${base_api_url}/api/file-manager/create`, {
        file_path: path,
        folder_name: folderName
      }, config)

      setCreateResLoader(false)
      setFolderName("")
      setLists(data.allData)
      setFiles(data.newData)
      onClose()
      toast.success(data.message)
    } catch (error) {
      console.log(error)
      setCreateResLoader(false)
      toast.error(error.response.data.message)
    }
  }

  const [progress, setProgress] = useState(0)
  const [uploadRes, setUploadRes] = useState(false)

  const uploadFiles = async (e) => {

    if (e.target.files.length > 0) {

      const formData = new FormData()

      for (let i = 0; i < e.target.files.length; i++) {
        formData.append('filesData', e.target.files[i])
      }
      formData.append('distPath', path)


      try {
        await axios.post(`${base_api_url}/api/file-manager/files-upload`, formData, {
          ...config,
          onUploadProgress: (event) => {
            setProgress(parseInt(event.loaded / event.total) * 100)
          }
        })
        setUploadRes(true)
      } catch (error) {
        console.log(error)
      }
    }
  }

  useEffect(() => {
    if (progress === 100 && uploadRes) {
      setProgress(0)
      getFile(path)
    }
  }, [progress, uploadRes])

  const refresh = () => {
    setElement("")
    setElementIds([])
    setViewType('grid')
    setSelectItem([])
    setPath("")
  }

  const moveData = (type) => {
    setMoveType(type)
    setCopyData(selectItem)
  }

  const selectAll = (e) => {
    if (e.target.checked) {
      setSelectItem(files)
    } else {
      setSelectItem([])
    }
  }

  const move = async () => {
    try {
      setLoader(true)
      const { data } = await axios.post(`${base_api_url}/api/file-manager/move-data`, {
        items: copyData,
        filePath: path,
        type: moveType
      }, config)
      setLoader(false)
      setCopyData([])
      setMoveType("")
      setFiles(data.folderData)
      setSelectItem([])
      getFiles()
    } catch (error) {
      setLoader(false)
      toast.error(error.response?.data?.message)
    }
  }

  const deleteItem = async () => {

    onDeleteClose()

    try {
      setLoader(true)
      const { data } = await axios.post(`${base_api_url}/api/file-manager/delete`, {
        items: selectItem,
        filePath: path
      }, config)
      setLoader(false)
      setFiles(data.folderData)
      setSelectItem([])
      getFiles()
      toast.success(data.message)
    } catch (error) {
      setLoader(false)
    }
  }

  const [renameResLoader, setResnameResLoader] = useState(false)
  const [oldItemName, setOldItemName] = useState("")
  const [itemName, setItemName] = useState("")
  const [isRenameOpen, setRenameOpen] = useState(false)

  const onRenameOpen = () => {
    setRenameOpen(true)
    setItemName(selectItem[0].name)
    setOldItemName(selectItem[0].name)
  }

  const onRenameClose = () => {
    setRenameOpen(false)
    setItemName("")
    setOldItemName("")
    setSelectItem([])
  }

  const rename_Item = async (e) => {

    e.preventDefault()

    try {
      setLoader(true)
      const { data } = await axios.post(`${base_api_url}/api/file-manager/rename`, {
        newName: itemName,
        oldName: oldItemName,
        filePath: path
      }, config)
      setLoader(false)
      setFiles(data.folderData)
      onRenameClose()
      getFiles()
      toast.success(data.message)
    } catch (error) {
      setLoader(false)
      toast.error(error.response?.data?.message)
    }

  }

  const Logout = () => {
    localStorage.removeItem('auth-token')
    dispatch({
      type: "logout"
    })
    navigate('/signin')

  }

  const [percentage, setPercentage] = useState(0)
  const [useStorage, setUseStorage] = useState({
    size: 0,
    unit: 'KB'
  })

  useEffect(() => {

    if (storageSize > 1024) {

      let mb = storageSize / 1024
      let par = ((mb * 100) / 15360).toFixed(2)
      setPercentage(par)

      if (mb > 1024) {

        let gb = (mb / 1024).toFixed(2)
        setUseStorage({
          size: gb,
          unit: 'GB'
        })

      } else {
        setUseStorage({
          size: mb.toFixed(2),
          unit: 'MB'
        })

      }

    } else {

      setUseStorage({
        size: storageSize,
        unit: 'KB'
      })
      setPercentage(0)
    }
  }, [storageSize])


  return (
    <div className='w-screen h-screen flex justify-center items-center bg-gray-200'>
      <div className='w-[70vw] bg-white shadow-lg h-[90vh] relative overflow-hidden'>
        {
          progress !== 0 && <UploadProgress progress={progress} />
        }
        <Modal isOpen={isOpen} onClose={onClose} title={"Folder"} >
          <form onSubmit={createFolder} className='p-3'>
            <input onChange={(e) => setFolderName(e.target.value)} value={folderName} required type="text" className='input-field !w-full' placeholder='folder name' />
            <div className='flex justify-end items-center mt-3'>
              <button className='px-6 py-[6px] hover:bg-blue-600 outline-none bg-blue-500 hover:shadow-lg hover:shadow-blue-600/30 rounded-md text-white cursor-pointer' >{
                createResLoader ? 'Loading...' : 'Add'
              }</button>
            </div>
          </form>
        </Modal>

        <Modal isOpen={isRenameOpen} onClose={onRenameClose} title={"Rename"} >
          <form onSubmit={rename_Item} className='p-3'>
            <input onChange={(e) => setItemName(e.target.value)} value={itemName} required type="text" className='input-field !w-full' placeholder='name' />
            <div className='flex justify-end items-center mt-3'>
              <button className='px-6 py-[6px] hover:bg-blue-600 outline-none bg-blue-500 hover:shadow-lg hover:shadow-blue-600/30 rounded-md text-white cursor-pointer' >{
                renameResLoader ? 'Loading...' : 'Rename'
              }</button>
            </div>
          </form>
        </Modal>

        <Modal isOpen={isOpenDeleteModel} onClose={onDeleteClose} title={`Delete ${selectItem.length} items`} >
          <div className='flex justify-center items-center gap-y-4 flex-col p-4'>
            <span className='text-2xl'>Are you sure?</span>
            <button onClick={deleteItem} className='px-6 py-[6px] hover:bg-red-600 outline-none bg-red-500 hover:shadow-lg hover:shadow-red-600/30 rounded-md text-white cursor-pointer' >Delete</button>
          </div>
        </Modal>

        <div className='w-full h-full'>
          <header className='h-[45px] flex justify-between items-center px-3 py-2 bg-slate-100 border border-slate-200 gap-x-5'>
            <div className='w-full'>
              {
                (!selectItem.length > 0 && !copyData.length > 0) && <div>
                  <div className='flex justify-start items-center gap-x-2'>

                    <button onClick={onOpen} className='flex justify-center items-center gap-x-1 cursor-pointer hover:bg-gray-700 text-gray-700 hover:text-white px-2 py-[6px] rounded-md'>
                      <FaPlus className='text-sm mt-[1px]' />
                      <span className='text-sm'>New Folder</span>
                    </button>

                    <label htmlFor='upload' className='flex justify-center items-center gap-x-1 cursor-pointer hover:bg-gray-700 text-gray-700 hover:text-white px-2 py-[6px] rounded-md'>
                      <HiUpload className='text-md mt-[1px]' />
                      <span className='text-sm'>Upload</span>
                      <input onChange={uploadFiles} type="file" multiple id='upload' className='hidden' />
                    </label>

                    <button onClick={refresh} className='flex justify-center items-center gap-x-1 cursor-pointer hover:bg-gray-700 text-gray-700 hover:text-white px-2 py-[6px] rounded-md'>
                      <BiRefresh className='text-sm mt-[1px]' />
                      <span className='text-sm'>Refresh</span>
                    </button>

                    <button onClick={Logout} className='flex justify-center items-center gap-x-1 cursor-pointer hover:bg-gray-700 text-gray-700 hover:text-white px-2 py-[6px] rounded-md'>
                      <AiOutlineLogout className='text-sm mt-[1px]' />
                      <span className='text-sm'>Logout</span>
                    </button>
                  </div>

                </div>
              }

              {
                (selectItem.length > 0 || copyData.length > 0) && <div className='w-full flex justify-between items-center'>
                  <div className='flex justify-start items-center gap-x-1'>

                    <button onClick={() => moveData('cut')} className='flex justify-center items-center gap-x-1 cursor-pointer hover:bg-gray-700 text-gray-700 hover:text-white px-2 py-[6px] rounded-md'>
                      <TbCut className='text-sm mt-[1px]' />
                      <span className='text-sm'>Cut</span>
                    </button>

                    <button onClick={() => moveData('copy')} className='flex justify-center items-center gap-x-1 cursor-pointer hover:bg-gray-700 text-gray-700 hover:text-white px-2 py-[6px] rounded-md'>
                      <IoCopyOutline className='text-sm mt-[1px]' />
                      <span className='text-sm'>Copy</span>
                    </button>

                    {
                      copyData.length > 0 && <button onClick={move} className='flex justify-center items-center gap-x-1 cursor-pointer hover:bg-gray-700 text-gray-700 hover:text-white px-2 py-[6px] rounded-md'>
                        <GoPaste className='text-sm mt-[1px]' />
                        <span className='text-sm'>paste</span>
                      </button>
                    }


                    {
                      (copyData.length === 0 && selectItem.length < 2) && <button onClick={onRenameOpen} className='flex justify-center items-center gap-x-1 cursor-pointer hover:bg-gray-700 text-gray-700 hover:text-white px-2 py-[6px] rounded-md'>
                        <FaEdit className='text-sm mt-[1px]' />
                        <span className='text-sm'>Rename</span>
                      </button>

                    }

                    {
                      copyData.length === 0 && <button onClick={onDeleteOpen} className='flex justify-center items-center gap-x-1 cursor-pointer hover:bg-gray-700 text-gray-700 hover:text-white px-2 py-[6px] rounded-md'>
                        <FaTrash className='text-sm mt-[1px]' />
                        <span className='text-sm'>Delete</span>
                      </button>
                    }


                  </div>

                  <button onClick={() => {
                    setSelectItem([])
                    setCopyData([])
                    setMoveType("")
                  }} className='flex justify-center items-center gap-x-1 cursor-pointer hover:bg-gray-700 text-gray-700 hover:text-white px-2 py-[6px] rounded-md'>
                    <span>{selectItem.length} items selected</span>
                    <span className='text-sm'>
                      <IoCloseSharp className='pt-[3px] text-lg' />
                    </span>
                  </button>

                </div>

              }


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
              <div className='text-gray-700 w-full py-2 px-3 text-sm bottom-0 absolute h-[73px] flex flex-col gap-y-1 bg-slate-200'>
                <div className='flex justify-start gap-x-1 items-center'>
                  <span><CiCloudOn /></span>
                  <span>Storage {percentage}%</span>
                </div>
                <div className='w-full bg-slate-400 rounded-md h-[5px] overflow-hidden'>
                  <div style={{ width: `${percentage}%` }} className='bg-blue-500 h-full'></div>
                </div>
                <p>{useStorage.size}{useStorage.unit} of 15 GB used</p>
              </div>
            </div>

            <div className='w-[calc(100%-300px)]'>
              <div className='h-[80px] w-full grid grid-cols-1 text-black'>
                <div className='flex justify-between items-center px-3 py-1 border-b border-slate-200 h-full'>
                  <div className='breadcrumbs text-xs'>
                    <ul className='flex justify-start items-center gap-x-2'>
                      <li onClick={() => redirectFolder("", "root")} className='cursor-pointer flex justify-center items-center'>
                        <span className='text-xl mr-[4px]'><FcOpenedFolder /></span>
                        <span> Root</span>
                      </li>
                      {
                        path && path.split('/').length > 0 && path.split('\\').map((p, i) => {
                          if (p) {
                            return <li onClick={() => redirectFolder(i)} key={i} className='cursor-pointer flex justify-center items-center'>
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
                    <input checked={selectItem.length > 0 && selectItem.length === files.length} onChange={(e) => selectAll(e)} type="checkbox" className='checkbox !w-[15px] !h-[15px]' />
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

              <div className='w-full h-[calc(100%-80px)] flex justify-start items-start overflow-y-scroll flex-col relative'>
                {
                  loader && <Loader />
                }
                {
                  files && files.length > 0 ? <div className={`w-full grid ${viewType === 'list' ? 'grid-cols-1' : 'grid-cols-7 gap-3 p-3'}`}>
                    {
                      files.map((f, i) => <ReturnFileType
                        user_path={store?.user?.user_path}
                        viewType={viewType}
                        key={i}
                        selectItem={selectItem}
                        setSelectItem={setSelectItem}
                        setPath={setPath}
                        setElement={setElement}
                        item={f}

                      />)
                    }
                  </div> :
                    <div className='flex justify-center items-center flex-col h-full w-full rounded-md text-black cursor-pointer'>
                      <span className='text-5xl'><FcOpenedFolder /></span>
                      <span className='text-center text-sm'>This folder is empty</span>
                    </div>
                }
              </div>

            </div>

          </div>
        </div>
      </div>
    </div >
  )
}

export default Home