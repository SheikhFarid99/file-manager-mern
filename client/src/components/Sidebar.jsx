import React from 'react'
import { FcOpenedFolder } from 'react-icons/fc'
import { IoIosArrowForward } from 'react-icons/io'

const Sidebar = ({ folderItems,type }) => {


    const Folder = ({ name, items, id, path, type }) => {
        return <div className='overflow-hidden transition-all duration-500'>
            <div className='h-[40px] absolute hover:bg-slate-200 w-full left-0'></div>
            <li className='flex w-full justify-center items-center relative h-full'>
                <div >
                    {
                        items?.length > 0 && <div>
                            <span><IoIosArrowForward /></span>
                        </div>
                    }
                    <div>
                        <span><FcOpenedFolder /></span>
                        <span>{name}</span>
                    </div>
                </div>
            </li>
            {
                items && items.map((item) => (
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