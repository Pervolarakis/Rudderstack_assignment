import {app} from './app';
import * as db from './db/index'

const start = async () =>{
    try{
        const client = await db.getClient();
        console.log("connected to db")
    }catch(err){
        console.log(err)
    }
    app.listen(process.env.PORT, ()=>{
        console.log(`listening on port ${process.env.PORT}`);
    })
}

start();

