import React from 'react'
import { FcOpenedFolder } from 'react-icons/fc'
import { IoIosArrowForward } from 'react-icons/io'

const Sidebar = ({
    folderItems,
    type,
    setElement,
    setPath,
    element,
    setElementIds,
    storageSize,
    elementIds,
    setSelectItem
}) => {


    const toggleFolder = (id) => {

        const check = elementIds.find(e => e === id)

        if (check) {
            const temp = elementIds.filter(e => e !== id)
            setElementIds(temp)
        } else {
            setElementIds([...elementIds, id])
        }
    }

    const viewFolder = (item) => {

        setSelectItem([])
        setElement(item.path)
        setPath(item.path)

    }



    const Folder = ({ name, items, id, path, type }) => {
        return <div
            id={id}
            style={{
                height: elementIds.includes(id) ? 'auto' : '40px',
                paddingLeft: '12px',
                display: 'block',
                position: 'relative'
            }}
            className='overflow-hidden transition-all duration-500'>
            <div className={`h-[40px] absolute hover:bg-slate-200 w-full left-0 ${element === path ? 'bg-blue-500' : ''}`}></div>
            <li className='flex w-full justify-center items-center relative h-full'>
                <div className={` ${element === path ? 'text-white' : 'text-black'} font-normal ${items?.length > 0 ? 'pl-[12px]' : 'pl-[30px]'} pr-[8px] flex justify-start items-center gap-[8px] w-full cursor-pointer relative  `} >
                    {
                        items?.length > 0 && <div className={`${elementIds.includes(id) ? 'rotate-90' : 'rotate-0'} absolute `}>
                            <span onClick={() => toggleFolder(id)} className='text-xs'><IoIosArrowForward /></span>
                        </div>
                    }
                    <div onClick={() => viewFolder({ path, id, type, name })} className={` w-full flex justify-start items-center gap-x-1 ${items?.length > 0 ? 'pl-[18px]' : ''} `}>
                        <span><FcOpenedFolder /></span>
                        <span>{name}</span>
                    </div>
                </div>
            </li>
            {
                items && items.length > 0 && items.map((item) => (
                    <Item key={item.id} {...item} />
                ))
            }
        </div>
    }

    const Item = ({ name, path, items, id, type, parentId }) => {
        return <Folder name={name} path={path} type={type} parentId={parentId} id={id} items={items} />
    }

    const FileTree = ({ data }) => {
        return <div>
            {
                data.map((item) => (
                    <Item path={''} key={item.id} {...item} type={type} parentId={item.id} />
                ))
            }
        </div>
    }
    return (
        <div className='w-full h-full'>
            <ul className='h-[calc(100%-73px)] overflow-y-auto relative'>
                {
                    <FileTree data={folderItems} />
                }
            </ul>
        </div>
    )
}

export default Sidebar