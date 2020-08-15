var express = require('express');
var http = require('http')
var cors = require('cors')
var bp = require('body-parser')
var soc = require('socket.io')
var app = express();
// app.use(cors())
// app.use(bp.json())
var io = soc();
var port = process.env.PORT || 5000
const cent = 35/2
var rooms ={}
var uid_room={}
var players = {}
var current_turn = {}
var cities={
    start:{x:5,y:285,r:255,g:255,b:255,cost:-1,category:'quest',start:true,owner:null,upgrades:[],buyingPrice:100,sellingPrice:80,name:'START',version:0,sub_col:[255,255,255]},
    delhi:{x:5,y:245,r:141,g:187,b:68,cost:-1,category:'too_low',owner:null,upgrades:[],buyingPrice:100,sellingPrice:80,name:'DELHI',version:0,sub_col:[168,203,109]},
    rio:{x:5,y:205,r:141,g:187,b:68,cost:-1,category:'too_low',owner:null,upgrades:[],buyingPrice:100,sellingPrice:80,name:'RIO',version:0,sub_col:[168,203,109]},
    bangkok:{x:5,y:165,r:89,g:180,b:246,cost:-1,category:'low',owner:null,upgrades:[],buyingPrice:100,sellingPrice:80,name:'BANGKOK',version:0,sub_col:[158,213,252]},
    harbor:{x:5,y:125,r:240,g:250,b:253,cost:-1,category:'special',owner:null,upgrades:[],buyingPrice:100,sellingPrice:80,name:'HARBOR',version:0,sub_col:[240,250,253]},
    cairo:{x:5,y:85,r:89,g:180,b:246,cost:-1,category:'low',owner:null,upgrades:[],buyingPrice:100,sellingPrice:80,name:'CAIRO',version:0,sub_col:[158,213,252]},
    madrid:{x:5,y:45,r:89,g:180,b:246,cost:-1,category:'low',owner:null,upgrades:[],buyingPrice:100,sellingPrice:80,name:'MADRID',version:0,sub_col:[158,213,252]},
    question:{x:5,y:5,r:255,g:255,b:255,cost:-1,category:'quest',owner:null,upgrades:[],buyingPrice:100,sellingPrice:80,name:'?',version:0,sub_col:[255,255,255]},
    djakarta:{x:45,y:5,r:174,g:63,b:107,cost:-1,category:'below_avg',owner:null,upgrades:[],buyingPrice:100,sellingPrice:80,name:'JAKARTA',version:0,sub_col:[218,80,134]},
    berlin:{x:85,y:5,r:174,g:63,b:107,cost:-1,category:'below_avg',owner:null,upgrades:[],buyingPrice:100,sellingPrice:80,name:'BERLIN',version:0,sub_col:[218,80,134]},
    moscow:{x:125,y:5,r:243,g:151,b:5,cost:-1,category:'avg',owner:null,upgrades:[],buyingPrice:100,sellingPrice:80,name:'MOSCOW',version:0,sub_col:[252,190,93]},
    railway:{x:165,y:5,r:240,g:250,b:253,cost:-1,category:'special',owner:null,upgrades:[],buyingPrice:100,sellingPrice:80,name:'RAILWAY',version:0,sub_col:[240,250,253]},
    toronto:{x:205,y:5,r:243,g:151,b:5,cost:-1,category:'avg',owner:null,upgrades:[],buyingPrice:100,sellingPrice:80,name:'TORONTO',version:0,sub_col:[252,190,93]},
    seoul:{x:245,y:5,r:243,g:151,b:5,cost:-1,category:'avg',owner:null,upgrades:[],buyingPrice:100,sellingPrice:80,name:'SEOUL',version:0,sub_col:[252,190,93]},
    jail:{x:285,y:5,r:255,g:255,b:255,cost:-1,category:'quest',owner:null,upgrades:[],buyingPrice:100,sellingPrice:80,name:'JAIL',jail:true,version:0,sub_col:[255,255,255]},
    zurich:{x:285,y:45,r:28,g:144,b:108,cost:-1,category:'above_avg',owner:null,upgrades:[],buyingPrice:100,sellingPrice:80,name:'ZURICH',version:0,sub_col:[94,210,173]},
    riyadh:{x:285,y:85,r:28,g:144,b:108,cost:-1,category:'above_avg',owner:null,upgrades:[],buyingPrice:100,sellingPrice:80,name:'RIYADH',version:0,sub_col:[94,210,173]},
    sydney:{x:285,y:125,r:143,g:84,b:34,cost:-1,category:'high',owner:null,upgrades:[],buyingPrice:100,sellingPrice:80,name:'SYDNEY',version:0,sub_col:[222,155,103]},
    elec:{x:285,y:165,r:240,g:250,b:253,cost:-1,category:'special',owner:null,upgrades:[],buyingPrice:100,sellingPrice:80,name:'ELECTRICITY',version:0,sub_col:[240,250,253]},
    beijing:{x:285,y:205,r:143,g:84,b:34,cost:-1,category:'high',owner:null,upgrades:[],buyingPrice:100,sellingPrice:80,name:'BEIJING',version:0,sub_col:[222,155,103]},
    dubai:{x:285,y:245,r:143,g:84,b:34,cost:-1,category:'high',owner:null,upgrades:[],buyingPrice:100,sellingPrice:80,name:'DUBAI',version:0,sub_col:[222,155,103]},
    auction:{x:285,y:285,r:255,g:255,b:255,cost:-1,category:'quest',owner:null,upgrades:[],buyingPrice:100,sellingPrice:80,name:'AUCTION',auction:true,version:0,sub_col:[240,250,253]},
    hongkong:{x:245,y:285,r:110,g:62,b:189,cost:-1,category:'vhigh',owner:null,upgrades:[],buyingPrice:100,sellingPrice:80,name:'HONG KONG',version:0,sub_col:[174,125,246]},
    paris:{x:205,y:285,r:110,g:62,b:189,cost:-1,category:'vhigh',owner:null,upgrades:[],buyingPrice:100,sellingPrice:80,name:'PARIS',version:0,sub_col:[174,125,246]},
    london:{x:165,y:285,r:251,g:83,b:47,cost:-1,category:'vvhigh',owner:null,upgrades:[],buyingPrice:100,sellingPrice:80,name:'LONDON',version:0,sub_col:[251,139,116]},
    airport:{x:125,y:285,r:240,g:250,b:253,cost:-1,category:'special',owner:null,upgrades:[],buyingPrice:100,sellingPrice:80,name:'AIRPORT',version:0,sub_col:[240,250,253]},
    tokyo:{x:85,y:285,r:251,g:83,b:47,cost:-1,category:'vvhigh',owner:null,upgrades:[],buyingPrice:100,sellingPrice:80,name:'TOKYO',version:0,sub_col:[251,139,116]},
    newyork:{x:45,y:285,r:251,g:83,b:47,cost:-1,category:'vvhigh',owner:null,upgrades:[],buyingPrice:100,sellingPrice:80,name:'NEW YORK',version:0,sub_col:[251,139,116]}
}
var prev_roll = {}
var blue = [19,141,218]
var green = [74,188,48]
var yellow = [255,215,78]
var red = [254,76,59]
var col_map = {'2':green,'3':blue,'4':yellow}
var uid_name={}
var city_state = {}

function get_rand_int(){
    return Math.floor(Math.random()*10)
}
function get_roll_int(){
    return Math.ceil(Math.random()*6)
}
function create_room(room_id,uid,name){
    rooms[room_id] = {
        [uid]:{name:name,room_id:room_id,status:'online',player:1,balance:1000,profit:1000,x:cities['start'].x+cent,y:cities['start'].y+cent,city:'start',color:red}
    }
    city_state[room_id] = cities;
    players[room_id] = [uid];
    current_turn[room_id] = uid;
    uid_room[uid] = {room_id:room_id,name:name,player:1,balance:1000,profit:1000,x:cities['start'].x+cent,y:cities['start'].y+cent,city:'start'};
}
function join_room(room_id,uid,name,pla_id){
    
    rooms[room_id][uid] = {
        name:name,room_id:room_id,status:'online',player:pla_id,balance:1000+(pla_id-1)*50,profit:1000+(pla_id-1)*50,x:cities['start'].x+cent,y:cities['start'].y+cent,city:'start',color:col_map[pla_id.toString()]
    }
    players[room_id].push(uid);
    uid_room[uid] = {room_id:room_id,name:name,player:pla_id,balance:1000+(pla_id-1)*50,profit:1000+(pla_id-1)*50,x:cities['start'].x+cent,y:cities['start'].y+cent,city:'start'}
}   



io.on('connection',socket=>{
    console.log('connected',socket.id)
    socket.on('disconnect',()=>{

    })

    socket.on('check',(data)=>{

    })

    socket.on('sign_in',(data)=>{
        console.log(data)
        socket.uid = data.uid;
        if(uid_name[data.uid]){
            socket.name = uid_name[data.uid];
        }else{
            socket.name = data.name
            uid_name[data.uid] = data.name
        }
        console.log(socket.uid,socket.name)
    })

    socket.on('create_room',(data,fn)=>{
        console.log('create room')
        if(uid_room[socket.uid]){
            fn('you have already created a room')
        }else{
            if(socket.uid){
                var room_id = `${get_rand_int()}${get_rand_int()}${get_rand_int()}${get_rand_int()}${get_rand_int()}`
                fn('created')
                socket.join(room_id,()=>{
                    console.log(room_id)
                    socket.room_id = room_id;
                    create_room(room_id,socket.uid,socket.name)
                    setTimeout(()=>{
                        io.to(room_id).emit('new_player_joined',{players:rooms[room_id],cities:city_state[room_id]})

                    },1500)
                })
            }
        }


    })

    socket.on('join_room',(data,fn)=>{
        var room_id = data.room_id.toString()
        if(socket.uid && uid_room[socket.uid]){
            fn('you are already in a room')
        }else if (room_id){
            if(rooms[room_id]){
                if(Object.keys(rooms[room_id]).length>=4){
                    fn('room is full')
                }else{
                    fn('joined')
                    socket.join(room_id,()=>{
                        socket.room_id = room_id
                        join_room(room_id,socket.uid,socket.name,Object.keys(rooms[room_id]).length+1)
                        
                        if(Object.keys(rooms[room_id]).length==4){
                            setTimeout(()=>{
                                io.to(room_id).emit('init_play',{players:rooms[room_id],current_turn:current_turn[room_id],cities:city_state[room_id]});

                            },1500)
                        }else{
                            setTimeout(()=>{
                                io.to(room_id).emit('new_player_joined',{players:rooms[room_id],cities:city_state[room_id]})
        
                            },1500)
                        }
                    })

                }
            }
        }else{
            fn('room_id doesnt exist')
        }
    })

    socket.on('upgrade',(data)=>{

    })

    socket.on('roll_complete',(data)=>{
        var room_id = socket.room_id
        var number = prev_roll[room_id]
        if(socket.uid==current_turn[socket.room_id]){
            rooms[room_id][socket.uid].city = data.city;
            rooms[room_id][socket.uid].x = data.x;
            rooms[room_id][socket.uid].y = data.y;
            if(city_state[room_id][data.city].owner){
                if(city_state[room_id][data.city].owner!=socket.uid){
                    //pay money
                    rooms[socket.room_id][socket.uid].balance -= city_state[room_id][data.city].cost;
                    if(rooms[socket.room_id][socket.uid].balance<=-500){

                    }else{
                        io.to(room_id).emit('bal_update',{players:rooms[room_id]})
                    }
                }

                if(number==6){
                    io.to(room_id).emit('roll_again',{current_turn:current_turn[room_id],players:rooms[room_id]})
                }else{

                }
            }else{
                if(rooms[room_id][socket.uid].balance>=city_state[room_id][data.city].buyingPrice){
                    io.to(socket.room_id).emit('buy_opt',{city:data.city})
                }
            }


        }
    })

    socket.on('buy_cancelled',()=>{
        if(prev_roll[socket.room_id]==6){
            io.to(room_id).emit('roll_again',{current_turn:current_turn[room_id],players:rooms[room_id]})
        }else{
            var players = players[socket.room_id]
            var ind = players.indexOf(current_turn[socket.room_id])
            if(ind==3){
                ind = 0;
            }else{
                ind += 1;
            }
            current_turn[socket.room_id] = players[ind];
            io.to(room_id).emit('next_turn',{current_turn:current_turn[socket.room_id],players:rooms[room_id],cities:city_state[room_id].cities})
        }
    })


    socket.on('roll',()=>{
        var number = get_roll_int();
        prev_roll[socket.room_id] = number;
        if(socket.uid==current_turn[socket.room_id]){
            io.to(socket.room_id).emit('rolled',{move_uid:socket.uid,steps:number,from_city:rooms[room_id][socket.uid].city})
        }
    })

    socket.on('buy',()=>{

    })

    socket.on('sell',()=>{

    })

})



var server = http.createServer(app)
io.listen(server)
server.listen(port,()=>{
    console.log('started')
})