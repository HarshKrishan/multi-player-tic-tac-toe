"use client";
import GameBoard from "@/components/GameBoard";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

export default function Home() {

  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [sign, setSign] = useState("");
  const [showBoard, setShowBoard] = useState(false);
  const [opponentPresent, setOpponentPresent] = useState(false);
  const [showWaiting, setShowWaiting] = useState(false);

  useEffect(()=>{
    socket.on("opponent joined",()=>{
      setShowBoard(true);
      setOpponentPresent(true);
      // setShowBoard(true);
      setSign("O");
    })

    socket.on("roomNotFound",()=>{
      alert("No room exist with this id, kindly join another room or create one first!");
      setShowBoard(false);
    })

    return () => {
      socket.off("opponent joined");
      socket.off("roomNotFound");
    };
  },[])



  const joinRoom = () => {
    if(!name || !room){
      alert("Please enter your name and room");
      return;
    }
    
    socket.emit("joinRoom", { name, room });
    // console.log("res",res);
    

    alert(`You have joined room: ${room}`);
    setShowBoard(true);
    setSign("X")

     
  };

  const createRoom = () => {
    if(!name || !room){
      alert("Please enter your name and room");
      return;
    }
    socket.emit("createRoom", { name, room });
    alert(`You have created room: ${room}`);
    setShowWaiting(true);

  }

  return (
    <main className="flex min-h-screen flex-col items-center p-14">
      <h1 className="text-5xl font-bold ">Tic-Tac-Toe</h1>

      {!showBoard ? (
        <div className="flex flex-col justify-center items-center">
          <input
            type="text"
            placeholder="Enter your name"
            className="border-2 border-black rounded-md p-2 m-2"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Enter your room"
            className="border-2 border-black rounded-md p-2 m-2"
            value={room}
            onChange={(e) => {
              setRoom(e.target.value);
            }}
          />
          <div className="flex gap-3">
            <button
              className="border-2 border-black rounded-md p-2 m-2"
              onClick={createRoom}
            >
              Create Game
            </button>
            <button
              className="border-2 border-black rounded-md p-2 m-2"
              onClick={joinRoom}
            >
              Join
            </button>
          </div>
          {!opponentPresent && showWaiting && <p>Waiting for Opponent....</p>}
        </div>
      ) : (
        <GameBoard sign={sign} name={name} room={room} socket={socket} />
      )}
    </main>
  );
}
