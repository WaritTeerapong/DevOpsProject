// services/frontend/src/services/socket.ts
import { io } from 'socket.io-client';

const SCOREBOARD_WS_URL = process.env.NEXT_PUBLIC_SCOREBOARD_WS_URL || 'http://localhost:3003';

const socket = io(SCOREBOARD_WS_URL, {
  autoConnect: false,
});

export default socket;
