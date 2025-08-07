import React from 'react'
import { FcOpenedFolder } from 'react-icons/fc'
import { base_api_url, base_app_url } from '../config/config'
import font from '../assets/images/font.png'
import pdf from '../assets/images/pdf.png'
import html from '../assets/images/html.png'
import js from '../assets/images/js.png'
import film from '../assets/images/film.png'
import exe from '../assets/images/exe.png'
import unknown from '../assets/images/unknown.png'

const ReturnFileType = ({ user_path, viewType, selectItem, setSelectItem, setPath, setElement, item }) => {


    const visitFolder = (t) => {
        setSelectItem([])
        setPath(t.path)
        setElement(t.path)
    }

    const select_item_onclick = (t) => {
        const checkItem = selectItem.find(i => i.path === t.path)
        if (checkItem) {
            const temp = selectItem.filter(i => i.path !== t.path)
            setSelectItem(temp)
        } else {
            setSelectItem([...selectItem, item])
        }
    }

    const sizeCalculate = (size) => {

        if (size) {
            if (size > 1024) {

                let md = size / 1024
                if (md > 1024) {
                    let gb = (mb / 1024).toFixed(2)

                    return `${gb} GB`
                } else {
                    return `${md.toFixed(2)} MB`
                }

            } else {
                return `${size.toFixed(2)} KB`
            }
        } else {
            if (size === 0) {
                return `${size} KB`
            }
        }

    }

    if (item.type === 'folder') {
        if (viewType === 'grid') {
            return <div onDoubleClick={() => visitFolder(item)} onClick={() => select_item_onclick(item)} className='w-full h-[80px] relative group select-none'>
                <div className={`absolute top-1 left-1 ${selectItem.includes(item) ? '' : 'hidden'} group-hover:block `}>
                    <input type="checkbox" readOnly checked={selectItem.includes(item)} className='checkbox !w-[15px] !h-[15px]' />
                </div>

                <div className={`flex justify-center items-center rounded-md cursor-pointer h-full flex-col ${selectItem.includes(item) ? 'bg-blue-500 text-white' : 'hover:bg-slate-100 text-black'}`}>
                    <span className='text-4xl'><FcOpenedFolder /></span>
                    <span>{item?.name?.slice(0, 10)}{item?.name?.length > 10 ? '...' : ''}</span>
                </div>
            </div>
        } else {
            return <div onDoubleClick={() => visitFolder(item)} onClick={() => select_item_onclick(item)} className={`flex justify-center items-center px-3 py-1 select-none ${selectItem.includes(item) ? "bg-blue-500 text-white" : "hover:bg-slate-100 text-black"}`}>
                <div className={`w-[60px] flex justify-start items-center`}>
                    <input type="checkbox" readOnly checked={selectItem.includes(item)} className='checkbox !w-[15px] !h-[15px]' />
                </div>
                <div className='w-full text-xs flex justify-start items-center gap-x-2'>
                    <span className='text-xl'><FcOpenedFolder /></span>
                    <span>{item.name}</span>
                </div>
                <div className='w-[300px] text-xs'>
                    <span>{item.modified}</span>
                </div>
                <div className='w-[80px] text-xs'>
                    <span>{sizeCalculate(item.size)}</span>
                </div>
            </div>
        }
    } else {
        if (['html', 'pdf', 'txt', 'js', 'exe'].includes(item.file_type)) {
            if (viewType === 'grid') {
                return <div onDoubleClick={() => visitFolder(item)} onClick={() => select_item_onclick(item)} className='w-full h-[80px] relative group select-none'>
                    <div className={`absolute top-1 left-1 ${selectItem.includes(item) ? '' : 'hidden'} group-hover:block `}>
                        <input type="checkbox" readOnly checked={selectItem.includes(item)} className='checkbox !w-[15px] !h-[15px]' />
                    </div>

                    <div className={`flex justify-center items-center rounded-md cursor-pointer h-full flex-col ${selectItem.includes(item) ? 'bg-blue-500 text-white' : 'hover:bg-slate-100 text-black'}`}>
                        {
                            item.file_type === 'txt' && <img src={font} alt='text' />
                        }
                        {
                            item.file_type === 'pdf' && <img src={pdf} alt='pdf' />
                        }
                        {
                            item.file_type === 'html' && <img src={html} alt='html' />
                        }
                        {
                            item.file_type === 'js' && <img src={js} alt='js' />
                        }
                        {
                            item.file_type === 'exe' && <img src={exe} alt='exe' />
                        }

                        <span>{item?.name?.slice(0, 10)}{item?.name?.length > 10 ? '...' : ''}</span>
                    </div>
                </div>
            } else {
                return <div onDoubleClick={() => visitFolder(item)} onClick={() => select_item_onclick(item)} className={`flex justify-center items-center px-3 py-1 select-none ${selectItem.includes(item) ? "bg-blue-500 text-white" : "hover:bg-slate-100 text-black"}`}>
                    <div className={`w-[60px] flex justify-start items-center`}>
                        <input type="checkbox" readOnly checked={selectItem.includes(item)} className='checkbox !w-[15px] !h-[15px]' />
                    </div>
                    <div className='w-full text-xs flex justify-start items-center gap-x-2'>
                        {
                            item.file_type === 'txt' && <img className='w-[18px] h-[18px]' src={font} alt='text' />
                        }
                        {
                            item.file_type === 'pdf' && <img className='w-[18px] h-[18px]' src={pdf} alt='pdf' />
                        }
                        {
                            item.file_type === 'html' && <img className='w-[18px] h-[18px]' src={html} alt='html' />
                        }
                        {
                            item.file_type === 'js' && <img className='w-[18px] h-[18px]' src={js} alt='js' />
                        }
                        {
                            item.file_type === 'exe' && <img className='w-[18px] h-[18px]' src={exe} alt='exe' />
                        }
                        <span>{item.name}</span>
                    </div>
                    <div className='w-[300px] text-xs'>
                        <span>{item.modified}</span>
                    </div>
                    <div className='w-[80px] text-xs'>
                        <span>{sizeCalculate(item.size)}</span>
                    </div>
                </div>
            }
        }
        else if (['mp4', 'mkv'].includes(item.file_type)) {
            if (viewType === 'grid') {
                return <div onDoubleClick={() => visitFolder(item)} onClick={() => select_item_onclick(item)} className='w-full h-[80px] relative group select-none'>
                    <div className={`absolute top-1 left-1 ${selectItem.includes(item) ? '' : 'hidden'} group-hover:block `}>
                        <input type="checkbox" readOnly checked={selectItem.includes(item)} className='checkbox !w-[15px] !h-[15px]' />
                    </div>

                    <div className={`flex justify-center items-center rounded-md cursor-pointer h-full flex-col ${selectItem.includes(item) ? 'bg-blue-500 text-white' : 'hover:bg-slate-100 text-black'}`}>
                        <img src={film} alt='text' />
                        <span>{item?.name?.slice(0, 10)}{item?.name?.length > 10 ? '...' : ''}</span>
                    </div>
                </div>
            } else {
                return <div onDoubleClick={() => visitFolder(item)} onClick={() => select_item_onclick(item)} className={`flex justify-center items-center px-3 py-1 select-none ${selectItem.includes(item) ? "bg-blue-500 text-white" : "hover:bg-slate-100 text-black"}`}>
                    <div className={`w-[60px] flex justify-start items-center`}>
                        <input type="checkbox" readOnly checked={selectItem.includes(item)} className='checkbox !w-[15px] !h-[15px]' />
                    </div>
                    <div className='w-full text-xs flex justify-start items-center gap-x-2'>
                        <img className='w-[16px] h-[17px]' src={film} alt='text' />
                        <span>{item.name}</span>
                    </div>
                    <div className='w-[300px] text-xs'>
                        <span>{item.modified}</span>
                    </div>
                    <div className='w-[80px] text-xs'>
                        <span>{sizeCalculate(item.size)}</span>
                    </div>
                </div>
            }
        }
        else if (['gif', 'jfif', 'JPEG', 'JPG', 'png', 'PNG', 'jpeg', 'jpg', 'webp'].includes(item.file_type)) {
            if (viewType === 'grid') {
                return <div onDoubleClick={() => visitFolder(item)} onClick={() => select_item_onclick(item)} className='w-full h-[80px] relative group select-none'>
                    <div className={`absolute top-1 left-1 ${selectItem.includes(item) ? '' : 'hidden'} group-hover:block `}>
                        <input type="checkbox" readOnly checked={selectItem.includes(item)} className='checkbox !w-[15px] !h-[15px]' />
                    </div>

                    <div className={`flex justify-center items-center rounded-md cursor-pointer h-full flex-col ${selectItem.includes(item) ? 'bg-blue-500 text-white' : 'hover:bg-slate-100 text-black'}`}>
                        <img className='w-[75%] h-[62%]' src={`${base_api_url}/files/${user_path}/${item.path}`} alt='text' />
                        <span className='text-xs text-center'>{item?.name?.slice(0, 10)}{item?.name?.length > 10 ? '...' : ''}</span>
                    </div>
                </div>
            } else {
                return <div onDoubleClick={() => visitFolder(item)} onClick={() => select_item_onclick(item)} className={`flex justify-center items-center px-3 py-1 select-none ${selectItem.includes(item) ? "bg-blue-500 text-white" : "hover:bg-slate-100 text-black"}`}>
                    <div className={`w-[60px] flex justify-start items-center`}>
                        <input type="checkbox" readOnly checked={selectItem.includes(item)} className='checkbox !w-[15px] !h-[15px]' />
                    </div>
                    <div className='w-full text-xs flex justify-start items-center gap-x-2'>
                        <img className='w-[16px] h-[17px]' src={`${base_api_url}/files/${user_path}/${item.path}`} alt='text' />

                        <span>{item.name}</span>
                    </div>
                    <div className='w-[300px] text-xs'>
                        <span>{item.modified}</span>
                    </div>
                    <div className='w-[80px] text-xs'>
                        <span>{sizeCalculate(item.size)}</span>
                    </div>
                </div>
            }
        }
    }
}

export default ReturnFileType