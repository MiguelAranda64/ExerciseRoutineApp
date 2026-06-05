import { useState, useEffect } from "react";

const Ejercicios = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadRoutines();
    },[]);

    const loadRoutines = async = () => {
        setLoading = true;
        try {
            
        } catch {

        }

    }
}

export default Ejercicios;