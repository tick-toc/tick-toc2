import React, {Fragment} from 'react'
import {
  Grid,
  Divider,
  Image,
  Segment,
  Form,
  Button,
  Header,
  Container
} from 'semantic-ui-react'

class ChatApp extends React.Component {
  constructor(props) {
    super(props)
    this.handleLoad = this.handleLoad.bind(this)
  }
  componentDidMount() {
    window.addEventListener('load', this.handleLoad)
  }

  componentWillUnmount() {
    window.removeEventListener('load', this.handleLoad)
  }

  comnponWillUpdate() {}

  handleLoad() {}

  render() {
    const red = 'red'
    return (
      <Container>
        <Header>Simple WebRTC Messenger</Header>
        <Divider />
        <Grid columns={10} relaxed="very" stackable>
          <Segment>
            <Form>
              <Form.Field>
                <label>User Name</label>
                <input
                  type="text"
                  placeholder="Enter user name"
                  id="username"
                  name="username"
                />
              </Form.Field>
              <Form.Field>
                <label>Room</label>
                <input
                  type="text"
                  placeholder="Enter room name"
                  id="roomName"
                  name="roomName"
                />
              </Form.Field>

              <Button content="Login" primary />
            </Form>
          </Segment>
        </Grid>
      </Container>
    )
  }
}

export default ChatApp
