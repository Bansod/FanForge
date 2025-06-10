import React, { useRef } from 'react';
import { Parallax, ParallaxLayer } from '@react-spring/parallax';
import night from "../assets/night.jpg";
import space from "../assets/space.jpg";
import flyingUp from "../assets/flyingUp.png";
import MainContent from './MainContent';


export default function Test() {

    const ref = useRef()

    return (
        <div>
            <Parallax pages={4} ref={ref}>
                <ParallaxLayer
                    offset={0}
                    speed={0}
                    factor={1}
                    style={{
                        backgroundImage: `url(${space})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <ParallaxLayer sticky={{ start: 0.4, end: 1.2}} speed={0.2} onClick={()=>ref.current.scrollTo(3)}>
                    <h2 className="text-white text-5xl font-bold text-center uppercase p-5">Welcome to FanForge</h2>
                    <p className='text-white text-xs font-bold text-center uppercase'>Scroll to view new superman merchandise or click here to skip to the main content</p>
                </ParallaxLayer>
                <ParallaxLayer
                    offset={1}
                    speed={0}
                    factor={1}
                    style={{
                        backgroundImage: 'linear-gradient(to bottom, rgb(10, 9, 9),rgb(3, 3, 43))',
                    }}

                />
                <ParallaxLayer
                    offset={2}
                    speed={0}
                    factor={1}
                    style={{
                        backgroundImage: `url(${night})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <ParallaxLayer
                    offset={3}
                    speed={0}
                    factor={1}
                >
                    <MainContent />
                </ParallaxLayer>
                <ParallaxLayer sticky={{ start: 1, end: 2 }} speed={0.2}>
                    <div className="h-full flex items-center">
                        <img
                            src={flyingUp}
                            className="h-[40rem] w-auto ml-10"
                        />
                    </div>
                </ParallaxLayer>

            </Parallax>
        </div>
    );
}

