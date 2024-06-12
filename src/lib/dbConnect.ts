import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void>{
    if(connection.isConnected){
        console.log("DB already connected");
        return;
    }
    try{
        console.log("Connecting to DB");
        const db = await mongoose.connect(process.env.MONGODB_URI || '',{});
        // console.log("DB is connected with :" ,db);
        connection.isConnected=db.connections[0].readyState;
        console.log("DB connected successfully");
    }catch(e){
            console.log("DB connection failed, Error: " + e);
            process.exit(1);
    }
}

export default dbConnect;