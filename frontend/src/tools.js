import { configureStore } from "@reduxjs/toolkit";
import store from './store';

const tools=configureStore({
    reducer:store,
});
export default tools;