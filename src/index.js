import React from "react";
import ReactDOM from "react-dom";
import "./styles.css";
import { db } from "./utils/firebase";

function App() {
  let [todos, setTodos] = React.useState([]);
  let [newTxt, setNewTxt] = React.useState([]);

  React.useEffect(function() {
    async function loadTodos() {
      let data = await db.collection("todos").get();
      setTodos(data.docs);
    }
    loadTodos();
  }, []);

  function deleteTodo(id) {
    db.collection("todos")
      .doc(id)
      .delete();
    let newAr = todos.filter(v => v.id !== id);
    setTodos(newAr);
  }

  async function addTodo() {
    let obj = { txt: newTxt, author: "nikolaj kim" };
    let docref = await db.collection("todos").add(obj);
    let doc = await db
      .collection("todos")
      .doc(docref.id)
      .get();
    setTodos([...todos, doc]);
  }

  function onSubmit(event) {
    event.preventDefault();
    addTodo();
  }

  return (
    <div>
      {todos.map(v => (
        <button
          key={v.id}
          onClick={function() {
            deleteTodo(v.id);
          }}
        >
          {v.data().author} - {v.data().txt}
        </button>
      ))}
      <hr />
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={newTxt}
          onChange={event => setNewTxt(event.target.value)}
        />

        <button>ADD</button>
      </form>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
