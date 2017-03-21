var React = require('react');
var ReactDOM = require('react-dom');

class RecipeBox extends React.Component {
  constructor(props) {
    super(props);
    
    var localState = {
      recipes: [
      {'title': 'Chicken Salad',
       'ingredients': ['Grilled chicken', 'Iceberg lettuce', 'Caesar dressing'],
       'expanded': false},
      {'title': 'Apple Pie',
      'ingredients': ['Apples', 'Sugar', 'Pie crust', 'Ice cream'],
      'expanded': false},
      {'title': 'Lamb Burger',
      'ingredients': ['Lamb patty', 'Whole grain bun', 'Pickle'],
      'expanded': false}],
    };

    if(localStorage.recipebox) {
      this.state = JSON.parse(localStorage.getItem('recipebox'));
    }
    else {
      this.state = localState;
    }

    this.handleExpandClick = this.handleExpandClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
    
  }
  componentDidUpdate() {
    localStorage.setItem('recipebox', JSON.stringify(this.state));
  }
  handleExpandClick(index, event) {
    var stateArr = this.state.recipes.slice();
    stateArr[index].expanded = !this.state.recipes[index].expanded;
    
    this.setState({
      recipes: stateArr
    });
  }

  handleDeleteClick(index) {
    var stateArr = this.state.recipes.slice();
    stateArr.splice(index, 1);
    
    this.setState({
      recipes: stateArr
    });
  }
  handleEditClick(index) {
    var editNameId = 'editNameInput'+index;
    var editIngredId = 'editIngredientsInput'+index;
    
    var stateArr = this.state.recipes.slice();
    var editedName = document.getElementById(editNameId).value;
    var editedIngredients = document.getElementById(editIngredId).value.split(',');
    stateArr[index].title = editedName;
    stateArr[index].ingredients = editedIngredients;
    
    this.setState({
      recipes: stateArr
    });

  }
  handleSubmitRecipe(e) {
    var recipeName = document.getElementById('addNameInput').value;
    var ingredientsArr = document.getElementById('addIngredientsInput').value.split(',');
   
    var recipeObj = {
      'title': recipeName,
      'ingredients': ingredientsArr,
      'expanded': false
    };
    var stateArr = this.state.recipes.slice();
    stateArr.push(recipeObj);
    
    document.getElementById('addNameInput').value = '';
    document.getElementById('addIngredientsInput').value = '';
    
    this.setState({
      recipes: stateArr
    });

  }
  
  render() {
    var recipeList = this.state.recipes.map(function(recipe, index) {
      return <RecipeTitle
               key={index}                
               recipeName={recipe.title}
               recipeIngredients={recipe.ingredients}
               expanded={recipe.expanded}
               onClick={this.handleExpandClick.bind(this, index)} 
               onDelete={this.handleDeleteClick.bind(this, index)}
               onEditSubmit={this.handleEditClick.bind(this, index)}
               indexVar={index} />
    }, this);

    return (
      <div id = 'recipebox'>
        {recipeList}
        <AddRecipeButton />
        <AddRecipeModal onSubmit={this.handleSubmitRecipe.bind(this)} />
        
      </div>
    );
  }
  
}
class RecipeTitle extends React.Component {
  constructor(props) {
    super(props);    
  }

  render() {
    return (
    <div>
      <div id='recipeTitle' onClick={this.props.onClick} >
        <h3>{this.props.recipeName}</h3>
      </div>
      <ExpandIngredients
        recipeName={this.props.recipeName}
        recipeIngredients={this.props.recipeIngredients}
        expanded={this.props.expanded}
        onDelete={this.props.onDelete}
        indexVar={this.props.indexVar} />
      <EditRecipeModal onSubmit={this.props.onEditSubmit} editName={this.props.recipeName} editIngredients={this.props.recipeIngredients} indexVar={this.props.indexVar} />  
    </div>
    );
  }
}
function ExpandIngredients(props) {
  if(props.expanded) {
    var ingredientsLoop = props.recipeIngredients.map(function(ingredient, i) {
      return <li key={i}>{ingredient}</li>;
    });
  }
  else {
    return null;
  }
  return(
      <div id='expandedIngredients'>
        <h4>Ingredients:</h4>
        <ul id='expandedUL'>
          {ingredientsLoop}
        </ul>
        <EditRecipeButton recipeIngredients={props.recipeIngredients} recipeName={props.recipeName} indexVar={props.indexVar} />
        <DeleteRecipeButton onClick={props.onDelete} />
      </div>          
  );
}
function AddRecipeButton(props) {
  return (
    <button type='button' className='btn btn-success btn-lg' data-toggle='modal' data-target='#AddRecipeModal'>Add Recipe</button>
  );
}
function DeleteRecipeButton(props) {
  return (
    <button type='button' className='btn btn-danger' onClick={props.onClick}>Delete</button>
  );
}
function EditRecipeButton(props) {
  var targetStr = '#EditRecipeModal'+props.indexVar;
  return (
    <button type='button' className='btn btn-primary' data-toggle='modal' data-target={targetStr}>Edit</button>
  );
}//d
function AddRecipeModal(props) {
  return (
    <div className='modal fade' id='AddRecipeModal'>
      <div className='modal-content'>
        <div className='modal-header'>
          <button type='button' className='close' data-dismiss='modal'>&times;</button>
          <h3>Add a Recipe</h3>
        </div>
        <div className='modal-body'>
          <h3>Recipe Name:</h3>
          <input type='text' id='addNameInput' size='35' placeholder='Ex: Chicken Parmesan'/>
          <h3>Ingredients:</h3>
          <textarea id='addIngredientsInput' placeholder='Separate each ingredient with a comma' cols='37' rows='2'/>
        </div>
        <div className='modal-footer'>
          <button className='btn btn-success' onClick={props.onSubmit} data-dismiss='modal'>Add Recipe</button>
        </div>
      </div>
    </div>
  );
}
function EditRecipeModal(props) {
  var idStr = 'EditRecipeModal'+props.indexVar;
  var nameId = 'editNameInput'+props.indexVar;
  var ingredId = 'editIngredientsInput'+props.indexVar;
  
  return (
    <div className='modal fade' id={idStr}>
      <div className='modal-content'>
        <div className='modal-header'>
          <button type='button' className='close' data-dismiss='modal'>&times;</button>
          <h3>Edit Recipe</h3>
        </div>
        <div className='modal-body'>
          <h3>Recipe Name:</h3>
          <input type='text' id={nameId} size='35' defaultValue={props.editName} />
          <h3>Ingredients:</h3>
          <textarea id={ingredId} placeholder='Separate each ingredient with a comma' defaultValue={props.editIngredients} cols='37' rows='2'/>
        </div>
        <div className='modal-footer'>
          <button className='btn btn-success' onClick={props.onSubmit} data-dismiss='modal'>Save Recipe</button>
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(
  <RecipeBox />,
  document.getElementById('app')
);