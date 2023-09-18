'use client'

import React, { useEffect, useState } from 'react'
import { DraggableProvidedDragHandleProps,DraggableProvidedDraggableProps } from 'react-beautiful-dnd'
import {Todo,TypedColumn} from "@/typing"
import { XCircleIcon } from '@heroicons/react/20/solid'
import { useBoardStore } from '@/store/BordStore'
// import { getURL } from 'next/dist/shared/lib/utils'
import getUrl from '@/lib/getUrl'
import Image from 'next/image'
type Props ={
    todo:Todo;
    index:number;
    id:TypedColumn;
    innerRef:(element:HTMLElement | null)=>void;
    draggableProps:DraggableProvidedDraggableProps;
    dragHandleProps:DraggableProvidedDragHandleProps |null | undefined
}

const TodoCard = ({
    todo,
    index,
    id,
    innerRef,
    draggableProps,
    dragHandleProps,
}:Props) => {

  const deleteTask  = useBoardStore((state)=>state.deleteTask)
  const [imageUrl,setImageUrl] = useState<string |null>(null);

  useEffect(()=>{
    // console.log("check image useeffect")
    console.log("check image ",todo.image)
    if(todo.image){
      const fetchImage = async() =>{
        const url = await getUrl(todo.image!)
        if (url){
          setImageUrl(url.toString())
        }
      }
      fetchImage();
    }
  },[todo])
  // {console.log("image url",imageUrl)}
  return (
    <div
    className='bg-white rounded-md space-y-2 drop-shadow-md'
    {...draggableProps}
    {...dragHandleProps}
    ref={innerRef}
    
    >
      <div className='flex justify-between items-center p-5'>
        <p>{todo.title}</p>
        <button
        onClick={()=>deleteTask(index,todo,id)}
        className='text-red-500 hover:text-red-600'>
            <XCircleIcon className='ml-5 h-8 w-8' />
        </button>
      </div>
      {imageUrl && (
        <div className='h-full w-full rounded-b-md'>
          <Image 
          src={imageUrl}
          alt="Task image"
          width={400}
          height={200}
          className='w-full object-contain rounded-b-md'
          />

        </div>
      )}
    </div>
  )
}

export default TodoCard