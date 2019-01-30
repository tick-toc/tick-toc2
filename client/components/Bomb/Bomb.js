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
      box: {},
      clock: {},
      module1: {},
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
    var camera, scene, renderer, box, clock, digital, module1, module2
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
        let material = new THREE.MeshPhongMaterial({
          color: 0xa9acb5,
          shininess: 100
        })
        let material2 = new THREE.MeshPhongMaterial({
          color: 0x222222,
          shininess: 10
        })
        box.traverse(o => {
          if (o.isMesh) {
            if (o.name === 'Cube001') {
              o.material = SOW.cubeMaterial
            } else o.material = SOW.defaultMaterial
          }
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
        glft.scene.position.x = 0.49 //Position (x = right+ left-)
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
        glft.scene.position.y = 0 //Position (y = up+, down-)
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
        glft.scene.position.x = 1.49 //Position (x = right+ left-)
        glft.scene.position.y = -0.31 //Position (y = up+, down-)
        glft.scene.position.z = -0.47 //Position (z = front +, back-)
        glft.scene.rotation.z = Math.PI / 2
        glft.scene.rotation.y = -Math.PI / 2

        module2.traverse(o => {
          var img = new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('/models/Button1.png')
          })
          if (o.isMesh) {
            if (
              o.name === 'Cube' ||
              o.name === 'Cylinder' ||
              o.name === 'LEDbase' ||
              o.name === 'Circle001'
            )
              o.material = SOW.defaultMaterial
            else if (o.name === 'Cube001') o.material = SOW.cubeMaterial
            else if (o.name === 'Circle') o.material = img
            else if (o.name === 'LED') {
              let em = new THREE.Color(0x000000)
              let LEDmo2 = new THREE.PointLight(0x00ff00, 5, 0.2, 2)
              LEDmo2.name = 'LEDlight'
              module2.add(LEDmo2)
              LEDmo2.position.copy(o.position)
              LEDmo2.visible = true
              o.material = new THREE.MeshPhongMaterial({
                transparent: true,
                opacity: 0.9,
                emissive: em,
                color: LEDmo2.color,
                shininess: 100
              })
            } else if (o.name === 'Cube002') {
              let em = new THREE.Color(0x000000)
              let SEDmo2 = new THREE.PointLight(0x777700, 10, 0.8, 2)
              SEDmo2.name = 'LEDstripe'
              module2.add(SEDmo2)
              SEDmo2.position.copy(o.position)
              SEDmo2.visible = false
              o.material = new THREE.MeshPhongMaterial({
                transparent: true,
                opacity: 0.9,
                emissive: em,
                color: SEDmo2.color,
                shininess: 100
              })
            }
          }
          box.add(module2)
        })
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
      console.log(intersects, '<<INTERSECTS')
      if (intersects.length > 0) {
        if (THIS.state.targetList.includes(intersects[0].object)) {
          console.log('YOOOO')
        }
        THIS.handleSOW(intersects[0].object.userData)
        module1.remove(intersects[0].object)
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
