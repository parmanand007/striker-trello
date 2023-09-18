import { databases } from "@/appwrite"
import { Column, TypedColumn,Board} from "@/typing";

export const getTodosGroupByColumn = async () => {

        const data = await databases.listDocuments(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
        );
        const todos = data.documents;
        // console.log("todos", todos)
        const columns = todos.reduce((acc, todo) => {
            if (!acc.get(todo.status)) {
                acc.set(todo.status, {
                    id: todo.status,
                    todos: []
                }
  
                )
            }
            acc.get(todo.status)!.todos.push({
                $id: todo.$id,
                $createdAt: todo.$createdAt,
                title: todo.title,
                status: todo.status,
                //check image is exist or not
                ...(todo.image && { image: JSON.parse(todo.image) })
            });
            return acc;
        }, new Map<TypedColumn, Column>());
        console.log("column", columns)
    

  //if columns does'nt have inprogress,todo and done
  //then addd with empty todos

  const columnTypes:TypedColumn[]=["todo","inprogress","done"];
  for (const columnType of columnTypes){
    if(!columns.get(columnType)){
        columns.set(columnType,{
            id:columnType,
            todos:[]
        })
    }
  }

// console.log("columns Type",columns)

//sortd columns

const sortedColumns = new Map(
    Array.from(columns.entries()).sort(
        (a,b)=>columnTypes.indexOf(a[0])-columnTypes.indexOf(b[0])
    )
);

const board:Board={
    columns:sortedColumns
}

return board


}

 