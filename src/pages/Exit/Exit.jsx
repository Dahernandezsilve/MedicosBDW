import React from "react";
import  {navigate} from "../index.jsx";

const Exit = () => {
    return (
        <div onClick={() => navigate('Welcome')}>
            Exit
        </div>
    )
}

export default Exit