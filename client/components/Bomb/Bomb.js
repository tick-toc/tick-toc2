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
      targetList: []
    }
  }

  handleStart() {
    this.timer = setInterval(() => {
      const newCount = this.state.count - 1
      this.setState({count: newCount >= 0 ? newCount : 0})
    }, 1000)
  }

  componentDidMount() {
    var camera, scene, renderer, box, clock, digital, module1, module2, module3
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
        var material2 = new THREE.MeshPhongMaterial({
          color: 0x222222,
          shininess: 10
        })
        clock.traverse(o => {
          if (o.isMesh) {
            if (o.name === 'Cube001') o.material = material2
            else if (o.name === 'Cube002') {
              o.material = SOW.cubeMaterial
            } else if (o.name === 'Strike1' || o.name === 'Strike2') {
              o.material = new THREE.MeshPhongMaterial({
                color: 0xff0000,
                shininess: 10
              })
              o.visible = false
            } else o.material = SOW.defaultMaterial
          }
        })
        clock.castShadow = true
        clock.receiveShadow = true
        THIS.setState({clock})
        box.add(clock)
      })

      var digitalLoader = new GLTFLoader()
      digitalLoader.load('models/digital.glb', function(glft) {
        digital = glft.scene
        glft.scene.scale.set(0.9, 0.9, 0.9)
        glft.scene.position.x = 0 //Position (x = right+ left-)
        glft.scene.position.y = -0.03 //Position (y = up+, down-)
        glft.scene.position.z = 0 //Position (z = front +, back-)
        var material = new THREE.MeshPhongMaterial({
          color: 0xee0000,
          shininess: 100
        })
        digital.traverse(o => {
          if (o.isMesh) {
            o.material = material //this is where we paint the clock
            if (o.name === 'D1-2') o.visible = false
            if (o.name === 'D1-5') o.visible = false
            if (o.name === 'D2-7') o.visible = false
            if (o.name === 'D3-7') o.visible = false
          }
        })
        clock.castShadow = true
        clock.receiveShadow = true
        // THIS.setState({ clock })
        clock.add(digital)
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
            else if (o.name === 'LED') {
              let em = new THREE.Color(0x000000)
              let LEDmo1 = new THREE.PointLight(0x00ff00, 5, 0.2, 2)
              LEDmo1.name = 'LED1'
              module1.add(LEDmo1)
              LEDmo1.position.copy(o.position)
              LEDmo1.visible = false
              o.material = new THREE.MeshPhongMaterial({
                transparent: true,
                opacity: 0.9,
                emissive: em,
                color: em,
                shininess: 100
              })
            } else if (!o.name.includes('Wire'))
              o.material = SOW.defaultMaterial
          }
        })

        module1.castShadow = true
        module1.receiveShadow = true
        THIS.setState({module1})
        box.add(module1)
      })

      var module2Loader = new GLTFLoader()
      module2Loader.load('models/mo2.glb', function(glft) {
        module2 = glft.scene
        glft.scene.scale.set(0.42, 0.42, 0.42)
        glft.scene.position.x = 1.45 //Position (x = right+ left-)
        glft.scene.position.y = -0.31 //Position (y = up+, down-)
        glft.scene.position.z = -0.47 //Position (z = front +, back-)
        glft.scene.rotation.z = Math.PI / 2
        glft.scene.rotation.y = -Math.PI / 2

        var texture = new THREE.TextureLoader().load('/models/Button1.png')
        texture.wrapS = THREE.RepeatWrapping
        texture.repeat.x = -1

        module2.traverse(o => {
          if (o.isMesh) {
            if (
              o.name === 'Cube' ||
              o.name === 'Cylinder' ||
              o.name === 'LEDbase' ||
              o.name === 'Circle001'
            )
              o.material = SOW.defaultMaterial
            else if (o.name === 'Cube001') o.material = SOW.cubeMaterial
            else if (o.name === 'Circle002' || o.name === 'Circle') {
              o.material = new THREE.MeshPhongMaterial({map: texture})
              o.rotation.x = -2.85
              THIS.setState(prevState => ({
                targetList: [...prevState.targetList, o]
              }))
            } else if (o.name === 'LED') {
              let em = new THREE.Color(0x000000)
              let LEDmo2 = new THREE.PointLight(0x00ff00, 5, 0.2, 2)
              LEDmo2.name = 'LEDlight'
              module2.add(LEDmo2)
              LEDmo2.position.copy(o.position)
              LEDmo2.visible = false
              o.material = new THREE.MeshPhongMaterial({
                transparent: true,
                opacity: 0.9,
                emissive: em,
                color: em,
                shininess: 100
              })
            } else if (o.name === 'Cube002') {
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
          var texture1 = new THREE.TextureLoader().load(
            `/models/alphabets/Alp${Math.ceil(Math.random() * 42)}.png`
          )
          texture1.wrapT = THREE.RepeatWrapping
          texture1.repeat.y = -1
          var texture2 = new THREE.TextureLoader().load(
            `/models/alphabets/Alp${Math.ceil(Math.random() * 42)}.png`
          )
          texture2.wrapT = THREE.RepeatWrapping
          texture2.repeat.y = -1
          var texture3 = new THREE.TextureLoader().load(
            `/models/alphabets/Alp${Math.ceil(Math.random() * 42)}.png`
          )
          texture3.wrapT = THREE.RepeatWrapping
          texture3.repeat.y = -1
          var texture4 = new THREE.TextureLoader().load(
            `/models/alphabets/Alp${Math.ceil(Math.random() * 42)}.png`
          )
          texture4.wrapT = THREE.RepeatWrapping
          texture4.repeat.y = -1

          if (o.isMesh) {
            if (o.name === 'Cube000') o.material = SOW.cubeMaterial
            else if (o.name === 'LED') {
              let em = new THREE.Color(0x000000)
              let LEDmo3 = new THREE.PointLight(0x00ff00, 5, 0.2, 2)
              LEDmo3.name = 'LED3'
              module3.add(LEDmo3)
              LEDmo3.position.copy(o.position)
              LEDmo3.visible = false
              o.material = new THREE.MeshPhongMaterial({
                transparent: true,
                opacity: 0.9,
                emissive: em,
                color: em,
                shininess: 100
              })
            } else if (o.name.includes('Bface1')) {
              o.material = new THREE.MeshPhongMaterial({map: texture1})
              THIS.setState(prevState => ({
                targetList: [...prevState.targetList, o]
              }))
            } else if (o.name.includes('Bface2')) {
              o.material = new THREE.MeshPhongMaterial({map: texture2})
              THIS.setState(prevState => ({
                targetList: [...prevState.targetList, o]
              }))
            } else if (o.name.includes('Bface3')) {
              o.material = new THREE.MeshPhongMaterial({map: texture3})
              THIS.setState(prevState => ({
                targetList: [...prevState.targetList, o]
              }))
            } else if (o.name.includes('Bface4')) {
              o.material = new THREE.MeshPhongMaterial({map: texture4})
              THIS.setState(prevState => ({
                targetList: [...prevState.targetList, o]
              }))
            } else if (o.name.includes('Button')) {
              o.material = new THREE.MeshPhongMaterial({map: texture1})
              THIS.setState(prevState => ({
                targetList: [...prevState.targetList, o]
              }))
            } else if (o.name.includes('BG')) {
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
          module2.children.filter(a => a.name.startsWith('Circle'))[0].position
            .x < 0.4
        )
          module2.children
            .filter(a => a.name.startsWith('Circle'))
            .map(b => (b.position.x += 0.18))
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
        if (
          intersects[0].object.name === 'Circle' ||
          intersects[0].object.name === 'Circle002'
        ) {
          module2.children
            .filter(a => a.name.startsWith('Circle'))
            .map(b => (b.position.x -= 0.18))
        }
        if (
          intersects[0].object.name.includes('Button') ||
          intersects[0].object.name.includes('Bface')
        ) {
          module3.children
            .filter(a =>
              a.name.includes('' + intersects[0].object.name.slice(-1))
            )
            .map(b => {
              if (b.position.x > 1.26) b.position.x -= 0.07
              if (b.position.x < 0.5 && b.position.x > 0.35) {
                b.position.x -= 0.07
                b.material.color.setRGB(0, 1, 0)
              }
            })
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
    // if (this.state.count === 0) {
    //   // dispatch action to
    // }

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
