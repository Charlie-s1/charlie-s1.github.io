import React, { useRef, useState } from 'react';
import {createRoot} from "react-dom/client";

import "./main.css";
// import * as seaScene from "./seaScene/seaScene";
import * as blackRoom from './blackRoom/blackRoom';
  
createRoot(document.getElementById('root')).render(
    <blackRoom.View/>
)