import {app} from './app';
import * as db from './db/index'

const start = async () =>{
    try{
        const client = await db.getClient();
        console.log("connected to db")
    }catch(err){
        console.log(err)
    }
    app.listen(8080, ()=>{
        console.log("listening on port 8080");
    })
}

start();

