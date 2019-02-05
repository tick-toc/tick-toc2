import React, {Fragment} from 'react'
import {
  Grid,
  Divider,
  Image,
  Segment,
  Form,
  Button,
  Header
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
      <Fragment>
        <Header>Simple WebRTC Messenger</Header>
        <Divider />
        <Grid columns={10} relaxed="very" stackable>
          <Grid.Column>
            <Form>
              <Form.Input
                icon="user"
                iconPosition="left"
                label="Username"
                placeholder="Username"
              />
              <Form.Input
                icon="lock"
                iconPosition="left"
                label="Password"
                type="password"
              />

              <Button content="Login" primary />
            </Form>
          </Grid.Column>
        </Grid>
      </Fragment>
    )
  }
}

export default ChatApp
