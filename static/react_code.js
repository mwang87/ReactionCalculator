var HelloWorld = React.createClass({
  render: function() {
    return (
      <p>
        Hello, <input type="text" placeholder="Your name here" />!
        It is {this.props.date.toTimeString()}
      </p>
    );
  }
});


var reactant_list = new Array();

function init(reactant_list){
    var window_hash_string = window.location.hash
    if(window_hash_string.length > 0){
        reactant_list = JSON.parse(window_hash_string.slice(1))
    }
    else{
        var new_reactant = new Object();
        reactant_list.push(new_reactant)
    }

    ReactDOM.render(
      <HelloWorld date={new Date()} />,
      document.getElementById('reactants')
    );
    //render_reactants(reactant_list, "reactants")
}

init(reactant_list)
