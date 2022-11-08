import React, {useRef, useEffect, useState} from 'react';
import * as THREE from 'three';
import { extend, Canvas, useLoader, useFrame } from '@react-three/fiber';
import { FontLoader } from 'three-stdlib';
import {Center, SpotLight, Text3D, MeshReflectorMaterial,Float, OrbitControls, useTexture} from '@react-three/drei';

import puddleNormal from './puddleNormal.jpg'
import puddle from './puddle.jpg';
import fontJson from 'three/examples/fonts/helvetiker_bold.typeface.json';
import { Vector2} from 'three';


class View extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    return(
        <Canvas camera={{position:[0,4,5]}}>
            <spotLight 
                position={[5,1,2]}
                intensity={1}
                angle={1}
                color={0xff0000}
                penumbra={1}
            />
            <spotLight 
                position={[-5,1,2]}
                intensity={1}
                color={0x0000ff}
                penumbra={1}
            />
            <ambientLight intensity={.5}/>
            <Ground/>
           
            <Float
                speed={2.5}
                position={[0,.5,-5]}
                rotationIntensity={1.5}
            >
                <Center>
                    <MyText3D
                        pos={[-2,.2,0]}
                        text={`CHARLIE\nSMITH`}
                        size={1}
                        height={.3}
                        lHeight={.75}
                        col={0x373737}
                        bevel={.06}
                        bevelThickness={.1}
                        bevEnabled
                    />
                </Center>

            </Float>
            
            <Center position={[0,-.8,-3]}>
                <MyText3D
                    text="Web Developer"
                    size={.6}
                    height={0}
                    col={0x373737}
                    rot={[-Math.PI/2,0,0]}
                    bevEnabled
                    letterSpacing={0}
                    bevel={.06}
                    bevelThicknes={.1}
                />
            </Center>
            <Link
                pos={[-.6,-.9,0]}
                spotTar={[-1,0,1]}
                spotPos={[1.5,-1,5]}
                text="Github"
                size={.3}
                height={.05}
                col={0x373737}
                rot={[-Math.PI/2,0,0]}
                letterSpacing={0.02}
                bevEnabled
                bevel={.06}
                bevelThicknes={.1}
                url={"https://github.com/charlie-s1"}
            />
            <Link
                pos={[.6,-.9,0]}
                spotTar={[1,0,1]}
                spotPos={[-1.5,-1,5]}
                text={`Gradient\nGame`}
                lHeight={.75}
                size={.3}
                height={.05}
                col={0x373737}
                rot={[-Math.PI/2,0,0]}
                letterSpacing={0.01}
                bevEnabled
                bevel={.06}
                bevelThicknes={.1}
                url={"https://charlie-s.com/gradientGame"}
            />
                
            
            <OrbitControls
                enableZoom={false}
                enablePan={false}
                maxPolarAngle={1.6}
            />
            
        </Canvas>
    )
  }
}
function Wall(){
    return(
        <mesh position={[0,240,-250]}>
            <planeGeometry attach={"geometry"} args={[1000,500]}/>
            <meshBasicMaterial
                color={0x000000}
                attach={"material"}
            />
        </mesh>
    )
}
function Ground(){
    const puddleNorm = useTexture(puddleNormal)
    const normalScale = React.useMemo(()=>new Vector2(.5,.5));
    puddleNorm.wrapS = puddleNorm.wrapT = THREE.RepeatWrapping
    const puddleTexture = useLoader(THREE.TextureLoader,puddle);
    puddleTexture.wrapS = puddleTexture.wrapT = THREE.RepeatWrapping;
    return(
        <mesh receiveShadow rotation-x={-Math.PI/2} position={[0,-1,0]}>
            <planeGeometry attach={"geometry"} args={[50,50]} />
            <MeshReflectorMaterial 
                attach={"material"} 
                resolution={1024}
                normalMap={puddleNorm}
                normalScale={normalScale}
                mixBlur={10}
                blur={[2500,2500]}
                depthToBlurRatioBias={.2}
                mixStrength={1}
                mixContrast={1}
                mirror={1}
            />
        </mesh>
    );
}
function Link(props){
    const colour = new THREE.Color();
    const ref=useRef();
    const light = useRef();
    const [hovered, setHovered] = useState(false)
    const over = (e) => (e.stopPropagation(), setHovered(true))
    const out = () => setHovered(false)
    const myFont = new FontLoader().parse(fontJson);

    useEffect(() => {
        if (hovered) document.body.style.cursor = 'pointer'
        return () => (document.body.style.cursor = 'auto')
    }, [hovered])
    useFrame(({ camera }) => {
        light.current.visible = hovered ? true : false;
        light.current.target.position.lerp(new THREE.Vector3(props.spotTar[0],props.spotTar[1],props.spotTar[2]),.1)
    })
    return(
        <mesh position={props.pos} ref={ref} onPointerOver={over} onPointerOut={out} onClick={() => window.location.href=props.url} rotation={props.rot}>
            <Center position={props.pos}>
                <MyText3D 
                    col={props.col} 
                    text={props.text} 
                    font={fontJson} 
                    letterSpacing={props.letterSpacing} 
                    size={props.size} 
                    lHeight={props.lHeight} 
                    height={props.height}
                    bevel={props.bevel}
                    bevelThickness={props.bevelThickness}
                    curveSegments={32}
                    bevEnabled={props.bevEnabled}
                />
            </Center>
            
            <SpotLight 
                ref={light}
                position={props.spotPos}
                anglePower={10}
                angle={.2}
                attenuation={4}
                distance={6}
                intensity={2}
                penumbra={1}
            />
        </mesh>
    )

}
function MyText3D(props){
    const font = new FontLoader().parse(fontJson);
    return(
        <mesh position={props.pos} rotation={props.rot}>
            <Text3D 
                font={fontJson}
                size={props.size}
                height={props.height}
                lineHeight={props.lHeight}
                bevelSize={props.bevel}
                letterSpacing={props.letterSpacing}
                bevelThickness={props.bevelThickness}
                curveSegments={32}
                bevelEnabled={props.bevEnabled}
            >
                {props.text}
                <meshPhongMaterial 
                    color={props.col}
                />
            </Text3D>
            
        </mesh>
    )
}

export{View};