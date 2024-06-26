
"use client";

import { useEffect } from "react";
import { clarity } from "react-microsoft-clarity";

const MicrosoftClarity = () => {
    useEffect(() => {
        if (process.env.NODE_ENV === "production") {
            clarity.init("my0y39m5xp"); // Replace with your actual Clarity tracking code
        }
    }, []);

    return null;
};

export default MicrosoftClarity;