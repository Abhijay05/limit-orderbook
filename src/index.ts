import express from "express";
import bodyParser from "body-parser";
export const app = express()
app.use(bodyParser.json());
interface Balances{
    [key: string]: number;
}
interface User {
    UserId: string;
    balances : Balances;
}
interface Order{
    UserId: string
    price: number;
    quantity: number;
}

const TICKER = "NIKE";
export const users: User[] =[{
    UserId:"1",
    balances:{
        NIKE:10,
        USD:50000
    }
},{
    UserId:"2",
    balances:{
        NIKE:10,
        USD:50000
    }
}];
const bids: Order[]=[];
const asks: Order[]=[];
app.post("/order", function(req, res){
    const type= req.body.type;
    const price = req.body.price;
    const quantity = req.body.quantity;
    const UserId = req.body.UserId;

    const remainingQuantity = fillOrder(type, price, quantity, UserId);
    if( remainingQuantity === 0){
        res.json({filledQuantity: quantity})
        return;
    }

    if (type == "bid"){
        bids.push({UserId, price, quantity: remainingQuantity});
        bids.sort((a, b) => b.price - a.price);
       
    } else {
        asks.push({UserId, price, quantity: remainingQuantity});
        asks.sort((a, b) => a.price - b.price);

    }
    res.json({filledQuantity: quantity- remainingQuantity});
})
app.get("/depth", function(req, res){
    const Depth: {
        [price: string]:{
            type: "bid" | "ask",
            quantity: number,
        }
    }={};
    for( let i=0; i<bids.length; i++){
        if(!Depth[bids[i].price]){
            Depth[bids[i].price] = {
                type: "bid",
                quantity: bids[i].quantity,
            }
    }
        else{
            Depth[bids[i].price].quantity += bids[i].quantity;
        }
    }   
    for(let i = 0; i< asks.length; i++){
        if(!Depth[asks[i].price]){
            Depth[asks[i].price] = {
                type: "ask",
                quantity: asks[i].quantity,
            }
        } else{
            Depth[asks[i].price].quantity += asks[i].quantity;
        }
    }
    res.json({ depth: Depth });

})

app.get("/balance/:UserId", function(req,res){
    const UserId= req.params.UserId;
    const user = users.find(user => user.UserId === UserId);
    if(!user){
        res.status(404).json({error: "User not found"});
        return;
    }
    res.json({ balances: user.balances });

});
app.get("/quote", (req, res) => {
  // TODO: Assignment
});
function flipBalance(askId, bidId, quantity, askPrice){
    const askUser = users.find(user => user.UserId === askId);
    const bidUser = users.find(user => user.UserId === bidId);
    if(!askUser || !bidUser){
        return;
    }
    askUser.balances["NIKE"] -= quantity;
    bidUser.balances["NIKE"] += quantity;
    askUser.balances["USD"] += quantity * askPrice;
    bidUser.balances["USD"] -= quantity * askPrice;
}
function fillOrder(type: string , price: number, quantity: number, UserId: string){
    let remainingQuantity = quantity;
    if(type === "bid"){
        for( let i = 0; i< asks.length; i++){
            if(asks[i].price> price){
                break;
            }
            if(asks[i].quantity<= remainingQuantity){
                flipBalance(asks[i].UserId, UserId, asks[i].quantity, asks[i].price);
                remainingQuantity -= asks[i].quantity;
                asks.splice(i,1);
            }else{
                flipBalance(asks[i].UserId, UserId, remainingQuantity, asks[i].price);
                asks[i].quantity -= remainingQuantity;
                remainingQuantity = 0;
               
            }

        }
    } else {
        for(let i =0; i<bids.length; i++){
            if(bids[i].price <price){
                break;
            }
            if(bids[i].quantity<= remainingQuantity){
                flipBalance(UserId, bids[i].UserId, bids[i].quantity, bids[i].price);
                remainingQuantity -= bids[i].quantity;
                bids.splice(i, 1);
            }else{
                flipBalance(UserId, bids[i].UserId, remainingQuantity, bids[i].price);
                bids[i].quantity -= remainingQuantity;
                remainingQuantity = 0;
                
            }
        }
    }
    
    return remainingQuantity;
}
export function resetOrderbook() {
  bids.length = 0;
  asks.length = 0;
  users[0].balances = { NIKE: 10, USD: 50000 };
  users[1].balances = { NIKE: 10, USD: 50000 };
}

export {TICKER};


