import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import { v4 as uuidv4 } from "uuid";

declare global {
  var io: Server | undefined;
}

const randomNumber: any = (min: number, max: number, exclude: any) => {
  const number: number = Math.floor(Math.random() * (max - min + 1)) + min;
  if (!exclude.includes(number)) {
    return number;
  } else {
    return randomNumber(min, max, exclude);
  }
};

export default defineEventHandler(({ node }) => {
  if (!global.io) {
    if (process.env.NODE_ENV === "production") {
      global.io = new Server(node.res.socket?.server, {
        cors: {
          origin: ["https://admin.socket.io", "http://localhost:3000"],
        },
      });
    } else {
      global.io = new Server(8000, {
        cors: {
          origin: ["http://localhost:3000", "https://admin.socket.io"],
        },
      });
    }
    instrument(global.io, {
      auth: false,
      mode: "development",
    });

    const findGame = () => {
      const clients: any = global.io?.of("/").adapter.rooms.get("lobby");
      // get the number of clients in the room

      const numClients: any = [...(clients ? clients : 0)];
      if (numClients.length > 1) {
        const gameRoomId = uuidv4();
        const gameRoom = gameRoomId.replace(/-/g, "");

        global.io?.to("lobby").emit("gameFound", {
          gameId: gameRoom,
          players: numClients,
        });
      } else {
        console.log("no game found");
      }
    };

    global.io.on("connection", (socket) => {
      console.log(`${socket.id} connected`);

      socket.on("joinLobby", (data) => {
        joinLobby(socket, data);
      });
      socket.on("leaveLobby", (data) => {
        leaveLobby(socket);
      });
      socket.on("findGame", (data) => {
        findGame();
      });
      socket.on("joinGame", (data) => {
        joinGame(socket, data);
      });
      socket.on("gameStart", (data) => {
        gameStart(socket, data);
      });
      socket.on("guess", (data) => {
        guess(socket, data);
      });
      socket.on("changeTurn", (data) => {
        changeTurn(socket, data);
      });
      socket.on("gameDecided", (data) => {
        gameDecided(socket, data);
      });
      socket.on("leaveRoom", (data) => {
        leaveRoom(socket, data);
      });
      socket.on("userLeft", (data) => {
        socket.leave(data.gameId);
        socket.to(data.gameId).emit("userLeft", socket.id);
      });
      socket.on("disconnecting", (reason) => {
        for (const room of socket.rooms) {
          if (room !== socket.id) {
            socket.to(room).emit("userLeft", socket.id);
          }
        }
      });
    });

    const joinLobby = (socket: any, data: any) => {
      socket.join("lobby");
      global.io?.to(socket.id).emit("lobbyJoined", {
        id: data.id,
        playerSocketId: socket.id,
      });
      findGame();
    };

    const leaveLobby = (socket: any) => {
      socket.leave("lobby");
      global.io?.to(socket.id).emit("lobbyLeft");
    };

    const joinGame = (socket: any, data: any) => {
      leaveLobby(socket);
      socket.join(data.gameId);
      global.io?.to(data.gameId).emit("gameJoined", {
        gameId: data.gameId,
      });
    };

    const gameStart = (socket: any, data: any) => {
      const clients: any = global.io?.of("/").adapter.rooms.get(data.gameId);
      const numClients: any = [...(clients ? clients : 0)];
      const number = randomNumber(0, 1, []);
      global.io?.to(data.gameId).emit("startGame", {
        player1: numClients[number],
        player2: numClients[number === 0 ? 1 : 0],
        color1: number === 0 ? "green" : "blue",
        color2: number === 0 ? "blue" : "green",
      });
    };

    const guess = (socket: any, data: any) => {
      socket.to(data.gameId).emit("guess", {
        guess: data.guess,
        player: data.id,
      });
    };

    const gameDecided = (socket: any, data: any) => {
      if (data.winner) {
        global.io?.to(data.gameId).emit("gameDecided", {
          winner: data.winner,
        });
      } else {
        global.io?.to(data.gameId).emit("gameDecided", {
          winner: null,
        });
      }
    };

    const changeTurn = (socket: any, data: any) => {
      global.io?.to(data.gameId).emit("changeTurn", {
        player: data.id,
      });
    };

    const leaveRoom = (socket: any, data: any) => {
      socket.leave(data.gameId);
      global.io?.to(socket.id).emit("roomLeft", {
        gameId: data.gameId,
      });
    };

    global.io?.of("/").adapter.on("join-room", async (room, id) => {
      if (room === "lobby") {
      } else {
        const clients: any = global.io?.of("/").adapter.rooms.get(room);
        // get the number of clients
        const numClients: any = [...(clients ? clients : 0)];
        // if there are two clients, start a game
        if (numClients.length === 2) {
          const data = await $fetch("/api/Clubs/getClubs");
          global.io?.to(room).emit("bothPlayersJoined", {
            gameId: room,
            isJoined: true,
            gameData: {
              columnClubs: data.initialClubs,
              rowClubs: data.secondaryClubs,
              matches: data.matches,
            },
          });
        }
      }
    });
  }
});
