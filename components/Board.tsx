'use client';
import {useEffect} from 'react'
import {DragDropContext, Droppable} from 'react-beautiful-dnd'
import {useBoardStore} from "@/store/BordStore"
import Column from './Column';

function Board () {
  const [board,getBoard,setBoardState,updateTodoInDB] = useBoardStore((state)=>[
    state.board,
    state.getBoard,
    state.setBoardState,
    state.updateTodoInDB
  ]); 

useEffect(()=>{
// getting board
 getBoard(); 

},[getBoard])
console.log("final board",board)
const handleOnDragEnd =(result:DropResult)=>{
const {destination,source,type} =result;

//check if user draggged card outside
if(!destination) return;

//handle column drag
if(type==="column"){
  const entries = Array.from(board.columns.entries());
  const [removed]= entries.splice(source.index,1)
  entries.splice(destination.index,0,removed);
  const rearrangedColumns = new Map(entries);
  setBoardState({
    ...board,
    columns: rearrangedColumns
  })

}

//nested rows in each column

const columns = Array.from(board.columns);
const startColIndex = columns[Number(source.droppableId)]
const finishColIndex = columns[Number(destination.droppableId)]

const startCol:Column = {
  id:startColIndex[0],
  todos:startColIndex[1].todos,
}

const finishCol:Column ={
  id: finishColIndex[0],
  todos:finishColIndex[1].todos,
};

console.log("source",startCol,"destination",finishCol)
 
if (!startCol || !finishCol) return;
if (source.index === destination.index && startCol ===finishCol) return;


const newTodos = startCol.todos;
const [todoMoved]= newTodos.splice(source.index ,1)
console.log("new todos",newTodos,"todo moved",todoMoved)

if (startCol.id===finishCol.id){
  //same column drag
  newTodos.splice(destination.index,0,todoMoved)
  const newCol={
    id:startCol.id,
    todos:newTodos,

  }
  const newColumns = new Map(board.columns) //createing copy
  newColumns.set(startCol.id,newCol);
  setBoardState({...board,columns:newColumns})
}
else{
  //dragging in another column
  const finishTodos = Array.from(finishCol.todos);
  console.log("source and desitination col is not same")
  console.log("finishTodos initial",finishTodos)
  finishTodos.splice(destination.index,0,todoMoved);
  console.log("finishTodos final",finishTodos)
  const newColumns = new Map(board.columns);
  const newCol ={
    id:startCol.id,
    todos:newTodos,
  };
  newColumns.set(startCol.id,newCol);
  newColumns.set(finishCol.id,{
    id:finishCol.id,
    todos:finishTodos
  })
  console.log("new col is ",newColumns)
  //update Db 
  updateTodoInDB(todoMoved,finishCol)

  setBoardState({...board,columns:newColumns})
}

}
{console.log("board todo",board.columns.entries())}
return (
   <DragDropContext onDragEnd={handleOnDragEnd}>
    <Droppable droppableId='board' direction='horizontal' type="column">
      
       {(provided)=><div
       className='grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto'
       {...provided.droppableProps}
       ref={provided.innerRef}
 >
        {
          Array.from(board.columns.entries()).map(([id,column],index)=>(
                 <Column
                 key={id}
                 id={id}
                 todos={column.todos}
                 index={index}
                 
                 />
          ))
        }
        </div>} 
    </Droppable>
  </DragDropContext>

  
);
}

export default Board
// 'use client';
// import { useState,useEffect } from 'react'
 
// export default function Counter() {
//   const [count, setCount] = useState(0)

//   useEffect(() => {
//      console.log("count is",count)  
      
//   }, [count])
//   return (
//     <div>
//       <p>You clicked {count} times</p>
//       <button onClick={() => {let a=count;
//       a+=1;
//         setCount(a)}}>Click me</button>
//     </div>
//   )
// }