/* eslint-disable max-statements */
/* eslint-disable react/no-unused-state */
import React, {Component, Fragment} from 'react'
import * as THREE from 'three'
import '../../styles/Bomb.css'

import GLTFLoader from 'three-gltf-loader'
import * as SOW from './Modules/SubjectOfWires'
import {clockCases} from './Modules/Clock'
import {generateRandomIndex, sortByKey} from '../util'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'

class Bomb extends Component {
  constructor(props) {
    super(props)
    this.canvasRef = React.createRef()
    this.state = {
      SubjectOfWires: {
        inactive: true,
        active: false,
        passed: false
      },
      // eslint-disable-next-line react/no-unused-state
      moduleTwo: {
        inactive: true,
        active: false,
        passed: false
      },
      moduleThree: {
        inactive: true,
        active: false,
        passed: false
      },
      moduleFour: {
        inactive: true,
        active: false,
        passed: false
      },
      moduleFive: {
        inactive: true,
        active: false,
        passed: false
      },

      count: this.props.startTime,
      minute: 0,
      tenSecond: 0,
      singleSecond: 0,
      spotLight: {},
      box: {},
      clock: {},
      module1: {},
      module2: {},
      module3: {},
      module4: {},
      module5: {},
      targetList: [],
      head: {},
      correct: 5
    }
  }

  handleStart() {
    this.timer = setInterval(() => {
      const newCount = this.state.count - 1
      this.setState({count: newCount >= 0 ? newCount : 0})
    }, 1000)
  }

  componentDidMount() {
    var camera,
      scene,
      renderer,
      box,
      clock,
      digital,
      module1,
      module2,
      module3,
      module4,
      module5,
      head
    var projector,
      mouse = {x: 0, y: 0}

    init(this)
    animate()

    function init(THIS) {
      camera = new THREE.PerspectiveCamera(
        36,
        window.innerWidth / window.innerHeight,
        0.25,
        16
      )

      camera.position.set(0, 1.8, 4)

      scene = new THREE.Scene()

      // Lights

      scene.add(new THREE.AmbientLight(0x505050))

      let spotLight = new THREE.SpotLight(0xffffff)
      spotLight.angle = Math.PI / 4
      spotLight.penumbra = 0.2
      spotLight.position.set(3.2, 3.2, 2.9)
      spotLight.castShadow = true
      spotLight.shadow.camera.near = 3
      spotLight.shadow.camera.far = 10
      spotLight.shadow.mapSize.width = 1024
      spotLight.shadow.mapSize.height = 1024
      scene.add(spotLight)
      THIS.setState({spotLight})

      let dirLight = new THREE.DirectionalLight(0x55505a, 1)
      dirLight.position.set(0, 3, 0)
      dirLight.castShadow = true
      dirLight.shadow.camera.near = 1
      dirLight.shadow.camera.far = 10

      dirLight.shadow.camera.right = 1
      dirLight.shadow.camera.left = -1
      dirLight.shadow.camera.top = 1
      dirLight.shadow.camera.bottom = -1

      dirLight.shadow.mapSize.width = 1024
      dirLight.shadow.mapSize.height = 1024
      scene.add(dirLight)

      let boxLoader = new GLTFLoader()
      boxLoader.load('models/box.glb', function(gltf) {
        box = gltf.scene
        gltf.scene.scale.set(1, 1, 1)
        gltf.scene.position.x = -0.5 //Position (x = right+ left-)
        gltf.scene.position.y = 1.7 //Position (y = up+, down-)
        gltf.scene.position.z = 0 //Position (z = front +, back-)
        gltf.scene.rotation.x = Math.PI / 2
        box.traverse(o => {
          if (o.isMesh) {
            if (o.name === 'Cube001') {
              o.material = SOW.cubeMaterial
            } else o.material = SOW.defaultMaterial
          }
        })
        let battery1
        let batteryLoader = new GLTFLoader()
        batteryLoader.load('models/batterry.glb', function(gltf) {
          battery1 = gltf.scene
          gltf.scene.scale.set(0.09, 0.11, 0.11)
          gltf.scene.position.x = -0.3 //Position (x = right+ left-)
          gltf.scene.position.y = -0.51 //Position (y = up+, down-)
          gltf.scene.position.z = -0.91 //Position (z = front +, back-)
          gltf.scene.rotation.y = -Math.PI / 2
          gltf.scene.rotation.z = Math.PI / 2
          battery1.traverse(o => {
            if (o.isMesh) {
              if (o.name === 'Dock') {
                o.material = SOW.cubeMaterial
              } else if (o.name === 'Battery') {
                o.material = SOW.black
              } else if (o.name === 'Battery002') {
                o.material = SOW.copper
              } else o.material = SOW.defaultMaterial
            }
          })
          battery1.castShadow = true
          battery1.receiveShadow = true
          box.add(battery1)
          let battery2 = battery1.clone()
          box.add(battery2)
          battery2.position.x = 1.3
          battery2.position.y = -0.54
          battery2.position.z = 0.91
          battery2.rotation.x = Math.PI / 2
        })
        var serialText = new THREE.TextureLoader().load(`/models/serial.png`)
        serialText.wrapT = THREE.RepeatWrapping
        serialText.repeat.y = -2
        let serial
        let serialLoader = new GLTFLoader()
        serialLoader.load('models/serial.glb', function(gltf) {
          serial = gltf.scene
          gltf.scene.scale.set(0.2, 0.2, 0.2)
          gltf.scene.position.x = 1.3 //Position (x = right+ left-)
          gltf.scene.position.y = -0.55 //Position (y = up+, down-)
          gltf.scene.position.z = -1.013 //Position (z = front +, back-)
          gltf.scene.rotation.y = -Math.PI / 2
          // gltf.scene.rotation.z = Math.PI / 2
          serial.traverse(o => {
            if (o.isMesh) {
              if (o.name === 'Serial') {
                o.material = new THREE.MeshPhongMaterial({map: serialText})
              } else o.material = SOW.cubeMaterial
            }
          })
          serial.castShadow = true
          serial.receiveShadow = true
          box.add(serial)
        })
        let parallel
        let parallelLoader = new GLTFLoader()
        parallelLoader.load('models/parallel.glb', function(gltf) {
          parallel = gltf.scene
          gltf.scene.scale.set(0.3, 0.3, 0.3)
          gltf.scene.position.x = 0.49 //Position (x = right+ left-)
          gltf.scene.position.y = -0.51 //Position (y = up+, down-)
          gltf.scene.position.z = 1 //Position (z = front +, back-)
          gltf.scene.rotation.y = -Math.PI / 2
          parallel.traverse(o => {
            if (o.isMesh) {
              if (o.name === 'Cube' || o.name === 'Cube002') {
                o.material = SOW.cubeMaterial
              } else o.material = SOW.defaultMaterial
            }
          })
          parallel.castShadow = true
          parallel.receiveShadow = true
          box.add(parallel)
        })
        box.castShadow = true
        box.receiveShadow = true
        THIS.setState({box})
        scene.add(box)
      })

      var clockLoader = new GLTFLoader()
      clockLoader.load('models/clock.glb', function(glft) {
        clock = glft.scene
        glft.scene.scale.set(0.44, 0.44, 0.44)
        glft.scene.position.x = 0.488 //Position (x = right+ left-)
        glft.scene.position.y = -0.31 //Position (y = up+, down-)
        glft.scene.position.z = -0.47 //Position (z = front +, back-)
        glft.scene.rotation.z = Math.PI / 2
        glft.scene.rotation.y = -Math.PI / 2
        clock.traverse(o => {
          if (o.isMesh) {
            if (o.name === 'Cube001') o.material = SOW.flatBlack
            else if (o.name === 'Cube002') {
              o.material = SOW.cubeMaterial
            } else if (o.name === 'Strike1' || o.name === 'Strike2') {
              o.material = SOW.flatRed
              o.visible = false
            } else o.material = SOW.defaultMaterial
          }
        })
        clock.castShadow = true
        clock.receiveShadow = true
        box.add(clock)
      })

      var digitalLoader = new GLTFLoader()
      digitalLoader.load('models/digital.glb', function(glft) {
        digital = glft.scene
        glft.scene.scale.set(0.9, 0.9, 0.9)
        glft.scene.position.x = 0 //Position (x = right+ left-)
        glft.scene.position.y = -0.03 //Position (y = up+, down-)
        glft.scene.position.z = 0 //Position (z = front +, back-)
        digital.traverse(o => {
          if (o.isMesh) {
            o.material = SOW.red
            if (o.name === 'D1-2') o.visible = false
            if (o.name === 'D1-5') o.visible = false
            if (o.name === 'D2-7') o.visible = false
            if (o.name === 'D3-7') o.visible = false
          }
        })
        clock.castShadow = true
        clock.receiveShadow = true
        clock.add(digital)
        THIS.setState({clock})
      })

      let module1Loader = new GLTFLoader()
      module1Loader.load('models/mo1.glb', function(gltf) {
        module1 = gltf.scene
        gltf.scene.scale.set(0.42, 0.42, 0.42)
        gltf.scene.position.x = -0.49 //Position (x = right+ left-)
        gltf.scene.position.y = -0.31 //Position (y = up+, down-)
        gltf.scene.position.z = -0.47 //Position (z = front +, back-)
        gltf.scene.rotation.z = Math.PI / 2
        gltf.scene.rotation.y = -Math.PI / 2

        let count = 3 // parseInt(SOW.wireCount[Math.floor(Math.random() * wireCount.length)])
        let wireCases = SOW.wireCountCases[count]
        let wireCase = wireCases[generateRandomIndex(wireCases.length)]
        let wires = module1.children.filter(element =>
          element.name.startsWith('Wire')
        )
        let uncutWires = wires
          .filter(wire => !wire.name.endsWith('Cut'))
          .sort((a, b) => sortByKey(a, b, 'name'))
        let cutWires = wires
          .filter(wire => wire.name.endsWith('Cut'))
          .sort((a, b) => sortByKey(a, b, 'name'))
        while (cutWires.length > count) {
          let wireIndex = generateRandomIndex(cutWires.length)
          module1.remove(cutWires[wireIndex])
          module1.remove(uncutWires[wireIndex])
          cutWires = cutWires.filter((wire, index) => index !== wireIndex)
          uncutWires = uncutWires.filter((wire, index) => index !== wireIndex)
        }

        uncutWires.forEach((wire, index) => {
          wire.material = wireCase.colors[index]
          cutWires[index].material = wireCase.colors[index]
          if (wireCase.correct === index) {
            wire.userData = {correct: true}
          } else {
            wire.userData = {correct: false}
          }
          THIS.setState(prevState => ({
            targetList: [...prevState.targetList, wire]
          }))
        })

        module1.traverse(o => {
          if (o.isMesh) {
            if (o.name === 'Cube001') o.material = SOW.cubeMaterial
            else if (o.name === 'Socket') o.material = SOW.socketMaterial
            else if (o.name === 'LED') LEDcreate(o, module1, 'LED1')
            else if (!o.name.includes('Wire')) o.material = SOW.defaultMaterial
          }
        })

        module1.castShadow = true
        module1.receiveShadow = true
        THIS.setState({module1})
        box.add(module1)
      })

      function LEDcreate(o, modules, name) {
        let em = new THREE.Color(0x000000)
        let LED = new THREE.PointLight(0x00ff00, 5, 0.2, 2)
        LED.name = name
        modules.add(LED)
        LED.position.copy(o.position)
        LED.visible = false
        o.material = new THREE.MeshPhongMaterial({
          transparent: true,
          opacity: 0.9,
          emissive: em,
          color: em,
          shininess: 100
        })
      }

      var module2Loader = new GLTFLoader()
      module2Loader.load('models/mo2.glb', function(glft) {
        module2 = glft.scene
        glft.scene.scale.set(0.42, 0.42, 0.42)
        glft.scene.position.x = 1.45 //Position (x = right+ left-)
        glft.scene.position.y = -0.31 //Position (y = up+, down-)
        glft.scene.position.z = -0.47 //Position (z = front +, back-)
        glft.scene.rotation.z = Math.PI / 2
        glft.scene.rotation.y = -Math.PI / 2

        var texture = new THREE.TextureLoader().load(
          `/models/Button${Math.ceil(Math.random() * 4)}.png`
        )
        texture.wrapS = THREE.RepeatWrapping
        texture.repeat.x = -1

        module2.traverse(o => {
          if (o.isMesh) {
            if (
              o.name === 'Cube' ||
              o.name === 'Cylinder' ||
              o.name === 'LEDbase' ||
              o.name === 'Button001'
            )
              o.material = SOW.defaultMaterial
            else if (o.name === 'Cube001') o.material = SOW.cubeMaterial
            else if (o.name === 'Button002' || o.name === 'Button') {
              o.material = new THREE.MeshPhongMaterial({map: texture})
              o.rotation.x = -2.85
              THIS.setState(prevState => ({
                targetList: [...prevState.targetList, o]
              }))
            } else if (o.name === 'LED') LEDcreate(o, module2, 'LED2')
            else if (o.name === 'Cube002') {
              let em = new THREE.Color(0x000000)
              let SED1 = new THREE.PointLight(0x777700, 4, 13, 200)
              SED1.name = 'LEDstripe1'
              module2.add(SED1)
              SED1.position.copy(o.position)
              SED1.position.z -= 0.9
              SED1.position.x -= 0.8
              SED1.position.y += 0.1
              let SED2 = SED1.clone()
              SED2.name = 'LEDstripe2'
              SED2.position.y -= 0.25
              module2.add(SED2)
              let SED3 = SED1.clone()
              SED3.name = 'LEDstripe3'
              SED3.position.y -= 0.5
              module2.add(SED3)
              let SED4 = SED1.clone()
              SED4.name = 'LEDstripe4'
              SED4.position.y -= 0.75
              module2.add(SED4)
              o.material = new THREE.MeshPhongMaterial({
                transparent: true,
                opacity: 0.9,
                emissive: em,
                color: SED1.color,
                shininess: 500
              })
            }
          }
          module2.castShadow = true
          module2.receiveShadow = true
          THIS.setState({module2})
          box.add(module2)
        })
      })

      let module3Loader = new GLTFLoader()
      module3Loader.load('models/mo3.glb', function(gltf) {
        module3 = gltf.scene
        gltf.scene.scale.set(0.42, 0.42, 0.42)
        gltf.scene.position.x = -0.49 //Position (x = right+ left-)
        gltf.scene.position.y = -0.31 //Position (y = up+, down-)
        gltf.scene.position.z = 0.47 //Position (z = front +, back-)
        gltf.scene.rotation.z = Math.PI / 2
        gltf.scene.rotation.y = -Math.PI / 2
        module3.traverse(o => {
          let texture1 = new THREE.TextureLoader().load(
            `/models/alphabets/Alp${Math.ceil(Math.random() * 42)}.png`
          )
          texture1.wrapT = THREE.RepeatWrapping
          texture1.repeat.y = -1
          let texture2 = new THREE.TextureLoader().load(
            `/models/alphabets/Alp${Math.ceil(Math.random() * 42)}.png`
          )
          texture2.wrapT = THREE.RepeatWrapping
          texture2.repeat.y = -1
          let texture3 = new THREE.TextureLoader().load(
            `/models/alphabets/Alp${Math.ceil(Math.random() * 42)}.png`
          )
          texture3.wrapT = THREE.RepeatWrapping
          texture3.repeat.y = -1
          let texture4 = new THREE.TextureLoader().load(
            `/models/alphabets/Alp${Math.ceil(Math.random() * 42)}.png`
          )
          texture4.wrapT = THREE.RepeatWrapping
          texture4.repeat.y = -1

          if (o.isMesh) {
            if (o.name === 'Cube000') o.material = SOW.cubeMaterial
            else if (o.name === 'LED') LEDcreate(o, module3, 'LED3')
            else if (o.name === 'Lface1') {
              o.material = new THREE.MeshPhongMaterial({map: texture1})
              THIS.setState(prevState => ({
                targetList: [...prevState.targetList, o]
              }))
            } else if (o.name === 'Lface2') {
              o.material = new THREE.MeshPhongMaterial({map: texture2})
              THIS.setState(prevState => ({
                targetList: [...prevState.targetList, o]
              }))
            } else if (o.name === 'Lface3') {
              o.material = new THREE.MeshPhongMaterial({map: texture3})
              THIS.setState(prevState => ({
                targetList: [...prevState.targetList, o]
              }))
            } else if (o.name === 'Lface4') {
              o.material = new THREE.MeshPhongMaterial({map: texture4})
              THIS.setState(prevState => ({
                targetList: [...prevState.targetList, o]
              }))
            } else if (o.name.includes('Letter')) {
              o.material = new THREE.MeshPhongMaterial({map: texture1})
              THIS.setState(prevState => ({
                targetList: [...prevState.targetList, o]
              }))
            } else if (o.name.includes('LG')) {
              o.material = new THREE.MeshPhongMaterial({
                color: new THREE.Color(0x000000),
                shininess: 100
              })
            } else {
              o.material = SOW.defaultMaterial
            }
          }
        })

        module3.castShadow = true
        module3.receiveShadow = true
        THIS.setState({module3})
        box.add(module3)
      })

      let module4Loader = new GLTFLoader()
      module4Loader.load('models/mo4.glb', function(gltf) {
        module4 = gltf.scene
        gltf.scene.scale.set(0.42, 0.42, 0.42)
        gltf.scene.position.x = 1.45 //Position (x = right+ left-)
        gltf.scene.position.y = -0.31 //Position (y = up+, down-)
        gltf.scene.position.z = 0.47 //Position (z = front +, back-)
        gltf.scene.rotation.z = Math.PI / 2
        gltf.scene.rotation.y = -Math.PI / 2

        let ranPos = () => {
          return Math.ceil(Math.random() * 6)
          // return ans ? ans : 1
        }

        module4.traverse(o => {
          if (o.isMesh) {
            if (o.name === 'Cube000') o.material = SOW.cubeMaterial
            else if (
              o.name === 'LEDbase' ||
              o.name === 'Cylinder' ||
              o.name === 'Cube'
            )
              o.material = SOW.defaultMaterial
            else if (o.name === 'LED') LEDcreate(o, module4, 'LED4')
            else if (o.name === 'Board') o.material = SOW.cubeMaterial
            else if (o.name.includes('Go')) {
              o.material = SOW.cubeMaterial
              THIS.setState(prevState => ({
                targetList: [...prevState.targetList, o]
              }))
            } else if (o.name === 'CircleOne') {
              o.material = SOW.green
              o.position.copy(
                module4.children.filter(a => a.name === 'Pos21')[0].position
              )
              o.position.x -= 0.165
            } else if (o.name === 'CircleTwo') {
              o.material = SOW.green
              o.position.copy(
                module4.children.filter(a => a.name === 'Pos36')[0].position
              )
              o.position.x -= 0.165
            } else if (o.name === 'End') {
              o.material = SOW.redTran
              let randomName = `Pos${ranPos()}${ranPos()}`
              o.position.copy(
                module4.children.filter(a => a.name === randomName)[0].position
              )
              o.position.x -= 0.1
              o.position.y += 0.06
              o.position.z -= 0.07
            } else {
              o.material = SOW.flatBlack
            }
          }
        })

        let randomName = `Pos${ranPos()}${ranPos()}`
        head = module4.children.filter(a => a.name === randomName)[0]
        head.material = SOW.white
        THIS.setState({head})
        module4.castShadow = true
        module4.receiveShadow = true
        THIS.setState({module4})
        box.add(module4)
      })

      let module5Loader = new GLTFLoader()
      module5Loader.load('models/mo5.glb', function(gltf) {
        module5 = gltf.scene
        gltf.scene.scale.set(0.42, 0.42, 0.42)
        gltf.scene.position.x = 0.49 //Position (x = right+ left-)
        gltf.scene.position.y = -0.31 //Position (y = up+, down-)
        gltf.scene.position.z = 0.47 //Position (z = front +, back-)
        gltf.scene.rotation.z = Math.PI / 2
        gltf.scene.rotation.y = -Math.PI / 2

        let texture1 = new THREE.TextureLoader().load(`/models/Key1.png`)
        texture1.wrapT = THREE.RepeatWrapping
        texture1.repeat.y = -1
        let texture2 = new THREE.TextureLoader().load(`/models/Key2.png`)
        texture2.wrapT = THREE.RepeatWrapping
        texture2.repeat.y = -1
        let texture3 = new THREE.TextureLoader().load(`/models/Key3.png`)
        texture3.wrapT = THREE.RepeatWrapping
        texture3.repeat.y = -1
        let texture4 = new THREE.TextureLoader().load(`/models/Key4.png`)
        texture4.wrapT = THREE.RepeatWrapping
        texture4.repeat.y = -1
        let texture5 = new THREE.TextureLoader().load(
          `/models/Read${Math.ceil(Math.random() * 4)}.png`
        )
        texture5.wrapT = THREE.RepeatWrapping
        texture5.repeat.y = -1

        module5.traverse(o => {
          function CEDcreate(o, y) {
            let CED = new THREE.PointLight(0x006600, 5, 0.2, 2)
            CED.name = o.name
            module5.add(CED)
            CED.position.set(0.6, y, -0.7)
            CED.visible = false
            o.material = new THREE.MeshPhongMaterial({
              transparent: true,
              opacity: 0.9,
              emissive: new THREE.Color(0x000000),
              color: new THREE.Color(0x006600),
              shininess: 70
            })
          }
          if (o.isMesh) {
            if (o.name === 'Cube000') o.material = SOW.cubeMaterial
            else if (
              o.name === 'LEDbase' ||
              o.name === 'Cylinder' ||
              o.name === 'Cube' ||
              o.name === 'Ftwo'
            )
              o.material = SOW.defaultMaterial
            else if (o.name === 'LED') LEDcreate(o, module5, 'LEDfive')
            else if (
              o.name === 'Board' ||
              o.name === 'Fone' ||
              o.name === 'Fthree'
            )
              o.material = SOW.cubeMaterial
            else if (o.name === 'Read1' || o.name === 'Correct')
              o.material = SOW.flatBlack
            else if (o.name === 'CED5') CEDcreate(o, -0.56)
            else if (o.name === 'CED6') CEDcreate(o, -0.43)
            else if (o.name === 'CED7') CEDcreate(o, -0.3)
            else if (o.name === 'CED8') CEDcreate(o, -0.17)
            else if (o.name === 'CED9') CEDcreate(o, -0.04)
            else if (o.name.includes('1')) {
              o.material = new THREE.MeshPhongMaterial({map: texture1})
              THIS.setState(prevState => ({
                targetList: [...prevState.targetList, o]
              }))
            } else if (o.name.includes('2')) {
              o.material = new THREE.MeshPhongMaterial({map: texture2})
              THIS.setState(prevState => ({
                targetList: [...prevState.targetList, o]
              }))
            } else if (o.name.includes('3')) {
              o.material = new THREE.MeshPhongMaterial({map: texture3})
              THIS.setState(prevState => ({
                targetList: [...prevState.targetList, o]
              }))
            } else if (o.name.includes('4')) {
              o.material = new THREE.MeshPhongMaterial({map: texture4})
              THIS.setState(prevState => ({
                targetList: [...prevState.targetList, o]
              }))
            } else if (o.name === 'ReadNumber') {
              o.material = new THREE.MeshPhongMaterial({map: texture5})
              THIS.setState(prevState => ({
                targetList: [...prevState.targetList, o]
              }))
            } else o.material = SOW.flatBlack
          }
        })
        module5.castShadow = true
        module5.receiveShadow = true
        THIS.setState({module5})
        box.add(module5)
      })

      // Renderer

      renderer = new THREE.WebGLRenderer()
      renderer.shadowMap.enabled = true
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(window.innerWidth, window.innerHeight)
      window.addEventListener('resize', onWindowResize, false)
      THIS.mount.appendChild(renderer.domElement)

      // Dragger

      let isDragging = false
      let previousMousePosition = {
        x: 0,
        y: 0
      }

      const toRadians = angle => {
        return angle * (Math.PI / 180)
      }

      const toDegrees = angle => {
        return angle * (180 / Math.PI)
      }

      const renderArea = renderer.domElement

      renderArea.addEventListener('mousedown', e => {
        isDragging = true
      })

      renderArea.addEventListener('mousemove', e => {
        let deltaMove = {
          x: e.offsetX - previousMousePosition.x,
          y: e.offsetY - previousMousePosition.y
        }

        if (isDragging) {
          let deltaRotationQuaternion = new THREE.Quaternion().setFromEuler(
            new THREE.Euler(toRadians(deltaMove.y * 1), 0, 0, 'XYZ')
          )
          box.quaternion.multiplyQuaternions(
            deltaRotationQuaternion,
            box.quaternion
          )
        }

        previousMousePosition = {
          x: e.offsetX,
          y: e.offsetY
        }
      })

      document.addEventListener('mouseup', e => {
        isDragging = false
        if (
          module2.children.filter(a => a.name.startsWith('Button'))[0].position
            .x < 0.4
        )
          module2.children
            .filter(a => a.name.startsWith('Button'))
            .map(b => (b.position.x += 0.18))
        module4.children.filter(a => a.name.includes('Go')).map(b => {
          if (b.material.shininess === 10) b.material = SOW.cubeMaterial
        })
      })

      projector = new THREE.Projector()
      document.addEventListener(
        'mousedown',
        e => {
          onDocumentMouseDown(e, THIS)
        },
        false
      )
    }

    function onDocumentMouseDown(event, THIS) {
      const {minute, tenSecond, singleSecond} = THIS.state
      const times = [minute, tenSecond, singleSecond]
      // the following line would stop any other event handler from firing
      // (such as the mouse's TrackballControls)
      // event.preventDefault();

      // update the mouse variable
      mouse.x = event.clientX / window.innerWidth * 2 - 1
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

      // find intersections
      // create a Ray with origin at the mouse position
      //   and direction into the scene (camera direction)
      var vector = new THREE.Vector3(mouse.x, mouse.y, 1)
      projector.unprojectVector(vector, camera)
      var ray = new THREE.Raycaster(
        camera.position,
        vector.sub(camera.position).normalize()
      )
      // create an array containing all objects in the scene with which the ray intersects
      var intersects = ray.intersectObjects(THIS.state.targetList)
      // if there is one (or more) intersections
      if (intersects.length > 0) {
        THIS.handleSOW(intersects[0].object.userData)
        module1.remove(intersects[0].object)
        //module2
        if (
          intersects[0].object.name === 'Button' ||
          intersects[0].object.name === 'Button002'
        ) {
          module2.children
            .filter(a => a.name.startsWith('Button'))
            .map(b => (b.position.x -= 0.18))
        }
        // module3
        if (
          intersects[0].object.name.includes('Letter') ||
          intersects[0].object.name.includes('Lface')
        ) {
          module3.children
            .filter(a =>
              a.name.includes('' + intersects[0].object.name.slice(-1))
            )
            .map(b => {
              if (b.position.x > 1.26) b.position.x -= 0.07
              if (b.position.x < 0.5 && b.position.x > 0.35) {
                if (b.name !== 'LED3') {
                  b.position.x -= 0.07
                  b.material.color.setRGB(0, 1, 0)
                }
              }
            })
        }
        // module4
        let head = THIS.state.head
        if (intersects[0].object.name.includes('Go')) {
          intersects[0].object.material = SOW.flatBlack
          if (intersects[0].object.name === 'GoUp') {
            if (head.name[3] !== '1') {
              head.material = SOW.flatBlack
              let newHead =
                head.name.slice(0, 3) +
                (Number(head.name[3]) - 1) +
                head.name[4]
              head = module4.children.filter(a => a.name === newHead)[0]
              head.material = SOW.white
              THIS.setState({head})
            }
          } else if (intersects[0].object.name === 'GoDown') {
            if (head.name[3] !== '6') {
              head.material = SOW.flatBlack
              let newHead =
                head.name.slice(0, 3) +
                (Number(head.name[3]) + 1) +
                head.name[4]
              head = module4.children.filter(a => a.name === newHead)[0]
              head.material = SOW.white
              THIS.setState({head})
            }
          } else if (intersects[0].object.name === 'GoLeft') {
            if (head.name[4] !== '1') {
              head.material = SOW.flatBlack
              let newHead = head.name.slice(0, 4) + (Number(head.name[4]) - 1)
              head = module4.children.filter(a => a.name === newHead)[0]
              head.material = SOW.white
              THIS.setState({head})
            }
          } else if (intersects[0].object.name === 'GoRight') {
            if (head.name[4] !== '6') {
              head.material = SOW.flatBlack
              let newHead = head.name.slice(0, 4) + (Number(head.name[4]) + 1)
              head = module4.children.filter(a => a.name === newHead)[0]
              head.material = SOW.white
              THIS.setState({head})
            }
          }
        }
        // module5

        let correct = THIS.state.correct
        if (intersects[0].object.name.includes('Kface')) {
          module5.children
            .filter(a =>
              a.name.includes('' + intersects[0].object.name.slice(-1))
            )
            .map(b => {
              if (b.position.x > 1.28) b.position.x -= 0.07
            })
          if (intersects[0].object.name === 'Kface2') {
            module5.children.filter(a => a.name.includes(correct)).map(b => {
              b.visible = true
            })
            if (correct !== '9') {
              correct = Number(correct) + 1 + ''
              THIS.setState({correct})
            }
          }
          if (intersects[0].object.name === 'Kface3') {
            module5.children.filter(a => a.name.includes(correct)).map(b => {
              b.visible = true
            })
            if (correct !== '9') {
              correct = Number(correct) + 1 + ''
              THIS.setState({correct})
            }
          }
        }
      }
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()

      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    function animate() {
      requestAnimationFrame(animate)

      renderer.render(scene, camera)
    }
    this.handleStart()
  }

  componentWillUnmount() {
    this.mount.removeChild(this.renderer.domElement)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.strikeCount < this.state.strikeCount) {
      if (this.state.strikeCount === this.state.strikesAllowed)
        console.log('GAME OVER')
      else {
        const count = this.state.strikeCount
        console.log(count)
        const Strike = this.state.clock.children.find(
          child => child.name === `Strike${count}`
        )
        Strike.visible = true
      }
      // make a util for strike material and a helper function for getting and setting a strike
    } else if (this.state)
      if (
        prevState.SubjectOfWires.passed !== this.state.SubjectOfWires.passed
      ) {
        // helperfunction and util for LED; pass in the module and turn on its LED
        const LED = this.state.module1.children.find(
          child => child.name === 'LED'
        )
        LED.material.color.setRGB(0, 1, 0)
        this.state.module1.children.filter(
          a => a.name === 'LED1'
        )[0].visible = true
      }

    const setClock = (position, time) => {
      this.state.clock.children[6].children
        .filter(child => child.name.startsWith(`D${position}`))
        .sort((a, b) => sortByKey(a, b, 'name'))
        .forEach(
          (mark, index) => (mark.visible = clockCases[String(time)][index])
        )
    }

    if (prevState.count !== this.state.count) {
      const {count} = this.state
      const minute = Math.floor(count / 60)
      const seconds = count % 60
      const tenSecond = Math.floor((seconds % 60) / 10)
      const singleSecond = seconds % 10
      if (prevState.minute !== minute) {
        this.setState({minute})
        setClock('1', minute)
        if (minute === 0) {
          let spotLight = this.state.spotLight
          spotLight.color.g = 0
          spotLight.color.b = 0
          spotLight.intensity = 0.7
          setInterval(function() {
            spotLight.visible = !spotLight.visible
          }, 1000)
          this.setState({spotLight})
        }
      }
      if (prevState.tenSecond !== tenSecond) {
        this.setState({tenSecond})
        setClock('2', tenSecond)
      }
      if (prevState.singleSecond !== singleSecond) {
        this.setState({singleSecond})
        setClock('3', singleSecond)
      }
    }
  }

  handleSOW = wire => {
    if (wire.correct === true) {
      this.setState(({SubjectOfWires}) => ({
        SubjectOfWires: {
          ...SubjectOfWires,
          passed: !SubjectOfWires.passed
        }
      }))
    } else {
      this.setState(({strikeCount}) => ({
        strikeCount: strikeCount + 1
      }))
    }
  }

  render() {
    const {gameStatus} = this.props
    if (!this.props.gameStarted) return <Redirect to="/new-game" />
    return (
      <Fragment>
        {gameStatus !== 'pending' && (
          <div className={`banner ${gameStatus}--banner`}>{gameStatus}</div>
        )}
        <div
          id="bomb-box"
          ref={mount => {
            this.mount = mount
          }}
        />
      </Fragment>
    )
  }
}

const mapState = ({game}) => ({...game})

export default connect(mapState, null)(Bomb)
