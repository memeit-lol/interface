import React, {
  Component,
  PropTypes
} from 'react';
import { Modal, Card, Icon } from 'antd';
const { Meta } = Card;

class PostPreview extends Component {
  /**
   * For the state we need an to know if the modal is open, and if the post has already been voted.
   * @returns {Object} - This returns the initial state for react.
   */
  state = {
    visible: false,
    voted: false
  }

  /**
   * Closes info modal.
   */
  handleCancel() {
    this.setState({ visible: false });
  }

  /**
   * Votes the post if not already voted.
   */
  vote() {
    if (!this.state.voted) {
      this.props.vote()
      this.setState({voted: true})
    }
  }

  /**
   * This renders the component onto the DOM.
   */
  render() {
    let percentage = 0;
    this.props.post.votes.forEach(function (vote) {
      percentage += vote.approved
    })
    percentage /= this.props.post.votes.length;
    percentage *= 100;
    let date = new Date(this.props.post.time);
    return (
      <div key={`/@${this.props.post.author}/${this.props.post.title}`}>
        <Card
          hoverable
          style={{ width: 300, margin: '20px auto' }}
          cover={<img src={this.props.post.img} onClick={() => {this.props.change()}} />}
          actions={[<Icon type="up-circle-o" onClick={() => {this.vote()}} />, <Icon type="info" onClick={() => this.setState({visible: true})} />, <Icon type="edit" />]}
        >
          <Meta
            title={this.props.post.title}
            description={`@${this.props.post.author}`}
            onClick={() => {this.props.change()}}
          />
        </Card>
        <Modal
          visible={this.state.visible}
          title={`${this.props.post.title} by @${this.props.post.author}`}
          onCancel={this.handleCancel.bind(this)}
          footer={null}
        >
          <p>ModScore: {this.props.post.score}</p>
          <p>ModPercentage: {percentage.toFixed()}%</p>
          <p>Date: {`${date.getHours() > 12 ? date.getHours() - 12 : date.getHours() }:${date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()}${date.getHours() > 12 ? 'PM' : 'AM' } ${date.toDateString()}`}</p>
        </Modal>
      </div>
    );
  }
}

export default PostPreview;
