PostList = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const handle = Meteor.subscribe('posts');
    const data = {};
    if(handle.ready()) {
      data.posts = Posts.find({}, {sort: {_id: 1}}).fetch();
    }

    return data;
  },
  getList() {
    return (
    <ul>
      {this.data.posts.map(task => {
        const path = Router.path('main');
        return (
        <li className="postbox" key={task._id}>

          <div>
            <a href={path}>
            <div className="box">
              <div className="price">test</div>
            </div>
            </a>
            <div className="title">
              <a href={path}>{task.title}</a>
            </div>
          </div>

        </li>
        );
      })}
    </ul>
   );
  },
  render() {
    return <div>
      {(this.data.posts)? this.getList() : "loading..."}
    </div>;
  }
});
