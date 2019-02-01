/* eslint-disable max-statements */

import React, {Component, Fragment} from 'react'
import * as THREE from 'three'
import GLTFLoader from 'three-gltf-loader'
import {wireCount, wireCountCases} from './modules/wires'
import {clockCases} from './modules/clock'
import * as util from './modules/util'
import {generateRandomIndex, sortByKey} from '../util'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {setStrike, passModule} from '../../store/game'

class RefacBomb extends Component {
  state = {
    count: this.props.startTime,
    minute: 0,
    tenSecond: 0,
    singleSecond: 0
  }

  async componentDidMount() {
    this.targetList = []

    this.scene = new THREE.Scene()

    this.camera = new THREE.PerspectiveCamera(
      36,
      window.innerWidth / window.innerHeight,
      0.25,
      16
    )

    this.camera.position.set(0, 1.8, 4)

    this.scene.add(new THREE.AmbientLight(0x505050))

    this.spotLight = new THREE.SpotLight(0xffffff)

    this.spotLight.angle = Math.PI / 4
    this.spotLight.penumbra = 0.2
    this.spotLight.position.set(3.2, 3.2, 2.9)
    this.spotLight.castShadow = true
    this.spotLight.shadow.camera.near = 3
    this.spotLight.shadow.camera.far = 10
    this.spotLight.shadow.mapSize.width = 1024
    this.spotLight.shadow.mapSize.height = 1024

    this.scene.add(this.spotLight)

    this.dirLight = new THREE.DirectionalLight(0x55505a, 1)

    this.dirLight.position.set(0, 3, 0)
    this.dirLight.castShadow = true
    this.dirLight.shadow.camera.near = 1
    this.dirLight.shadow.camera.far = 10
    this.dirLight.shadow.camera.right = 1
    this.dirLight.shadow.camera.left = -1
    this.dirLight.shadow.camera.top = 1
    this.dirLight.shadow.camera.bottom = -1
    this.dirLight.shadow.mapSize.width = 1024
    this.dirLight.shadow.mapSize.height = 1024

    this.scene.add(this.dirLight)

    this.boxLoader = new GLTFLoader()

    this.boxLoader.load('models/box.glb', gltf => {
      this.box = gltf.scene
      this.scene.add(this.box)
      this.box.scale.set(1, 1, 1)
      this.box.position.x = -0.5 //Position (x = right+ left-)
      this.box.position.y = 1.7 //Position (y = up+, down-)
      this.box.position.z = 0 //Position (z = front +, back-)
      this.box.rotation.x = Math.PI / 2
      this.box.traverse(o => {
        if (o.isMesh) {
          if (o.name === 'Cube001') {
            o.material = util.cubeMaterial
          } else o.material = util.defaultMaterial
        }
      })
      this.box.castShadow = true
      this.box.receiveShadow = true
    })

    this.clockLoader = new GLTFLoader()

    this.clockLoader.load('models/clock.glb', glft => {
      this.clock = glft.scene
      this.box.add(this.clock)
      this.clock.scale.set(0.44, 0.44, 0.44)
      this.clock.position.x = 0.49 //Position (x = right+ left-)
      this.clock.position.y = -0.31 //Position (y = up+, down-)
      this.clock.position.z = -0.47 //Position (z = front +, back-)
      this.clock.rotation.z = Math.PI / 2
      this.clock.rotation.y = -Math.PI / 2
      this.clock.traverse(o => {
        if (o.isMesh) {
          if (o.name === 'Cube001') o.material = util.clockBackground
          else if (o.name === 'Cube002') {
            o.material = util.cubeMaterial
          } else if (o.name === 'Strike1' || o.name === 'Strike2') {
            o.material = new THREE.MeshPhongMaterial({
              color: 0xff0000,
              shininess: 10
            })
            o.visible = false
          } else o.material = util.defaultMaterial
        }
      })
      this.clock.castShadow = true
      this.clock.receiveShadow = true
    })

    this.digitalLoader = new GLTFLoader()

    await this.digitalLoader.load('models/digital.glb', glft => {
      this.digital = glft.scene
      this.clock.add(this.digital)
      this.digital.scale.set(0.9, 0.9, 0.9)
      this.digital.position.x = 0 //Position (x = right+ left-)
      this.digital.position.y = 0 //Position (y = up+, down-)
      this.digital.position.z = 0 //Position (z = front +, back-)
      this.digital.traverse(o => {
        if (o.isMesh) {
          o.material = util.brightRed
          if (o.name !== 'Dot') {
            o.visible = false
          }
        }
      })
      this.calcInitialClock()
    })

    this.module1Loader = new GLTFLoader()

    this.module1Loader.load('models/mo1.glb', gltf => {
      this.module1 = gltf.scene
      this.box.add(this.module1)
      this.module1.scale.set(0.42, 0.42, 0.42)
      this.module1.position.x = -0.49 //Position (x = right+ left-)
      this.module1.position.y = -0.31 //Position (y = up+, down-)
      this.module1.position.z = -0.47 //Position (z = front +, back-)
      this.module1.rotation.z = Math.PI / 2
      this.module1.rotation.y = -Math.PI / 2

      let count = 3 // parseInt(wireCount[Math.floor(Math.random() * wireCount.length)])
      let wireCases = wireCountCases[count]
      let wireCase = wireCases[generateRandomIndex(wireCases.length)]
      let wires = this.module1.children.filter(element =>
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
        this.module1.remove(cutWires[wireIndex])
        this.module1.remove(uncutWires[wireIndex])
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
        this.targetList.push(wire)
      })

      this.module1.traverse(o => {
        if (o.isMesh) {
          if (o.name === 'Cube001') o.material = util.cubeMaterial
          else if (o.name === 'Socket') o.material = util.socketMaterial
          else if (o.name === 'LED') {
            let glow = new THREE.PointLight(0x00ff00, 5, 0.2, 2)
            glow.name = 'glow'
            this.module1.add(glow)
            glow.position.copy(o.position)
            glow.visible = false
            o.material = util.LEDMaterialOFF
          } else if (!o.name.includes('Wire')) o.material = util.defaultMaterial
        }
      })
      this.module1.castShadow = true
      this.module1.receiveShadow = true
    })

    this.module2Loader = new GLTFLoader()

    this.module2Loader.load('models/mo2.glb', glft => {
      this.module2 = glft.scene
      this.box.add(this.module2)
      this.module2.scale.set(0.42, 0.42, 0.42)
      this.module2.position.x = 1.45 //Position (x = right+ left-)
      this.module2.position.y = -0.31 //Position (y = up+, down-)
      this.module2.position.z = -0.47 //Position (z = front +, back-)
      this.module2.rotation.z = Math.PI / 2
      this.module2.rotation.y = -Math.PI / 2

      let texture = new THREE.TextureLoader().load('/models/Button1.png')
      texture.wrapS = THREE.RepeatWrapping
      texture.repeat.x = -1

      this.module2.traverse(o => {
        if (o.isMesh) {
          if (o.name === 'Cube001') o.material = util.cubeMaterial
          else if (o.name === 'Circle002' || o.name === 'Circle') {
            o.material = new THREE.MeshPhongMaterial({map: texture})
            o.rotation.x = -2.85
            this.targetList.push(o)
          } else if (o.name === 'LED') {
            let LED = new THREE.PointLight(0x00ff00, 5, 0.2, 2)
            LED.name = 'glow'
            this.module2.add(LED)
            LED.position.copy(o.position)
            LED.visible = false
            o.material = util.LEDMaterialOFF
          } else if (o.name === 'Cube002') {
            let em = new THREE.Color(0x000000)
            let SED1 = new THREE.PointLight(0x777700, 4, 13, 200)
            SED1.name = 'LEDstripe1'
            this.module2.add(SED1)
            SED1.position.copy(o.position)
            SED1.position.z -= 0.9
            SED1.position.x -= 0.8
            SED1.position.y += 0.1
            let SED2 = SED1.clone()
            SED2.name = 'LEDstripe2'
            SED2.position.y -= 0.25
            this.module2.add(SED2)
            let SED3 = SED1.clone()
            SED3.name = 'LEDstripe3'
            SED3.position.y -= 0.5
            this.module2.add(SED3)
            let SED4 = SED1.clone()
            SED4.name = 'LEDstripe4'
            SED4.position.y -= 0.75
            this.module2.add(SED4)
            o.material = new THREE.MeshPhongMaterial({
              transparent: true,
              opacity: 0.9,
              emissive: em,
              color: SED1.color,
              shininess: 500
            })
          } else {
            o.material = util.defaultMaterial
          }
        }
        this.module2.castShadow = true
        this.module2.receiveShadow = true
      })
    })

    // this.module3Loader = new GLTFLoader()

    // await this.module3Loader.load('models/mo3.glb', (gltf) => {
    //   this.module3 = gltf.scene
    //   this.box.add(this.module3)
    //   this.module3.scale.set(0.42, 0.42, 0.42)
    //   this.module3.position.x = -0.49 //Position (x = right+ left-)
    //   this.module3.position.y = -0.31 //Position (y = up+, down-)
    //   this.module3.position.z = 0.47 //Position (z = front +, back-)
    //   this.module3.rotation.z = Math.PI / 2
    //   this.module3.rotation.y = -Math.PI / 2
    //   this.module3.traverse(o => {
    //     console.log(o)
    //     if (o.isMesh) {
    //       if (o.name === 'Cube000') o.material = util.cubeMaterial
    //       else if (o.name === 'LED') {
    //         let LEDmo3 = new THREE.PointLight(0x00ff00, 5, 0.2, 2)
    //         LEDmo3.name = 'LED'
    //         this.module3.add(LEDmo3)
    //         LEDmo3.position.copy(o.position)
    //         LEDmo3.visible = false
    //         o.material = util.LEDMaterial
    //       } else if (o.name.includes('Bface')) {
    //         // foreach over the four items setting texture to texture in texture array in symbols
    //         this.targetList.push(o)
    //       }
    //        else if (o.name.includes('Button')) {
    //         // o.material = new THREE.MeshPhongMaterial({ map: texture1 })
    //         this.targetList.push(o)
    //       } else if (o.name.includes('BG')) {
    //         o.material = util.black
    //       } else {
    //         o.material = util.defaultMaterial
    //       }
    //     }
    //   })
    //   this.module3.castShadow = true
    //   this.module3.receiveShadow = true
    // })

    this.renderer = new THREE.WebGLRenderer({antialias: true})
    this.renderer.shadowMap.enabled = true
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.mount.appendChild(this.renderer.domElement)
    window.addEventListener('resize', this.onWindowResize, false)

    this.isDragging = false

    this.toRadians = angle => {
      return angle * (Math.PI / 180)
    }

    this.toDegress = angle => {
      return angle * (180 / Math.PI)
    }

    this.mouse = {
      x: 0,
      y: 0
    }

    this.previousMousePosition = {
      x: 0,
      y: 0
    }

    this.renderArea = this.renderer.domElement

    this.renderArea.addEventListener('mousedown', e => {
      this.isDragging = true
    })

    this.renderArea.addEventListener('mousemove', e => {
      let deltaMove = {
        x: e.offsetX - this.previousMousePosition.x,
        y: e.offsetY - this.previousMousePosition.y
      }

      if (this.isDragging) {
        let deltaRotationQuaternion = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(this.toRadians(deltaMove.y * 1), 0, 0, 'XYZ')
        )
        this.box.quaternion.multiplyQuaternions(
          deltaRotationQuaternion,
          this.box.quaternion
        )
      }

      this.previousMousePosition = {
        x: e.offsetX,
        y: e.offsetY
      }
    })

    document.addEventListener('mouseup', () => {
      const {minute, tenSecond, singleSecond} = this.state
      this.isDragging = false
      if (
        this.module2.children.filter(a => a.name.startsWith('Circle'))[0]
          .position.x < 0.4
      ) {
        this.module2.children
          .filter(a => a.name.startsWith('Circle'))
          .map(b => {
            b.position.x += 0.18
          })
      }
      if (this.intersects[0].object.name.startsWith('Circle')) {
        if (minute === 4 || tenSecond === 4 || singleSecond === 4) {
          this.handlePass('module2')
          console.log('HAAA')
        } else {
          console.log('NAHHHHH')
        }
      }
    })

    document.addEventListener(
      'mousedown',
      e => {
        this.onDocumentMouseDown(e)
      },
      false
    )

    this.projector = new THREE.Projector()
    this.start()
    this.handleCountStart()
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.minute !== nextState.minute ||
      this.state.tenSecond !== nextState.tenSecond ||
      this.state.singleSecond !== nextState.singleSecond
    )
      return false
    return true
  }

  componentDidUpdate(prevProps, prevState) {
    // check game status;on success or failure, display banner & redirect w/ transition to recap
    if (
      this.props.strikeCount === this.props.strikeTotal ||
      this.state.count === 0
    ) {
      // dispatch action to update game status to failed
    }
    // check if modulesPassed === moduleTotal
    // stop clock & dispatch action to store time in store
    // dispatch action to update game status to diffused
    if (prevProps.strikeCount !== this.props.strikeCount) {
      const count = this.props.strikeCount
      const Strike = this.clock.children.find(
        child => child.name === `Strike${count}`
      )
      Strike.visible = true
    }
    if (prevState.count !== this.state.count) {
      this.calcClock(prevState)
    }
  }

  componentWillUnmount() {
    this.stop()
    this.mount.removeChild(this.renderer.domElement)
  }

  onDocumentMouseDown = e => {
    // the following line would stop any other event handler from firing
    // (such as the mouse's TrackballControls)
    // event.preventDefault();

    // update the mouse variable
    this.mouse.x = event.clientX / window.innerWidth * 2 - 1
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    // find intersections
    // create a Ray with origin at the mouse position
    //   and direction into the scene (camera direction)
    let vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 1)
    this.projector.unprojectVector(vector, this.camera)
    let ray = new THREE.Raycaster(
      this.camera.position,
      vector.sub(this.camera.position).normalize()
    )
    // create an array containing all objects in the scene with which the ray intersects
    this.intersects = ray.intersectObjects(this.targetList)
    // if there is one (or more) intersections
    if (this.intersects.length > 0) {
      let itemClicked = this.intersects[0].object
      if (this.targetList.includes(itemClicked)) {
        let {name} = itemClicked
        if (name.startsWith('Wire')) {
          this.handleSOW(itemClicked)
        } else if (name.startsWith('Circle')) {
          this.module2.children
            .filter(child => child.name.startsWith('Circle'))
            .forEach(child => {
              child.position.x -= 0.18
            })
        }
      }
    }
  }

  handleCountStart = () => {
    this.timer = setInterval(() => {
      const newCount = this.state.count - 1
      this.setState({count: newCount >= 0 ? newCount : 0})
    }, 1000)
  }

  start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate)
    }
  }

  stop = () => {
    cancelAnimationFrame(this.animate)
  }

  onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  animate = () => {
    this.renderer.render(this.scene, this.camera)
    this.frameId = requestAnimationFrame(this.animate)
  }

  calcClock = state => {
    const {count} = this.state
    const minute = Math.floor(count / 60)
    const seconds = count % 60
    const tenSecond = Math.floor((seconds % 60) / 10)
    const singleSecond = seconds % 10
    if (state.minute !== minute) {
      this.setState({minute})
      this.setClock('1', minute)
    }
    if (state.tenSecond !== tenSecond) {
      this.setState({tenSecond})
      this.setClock('2', tenSecond)
    }
    if (state.singleSecond !== singleSecond) {
      this.setState({singleSecond})
      this.setClock('3', singleSecond)
    }
  }

  calcInitialClock = () => {
    const {count, singleSecond} = this.state
    const minute = Math.floor(count / 60)
    const seconds = count % 60
    const tenSecond = Math.floor((seconds % 60) / 10)
    this.setClock('1', minute)
    this.setClock('2', tenSecond)
    this.setClock('3', singleSecond)
  }

  setClock = (position, time) => {
    this.clock.children[6].children
      .filter(child => child.name.startsWith(`D${position}`))
      .sort((a, b) => sortByKey(a, b, 'name'))
      .forEach((mark, index) => {
        mark.visible = clockCases[String(time)][index]
      })
  }

  handleSOW = wire => {
    if (wire.userData.correct === true) {
      this.props.passModule('SubjectOfWires')
      this.handlePass('module1')
    } else {
      this.props.setStrike()
    }
    this.module1.remove(wire)
    this.removeTarget(wire)
  }

  handlePass = moduleName => {
    const glow = this[moduleName].children.find(child => child.name === 'glow')
    const LED = this[moduleName].children.find(child => child.name === 'LED')
    glow.visible = true
    LED.material = util.LEDMaterialON
  }

  removeTarget = target => {
    this.targetList = this.targetList.filter(item => item !== target)
  }

  render() {
    // if (!this.props.gameStarted) return <Redirect to="/new-game" />
    return (
      <div
        className="refac-bomb"
        ref={mount => {
          this.mount = mount
        }}
      />
    )
  }
}

const mapState = ({game}) => ({...game})

const mapProps = dispatch => ({
  setStrike: () => dispatch(setStrike()),
  passModule: moduleName => dispatch(passModule(moduleName))
})

export default connect(mapState, mapProps)(RefacBomb)
