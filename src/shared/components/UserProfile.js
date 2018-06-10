import React, {
    Component
  } from 'react'
  import { Modal, Card, Icon,Avatar } from 'antd'
  const { Meta } = Card
  
  class UserProfile extends Component {
    /**
     * For the state we need an to know if the modal is open, and if the post has already been voted.
     * @returns {Object} - This returns the initial state for react.
     */
    state = { // eslint-disable-line
    }
  
    /**
     * Closes info modal.
     */
    
  
    /**
     * Votes the post if not already voted.
     */
    
  
    /**
     * This renders the component onto the DOM.
     */
    render () {
        let desc = "Steem Balance : "+this.props.user.balance+"\n SBD Balance : "+this.props.user.sbd_balance ;
      return (
        <div key={`/@${this.props.user.name}`}>
          <Card
            hoverable
            style={{ width: 300, margin: '20px auto' }}
            cover={<img src={JSON.parse(this.props.user.json_metadata).profile.cover_image} />}
            >
            <Meta
              title={this.props.user.name}
              description={desc}
              avatar={<Avatar src={JSON.parse(this.props.user.json_metadata).profile.profile_image}/>}
            />
          </Card>
        </div>
      )
    }
  }
  
  export default UserProfile
  