"use client";
import React,{useState, useEffect} from "react";
function GameBoard({name,room,socket,sign}) {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [turn, setTurn] = useState(sign=="X"?false:true);
    const [winner, setWinner] = useState(null);

    
    useEffect(() => {
        const res = calculateWinner(board);

        res.then((result) => {
          setWinner(result);
        }
        ).catch((err) => {
          console.log(err);
        }
        );

    }, [board]);

    useEffect(() => {
      socket.on("move", (data) => {
        // console.log("move",data);
        setBoard(data.board);
        setTurn(data.turn);
      
      });

      socket.on("winner", (data) => {
        // console.log("winner",data);
        setWinner(data.winner);
      }
      );
      socket.on("reset", (data) => {
        // console.log("reset",data);
        setBoard(Array(9).fill(null));
        setWinner(null);
        setTurn(sign=="X"?false:true);
      });
    }, [socket]);
    const handleClick = async (i) => {
      const boardCopy = [...board];
      if (winner || boardCopy[i] || !turn) return;
      boardCopy[i] = sign;
      setBoard(boardCopy);
      setTurn(false);
      await socket.emit("move", { room, board: boardCopy, turn: true });
    };

    async function calculateWinner(squares) {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
              await socket.emit("winner", { room, winner: squares[a] });
              return squares[a];

            }
        }

        let isBoardFull = true;
        for (let i = 0; i < squares.length; i++) {
            if (squares[i] === null) {
            isBoardFull = false;
            }
        }
        if (isBoardFull) {
            await socket.emit("winner", { room, winner: "Tie" });
            return "Tie!";
        }
        return null;
        }

    
    const status = winner
      ? `${
          winner === "Tie"
            ? "It's a Tie!"
            : sign === winner
            ? "You Win!"
            : "You Lose!"
        }`
      : `${turn ? `Your Turn ` : `Other Player Turn `}`;


  return (
    <div className="mt-10 text-center">
      <h2 className="text-3xl font-bold">{status}</h2>
      <h3 className="mt-2 ">You are {sign}</h3>
      <div className="grid grid-cols-3 m-10">
        <div
          className="bg-white p-3 h-16 w-16 text-4xl text-center border-b-2 border-r-2 border-black hover:cursor-pointer text-slate-500"
          onClick={() => {
            handleClick(0);
          }}
        >
          {board[0]}
        </div>
        <div
          className="bg-white p-3 h-16 w-16 text-4xl text-center border-b-2 border-r-2 border-black hover:cursor-pointer text-slate-500"
          onClick={() => {
            handleClick(1);
          }}
        >
          {board[1]}
        </div>
        <div
          className="bg-white p-3 h-16 w-16 text-4xl text-center border-b-2 border-black hover:cursor-pointer text-slate-500"
          onClick={() => {
            handleClick(2);
          }}
        >
          {board[2]}
        </div>
        <div
          className="bg-white p-3 h-16 w-16 text-4xl text-center border-b-2 border-r-2 border-black hover:cursor-pointer text-slate-500"
          onClick={() => {
            handleClick(3);
          }}
        >
          {board[3]}
        </div>
        <div
          className="bg-white p-3 h-16 w-16 text-4xl text-center border-b-2 border-r-2 border-black hover:cursor-pointer text-slate-500"
          onClick={() => {
            handleClick(4);
          }}
        >
          {board[4]}
        </div>
        <div
          className="bg-white p-3 h-16 w-16 text-4xl text-center border-b-2  border-black hover:cursor-pointer text-slate-500"
          onClick={() => {
            handleClick(5);
          }}
        >
          {board[5]}
        </div>
        <div
          className="bg-white p-3 h-16 w-16 text-4xl text-center border-r-2 border-black hover:cursor-pointer text-slate-500"
          onClick={() => {
            handleClick(6);
          }}
        >
          {board[6]}
        </div>
        <div
          className="bg-white p-3 h-16 w-16 text-4xl text-center  border-r-2 border-black hover:cursor-pointer text-slate-500"
          onClick={() => {
            handleClick(7);
          }}
        >
          {board[7]}
        </div>
        <div
          className="bg-white p-3 h-16 w-16  text-4xl text-center border-black hover:cursor-pointer text-slate-500"
          onClick={() => {
            handleClick(8);
          }}
        >
          {board[8]}
        </div>
      </div>

      <button
        className="mt-10 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          setBoard(Array(9).fill(null));
          setWinner(null);
          setTurn(sign=="X"?false:true);
          socket.emit("reset", { room });

        }}
      >
        Reset Game
      </button>
    </div>
  );
}

export default GameBoard