const RoomsData = require("./rooms")
const express = require("express");
const bodyParser = require("body-parser");
const CustomerData = require("./customers")
let result = [];
const app = express();

app
.use(bodyParser.json())
.get("/rooms", (req, res)=>{                        //Fetches all the Halls
    res.status(200).json({
        data:RoomsData
    })
})
.post("/createroom",(req, res)=>{                   //Create new Hall
        req.body.rooms.forEach((room)=>{
        if(room.Room_id && room.amenities && room.PricePerHr && room.RoomName && room.NoOfSeats){
            room.bookedStatus = "Available";
            RoomsData.push(room)
            res.end("Added Successfully")
            res.status(200).json({
            status:"success"
        })
        }else{
        res.writeHead(414, {"Content-Type":"text/html"})
        res.end("Invalid/Incomplete Data")
        }
    })

    }

)   
.get("/rooms/:id",(req,res)=>{                      //Fetches particluar hall with id
    res.status(200).json({
        data: RoomsData.find(
            (room)=> room.Room_id === parseInt(req.params.id)
            
        )
    })
 
})
.get("/booked",(req,res)=>{                          //Fetches all the  Booked-Halls
    res.status(200).json({
        data: RoomsData.filter(
            (room)=> room.bookedStatus === "Booked"
        )
    })
 
})
.get("/bookedCustomerDetails", (req, res)=>{         //Fetches all Customer details who booked Hall
    res.status(200).json({
        data:CustomerData
    })
})
.get("/available",(req,res)=>{                      //Fetches all the Available Hall to book
    res.status(200).json({
        data: RoomsData.filter(
            (room)=> room.bookedStatus === "Available"
        )
    })
 
})

.get("/bookedRoomDetails",(req,res)=>{               //Fetches all the Booked Hall Details
    CustomerData.forEach((customer)=>{
        customer.bookedStatus = "Booked"
        result.push(customer)
    })
    res.status(200).json({
        data:result
    })
 
})
.post("/bookroom",(req, res)=>{                         //Book a Hall from Available Halls
        req.body.bookrooms.forEach((bookroom)=>{
        data: RoomsData.forEach(
            (room)=>{ 
                if(room.Room_id === parseInt(bookroom.id)){
                    if(room.bookedStatus === "Available"){
                        room.bookedStatus = "Booked" 
                        let BookedDetails = {CustomerName:bookroom.customerName,RoomName:room.RoomName,Date:bookroom.Date,StartTime:bookroom.startTime,EndTime:bookroom.endTime}
                        CustomerData.push(BookedDetails);
                        res.writeHead(200, {"Content-Type":"text/html"})
                        res.end("Booked Successfully") 
                    }else{
                        res.end("Sorry...Already Booked") 
                    }

                }else{
                    res.end("Hall Not Found.. Enter valid ID")
                }
            }
        )

    })
})

.get("*", (req, res)=>{                                 //Default Route for invalid Paths
    res.writeHead(404, {"Content-Type":"text/html"})
    res.end("Not Found")
})

.listen(8000)