import React, {useEffect} from 'react';
import axios from 'axios';

function LandingPage(){
    useEffect(() => {
        axios.get('/api/hello')
        .then((resFromServerIndexJs) => console.log(resFromServerIndexJs))
    }, [])

    return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh'}}>
       <h3>~~랜딩페이지~~</h3>
        </div>
    )
}

export default LandingPage